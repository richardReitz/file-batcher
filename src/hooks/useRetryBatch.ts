import { useMutation, useQueryClient } from '@tanstack/react-query'
import { retryBatch } from '@/api/batches'
import { useToast } from '@/hooks/use-toast'

export function useRetryBatch(id: string) {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: () => retryBatch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] })
      queryClient.invalidateQueries({ queryKey: ['batch', id] })
      queryClient.invalidateQueries({ queryKey: ['items', id] })
      toast({ variant: 'success', title: 'Lote enviado para reprocessamento', description: 'Os itens com erro voltaram para pendente.' })
    },
    onError: (e: Error) => {
      toast({ variant: 'destructive', title: 'Erro ao reprocessar lote', description: e.message })
    },
  })
}
