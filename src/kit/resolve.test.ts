// cases/last/src/kit/resolve.test.ts
import { describe, it, expect } from 'vitest'
import { resolve } from './resolve'

const skus = (kit: { items: { sku: string }[] }) => kit.items.map(i => i.sku)

describe('resolve', () => {
  it('на пустом списке задач возвращает пустой набор без конфликтов', () => {
    const kit = resolve({ material: 'suede', tasks: [], frequency: 'weekly' })
    expect(kit.items).toEqual([])
    expect(kit.conflicts).toEqual([])
    expect(kit.needsShade).toBe(false)
  })

  it('собирает набор по одной задаче', () => {
    const kit = resolve({ material: 'suede', tasks: ['protect'], frequency: 'weekly' })
    expect(skus(kit)).toEqual(['spray-suede'])
  })

  it('не дублирует щётку, когда её требуют две задачи сразу', () => {
    const kit = resolve({ material: 'smooth', tasks: ['nourish', 'restore'], frequency: 'weekly' })
    expect(skus(kit).filter(s => s === 'brush-horsehair')).toHaveLength(1)
    expect(skus(kit)).toEqual(['cream', 'balm', 'brush-horsehair'])
  })

  it('порядок набора идёт по каталогу, а не по порядку задач', () => {
    const a = resolve({ material: 'smooth', tasks: ['restore', 'nourish'], frequency: 'weekly' })
    const b = resolve({ material: 'smooth', tasks: ['nourish', 'restore'], frequency: 'weekly' })
    expect(skus(a)).toEqual(skus(b))
  })

  it('конфликт объясняется и подставляет замену в набор', () => {
    const kit = resolve({ material: 'suede', tasks: ['restore'], frequency: 'weekly' })
    expect(kit.conflicts).toHaveLength(1)
    expect(kit.conflicts[0]!.reason).toMatch(/ворс/)
    expect(skus(kit)).toEqual(['kit-suede'])
  })

  it('замена из конфликта не дублирует товар, уже попавший в набор', () => {
    const kit = resolve({ material: 'suede', tasks: ['clean', 'restore'], frequency: 'weekly' })
    expect(skus(kit)).toEqual(['kit-suede'])
    expect(kit.conflicts).toHaveLength(1)
  })

  it('вопрос про оттенок появляется только вместе с кремом', () => {
    expect(resolve({ material: 'smooth', tasks: ['restore'], frequency: 'weekly' }).needsShade).toBe(true)
    expect(resolve({ material: 'smooth', tasks: ['protect'], frequency: 'weekly' }).needsShade).toBe(false)
    expect(resolve({ material: 'suede', tasks: ['restore'], frequency: 'weekly' }).needsShade).toBe(false)
  })

  it('падает на неизвестном материале, а не возвращает пустой набор', () => {
    // @ts-expect-error проверяем поведение в рантайме на невалидном входе
    expect(() => resolve({ material: 'plastic', tasks: ['clean'], frequency: 'weekly' })).toThrow(/plastic/)
  })

  it('падает на неизвестной задаче', () => {
    // @ts-expect-error проверяем поведение в рантайме на невалидном входе
    expect(() => resolve({ material: 'smooth', tasks: ['polish'], frequency: 'weekly' })).toThrow(/polish/)
  })
})
