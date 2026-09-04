// cases/last/src/kit/schedule.ts
import type { Frequency, Product, Sku } from './types'

// Коэффициенты вынесены в экспорт намеренно: это редакционное допущение,
// а не деталь реализации, и его должно быть видно снаружи.
export const FREQUENCY_FACTOR: Record<Frequency, number> = {
  daily: 0.5,
  weekly: 1,
  rare: 2,
}

export interface Schedule {
  /** Месяцев до первого пополнения. null, если расходников в наборе нет. */
  months: number | null
  /** Позиция, которая кончится первой. */
  firstToRunOut: Sku | null
}

export function scheduleFor(items: readonly Product[], frequency: Frequency): Schedule {
  // Приведение обязательно: по типам ключ всегда валиден, поэтому сравнение с
  // undefined без него TypeScript отвергает — а проверка в рантайме нужна.
  const factor = FREQUENCY_FACTOR[frequency] as number | undefined
  if (factor === undefined) throw new Error(`Неизвестная частота носки: ${frequency}`)

  let months: number | null = null
  let firstToRunOut: Sku | null = null

  for (const item of items) {
    if (!item.consumable || item.coverageMonths === null) continue
    // Вниз, а не к ближайшему: обещать больше, чем прослужит, нельзя.
    const life = Math.floor(item.coverageMonths * factor)
    if (months === null || life < months) {
      months = life
      firstToRunOut = item.sku
    }
  }

  return { months, firstToRunOut }
}
