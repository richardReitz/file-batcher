import { client } from './client'
import type { Batch, BatchListParams } from '@/types/batch'

export async function listBatches(params?: BatchListParams): Promise<Batch[]> {
  const { data } = await client.get<Batch[]>('/api/file-batches', { params })
  return data
}

export async function getBatch(id: string): Promise<Batch> {
  const { data } = await client.get<Batch>(`/api/file-batches/${id}`)
  return data
}

export async function importBatchToActive(file: File): Promise<Batch> {
  const form = new FormData()
  form.append('file', file)
  const { data } = await client.post<Batch>('/api/file-batches/import/to-active', form)
  return data
}

export async function importBatchToInactive(file: File): Promise<Batch> {
  const form = new FormData()
  form.append('file', file)
  const { data } = await client.post<Batch>('/api/file-batches/import/to-inactive', form)
  return data
}

export async function startProcessing(): Promise<void> {
  await client.post('/api/file-batches/start-processing')
}

export async function cancelBatch(id: string): Promise<void> {
  await client.put(`/api/file-batches/${id}/status/cancelled`)
}

export async function retryBatch(id: string): Promise<void> {
  await client.put(`/api/file-batches/${id}/retry`)
}
