import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { PartnerListParams } from '@/types/partner'

interface PartnerFiltersProps {
  value: PartnerListParams
  onChange: (params: PartnerListParams) => void
}

export function PartnerFilters({ value, onChange }: PartnerFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3 items-end">
      <div>
        <label className="block text-xs text-gray-500 mb-1">Nome</label>
        <Input
          placeholder="Buscar por nome..."
          value={value.nameContains ?? ''}
          onChange={(e) => onChange({ ...value, nameContains: e.target.value || undefined, page: 1 })}
          className="w-56"
        />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">CPF</label>
        <Input
          placeholder="CPF exato (11 dígitos)"
          value={value.documentEquals ?? ''}
          onChange={(e) => onChange({ ...value, documentEquals: e.target.value || undefined, page: 1 })}
          className="w-48"
        />
      </div>
      <Button variant="ghost" size="sm" onClick={() => onChange({ page: 1, pageSize: value.pageSize })}>
        Limpar
      </Button>
    </div>
  )
}
