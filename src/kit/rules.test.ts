// cases/last/src/kit/rules.test.ts
import { describe, it, expect } from 'vitest'
import { skusFor, conflictFor, MATERIALS, TASKS } from './rules'

describe('skusFor', () => {
  it('замша и защита дают спрей для замши, а не для гладкой кожи', () => {
    expect(skusFor('suede', 'protect')).toEqual(['spray-suede'])
  })

  it('гладкая кожа и защита дают спрей для гладкой кожи', () => {
    expect(skusFor('smooth', 'protect')).toEqual(['spray-smooth'])
  })

  it('питание идёт с щёткой: средство надо чем-то растушевать', () => {
    expect(skusFor('smooth', 'nourish')).toEqual(['balm', 'brush-horsehair'])
  })

  it('конфликтная пара не даёт ни одного товара', () => {
    expect(skusFor('suede', 'restore')).toEqual([])
    expect(skusFor('suede', 'nourish')).toEqual([])
    expect(skusFor('oiled', 'restore')).toEqual([])
    expect(skusFor('patent', 'restore')).toEqual([])
    expect(skusFor('patent', 'nourish')).toEqual([])
    expect(skusFor('patent', 'protect')).toEqual([])
  })

  it('колодки и краска для уреза не попадают ни в одну пару', () => {
    const all = MATERIALS.flatMap(m => TASKS.flatMap(t => skusFor(m, t)))
    expect(all).not.toContain('shoe-trees')
    expect(all).not.toContain('edge-dressing')
  })

  it('покрыты все шестнадцать пар: либо товары, либо конфликт', () => {
    for (const m of MATERIALS) {
      for (const t of TASKS) {
        const covered = skusFor(m, t).length > 0 || conflictFor(m, t) !== null
        expect(covered, `${m}/${t}`).toBe(true)
      }
    }
  })

  it('у лака работает единственная задача — чистка', () => {
    expect(skusFor('patent', 'clean')).toEqual(['polish-patent'])
  })
})

describe('conflictFor', () => {
  it('объясняет причину без терминов и предлагает замену', () => {
    const c = conflictFor('suede', 'restore')
    expect(c).not.toBeNull()
    expect(c!.reason).toMatch(/ворс/)
    expect(c!.insteadSku).toBe('kit-suede')
  })

  it('на рабочей паре конфликта нет', () => {
    expect(conflictFor('smooth', 'protect')).toBeNull()
  })

  it('конфликтов ровно шесть', () => {
    const found = MATERIALS.flatMap(m => TASKS.map(t => conflictFor(m, t))).filter(Boolean)
    expect(found).toHaveLength(6)
  })

  it('лак нельзя ни кормить, ни красить, ни защищать — и каждый случай объяснён', () => {
    for (const task of ['nourish', 'restore', 'protect'] as const) {
      const c = conflictFor('patent', task)
      expect(c, task).not.toBeNull()
      expect(c!.reason.length, task).toBeGreaterThan(20)
      expect(c!.insteadSku, task).toBe('polish-patent')
    }
  })
})
