import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useConfigurator } from './useConfigurator'

describe('useConfigurator', () => {
  it('без материала набора нет, и это не ошибка', () => {
    const { result } = renderHook(() => useConfigurator())
    expect(result.current.items).toEqual([])
    expect(result.current.conflicts).toEqual([])
  })

  it('материал плюс задача дают набор из движка', () => {
    const { result } = renderHook(() => useConfigurator())
    act(() => result.current.selectMaterial('suede'))
    act(() => result.current.toggleTask('protect', true))
    expect(result.current.items.map(i => i.sku)).toEqual(['spray-suede'])
  })

  it('конфликтная задача не блокируется, а объясняется и подставляет замену', () => {
    const { result } = renderHook(() => useConfigurator())
    act(() => result.current.selectMaterial('suede'))
    act(() => result.current.toggleTask('restore', true))
    expect(result.current.conflicts).toHaveLength(1)
    expect(result.current.conflicts[0]?.reason).toContain('склеит ворс')
    expect(result.current.items.map(i => i.sku)).toEqual(['kit-suede'])
  })

  it('срок считается по позиции, которая кончится первой', () => {
    const { result } = renderHook(() => useConfigurator())
    act(() => result.current.selectMaterial('suede'))
    act(() => result.current.toggleTask('clean', true))
    act(() => result.current.toggleTask('protect', true))
    act(() => result.current.setFrequency('daily'))
    expect(result.current.schedule?.months).toBe(2)
    expect(result.current.schedule?.firstToRunOut).toBe('spray-suede')
  })

  it('снятая руками позиция уходит, срок пересчитывается, отмена возвращает', () => {
    const { result } = renderHook(() => useConfigurator())
    act(() => result.current.selectMaterial('suede'))
    act(() => result.current.toggleTask('clean', true))
    act(() => result.current.toggleTask('protect', true))
    act(() => result.current.setFrequency('daily'))
    act(() => result.current.remove('spray-suede'))
    expect(result.current.items.map(i => i.sku)).toEqual(['kit-suede'])
    expect(result.current.schedule?.months).toBe(6)
    act(() => result.current.restore('spray-suede'))
    expect(result.current.schedule?.months).toBe(2)
  })

  it('смена материала сбрасывает ручные снятия — иначе они переживают свой набор', () => {
    const { result } = renderHook(() => useConfigurator())
    act(() => result.current.selectMaterial('suede'))
    act(() => result.current.toggleTask('protect', true))
    act(() => result.current.remove('spray-suede'))
    act(() => result.current.selectMaterial('smooth'))
    expect(result.current.removed).toEqual([])
  })

  it('когда расходников не осталось, срока нет и напоминать не о чем', () => {
    const { result } = renderHook(() => useConfigurator())
    act(() => result.current.selectMaterial('smooth'))
    act(() => result.current.toggleTask('clean', true))
    expect(result.current.items.map(i => i.sku)).toEqual(['brush-horsehair'])
    expect(result.current.schedule).toBeNull()
  })
})
