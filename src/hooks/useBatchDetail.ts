import { useQuery } from '@tanstack/react-query'
import { getBatch } from '@/api/batches'

export function useBatchDetail(id: string) {
  return useQuery({
    queryKey: ['batch', id],
    queryFn: () => getBatch(id),
    refetchInterval: (query) => {
      const status = query.state.data?.status
      if (status === 'PROCESSING') return 3000
      if (status === 'IMPORTED') return 5000
      return false
    },
  })
}
