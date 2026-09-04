import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, it, expect } from 'vitest'
import { CartProvider } from '../state/cart'
import { Cart } from './Cart'

const view = () => render(<MemoryRouter><CartProvider><Cart /></CartProvider></MemoryRouter>)

describe('Cart', () => {
  it('пустая корзина зовёт в подбор, а не сообщает о пустоте', () => {
    view()
    expect(screen.queryByText(/корзина пуста/i)).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Подобрать уход/ })).toBeInTheDocument()
  })

  it('чекаут в коде не делается, и на экране это сказано прямо', () => {
    window.localStorage.setItem('last.cart', JSON.stringify([{ sku: 'balm', qty: 1 }]))
    view()
    expect(screen.getByText(/только в Figma/i)).toBeInTheDocument()
  })

  it('итог считается по количеству', () => {
    window.localStorage.setItem('last.cart', JSON.stringify([{ sku: 'balm', qty: 2 }]))
    view()
    expect(screen.getAllByText(/3.800 ₽/).length).toBeGreaterThan(0)
  })
})
