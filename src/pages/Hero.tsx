import { Link } from 'react-router'
import { MATERIALS } from '../kit/rules'
import { MATERIAL_INFO } from '../lib/materials'
import { DURATION, EASE_OUT, HOLD, useStage } from '../lib/motion'
import { Button } from '../ui/Button'

/**
 * Такты сцены. Первый — не ноль: до первого движения держится пауза, и именно
 * она делает следующий кадр событием. Дальше плита проявляется, заголовок,
 * текст с кнопками, плита с образцами. Четыре такта, одна сцена — не четыре
 * независимых появления.
 */
const MARKS = [HOLD, HOLD + 240, HOLD + 460, HOLD + 700] as const

/** Столько шагов в конфигураторе («Шаг 1 из 4»). Кнопка обещает ровно их. */
const QUESTIONS = 4

/**
 * Герой — кадр: макро масляной кожи во весь экран под тёплым ключевым светом,
 * заголовок внизу слева, четыре образца материалов стоят на плите справа.
 * Образцы — не иллюстрация: это первый вопрос конфигуратора, «узнайте свою
 * вещь глазами», и каждый ведёт туда с уже выбранным материалом.
 */
export function Hero() {
  const stage = useStage(MARKS)

  return (
    <section className="relative isolate overflow-hidden bg-[var(--color-scene)] text-[var(--color-text-on-inverse)]">
      {/* Плита — LCP-элемент: объявлена в разметке, грузится eager и с высоким
          приоритетом. Ленивая загрузка здесь откладывала бы самый важный запрос.
          Кадр 1778 в ширину — максимум, что отдаёт сток для этого снимка;
          на экранах шире он тянется, но под градиентом и виньеткой это не
          читается. Съёмка своего кадра остаётся в плане. */}
      <img
        src="/hero/hero-oiled-1600.avif"
        srcSet="/hero/hero-oiled-1000.avif 1000w, /hero/hero-oiled-1600.avif 1600w, /hero/hero-oiled-1778.avif 1778w"
        sizes="100vw"
        alt=""
        width={1778}
        height={778}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 -z-20 size-full object-cover object-[50%_40%]"
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
      {/* Затемнение снизу под текст и плиту, слева под заголовок, и пятно
          ключевого света справа сверху. Декоративное: границ и состояний оно
          не несёт. Цвета — токены через color-mix, не литералы. */}
      <div aria-hidden className="absolute inset-0 -z-10 hero-shade" />

      <div className="relative px-5 sm:px-20 pt-28 sm:pt-36 pb-16 sm:pb-20 min-h-[100svh] grid items-end gap-x-12 gap-y-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div className="grid gap-6 justify-items-start">
          <h1
            className="max-w-[18ch] text-[var(--color-text-on-inverse)]"
            style={rise(stage >= 2, DURATION.slow)}
          >
            Уход за вещами, которые вы не собираетесь менять
          </h1>
          <div className="grid gap-6 justify-items-start" style={rise(stage >= 3, DURATION.normal)}>
            <p className="max-w-[42ch] text-[var(--color-text-secondary-on-inverse)]">
              Четыре вопроса — и мы соберём набор под вашу вещь, посчитаем, на
              сколько его хватит, и не предложим того, что материалу навредит.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button href="/configurator" meta={`${QUESTIONS} вопроса`}>Подобрать уход</Button>
              <Button href="/catalogue" styleName="secondary">Смотреть каталог</Button>
            </div>
          </div>
        </div>

        {/* Плита с образцами. Подписи — отдельным рядом под плитой, не внутри
            наклонённых плиток: в 3D-контексте подпись под плиткой уходит за
            переднюю грань плиты и обрезается. Имя материала несёт alt. */}
        <div
          className="relative justify-self-center lg:justify-self-end w-full max-w-[560px] pb-14 hero-stage"
          style={rise(stage >= 4, DURATION.normal)}
        >
          <div className="relative h-24 hero-plinth">
            <div aria-hidden className="hero-plinth-top" />
            <div aria-hidden className="hero-plinth-front" />
            <div aria-hidden className="hero-contact" />
            <ul aria-hidden className="hero-labels hidden sm:flex">
              {MATERIALS.map((m) => <li key={m}>{MATERIAL_INFO[m].title}</li>)}
            </ul>
            <ul className="hero-tiles">
              {MATERIALS.map((m) => (
                <li key={m}>
                  <Link to={`/configurator?material=${m}`} className="hero-tile block">
                    <img
                      src={`/materials/${m}-800.avif`}
                      srcSet={`/materials/${m}-400.avif 400w, /materials/${m}-800.avif 800w`}
                      sizes="(max-width: 640px) 22vw, 132px"
                      alt={MATERIAL_INFO[m].title}
                      width={800}
                      height={800}
                      loading="eager"
                      decoding="async"
                      className="block size-full object-cover"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
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
