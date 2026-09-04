import type { Material } from '../kit/types'

/**
 * Фактура квадратная по построению: соотношение задано `aspect-square`,
 * а не подбором высоты. На узком экране высота следует за шириной сама.
 *
 * alt пустой намеренно: название материала стоит рядом настоящим текстом,
 * и озвучивать картинку второй раз — шум. Изображение здесь иллюстрирует
 * признак, а не является его единственным носителем.
 */
export function MaterialTexture({ material, sizes, className = '' }: {
  material: Material
  sizes: string
  className?: string
}) {
  return (
    <img
      src={`/materials/${material}-800.avif`}
      srcSet={`/materials/${material}-400.avif 400w, /materials/${material}-800.avif 800w, /materials/${material}-1200.avif 1200w`}
      sizes={sizes}
      alt=""
      width={800}
      height={800}
      loading="lazy"
      decoding="async"
      className={`w-full aspect-square object-cover ${className}`}
    />
  )
}
