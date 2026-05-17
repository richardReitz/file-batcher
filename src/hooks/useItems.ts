import { useQuery } from '@tanstack/react-query'
import { listItems } from '@/api/items'
import type { BatchStatus } from '@/types/batch'

export function useItems(fileBatchId: string, batchStatus?: BatchStatus) {
  return useQuery({
    queryKey: ['items', fileBatchId],
    queryFn: () => listItems(fileBatchId),
    refetchInterval: (query) => {
      if (batchStatus === 'PROCESSING') return 3000
      if (query.state.data?.some((item) => item.status === 'PENDING')) return 3000
      return false
    },
  })
}
