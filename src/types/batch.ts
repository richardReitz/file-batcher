export type BatchStatus = 'IMPORTED' | 'PROCESSING' | 'PROCESSED' | 'CANCELLED' | 'ERROR'
export type BatchAction = 'TO_ACTIVE' | 'TO_INACTIVE'

export interface Batch {
  id: string
  name: string | null
  action: BatchAction
  status: BatchStatus
  updatedAt: string
  createdAt: string
}

export interface BatchListParams {
  fromUpdatedAt?: string
  toUpdatedAt?: string
  status?: BatchStatus
  action?: BatchAction
}
