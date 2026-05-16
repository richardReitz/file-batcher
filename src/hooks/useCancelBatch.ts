import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cancelBatch } from '@/api/batches'
import { useToast } from '@/hooks/use-toast'

export function useCancelBatch(id: string) {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: () => cancelBatch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batch', id] })
      queryClient.invalidateQueries({ queryKey: ['batches'] })
      toast({ variant: 'success', title: 'Lote cancelado', description: 'O lote foi cancelado com sucesso.' })
    },
  })
}
