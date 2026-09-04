import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, it, expect } from 'vitest'
import { CaseStudy } from './CaseStudy'

const view = () => render(<MemoryRouter><CaseStudy /></MemoryRouter>)

describe('CaseStudy', () => {
  it('каждая находка сопровождается решением и ссылкой на живой экран', () => {
    view()
    const findings = screen.getAllByRole('article')
    expect(findings).toHaveLength(4)
    for (const f of findings) {
      expect(f.textContent).toMatch(/Решение/)
      expect(f.querySelector('a')).toBeTruthy()
    }
  })

  it('у каждой находки есть замеренное число, а не «многие магазины»', () => {
    view()
    for (const f of screen.getAllByRole('article')) {
      expect(f.textContent).toMatch(/\d/)
    }
  })

  it('называет, что сделано в Figma и не сделано в коде', () => {
    view()
    expect(screen.getByText(/Чекаут и аккаунт/)).toBeInTheDocument()
  })

  it('ведёт на публичный файл Figma', () => {
    view()
    expect(screen.getByRole('link', { name: /Figma/ }))
      .toHaveAttribute('href', expect.stringContaining('figma.com/design/ztM2VHMovlutEykLNGPLVq'))
  })
})
