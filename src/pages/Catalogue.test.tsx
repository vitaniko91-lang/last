import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, it, expect } from 'vitest'
import { Catalogue } from './Catalogue'

const view = () => render(<MemoryRouter><Catalogue /></MemoryRouter>)

describe('Catalogue', () => {
  it('фильтр — радиогруппа с общим названием, а не набор кнопок', () => {
    view()
    expect(screen.getByRole('radiogroup', { name: /материал/i })).toBeInTheDocument()
  })

  it('по умолчанию показаны все девять позиций', () => {
    view()
    expect(screen.getByText('9 позиций')).toBeInTheDocument()
  })

  it('фильтр по лаку оставляет то, что к лаку применимо', async () => {
    view()
    await userEvent.click(screen.getByRole('radio', { name: 'Лакированная кожа' }))
    expect(screen.getByRole('link', { name: /Полироль/ })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Крем-реноватор/ })).not.toBeInTheDocument()
  })

  it('счётчик согласован с числом показанных карточек', async () => {
    view()
    await userEvent.click(screen.getByRole('radio', { name: 'Замша и нубук' }))
    const n = screen.getAllByRole('link', { name: /₴/ }).length
    expect(screen.getByText(new RegExp(`^${n} позици`))).toBeInTheDocument()
  })
})
