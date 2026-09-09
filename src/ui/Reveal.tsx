import { useEffect, useRef, useState, type ReactNode } from 'react'
import { DURATION, EASE_OUT, usePrefersReducedMotion } from '../lib/motion'

/**
 * Появление СЕКЦИИ целиком, не поэлементно: каскад задержек на каждом ребёнке
 * читается как «анимировали всё, что шевелится», и ровно это делает страницу
 * похожей на шаблон.
 *
 * Показываем и тогда, когда секция уже ушла ВЫШЕ кадра: мгновенный скролл —
 * переход по якорю, восстановленная позиция, `scrollTo` — не рендерит
 * промежуточные положения, поэтому перепрыгнутая секция не получает ни одного
 * пересечения и осталась бы скрытой навсегда.
 *
 * Переход объявляется только на показанном состоянии, иначе элемент сперва
 * проиграл бы его в обратную сторону, вставая в исходное.
 */
export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (reduced) return setShown(true)
    const el = ref.current
    if (!el || typeof IntersectionObserver !== 'function') return setShown(true)

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return
        if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
          setShown(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduced])

  const on = shown || reduced
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: on ? 1 : 0,
        translate: on ? '0 0' : '0 20px',
        transitionProperty: on ? 'opacity, translate' : 'none',
        transitionDuration: `${DURATION.slow}ms`,
        transitionTimingFunction: EASE_OUT,
      }}
    >
      {children}
    </div>
  )
}
