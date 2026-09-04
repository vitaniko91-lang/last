import type { Material } from '../kit/types'

export interface MaterialInfo {
  title: string
  /** Признак, который владелец видит и трогает. Без термина: человек,
   *  не знающий слова «нубук», должен узнать свою вещь по описанию. */
  hint: string
}

export const MATERIAL_INFO: Record<Material, MaterialInfo> = {
  smooth: { title: 'Гладкая кожа', hint: 'Мелкое ровное зерно, матовая или слегка блестит' },
  suede: { title: 'Замша и нубук', hint: 'Бархатистая, при проведении пальцем остаётся след' },
  patent: { title: 'Лакированная кожа', hint: 'Зеркальный блеск, отражает как стекло' },
  oiled: { title: 'Масляная кожа', hint: 'Темнеет на сгибе и светлеет обратно' },
}
