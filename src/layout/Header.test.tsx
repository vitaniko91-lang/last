import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, it, expect } from 'vitest'
import { CartProvider } from '../state/cart'
import { Header } from './Header'

const view = () => render(<MemoryRouter><CartProvider><Header /></CartProvider></MemoryRouter>)

describe('Header', () => {
  it('навигация — настоящий <nav> с ссылками', () => {
    view()
    expect(screen.getByRole('navigation')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Каталог' })).toHaveAttribute('href', '/catalogue')
  })

  it('счётчик корзины скрыт при нуле, а не показывает «0»', () => {
    view()
    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })
})
