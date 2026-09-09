import { useEffect, useState } from 'react'

/** Токены из ~/.claude/rules/motion-design.md. Здесь — только те, что нужны сцене. */
export const DURATION = {
  fast: 200,
  normal: 400,
  slow: 600,
  dramatic: 1000,
} as const

/** Такт неподвижности до первого движения. Пауза — не задержка элемента, а состояние сцены. */
export const HOLD = 900

export const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)'

/**
 * Спрашиваем систему в JS, а не только в CSS: глобальная CSS-глушилка не
 * останавливает то, чем управляет скрипт, и создаёт видимость поддержки.
 * Подписка живая — пользователь может переключить настройку при открытой странице.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  )

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  return reduced
}

/**
 * Одна сцена — одна лестница тактов. Возвращает номер достигнутого такта.
 *
 * Почему не по IntersectionObserver на каждый элемент: пять наблюдателей на
 * одном экране дают stagger-спам, который читается как «анимировали всё, что
 * шевелится». Герой виден при загрузке, поэтому сцену ведёт время.
 *
 * При prefers-reduced-motion сцена не проигрывается вовсе: сразу последний
 * такт. Это спокойный вариант, а не «то же самое за 0.001s».
 */
export function useStage(marks: readonly number[]): number {
  const reduced = usePrefersReducedMotion()
  const [stage, setStage] = useState(0)

  useEffect(() => {
    if (reduced) {
      setStage(marks.length)
      return
    }
    const timers = marks.map((at, i) => window.setTimeout(() => setStage(i + 1), at))
    return () => timers.forEach(clearTimeout)
    // marks — литерал модуля, стабилен по ссылке у всех вызывающих
  }, [reduced, marks])

  return reduced ? marks.length : stage
}

/**
 * Счётчик от нуля к цели. Число обязано стоять в шрифте с табличными цифрами
 * (класс `tnum`): у пропорциональных цифр разная ширина, и каждый тик двигал бы
 * строку — анимация сама становилась бы причиной смещения вёрстки.
 *
 * При prefers-reduced-motion возвращает цель сразу: считать нечего.
 */
export function useCountUp(target: number, run: boolean, ms = 1500): number {
  const reduced = usePrefersReducedMotion()
  const [value, setValue] = useState(reduced ? target : 0)

  useEffect(() => {
    if (reduced) {
      setValue(target)
      return
    }
    if (!run) return
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms)
      // ease-out: скорость убывает к концу, как во всех появлениях системы
      setValue(Math.round(target * (1 - Math.pow(1 - t, 3))))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, run, ms, reduced])

  return value
}
