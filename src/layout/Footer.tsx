import { Link } from 'react-router'

export function Footer() {
  return (
    <footer className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 sm:px-20 py-10 sm:py-12 border-t border-[var(--color-border-divider)]">
      <p className="font-semibold">Средство кончится — мы напомним.</p>
      <div className="flex flex-wrap items-center gap-x-8 gap-y-1">
        <Link to="/catalogue" className="flex items-center min-h-10">Каталог</Link>
        <Link to="/configurator" className="flex items-center min-h-10">Подобрать уход</Link>
        <Link to="/case" className="flex items-center min-h-10">Как это сделано</Link>
        <span className="label text-[var(--color-text-secondary)]">LAST · 2026</span>
      </div>
    </footer>
  )
}
