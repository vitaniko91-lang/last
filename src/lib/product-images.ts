import type { Sku } from '../kit/types'
import manifest from '../generated/product-images.json'

/**
 * Рендеры SKU приходят из папки приёма и раскладываются скриптом
 * `npm run products` в public/products/ вместе с манифестом. Компонент
 * спрашивает манифест, а не файловую систему: пока рендера нет — null, и
 * плита держится макро материала. Сборка не зависит от того, пришёл ли файл.
 */
const PRESENT = manifest as Partial<Record<Sku, { w: number; h: number }>>

export interface ProductImage {
  src: string
  srcSet: string
  width: number
  height: number
}

export function productImage(sku: Sku): ProductImage | null {
  const entry = PRESENT[sku]
  if (!entry) return null
  return {
    src: `/products/${sku}-1200.avif`,
    srcSet: `/products/${sku}-600.avif 600w, /products/${sku}-1200.avif 1200w`,
    width: entry.w,
    height: entry.h,
  }
}

/** Сколько рендеров есть — для отчёта о покрытии в консоли и тестах. */
export function productImageCoverage(all: readonly Sku[]): { have: Sku[]; missing: Sku[] } {
  const have = all.filter(s => PRESENT[s])
  const missing = all.filter(s => !PRESENT[s])
  return { have, missing }
}
