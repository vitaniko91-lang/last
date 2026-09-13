import { useCart } from '../state/cart'
import { bySku } from '../kit/catalogue'
import { formatUah } from '../lib/money'
import { Button } from '../ui/Button'

export function Cart() {
  const { lines, total, setQty, remove } = useCart()

  if (lines.length === 0) {
    // Не «корзина пуста», а вход в подбор: пустое состояние — это место,
    // где человеку надо помочь, а не сообщить ему о факте.
    return (
      <section className="px-5 sm:px-20 py-16 sm:py-30 max-w-[60ch] flex flex-col gap-6 items-start">
        <h1>В корзине пока ничего нет</h1>
        <p className="text-[var(--color-text-secondary)]">
          Подбор занимает четыре вопроса: материал, что нужно сделать и как часто
          вы носите вещь. Дальше мы посчитаем набор и срок, на который его хватит.
        </p>
        <Button href="/configurator">Подобрать уход</Button>
      </section>
    )
  }

  return (
    <section className="px-5 sm:px-20 py-10 sm:py-16 grid gap-8 lg:grid-cols-[1fr_380px] lg:gap-16 items-start">
      <div className="flex flex-col gap-8 min-w-0">
        <h1>Корзина</h1>
        <ul className="bg-[var(--color-surface)] border border-[var(--color-border-default)]">
          {lines.map((line, i) => {
            const p = bySku(line.sku)
            return (
              <li
                key={`${line.sku}-${line.shade ?? ''}`}
                className={
                  'flex flex-wrap items-center gap-3 sm:gap-4 px-4 sm:px-6 py-5 ' +
                  (i > 0 ? 'border-t border-[var(--color-border-divider)]' : '')
                }
              >
                <div className="flex-1 min-w-[180px]">
                  <p className="font-semibold">{p.title}</p>
                  {line.shade && <p className="text-[var(--color-text-secondary)]">Оттенок: {line.shade}</p>}
                </div>
                <div className="flex items-center border border-[var(--color-border-default)]">
                  <button type="button" aria-label={`Меньше: ${p.title}`} className="w-10 h-10 cursor-pointer"
                          onClick={() => setQty(line.sku, line.shade, line.qty - 1)}>−</button>
                  <span className="tnum w-8 text-center">{line.qty}</span>
                  <button type="button" aria-label={`Больше: ${p.title}`} className="w-10 h-10 cursor-pointer"
                          onClick={() => setQty(line.sku, line.shade, line.qty + 1)}>+</button>
                </div>
                <p className="font-semibold tnum w-24 text-right">{formatUah(p.priceUah * line.qty)}</p>
                <button type="button" aria-label={`Убрать ${p.title}`}
                        className="w-10 h-10 text-[var(--color-text-secondary)] cursor-pointer"
                        onClick={() => remove(line.sku, line.shade)}>×</button>
              </li>
            )
          })}
        </ul>
      </div>

      <aside className="lg:sticky lg:top-6 p-6 sm:p-8 bg-[var(--color-surface)] border border-[var(--color-border-default)] flex flex-col gap-5">
        <div className="flex items-center gap-4">
          <p className="flex-1 font-semibold">Итого</p>
          <p className="font-[family-name:var(--font-family-display)] font-semibold text-[length:var(--font-size-h3)] tnum">
            {formatUah(total)}
          </p>
        </div>
        {/* Границу проекта называем на самом экране, а не только в кейсе. */}
        <p className="text-[var(--color-text-secondary)]">
          Чекаут в этом проекте существует только в Figma. Обещать целый магазин
          и не сделать — хуже, чем очертить границу честно.
        </p>
        <Button href="/case" styleName="secondary">Почему так — в кейсе</Button>
      </aside>
    </section>
  )
}
