// cases/last/src/kit/rules.ts
import type { Conflict, Material, Sku, Task } from './types'

export const MATERIALS: readonly Material[] = ['smooth', 'suede', 'patent', 'oiled']
export const TASKS: readonly Task[] = ['clean', 'nourish', 'protect', 'restore']

// Матрица «материал × задача». Пустой список означает, что пара невозможна —
// тогда для неё обязан существовать конфликт с объяснением (проверено тестом).
const MATRIX: Record<Material, Record<Task, readonly Sku[]>> = {
  smooth: {
    clean: ['brush-horsehair'],
    nourish: ['balm', 'brush-horsehair'],
    protect: ['spray-smooth'],
    restore: ['cream', 'brush-horsehair'],
  },
  suede: {
    clean: ['kit-suede'],
    nourish: [],
    protect: ['spray-suede'],
    restore: [],
  },
  patent: {
    clean: ['polish-patent'],
    nourish: [],
    protect: [],
    restore: [],
  },
  oiled: {
    clean: ['brush-horsehair'],
    nourish: ['balm', 'brush-horsehair'],
    protect: ['spray-smooth'],
    restore: [],
  },
}

// Причина пишется тем языком, которым покупатель описывает свою вещь.
// «Забьёт поры» — термин; «склеит ворс и посадит пятно» — то, что он увидит.
const CONFLICTS: readonly Conflict[] = [
  {
    material: 'suede',
    task: 'restore',
    aboutSku: 'cream',
    reason: 'Крем-реноватор склеит ворс замши и ляжет пятнами — цвет замше возвращают не кремом.',
    insteadSku: 'kit-suede',
  },
  {
    material: 'suede',
    task: 'nourish',
    aboutSku: 'balm',
    reason: 'Замшу не питают бальзамом: жир прибьёт ворс, и вещь станет выглядеть засаленной.',
    insteadSku: 'kit-suede',
  },
  {
    material: 'oiled',
    task: 'restore',
    aboutSku: 'cream',
    reason: 'На масляной коже цветной крем ложится неровно поверх пропитки и оставляет разводы.',
    insteadSku: 'balm',
  },
  {
    material: 'patent',
    task: 'nourish',
    aboutSku: 'balm',
    reason: 'Лак — это плёнка поверх кожи, а не сама кожа: питать её нечем, а жирное средство размягчит покрытие и оно пойдёт морщинами.',
    insteadSku: 'polish-patent',
  },
  {
    material: 'patent',
    task: 'restore',
    aboutSku: 'cream',
    reason: 'Цветной крем на лаке не впитывается и остаётся липкой плёнкой, которая соберёт пыль. Цвет лаку возвращают полировкой, а не кремом.',
    insteadSku: 'polish-patent',
  },
  {
    material: 'patent',
    task: 'protect',
    aboutSku: 'spray-smooth',
    reason: 'Лак уже герметичен — воду он не пропускает сам по себе. Защитный спрей ляжет матовым налётом и убьёт зеркало.',
    insteadSku: 'polish-patent',
  },
]

export function skusFor(material: Material, task: Task): Sku[] {
  return [...MATRIX[material][task]]
}

export function conflictFor(material: Material, task: Task): Conflict | null {
  return CONFLICTS.find(c => c.material === material && c.task === task) ?? null
}
