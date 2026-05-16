import { screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BatchListPage } from '@/pages/BatchList/BatchListPage'
import { renderWithProviders } from './utils'
import * as batchesApi from '@/api/batches'
import type { Batch } from '@/types/batch'

vi.mock('@/api/batches')

const mockBatches: Batch[] = [
  {
    id: 'abc-12345678',
    action: 'TO_ACTIVE',
    status: 'IMPORTED',
    totalItems: 10,
    updatedAt: '2024-01-15T10:00:00Z',
    createdAt: '2024-01-15T09:00:00Z',
  },
  {
    id: 'def-87654321',
    action: 'TO_INACTIVE',
    status: 'PROCESSED',
    totalItems: 5,
    updatedAt: '2024-01-14T10:00:00Z',
    createdAt: '2024-01-14T09:00:00Z',
  },
]

describe('BatchListPage', () => {
  beforeEach(() => {
    vi.mocked(batchesApi.listBatches).mockResolvedValue(mockBatches)
    vi.mocked(batchesApi.startProcessing).mockResolvedValue(undefined)
  })

  it('renders batch IDs after loading', async () => {
    renderWithProviders(<BatchListPage />)
    expect(await screen.findByText('abc-1234...')).toBeInTheDocument()
  })

  it('renders status badges for each batch', async () => {
    renderWithProviders(<BatchListPage />)
    expect(await screen.findByText('Importado')).toBeInTheDocument()
    expect(await screen.findByText('Processado')).toBeInTheDocument()
  })

  it('renders detail links pointing to correct batch IDs', async () => {
    renderWithProviders(<BatchListPage />)
    const links = await screen.findAllByRole('link', { name: /ver detalhes/i })
    expect(links[0]).toHaveAttribute('href', '/batches/abc-12345678')
    expect(links[1]).toHaveAttribute('href', '/batches/def-87654321')
  })

  it('shows empty state when no batches', async () => {
    vi.mocked(batchesApi.listBatches).mockResolvedValue([])
    renderWithProviders(<BatchListPage />)
    expect(await screen.findByText(/nenhum lote encontrado/i)).toBeInTheDocument()
  })
})
