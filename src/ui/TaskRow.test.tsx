import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { TaskRow } from './TaskRow'

describe('TaskRow', () => {
  it('это чекбокс с подписью и подсказкой', () => {
    render(<TaskRow task="clean" checked={false} marked={false} onToggle={() => {}} />)
    expect(screen.getByRole('checkbox', { name: /Почистить/ })).toHaveAttribute('aria-checked', 'false')
  })

  it('помеченная задача остаётся кликабельной — не disabled', async () => {
    const onToggle = vi.fn()
    render(<TaskRow task="restore" checked={false} marked markLabel="не для замши" onToggle={onToggle} />)
    const c = screen.getByRole('checkbox')
    expect(c).not.toHaveAttribute('aria-disabled')
    await userEvent.click(c)
    expect(onToggle).toHaveBeenCalledWith(true)
  })

  it('метка несовместимости видна текстом, а не только цветом', () => {
    render(<TaskRow task="restore" checked marked markLabel="не для замши" onToggle={() => {}} />)
    expect(screen.getByText('не для замши')).toBeInTheDocument()
  })

  it('объяснение связано с флажком и анонсируется вежливо', () => {
    render(
      <TaskRow task="restore" checked marked markLabel="не для замши" onToggle={() => {}}
               explanation="Крем-реноватор склеит ворс замши." />
    )
    const id = screen.getByRole('checkbox').getAttribute('aria-describedby')
    expect(id).toBeTruthy()
    const note = document.getElementById(id as string)
    expect(note?.textContent).toContain('склеит ворс')
    expect(note?.closest('[aria-live]')).toHaveAttribute('aria-live', 'polite')
  })
})
