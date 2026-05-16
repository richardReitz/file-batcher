import { useQuery } from '@tanstack/react-query'
import { listItems } from '@/api/items'

export function useItems(fileBatchId: string) {
  return useQuery({
    queryKey: ['items', fileBatchId],
    queryFn: () => listItems(fileBatchId),
    refetchInterval: (query) =>
      query.state.data?.some((item) => item.status === 'PENDING') ? 3000 : false,
  })
}
