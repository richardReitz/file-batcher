import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BatchListPage } from '@/pages/BatchList/BatchListPage'
import { renderWithProviders } from './utils'
import * as batchesApi from '@/api/batches'
import type { Batch } from '@/types/batch'

vi.mock('@/api/batches')

const importedBatch: Batch = {
  id: 'batch-imported',
  action: 'TO_ACTIVE',
  status: 'IMPORTED',
  totalItems: 5,
  updatedAt: '2024-01-15T10:00:00Z',
  createdAt: '2024-01-15T09:00:00Z',
}

const processedBatch: Batch = {
  ...importedBatch,
  id: 'batch-processed',
  status: 'PROCESSED',
}

describe('ProcessButton', () => {
  beforeEach(() => {
    vi.mocked(batchesApi.startProcessing).mockResolvedValue(undefined)
  })

  it('is disabled when no IMPORTED batch exists', async () => {
    vi.mocked(batchesApi.listBatches).mockResolvedValue([processedBatch])
    renderWithProviders(<BatchListPage />)
    const button = await screen.findByRole('button', { name: /iniciar processamento/i })
    expect(button).toBeDisabled()
  })

  it('is enabled when an IMPORTED batch exists', async () => {
    vi.mocked(batchesApi.listBatches).mockResolvedValue([importedBatch])
    renderWithProviders(<BatchListPage />)
    const button = await screen.findByRole('button', { name: /iniciar processamento/i })
    expect(button).not.toBeDisabled()
  })

  it('calls startProcessing when clicked', async () => {
    vi.mocked(batchesApi.listBatches).mockResolvedValue([importedBatch])
    const user = userEvent.setup()
    renderWithProviders(<BatchListPage />)
    const button = await screen.findByRole('button', { name: /iniciar processamento/i })
    await user.click(button)
    await waitFor(() => {
      expect(batchesApi.startProcessing).toHaveBeenCalledOnce()
    })
  })
})
