import { client } from './client'
import type { PartnerListParams, PaginatedPartners } from '@/types/partner'

export async function listPartners(params?: PartnerListParams): Promise<PaginatedPartners> {
  const { data } = await client.get<PaginatedPartners>('/api/partners', { params })
  return data
}

export async function activatePartner(id: string): Promise<void> {
  await client.put(`/api/partners/${id}/activate`)
}

export async function deactivatePartner(id: string): Promise<void> {
  await client.put(`/api/partners/${id}/deactivate`)
}
