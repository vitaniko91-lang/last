import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, it, expect } from 'vitest'

/**
 * Пол по контрасту читается из СКОМПИЛИРОВАННОГО tokens.css, а не из
 * tokens.json: проверяется то, что реально попадает в браузер.
 * Токен, проверенный в вакууме, не проверен — но пол закрепляется кодом,
 * а не таблицей в спеке.
 */
const css = readFileSync(resolve(__dirname, 'tokens.css'), 'utf8')

function token(name: string): string {
  const m = css.match(new RegExp(`--color-${name}:\\s*(#[0-9A-Fa-f]{6})`))
  if (!m) throw new Error(`нет роли --color-${name} в tokens.css`)
  return m[1]
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

export function contrast(fg: string, bg: string): number {
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((a, b) => b - a)
  return (hi + 0.05) / (lo + 0.05)
}

// [текст, фон, минимум]. 4.5 — AA для текста; 3 — для крупного текста и UI.
const PAIRS: Array<[string, string, number]> = [
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
