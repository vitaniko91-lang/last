import type { ReactNode } from 'react'

type Tone = 'neutral' | 'accent' | 'conflict'

const TONES: Record<Tone, string> = {
  neutral: 'bg-[var(--color-surface-alpha-subtle)] text-[var(--color-text-secondary)]',
  accent: 'bg-[var(--color-surface-alpha-accent)] text-[var(--color-accent-base)]',
  // Конфликт — предупреждение с заменой, а не ошибка формы: контурный warning,
  // а не заливка error. Синий info здесь был бы враньём: это не сообщение системы.
  conflict:
    'bg-[var(--color-surface)] text-[var(--color-semantic-warning)] ' +
    'border border-[var(--color-semantic-warning)]',
}

export function Tag({ children, tone = 'neutral' }: { children: ReactNode; tone?: Tone }) {
  return <span className={`label inline-block px-3 py-2 ${TONES[tone]}`}>{children}</span>
}
