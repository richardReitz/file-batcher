import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ignoreItem } from '@/api/items'
import { useToast } from '@/hooks/use-toast'

export function useIgnoreItem(fileBatchId: string) {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: (itemId: string) => ignoreItem(fileBatchId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items', fileBatchId] })
      toast({ variant: 'success', title: 'Item ignorado', description: 'O item não será processado.' })
    },
  })
}
