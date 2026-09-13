import { Link } from 'react-router'
import type { Product } from '../kit/types'
import { formatRub } from '../lib/money'
import { applicabilityFor } from '../lib/applicability'
import { MATERIAL_INFO } from '../lib/materials'
import { productImage } from '../lib/product-images'
import { CATEGORY_WORD } from '../lib/words'

export function ProductCard({ product }: { product: Product }) {
  const { fits } = applicabilityFor(product.sku)
  const render = productImage(product.sku)
  const applic =
    fits.length === 4 ? 'Любой материал'
    : fits.length === 0 ? 'Отдельная позиция'
    : fits.map(m => MATERIAL_INFO[m].title).join(' · ')

  return (
    <Link
      to={`/product/${product.sku}`}
      className="flex flex-col h-full bg-[var(--color-surface)] border border-[var(--color-border-default)] hover:border-[var(--color-accent-base)] transition-colors duration-200"
    >
      {render ? (
        /* Рендер SKU — тот же манифест, что у линейки и страницы товара.
           Картинка декоративна: имя товара стоит текстом ниже, alt пустой. */
        <img
          src={render.src}
          srcSet={render.srcSet}
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
          alt=""
          width={render.width}
          height={render.height}
          loading="lazy"
          decoding="async"
          className="w-full aspect-square object-cover bg-[var(--color-inverse)]"
        />
      ) : (
        /* Рендера нет — слово категории держит место; сборка не зависит от файла. */
        <span className="flex items-center justify-center aspect-square bg-[var(--color-surface-alpha-subtle)] px-5">
          <span className="font-[family-name:var(--font-family-display)] font-semibold text-[length:var(--font-size-h2)] tracking-[var(--tracking-display)] text-center">
            {CATEGORY_WORD[product.sku]}
          </span>
        </span>
      )}
      <span className="flex flex-col gap-2 p-6 flex-1">
        <span className="font-semibold">{product.title}</span>
        <span className="text-[var(--color-text-secondary)]">{product.role}</span>
        <span className="label text-[var(--color-text-secondary)] mt-auto pt-2">{applic}</span>
        <span className="font-semibold tnum">{formatRub(product.priceRub)}</span>
      </span>
    </Link>
  )
}
