// cases/last/src/kit/types.ts

export type Material = 'smooth' | 'suede' | 'cordovan' | 'oiled'
export type Task = 'clean' | 'nourish' | 'protect' | 'restore'
export type Frequency = 'daily' | 'weekly' | 'rare'

export type Sku =
  | 'cream'
  | 'balm'
  | 'spray-smooth'
  | 'spray-suede'
  | 'kit-suede'
  | 'brush-horsehair'
  | 'shoe-trees'
  | 'edge-dressing'

export interface Product {
  sku: Sku
  title: string
  role: string
  /** Расходуется ли позиция. Щётка и колодки — нет. */
  consumable: boolean
  /** Месяцев службы при носке «несколько раз в неделю». null у нерасходников. */
  coverageMonths: number | null
  /** Оттенки. Только у крема-реноватора, у остальных null. */
  shades: readonly string[] | null
}

export interface Answers {
  material: Material
  tasks: readonly Task[]
  frequency: Frequency
  /** Оттенок. Спрашивается, только когда в набор попал крем. */
  shade?: string
}

export interface Conflict {
  material: Material
  task: Task
  /** Почему нельзя — человеческим языком, без терминов. */
  reason: string
  /** Что предлагается вместо. */
  insteadSku: Sku
}

export interface Kit {
  items: Product[]
  conflicts: Conflict[]
  /** Нужен ли вопрос про оттенок: крем в наборе. */
  needsShade: boolean
}
