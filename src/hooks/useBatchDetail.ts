import { useQuery } from '@tanstack/react-query'
import { getBatch } from '@/api/batches'

export function useBatchDetail(id: string) {
  return useQuery({
    queryKey: ['batch', id],
    queryFn: () => getBatch(id),
    refetchInterval: (query) =>
      query.state.data?.status === 'PROCESSING' ? 3000 : false,
  })
}
