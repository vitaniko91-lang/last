import type { Product } from '../kit/types'
import { formatRub } from '../lib/money'

interface Props {
  product: Product
  removed?: boolean
  onRemove: () => void
  onRestore: () => void
}

/**
 * Убранная позиция гасится ЗАЧЁРКИВАНИЕМ, а не прозрачностью всей строки:
 * 40% на ряду гасят вместе с ней и «вернуть» — единственное действие отмены —
 * примерно до 2.2:1.
 */
export function KitLine({ product, removed = false, onRemove, onRestore }: Props) {
  const muted = removed ? 'line-through text-[var(--color-text-secondary)]' : ''
  return (
    <div className="flex items-center gap-3 sm:gap-4 py-4">
      <div className="flex-1 min-w-0">
        <p className={`font-semibold ${muted}`}>{product.title}</p>
        <p className="text-[var(--color-text-secondary)]">{product.role}</p>
      </div>
      <p className={`font-semibold tnum shrink-0 ${muted}`}>{formatRub(product.priceRub)}</p>
      {removed ? (
        <button type="button" onClick={onRestore}
                className="shrink-0 min-h-10 px-2 font-semibold text-[var(--color-accent-base)] cursor-pointer">
          вернуть
        </button>
      ) : (
        <button type="button" onClick={onRemove} aria-label={`Убрать ${product.title}`}
                className="shrink-0 w-10 h-10 text-[var(--color-text-secondary)] cursor-pointer">
          ×
        </button>
      )}
    </div>
  )
}
