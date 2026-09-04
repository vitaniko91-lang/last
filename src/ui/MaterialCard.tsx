import type { Material } from '../kit/types'
import { MATERIAL_INFO } from '../lib/materials'
import { MaterialTexture } from './MaterialTexture'

interface Props {
  material: Material
  checked: boolean
  onSelect: (m: Material) => void
}

export function MaterialCard({ material, checked, onSelect }: Props) {
  const info = MATERIAL_INFO[material]
  return (
    <button
      role="radio"
      type="button"
      aria-checked={checked}
      onClick={() => onSelect(material)}
      className={
        'flex flex-col gap-4 p-4 text-left w-full h-full cursor-pointer ' +
        'bg-[var(--color-surface)] transition-colors duration-200 ' +
        (checked
          ? 'border-2 border-[var(--color-accent-base)]'
          : 'border border-[var(--color-border-default)] hover:border-[var(--color-accent-base)]')
      }
    >
      <MaterialTexture material={material} sizes="(max-width: 640px) 45vw, 300px" />
      {/* Заголовок переносится, а не обрезается: HUG-текст в сузившемся
          контейнере клиппится, и «Лакированная кожа» становится «Лакированна». */}
      <span className="font-[family-name:var(--font-family-display)] font-bold text-[length:var(--font-size-h3)] leading-[var(--line-height-h3)] tracking-[var(--tracking-display)]">
        {info.title}
      </span>
      <span className="text-[var(--color-text-secondary)]">{info.hint}</span>
    </button>
  )
}
