import { useDebouncedCallback } from 'use-debounce'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { PartnerListParams } from '@/types/partner'

interface PartnerFiltersProps {
  value: PartnerListParams
  onChange: (params: PartnerListParams) => void
}

export function PartnerFilters({ value, onChange }: PartnerFiltersProps) {
  const debouncedNameChange = useDebouncedCallback(
    (inputValue: string) => onChange({ ...value, nameContains: inputValue || undefined, page: 1 }),
    300
  )

  return (
    <div className="flex flex-wrap gap-3 items-end">
      <div>
        <label className="block text-xs text-gray-500 mb-1">Nome</label>
        <Input
          key={value.nameContains ?? 'empty'}
          placeholder="Buscar por nome..."
          defaultValue={value.nameContains ?? ''}
          onChange={(e) => debouncedNameChange(e.target.value)}
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
