import { describe, it, expect } from 'vitest'
import { formatUah } from './money'

describe('formatUah', () => {
  it('разделяет тысячи и ставит знак валюты', () => {
    expect(formatUah(1490)).toMatch(/^1.490 ₴$/)
    expect(formatUah(2300)).toMatch(/^2.300 ₴$/)
  })
  it('не ставит разделитель до тысячи', () => {
    expect(formatUah(990)).toBe('990 ₴')
  })
})
