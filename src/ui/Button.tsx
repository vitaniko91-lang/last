import { Link } from 'react-router'
import type { ReactNode } from 'react'

type Style = 'primary' | 'secondary' | 'ghost'

const BASE =
  'inline-flex items-center justify-center gap-2 min-h-10 px-6 py-4 ' +
  'font-semibold text-center cursor-pointer transition-colors duration-200'

const STYLES: Record<Style, string> = {
  primary:
    'bg-[var(--color-accent-base)] text-[var(--color-text-on-accent)] ' +
    'hover:bg-[var(--color-accent-dark)]',
  secondary:
    'bg-[var(--color-surface)] text-[var(--color-text-primary)] ' +
    'border border-[var(--color-border-default)] hover:border-[var(--color-accent-base)]',
  ghost:
    'text-[var(--color-accent-base)] px-0 hover:text-[var(--color-accent-dark)]',
}

interface Props {
  children: ReactNode
  styleName?: Style
  href?: string
  onClick?: () => void
  /** Недоступно сейчас — но остаётся достижимым с клавиатуры и объясняется
   *  по нажатию. `disabled` убрал бы элемент из порядка обхода, и пользователь
   *  не узнал бы, почему кнопка не работает. */
  unavailable?: boolean
  className?: string
  type?: 'button' | 'submit'
}

export function Button({
  children, styleName = 'primary', href, onClick, unavailable, className = '', type = 'button',
}: Props) {
  const cls = `${BASE} ${STYLES[styleName]} ${unavailable ? 'opacity-60' : ''} ${className}`
  if (href) {
    const external = href.startsWith('http')
    return external
      ? <a href={href} target="_blank" rel="noreferrer" className={cls}>{children}</a>
      : <Link to={href} className={cls}>{children}</Link>
  }
  return (
    <button type={type} className={cls} onClick={onClick} aria-disabled={unavailable || undefined}>
      {children}
    </button>
  )
}
