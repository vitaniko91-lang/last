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

// Обезличивание рассчитано на буквы A…Z.
const SHOP_LIMIT = 26

function label(shop, i, anonymise) {
  return anonymise ? `Магазин ${String.fromCharCode(65 + i)}` : shop.name
}

// Подмена имени страхует одно поле из восьми: значения метрик идут в ту же
// строку. Поэтому ячейка принимает только число, булево и «не снято» —
// на любом тексте функция падает, а не публикует его.
function cell(value) {
  if (value === null || value === undefined) return '—'
  if (typeof value === 'boolean') return value ? 'да' : 'нет'
  if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  throw new TypeError(
    `Метрика должна быть числом, булевым или null, получено ${JSON.stringify(value)}. ` +
      'Текст в ячейке способен вынести имя магазина в публичную таблицу.',
  )
}

// Проверяем ВЫХОД, а не намерение: наличие опции не доказывает, что имена ушли.
function assertNoNames(md, shops) {
  const leaked = shops.map(s => s.name).filter(name => name && md.includes(name))
  if (leaked.length) {
    throw new Error(`Обезличивание не сработало, в выводе остались имена: ${leaked.join(', ')}`)
  }
}

export function renderAuditTable(shops, options = {}) {
  if (!Array.isArray(shops) || shops.length === 0) {
    throw new TypeError('shops: ожидался непустым массивом')
  }
  if (shops.length > SHOP_LIMIT) {
    throw new RangeError(`Обезличивание рассчитано на ${SHOP_LIMIT} магазинов, получено ${shops.length}`)
  }
  const unknown = Object.keys(options).filter(k => k !== 'anonymise')
  if (unknown.length) {
    throw new TypeError(`Неизвестная опция: ${unknown.join(', ')}. Обезличивание пишется anonymise.`)
  }
  const { anonymise = false } = options

  const head = `| Метрика | ${shops.map((s, i) => label(s, i, anonymise)).join(' | ')} |`
  const sep = `|---|${shops.map(() => '---').join('|')}|`
  const rows = COLUMNS.map(
    ([key, text]) => `| ${text} | ${shops.map(s => cell(s.metrics[key])).join(' | ')} |`,
  )

  const md = [head, sep, ...rows].join('\n')
  if (anonymise) assertNoNames(md, shops)
  return md
}
