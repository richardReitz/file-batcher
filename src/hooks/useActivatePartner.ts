import { useMutation, useQueryClient } from '@tanstack/react-query'
import { activatePartner } from '@/api/partners'
import { useToast } from '@/hooks/use-toast'

export function useActivatePartner() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: (id: string) => activatePartner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] })
      toast({ variant: 'success', title: 'Parceiro ativado', description: 'O parceiro está ativo no sistema.' })
    },
  })
}
