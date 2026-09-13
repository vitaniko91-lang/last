import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, it, expect } from 'vitest'
import { CATALOGUE } from '../../kit/catalogue'
import { formatRub } from '../../lib/money'
import { RangePlates } from './RangePlates'

const view = () => render(<MemoryRouter><RangePlates /></MemoryRouter>)

describe('RangePlates', () => {
  it('девять плит — девять ссылок на товар, в имени есть цена', () => {
    view()
    const links = screen.getAllByRole('link', { name: /₽/ })
    expect(links).toHaveLength(CATALOGUE.length)
    // Цена форматируется Intl с узким неразрывным пробелом — сравниваем через formatRub, а не литералом.
    expect(screen.getByRole('link', { name: new RegExp(`Крем-реноватор.*${formatRub(2100)}`, 's') })).toHaveAttribute('href', '/product/cream')
  })

  it('материалы под плитой — из матрицы, а не проставлены руками', () => {
    view()
    // Спрей для замши работает только на замше — ровно одна фактура.
    const link = screen.getByRole('link', { name: /Защитный спрей для замши и нубука/ })
    expect(link.querySelectorAll('[data-fit]')).toHaveLength(1)
    // Колодки не привязаны к материалу — список пуст по существу, и это сказано словами.
    expect(screen.getByRole('link', { name: /Кедровые колодки/ })).toHaveTextContent('отдельная позиция')
  })
})
