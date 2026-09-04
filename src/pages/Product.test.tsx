import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router'
import { describe, it, expect } from 'vitest'
import { CartProvider } from '../state/cart'
import { Product } from './Product'

const view = (sku: string) => render(
  <MemoryRouter initialEntries={[`/product/${sku}`]}>
    <CartProvider>
      <Routes><Route path="/product/:sku" element={<Product />} /></Routes>
    </CartProvider>
  </MemoryRouter>
)

describe('Product', () => {
  it('у крема двенадцать оттенков радиогруппой с текстовыми названиями', () => {
    view('cream')
    expect(screen.getAllByRole('radio')).toHaveLength(12)
    expect(screen.getByRole('radio', { name: 'Коньячный' })).toBeInTheDocument()
  })

  it('показывает, чему средство НЕ подходит, и почему', () => {
    view('cream')
    expect(screen.getByText('Не подходит')).toBeInTheDocument()
    expect(screen.getByText(/склеит ворс замши/)).toBeInTheDocument()
  })

  it('без выбранного оттенка кнопка не блокируется молча, а объясняет', async () => {
    view('cream')
    await userEvent.click(screen.getByRole('button', { name: 'В корзину' }))
    expect(screen.getByRole('alert')).toHaveTextContent(/оттенок/i)
  })

  it('у товара без оттенков выбора оттенка нет', () => {
    view('kit-suede')
    expect(screen.queryByRole('radiogroup', { name: 'Оттенок' })).not.toBeInTheDocument()
  })

  it('несуществующий sku не роняет страницу', () => {
    view('нет-такого')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Такой позиции нет')
  })
})
