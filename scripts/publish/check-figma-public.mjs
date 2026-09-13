// node scripts/publish/check-figma-public.mjs <shot.png> — открыт ли Figma-файл кейса анониму.
// Headful Chrome со свежим профилем: headless Figma режет CloudFront-403 ещё до логина.
// Открыт → status 200 и title файла; закрыт → 403 и «Want to check out this file? Sign up or Log in».
import { chromium } from 'playwright-core'
const browser = await chromium.launch({ channel: 'chrome', headless: false, args: ['--window-position=2000,2000'] })
const ctx = await browser.newContext()   // свежий контекст: без cookies, как аноним
const page = await ctx.newPage()
const resp = await page.goto('https://www.figma.com/design/ztM2VHMovlutEykLNGPLVq', { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForTimeout(12000)
const title = await page.title()
const text = await page.evaluate(() => document.body.innerText.slice(0, 1500))
console.log(JSON.stringify({ status: resp.status(), url: page.url(), title, hasLast: /LAST/.test(text), text: text.replace(/\s+/g, ' ').slice(0, 400) }, null, 1))
await page.screenshot({ path: process.argv[2] })
await browser.close()
