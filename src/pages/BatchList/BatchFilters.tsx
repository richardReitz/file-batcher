import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { BatchListParams, BatchStatus, BatchAction } from '@/types/batch'

function isoToLocalDateInput(iso: string): string {
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

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
    <div className="grid grid-cols-2 gap-3 items-end lg:flex lg:flex-wrap">
      <div className="lg:w-44">
        <label className="block text-xs text-gray-500 mb-1">Status</label>
        <Select
          value={value.status ?? 'all'}
          onValueChange={(v) => onChange({ ...value, status: v === 'all' ? undefined : v as BatchStatus })}
        >
          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            {STATUS_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="lg:w-44">
        <label className="block text-xs text-gray-500 mb-1">Ação</label>
        <Select
          value={value.action ?? 'all'}
          onValueChange={(v) => onChange({ ...value, action: v === 'all' ? undefined : v as BatchAction })}
        >
          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as ações</SelectItem>
            {ACTION_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="lg:w-40">
        <label className="block text-xs text-gray-500 mb-1">De</label>
        <Input
          type="date"
          value={value.fromUpdatedAt ? isoToLocalDateInput(value.fromUpdatedAt) : ''}
          onChange={(e) => onChange({ ...value, fromUpdatedAt: e.target.value ? new Date(`${e.target.value}T00:00:00`).toISOString() : undefined })}
          className="w-full"
        />
      </div>

      <div className="lg:w-40">
        <label className="block text-xs text-gray-500 mb-1">Até</label>
        <Input
          type="date"
          value={value.toUpdatedAt ? isoToLocalDateInput(value.toUpdatedAt) : ''}
          onChange={(e) => onChange({ ...value, toUpdatedAt: e.target.value ? new Date(`${e.target.value}T23:59:59`).toISOString() : undefined })}
          className="w-full"
        />
      </div>

      <div className="col-span-2 lg:col-auto flex items-end">
        <Button variant="ghost" size="sm" onClick={() => onChange({})}>
          Limpar
        </Button>
      </div>
    </div>
  )
}
