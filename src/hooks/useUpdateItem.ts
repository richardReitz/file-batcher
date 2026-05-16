import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateItem } from '@/api/items'
import type { UpdateItemPayload } from '@/types/item'

export function useUpdateItem(fileBatchId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ itemId, payload }: { itemId: string; payload: UpdateItemPayload }) =>
      updateItem(fileBatchId, itemId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items', fileBatchId] })
    },
  })
}
