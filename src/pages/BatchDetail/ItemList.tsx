import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { TableSkeletonRow } from '@/components/ui/table-skeleton-row'
import { StatusBadge } from '@/components/StatusBadge'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { EditItemModal } from './EditItemModal'
import { ItemSummaryBar } from './ItemSummaryBar'
import { useItems } from '@/hooks/useItems'
import { useIgnoreItem } from '@/hooks/useIgnoreItem'
import { ITEM_STATUS_LABEL } from '@/lib/enums'
import { formatCpf } from '@/lib/format'
import type { Item } from '@/types/item'
import type { BatchStatus } from '@/types/batch'

function parseItemData(data: string | null): { nome: string; email: string; cpf: string } {
  if (!data) return { nome: '—', email: '—', cpf: '—' }
  try {
    const parsed: Record<string, string> = JSON.parse(data)
    return {
      nome: parsed['NOME'] ?? '—',
      email: parsed['EMAIL'] ?? '—',
      cpf: parsed['CPF'] ?? '—',
    }
  } catch {
    return { nome: '—', email: '—', cpf: '—' }
  }
}

interface ItemListProps {
  fileBatchId: string
  batchStatus?: BatchStatus
}

export function ItemList({ fileBatchId, batchStatus }: ItemListProps) {
  const { data: items, isLoading, isFetching } = useItems(fileBatchId, batchStatus)
  const ignoreItem = useIgnoreItem(fileBatchId)
  const [confirmIgnore, setConfirmIgnore] = useState<Item | null>(null)
  const [editItem, setEditItem] = useState<Item | null>(null)

  return (
    <>
      {!isLoading && items && (
        <ItemSummaryBar
          items={items}
          isFetching={isFetching && (
            batchStatus === 'PROCESSING' ||
            (batchStatus !== 'IMPORTED' && items.some((i) => i.status === 'PENDING'))
          )}
        />
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead className="hidden sm:table-cell">CPF</TableHead>
            <TableHead className="hidden lg:table-cell">Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            <TableSkeletonRow
              rows={5}
              columns={[
                { width: ['w-32', 'w-40', 'w-28'], shape: 'text' },
                { width: 'w-28', shape: 'mono', hidden: 'hidden sm:table-cell' },
                { width: ['w-48', 'w-40'], shape: 'text', hidden: 'hidden lg:table-cell' },
                { width: 'w-20', shape: 'badge' },
                { width: 'w-14', shape: 'button' },
              ]}
            />
          )}

          {!isLoading && items?.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-gray-400 py-8">
                Nenhum item encontrado.
              </TableCell>
            </TableRow>
          )}

          {items?.map((item) => {
            const { nome, email, cpf } = parseItemData(item.data)
            return (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{nome}</TableCell>
              <TableCell className="hidden sm:table-cell font-mono text-sm whitespace-nowrap">{formatCpf(cpf)}</TableCell>
              <TableCell className="hidden lg:table-cell text-sm text-gray-600">{email}</TableCell>
              <TableCell>
                <StatusBadge status={item.status} label={ITEM_STATUS_LABEL[item.status]} />
              </TableCell>
              <TableCell>
                <div className="flex gap-1 whitespace-nowrap">
                  {(item.status === 'PENDING' || item.status === 'ERROR') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setConfirmIgnore(item)}
                      >
                        Ignorar
                      </Button>
                    )}
                  {item.status === 'ERROR' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditItem(item)}
                      >
                        Corrigir
                      </Button>
                    )}
                </div>
              </TableCell>
            </TableRow>
          )})}
        </TableBody>
      </Table>

      {confirmIgnore && (
        <ConfirmDialog
          open
          title="Ignorar item"
          description={`Tem certeza que deseja ignorar o item de ${parseItemData(confirmIgnore.data).nome}?`}
          confirmLabel="Ignorar"
          loading={ignoreItem.isPending}
          onConfirm={() =>
            ignoreItem.mutate(confirmIgnore.id, { onSuccess: () => setConfirmIgnore(null) })
          }
          onCancel={() => setConfirmIgnore(null)}
        />
      )}

      {editItem && (
        <EditItemModal
          item={editItem}
          fileBatchId={fileBatchId}
          onClose={() => setEditItem(null)}
        />
      )}
    </>
  )
}
