import type { ReactNode } from 'react'

type Style = 'default' | 'subtle' | 'selected'

const STYLES: Record<Style, string> = {
  default: 'bg-[var(--color-surface)] border border-[var(--color-border-default)]',
  subtle: 'bg-[var(--color-surface-alpha-subtle)] border border-[var(--color-border-divider)]',
  // Полная насыщенность 2px: альфа-граница 30% на светлом ground читается серой
  // и не отличается от обычной карточки.
  selected: 'bg-[var(--color-surface)] border-2 border-[var(--color-accent-base)]',
}

export function Card({ children, styleName = 'default', className = '' }: {
  children: ReactNode; styleName?: Style; className?: string
}) {
  return <div className={`${STYLES[styleName]} ${className}`}>{children}</div>
}
