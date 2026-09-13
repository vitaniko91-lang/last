// node scripts/publish/capture-configurator.mjs <out.png> — конфигуратор в состоянии 5 (замша · чистка + защита · каждый день)
// полной страницей при 1600px, reduced-motion; исходник для борда 03-answer в docs/portfolio/last/behance.
import { chromium } from 'playwright-core'
const out = process.argv[2]
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 })
await page.emulateMedia({ reducedMotion: 'reduce' })
await page.goto('https://last-ten-lyart.vercel.app/configurator?material=suede', { waitUntil: 'networkidle' })
await page.getByRole('checkbox', { name: /Почистить/ }).click()
await page.getByRole('checkbox', { name: /Защитить/ }).click()
await page.getByRole('radio', { name: 'Каждый день' }).click()
await page.waitForTimeout(1000)
const txt = await page.evaluate(() => document.body.innerText)
console.log('total:', (txt.match(/Итого[\s\S]{0,30}/)||[''])[0].replace(/\s+/g,' '), '| rub:', txt.includes('₽'))
await page.screenshot({ path: out, fullPage: true })
await browser.close()
