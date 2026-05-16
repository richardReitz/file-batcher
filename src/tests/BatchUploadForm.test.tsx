import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BatchUploadForm } from '@/pages/BatchNew/BatchUploadForm'
import { renderWithProviders } from './utils'
import * as batchesApi from '@/api/batches'
import type { Batch } from '@/types/batch'

vi.mock('@/api/batches')

const mockBatch: Batch = {
  id: 'batch-1',
  name: 'partners.csv',
  action: 'TO_ACTIVE',
  status: 'IMPORTED',
  updatedAt: '2024-01-15T10:00:00Z',
  createdAt: '2024-01-15T10:00:00Z',
}

describe('BatchUploadForm', () => {
  beforeEach(() => {
    vi.mocked(batchesApi.importBatchToActive).mockResolvedValue(mockBatch)
    vi.mocked(batchesApi.importBatchToInactive).mockResolvedValue({
      ...mockBatch,
      action: 'TO_INACTIVE',
    })
  })

  it('renders both tabs', () => {
    renderWithProviders(<BatchUploadForm />)
    expect(screen.getByRole('tab', { name: /^ativar parceiros$/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /^inativar parceiros$/i })).toBeInTheDocument()
  })

  it('disables submit button when no file is selected', () => {
    renderWithProviders(<BatchUploadForm />)
    expect(screen.getByRole('button', { name: /enviar arquivo/i })).toBeDisabled()
  })

  it('enables submit button after file is selected', async () => {
    const user = userEvent.setup()
    renderWithProviders(<BatchUploadForm />)
    const input = screen.getByLabelText(/arquivo csv/i)
    const file = new File(['NOME;EMAIL;CPF;TELEFONE\n'], 'partners.csv', { type: 'text/csv' })
    await user.upload(input, file)
    expect(screen.getByRole('button', { name: /enviar arquivo/i })).not.toBeDisabled()
  })

  it('calls importBatchToActive when submitting on the Ativar tab', async () => {
    const user = userEvent.setup()
    renderWithProviders(<BatchUploadForm />)
    const file = new File(['content'], 'partners.csv', { type: 'text/csv' })
    await user.upload(screen.getByLabelText(/arquivo csv/i), file)
    await user.click(screen.getByRole('button', { name: /enviar arquivo/i }))
    await waitFor(() => {
      expect(batchesApi.importBatchToActive).toHaveBeenCalledWith(file)
    })
  })

  it('calls importBatchToInactive when submitting on the Inativar tab', async () => {
    const user = userEvent.setup()
    renderWithProviders(<BatchUploadForm />)
    await user.click(screen.getByRole('tab', { name: /^inativar parceiros$/i }))
    const file = new File(['content'], 'partners.csv', { type: 'text/csv' })
    await user.upload(screen.getByLabelText(/arquivo csv/i), file)
    await user.click(screen.getByRole('button', { name: /enviar arquivo/i }))
    await waitFor(() => {
      expect(batchesApi.importBatchToInactive).toHaveBeenCalledWith(file)
    })
  })
})
