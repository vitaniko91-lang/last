import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Toggle } from './Toggle'

describe('Toggle', () => {
  it('имеет роль switch и сообщает состояние', () => {
    render(<Toggle checked={false} onChange={() => {}} label="Напоминать каждые 2 месяца" />)
    expect(screen.getByRole('switch', { name: 'Напоминать каждые 2 месяца' }))
      .toHaveAttribute('aria-checked', 'false')
  })

  it('переключается с клавиатуры', async () => {
    const onChange = vi.fn()
    render(<Toggle checked={false} onChange={onChange} label="Напоминать" />)
    await userEvent.tab()
    await userEvent.keyboard('{Enter}')
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('состояние несёт не только цвет — есть текстовая подпись', () => {
    render(<Toggle checked={false} onChange={() => {}} label="Напоминать" />)
    expect(screen.getByText(/Выключено/)).toBeInTheDocument()
  })
})
