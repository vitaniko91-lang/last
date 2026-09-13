import type { Product } from '../kit/types'

export function kitTotal(items: readonly Product[]): number {
  return items.reduce((sum, p) => sum + p.priceUah, 0)
}
