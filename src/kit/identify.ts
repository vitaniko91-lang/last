// cases/last/src/kit/identify.ts
import type { Material } from './types'

export interface Signs {
  /** Есть ли ворс — поверхность бархатистая на ощупь. */
  nap: boolean
  /** Заметный блеск. */
  glossy: boolean
  /** Темнеет ли пятно под большим пальцем. Может остаться без ответа. */
  darkensUnderThumb?: boolean
}

export interface SignQuestion {
  key: keyof Signs
  text: string
}

// Формулировки описывают то, что человек может увидеть и потрогать.
// Ни одного названия материала в вопросе быть не должно — иначе ветка
// «не знаю материал» требует ровно того знания, ради отсутствия которого её и
// сделали.
export const SIGN_QUESTIONS: readonly SignQuestion[] = [
  { key: 'nap', text: 'Поверхность бархатистая, при проведении пальцем остаётся след?' },
  { key: 'glossy', text: 'Вещь заметно блестит на свету?' },
  { key: 'darkensUnderThumb', text: 'Если нажать большим пальцем, пятно темнеет и потом исчезает?' },
]

export function identifyMaterial(signs: Signs): Material {
  if (signs.nap) return 'suede'
  if (signs.glossy) return 'cordovan'
  // Без ответа про потемнение отвечаем «гладкая»: она встречается чаще, и
  // средства для неё на масляной коже вещь не портят — ошибка в эту сторону
  // дешевле обратной.
  if (signs.darkensUnderThumb === true) return 'oiled'
  return 'smooth'
}
