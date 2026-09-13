import { describe, it, expect } from 'vitest'
import { kitTotal } from './pricing'
import { resolve } from '../kit/resolve'

describe('kitTotal', () => {
  it('итог набора — сумма цен позиций; тот же набор, что на экране 08', () => {
    const kit = resolve({ material: 'suede', tasks: ['clean', 'protect', 'restore'], frequency: 'daily' })
    expect(kit.items.map(i => i.sku)).toEqual(['spray-suede', 'kit-suede'])
    expect(kitTotal(kit.items)).toBe(1880)
  })
  it('пустой набор стоит ноль, а не падает', () => {
    expect(kitTotal([])).toBe(0)
  })
})
