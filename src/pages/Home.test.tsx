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
    // Имя уточнено призывом: материалы теперь упоминаются и в строках линейки
    // («подходит: замша»), поэтому одного названия материала уже мало.
    expect(screen.getByRole('link', { name: /Замша и нубук.*Собрать набор/s }))
      .toHaveAttribute('href', '/configurator?material=suede')
  })

  it('линейка показывает все девять позиций с ценами', () => {
    view()
    expect(screen.getAllByRole('link', { name: /₴/ })).toHaveLength(9)
  })

  // Ритм секций — спека 2026-09-13-last-section-rhythm-design.md:
  // герой (scene) → материалы и шаги (ground) → линейка (inverse) → футер (inverse).
  it('секция шагов — на бумаге, без инверсии', () => {
    const { container } = view()
    const how = container.querySelector('section#how')!
    expect(how.className).not.toMatch(/color-inverse/)
    // Ни одного вшитого литерала цвета: линии и номера-призраки — через роли.
    expect(how.innerHTML).not.toMatch(/#F2F1ED/)
  })

  it('секция линейки — инверсная, лейбл берёт accent/on-inverse', () => {
    view()
    const label = screen.getByText('Линейка')
    const section = label.closest('section')!
    expect(section.className).toMatch(/color-inverse/)
    expect(label.className).toMatch(/accent-on-inverse/)
  })
})
