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
 *
 * Раскладка отвечает на ширину КОНТЕЙНЕРА, а не экрана: та же строка стоит и
 * в панели набора шириной 316px, и в корзине шириной под 700. Медиа-запрос
 * этой разницы не видит и на широком экране всё равно сломал бы панель.
 */
export function KitLine({ product, removed = false, onRemove, onRestore }: Props) {
  const muted = removed ? 'line-through text-[var(--color-text-secondary)]' : ''
  return (
    <div className="@container py-4">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="basis-full @sm:basis-0 @sm:flex-1 min-w-0">
          <p className={`font-semibold ${muted}`}>{product.title}</p>
          <p className="text-[var(--color-text-secondary)]">{product.role}</p>
        </div>
        <p className={`font-semibold tnum @sm:ml-auto ${muted}`}>{formatRub(product.priceRub)}</p>
        {removed ? (
          <button type="button" onClick={onRestore}
                  className="ml-auto @sm:ml-0 min-h-10 px-2 font-semibold text-[var(--color-accent-base)] cursor-pointer">
            вернуть
          </button>
        ) : (
          <button type="button" onClick={onRemove} aria-label={`Убрать ${product.title}`}
                  className="ml-auto @sm:ml-0 w-10 h-10 text-[var(--color-text-secondary)] cursor-pointer">
            ×
          </button>
        )}
      </div>
    </div>
  )
}
