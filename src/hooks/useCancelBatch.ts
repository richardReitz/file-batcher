import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cancelBatch } from '@/api/batches'

export function useCancelBatch(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => cancelBatch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batch', id] })
      queryClient.invalidateQueries({ queryKey: ['batches'] })
    },
  })
}
