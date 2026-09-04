import { describe, it, expect } from 'vitest'
import { applicabilityFor } from './applicability'
import { CATALOGUE } from '../kit/catalogue'
import { MATERIALS, TASKS, conflictFor } from '../kit/rules'

describe('applicabilityFor', () => {
  it('для крема: подходит гладкая, не подходят три — с причинами про крем', () => {
    const a = applicabilityFor('cream')
    expect(a.fits).toEqual(['smooth'])
    expect(a.doesNotFit.map(x => x.material).sort()).toEqual(['oiled', 'patent', 'suede'])
    expect(a.doesNotFit.find(x => x.material === 'suede')?.reason).toContain('склеит ворс замши')
  })

  it('для бальзама причина про бальзам, а не про крем — тот же материал, другой виновник', () => {
    const a = applicabilityFor('balm')
    expect(a.doesNotFit.find(x => x.material === 'suede')?.reason).toContain('не питают бальзамом')
  })

  it('щётке нечего объяснять: её отсутствие у замши — не конфликт', () => {
    const a = applicabilityFor('brush-horsehair')
    expect(a.fits).toEqual(['smooth', 'oiled'])
    expect(a.doesNotFit).toEqual([])
  })

  it('каждая показанная причина непустая', () => {
    for (const p of CATALOGUE) {
      for (const x of applicabilityFor(p.sku).doesNotFit) {
        expect(x.reason.length, `${p.sku}/${x.material}`).toBeGreaterThan(20)
      }
    }
  })

  it('у каждого конфликта aboutSku есть в каталоге — иначе причину некому показать', () => {
    const skus = new Set(CATALOGUE.map(p => p.sku))
    for (const m of MATERIALS) {
      for (const t of TASKS) {
        const c = conflictFor(m, t)
        if (c) expect(skus.has(c.aboutSku), `${m}/${t}`).toBe(true)
      }
    }
  })
})
