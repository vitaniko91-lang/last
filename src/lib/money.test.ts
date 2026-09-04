import { describe, it, expect } from 'vitest'
import { formatRub } from './money'

describe('formatRub', () => {
  it('разделяет тысячи и ставит знак валюты', () => {
    expect(formatRub(1490)).toMatch(/^1.490 ₽$/)
    expect(formatRub(2300)).toMatch(/^2.300 ₽$/)
  })
  it('не ставит разделитель до тысячи', () => {
    expect(formatRub(990)).toBe('990 ₽')
  })
})
