// node scripts/publish/render-boards.mjs <boardsDir> <outDir> <name...> — рендер Behance-бордов (board HTML → PNG @2x).
// Высоты берёт из <boardsDir>/manifest.json; запускать отсюда, где стоит playwright-core.
import { chromium } from 'playwright-core'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
const [dir, out, ...names] = process.argv.slice(2)
const manifest = Object.fromEntries(JSON.parse(readFileSync(resolve(dir, 'manifest.json'), 'utf8')))
const browser = await chromium.launch({ channel: 'chrome', headless: true })
for (const n of names) {
  const h = manifest[n]
  const page = await browser.newPage({ viewport: { width: 1600, height: h }, deviceScaleFactor: 2 })
  await page.goto('file://' + resolve(dir, n + '.html'), { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(400)
  const el = await page.$('section.board')
  await el.screenshot({ path: resolve(out, n + '.png') })
  console.log('ok', n, h); await page.close()
}
await browser.close()
