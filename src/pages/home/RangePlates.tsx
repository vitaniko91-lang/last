import { Link } from 'react-router'
import { CATALOGUE } from '../../kit/catalogue'
import { MATERIALS } from '../../kit/rules'
import type { Material } from '../../kit/types'
import { applicabilityFor } from '../../lib/applicability'
import { MATERIAL_INFO } from '../../lib/materials'
import { formatRub } from '../../lib/money'
import { productImage } from '../../lib/product-images'
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
/**
 * Материал плиты: один из подходящих, выбранный по позиции в линейке — четыре
 * гладких кожи подряд читались бы как одна плита. Без привязки — по кругу
 * из всех четырёх. Кадрирование тоже идёт по позиции, чтобы одна и та же
 * фактура не повторялась один в один.
 */
function plateMaterial(fits: readonly Material[], i: number): Material {
  const pool = fits.length > 0 ? fits : MATERIALS
  return pool[i % pool.length] ?? 'smooth'
}
const CROPS = ['30% 40%', '70% 60%', '50% 20%', '20% 70%', '80% 30%'] as const

export function RangePlates() {
  return (
    <ul className="grid gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 m-0 p-0 list-none">
      {CATALOGUE.map((p, i) => {
        const { fits } = applicabilityFor(p.sku)
        const material = plateMaterial(fits, i)
        const render = productImage(p.sku)
        return (
          <li key={p.sku}>
            <Link to={`/product/${p.sku}`} className="group block">
              <span className="relative isolate flex items-center justify-center aspect-[4/3] overflow-hidden bg-[var(--color-inverse)] border border-[var(--color-border-on-inverse)] text-[var(--color-text-on-inverse)]">
                {render ? (
                  /* Рендер SKU из папки приёма: квадрат, предмет по центру. */
                  <img
                    src={render.src}
                    srcSet={render.srcSet}
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                    alt=""
                    width={render.width}
                    height={render.height}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 -z-10 size-full object-cover transition-[scale] duration-[600ms] group-hover:scale-[1.04]"
                    style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
                  />
                ) : (
                  <>
                    {/* Рендера ещё нет — плиту держит макро материала, для
                        которого средство сделано, и слово категории поверх.
                        Сборка не зависит от того, пришёл ли файл. */}
                    <img
                      src={`/materials/${material}-800.avif`}
                      srcSet={`/materials/${material}-400.avif 400w, /materials/${material}-800.avif 800w`}
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                      alt=""
                      width={800}
                      height={800}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 -z-10 size-full object-cover transition-[scale] duration-[600ms] group-hover:scale-[1.04]"
                      style={{ objectPosition: CROPS[i % CROPS.length], transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
                    />
                    <span aria-hidden className="absolute inset-0 -z-10 hero-plate-shade" />
                    {/* Слово категории — заглушка предмета, aria-hidden: имя товара
                        стоит под плитой настоящим текстом. */}
                    <span aria-hidden className="font-[family-name:var(--font-family-display)] font-medium text-[length:var(--font-size-h2)] uppercase tracking-[0.04em] text-center">
                      {CATEGORY_WORD[p.sku]}
                    </span>
                  </>
                )}
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
                        className="size-5 object-cover outline outline-1 outline-[var(--color-border-on-inverse)]"
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
              <span className="mt-1 block text-[length:var(--font-size-caption)] text-[var(--color-text-secondary-on-inverse)]">
                {fits.length === 4 ? 'любой материал' : fits.length === 0 ? 'отдельная позиция' : p.role}
              </span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
