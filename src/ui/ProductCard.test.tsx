import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CATALOGUE } from '../kit/catalogue'
import { productImage } from '../lib/product-images'
import { ProductCard } from './ProductCard'

vi.mock('../lib/product-images', () => ({ productImage: vi.fn() }))
const mocked = vi.mocked(productImage)

const cream = CATALOGUE.find(p => p.sku === 'cream')!
const view = () => render(<MemoryRouter><ProductCard product={cream} /></MemoryRouter>)

describe('ProductCard', () => {
  beforeEach(() => mocked.mockReset())

  it('с рендером — показывает предмет, а не слово категории', () => {
    mocked.mockReturnValue({
      src: '/products/cream-1200.avif',
      srcSet: '/products/cream-600.avif 600w, /products/cream-1200.avif 1200w',
      width: 1536,
      height: 1536,
    })
    view()
    const img = screen.getByRole('presentation', { hidden: true })
    expect(img).toHaveAttribute('src', '/products/cream-1200.avif')
    expect(img).toHaveAttribute('srcset', expect.stringContaining('cream-600.avif 600w'))
    expect(img).toHaveAttribute('loading', 'lazy')
    expect(screen.queryByText('КРЕМ')).toBeNull()
    // Имя товара остаётся текстом — картинка декоративна, alt пустой.
    expect(screen.getByRole('link', { name: /Крем-реноватор/ })).toBeInTheDocument()
  })

  it('без рендера — держится словом категории, сборка не зависит от файла', () => {
    mocked.mockReturnValue(null)
    view()
    expect(screen.getByText('КРЕМ')).toBeInTheDocument()
    expect(screen.queryByRole('presentation', { hidden: true })).toBeNull()
  })
})
