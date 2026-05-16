import { client } from './client'
import type { Item, UpdateItemPayload } from '@/types/item'

export async function listItems(fileBatchId: string): Promise<Item[]> {
  const { data } = await client.get<Item[]>(`/api/file-batches/${fileBatchId}/items`)
  return data
}

export async function ignoreItem(fileBatchId: string, itemId: string): Promise<void> {
  await client.put(`/api/file-batches/${fileBatchId}/items/${itemId}/ignore`)
}

export async function updateItem(
  fileBatchId: string,
  itemId: string,
  payload: UpdateItemPayload
): Promise<Item> {
  const { data } = await client.put<Item>(
    `/api/file-batches/${fileBatchId}/items/${itemId}`,
    payload
  )
  return data
}
