import { Reveal } from '../ui/Reveal'
import { Hero } from './Hero'
import { MaterialsStory } from './home/MaterialsStory'
import { RangePlates } from './home/RangePlates'

const STEPS: [string, string][] = [
  ['Четыре вопроса', 'Материал, что нужно сделать, как часто носите. Ни одного термина — свою вещь вы узнаете глазами.'],
  ['Набор', 'Две-три позиции вместо пяти. Несовместимое объясняем и предлагаем замену, а не прячем из выдачи.'],
  ['Напоминаем', 'Считаем, когда средство кончится, и предлагаем повторить. Выключено по умолчанию.'],
]

export function Home() {
  return (
    <>
      <Hero />

      <section className="px-5 sm:px-20 py-16 sm:py-30">
        <Reveal>
          <SectionHead
            label="Шаг первый"
            title="Начните с материала вашей вещи"
            lede="Четыре признака, каждый виден глазами или проверяется пальцем. Термины не нужны."
          />
        </Reveal>
        {/* Без Reveal вокруг глав: у сцены свой наблюдатель, и второй поверх
            него дал бы два появления на одном экране. */}
        <div className="mt-10 sm:mt-12">
          <MaterialsStory />
        </div>
      </section>

      <section
        id="how"
        className="px-5 sm:px-20 py-16 sm:py-30 bg-[var(--color-inverse)] text-[var(--color-text-on-inverse)]"
      >
        <Reveal>
          <h2 className="max-w-[20ch]">Выбирать между составами не придётся</h2>
          <div className="mt-12 grid gap-10 sm:gap-8 sm:grid-cols-3">
            {STEPS.map(([title, text], i) => (
              <div key={title} className="relative pt-8 border-t border-[#F2F1ED26]">
                {/* Номер шага — приём структуры: он ведёт взгляд по трём
                    колонкам, которые иначе читаются как три равных абзаца. */}
                <span
                  aria-hidden
                  className="absolute right-0 top-6 select-none font-[family-name:var(--font-family-display)] font-semibold leading-none text-[#F2F1ED14]"
                  style={{ fontSize: '3.5rem' }}
                >
                  {`0${i + 1}`}
                </span>
                <p className="font-[family-name:var(--font-family-display)] font-semibold text-[length:var(--font-size-h3)] leading-[var(--line-height-h3)] tracking-[var(--tracking-display)]">
                  {title}
                </p>
                {/* Вторичный текст на инверсном фоне берёт собственную роль:
                    обычный text/secondary даёт здесь 2.84:1 и не проходит AA. */}
                <p className="mt-3 max-w-[42ch] text-[var(--color-text-secondary-on-inverse)]">{text}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <Reveal>
        <section className="px-5 sm:px-20 py-16 sm:py-30">
          <SectionHead
            label="Линейка"
            title="Девять позиций, ни одной лишней"
            lede="Под каждой — материалы, на которых средство работает. Список тот же, что у конфигуратора: второго источника нет."
          />
          <div className="mt-10 sm:mt-12">
            <RangePlates />
          </div>
        </section>
      </Reveal>
    </>
  )
}

function SectionHead({ label, title, lede }: { label: string; title: string; lede: string }) {
  return (
    <div className="max-w-[52ch]">
      <p className="label text-[var(--color-accent-base)]">{label}</p>
      <h2 className="mt-4">{title}</h2>
      <p className="mt-4 text-[var(--color-text-secondary)]">{lede}</p>
    </div>
  )
}
