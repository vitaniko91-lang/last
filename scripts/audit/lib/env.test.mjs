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
})
