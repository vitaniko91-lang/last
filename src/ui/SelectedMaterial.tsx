import type { Material } from '../kit/types'
import { MATERIAL_INFO } from '../lib/materials'

interface Props {
  material: Material
  caption?: string
  title?: string
  onChange: () => void
}

/**
 * На узком экране ряд превращается в стопку. Горизонтальная раскладка на 390
 * зажимает текстовую колонку до ~110px, и заголовок рассыпается в пять строк.
 */
export function SelectedMaterial({ material, caption = 'Ваш материал', title, onChange }: Props) {
  const info = MATERIAL_INFO[material]
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 sm:px-5 bg-[var(--color-surface)] border border-[var(--color-border-default)]">
      <img
        src={`/materials/${material}-400.avif`}
        alt=""
        width={64}
        height={64}
        loading="lazy"
        decoding="async"
        className="w-16 h-16 object-cover shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="label text-[var(--color-text-secondary)]">{caption}</p>
        <p className="font-semibold">{title ?? info.title}</p>
      </div>
      <button
        type="button"
        onClick={onChange}
        className="text-left font-semibold text-[var(--color-accent-base)] min-h-10 cursor-pointer shrink-0"
      >
        Изменить
      </button>
    </div>
  )
}
