import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, it, expect } from 'vitest'
import { Footer } from './Footer'

describe('Footer', () => {
  it('инверсный: страница закрывается тем же тоном, каким открывается главная', () => {
    render(<MemoryRouter><Footer /></MemoryRouter>)
    const footer = screen.getByRole('contentinfo')
    expect(footer.className).toMatch(/color-inverse/)
    expect(footer.className).toMatch(/text-on-inverse/)
    // Вторичный текст на тёмном берёт свою роль, не бумажную.
    expect(screen.getByText('LAST · 2026').className).toMatch(/secondary-on-inverse/)
  })

  it('три маршрута сайта остаются ссылками', () => {
    render(<MemoryRouter><Footer /></MemoryRouter>)
    expect(screen.getByRole('link', { name: 'Каталог' })).toHaveAttribute('href', '/catalogue')
    expect(screen.getByRole('link', { name: 'Подобрать уход' })).toHaveAttribute('href', '/configurator')
    expect(screen.getByRole('link', { name: 'Как это сделано' })).toHaveAttribute('href', '/case')
  })
})
