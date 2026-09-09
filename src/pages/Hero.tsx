import { Link } from 'react-router'
import { Button } from '../ui/Button'
import { DURATION, EASE_OUT, HOLD, useCountUp, useStage } from '../lib/motion'

/**
 * Такты сцены. Первый — не ноль: до первого движения держится пауза, и именно
 * она делает следующий кадр событием. Дальше заголовок, текст с кнопками,
 * карточки и нижняя полоса с числами. Пять тактов, одна сцена — не пять
 * независимых появлений.
 */
const MARKS = [HOLD, HOLD + 240, HOLD + 460, HOLD + 660] as const

/** Числа берутся из движка, а не придумываются: 9 позиций, 4 вопроса, 6 отказов. */
const FACTS: readonly [number, string, string][] = [
  [9, 'позиций', 'вся линейка, без вариантов «на всякий случай»'],
  [4, 'вопроса', 'столько нужно, чтобы собрать набор'],
  [6, 'отказов', 'пар «материал × задача», где мы говорим «нет»'],
]

export function Hero() {
  const stage = useStage(MARKS)

  return (
    <section className="relative isolate overflow-hidden bg-[var(--color-inverse)] text-[var(--color-text-on-inverse)]">
      {/* Плита — LCP-элемент: объявлена в разметке, грузится eager и с высоким
          приоритетом. Ленивая загрузка здесь откладывала бы самый важный запрос. */}
      <img
        src="/hero/hero-1600.avif"
        srcSet="/hero/hero-1000.avif 1000w, /hero/hero-1600.avif 1600w, /hero/hero-2400.avif 2400w"
        sizes="100vw"
        alt=""
        width={2400}
        height={1050}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 -z-20 size-full object-cover"
        style={{
          opacity: stage >= 1 ? 1 : 0.55,
          scale: stage >= 1 ? '1' : '1.04',
          // Свойство названо ровно то, которое меняется: `scale` в современном
          // CSS самостоятельное, и `transition-property: transform` его не ловит.
          transitionProperty: 'opacity, scale',
          transitionDuration: `${DURATION.dramatic}ms`,
          transitionTimingFunction: EASE_OUT,
        }}
      />
      {/* Затемнение слева под заголовок и снизу — под полосу с числами.
          Декоративное: границ и состояний оно не несёт. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(100deg, #0E1214EB 0%, #0E1214B8 34%, #0E12144D 62%, #0E12141A 100%),' +
            'linear-gradient(to top, #0E1214F2 0%, #0E121400 30%)',
        }}
      />
      {/* Водяной знак — приём структуры, не носитель смысла: то же слово стоит
          рядом настоящим заголовком в шапке. */}
      <span
        aria-hidden
        className="pointer-events-none select-none absolute -bottom-[0.32em] -left-[0.05em] -z-10 font-[family-name:var(--font-family-display)] font-extrabold leading-none tracking-[-0.04em] text-[#F2F1ED0F]"
        style={{ fontSize: 'clamp(9rem, 30vw, 26rem)' }}
      >
        LAST
      </span>

      <div className="relative px-5 sm:px-20 pt-28 sm:pt-40 pb-10 sm:pb-14 grid gap-x-6 gap-y-10 lg:grid-cols-12 lg:items-start min-h-[min(70svh,640px)]">
        <h1
          className="lg:col-span-7 lg:row-start-1 max-w-[15ch] text-[var(--color-text-on-inverse)]"
          style={rise(stage >= 1, DURATION.slow)}
        >
          Уход за вещами, которые вы не собираетесь менять
        </h1>

        <div
          className="lg:col-span-4 lg:row-start-2 self-end"
          style={rise(stage >= 2, DURATION.normal)}
        >
          <p className="max-w-[46ch] text-[var(--color-text-secondary-on-inverse)]">
            Четыре вопроса — и мы соберём набор под вашу вещь, посчитаем, на
            сколько его хватит, и не предложим того, что вашему материалу навредит.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button href="/configurator">Подобрать уход</Button>
            <Button href="/catalogue" styleName="secondary">Смотреть каталог</Button>
          </div>
        </div>

        {/* Правая колонка — объект кадра, а не иллюстрация рядом с текстом.
            Карточки лежат на его левом крае: это связывает две половины сетки,
            иначе они читаются как две несвязанные колонки. */}
        <div
          className="relative lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1 lg:-mr-20 lg:mt-2"
          style={rise(stage >= 3, DURATION.normal)}
        >
          <span className="relative block">
          <img
            src="/materials/patent-1200.avif"
            srcSet="/materials/patent-800.avif 800w, /materials/patent-1200.avif 1200w"
            sizes="(max-width: 1024px) 100vw, 46vw"
            alt=""
            width={1200}
            height={1200}
            loading="eager"
            decoding="async"
            className="w-full h-[46vh] lg:h-[min(60svh,560px)] object-cover"
          />
          <span
            aria-hidden
            className="absolute inset-0"
            style={{ background: 'linear-gradient(90deg, #0E121400 0%, #0E121426 58%, #0E12148C 100%)' }}
          />
          {/* Патиновая линия по верхнему краю плиты: единственный акцент в
              правой половине — линия, а не заливка. Слева её закрыли бы карточки. */}
          <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-[var(--color-accent-base)]" />
          </span>

          <div className="mt-4 lg:mt-0 lg:absolute lg:-left-24 lg:bottom-8 lg:w-[24.5rem] flex flex-col gap-4">
            <HeroCard
              to="/configurator"
              eyebrow="Шаг первый"
              title="Определим материал"
              text="По тому, что видно и на ощупь. Без терминов — вещь вы узнаете глазами."
              texture="smooth"
            />
            <HeroCard
              to="/case"
              eyebrow="То, чего не делают"
              title="Скажем «нет»"
              text="Шесть пар, где средство навредит материалу. Объясняем причину и даём замену."
              texture="patent"
              accent
              className="lg:ml-10"
            />
          </div>
        </div>

      </div>

      <ul
        className="relative grid grid-cols-3 border-t border-[#F2F1ED1F] px-5 sm:px-20"
        style={rise(stage >= 4, DURATION.normal)}
      >
        {FACTS.map(([n, unit, note], i) => (
          <Fact key={unit} n={n} unit={unit} note={note} run={stage >= 4} first={i === 0} />
        ))}
      </ul>
    </section>
  )
}

