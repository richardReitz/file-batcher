export type PartnerStatus = 'ACTIVE' | 'INACTIVE'

export interface Partner {
  id: string
  name: string | null
  document: string | null
  email: string | null
  phone: string | null
  status: PartnerStatus
  createdAt: string
  updatedAt: string
}

export interface PartnerListParams {
  nameContains?: string
  documentEquals?: string
  page?: number
  pageSize?: number
}

// ⚠️ Verify exact shape against Swagger — adjust field names if needed
export interface PaginatedPartners {
  items: Partner[]
  totalCount: number
  page: number
  pageSize: number
}
