import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ItemSummaryBar } from '@/pages/BatchDetail/ItemSummaryBar'
import type { Item } from '@/types/item'

function item(status: Item['status'], id = '1'): Item {
  return { id, fileBatchId: 'b1', data: null, status, createdAt: '', updatedAt: '' }
}

describe('ItemSummaryBar', () => {
  it('mostra contagem de processados', () => {
    render(<ItemSummaryBar items={[item('PROCESSED', '1'), item('PROCESSED', '2')]} isFetching={false} />)
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('processados')).toBeInTheDocument()
  })

  it('mostra contagem de erros em vermelho', () => {
    render(<ItemSummaryBar items={[item('ERROR')]} isFetching={false} />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('com erro')).toBeInTheDocument()
  })

  it('oculta pendentes quando count é 0', () => {
    render(<ItemSummaryBar items={[item('PROCESSED')]} isFetching={false} />)
    expect(screen.queryByText('pendentes')).not.toBeInTheDocument()
  })

  it('oculta erros quando count é 0', () => {
    render(<ItemSummaryBar items={[item('PROCESSED')]} isFetching={false} />)
    expect(screen.queryByText('com erro')).not.toBeInTheDocument()
  })

  it('mostra atualizando quando isFetching=true', () => {
    render(<ItemSummaryBar items={[]} isFetching={true} />)
    expect(screen.getByText('atualizando...')).toBeInTheDocument()
  })

  it('oculta atualizando quando isFetching=false', () => {
    render(<ItemSummaryBar items={[]} isFetching={false} />)
    expect(screen.queryByText('atualizando...')).not.toBeInTheDocument()
  })

  it('mostra todos os status juntos', () => {
    const items = [
      item('PROCESSED', '1'),
      item('ERROR', '2'),
      item('PENDING', '3'),
      item('IGNORED', '4'),
    ]
    render(<ItemSummaryBar items={items} isFetching={false} />)
    expect(screen.getByText('processados')).toBeInTheDocument()
    expect(screen.getByText('com erro')).toBeInTheDocument()
    expect(screen.getByText('pendentes')).toBeInTheDocument()
    expect(screen.getByText('ignorados')).toBeInTheDocument()
  })
})
