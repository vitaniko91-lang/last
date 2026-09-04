import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, it, expect } from 'vitest'
import { Home } from './Home'

const view = () => render(<MemoryRouter><Home /></MemoryRouter>)

describe('Home', () => {
  it('ровно один видимый h1', () => {
    view()
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  })

  it('материал ведёт в конфигуратор с уже выбранным материалом', () => {
    view()
    expect(screen.getByRole('link', { name: /Замша и нубук/ }))
      .toHaveAttribute('href', '/configurator?material=suede')
  })

  it('линейка показывает все девять позиций с ценами', () => {
    view()
    expect(screen.getAllByRole('link', { name: /₽/ })).toHaveLength(9)
  })
})
