import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Play, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
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

  const hasImported = batches?.some((b) => b.status === 'IMPORTED') ?? false
  const isProcessing = batches?.some((b) => b.status === 'PROCESSING') ?? false

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-semibold text-gray-900">Lotes</h1>
        <div className="flex gap-2">
          {!isLoading && (
            <Button
              variant="outline"
              onClick={() => startProcessing.mutate()}
              disabled={!hasImported || startProcessing.isPending || isProcessing}
              aria-label="Iniciar processamento"
            >
              {startProcessing.isPending || isProcessing ? (
                <><RotateCcw className="w-4 h-4 mr-2 animate-spin" />Processando...</>
              ) : (
                <><Play className="w-4 h-4 mr-2" />Iniciar Processamento</>
              )}
            </Button>
          )}
          <Button asChild>
            <Link to="/batches/new">
              <Plus className="w-4 h-4 mr-2" />
              Novo Lote
            </Link>
          </Button>
        </div>
      </div>

      {isProcessing && (
        <p className="text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-md">
          Processando itens... isso pode levar alguns segundos.
        </p>
      )}

      <BatchFilters value={filters} onChange={setFilters} />

      {isError && (
        <p className="text-sm text-red-600">Erro ao carregar lotes.</p>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Ação</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Arquivo</TableHead>
            <TableHead>Atualizado em</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              {Array.from({ length: 6 }).map((_, j) => (
                <TableCell key={j}><Skeleton className="h-4 w-20" /></TableCell>
              ))}
            </TableRow>
          ))}

          {!isLoading && batches?.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-400 py-10">
                Nenhum lote encontrado.
              </TableCell>
            </TableRow>
          )}

          {batches?.map((batch) => (
            <TableRow key={batch.id}>
              <TableCell className="font-mono text-xs text-gray-500">
                {batch.id.slice(0, 8)}...
              </TableCell>
              <TableCell>
                <StatusBadge status={batch.action} label={BATCH_ACTION_LABEL[batch.action]} />
              </TableCell>
              <TableCell>
                <StatusBadge status={batch.status} label={BATCH_STATUS_LABEL[batch.status]} />
              </TableCell>
              <TableCell className="text-sm text-gray-600 truncate max-w-[180px]">{batch.name ?? '—'}</TableCell>
              <TableCell className="text-sm text-gray-600">{formatDate(batch.updatedAt)}</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" asChild>
                  <Link to={`/batches/${batch.id}`}>Ver detalhes</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
