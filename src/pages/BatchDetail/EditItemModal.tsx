import { useState, useEffect, useRef } from 'react'
import { CheckCircle2 } from 'lucide-react'
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
  const [showSuccess, setShowSuccess] = useState(false)
  const mutation = useUpdateItem(fileBatchId)
  const errors = getErrors(form)
  const hasErrors = Object.keys(errors).length > 0
  const onCloseRef = useRef(onClose)
  useEffect(() => { onCloseRef.current = onClose }, [onClose])

  const processedOk = mutation.isSuccess && mutation.data?.status === 'PROCESSED'
  const savedAsError = mutation.isSuccess && mutation.data?.status !== 'PROCESSED'

  useEffect(() => {
    if (!processedOk) return
    setShowSuccess(true)
    const timer = setTimeout(() => onCloseRef.current(), 1500)
    return () => clearTimeout(timer)
  }, [processedOk])

  function handleChange(key: keyof UpdateItemPayload, value: string, numeric?: boolean) {
    const normalized = numeric ? value.replace(/\D/g, '').slice(0, 11) : value
    setForm((f) => ({ ...f, [key]: normalized }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (hasErrors) return
    mutation.mutate({ itemId: item.id, payload: form })
  }

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Corrigir item</DialogTitle>
        </DialogHeader>

        {showSuccess ? (
          <div className="flex flex-col items-center gap-3 py-8 px-4 text-center">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <p className="font-semibold text-gray-900 text-base">Item processado!</p>
            <p className="text-sm text-gray-500">
              Os dados foram corrigidos e o item foi processado com sucesso.
            </p>
            <p className="text-xs text-gray-400 mt-1">Fechando automaticamente...</p>
          </div>
        ) : (
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
            {savedAsError && (
              <p className="text-sm text-red-600">
                Os dados foram salvos, mas o item não pôde ser processado. Verifique os campos e tente novamente.
              </p>
            )}
            <DialogFooter className="flex-row gap-2">
              <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancelar</Button>
              <Button type="submit" className="flex-1" disabled={mutation.isPending || hasErrors}>
                {mutation.isPending ? 'Salvando...' : 'Salvar'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
