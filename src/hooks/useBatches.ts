import { useQuery } from '@tanstack/react-query'
import { listBatches } from '@/api/batches'
import type { BatchListParams } from '@/types/batch'

export function useBatches(params?: BatchListParams) {
  return useQuery({
    queryKey: ['batches', params],
    queryFn: () => listBatches(params),
    refetchInterval: (query) => {
      const data = query.state.data
      if (!data) return false
      if (data.some((b) => b.status === 'PROCESSING')) return 3000
      if (data.some((b) => b.status === 'IMPORTED')) return 10000
      return false
    },
  })
}
