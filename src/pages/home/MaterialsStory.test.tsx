import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, it, expect } from 'vitest'
import { MATERIALS } from '../../kit/rules'
import { MATERIAL_INFO } from '../../lib/materials'
import { MaterialsStory } from './MaterialsStory'

const view = () => render(<MemoryRouter><MaterialsStory /></MemoryRouter>)

describe('MaterialsStory', () => {
  it('четыре главы — четыре ссылки в конфигуратор с выбранным материалом', () => {
    view()
    for (const m of MATERIALS) {
      expect(screen.getByRole('link', { name: new RegExp(`${MATERIAL_INFO[m].title}.*Собрать набор`, 's') }))
        .toHaveAttribute('href', `/configurator?material=${m}`)
    }
  })

  it('главы пронумерованы римскими цифрами — как разделы у референса', () => {
    view()
    for (const n of ['I', 'II', 'III', 'IV']) {
      expect(screen.getAllByText(n).length).toBeGreaterThan(0)
    }
  })

  it('сцена — декоративная: четыре кадра с пустым alt, имя материала несёт текст', () => {
    const { container } = view()
    const scene = container.querySelectorAll('[data-scene] img')
    expect(scene).toHaveLength(4)
    scene.forEach(img => expect(img).toHaveAttribute('alt', ''))
  })
})
