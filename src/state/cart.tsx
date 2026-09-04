import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { bySku } from '../kit/catalogue'
import type { Sku } from '../kit/types'

export interface CartLine {
  sku: Sku
  qty: number
  shade?: string
}

const KEY = 'last.cart'

function load(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((l): l is CartLine =>
      typeof l === 'object' && l !== null && 'sku' in l && 'qty' in l)
  } catch {
    // Хранилище может быть недоступно или испорчено. Это не повод падать
    // на первом же экране.
    return []
  }
}

interface CartApi {
  lines: CartLine[]
  count: number
  total: number
  add: (sku: Sku, qty?: number, shade?: string) => void
  setQty: (sku: Sku, shade: string | undefined, qty: number) => void
  remove: (sku: Sku, shade?: string) => void
  clear: () => void
}

const Ctx = createContext<CartApi | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(load)

  useEffect(() => {
    try { window.localStorage.setItem(KEY, JSON.stringify(lines)) } catch { /* приватный режим */ }
  }, [lines])

  const api = useMemo<CartApi>(() => ({
    lines,
    count: lines.reduce((n, l) => n + l.qty, 0),
    // Итог считается из каталога, а не из того, что когда-то положили в строку:
    // цена в строке успела бы устареть.
    total: lines.reduce((sum, l) => sum + bySku(l.sku).priceRub * l.qty, 0),
    add: (sku, qty = 1, shade) => setLines(prev => {
      const i = prev.findIndex(l => l.sku === sku && l.shade === shade)
      if (i === -1) return [...prev, { sku, qty, shade }]
      return prev.map((l, j) => (j === i ? { ...l, qty: l.qty + qty } : l))
    }),
    setQty: (sku, shade, qty) => setLines(prev =>
      qty <= 0
        ? prev.filter(l => !(l.sku === sku && l.shade === shade))
        : prev.map(l => (l.sku === sku && l.shade === shade ? { ...l, qty } : l))),
    remove: (sku, shade) => setLines(prev => prev.filter(l => !(l.sku === sku && l.shade === shade))),
    clear: () => setLines([]),
  }), [lines])

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export function useCart(): CartApi {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useCart вызван вне CartProvider')
  return ctx
}
