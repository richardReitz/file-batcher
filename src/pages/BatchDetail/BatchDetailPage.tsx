import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { StatusBadge } from '@/components/StatusBadge'
import { ItemList } from './ItemList'
import { useBatchDetail } from '@/hooks/useBatchDetail'
import { useCancelBatch } from '@/hooks/useCancelBatch'
import { useRetryBatch } from '@/hooks/useRetryBatch'
import { BATCH_STATUS_LABEL, BATCH_ACTION_LABEL } from '@/lib/enums'
import { formatDate } from '@/lib/format'

export function BatchDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: batch, isLoading, isError } = useBatchDetail(id!)
  const cancelBatch = useCancelBatch(id!)
  const retryBatch = useRetryBatch(id!)

  if (isError) {
    return <p className="text-red-600">Lote não encontrado.</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/batches"><ArrowLeft className="w-4 h-4" /></Link>
        </Button>
        <h1 className="text-2xl font-semibold text-gray-900">Detalhe do Lote</h1>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">ID</p>
          {isLoading ? <Skeleton className="h-5 w-24" /> : <p className="font-mono text-sm text-gray-700">{batch!.id.slice(0, 8)}...</p>}
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Ação</p>
          {isLoading ? <Skeleton className="h-6 w-20 rounded-md" /> : <StatusBadge status={batch!.action} label={BATCH_ACTION_LABEL[batch!.action]} />}
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Status</p>
          {isLoading ? <Skeleton className="h-6 w-20 rounded-md" /> : <StatusBadge status={batch!.status} label={BATCH_STATUS_LABEL[batch!.status]} />}
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Arquivo</p>
          {isLoading ? <Skeleton className="h-5 w-36" /> : <p className="font-medium text-sm truncate overflow-hidden">{batch!.name ?? '—'}</p>}
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Atualizado em</p>
          {isLoading ? <Skeleton className="h-5 w-32" /> : <p className="text-sm text-gray-700">{formatDate(batch!.updatedAt)}</p>}
        </div>
      </div>

      {!isLoading && (
        <>
          <div className="flex gap-2">
            {batch!.status === 'IMPORTED' && (
              <Button
                variant="outline"
                className="text-red-600 border-red-300 hover:bg-red-50"
                onClick={() => cancelBatch.mutate()}
                disabled={cancelBatch.isPending}
              >
                Cancelar lote
              </Button>
            )}
            {batch!.status === 'ERROR' && (
              <Button
                variant="outline"
                onClick={() => retryBatch.mutate()}
                disabled={retryBatch.isPending}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Tentar novamente
              </Button>
            )}
          </div>

          {batch!.status === 'PROCESSING' && (
            <p className="text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-md">
              Processando itens... isso pode levar alguns segundos.
            </p>
          )}

          <ItemList fileBatchId={batch!.id} />
        </>
      )}
    </div>
  )
}
