import { useMutation, useQueryClient } from '@tanstack/react-query'
import { activatePartner } from '@/api/partners'

export function useActivatePartner() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => activatePartner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] })
    },
  })
}
