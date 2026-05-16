import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { StatusBadge } from '@/components/StatusBadge'

describe('StatusBadge', () => {
  it('renders the label text', () => {
    render(<StatusBadge status="IMPORTED" label="Importado" />)
    expect(screen.getByText('Importado')).toBeInTheDocument()
  })

  it('applies gray style for IMPORTED', () => {
    render(<StatusBadge status="IMPORTED" label="Importado" />)
    expect(screen.getByTestId('status-badge-IMPORTED')).toHaveClass('bg-gray-100')
  })

  it('applies animate-pulse for PROCESSING', () => {
    render(<StatusBadge status="PROCESSING" label="Processando" />)
    expect(screen.getByTestId('status-badge-PROCESSING')).toHaveClass('animate-pulse')
  })

  it('applies green style for PROCESSED', () => {
    render(<StatusBadge status="PROCESSED" label="Processado" />)
    expect(screen.getByTestId('status-badge-PROCESSED')).toHaveClass('bg-green-100')
  })

  it('applies red style for ERROR', () => {
    render(<StatusBadge status="ERROR" label="Erro" />)
    expect(screen.getByTestId('status-badge-ERROR')).toHaveClass('bg-red-100')
  })

  it('applies orange style for CANCELLED', () => {
    render(<StatusBadge status="CANCELLED" label="Cancelado" />)
    expect(screen.getByTestId('status-badge-CANCELLED')).toHaveClass('bg-orange-100')
  })
})
