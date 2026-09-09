// Сцена героя проверяется по кадрам, а не по снимку: один кадр схлопывает ось
// времени, и в нём не видно ни пауз, ни направления. Замеряем непрозрачность
// каждого такта и требуем два свойства: движение только вперёд (иначе элемент
// сперва проигрывает переход в обратную сторону, ставя себя в исходное
// состояние) и полное отсутствие сцены при prefers-reduced-motion.
//
// BASE_URL по умолчанию — дев-сервер; для сборки передайте свой.
import { chromium } from 'playwright-core'
const browser = await chromium.launch({ channel: 'chrome' })

async function probe(reduced) {
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    reducedMotion: reduced ? 'reduce' : 'no-preference',
  })
  const page = await ctx.newPage()
  await page.goto((process.env.BASE_URL ?? 'http://localhost:5173') + '/', { waitUntil: 'domcontentloaded' })
  const series = await page.evaluate(() => new Promise(resolve => {
    const t0 = performance.now()
    const rows = []
    const pick = () => {
      const s = document.querySelector('section')
      if (!s) return null
      const h1 = s.querySelector('h1')
      const lede = s.querySelector('h1 ~ div')
      const obj = s.querySelectorAll('h1 ~ div')[1]
      const strip = s.querySelector('ul')
      const o = el => (el ? Number(getComputedStyle(el).opacity).toFixed(2) : 'x')
      return {
        t: Math.round(performance.now() - t0),
        h1: o(h1), lede: o(lede), obj: o(obj), strip: o(strip),
        n: strip ? (strip.querySelector('span')?.textContent ?? '') : '',
      }
    }
    const tick = () => {
      const r = pick()
      if (r) rows.push(r)
      if (performance.now() - t0 < 2600) setTimeout(tick, 60)
      else resolve(rows)
    }
    tick()
  }))
  await ctx.close()
  return series
}

for (const reduced of [false, true]) {
  const rows = await probe(reduced)
  const firstVisible = key => {
    const hit = rows.find(r => Number(r[key]) > 0.02)
    return hit ? hit.t : null
  }
  const monotonic = key => {
    const v = rows.map(r => Number(r[key]))
    return v.every((x, i) => i === 0 || x >= v[i - 1] - 0.02)
  }
  console.log(`\n=== prefers-reduced-motion: ${reduced ? 'reduce' : 'no-preference'} ===`)
  for (const k of ['h1', 'lede', 'obj', 'strip']) {
    console.log(`${k.padEnd(6)} первый видимый кадр: ${String(firstVisible(k)).padStart(5)}ms   только вперёд: ${monotonic(k)}`)
  }
  console.log('счётчик, первое значение:', rows[0]?.n, '→ последнее:', rows[rows.length - 1]?.n)
}
await browser.close()
