import { chromium } from 'playwright-core'
const out = process.argv[2]
const browser = await chromium.launch({ channel: 'chrome' })
const shots = [
  ['home', '/', 1440],
  ['configurator', '/configurator?material=suede', 1440],
  ['product', '/product/cream', 1440],
  ['catalogue', '/catalogue', 1440],
  ['case', '/case', 1440],
  ['m-home', '/', 390],
  ['m-configurator', '/configurator?material=suede', 390],
]
for (const [name, route, width] of shots) {
  const page = await browser.newPage({ viewport: { width, height: 1000 }, deviceScaleFactor: 1 })
  await page.goto('http://localhost:4173' + route, { waitUntil: 'networkidle' })
  // конфигуратор: доводим до состояния результата, иначе снимок покажет шаг 1
  if (name.includes('configurator')) {
    await page.getByRole('checkbox', { name: /Почистить/ }).click()
    await page.getByRole('checkbox', { name: /Защитить/ }).click()
    await page.getByRole('checkbox', { name: /Вернуть цвет/ }).click()
    await page.getByRole('radio', { name: 'Каждый день' }).click()
    await page.waitForTimeout(300)
  }
  await page.screenshot({ path: `${out}/${name}.png`, fullPage: true })
  await page.close()
}
await browser.close()
console.log('done')
