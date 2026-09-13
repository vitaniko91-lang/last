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
            caps
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
        className="px-5 sm:px-20 py-16 sm:py-30"
      >
        <Reveal>
          <h2 className="max-w-[20ch]">Выбирать между составами не придётся</h2>
          <div className="mt-12 grid gap-10 sm:gap-8 sm:grid-cols-3">
            {STEPS.map(([title, text], i) => (
              <div key={title} className="relative pt-8 border-t border-[var(--color-border-default)]">
                {/* Номер шага — приём структуры: он ведёт взгляд по трём
                    колонкам, которые иначе читаются как три равных абзаца. */}
                <span
                  aria-hidden
                  className="absolute right-0 top-6 select-none font-[family-name:var(--font-family-display)] font-semibold leading-none text-[var(--color-border-divider)]"
                  style={{ fontSize: '3.5rem' }}
                >
                  {`0${i + 1}`}
                </span>
                <p className="font-[family-name:var(--font-family-display)] font-semibold text-[length:var(--font-size-h3)] leading-[var(--line-height-h3)] tracking-[var(--tracking-display)]">
                  {title}
                </p>
                <p className="mt-3 max-w-[42ch] text-[var(--color-text-secondary)]">{text}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <Reveal>
        <section className="px-5 sm:px-20 py-16 sm:py-30 bg-[var(--color-inverse)] text-[var(--color-text-on-inverse)]">
          <SectionHead
            caps
            inverse
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

function SectionHead({ label, title, lede, caps, inverse }: { label: string; title: string; lede: string; caps?: boolean; inverse?: boolean }) {
  return (
    <div className="max-w-[52ch]">
      {/* inverse — секция на тёмном: акцент как текст берёт accent/on-inverse
          (base там 2.4:1), вторичный текст — свою роль на тёмном. */}
      <p className={inverse ? 'label text-[var(--color-accent-on-inverse)]' : 'label text-[var(--color-accent-base)]'}>{label}</p>
      {/* caps — регистр референса (Spyker): капс с положительным трекингом,
          там, где секция продолжается главами в том же регистре. */}
      <h2 className={caps ? 'mt-4 uppercase tracking-[0.04em]' : 'mt-4'}>{title}</h2>
      <p className={inverse ? 'mt-4 text-[var(--color-text-secondary-on-inverse)]' : 'mt-4 text-[var(--color-text-secondary)]'}>{lede}</p>
    </div>
  )
}
