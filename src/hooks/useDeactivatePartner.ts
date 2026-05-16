import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deactivatePartner } from '@/api/partners'

export function useDeactivatePartner() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deactivatePartner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] })
    },
  })
}
