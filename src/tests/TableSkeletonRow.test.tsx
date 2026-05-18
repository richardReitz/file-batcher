import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Table, TableBody } from '@/components/ui/table'
import { TableSkeletonRow } from '@/components/ui/table-skeleton-row'

function wrap(ui: React.ReactElement) {
  return render(<Table><TableBody>{ui}</TableBody></Table>)
}

const columns = [
  { width: 'w-32', shape: 'text' as const },
  { width: 'w-28', shape: 'mono' as const },
  { width: 'w-20', shape: 'badge' as const },
  { width: 'w-16', shape: 'button' as const },
]

describe('TableSkeletonRow', () => {
  it('renders correct number of rows', () => {
    wrap(<TableSkeletonRow columns={columns} rows={3} />)
    // Each row has one cell per column; badge shape has h-6
    const badges = document.querySelectorAll('.h-6')
    expect(badges).toHaveLength(3)
  })

  it('renders 5 rows by default', () => {
    wrap(<TableSkeletonRow columns={columns} />)
    const badges = document.querySelectorAll('.h-6')
    expect(badges).toHaveLength(5)
  })

  it('applies badge shape class h-6 and rounded-full', () => {
    wrap(<TableSkeletonRow columns={[{ width: 'w-20', shape: 'badge' }]} rows={1} />)
    const el = document.querySelector('.h-6')
    expect(el).toHaveClass('rounded-full')
  })

  it('applies button shape class h-8', () => {
    wrap(<TableSkeletonRow columns={[{ width: 'w-16', shape: 'button' }]} rows={1} />)
    expect(document.querySelector('.h-8')).toBeInTheDocument()
  })

  it('rotates width array by row index', () => {
    wrap(<TableSkeletonRow columns={[{ width: ['w-32', 'w-40'], shape: 'text' }]} rows={2} />)
    expect(document.querySelector('.w-32')).toBeInTheDocument()
    expect(document.querySelector('.w-40')).toBeInTheDocument()
  })

  it('applies hidden class to cell when specified', () => {
    wrap(
      <TableSkeletonRow
        columns={[{ width: 'w-24', shape: 'text', hidden: 'hidden sm:table-cell' }]}
        rows={1}
      />
    )
    const cell = document.querySelector('td')
    expect(cell).toHaveClass('hidden')
  })
})
