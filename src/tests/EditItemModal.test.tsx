import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { EditItemModal } from '@/pages/BatchDetail/EditItemModal'
import { renderWithProviders } from './utils'
import * as itemsApi from '@/api/items'
import type { Item } from '@/types/item'

vi.mock('@/api/items')

const mockItem: Item = {
  id: 'item-1',
  fileBatchId: 'batch-1',
  data: JSON.stringify({ NOME: 'João Silva', EMAIL: 'joao@test.com', CPF: '12345678901', TELEFONE: '11999999999' }),
  status: 'ERROR',
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-15T10:00:00Z',
}

describe('EditItemModal', () => {
  beforeEach(() => {
    vi.mocked(itemsApi.updateItem).mockResolvedValue({ ...mockItem, status: 'PENDING' })
    vi.mocked(itemsApi.listItems).mockResolvedValue([])
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('exibe estado de sucesso após salvar', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    const onClose = vi.fn()
    renderWithProviders(<EditItemModal item={mockItem} fileBatchId="batch-1" onClose={onClose} />)

    await user.click(screen.getByRole('button', { name: /salvar/i }))

    expect(await screen.findByText('Item corrigido!')).toBeInTheDocument()
    expect(screen.getByText(/será reprocessado/i)).toBeInTheDocument()
    expect(screen.getByText(/fechando automaticamente/i)).toBeInTheDocument()
  })

  it('chama onClose após 1.5s no estado de sucesso', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    const onClose = vi.fn()
    renderWithProviders(<EditItemModal item={mockItem} fileBatchId="batch-1" onClose={onClose} />)

    await user.click(screen.getByRole('button', { name: /salvar/i }))
    await screen.findByText('Item corrigido!')

    expect(onClose).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1500)
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1))
  })
})
