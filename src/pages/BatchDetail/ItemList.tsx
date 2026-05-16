import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { StatusBadge } from '@/components/StatusBadge'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { EditItemModal } from './EditItemModal'
import { useItems } from '@/hooks/useItems'
import { useIgnoreItem } from '@/hooks/useIgnoreItem'
import { ITEM_STATUS_LABEL } from '@/lib/enums'
import { formatCpf } from '@/lib/format'
import type { Item } from '@/types/item'

interface ItemListProps {
  fileBatchId: string
}

export function ItemList({ fileBatchId }: ItemListProps) {
  const { data: items, isLoading } = useItems(fileBatchId)
  const ignoreItem = useIgnoreItem(fileBatchId)
  const [confirmIgnore, setConfirmIgnore] = useState<Item | null>(null)
  const [editItem, setEditItem] = useState<Item | null>(null)

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>CPF</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Erro</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              {Array.from({ length: 6 }).map((_, j) => (
                <TableCell key={j}><Skeleton className="h-4 w-24" /></TableCell>
              ))}
            </TableRow>
          ))}

          {!isLoading && items?.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-400 py-8">
                Nenhum item encontrado.
              </TableCell>
            </TableRow>
          )}

          {items?.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.nome}</TableCell>
              <TableCell className="font-mono text-sm">{formatCpf(item.cpf)}</TableCell>
              <TableCell className="text-sm text-gray-600">{item.email}</TableCell>
              <TableCell>
                <StatusBadge status={item.status} label={ITEM_STATUS_LABEL[item.status]} />
              </TableCell>
              <TableCell className="text-sm text-red-600 max-w-xs truncate">
                {item.error ?? '—'}
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  {(item.status === 'PENDING' || item.status === 'ERROR') && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setConfirmIgnore(item)}
                      >
                        Ignorar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditItem(item)}
                      >
                        Corrigir
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {confirmIgnore && (
        <ConfirmDialog
          open
          title="Ignorar item"
          description={`Tem certeza que deseja ignorar o item de ${confirmIgnore.nome}?`}
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
