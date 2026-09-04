// cases/last/src/kit/catalogue.test.ts
import { describe, it, expect } from 'vitest'
import { CATALOGUE, bySku } from './catalogue'

describe('CATALOGUE', () => {
  it('содержит ровно девять позиций с уникальными id', () => {
    expect(CATALOGUE).toHaveLength(9)
    expect(new Set(CATALOGUE.map(p => p.sku)).size).toBe(9)
  })

  it('у лакированной кожи есть своё средство', () => {
    const p = bySku('polish-patent')
    expect(p.consumable).toBe(true)
    expect(p.coverageMonths).toBeGreaterThan(0)
  })

  it('у расходника есть срок, у нерасходника его нет', () => {
    for (const p of CATALOGUE) {
      if (p.consumable) expect(p.coverageMonths, p.sku).toBeGreaterThan(0)
      else expect(p.coverageMonths, p.sku).toBeNull()
    }
  })

  it('оттенки заведены только у крема-реноватора', () => {
    const withShades = CATALOGUE.filter(p => p.shades !== null)
    expect(withShades.map(p => p.sku)).toEqual(['cream'])
    expect(withShades[0]!.shades).toHaveLength(12)
  })

  it('bySku находит позицию и падает на неизвестном ключе', () => {
    expect(bySku('balm').title).toMatch(/Бальзам/)
    // @ts-expect-error проверяем поведение в рантайме на невалидном ключе
    expect(() => bySku('nope')).toThrow(/nope/)
  })
})
