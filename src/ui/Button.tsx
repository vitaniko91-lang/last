import { Link } from 'react-router'
import type { ReactNode } from 'react'

type Style = 'primary' | 'secondary' | 'ghost'

const BASE =
  'relative inline-flex items-stretch justify-center min-h-10 ' +
  'font-medium text-center cursor-pointer'

/**
 * Две кнопки системы — два предмета, а не две заливки.
 * primary — стекло: акцент с альфой, размытие того, что за кнопкой, кромка
 *   и блик, скруглённые углы, луч на наведении; ячейка meta с обещанием
 *   («4 вопроса») отделена кромкой (.btn-glass).
 * secondary — рамка кадра: два уголка видоискателя, полная рамка проявляется
 *   на наведении; цвет из currentColor, поэтому одна и та же кнопка стоит
 *   и на сцене, и на бумаге (.btn-frame).
 */
const STYLES: Record<Style, string> = {
  primary: 'btn-glass text-[var(--color-text-on-accent)]',
  secondary: 'btn-frame text-current',
  ghost: 'text-[var(--color-accent-base)] px-0 py-4 hover:text-[var(--color-accent-dark)] transition-colors duration-200',
}

interface Props {
  children: ReactNode
  styleName?: Style
  href?: string
  onClick?: () => void
  /** Вторая ячейка пластины: что кнопка обещает — «4 вопроса», «2 минуты».
   *  Входит в имя ссылки: это часть обещания, а не декор. Только для primary. */
  meta?: ReactNode
  /** Недоступно сейчас — но остаётся достижимым с клавиатуры и объясняется
   *  по нажатию. `disabled` убрал бы элемент из порядка обхода, и пользователь
   *  не узнал бы, почему кнопка не работает. */
  unavailable?: boolean
  className?: string
  type?: 'button' | 'submit'
}

export function Button({
  children, styleName = 'primary', href, onClick, meta, unavailable, className = '', type = 'button',
}: Props) {
  const cls = `${BASE} ${STYLES[styleName]} ${unavailable ? 'opacity-60' : ''} ${className}`
  const inner = styleName === 'ghost'
    ? children
    : (
      <>
        {styleName === 'secondary' && <span data-rim aria-hidden="true" className="btn-frame-rim" />}
        <span className="inline-flex items-center px-6 py-4">{children}</span>
        {/* Пробел между ячейками — для имени ссылки: flex его не рисует,
            а читалка без него склеила бы «уход4 вопроса». */}
        {styleName === 'primary' && meta != null && (
          <>
            {' '}
            <span className="btn-plate-meta inline-flex items-center px-4 py-4 tnum">{meta}</span>
          </>
        )}
      </>
    )

  if (href) {
    const external = href.startsWith('http')
    return external
      ? <a href={href} target="_blank" rel="noreferrer" className={cls}>{inner}</a>
      : <Link to={href} className={cls}>{inner}</Link>
  }
  return (
    <button type={type} className={cls} onClick={onClick} aria-disabled={unavailable || undefined}>
      {inner}
    </button>
  )
}
