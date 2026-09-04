// cases/last/src/kit/resolve.integration.test.ts
import { describe, it, expect } from 'vitest'
import { resolve } from './resolve'
import { scheduleFor } from './schedule'
import { MATERIALS, TASKS } from './rules'

describe('сквозные сценарии', () => {
  it('сценарий аудита: замшевые ботинки, нужна защита от воды', () => {
    const kit = resolve({ material: 'suede', tasks: ['protect'], frequency: 'daily' })
    expect(kit.items.map(i => i.sku)).toEqual(['spray-suede'])
    expect(kit.conflicts).toEqual([])
    expect(kit.needsShade).toBe(false)

    const s = scheduleFor(kit.items, 'daily')
    expect(s.months).toBe(2)
    expect(s.firstToRunOut).toBe('spray-suede')
  })

  it('замша, все четыре задачи: два конфликта, набор из двух позиций', () => {
    const kit = resolve({ material: 'suede', tasks: [...TASKS], frequency: 'weekly' })
    expect(kit.items.map(i => i.sku)).toEqual(['spray-suede', 'kit-suede'])
    expect(kit.conflicts.map(c => c.task).sort()).toEqual(['nourish', 'restore'])
  })

  it('гладкая кожа, всё сразу: четыре позиции и вопрос про оттенок', () => {
    const kit = resolve({ material: 'smooth', tasks: [...TASKS], frequency: 'weekly' })
    expect(kit.items.map(i => i.sku)).toEqual(['cream', 'balm', 'spray-smooth', 'brush-horsehair'])
    expect(kit.needsShade).toBe(true)
    expect(scheduleFor(kit.items, 'weekly').firstToRunOut).toBe('spray-smooth')
  })

  it('ни один набор из всех возможных ответов не остаётся без объяснения', () => {
    for (const material of MATERIALS) {
      for (const task of TASKS) {
        const kit = resolve({ material, tasks: [task], frequency: 'weekly' })
        const explained = kit.items.length > 0 || kit.conflicts.length > 0
        expect(explained, `${material}/${task}`).toBe(true)
      }
    }
  })

  it('порядок задач не влияет ни на набор, ни на срок', () => {
    const a = resolve({ material: 'cordovan', tasks: ['restore', 'protect', 'clean'], frequency: 'rare' })
    const b = resolve({ material: 'cordovan', tasks: ['clean', 'protect', 'restore'], frequency: 'rare' })
    expect(a.items.map(i => i.sku)).toEqual(b.items.map(i => i.sku))
    expect(scheduleFor(a.items, 'rare')).toEqual(scheduleFor(b.items, 'rare'))
  })
})
