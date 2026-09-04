// cases/last/scripts/audit/lib/report.test.mjs
import { describe, it, expect } from 'vitest'
import { renderAuditTable } from './report.mjs'

const shops = [
  {
    name: 'Shop One',
    metrics: {
      stepsToKit: 7, hasMaterialFinder: false, knowledgeDecisions: 3,
      repeatOrderClicks: 5, mobileOverflow: true, tapTargetFails: 12,
    },
  },
  {
    name: 'Shop Two',
    metrics: {
      stepsToKit: 5, hasMaterialFinder: true, knowledgeDecisions: 1,
      repeatOrderClicks: null, mobileOverflow: false, tapTargetFails: 0,
    },
  },
]

describe('renderAuditTable', () => {
  it('печатает имена магазинов во внутренней версии', () => {
    const md = renderAuditTable(shops)
    expect(md).toContain('Shop One')
    expect(md).toContain('Shop Two')
  })

  it('заменяет имена буквами в публичной версии', () => {
    const md = renderAuditTable(shops, { anonymise: true })
    expect(md).not.toContain('Shop One')
    expect(md).toContain('Магазин A')
    expect(md).toContain('Магазин B')
  })

  it('переводит булевы значения в да/нет', () => {
    const md = renderAuditTable(shops)
    expect(md).toContain('| Подбор по материалу | нет | да |')
  })

  it('ставит прочерк там, где метрика не снята', () => {
    const md = renderAuditTable(shops)
    expect(md).toContain('| Кликов до повторного заказа | 5 | — |')
  })

  it('выдаёт строку на каждую из шести метрик плюс шапку и разделитель', () => {
    expect(renderAuditTable(shops).split('\n')).toHaveLength(8)
  })

  it('обезличивает КАЖДЫЙ магазин, а не только первый', () => {
    const md = renderAuditTable(shops, { anonymise: true })
    for (const s of shops) expect(md).not.toContain(s.name)
  })

  it('отвергает текст в ячейке — через него имя магазина уходит в публичную таблицу', () => {
    const leaky = [{ name: 'Shop One', metrics: { ...shops[0].metrics, tapTargetFails: 'н/д, Shop One заблокировал замер' } }]
    expect(() => renderAuditTable(leaky, { anonymise: true })).toThrow(/числом, булевым или null/)
  })

  it('отвергает опечатку в имени опции вместо тихой публикации имён', () => {
    expect(() => renderAuditTable(shops, { anonymize: true })).toThrow(/anonymise/)
  })

  it('отвергает пустую выборку вместо вырожденной таблицы', () => {
    expect(() => renderAuditTable([])).toThrow(/непустым/)
  })
})
