import { render, screen } from '@testing-library/react'
import Home from './page'

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(<Home />)
    expect(screen.getByText('ZenStore')).toBeInTheDocument()
  })

  it('renders the subtitle', () => {
    render(<Home />)
    expect(screen.getByText('The Fastest E-commerce Experience')).toBeInTheDocument()
  })

  it('renders the welcome section', () => {
    render(<Home />)
    expect(screen.getByText('Welcome to ZenStore')).toBeInTheDocument()
  })

  it('renders the performance features', () => {
    render(<Home />)
    expect(screen.getByText('Performance')).toBeInTheDocument()
    expect(screen.getByText('Security')).toBeInTheDocument()
    expect(screen.getByText('Scalability')).toBeInTheDocument()
  })

  it('renders the call to action', () => {
    render(<Home />)
    expect(screen.getByText('Ready to Launch?')).toBeInTheDocument()
    expect(screen.getByText('Get Started')).toBeInTheDocument()
  })

  it('renders the footer', () => {
    render(<Home />)
    expect(screen.getByText(/© 2024 ZenStore/)).toBeInTheDocument()
  })
})