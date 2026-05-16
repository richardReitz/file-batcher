import { useMutation, useQueryClient } from '@tanstack/react-query'
import { retryBatch } from '@/api/batches'

export function useRetryBatch(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => retryBatch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] })
      queryClient.invalidateQueries({ queryKey: ['batch', id] })
      queryClient.invalidateQueries({ queryKey: ['items', id] })
    },
  })
}
