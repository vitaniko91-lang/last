import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, it, expect, vi } from 'vitest'
import { RangePlates } from './RangePlates'

// Манифест подменяется на уровне модуля: у крема рендер есть, у остальных нет.
vi.mock('../../lib/product-images', () => ({
  productImage: (sku: string) => sku === 'cream'
    ? { src: '/products/cream-1200.avif', srcSet: '/products/cream-600.avif 600w', width: 1200, height: 1200 }
    : null,
}))

describe('RangePlates — рендер SKU', () => {
  it('когда рендер есть в манифесте, плита показывает его, а не слово-заглушку', () => {
    const { container } = render(<MemoryRouter><RangePlates /></MemoryRouter>)
    const cream = container.querySelector('a[href="/product/cream"]')!
    expect(cream.querySelector('img[src="/products/cream-1200.avif"]')).not.toBeNull()
    expect(cream.textContent).not.toContain('КРЕМ')
    // У бальзама рендера нет — плита держится фактурой и словом.
    const balm = container.querySelector('a[href="/product/balm"]')!
    expect(balm.textContent).toContain('БАЛЬЗАМ')
    expect(balm.querySelector('img[src^="/materials/"]')).not.toBeNull()
  })
})
