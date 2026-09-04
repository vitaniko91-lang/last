import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MaterialCard } from './MaterialCard'

describe('MaterialCard', () => {
  it('это радиокнопка с подписью — изображение не единственный носитель смысла', () => {
    render(<MaterialCard material="suede" checked={false} onSelect={() => {}} />)
    expect(screen.getByRole('radio', { name: /Замша и нубук/ })).toHaveAttribute('aria-checked', 'false')
    expect(screen.getByText(/Бархатистая/)).toBeInTheDocument()
  })

  it('изображение подаётся тремя ширинами', () => {
    const { container } = render(<MaterialCard material="smooth" checked onSelect={() => {}} />)
    const srcset = container.querySelector('img')?.getAttribute('srcset') ?? ''
    expect(srcset).toContain('400w')
    expect(srcset).toContain('1200w')
  })

  it('фактура квадратная — соотношение задано, а не подобрано высотой', () => {
    const { container } = render(<MaterialCard material="patent" checked={false} onSelect={() => {}} />)
    expect(container.querySelector('img')?.className).toContain('aspect-square')
  })
})
