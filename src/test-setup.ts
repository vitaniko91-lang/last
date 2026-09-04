import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

/**
 * В этом рантайме глобальное имя `localStorage` занято пустым объектом без
 * методов — не хранилищем jsdom. Тесты корзины на нём молча ничего не
 * проверяли бы, поэтому ставим настоящую реализацию, а не обходим проверку.
 */
if (typeof window.localStorage?.clear !== 'function') {
  const store = new Map<string, string>()
  const shim: Storage = {
    get length() { return store.size },
    clear: () => store.clear(),
    getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
    key: (i: number) => [...store.keys()][i] ?? null,
    removeItem: (k: string) => { store.delete(k) },
    setItem: (k: string, v: string) => { store.set(k, String(v)) },
  }
  Object.defineProperty(window, 'localStorage', { value: shim, configurable: true })
  Object.defineProperty(globalThis, 'localStorage', { value: shim, configurable: true })
}

// Без globals:true авто-очистка @testing-library не регистрируется, и DOM
// от предыдущего теста утекает в следующий: getByRole находит две кнопки.
afterEach(() => {
  cleanup()
  window.localStorage.clear()
})
