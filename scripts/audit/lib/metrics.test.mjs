// cases/last/scripts/audit/lib/metrics.test.mjs
import { describe, it, expect } from 'vitest'
import { overflowReport, tapTargetReport } from './metrics.mjs'

describe('overflowReport', () => {
  it('не считает переполнением расхождение в один пиксель', () => {
    const r = overflowReport({ scrollWidth: 376, clientWidth: 375, offenders: ['div.hero'] })
    expect(r.overflows).toBe(false)
    expect(r.offenders).toEqual([])
  })

  it('фиксирует переполнение и возвращает виновников', () => {
    const r = overflowReport({ scrollWidth: 520, clientWidth: 375, offenders: ['table.specs'] })
    expect(r.overflows).toBe(true)
    expect(r.overflowBy).toBe(145)
    expect(r.offenders).toEqual(['table.specs'])
  })

  it('держит порог: 1 пиксель — нет, 2 — да', () => {
    expect(overflowReport({ scrollWidth: 376, clientWidth: 375, offenders: [] }).overflows).toBe(false)
    expect(overflowReport({ scrollWidth: 377, clientWidth: 375, offenders: [] }).overflows).toBe(true)
  })

  it('падает на несостоявшемся замере, а не отвечает «переполнения нет»', () => {
    expect(() => overflowReport({})).toThrow(/scrollWidth/)
    expect(() => overflowReport({ scrollWidth: 375 })).toThrow(/clientWidth/)
  })
})

describe('tapTargetReport', () => {
  it('пропускает цели не меньше порога', () => {
    const r = tapTargetReport([{ tag: 'button', width: 44, height: 40 }])
    expect(r.passes).toBe(true)
    expect(r.failing).toEqual([])
  })

  it('ловит цель, узкую по любой из сторон, и округляет размеры', () => {
    const r = tapTargetReport([
      { tag: 'a', width: 24.4, height: 41 },
      { tag: 'button', width: 48, height: 48 },
    ])
    expect(r.passes).toBe(false)
    expect(r.failing).toEqual([{ tag: 'a', width: 24, height: 41 }])
    expect(r.total).toBe(2)
  })

  it('порог задаётся аргументом', () => {
    const r = tapTargetReport([{ tag: 'a', width: 30, height: 30 }], 24)
    expect(r.passes).toBe(true)
    expect(r.min).toBe(24)
  })

  it('пустая выборка — не вердикт «всё хорошо», а отсутствие вердикта', () => {
    const r = tapTargetReport([])
    expect(r.passes).toBe(null)
    expect(r.total).toBe(0)
  })

  it('падает на цели без размеров', () => {
    expect(() => tapTargetReport([{ tag: 'a' }])).toThrow(/width/)
    expect(() => tapTargetReport([{ tag: 'a', width: 40, height: null }])).toThrow(/height/)
  })
})
