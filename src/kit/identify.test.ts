// cases/last/src/kit/identify.test.ts
import { describe, it, expect } from 'vitest'
import { identifyMaterial, SIGN_QUESTIONS } from './identify'

describe('identifyMaterial', () => {
  it('ворс есть — это замша или нубук, блеск уже не важен', () => {
    expect(identifyMaterial({ nap: true, glossy: true })).toBe('suede')
    expect(identifyMaterial({ nap: true, glossy: false })).toBe('suede')
  })

  it('ворса нет и сильный блеск — лакированная кожа', () => {
    expect(identifyMaterial({ nap: false, glossy: true })).toBe('patent')
  })

  it('ворса нет, не блестит, темнеет от нажатия пальцем — масляная кожа', () => {
    expect(identifyMaterial({ nap: false, glossy: false, darkensUnderThumb: true })).toBe('oiled')
  })

  it('ворса нет, не блестит, не темнеет — гладкая кожа', () => {
    expect(identifyMaterial({ nap: false, glossy: false, darkensUnderThumb: false })).toBe('smooth')
  })

  it('без ответа про потемнение матовая кожа считается гладкой, а не масляной', () => {
    // Гладкая кожа встречается несравнимо чаще; ошибка в эту сторону безопаснее,
    // потому что средства для гладкой кожи на масляной не портят вещь.
    expect(identifyMaterial({ nap: false, glossy: false })).toBe('smooth')
  })

  it('вопросов ровно три и все заданы наблюдением, а не термином', () => {
    expect(SIGN_QUESTIONS).toHaveLength(3)
    for (const q of SIGN_QUESTIONS) {
      expect(q.text).not.toMatch(/нубук|кордован|лак|анилин|пулл-ап/i)
    }
  })
})
