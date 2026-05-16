export type ItemStatus = 'PENDING' | 'PROCESSED' | 'ERROR' | 'IGNORED'

export interface Item {
  id: string
  fileBatchId: string
  data: string | null
  status: ItemStatus
  createdAt: string
  updatedAt: string
}

export interface UpdateItemPayload {
  nome: string
  email: string
  cpf: string
  telefone: string
}
