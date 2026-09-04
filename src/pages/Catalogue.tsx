import { useState } from 'react'
import { CATALOGUE } from '../kit/catalogue'
import { MATERIALS } from '../kit/rules'
import { applicabilityFor } from '../lib/applicability'
import { MATERIAL_INFO } from '../lib/materials'
import { ProductCard } from '../ui/ProductCard'
import { Button } from '../ui/Button'
import type { Material } from '../kit/types'

function plural(n: number): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'позиция'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'позиции'
  return 'позиций'
}

export function Catalogue() {
  const [filter, setFilter] = useState<Material | 'all'>('all')

  // Фильтр читает ту же матрицу, что и конфигуратор: показываем то, что к
  // материалу применимо, а не то, что помечено вручную в карточке.
  const shown = filter === 'all'
    ? [...CATALOGUE]
    : CATALOGUE.filter(p => applicabilityFor(p.sku).fits.includes(filter))

  return (
    <section className="px-5 sm:px-20 py-10 sm:py-16 flex flex-col gap-8 sm:gap-10">
      <div className="flex flex-wrap items-baseline gap-4 sm:gap-6">
        <h1>Каталог</h1>
        <p className="label text-[var(--color-text-secondary)] tnum">
          {shown.length} {plural(shown.length)}
        </p>
      </div>

      <div role="radiogroup" aria-label="Фильтр по материалу" className="flex flex-wrap gap-3">
        {(['all', ...MATERIALS] as const).map(value => {
          const label = value === 'all' ? 'Все' : MATERIAL_INFO[value].title
          const active = filter === value
          return (
            <button
              key={value}
              role="radio"
              type="button"
              aria-checked={active}
              onClick={() => setFilter(value)}
              className={
                'min-h-11 px-5 border cursor-pointer font-semibold transition-colors duration-200 ' +
                (active
                  ? 'bg-[var(--color-accent-base)] text-[var(--color-text-on-accent)] border-[var(--color-accent-base)]'
                  : 'bg-[var(--color-surface)] border-[var(--color-border-default)]')
              }
            >
              {label}
            </button>
          )
        })}
      </div>

      {shown.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {shown.map(p => <ProductCard key={p.sku} product={p} />)}
        </div>
      ) : (
        // Не «ничего не найдено», а объяснение: пустота здесь — свойство
        // материала, а не пробел в каталоге.
        <p className="max-w-[60ch] text-[var(--color-text-secondary)]">
          Для этого материала в линейке нет подходящих средств — и это не пробел
          в каталоге, а свойство самого материала.
        </p>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center gap-6 p-6 sm:p-10 bg-[var(--color-inverse)] text-[var(--color-text-on-inverse)]">
        <div className="flex-1">
          <h2 className="text-[length:var(--font-size-h3)]">Не знаете, что из этого нужно вашей вещи?</h2>
          <p className="mt-2 text-[var(--color-text-secondary-on-inverse)] max-w-[60ch]">
            Четыре вопроса — и мы соберём набор, посчитаем срок и не предложим
            того, что вашему материалу навредит.
          </p>
        </div>
        <Button href="/configurator">Подобрать уход</Button>
      </div>
    </section>
  )
}
