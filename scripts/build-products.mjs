// Папка приёма → public/products/*.avif + манифест. Запуск: npm run products
//
// Вход: docs/portfolio/last/assets/products/map.tsv — строки `sku<TAB>имя файла`
// (файл лежит в inbox/ под ЛЮБЫМ именем: опознание — работа агента, не
// пользователя). Выход: квадрат по центру 600 и 1200, AVIF, и манифест
// src/generated/product-images.json, из которого компоненты узнают, что
// рендер есть. Сборка печатает покрытие поимённо.
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const SKUS = ['cream', 'balm', 'spray-smooth', 'spray-suede', 'kit-suede', 'brush-horsehair', 'shoe-trees', 'edge-dressing', 'polish-patent']

function findAssets() {
  let dir = here
  for (let i = 0; i < 8; i++) {
    const c = resolve(dir, 'docs/portfolio/last/assets/products')
    if (existsSync(c)) return c
    const up = dirname(dir); if (up === dir) break; dir = up
  }
  throw new Error('docs/portfolio/last/assets/products не найдена ни в одном родителе')
}
const ASSETS = findAssets()
const MAP = resolve(ASSETS, 'map.tsv')
const OUT = resolve(here, '../public/products')
const MANIFEST = resolve(here, '../src/generated/product-images.json')
mkdirSync(OUT, { recursive: true })

const map = existsSync(MAP)
  ? Object.fromEntries(readFileSync(MAP, 'utf8').split('\n').filter(l => l.trim() && !l.startsWith('#')).map(l => l.split('\t').map(s => s.trim())))
  : {}

const manifest = {}
for (const sku of SKUS) {
  const file = map[sku]
  if (!file) continue
  const src = resolve(ASSETS, 'inbox', file)
  if (!existsSync(src)) { console.warn(`  ${sku}: в map.tsv указан ${file}, но в inbox/ его нет`); continue }
  for (const size of [600, 1200]) {
    // Квадрат по центру: генератор отдаёт 2:3, предмет стоит в середине кадра.
    execFileSync('vips', ['thumbnail', src, `${resolve(OUT, `${sku}-${size}.avif`)}[Q=64,effort=6]`, String(size), '--height', String(size), '--crop', 'centre'])
  }
  manifest[sku] = { w: 1200, h: 1200 }
}
writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n')
const have = Object.keys(manifest), missing = SKUS.filter(s => !manifest[s])
console.log(`Рендеры SKU: ${have.length}/${SKUS.length}${missing.length ? ' · нет: ' + missing.join(', ') : ''}`)
