import { useMutation, useQueryClient } from '@tanstack/react-query'
import { startProcessing } from '@/api/batches'
import { useToast } from '@/hooks/use-toast'

export function useStartProcessing() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: startProcessing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] })
      queryClient.invalidateQueries({ queryKey: ['batch'] })
      toast({ title: 'Processamento concluído', description: 'Verifique os detalhes do lote para ver o resultado.' })
    },
  })
}
