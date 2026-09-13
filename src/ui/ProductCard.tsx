import { Link } from 'react-router'
import type { Product } from '../kit/types'
import { formatRub } from '../lib/money'
import { applicabilityFor } from '../lib/applicability'
import { MATERIAL_INFO } from '../lib/materials'
import { CATEGORY_WORD } from '../lib/words'

export function ProductCard({ product }: { product: Product }) {
  const { fits } = applicabilityFor(product.sku)
  const applic =
    fits.length === 4 ? 'Любой материал'
    : fits.length === 0 ? 'Отдельная позиция'
    : fits.map(m => MATERIAL_INFO[m].title).join(' · ')

  return (
    <Link
      to={`/product/${product.sku}`}
      className="flex flex-col h-full bg-[var(--color-surface)] border border-[var(--color-border-default)] hover:border-[var(--color-accent-base)] transition-colors duration-200"
    >
      <span className="flex items-center justify-center aspect-square bg-[var(--color-surface-alpha-subtle)] px-5">
        <span className="font-[family-name:var(--font-family-display)] font-semibold text-[length:var(--font-size-h2)] tracking-[var(--tracking-display)] text-center">
          {CATEGORY_WORD[product.sku]}
        </span>
      </span>
      <span className="flex flex-col gap-2 p-6 flex-1">
        <span className="font-semibold">{product.title}</span>
        <span className="text-[var(--color-text-secondary)]">{product.role}</span>
        <span className="label text-[var(--color-text-secondary)] mt-auto pt-2">{applic}</span>
        <span className="font-semibold tnum">{formatRub(product.priceRub)}</span>
      </span>
    </Link>
  )
}
