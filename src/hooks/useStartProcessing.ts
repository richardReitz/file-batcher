import { useMutation, useQueryClient } from '@tanstack/react-query'
import { startProcessing } from '@/api/batches'

export function useStartProcessing() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: startProcessing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] })
    },
  })
}
