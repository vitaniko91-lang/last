import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { App } from './App'

describe('App', () => {
  it('рендерит шапку с именем бренда', () => {
    render(<App />)
    expect(screen.getByRole('link', { name: 'LAST' })).toBeInTheDocument()
  })
})
