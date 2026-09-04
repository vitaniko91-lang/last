// cases/last/src/kit/resolve.ts
import { CATALOGUE, bySku } from './catalogue'
import { MATERIALS, TASKS, conflictFor, skusFor } from './rules'
import type { Answers, Conflict, Kit, Sku } from './types'

// Порядок позиций в наборе задаётся каталогом, а не порядком, в котором
// покупатель отмечал задачи: набор из одних и тех же ответов обязан выглядеть
// одинаково, в каком бы порядке их ни выбрали.
const ORDER = new Map(CATALOGUE.map((p, i) => [p.sku, i]))

export function resolve(answers: Answers): Kit {
  if (!MATERIALS.includes(answers.material)) {
    throw new Error(`Неизвестный материал: ${answers.material}`)
  }
  for (const task of answers.tasks) {
    if (!TASKS.includes(task)) throw new Error(`Неизвестная задача: ${task}`)
  }

  const chosen = new Set<Sku>()
  const conflicts: Conflict[] = []

  for (const task of answers.tasks) {
    const conflict = conflictFor(answers.material, task)
    if (conflict) {
      conflicts.push(conflict)
      // Конфликт не блокирует: он объясняет причину и кладёт замену.
      chosen.add(conflict.insteadSku)
      continue
    }
    for (const sku of skusFor(answers.material, task)) chosen.add(sku)
  }

  const items = [...chosen]
    .sort((a, b) => ORDER.get(a)! - ORDER.get(b)!)
    .map(bySku)

  return { items, conflicts, needsShade: chosen.has('cream') }
}
