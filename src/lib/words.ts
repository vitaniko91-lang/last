import type { Sku } from '../kit/types'

/**
 * Слово категории для типографической плитки. Товарной съёмки у бренда нет,
 * а придуманная фотография в карточке товара — фабрикация, а не приём.
 * Плитка набирается заголовочной гарнитурой: это решение, а не заглушка.
 */
export const CATEGORY_WORD: Record<Sku, string> = {
  cream: 'КРЕМ',
  balm: 'БАЛЬЗАМ',
  'spray-smooth': 'СПРЕЙ',
  'spray-suede': 'СПРЕЙ',
  'kit-suede': 'НАБОР',
  'brush-horsehair': 'ЩЁТКА',
  'shoe-trees': 'КОЛОДКИ',
  'edge-dressing': 'КРАСКА',
  'polish-patent': 'ПОЛИРОЛЬ',
}
