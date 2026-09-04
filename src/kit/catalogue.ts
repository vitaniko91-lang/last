// cases/last/src/kit/catalogue.ts
import type { Product, Sku } from './types'

// Числа расхода — редакционные, при носке «несколько раз в неделю».
// Живут только здесь: в логике ни одного числа быть не должно.
export const CATALOGUE: readonly Product[] = [
  {
    sku: 'cream',
    priceRub: 2100,
    title: 'Крем-реноватор',
    role: 'Возвращает цвет и закрывает мелкие потёртости',
    consumable: true,
    coverageMonths: 12,
    shades: [
      'Чёрный', 'Нейтральный', 'Тёмно-коричневый', 'Коричневый',
      'Светло-коричневый', 'Коньячный', 'Бордо', 'Тёмно-синий',
      'Серый', 'Оливковый', 'Бежевый', 'Белый',
    ],
  },
  {
    sku: 'balm',
    priceRub: 1900,
    title: 'Бальзам-кондиционер',
    role: 'Питает кожу, не даёт ей пересыхать и трескаться',
    consumable: true,
    coverageMonths: 10,
    shades: null,
  },
  {
    sku: 'spray-smooth',
    priceRub: 1490,
    title: 'Защитный спрей для гладкой кожи',
    role: 'Отталкивает воду и грязь, не меняя вид кожи',
    consumable: true,
    coverageMonths: 6,
    shades: null,
  },
  {
    sku: 'spray-suede',
    priceRub: 1490,
    title: 'Защитный спрей для замши и нубука',
    role: 'Защищает ворс от воды и пятен, оставляя его дышащим',
    consumable: true,
    coverageMonths: 5,
    shades: null,
  },
  {
    sku: 'kit-suede',
    priceRub: 2300,
    title: 'Набор для замши',
    role: 'Щётка, ластик и шампунь — чистка и подъём ворса',
    consumable: true,
    coverageMonths: 12,
    shades: null,
  },
  {
    sku: 'brush-horsehair',
    priceRub: 1200,
    title: 'Щётка из конского волоса',
    role: 'Растушёвывает средство и снимает пыль между чистками',
    consumable: false,
    coverageMonths: null,
    shades: null,
  },
  {
    sku: 'shoe-trees',
    priceRub: 3200,
    title: 'Кедровые колодки',
    role: 'Держат форму и вытягивают влагу после носки',
    consumable: false,
    coverageMonths: null,
    shades: null,
  },
  {
    sku: 'edge-dressing',
    priceRub: 1100,
    title: 'Краска для уреза',
    role: 'Обновляет торец подошвы',
    consumable: true,
    coverageMonths: 24,
    shades: null,
  },
  {
    sku: 'polish-patent',
    priceRub: 1800,
    title: 'Полироль для лакированной кожи',
    role: 'Снимает следы и возвращает зеркало, не размягчая покрытие',
    consumable: true,
    coverageMonths: 18,
    shades: null,
  },
]

const INDEX = new Map(CATALOGUE.map(p => [p.sku, p]))

export function bySku(sku: Sku): Product {
  const product = INDEX.get(sku)
  if (!product) throw new Error(`Неизвестный SKU: ${sku}`)
  return product
}
