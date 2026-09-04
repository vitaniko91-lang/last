import { SHADE_HEX } from '../lib/shades'

interface Props {
  shades: readonly string[]
  selected: string | null
  onSelect: (shade: string) => void
}

export function SwatchPicker({ shades, selected, onSelect }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <p className="label text-[var(--color-text-secondary)]">
        {selected ? `Оттенок: ${selected}` : 'Выберите оттенок'}
      </p>
      {/* Четыре в ряд на узком экране, шесть на широком: палец не курсор,
          и ячейка на телефоне вырастает вдвое против десктопных 40px. */}
      <div role="radiogroup" aria-label="Оттенок" className="grid grid-cols-4 sm:grid-cols-6 gap-3">
        {shades.map(shade => (
          <button
            key={shade}
            role="radio"
            type="button"
            aria-checked={shade === selected}
            aria-label={shade}
            title={shade}
            onClick={() => onSelect(shade)}
            style={{ background: SHADE_HEX[shade] }}
            className={
              'w-full aspect-square min-h-10 cursor-pointer ' +
              (shade === selected
                ? 'outline outline-[3px] -outline-offset-[3px] outline-[var(--color-accent-base)]'
                : 'border border-[var(--color-border-default)]')
            }
          />
        ))}
      </div>
    </div>
  )
}
