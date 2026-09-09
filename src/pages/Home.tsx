import { Link } from 'react-router'
import { CATALOGUE } from '../kit/catalogue'
import { MATERIALS } from '../kit/rules'
import { MATERIAL_INFO } from '../lib/materials'
import { formatRub } from '../lib/money'
import { Hero } from './Hero'
import { MaterialTexture } from '../ui/MaterialTexture'

const STEPS: [string, string][] = [
  ['Четыре вопроса', 'Материал, что нужно сделать, как часто носите. Ни одного термина — свою вещь вы узнаете глазами.'],
  ['Набор', 'Две-три позиции вместо пяти. Несовместимое объясняем и предлагаем замену, а не прячем из выдачи.'],
  ['Напоминаем', 'Считаем, когда средство кончится, и предлагаем повторить. Выключено по умолчанию.'],
]

export function Home() {
  return (
    <>
      <Hero />

      <section className="px-5 sm:px-20 pb-16 sm:pb-30">
        <h2>Начните с материала вашей вещи</h2>
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {MATERIALS.map(m => (
            <Link
              key={m}
              to={`/configurator?material=${m}`}
              className="flex flex-col gap-4 p-4 bg-[var(--color-surface)] border border-[var(--color-border-default)] hover:border-[var(--color-accent-base)] transition-colors duration-200"
            >
              <MaterialTexture material={m} sizes="(max-width: 640px) 45vw, 280px" />
              <span className="font-[family-name:var(--font-family-display)] font-bold text-[length:var(--font-size-h3)] leading-[var(--line-height-h3)] tracking-[var(--tracking-display)]">
                {MATERIAL_INFO[m].title}
              </span>
              <span className="text-[var(--color-text-secondary)]">{MATERIAL_INFO[m].hint}</span>
            </Link>
          ))}
        </div>
      </section>

      <section id="how" className="px-5 sm:px-20 py-16 sm:py-30 bg-[var(--color-inverse)] text-[var(--color-text-on-inverse)]">
        <h2 className="max-w-[20ch]">Выбирать между составами не придётся</h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {STEPS.map(([title, text]) => (
            <div key={title}>
              <p className="font-semibold">{title}</p>
              {/* Вторичный текст на инверсном фоне берёт собственную роль:
                  обычный text/secondary даёт здесь 2.84:1 и не проходит AA. */}
              <p className="mt-2 text-[var(--color-text-secondary-on-inverse)]">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 sm:px-20 py-16 sm:py-30">
        <h2>Линейка</h2>
        <ul className="mt-8 bg-[var(--color-surface)] border border-[var(--color-border-default)]">
          {CATALOGUE.map((p, i) => (
            <li key={p.sku} className={i > 0 ? 'border-t border-[var(--color-border-divider)]' : ''}>
              <Link to={`/product/${p.sku}`} className="flex items-center gap-4 px-4 sm:px-6 py-4">
                <span className="flex-1 min-w-0">
                  <span className="block font-semibold">{p.title}</span>
                  <span className="block text-[var(--color-text-secondary)]">{p.role}</span>
                </span>
                <span className="font-semibold tnum shrink-0">{formatRub(p.priceRub)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
