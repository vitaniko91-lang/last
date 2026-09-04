import { Link } from 'react-router'
import { FINDINGS } from '../lib/findings'
import { Button } from '../ui/Button'

const FIGMA = 'https://www.figma.com/design/ztM2VHMovlutEykLNGPLVq'

export function CaseStudy() {
  return (
    <>
      <section className="px-5 sm:px-20 pt-12 sm:pt-30 pb-12">
        <p className="label text-[var(--color-text-secondary)]">Кейс</p>
        <h1 className="mt-4 max-w-[18ch]">Магазин, который отговаривает от покупки</h1>
        <p className="mt-6 text-[var(--color-text-secondary)] max-w-[64ch]">
          LAST — вымышленный бренд ухода за кожей и обувью, построенный на замере
          четырёх реальных магазинов категории. Каждое решение здесь отвечает
          находке аудита, а не вкусу.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-3">
          <Button href="/configurator">Попробовать конфигуратор</Button>
          <Button href={FIGMA} styleName="secondary">Открыть файл Figma</Button>
        </div>
      </section>

      <section className="px-5 sm:px-20 py-12 sm:py-16 flex flex-col gap-6">
        <h2>Находки и что из них следует</h2>
        {FINDINGS.map(f => (
          <article key={f.n} className="p-5 sm:p-10 bg-[var(--color-surface)] border border-[var(--color-border-default)] flex flex-col gap-5">
            <div className="flex flex-wrap items-baseline gap-4">
              <p className="label text-[var(--color-text-secondary)] tnum">Находка {f.n}</p>
              <p className="label text-[var(--color-semantic-warning)] tnum">{f.number}</p>
            </div>
            <h3>{f.title}</h3>
            <p className="text-[var(--color-text-secondary)] max-w-[70ch]">{f.measured}</p>
            <div className="pt-4 border-t border-[var(--color-border-divider)]">
              <p className="label text-[var(--color-accent-base)]">Решение</p>
              <p className="mt-2 max-w-[70ch]">{f.solution}</p>
            </div>
            <Link to={f.href} className="inline-flex items-center min-h-10 font-semibold text-[var(--color-accent-base)] self-start">
              {f.hrefLabel} →
            </Link>
          </article>
        ))}
      </section>

      <section className="px-5 sm:px-20 py-12 sm:py-16 bg-[var(--color-inverse)] text-[var(--color-text-on-inverse)]">
        <h2>Где проходит граница</h2>
        <p className="mt-6 max-w-[70ch] text-[var(--color-text-secondary-on-inverse)]">
          Чекаут и аккаунт с графиком пополнения существуют только в Figma. Обещать
          целый магазин и не сделать — хуже, чем очертить границу вслух: в макете
          они собраны целиком, в коде их нет, и это решение, а не недоделка.
        </p>
        <p className="mt-4 max-w-[70ch] text-[var(--color-text-secondary-on-inverse)]">
          Товарной фотографии у вымышленного бренда быть не может, поэтому плитки
          каталога типографические. Придуманная съёмка в карточке товара —
          фабрикация, а не приём.
        </p>
        <p className="mt-4 max-w-[70ch] text-[var(--color-text-secondary-on-inverse)]">
          Ни одно число на сайте не написано в вёрстке: набор, конфликты, сроки
          и порядок позиций приходят из движка, покрытого тестами.
        </p>
      </section>
    </>
  )
}
