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
    return { nome: p['NOME'] ?? '', email: p['EMAIL'] ?? '', cpf: p['CPF'] ?? '', telefone: p['TELEFONE'] ?? '' }
  } catch {
    return { nome: '', email: '', cpf: '', telefone: '' }
  }
}

export function EditItemModal({ item, fileBatchId, onClose }: EditItemModalProps) {
  const [form, setForm] = useState<UpdateItemPayload>(() => parseData(item.data))
  const mutation = useUpdateItem(fileBatchId)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    mutation.mutate(
      { itemId: item.id, payload: form },
      { onSuccess: onClose }
    )
  }

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Corrigir item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {(['nome', 'email', 'cpf', 'telefone'] as const).map((field) => (
            <div key={field}>
              <Label htmlFor={field} className="capitalize">{field}</Label>
              <Input
                id={field}
                value={form[field]}
                onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
              />
            </div>
          ))}
          {mutation.isError && (
            <p className="text-sm text-red-600">{mutation.error?.message}</p>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
