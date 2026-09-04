import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, it, expect } from 'vitest'
import { CartProvider } from '../state/cart'
import { Configurator } from './Configurator'

const view = (path = '/configurator') => render(
  <MemoryRouter initialEntries={[path]}>
    <CartProvider><Configurator /></CartProvider>
  </MemoryRouter>
)

describe('Configurator', () => {
  it('состояние 1: четыре материала радиогруппой, панель набора — обещание', () => {
    view()
    expect(screen.getByRole('radiogroup', { name: /материал/i })).toBeInTheDocument()
    expect(screen.getAllByRole('radio')).toHaveLength(4)
    expect(screen.getByText(/Здесь появится/)).toBeInTheDocument()
  })

  it('материал из адреса подставляется, минуя первый вопрос', () => {
    view('/configurator?material=suede')
    expect(screen.getByRole('checkbox', { name: /Почистить/ })).toBeInTheDocument()
  })

  it('состояние 3: конфликт объясняется, предлагает замену, флажок остаётся отмечен', async () => {
    view('/configurator?material=suede')
    await userEvent.click(screen.getByRole('checkbox', { name: /Вернуть цвет/ }))
    expect(screen.getByText(/склеит ворс замши/)).toBeInTheDocument()
    expect(screen.getByText(/Вместо этого/)).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: /Вернуть цвет/ })).toHaveAttribute('aria-checked', 'true')
  })

  it('состояние 5: набор, срок и итог считаются движком', async () => {
    view('/configurator?material=suede')
    await userEvent.click(screen.getByRole('checkbox', { name: /Почистить/ }))
    await userEvent.click(screen.getByRole('checkbox', { name: /Защитить/ }))
    await userEvent.click(screen.getByRole('radio', { name: 'Каждый день' }))
    expect(screen.getByText(/^2 месяца$/)).toBeInTheDocument()
    expect(screen.getByText(/3.790 ₽/)).toBeInTheDocument()
  })

  it('график пополнения выключен по умолчанию', async () => {
    view('/configurator?material=suede')
    await userEvent.click(screen.getByRole('checkbox', { name: /Защитить/ }))
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false')
  })

  it('состояние 6: снятие позиции пересчитывает срок и предлагает вернуть', async () => {
    view('/configurator?material=suede')
    await userEvent.click(screen.getByRole('checkbox', { name: /Почистить/ }))
    await userEvent.click(screen.getByRole('checkbox', { name: /Защитить/ }))
    await userEvent.click(screen.getByRole('radio', { name: 'Каждый день' }))
    await userEvent.click(screen.getByRole('button', { name: /Убрать Защитный спрей/ }))
    expect(screen.getByText(/^6 месяцев$/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'вернуть' })).toBeInTheDocument()
  })
})
