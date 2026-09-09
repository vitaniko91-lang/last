import { Link } from 'react-router'
import { CATALOGUE } from '../kit/catalogue'
import { MATERIALS } from '../kit/rules'
import { applicabilityFor } from '../lib/applicability'
import { MATERIAL_INFO } from '../lib/materials'
import { formatRub } from '../lib/money'
import { MaterialTexture } from '../ui/MaterialTexture'
import { Reveal } from '../ui/Reveal'
import { Hero } from './Hero'

const STEPS: [string, string][] = [
  ['Четыре вопроса', 'Материал, что нужно сделать, как часто носите. Ни одного термина — свою вещь вы узнаете глазами.'],
  ['Набор', 'Две-три позиции вместо пяти. Несовместимое объясняем и предлагаем замену, а не прячем из выдачи.'],
  ['Напоминаем', 'Считаем, когда средство кончится, и предлагаем повторить. Выключено по умолчанию.'],
]

export function Home() {
  return (
    <>
      <Hero />

      <Reveal>
        <section className="px-5 sm:px-20 py-16 sm:py-30">
          <SectionHead
            label="Шаг первый"
            title="Начните с материала вашей вещи"
            lede="Четыре признака, каждый виден глазами или проверяется пальцем. Термины не нужны."
          />
          {/* Не плитка из четырёх равных карточек, а редакционная пара строк:
              сторона изображения чередуется. Внутри ячейки ровно один
              фокусируемый элемент — ссылка целиком, — поэтому перестановка
              картинки и текста не спорит с порядком обхода. */}
          <div className="mt-10 sm:mt-12 grid gap-px bg-[var(--color-border-divider)] sm:grid-cols-2">
            {MATERIALS.map((m, i) => (
              <Link
                key={m}
                to={`/configurator?material=${m}`}
                className={
                  'group flex flex-col sm:flex-row gap-5 p-5 sm:p-6 bg-[var(--color-ground)] ' +
                  'hover:bg-[var(--color-surface)] transition-colors duration-200 ' +
                  (i % 2 === 1 ? 'sm:flex-row-reverse' : '')
                }
              >
                <span className="block w-full sm:w-[42%] shrink-0">
                  <MaterialTexture material={m} sizes="(max-width: 640px) 90vw, 22vw" />
                </span>
                <span className="flex flex-col sm:justify-center min-w-0">
                  <span className="font-[family-name:var(--font-family-display)] font-bold text-[length:var(--font-size-h3)] leading-[var(--line-height-h3)] tracking-[var(--tracking-display)]">
                    {MATERIAL_INFO[m].title}
                  </span>
                  <span className="mt-2 text-[var(--color-text-secondary)]">
                    {MATERIAL_INFO[m].hint}
                  </span>
                  <span className="mt-4 inline-flex items-center gap-2 font-semibold text-[var(--color-accent-base)]">
                    Собрать набор
                    <span
                      aria-hidden
                      className="transition-[translate] duration-200 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      </Reveal>

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
                  className="absolute right-0 top-6 select-none font-[family-name:var(--font-family-display)] font-extrabold leading-none text-[#F2F1ED14]"
                  style={{ fontSize: '3.5rem' }}
                >
                  {`0${i + 1}`}
                </span>
                <p className="font-[family-name:var(--font-family-display)] font-bold text-[length:var(--font-size-h3)] leading-[var(--line-height-h3)] tracking-[var(--tracking-display)]">
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
          <ul className="mt-10 sm:mt-12 border-t border-[var(--color-border-divider)]">
            {CATALOGUE.map(p => {
              const { fits } = applicabilityFor(p.sku)
              return (
                <li key={p.sku} className="border-b border-[var(--color-border-divider)]">
                  <Link
                    to={`/product/${p.sku}`}
                    className="group flex items-center gap-4 sm:gap-8 py-5 sm:py-6 transition-colors duration-200 hover:bg-[var(--color-surface)]"
                  >
                    <span className="flex-1 min-w-0">
                      <span className="block font-[family-name:var(--font-family-display)] font-bold text-[length:var(--font-size-h3)] leading-[var(--line-height-h3)] tracking-[var(--tracking-display)]">
                        {p.title}
                      </span>
                      <span className="mt-1 block text-[var(--color-text-secondary)]">{p.role}</span>
                    </span>
                    {/* Фактуры вместо фотографии продукта: продукта физически
                        нет, а материалы настоящие. Список берётся из матрицы,
                        а не проставляется руками. Подпись одна на всю группу —
                        четыре подряд озвученные картинки читались бы как мусор. */}
                    {/* Колодки и краска для уреза не привязаны к материалу —
                        у них список пуст по существу, а не по ошибке. Пустое
                        место на их строке читалось бы как дефект, поэтому факт
                        проговаривается словами. */}
                    {fits.length === 0 ? (
                      <span className="hidden md:block shrink-0 text-[length:var(--font-size-caption)] text-[var(--color-text-secondary)]">
                        не зависит от материала
                      </span>
                    ) : (
                    <span
                      role="img"
                      aria-label={`подходит: ${fits.map(m => MATERIAL_INFO[m].short).join(', ')}`}
                      className="hidden md:flex items-center gap-1.5 shrink-0"
                    >
                      {fits.map(m => (
                        <img
                          key={m}
                          src={`/materials/${m}-400.avif`}
                          alt=""
                          width={400}
                          height={400}
                          loading="lazy"
                          decoding="async"
                          className="size-7 object-cover"
                        />
                      ))}
                    </span>
                    )}
                    <span className="tnum font-semibold shrink-0 w-24 text-right">
                      {formatRub(p.priceRub)}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
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
