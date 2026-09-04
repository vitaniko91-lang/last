import type { Task } from '../kit/types'

/** Язык результата, а не состава: покупатель описывает, что хочет получить,
 *  а не какое вещество ему нужно. */
export const TASK_INFO: Record<Task, { title: string; hint: string }> = {
  clean: { title: 'Почистить', hint: 'Убрать грязь и соль' },
  nourish: { title: 'Напитать', hint: 'Не дать пересохнуть и потрескаться' },
  protect: { title: 'Защитить', hint: 'Не бояться дождя и реагента' },
  restore: { title: 'Вернуть цвет', hint: 'Закрыть потёртости и вернуть тон' },
}
