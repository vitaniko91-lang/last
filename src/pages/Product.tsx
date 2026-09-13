import { useRef, useState } from 'react'
import { useParams } from 'react-router'
import { CATALOGUE } from '../kit/catalogue'
import { applicabilityFor } from '../lib/applicability'
import { MATERIAL_INFO } from '../lib/materials'
import { formatRub } from '../lib/money'
import { CATEGORY_WORD } from '../lib/words'
import { SwatchPicker } from '../ui/SwatchPicker'
import { Button } from '../ui/Button'
import { useCart } from '../state/cart'

export function Product() {
  const { sku } = useParams<{ sku: string }>()
  const { add } = useCart()
  const [shade, setShade] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [added, setAdded] = useState(false)
  const shadesRef = useRef<HTMLDivElement>(null)

  const product = CATALOGUE.find(p => p.sku === sku)
  if (!product) {
    return (
      <section className="px-5 sm:px-20 py-16 sm:py-30">
        <h1>Такой позиции нет</h1>
      </section>
    )
  }

  const { fits, doesNotFit } = applicabilityFor(product.sku)

  function addToCart() {
    if (!product) return
    if (product.shades && !shade) {
      // Кнопка не блокируется молча: она объясняет и уводит к выбору.
      // Уводим ФОКУС, а не скролл: фокус прокручивает сам, работает с
      // клавиатуры и озвучивается — скролл не делает ничего из трёх.
      setNotice('Выберите оттенок — от него зависит результат. Нейтральный подходит ко всему и не меняет тон.')
      shadesRef.current?.querySelector<HTMLButtonElement>('[role="radio"]')?.focus()
      return
    }
    add(product.sku, 1, shade ?? undefined)
    setNotice(null)
    setAdded(true)
  }

  return (
    <section className="px-5 sm:px-20 py-10 sm:py-16 grid gap-8 lg:grid-cols-[minmax(0,600px)_1fr] lg:gap-16 items-start">
      <div className="flex items-center justify-center aspect-square bg-[var(--color-surface-alpha-subtle)] border border-[var(--color-border-default)] px-6">
        <span className="font-[family-name:var(--font-family-display)] font-semibold text-[length:var(--font-size-h1)] tracking-[var(--tracking-display)] text-center">
          {CATEGORY_WORD[product.sku]}
        </span>
      </div>

      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-[length:var(--font-size-h2)] leading-[var(--line-height-h2)]">{product.title}</h1>
          <p className="mt-2 text-[var(--color-text-secondary)]">{product.role}</p>
        </div>

        {product.shades && (
          <div ref={shadesRef}>
            <SwatchPicker shades={product.shades} selected={shade} onSelect={s => { setShade(s); setNotice(null) }} />
            <p className="mt-4 text-[var(--color-accent-base)]">
              Не уверены? Нейтральный подходит ко всему и не меняет тон.
            </p>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4">
          <p className="font-[family-name:var(--font-family-display)] font-semibold text-[length:var(--font-size-h3)] tnum">
            {formatRub(product.priceRub)}
          </p>
          <Button onClick={addToCart} className="flex-1 min-w-[200px]">В корзину</Button>
        </div>
        <div aria-live="polite">
          {notice && <p role="alert" className="text-[var(--color-semantic-warning)]">{notice}</p>}
          {added && !notice && <p className="text-[var(--color-accent-base)]">Добавлено в корзину.</p>}
        </div>

        {product.coverageMonths !== null && (
          <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border-default)]">
            <p className="label text-[var(--color-text-secondary)]">Хватит примерно на</p>
            <p className="mt-2 font-semibold tnum">
              {product.coverageMonths} месяцев при носке несколько раз в неделю
            </p>
            <p className="mt-2 text-[var(--color-text-secondary)]">
              Считается из расхода, а не пишется в описании. Ответьте на четыре
              вопроса — и цифра станет вашей.
            </p>
          </div>
        )}

        {/* Прямой ответ на находку 3 аудита: замеренные магазины пишут, на чём
            средство работает, и молчат о том, на чём его применять нельзя. */}
        <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border-default)] flex flex-col gap-5">
          <div>
            <p className="label text-[var(--color-accent-base)]">Подходит</p>
            <p className="mt-1 font-semibold">
              {fits.length === 4 ? 'Любой материал'
                : fits.length === 0 ? 'Не привязан к материалу'
                : fits.map(m => MATERIAL_INFO[m].title).join(', ')}
            </p>
          </div>
          {doesNotFit.length > 0 && (
            <>
              <hr className="border-0 h-px bg-[var(--color-border-divider)]" />
              <div className="flex flex-col gap-4">
                <p className="label text-[var(--color-semantic-warning)]">Не подходит</p>
                {doesNotFit.map(x => (
                  <div key={x.material}>
                    <p className="font-semibold">{MATERIAL_INFO[x.material].title}</p>
                    <p className="text-[var(--color-text-secondary)]">{x.reason}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
