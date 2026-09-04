// Замер живого движка, а не снимка. `chrome --headless --window-size` задаёт
// размер СНИМКА, а не layout viewport: страница верстается шире, снимок её
// просто обрезает, и обрезанный текст читается как переполнение, которого нет.
//
// Выходит с кодом 1, если хоть на одной ширине есть переполнение или зона
// нажатия меньше 40×40.
import { chromium } from 'playwright-core'

const BASE = process.env.BASE_URL ?? 'http://localhost:4173'
const ROUTES = ['/', '/catalogue', '/product/cream', '/configurator?material=suede', '/cart', '/case']
const WIDTHS = [1920, 768, 375]

const browser = await chromium.launch({ channel: 'chrome' })
const results = []

for (const width of WIDTHS) {
  const page = await browser.newPage({ viewport: { width, height: 900 } })
  for (const route of ROUTES) {
    await page.goto(BASE + route, { waitUntil: 'networkidle' })

    // Сначала мерим ОКРУЖЕНИЕ: вывод о странице недействителен, если её не
    // композитят — в фоне тротлится rAF и не инициализируются анимации.
    const env = await page.evaluate(() => new Promise(r => {
      let n = 0
      const t0 = performance.now()
      const tick = () => {
        n++
        performance.now() - t0 < 1000
          ? requestAnimationFrame(tick)
          : r({ fps: n, vis: document.visibilityState })
      }
      requestAnimationFrame(tick)
    }))
    if (env.fps < 30) {
      throw new Error(`${route} @ ${width}: fps ${env.fps}, vis ${env.vis} — страница не композитится, замер недействителен`)
    }

    const m = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth,
      cw: document.documentElement.clientWidth,
      over: [...document.querySelectorAll('*')]
        .filter(el => el.getBoundingClientRect().right > innerWidth + 1)
        .slice(0, 5)
        .map(el => `${el.tagName}.${String(el.className).slice(0, 50)}`),
      small: [...document.querySelectorAll('a,button,input,[role="radio"],[role="checkbox"],[role="switch"]')]
        .map(el => ({ el, r: el.getBoundingClientRect() }))
        .filter(({ r }) => r.width > 0 && r.height > 0 && (r.height < 40 || r.width < 40))
        .slice(0, 5)
        .map(({ el, r }) => `${el.tagName}[${(el.textContent ?? '').trim().slice(0, 16)}] ${Math.round(r.width)}×${Math.round(r.height)}`),
    }))
    results.push({ width, route, ...m, fps: env.fps })
  }
  await page.close()
}
await browser.close()

let failed = false
for (const r of results) {
  const overflow = r.sw > r.cw
  if (overflow || r.small.length) failed = true
  const marks = [
    overflow ? `ПЕРЕПОЛНЕНИЕ ${r.sw}>${r.cw}: ${r.over.join(', ')}` : '',
    r.small.length ? `МЕЛКИЕ ЦЕЛИ: ${r.small.join(' | ')}` : '',
  ].filter(Boolean).join('  ')
  console.log(`${String(r.width).padStart(4)}  ${r.route.padEnd(32)} ${marks || 'ок'}`)
}
console.log(failed ? '\nПРОВАЛ' : '\nЧисто: переполнения нет, зоны нажатия не меньше 40×40.')
process.exit(failed ? 1 : 0)
