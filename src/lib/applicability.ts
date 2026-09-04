import { MATERIALS, TASKS, skusFor, conflictFor } from '../kit/rules'
import type { Material, Sku } from '../kit/types'

export interface Applicability {
  fits: Material[]
  doesNotFit: { material: Material; reason: string }[]
}

/**
 * Средство подходит материалу, если матрица предлагает его хотя бы под одну
 * задачу. Причина «не подходит» показывается только там, где конфликт написан
 * ИМЕННО ПРО ЭТО средство (`aboutSku`) — иначе на карточке крема оказывается
 * текст про бальзам: у замши два конфликта с одной и той же заменой.
 *
 * Прямой ответ на находку 3 аудита: замеренные магазины пишут, на чём средство
 * работает, и молчат о том, на чём его применять нельзя. Текст берётся из той
 * же матрицы, что и у конфигуратора — второго источника нет, значит не разойдутся.
 */
export function applicabilityFor(sku: Sku): Applicability {
  const fits: Material[] = []
  const doesNotFit: { material: Material; reason: string }[] = []

  for (const material of MATERIALS) {
    if (TASKS.some(task => skusFor(material, task).includes(sku))) {
      fits.push(material)
      continue
    }
    const own = TASKS
      .map(task => conflictFor(material, task))
      .find(c => c !== null && c.aboutSku === sku)
    if (own) doesNotFit.push({ material, reason: own.reason })
  }

  return { fits, doesNotFit }
}
