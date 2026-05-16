import { useQuery } from '@tanstack/react-query'
import { listBatches } from '@/api/batches'
import type { BatchListParams } from '@/types/batch'

export function useBatches(params?: BatchListParams) {
  return useQuery({
    queryKey: ['batches', params],
    queryFn: () => listBatches(params),
    refetchInterval: (query) =>
      query.state.data?.some((b) => b.status === 'PROCESSING') ? 3000 : false,
  })
}
