import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { MATERIALS } from '../../kit/rules'
import { MATERIAL_INFO } from '../../lib/materials'
import { DURATION, EASE_OUT, usePrefersReducedMotion } from '../../lib/motion'
import { MaterialTexture } from '../../ui/MaterialTexture'

const NUMERALS = ['I', 'II', 'III', 'IV'] as const

/**
 * Четыре материала как четыре главы. Приём взят с референса (spykercars.com,
 * страница C8 Preliator): сцена стоит на месте, а рядом сменяются главы с
 * номером, заголовком и коротким текстом. У нас сцена — макро материала:
 * кадр меняется, когда в кадр входит следующая глава. Не иллюстрация к
 * тексту, а то, что владелец увидит на своей вещи.
 *
 * Активную главу задаёт IntersectionObserver по средней трети экрана — одна
 * подписка на все четыре, не по наблюдателю на элемент. Смена кадра — только
 * opacity; при prefers-reduced-motion кадр меняется без перехода.
 *
 * На узком экране сцены нет: у каждой главы своя фактура над текстом.
 */
export function MaterialsStory() {
  const reduced = usePrefersReducedMotion()
  const [active, setActive] = useState(0)
  // noUncheckedIndexedAccess: индекс из состояния не сужается сам.
  const current = MATERIALS[active] ?? 'smooth'
  const refs = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    if (typeof IntersectionObserver !== 'function') return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          const i = refs.current.indexOf(e.target as HTMLLIElement)
          if (i >= 0) setActive(i)
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    refs.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-8">
      <div className="hidden lg:block lg:col-span-6 lg:sticky lg:top-0 lg:h-[100svh] lg:py-10">
        <div data-scene className="relative h-full overflow-hidden bg-[var(--color-inverse)]">
          {MATERIALS.map((m, i) => (
            <img
              key={m}
              src={`/materials/${m}-1200.avif`}
              srcSet={`/materials/${m}-800.avif 800w, /materials/${m}-1200.avif 1200w`}
              sizes="46vw"
              alt=""
              width={1200}
              height={1200}
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
              className="absolute inset-0 size-full object-cover"
              style={{
                opacity: active === i ? 1 : 0,
                transitionProperty: reduced ? 'none' : 'opacity',
                transitionDuration: `${DURATION.slow}ms`,
                transitionTimingFunction: EASE_OUT,
              }}
            />
          ))}
          {/* Подпись кадра — номер и имя главы, как на референсе. Дублирует
              текст главы намеренно: сцена и глава читаются с разного расстояния. */}
          <p
            aria-hidden
            className="absolute left-8 bottom-8 flex items-baseline gap-4 text-[var(--color-text-on-inverse)]"
          >
            <span className="font-[family-name:var(--font-family-display)] text-[length:var(--font-size-h2)] leading-none">
              {NUMERALS[active]}
            </span>
            <span className="text-[length:var(--font-size-caption)] uppercase tracking-[var(--tracking-label)]">
              {MATERIAL_INFO[current].title}
            </span>
          </p>
        </div>
      </div>

      <ol className="lg:col-span-5 lg:col-start-8 m-0 p-0 list-none">
        {MATERIALS.map((m, i) => (
          <li
            key={m}
            ref={(el) => { refs.current[i] = el }}
            className="lg:min-h-[100svh] flex items-center border-t border-[var(--color-border-divider)] lg:border-0"
          >
            <Link
              to={`/configurator?material=${m}`}
              className="group block w-full py-10 lg:py-16"
            >
              <span className="block lg:hidden mb-6">
                <MaterialTexture material={m} sizes="90vw" />
              </span>
              <span className="flex items-baseline gap-4">
                <span className="font-[family-name:var(--font-family-display)] text-[length:var(--font-size-h2)] leading-none text-[var(--color-accent-base)]">
                  {NUMERALS[i]}
                </span>
                <span className="text-[length:var(--font-size-caption)] text-[var(--color-text-secondary)]">
                  из {NUMERALS[3]}
                </span>
              </span>
              {/* Заголовок главы капсом с положительным трекингом — приём
                  референса (56px / 500 / +2.24px у Spyker). Только главы:
                  остальные заголовки сайта остаются в обычном регистре. */}
              <span className="mt-6 block font-[family-name:var(--font-family-display)] font-medium text-[length:var(--font-size-h2)] leading-[var(--line-height-h2)] uppercase tracking-[0.04em] max-w-[18ch]">
                {MATERIAL_INFO[m].title}
              </span>
              <span className="mt-4 block max-w-[38ch] text-[var(--color-text-secondary)]">
                {MATERIAL_INFO[m].hint}
              </span>
              <span className="mt-8 inline-flex items-center gap-2 font-medium text-[var(--color-accent-base)]">
                Собрать набор
                <span aria-hidden className="transition-[translate] duration-200 group-hover:translate-x-1">→</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  )
}
