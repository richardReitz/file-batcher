import { useState, useEffect, useRef } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { PartnerListParams } from '@/types/partner'

function toTitleCase(s: string) {
  return s.replace(/\b\w/g, (c) => c.toUpperCase())
}

interface PartnerFiltersProps {
  value: PartnerListParams
  onChange: (params: PartnerListParams) => void
}

export function PartnerFilters({ value, onChange }: PartnerFiltersProps) {
  const [nameInput, setNameInput] = useState(value.nameContains ?? '')
  const [cpfInput, setCpfInput] = useState(value.documentEquals ?? '')
  const valueRef = useRef(value)
  valueRef.current = value

  useEffect(() => { if (!value.nameContains) setNameInput('') }, [value.nameContains])
  useEffect(() => { if (!value.documentEquals) setCpfInput('') }, [value.documentEquals])

  const debouncedName = useDebouncedCallback((raw: string) => {
    const normalized = toTitleCase(raw.trim())
    onChange({ ...valueRef.current, nameContains: normalized || undefined, page: 1 })
  }, 400)

  const debouncedCpf = useDebouncedCallback((raw: string) => {
    const digits = raw.replace(/\D/g, '')
    onChange({ ...valueRef.current, documentEquals: digits || undefined, page: 1 })
  }, 400)

  return (
    <div className="grid grid-cols-2 gap-3 items-end lg:flex lg:flex-wrap">
      <div className="lg:w-56">
        <label className="block text-xs text-gray-500 mb-1">Nome</label>
        <Input
          placeholder="Buscar por nome..."
          value={nameInput}
          onChange={(e) => { setNameInput(e.target.value); debouncedName(e.target.value) }}
          className="w-full"
        />
      </div>
      <div className="lg:w-48">
        <label className="block text-xs text-gray-500 mb-1">CPF</label>
        <Input
          placeholder="Buscar por CPF..."
          value={cpfInput}
          onChange={(e) => { setCpfInput(e.target.value); debouncedCpf(e.target.value) }}
          className="w-full"
        />
      </div>
      <div className="col-span-2 lg:col-auto flex items-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setNameInput('')
            setCpfInput('')
            onChange({ page: 1, pageSize: value.pageSize })
          }}
        >
          Limpar
        </Button>
      </div>
    </div>
  )
}
