export type PartnerStatus = 'ACTIVE' | 'INACTIVE'

export interface Partner {
  id: string
  nome: string
  email: string
  cpf: string
  telefone: string
  status: PartnerStatus
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
