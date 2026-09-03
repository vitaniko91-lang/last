// cases/last/scripts/audit/lib/report.mjs

// Порядок строк таблицы. Первые четыре снимаются вручную, последние три — машиной.
export const COLUMNS = [
  ['stepsToKit', 'Экранов до нужного средства'],
  ['hasMaterialFinder', 'Подбор по материалу'],
  ['knowledgeDecisions', 'Решений, требующих знаний'],
  ['repeatOrderClicks', 'Кликов до повторного заказа'],
  ['mobileOverflow', 'Переполнение на 375'],
  ['tapTargetFails', 'Тап-таргетов меньше 40×40'],
  ['lcpMs', 'LCP, мс'],
]

function label(shop, i, anonymise) {
  return anonymise ? `Магазин ${String.fromCharCode(65 + i)}` : shop.name
}

function cell(value) {
  if (value === null || value === undefined) return '—'
  if (typeof value === 'boolean') return value ? 'да' : 'нет'
  return String(value)
}

export function renderAuditTable(shops, { anonymise = false } = {}) {
  const head = `| Метрика | ${shops.map((s, i) => label(s, i, anonymise)).join(' | ')} |`
  const sep = `|---|${shops.map(() => '---').join('|')}|`
  const rows = COLUMNS.map(
    ([key, text]) => `| ${text} | ${shops.map(s => cell(s.metrics[key])).join(' | ')} |`,
  )
  return [head, sep, ...rows].join('\n')
}
