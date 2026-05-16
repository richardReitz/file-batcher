import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ignoreItem } from '@/api/items'

export function useIgnoreItem(fileBatchId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (itemId: string) => ignoreItem(fileBatchId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items', fileBatchId] })
    },
  })
}
