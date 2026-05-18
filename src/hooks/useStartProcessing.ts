import { useMutation, useQueryClient } from '@tanstack/react-query'
import { startProcessing } from '@/api/batches'
import { useToast } from '@/hooks/use-toast'

export function useStartProcessing() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: startProcessing,
    onMutate: () => {
      toast({ title: 'Processamento iniciado', description: 'Os itens estão sendo processados em segundo plano.' })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] })
      queryClient.invalidateQueries({ queryKey: ['batch'] })
    },
    onError: (e: Error) => {
      toast({ variant: 'destructive', title: 'Erro ao iniciar processamento', description: e.message })
    },
  })
}
