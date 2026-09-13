import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { MATERIALS, TASKS, conflictFor } from '../kit/rules'
import { bySku } from '../kit/catalogue'
import { MATERIAL_INFO } from '../lib/materials'
import { formatUah } from '../lib/money'
import { kitTotal } from '../lib/pricing'
import { useConfigurator } from '../state/useConfigurator'
import { useCart } from '../state/cart'
import { MaterialCard } from '../ui/MaterialCard'
import { SelectedMaterial } from '../ui/SelectedMaterial'
import { TaskRow } from '../ui/TaskRow'
import { KitLine } from '../ui/KitLine'
import { Toggle } from '../ui/Toggle'
import { Button } from '../ui/Button'
import { Tag } from '../ui/Tag'
import { IdentifyMaterial } from './configurator/IdentifyMaterial'
import type { Frequency, Material } from '../kit/types'

const FREQUENCY: { value: Frequency; label: string }[] = [
  { value: 'daily', label: 'Каждый день' },
  { value: 'weekly', label: 'Несколько раз в неделю' },
  { value: 'rare', label: 'По случаю' },
]

function months(n: number): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'месяц'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'месяца'
  return 'месяцев'
}

export function Configurator() {
  const c = useConfigurator()
  const { add } = useCart()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [identifying, setIdentifying] = useState(false)
  const [refill, setRefill] = useState(false)

  // Материал может прийти из адреса — с главной, из подвала, по прямой ссылке.
  const fromUrl = params.get('material')
  const { material, selectMaterial } = c
  useEffect(() => {
    if (fromUrl && (MATERIALS as readonly string[]).includes(fromUrl) && !material) {
      selectMaterial(fromUrl as Material)
    }
  }, [fromUrl, material, selectMaterial])

  const total = kitTotal(c.items)
  const hasKit = c.items.length > 0 || c.removed.length > 0

  return (
    <section className="px-5 sm:px-20 py-10 sm:py-16 grid gap-8 lg:grid-cols-[1fr_380px] lg:gap-16 items-start">
      <div className="flex flex-col gap-8 sm:gap-10 min-w-0">
        {identifying ? (
          <IdentifyMaterial
            onDone={m => { c.selectMaterial(m); setIdentifying(false) }}
            onCancel={() => setIdentifying(false)}
          />
        ) : !c.material ? (
          <>
            <div className="flex flex-col gap-4 items-start">
              <Tag>Шаг 1 из 4</Tag>
              <h1>Что за вещь?</h1>
              <p className="text-[var(--color-text-secondary)] max-w-[58ch]">
                Выберите материал по фактуре. Термин знать не нужно — свою вещь
                вы узнаете глазами.
              </p>
            </div>
            <div role="radiogroup" aria-label="Материал вещи" className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {MATERIALS.map(m => (
                <MaterialCard key={m} material={m} checked={false} onSelect={c.selectMaterial} />
              ))}
            </div>
            <Button styleName="ghost" onClick={() => setIdentifying(true)}>
              Не знаю свой материал →
            </Button>
          </>
        ) : (
          <>
            <SelectedMaterial material={c.material} onChange={c.reset} />

            <div className="flex flex-col gap-4 items-start">
              <Tag>Шаг 2 из 4</Tag>
              <h1 className="text-[length:var(--font-size-h2)] leading-[var(--line-height-h2)]">Что нужно сделать?</h1>
              <p className="text-[var(--color-text-secondary)] max-w-[62ch]">
                Можно выбрать несколько. Помеченные задачи материалу не подходят —
                отметьте, и мы объясним почему и что вместо них.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {TASKS.map(task => {
                const conflict = conflictFor(c.material!, task)
                const checked = c.tasks.includes(task)
                const already = conflict ? c.items.some(i => i.sku === conflict.insteadSku) : false
                return (
                  <TaskRow
                    key={task}
                    task={task}
                    checked={checked}
                    marked={conflict !== null}
                    markLabel={conflict ? 'не для этого материала' : undefined}
                    explanation={checked && conflict ? conflict.reason : undefined}
                    substitute={checked && conflict ? {
                      title: bySku(conflict.insteadSku).title,
                      note: already
                        ? 'Он уже в вашем наборе — добавлять отдельно не нужно.'
                        : 'Мы добавили его в набор.',
                    } : undefined}
                    onToggle={next => c.toggleTask(task, next)}
                  />
                )
              })}
            </div>

            <div className="flex flex-col gap-4">
              <p className="label text-[var(--color-text-secondary)]">Как часто носите</p>
              <div role="radiogroup" aria-label="Частота носки" className="flex flex-wrap gap-3">
                {FREQUENCY.map(f => (
                  <button
                    key={f.value}
                    role="radio"
                    type="button"
                    aria-checked={c.frequency === f.value}
                    onClick={() => c.setFrequency(f.value)}
                    className={
                      'min-h-11 px-5 border cursor-pointer font-semibold transition-colors duration-200 ' +
                      (c.frequency === f.value
                        ? 'bg-[var(--color-accent-base)] text-[var(--color-text-on-accent)] border-[var(--color-accent-base)]'
                        : 'bg-[var(--color-surface)] border-[var(--color-border-default)]')
                    }
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <aside className="lg:sticky lg:top-6 p-6 sm:p-8 bg-[var(--color-surface)] border border-[var(--color-border-default)] flex flex-col gap-5">
        <p className="label text-[var(--color-text-secondary)]">Ваш набор</p>
        <hr className="border-0 h-px bg-[var(--color-border-divider)]" />

        {!hasKit ? (
          <>
            <p className="font-semibold">Здесь появится то, что нужно именно вашей вещи.</p>
            <p className="text-[var(--color-text-secondary)]">
              Обычно две-три позиции. Мы посчитаем, на сколько их хватит при вашей
              частоте носки, и не предложим того, что материалу навредит.
            </p>
          </>
        ) : (
          <>
            <div className="flex flex-col divide-y divide-[var(--color-border-divider)]">
              {c.items.map(p => (
                <KitLine key={p.sku} product={p} onRemove={() => c.remove(p.sku)} onRestore={() => c.restore(p.sku)} />
              ))}
              {c.removed.map(sku => (
                <KitLine key={sku} product={bySku(sku)} removed onRemove={() => {}} onRestore={() => c.restore(sku)} />
              ))}
            </div>

            {c.schedule ? (
              <div>
                <p className="label text-[var(--color-text-secondary)]">Хватит примерно на</p>
                {/* Число меняется на глазах при снятии позиции: без табличных
                    цифр строка дёргалась бы на каждом пересчёте. */}
                <p className="mt-1 font-[family-name:var(--font-family-display)] font-semibold text-[length:var(--font-size-h2)] leading-[var(--line-height-h2)] tnum">
                  {c.schedule.months} {months(c.schedule.months)}
                </p>
                <p className="mt-2 text-[var(--color-text-secondary)]">
                  Первым кончится {bySku(c.schedule.firstToRunOut).title.toLowerCase()}.
                </p>
              </div>
            ) : (
              <p className="text-[var(--color-text-secondary)]">
                В наборе нет расходников — напоминать не о чем.
              </p>
            )}

            {/* Выключено по умолчанию: подписка, включённая за покупателя, —
                тёмный паттерн, и кейс про честный повторный заказ им не торгует. */}
            {c.schedule && (
              <div className="pt-4 border-t border-[var(--color-border-divider)]">
                <Toggle
                  checked={refill}
                  onChange={setRefill}
                  label={`Напоминать каждые ${c.schedule.months} ${months(c.schedule.months)}`}
                  note="Мы ничего не спишем и не пришлём, пока вы сами не включите"
                />
              </div>
            )}

            <div className="pt-4 border-t border-[var(--color-border-divider)] flex items-center gap-4">
              <p className="flex-1 font-semibold">Итого</p>
              <p className="font-[family-name:var(--font-family-display)] font-semibold text-[length:var(--font-size-h3)] tnum">
                {formatUah(total)}
              </p>
            </div>
            <Button onClick={() => { c.items.forEach(p => add(p.sku, 1)); navigate('/cart') }}>
              В корзину
            </Button>
          </>
        )}
      </aside>
    </section>
  )
}
