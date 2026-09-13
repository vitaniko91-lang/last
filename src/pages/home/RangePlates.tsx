import { Link } from 'react-router'
import { CATALOGUE } from '../../kit/catalogue'
import { applicabilityFor } from '../../lib/applicability'
import { MATERIAL_INFO } from '../../lib/materials'
import { formatRub } from '../../lib/money'
import { CATEGORY_WORD } from '../../lib/words'

/**
 * Линейка как витрина бутика (референс: spykercars.com/boutique): плиты
 * без рамок на тон светлее фона, предмет по центру, подпись и цена мелко
 * под плитой. Никаких карточек с тенями — плита, а не карточка.
 *
 * Предмета физически нет, поэтому в плите стоит слово категории — так же,
 * как в каталоге. Материалы под плитой берутся из матрицы, не проставляются
 * руками: второго источника нет.
 */
export function RangePlates() {
  return (
    <ul className="grid gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 m-0 p-0 list-none">
      {CATALOGUE.map((p) => {
        const { fits } = applicabilityFor(p.sku)
        return (
          <li key={p.sku}>
            <Link to={`/product/${p.sku}`} className="group block">
              <span className="relative flex items-center justify-center aspect-[4/3] bg-[var(--color-surface)] transition-colors duration-200 group-hover:bg-[var(--color-accent-light)]">
                {/* Слово категории — заглушка предмета, aria-hidden: имя товара
                    стоит под плитой настоящим текстом. */}
                <span aria-hidden className="font-[family-name:var(--font-family-display)] font-medium text-[length:var(--font-size-h2)] tracking-[var(--tracking-display)] text-center">
                  {CATEGORY_WORD[p.sku]}
                </span>
                {/* Фактуры материалов — в углу плиты, как клеймо. Подпись одна
                    на всю группу: четыре подряд озвученные картинки — шум. */}
                {fits.length > 0 && fits.length < 4 && (
                  <span
                    role="img"
                    aria-label={`подходит: ${fits.map(m => MATERIAL_INFO[m].short).join(', ')}`}
                    className="absolute right-3 bottom-3 flex gap-1"
                  >
                    {fits.map(m => (
                      <img
                        key={m}
                        data-fit
                        src={`/materials/${m}-400.avif`}
                        alt=""
                        width={400}
                        height={400}
                        loading="lazy"
                        decoding="async"
                        className="size-5 object-cover"
                      />
                    ))}
                  </span>
                )}
              </span>
              {/* Пробелы между строками — для имени ссылки: без них читалка
                  склеивает «Крем-реноватор2 100 ₽». */}
              {' '}
              <span className="mt-3 flex items-baseline justify-between gap-4">
                <span className="font-medium">{p.title}</span>
                {' '}
                <span className="tnum shrink-0">{formatRub(p.priceRub)}</span>
              </span>
              {' '}
              <span className="mt-1 block text-[length:var(--font-size-caption)] text-[var(--color-text-secondary)]">
                {fits.length === 4 ? 'любой материал' : fits.length === 0 ? 'отдельная позиция' : p.role}
              </span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
