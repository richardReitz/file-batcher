import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Play, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { TableSkeletonRow } from '@/components/ui/table-skeleton-row'
import { useBatches } from '@/hooks/useBatches'
import { useStartProcessing } from '@/hooks/useStartProcessing'
import { StatusBadge } from '@/components/StatusBadge'
import { BatchFilters } from './BatchFilters'
import { BATCH_STATUS_LABEL, BATCH_ACTION_LABEL } from '@/lib/enums'
import { formatDate } from '@/lib/format'
import type { BatchListParams } from '@/types/batch'

export function BatchListPage() {
  const [filters, setFilters] = useState<BatchListParams>({})
  const { data: batches, isLoading, isError } = useBatches(filters)
  const startProcessing = useStartProcessing()

  const importedCount = batches?.filter((b) => b.status === 'IMPORTED').length ?? 0
  const hasImported = importedCount > 0
  const isProcessing = batches?.some((b) => b.status === 'PROCESSING') ?? false

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-gray-900">Lotes</h1>
        <div className="flex gap-2 shrink-0">
          {!isLoading && (
            <Button
              variant="outline"
              onClick={() => startProcessing.mutate()}
              disabled={!hasImported || startProcessing.isPending || isProcessing}
              aria-label="Iniciar processamento"
            >
              {startProcessing.isPending || isProcessing ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin sm:mr-2" />
                  <span className="hidden sm:inline">Processando...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">
                    {importedCount > 1 ? `Processar próximo (${importedCount} na fila)` : 'Iniciar Processamento'}
                  </span>
                </>
              )}
            </Button>
          )}
          <Button asChild>
            <Link to="/batches/new">
              <Plus className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Novo Lote</span>
            </Link>
          </Button>
        </div>
      </div>

      <BatchFilters value={filters} onChange={setFilters} />

      {isError && (
        <p className="text-sm text-red-600">Erro ao carregar lotes.</p>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="hidden sm:table-cell">ID</TableHead>
            <TableHead>Ação</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Arquivo</TableHead>
            <TableHead className="hidden lg:table-cell">Atualizado em</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            <TableSkeletonRow
              rows={5}
              columns={[
                { width: 'w-20', shape: 'mono', hidden: 'hidden sm:table-cell' },
                { width: 'w-16', shape: 'badge' },
                { width: 'w-20', shape: 'badge' },
                { width: ['w-36', 'w-28'], shape: 'text' },
                { width: 'w-32', shape: 'text', hidden: 'hidden lg:table-cell' },
                { width: 'w-20', shape: 'button' },
              ]}
            />
          )}

          {!isLoading && batches?.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-400 py-10">
                Nenhum lote encontrado.
              </TableCell>
            </TableRow>
          )}

          {batches?.map((batch) => (
            <TableRow key={batch.id}>
              <TableCell className="hidden sm:table-cell font-mono text-xs text-gray-500">
                {batch.id.slice(0, 8)}...
              </TableCell>
              <TableCell>
                <StatusBadge status={batch.action} label={BATCH_ACTION_LABEL[batch.action]} />
              </TableCell>
              <TableCell>
                <StatusBadge status={batch.status} label={BATCH_STATUS_LABEL[batch.status]} />
              </TableCell>
              <TableCell className="text-sm text-gray-600 truncate max-w-[140px] sm:max-w-[180px]">{batch.name ?? '—'}</TableCell>
              <TableCell className="hidden lg:table-cell text-sm text-gray-600">{formatDate(batch.updatedAt)}</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" asChild>
                  <Link to={`/batches/${batch.id}`}>
                    <span className="sm:hidden">Ver</span>
                    <span className="hidden sm:inline">Ver detalhes</span>
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
