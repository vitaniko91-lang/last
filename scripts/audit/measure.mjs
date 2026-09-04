// cases/last/scripts/audit/measure.mjs
//
// Снимает автоматические метрики четырёх магазинов на трёх ширинах.
// Системный Chrome через playwright-core — браузер не скачивается.
// Запускать из корня cases/last:  npm run audit:measure
import { chromium } from 'playwright-core'
import { mkdir, writeFile, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { isLayoutMeasurable } from './lib/env.mjs'
import { overflowReport, tapTargetReport } from './lib/metrics.mjs'

const OUT = resolve(process.env.OUT ?? '../../docs/portfolio/last/audit')
const WIDTHS = [1920, 768, 375]
const CHROME = process.env.CHROME
  ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

// Частота кадров пишется в файл как диагностика СТЕНДА и ни на что не влияет:
// замер 2026-09-04 дал 9, 12 и 34 fps на одной странице в трёх режимах запуска
// при одинаковом scrollWidth. Вердикт о вёрстке выносит isLayoutMeasurable.
const probeEnv = () =>
  new Promise(r => {
    let n = 0
    const t0 = performance.now()
    const tick = () => {
      n++
      if (performance.now() - t0 < 1000) requestAnimationFrame(tick)
      else r({ fps: n, visibilityState: document.visibilityState, hasFocus: document.hasFocus() })
    }
    requestAnimationFrame(tick)
  })

const probeLayout = () => {
  const de = document.documentElement
  const cls = el => (typeof el.className === 'string' ? el.className : (el.className?.baseVal ?? ''))
  const offenders = [...document.querySelectorAll('*')]
    .filter(el => el.getBoundingClientRect().right > window.innerWidth + 1)
    .slice(0, 10)
    .map(el => `${el.tagName.toLowerCase()}.${String(cls(el)).split(' ')[0]}`)
  const targets = [...document.querySelectorAll('a, button, [role="button"], input, select')]
    .map(el => {
      const r = el.getBoundingClientRect()
      return { tag: el.tagName.toLowerCase(), width: r.width, height: r.height }
    })
    .filter(t => t.width > 0 && t.height > 0)
  return {
    scrollWidth: de.scrollWidth,
    clientWidth: de.clientWidth,
    innerWidth: window.innerWidth,
    bodyTextLength: (document.body.innerText || '').trim().length,
    url: location.href,
    visibilityState: document.visibilityState,
    offenders,
    targets,
  }
}

const all = JSON.parse(await readFile(new URL('./shops.json', import.meta.url), 'utf8'))
// ONLY=<id> прогоняет один магазин — для проверки самого скрипта.
const shops = process.env.ONLY ? all.filter(s => s.id === process.env.ONLY) : all
if (shops.length === 0) throw new Error(`ONLY=${process.env.ONLY} не совпал ни с одним магазином`)

await mkdir(`${OUT}/raw`, { recursive: true })
await mkdir(`${OUT}/shots`, { recursive: true })

const browser = await chromium.launch({ executablePath: CHROME, headless: true })

for (const shop of shops) {
  const result = { id: shop.id, name: shop.name, url: shop.url, measuredAt: new Date().toISOString(), byWidth: {} }

  for (const width of WIDTHS) {
    const page = await browser.newPage({ viewport: { width, height: 900 } })
    await page.goto(shop.url, { waitUntil: 'domcontentloaded', timeout: 60000 })
    await page.waitForTimeout(3500)

    const env = await page.evaluate(probeEnv)
    const raw = await page.evaluate(probeLayout)
    const gate = isLayoutMeasurable({
      visibilityState: raw.visibilityState,
      innerWidth: raw.innerWidth,
      expectedWidth: width,
      bodyTextLength: raw.bodyTextLength,
      url: raw.url,
    })

    if (!gate.ok) {
      console.error(`ГЕЙТ НЕ ПРОЙДЕН ${shop.id} @${width}: ${gate.blockers.join(', ')}`)
      result.byWidth[width] = { env, gate, aborted: true }
      await page.close()
      continue
    }

    result.byWidth[width] = {
      env,
      gate,
      aborted: false,
      overflow: overflowReport(raw),
      tapTargets: tapTargetReport(raw.targets),
    }

    await page.screenshot({
      path: `${OUT}/shots/${shop.id}-${width}.jpg`,
      type: 'jpeg',
      quality: 80,
      fullPage: false,
    })
    console.log(`${shop.id} @${width}: fps=${env.fps} текст=${raw.bodyTextLength} overflow=${result.byWidth[width].overflow.overflows} tapFails=${result.byWidth[width].tapTargets.failing.length}`)
    await page.close()
  }

  await writeFile(`${OUT}/raw/${shop.id}.json`, JSON.stringify(result, null, 2))
}

await browser.close()
console.log(`Готово. Сырые замеры: ${OUT}/raw`)
