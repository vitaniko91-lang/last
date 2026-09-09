// tokens.json → tokens.css. Правится JSON, не CSS.
// Единственный источник истины по цвету, отступам и типографике живёт в
// docs/portfolio/last/design-system/tokens.json — там же, где спека системы.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { cssFontFamily } from './css-value.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const SRC = resolve(here, '../../../docs/portfolio/last/design-system/tokens.json')
const OUT = resolve(here, '../src/styles/tokens.css')

const tokens = JSON.parse(readFileSync(SRC, 'utf8'))

function walk(node, path, out, type) {
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith('$')) continue
    if (value && typeof value === 'object' && '$value' in value) {
      const kind = value.$type ?? type
      // fontFamily по DTCG — массив имён; кавычки ставит сериализатор, не автор JSON.
      const v = Array.isArray(value.$value)
        ? kind === 'fontFamily'
          ? cssFontFamily(value.$value)
          : value.$value.join(', ')
        : value.$value
      out.push([[...path, key].join('-'), v, value.$description ?? null])
    } else if (value && typeof value === 'object') {
      walk(value, [...path, key], out, value.$type ?? type)
    }
  }
}

const groups = [
  ['color', tokens.color],
  ['spacing', tokens.spacing],
  ['radius', tokens.radius],
  ['font-family', tokens.typography.family],
  ['font-weight', tokens.typography.weight],
  ['font-size', tokens.typography.size],
  ['line-height', tokens.typography.lineHeight],
  ['tracking', tokens.typography.tracking],
]

const lines = [
  '/* СГЕНЕРИРОВАНО scripts/build-tokens.mjs — руками не править.',
  '   Источник: docs/portfolio/last/design-system/tokens.json',
  '   Пересобрать: npm run tokens */',
  ':root {',
]
let count = 0
for (const [prefix, node] of groups) {
  const rows = []
  walk(node, [prefix], rows, node?.$type)
  lines.push('', `  /* ${prefix} */`)
  for (const [name, value, desc] of rows) {
    const note = desc ? ` /* ${desc.split('\n')[0]} */` : ''
    lines.push(`  --${name}: ${value};${note}`)
    count++
  }
}
lines.push('}', '')

mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(OUT, lines.join('\n'), 'utf8')
console.log(`tokens.css: ${count} переменных`)
