import type { BatchStatus, BatchAction } from '@/types/batch'
import type { ItemStatus } from '@/types/item'
import type { PartnerStatus } from '@/types/partner'

export const BATCH_STATUS_LABEL: Record<BatchStatus, string> = {
  IMPORTED: 'Importado',
  PROCESSING: 'Processando',
  PROCESSED: 'Processado',
  CANCELLED: 'Cancelado',
  ERROR: 'Erro',
}

export const BATCH_ACTION_LABEL: Record<BatchAction, string> = {
  TO_ACTIVE: 'Ativar',
  TO_INACTIVE: 'Inativar',
}

export const ITEM_STATUS_LABEL: Record<ItemStatus, string> = {
  PENDING: 'Pendente',
  SUCCESS: 'Sucesso',
  ERROR: 'Erro',
  IGNORED: 'Ignorado',
}

export const PARTNER_STATUS_LABEL: Record<PartnerStatus, string> = {
  ACTIVE: 'Ativo',
  INACTIVE: 'Inativo',
}
