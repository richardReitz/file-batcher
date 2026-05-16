import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ItemList } from '@/pages/BatchDetail/ItemList'
import { renderWithProviders } from './utils'
import * as itemsApi from '@/api/items'
import type { Item } from '@/types/item'

vi.mock('@/api/items')

const mockItems: Item[] = [
  {
    id: 'item-1',
    fileBatchId: 'batch-1',
    data: JSON.stringify({ NOME: 'João Silva', EMAIL: 'joao@test.com', CPF: '12345678901', TELEFONE: '(11)99999-9999' }),
    status: 'PENDING',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'item-2',
    fileBatchId: 'batch-1',
    data: JSON.stringify({ NOME: 'Maria Santos', EMAIL: 'maria@test.com', CPF: '98765432100', TELEFONE: '(11)88888-8888' }),
    status: 'ERROR',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
]

describe('ItemList', () => {
  beforeEach(() => {
    vi.mocked(itemsApi.listItems).mockResolvedValue(mockItems)
    vi.mocked(itemsApi.ignoreItem).mockResolvedValue(undefined)
  })

  it('renders item names', async () => {
    renderWithProviders(<ItemList fileBatchId="batch-1" />)
    expect(await screen.findByText('João Silva')).toBeInTheDocument()
    expect(await screen.findByText('Maria Santos')).toBeInTheDocument()
  })

  it('shows Ignorar button for PENDING and ERROR items', async () => {
    renderWithProviders(<ItemList fileBatchId="batch-1" />)
    const ignoreButtons = await screen.findAllByRole('button', { name: /^ignorar$/i })
    expect(ignoreButtons).toHaveLength(2)
  })

  it('calls ignoreItem with correct IDs after confirming', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ItemList fileBatchId="batch-1" />)
    const ignoreButtons = await screen.findAllByRole('button', { name: /^ignorar$/i })
    await user.click(ignoreButtons[0])
    const confirmButton = await screen.findByRole('button', { name: /^ignorar$/i })
    await user.click(confirmButton)
    await waitFor(() => {
      expect(itemsApi.ignoreItem).toHaveBeenCalledWith('batch-1', 'item-1')
    })
  })
})
