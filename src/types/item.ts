export type ItemStatus = 'PENDING' | 'SUCCESS' | 'ERROR' | 'IGNORED'

export interface Item {
  id: string
  fileBatchId: string
  nome: string
  email: string
  cpf: string
  telefone: string
  status: ItemStatus
  error?: string | null
  lineNumber?: number
}

export interface UpdateItemPayload {
  nome: string
  email: string
  cpf: string
  telefone: string
}