/**
 * Появление одним движением: непрозрачность плюс сдвиг. Переход объявлен только
 * когда элемент уже показан — иначе он проигрывался бы и на постановке в
 * исходное состояние, то есть сначала в обратную сторону.
 */
function rise(shown: boolean, ms: number): React.CSSProperties {
  return {
    opacity: shown ? 1 : 0,
    translate: shown ? '0 0' : '0 18px',
    transitionProperty: shown ? 'opacity, translate' : 'none',
    transitionDuration: `${ms}ms`,
    transitionTimingFunction: EASE_OUT,
  }
}

function Fact({ n, unit, note, run, first }: {
  n: number; unit: string; note: string; run: boolean; first: boolean
}) {
  const value = useCountUp(n, run)
  return (
    <li className={`py-5 sm:py-6 ${first ? '' : 'border-l border-[#F2F1ED1F] pl-4 sm:pl-8'}`}>
      <p className="flex items-baseline gap-2">
        <span className="tnum font-[family-name:var(--font-family-display)] font-extrabold text-[length:var(--font-size-h2)] leading-none tracking-[var(--tracking-display)]">
          {value}
        </span>
        <span className="text-[var(--color-text-secondary-on-inverse)]">{unit}</span>
      </p>
      {/* На 390 три колонки пояснений ломаются на четыре строки каждая и
          читаются как шум. Число с единицей несут сообщение сами; пояснение —
          поддержка, и оно возвращается там, где для него есть ширина. */}
      <p className="hidden sm:block mt-2 max-w-[28ch] text-[length:var(--font-size-caption)] leading-[var(--line-height-caption)] text-[var(--color-text-secondary-on-inverse)]">
        {note}
      </p>
    </li>
  )
}

function HeroCard({ to, eyebrow, title, text, texture, accent, className = '' }: {
  to: string; eyebrow: string; title: string; text: string
  texture: string; accent?: boolean; className?: string
}) {
  return (
    <Link
      to={to}
      className={
        'group flex gap-4 p-4 sm:p-5 backdrop-blur-md ' +
        'bg-[#0E1214F0] border transition-colors duration-200 ' +
        (accent
          ? 'border-[var(--color-accent-base)] hover:border-[#6E9B94]'
          : 'border-[#F2F1ED26] hover:border-[#F2F1ED59]') +
        ' ' + className
      }
    >
      <img
        src={`/materials/${texture}-400.avif`}
        alt=""
        width={400}
        height={400}
        loading="lazy"
        decoding="async"
        className="size-16 sm:size-20 shrink-0 object-cover"
      />
      <span className="min-w-0">
        <span className="label block text-[var(--color-text-secondary-on-inverse)]">{eyebrow}</span>
        <span className="mt-1 block font-[family-name:var(--font-family-display)] font-bold text-[length:var(--font-size-h3)] leading-[var(--line-height-h3)] tracking-[var(--tracking-display)]">
          {title}
        </span>
        <span className="mt-2 block text-[length:var(--font-size-caption)] leading-[var(--line-height-caption)] text-[var(--color-text-secondary-on-inverse)]">
          {text}
        </span>
      </span>
    </Link>
  )
}
