import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateItem } from '@/api/items'
import { useToast } from '@/hooks/use-toast'
import type { UpdateItemPayload } from '@/types/item'

export function useUpdateItem(fileBatchId: string) {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: ({ itemId, payload }: { itemId: string; payload: UpdateItemPayload }) =>
      updateItem(fileBatchId, itemId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items', fileBatchId] })
      toast({ variant: 'success', title: 'Item corrigido', description: 'Os dados foram salvos e o item será reprocessado.' })
    },
  })
}
