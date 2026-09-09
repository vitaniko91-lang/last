import { Link, useLocation } from 'react-router'
import { useCart } from '../state/cart'
import { Button } from '../ui/Button'

/**
 * На главной шапка лежит ПОВЕРХ тёмного героя: иначе иммерсивная сцена
 * начиналась бы под светлой полосой и теряла бы весь смысл. На остальных
 * страницах шапка обычная — со своим фоном и разделителем.
 */
export function Header() {
  const { count } = useCart()
  const overlay = useLocation().pathname === '/'
  return (
    <header
      className={
        'flex items-center justify-between gap-4 px-5 sm:px-20 py-4 sm:py-6 ' +
        (overlay
          ? 'absolute inset-x-0 top-0 z-10 text-[var(--color-text-on-inverse)]'
          : 'border-b border-[var(--color-border-divider)]')
      }
    >
      {/* min-h-10: на 375 строка логотипа сама по себе 38px — на два пикселя
          ниже порога зоны нажатия. Расширяем зону, а не кегль. */}
      <Link to="/" className="flex items-center min-h-10 font-[family-name:var(--font-family-display)] font-extrabold text-[length:var(--font-size-h3)] tracking-[var(--tracking-display)]">
        LAST
      </Link>
      <nav className="flex items-center gap-3 sm:gap-8">
        <Link to="/catalogue" className="hidden sm:flex items-center min-h-10">Каталог</Link>
        <Link to="/case" className="hidden sm:flex items-center min-h-10">Как это сделано</Link>
        <Link to="/cart" className="flex items-center gap-2 min-h-10">
          Корзина
          {/* Счётчик скрыт при нуле: «0» — шум, а не информация. */}
          {count > 0 && (
            <span className="label tnum px-2 py-1 bg-[var(--color-accent-base)] text-[var(--color-text-on-accent)]">
              {count}
            </span>
          )}
        </Link>
        <Button href="/configurator" className="hidden sm:inline-flex">Подобрать уход</Button>
      </nav>
    </header>
  )
}
