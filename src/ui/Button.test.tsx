import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, it, expect } from 'vitest'
import { Button } from './Button'

const view = (ui: React.ReactNode) => render(<MemoryRouter>{ui}</MemoryRouter>)

describe('Button', () => {
  it('это настоящий <button>, а не div с ролью', () => {
    view(<Button>Подобрать уход</Button>)
    expect(screen.getByRole('button', { name: 'Подобрать уход' }).tagName).toBe('BUTTON')
  })

  it('с href становится ссылкой — навигация это <a>, а не onClick', () => {
    view(<Button href="/configurator">Подобрать уход</Button>)
    const el = screen.getByRole('link', { name: 'Подобрать уход' })
    expect(el.tagName).toBe('A')
    expect(el).toHaveAttribute('href', '/configurator')
  })

  it('по умолчанию type=button — иначе внутри формы он её отправит', () => {
    view(<Button>Дальше</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })

  it('недоступная кнопка помечена aria-disabled и остаётся в порядке обхода', () => {
    view(<Button unavailable>Оплатить</Button>)
    const b = screen.getByRole('button')
    expect(b).toHaveAttribute('aria-disabled', 'true')
    expect(b).not.toHaveAttribute('disabled')
  })
})
