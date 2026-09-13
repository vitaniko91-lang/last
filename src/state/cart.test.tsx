import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import type { ReactNode } from 'react'
import { CartProvider, useCart } from './cart'

const wrap = ({ children }: { children: ReactNode }) => <CartProvider>{children}</CartProvider>

describe('cart', () => {
  it('пустая корзина не показывает ноль, а показывает ничего', () => {
    const { result } = renderHook(() => useCart(), { wrapper: wrap })
    expect(result.current.count).toBe(0)
    expect(result.current.lines).toEqual([])
  })

  it('добавление той же позиции увеличивает количество, а не плодит строки', () => {
    const { result } = renderHook(() => useCart(), { wrapper: wrap })
    act(() => result.current.add('cream', 1, 'Коньячный'))
    act(() => result.current.add('cream', 1, 'Коньячный'))
    expect(result.current.lines).toHaveLength(1)
    expect(result.current.lines[0]?.qty).toBe(2)
  })

  it('тот же товар в другом оттенке — отдельная строка', () => {
    const { result } = renderHook(() => useCart(), { wrapper: wrap })
    act(() => result.current.add('cream', 1, 'Коньячный'))
    act(() => result.current.add('cream', 1, 'Чёрный'))
    expect(result.current.lines).toHaveLength(2)
  })

  it('итог считается из каталога, а не из того, что положили в строку', () => {
    const { result } = renderHook(() => useCart(), { wrapper: wrap })
    act(() => result.current.add('spray-suede', 1))
    act(() => result.current.add('kit-suede', 1))
    expect(result.current.total).toBe(1880)
  })

  it('переживает перезагрузку', () => {
    const first = renderHook(() => useCart(), { wrapper: wrap })
    act(() => first.result.current.add('balm', 2))
    first.unmount()
    const second = renderHook(() => useCart(), { wrapper: wrap })
    expect(second.result.current.lines[0]?.qty).toBe(2)
  })

  it('битые данные в хранилище не роняют приложение', () => {
    window.localStorage.setItem('last.cart', '{не json')
    const { result } = renderHook(() => useCart(), { wrapper: wrap })
    expect(result.current.lines).toEqual([])
  })

  it('количество ноль убирает строку, а не оставляет пустую', () => {
    const { result } = renderHook(() => useCart(), { wrapper: wrap })
    act(() => result.current.add('balm', 1))
    act(() => result.current.setQty('balm', undefined, 0))
    expect(result.current.lines).toEqual([])
  })
})
