import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Skeleton } from '@/components/ui/skeleton'

describe('Skeleton', () => {
  it('uses animate-pulse by default', () => {
    const { container } = render(<Skeleton />)
    expect(container.firstChild).toHaveClass('animate-pulse')
  })

  it('uses animate-shimmer when variant is shimmer', () => {
    const { container } = render(<Skeleton variant="shimmer" />)
    expect(container.firstChild).toHaveClass('animate-shimmer')
    expect(container.firstChild).not.toHaveClass('animate-pulse')
  })

  it('forwards className correctly', () => {
    const { container } = render(<Skeleton variant="shimmer" className="w-32 h-4" />)
    expect(container.firstChild).toHaveClass('w-32', 'h-4')
  })
})
