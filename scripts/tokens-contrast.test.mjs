// Пол по контрасту читается из СКОМПИЛИРОВАННОГО src/styles/tokens.css, а не
// из tokens.json: проверяется то, что реально попадает в браузер. Живёт в
// scripts/, как css-value.test.mjs: tsconfig приложения не знает node:fs,
// а `?raw`-импорт CSS под vitest отдаёт пустую строку.
// Токен, проверенный в вакууме, не проверен — но пол закрепляется кодом,
// а не таблицей в спеке.
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'

const here = dirname(fileURLToPath(import.meta.url))
const css = readFileSync(resolve(here, '../src/styles/tokens.css'), 'utf8')

function token(name) {
  const m = css.match(new RegExp(`--color-${name}:\\s*(#[0-9A-Fa-f]{6})`))
  if (!m) throw new Error(`нет роли --color-${name} в tokens.css`)
  return m[1]
}

function luminance(hex) {
  const channel = i => parseInt(hex.slice(i, i + 2), 16) / 255
  const lin = c => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return 0.2126 * lin(channel(1)) + 0.7152 * lin(channel(3)) + 0.0722 * lin(channel(5))
}

export function contrast(fg, bg) {
  const a = luminance(fg)
  const b = luminance(bg)
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
}

// [текст, фон, минимум]. 4.5 — AA для текста; 3 — для крупного текста и UI.
const PAIRS = [
  ['text-primary', 'ground', 4.5],
  ['text-secondary', 'ground', 4.5],
  ['text-primary', 'surface', 4.5],
  ['text-on-accent', 'accent-base', 4.5],
  ['text-on-inverse', 'inverse', 4.5],
  ['text-secondary-on-inverse', 'inverse', 4.5],
  ['accent-on-inverse', 'inverse', 4.5],
  ['semantic-warning', 'ground', 4.5],
  ['semantic-warning', 'surface', 4.5],
]

describe('tokens.css — контраст ролей', () => {
  it.each(PAIRS)('%s на %s ≥ %s:1', (fg, bg, min) => {
    expect(contrast(token(fg), token(bg))).toBeGreaterThanOrEqual(min)
  })

  it('accent.base как текст на inverse НЕ проходит — потому и нужна on-inverse', () => {
    expect(contrast(token('accent-base'), token('inverse'))).toBeLessThan(4.5)
  })
})
