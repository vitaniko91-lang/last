// cases/last/scripts/audit/build-report.mjs
//
// Сливает автозамер и ручные метрики и печатает две таблицы:
// внутреннюю с именами и публичную с обезличенными.
// Запускать из корня cases/last:  npm run audit:report
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { renderAuditTable } from './lib/report.mjs'

const OUT = resolve(process.env.OUT ?? '../../docs/portfolio/last/audit')
const shops = JSON.parse(await readFile(new URL('./shops.json', import.meta.url), 'utf8'))

// Мобильная ширина — та, на которой меряется переполнение и тап-таргеты.
const MOBILE = 375

const rows = []
for (const shop of shops) {
  const auto = JSON.parse(await readFile(`${OUT}/raw/${shop.id}.json`, 'utf8'))
  const manual = JSON.parse(await readFile(`${OUT}/manual/${shop.id}.json`, 'utf8'))
  const m = auto.byWidth[MOBILE]
  if (!m || m.aborted) throw new Error(`${shop.id}: замер на ${MOBILE} не прошёл гейт — отчёт собирать нельзя`)

  rows.push({
    name: shop.name,
    metrics: {
      stepsToKit: manual.stepsToKit,
      hasMaterialFinder: manual.hasMaterialFinder,
      knowledgeDecisions: manual.knowledgeDecisions,
      repeatOrderClicks: manual.repeatOrderClicks,
      mobileOverflow: m.overflow.overflows,
      tapTargetFails: m.tapTargets.failing.length,
    },
  })
}

const doc = `# Аудит категории — уход за кожей и обувью

**Дата замера:** ${new Date().toISOString().slice(0, 10)}
**Выборка:** ${shops.length} магазина — ${shops.filter(s => s.tier === 'leader').length} лидера, ${shops.filter(s => s.tier === 'niche').length} нишевых
**Сценарий ручных метрик:** замшевые ботинки, защита от воды
**Ширины:** 1920 / 768 / 375. Мобильные метрики сняты на ${MOBILE}.

Каждый замер прошёл гейт вёрстки: страница видима, ширина вьюпорта равна
заказанной, в теле есть настоящий контент. Гейта по частоте кадров здесь нет
намеренно — замер 2026-09-04 показал 9, 12 и 34 fps на одной странице в трёх
режимах запуска при одинаковом scrollWidth, то есть fps меряет стенд, а не
вёрстку. В этом прогоне fps шёл от 12 до 62 и записан в сырые файлы как
диагностика.

## Внутренняя таблица (имена)

Не публикуется. Публичная версия ниже.

${renderAuditTable(rows)}

## Публичная таблица (обезличенная)

${renderAuditTable(rows, { anonymise: true })}

## Находки

<!-- Заполняется в Task 10: 3–5 находок, каждая с числом из таблицы выше
     и парным решением в LAST. -->
`

// Находки пишутся человеком прямо в документ. Следующий прогон обязан их
// сохранить, иначе пересборка таблиц молча уносит работу.
const target = `${OUT}/category-audit.md`
let findings = null
try {
  const prev = await readFile(target, 'utf8')
  const i = prev.indexOf('## Находки')
  if (i !== -1) {
    const body = prev.slice(i + '## Находки'.length).trim()
    if (body && !body.startsWith('<!--')) findings = body
  }
} catch {
  // файла ещё нет — первый прогон
}

const out = findings ? doc.replace(/## Находки[\s\S]*$/, `## Находки\n\n${findings}\n`) : doc
await writeFile(target, out)
if (findings) console.log('Раздел «Находки» сохранён из предыдущей версии.')
console.log(`Записано: ${OUT}/category-audit.md`)
