// cases/last/src/kit/schedule.test.ts
import { describe, it, expect } from 'vitest'
import { scheduleFor, FREQUENCY_FACTOR } from './schedule'
import { bySku } from './catalogue'

const items = (...skus: Parameters<typeof bySku>[0][]) => skus.map(bySku)

describe('scheduleFor', () => {
  it('срок набора равен сроку позиции, которая кончится первой', () => {
    // spray-suede 5 мес против kit-suede 12 → первым кончится спрей
    expect(scheduleFor(items('spray-suede', 'kit-suede'), 'weekly').months).toBe(5)
  })

  it('ежедневная носка сокращает срок вдвое, редкая удваивает', () => {
    expect(scheduleFor(items('spray-suede'), 'daily').months).toBe(2)
    expect(scheduleFor(items('spray-suede'), 'weekly').months).toBe(5)
    expect(scheduleFor(items('spray-suede'), 'rare').months).toBe(10)
  })

  it('нерасходники в расчёт не идут', () => {
    expect(scheduleFor(items('brush-horsehair'), 'weekly').months).toBeNull()
    expect(scheduleFor(items('balm', 'brush-horsehair'), 'weekly').months).toBe(10)
  })

  it('пустой набор не даёт срок и не выдумывает ноль', () => {
    const s = scheduleFor([], 'weekly')
    expect(s.months).toBeNull()
    expect(s.firstToRunOut).toBeNull()
  })

  it('называет позицию, которая кончится первой', () => {
    expect(scheduleFor(items('balm', 'spray-smooth'), 'weekly').firstToRunOut).toBe('spray-smooth')
  })

  it('округляет до целого месяца вниз, чтобы не обещать лишнего', () => {
    // balm 10 мес при ежедневной носке → 5; spray-smooth 6 → 3
    expect(scheduleFor(items('balm'), 'daily').months).toBe(5)
    expect(scheduleFor(items('spray-smooth'), 'daily').months).toBe(3)
    // kit-suede 12 при редкой → 24, крем 12 при ежедневной → 6
    expect(scheduleFor(items('kit-suede'), 'rare').months).toBe(24)
    expect(scheduleFor(items('cream'), 'daily').months).toBe(6)
  })

  it('коэффициенты частоты заданы явно и не прячутся в логике', () => {
    expect(FREQUENCY_FACTOR).toEqual({ daily: 0.5, weekly: 1, rare: 2 })
  })

  it('падает на неизвестной частоте', () => {
    // @ts-expect-error проверяем поведение в рантайме на невалидном входе
    expect(() => scheduleFor(items('balm'), 'sometimes')).toThrow(/sometimes/)
  })
})
