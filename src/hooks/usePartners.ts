import { useQuery } from '@tanstack/react-query'
import { listPartners } from '@/api/partners'
import type { PartnerListParams } from '@/types/partner'

export function usePartners(params: PartnerListParams) {
  return useQuery({
    queryKey: ['partners', params],
    queryFn: () => listPartners(params),
  })
}
