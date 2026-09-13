import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, it, expect } from 'vitest'
import { MATERIALS } from '../kit/rules'
import { MATERIAL_INFO } from '../lib/materials'
import { Hero } from './Hero'

const view = () => render(<MemoryRouter><Hero /></MemoryRouter>)

describe('Hero', () => {
  it('один h1 с обещанием бренда', () => {
    view()
    const h1 = screen.getAllByRole('heading', { level: 1 })
    expect(h1).toHaveLength(1)
    expect(h1[0]).toHaveTextContent('Уход за вещами, которые вы не собираетесь менять')
  })

  it('главная кнопка ведёт в конфигуратор и обещает четыре вопроса', () => {
    view()
    expect(screen.getByRole('link', { name: 'Подобрать уход 4 вопроса' }))
      .toHaveAttribute('href', '/configurator')
  })

  it('вторая кнопка ведёт в каталог', () => {
    view()
    expect(screen.getByRole('link', { name: 'Смотреть каталог' })).toHaveAttribute('href', '/catalogue')
  })

  it('четыре образца на плите — ссылки в конфигуратор с выбранным материалом', () => {
    view()
    for (const m of MATERIALS) {
      expect(screen.getByRole('link', { name: MATERIAL_INFO[m].title }))
        .toHaveAttribute('href', `/configurator?material=${m}`)
    }
  })

  it('плита — LCP-элемент: в разметке, eager, с высоким приоритетом', () => {
    const { container } = view()
    const plate = container.querySelector('img[src*="hero-oiled"]')
    expect(plate).not.toBeNull()
    expect(plate).toHaveAttribute('loading', 'eager')
    expect(plate).toHaveAttribute('fetchpriority', 'high')
  })
})
