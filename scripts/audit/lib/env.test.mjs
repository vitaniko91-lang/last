// cases/last/scripts/audit/lib/env.test.mjs
import { describe, it, expect } from 'vitest'
import { isMeasurable, isLayoutMeasurable } from './env.mjs'

describe('isMeasurable', () => {
  it('пропускает видимую страницу с живым рендером', () => {
    const r = isMeasurable({ fps: 58, visibilityState: 'visible', hasFocus: true })
    expect(r.ok).toBe(true)
    expect(r.blockers).toEqual([])
  })

  it('блокирует тротлящую страницу даже если она видима', () => {
    const r = isMeasurable({ fps: 1, visibilityState: 'visible', hasFocus: true })
    expect(r.ok).toBe(false)
    expect(r.blockers).toContain('fps=1')
  })

  it('блокирует фоновую вкладку', () => {
    const r = isMeasurable({ fps: 60, visibilityState: 'hidden', hasFocus: true })
    expect(r.ok).toBe(false)
    expect(r.blockers).toContain('visibilityState=hidden')
  })

  it('блокирует неизвестный fps, а не считает его хорошим', () => {
    const r = isMeasurable({ visibilityState: 'visible', hasFocus: true })
    expect(r.ok).toBe(false)
    expect(r.blockers).toContain('fps=unknown')
  })

  it('потеря фокуса — предупреждение, не блокировка', () => {
    const r = isMeasurable({ fps: 55, visibilityState: 'visible', hasFocus: false })
    expect(r.ok).toBe(true)
    expect(r.warnings).toContain('window not focused')
  })

  it('держит порог: 29 не проходит, 30 проходит', () => {
    expect(isMeasurable({ fps: 29, visibilityState: 'visible', hasFocus: true }).ok).toBe(false)
    expect(isMeasurable({ fps: 30, visibilityState: 'visible', hasFocus: true }).ok).toBe(true)
  })

  it('блокирует нефизичный fps', () => {
    expect(isMeasurable({ fps: Infinity, visibilityState: 'visible', hasFocus: true }).ok).toBe(false)
    expect(isMeasurable({ fps: 1e9, visibilityState: 'visible', hasFocus: true }).ok).toBe(false)
  })

  it('блокирует fps не числом', () => {
    expect(isMeasurable({ fps: '60', visibilityState: 'visible', hasFocus: true }).ok).toBe(false)
  })

  it('предупреждает, когда hasFocus вообще не снят', () => {
    const r = isMeasurable({ fps: 60, visibilityState: 'visible' })
    expect(r.ok).toBe(true)
    expect(r.warnings).toContain('hasFocus не снят')
  })
})

describe('isLayoutMeasurable', () => {
  const good = { visibilityState: 'visible', innerWidth: 375, expectedWidth: 375, bodyTextLength: 4200, url: 'https://example.com/' }

  it('пропускает нормально отрендеренную страницу', () => {
    expect(isLayoutMeasurable(good).ok).toBe(true)
  })

  it('НЕ смотрит на частоту кадров: 5 fps вёрстке не мешают', () => {
    expect(isLayoutMeasurable({ ...good, fps: 5 }).ok).toBe(true)
  })

  it('блокирует расхождение вьюпорта — это обрезанный захват, а не reflow', () => {
    const r = isLayoutMeasurable({ ...good, innerWidth: 1440, expectedWidth: 375 })
    expect(r.ok).toBe(false)
    expect(r.blockers.join()).toMatch(/innerWidth/)
  })

  it('блокирует пустое тело — так выглядит заглушка антибота', () => {
    expect(isLayoutMeasurable({ ...good, bodyTextLength: 120 }).ok).toBe(false)
    expect(isLayoutMeasurable({ ...good, bodyTextLength: undefined }).ok).toBe(false)
  })

  it('блокирует about:blank и невидимую страницу', () => {
    expect(isLayoutMeasurable({ ...good, url: 'about:blank' }).ok).toBe(false)
    expect(isLayoutMeasurable({ ...good, visibilityState: 'hidden' }).ok).toBe(false)
  })
})
