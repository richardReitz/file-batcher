import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUpdateItem } from '@/hooks/useUpdateItem'
import type { Item, UpdateItemPayload } from '@/types/item'

interface EditItemModalProps {
  item: Item
  fileBatchId: string
  onClose: () => void
}

function parseData(data: string | null): UpdateItemPayload {
  if (!data) return { nome: '', email: '', cpf: '', telefone: '' }
  try {
    const p: Record<string, string> = JSON.parse(data)
    return {
      nome: p['NOME'] ?? '',
      email: p['EMAIL'] ?? '',
      cpf: (p['CPF'] ?? '').replace(/\D/g, '').slice(0, 11),
      telefone: (p['TELEFONE'] ?? '').replace(/\D/g, '').slice(0, 11),
    }
  } catch {
    return { nome: '', email: '', cpf: '', telefone: '' }
  }
}

function getErrors(form: UpdateItemPayload): Partial<Record<keyof UpdateItemPayload, string>> {
  const errors: Partial<Record<keyof UpdateItemPayload, string>> = {}
  if (form.cpf && form.cpf.length !== 11) errors.cpf = 'CPF deve ter 11 dígitos'
  if (form.telefone && (form.telefone.length < 10 || form.telefone.length > 11)) errors.telefone = 'Telefone deve ter 10 ou 11 dígitos'
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Email inválido'
  return errors
}

const fields: { key: keyof UpdateItemPayload; label: string; numeric?: boolean }[] = [
  { key: 'nome', label: 'Nome' },
  { key: 'email', label: 'Email' },
  { key: 'cpf', label: 'CPF', numeric: true },
  { key: 'telefone', label: 'Telefone', numeric: true },
]

export function EditItemModal({ item, fileBatchId, onClose }: EditItemModalProps) {
  const [form, setForm] = useState<UpdateItemPayload>(() => parseData(item.data))
  const mutation = useUpdateItem(fileBatchId)
  const errors = getErrors(form)
  const hasErrors = Object.keys(errors).length > 0

  function handleChange(key: keyof UpdateItemPayload, value: string, numeric?: boolean) {
    const normalized = numeric ? value.replace(/\D/g, '').slice(0, 11) : value
    setForm((f) => ({ ...f, [key]: normalized }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (hasErrors) return
    mutation.mutate({ itemId: item.id, payload: form }, { onSuccess: onClose })
  }

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Corrigir item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(({ key, label, numeric }) => (
            <div key={key} className="flex flex-col gap-1.5">
              <Label htmlFor={key}>{label}</Label>
              <Input
                id={key}
                value={form[key]}
                inputMode={numeric ? 'numeric' : undefined}
                onChange={(e) => handleChange(key, e.target.value, numeric)}
                className={errors[key] ? 'border-red-400 focus-visible:ring-red-400' : ''}
              />
              {errors[key] && (
                <p className="text-xs text-red-500">{errors[key]}</p>
              )}
            </div>
          ))}
          {mutation.isError && (
            <p className="text-sm text-red-600">{mutation.error?.message}</p>
          )}
          <DialogFooter className="flex-row gap-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancelar</Button>
            <Button type="submit" className="flex-1" disabled={mutation.isPending || hasErrors}>
              {mutation.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
