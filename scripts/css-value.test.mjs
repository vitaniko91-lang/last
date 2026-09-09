import { describe, expect, it } from 'vitest'
import { cssFontFamily } from './css-value.mjs'

/**
 * Имя семейства, в котором есть числовой токен, CSS без кавычек не принимает:
 * «4» — не идентификатор, объявление отбрасывается целиком, и текст молча
 * наследует шрифт предка. Именно так Source Serif 4 не доехал до прода.
 */
describe('cssFontFamily', () => {
  it('quotes a family whose name contains a numeric token', () => {
    expect(cssFontFamily(['Source Serif 4', 'Georgia', 'serif'])).toBe(
      '"Source Serif 4", Georgia, serif',
    )
  })

  it('leaves plain families and generic keywords unquoted', () => {
    expect(cssFontFamily(['Archivo', 'system-ui', 'sans-serif'])).toBe(
      'Archivo, system-ui, sans-serif',
    )
  })

  it('quotes a family with a space but no digits only when a part is not an identifier', () => {
    expect(cssFontFamily(['Times New Roman'])).toBe('Times New Roman')
    expect(cssFontFamily(['Helvetica 77 Bold'])).toBe('"Helvetica 77 Bold"')
  })

  it('quotes a family starting with a digit', () => {
    expect(cssFontFamily(['3270 Nerd Font', 'monospace'])).toBe('"3270 Nerd Font", monospace')
  })
})
