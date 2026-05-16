import { useMutation, useQueryClient } from '@tanstack/react-query'
import { importBatchToActive, importBatchToInactive } from '@/api/batches'
import type { BatchAction } from '@/types/batch'

export function useImportBatch(action: BatchAction) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) =>
      action === 'TO_ACTIVE' ? importBatchToActive(file) : importBatchToInactive(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] })
    },
  })
}
