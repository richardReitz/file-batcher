export type BatchStatus = 'IMPORTED' | 'PROCESSING' | 'PROCESSED' | 'CANCELLED' | 'ERROR'
export type BatchAction = 'TO_ACTIVE' | 'TO_INACTIVE'

export interface Batch {
  id: string
  action: BatchAction
  status: BatchStatus
  totalItems: number
  updatedAt: string
  createdAt: string
}

export interface BatchListParams {
  fromUpdatedAt?: string
  toUpdatedAt?: string
  status?: BatchStatus
  action?: BatchAction
}
