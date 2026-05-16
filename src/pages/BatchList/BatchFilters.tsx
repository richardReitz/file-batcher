import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { BatchListParams, BatchStatus, BatchAction } from '@/types/batch'

interface BatchFiltersProps {
  value: BatchListParams
  onChange: (params: BatchListParams) => void
}

const STATUS_OPTIONS: { value: BatchStatus; label: string }[] = [
  { value: 'IMPORTED', label: 'Importado' },
  { value: 'PROCESSING', label: 'Processando' },
  { value: 'PROCESSED', label: 'Processado' },
  { value: 'ERROR', label: 'Erro' },
  { value: 'CANCELLED', label: 'Cancelado' },
]

const ACTION_OPTIONS: { value: BatchAction; label: string }[] = [
  { value: 'TO_ACTIVE', label: 'Ativar' },
  { value: 'TO_INACTIVE', label: 'Inativar' },
]

export function BatchFilters({ value, onChange }: BatchFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3 items-end">
      <div className="w-44">
        <label className="block text-xs text-gray-500 mb-1">Status</label>
        <Select
          value={value.status ?? 'all'}
          onValueChange={(v) => onChange({ ...value, status: v === 'all' ? undefined : v as BatchStatus })}
        >
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            {STATUS_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-44">
        <label className="block text-xs text-gray-500 mb-1">Ação</label>
        <Select
          value={value.action ?? 'all'}
          onValueChange={(v) => onChange({ ...value, action: v === 'all' ? undefined : v as BatchAction })}
        >
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as ações</SelectItem>
            {ACTION_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">De</label>
        <Input
          type="date"
          value={value.fromUpdatedAt?.split('T')[0] ?? ''}
          onChange={(e) => onChange({ ...value, fromUpdatedAt: e.target.value ? `${e.target.value}T00:00:00Z` : undefined })}
          className="w-40"
        />
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Até</label>
        <Input
          type="date"
          value={value.toUpdatedAt?.split('T')[0] ?? ''}
          onChange={(e) => onChange({ ...value, toUpdatedAt: e.target.value ? `${e.target.value}T23:59:59Z` : undefined })}
          className="w-40"
        />
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onChange({})}
      >
        Limpar
      </Button>
    </div>
  )
}
