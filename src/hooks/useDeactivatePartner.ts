import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deactivatePartner } from '@/api/partners'
import { useToast } from '@/hooks/use-toast'

export function useDeactivatePartner() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: (id: string) => deactivatePartner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] })
      toast({ variant: 'success', title: 'Parceiro inativado', description: 'O parceiro foi removido do sistema.' })
    },
  })
}
