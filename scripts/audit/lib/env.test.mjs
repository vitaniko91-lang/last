// cases/last/scripts/audit/lib/env.test.mjs
import { describe, it, expect } from 'vitest'
import { isMeasurable } from './env.mjs'

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
