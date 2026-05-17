# Batch Item UX — Bug Fixes + Feedback de Status

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Corrigir dois bugs de invalidação de query e adicionar feedback visual claro após correção de itens e durante processamento de lote.

**Architecture:** Fixes cirúrgicos nos hooks existentes + novo componente `ItemSummaryBar` inline na `ItemList`. O `EditItemModal` passa a controlar seu próprio fechamento via `useEffect` em `mutation.isSuccess`, exibindo um estado de sucesso por 1.5s antes de fechar. Nenhuma mudança estrutural de rota ou layout.

**Tech Stack:** React 18, TypeScript, TanStack Query v5, Vitest + Testing Library, Tailwind CSS, lucide-react

---

## File Map

| Arquivo | Ação | O que muda |
|---|---|---|
| `src/hooks/useUpdateItem.ts` | Modify | Adiciona invalidação de `['batch']`; remove toast |
| `src/hooks/useIgnoreItem.ts` | Modify | Adiciona invalidação de `['batch']` |
| `src/hooks/useItems.ts` | Modify | Aceita `batchStatus?: BatchStatus`; expande `refetchInterval` |
| `src/pages/BatchDetail/EditItemModal.tsx` | Modify | Remove `onSuccess: onClose`; adiciona estado de sucesso + auto-close via `useEffect` |
| `src/pages/BatchDetail/ItemList.tsx` | Modify | Aceita `batchStatus?` prop; passa para `useItems`; renderiza `ItemSummaryBar` |
| `src/pages/BatchDetail/BatchDetailPage.tsx` | Modify | Passa `batch.status` para `ItemList` |
| `src/pages/BatchDetail/ItemSummaryBar.tsx` | **Create** | Novo componente de contadores por status |
| `src/tests/ItemSummaryBar.test.tsx` | **Create** | Testes unitários do componente |
| `src/tests/EditItemModal.test.tsx` | **Create** | Testes do estado de sucesso + auto-close |
| `src/tests/ItemList.test.tsx` | Modify | Atualiza para nova prop; adiciona teste do summary bar |

---

## Task 1: Fix useUpdateItem e useIgnoreItem

**Files:**
- Modify: `src/hooks/useUpdateItem.ts`
- Modify: `src/hooks/useIgnoreItem.ts`

- [ ] **Step 1: Atualizar useUpdateItem**

Substituir o conteúdo completo de `src/hooks/useUpdateItem.ts`:

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateItem } from '@/api/items'
import type { UpdateItemPayload } from '@/types/item'

export function useUpdateItem(fileBatchId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ itemId, payload }: { itemId: string; payload: UpdateItemPayload }) =>
      updateItem(fileBatchId, itemId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items', fileBatchId] })
      queryClient.invalidateQueries({ queryKey: ['batch', fileBatchId] })
    },
  })
}
```

> O toast foi removido — o `EditItemModal` passará a ter seu próprio feedback visual de sucesso (Task 4).

- [ ] **Step 2: Atualizar useIgnoreItem**

Substituir o conteúdo completo de `src/hooks/useIgnoreItem.ts`:

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ignoreItem } from '@/api/items'
import { useToast } from '@/hooks/use-toast'

export function useIgnoreItem(fileBatchId: string) {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: (itemId: string) => ignoreItem(fileBatchId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items', fileBatchId] })
      queryClient.invalidateQueries({ queryKey: ['batch', fileBatchId] })
      toast({ variant: 'success', title: 'Item ignorado', description: 'O item não será processado.' })
    },
  })
}
```

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useUpdateItem.ts src/hooks/useIgnoreItem.ts
git commit -m "fix: invalidate batch query after item update and ignore"
```

---

## Task 2: Fix useItems — aceitar batchStatus

**Files:**
- Modify: `src/hooks/useItems.ts`

- [ ] **Step 1: Atualizar useItems**

Substituir o conteúdo completo de `src/hooks/useItems.ts`:

```ts
import { useQuery } from '@tanstack/react-query'
import { listItems } from '@/api/items'
import type { BatchStatus } from '@/types/batch'

export function useItems(fileBatchId: string, batchStatus?: BatchStatus) {
  return useQuery({
    queryKey: ['items', fileBatchId],
    queryFn: () => listItems(fileBatchId),
    refetchInterval: (query) => {
      if (batchStatus === 'PROCESSING') return 3000
      if (query.state.data?.some((item) => item.status === 'PENDING')) return 3000
      return false
    },
  })
}
```

- [ ] **Step 2: Verificar que `BatchStatus` existe em `src/types/batch.ts`**

Abrir `src/types/batch.ts` e confirmar que `BatchStatus` inclui `'PROCESSING'`. Se o tipo não existir como export nomeado, basta que o union type contenha o valor — não é necessário alterar o arquivo.

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useItems.ts
git commit -m "fix: poll items when batch is PROCESSING regardless of item statuses"
```

---

## Task 3: Criar ItemSummaryBar

**Files:**
- Create: `src/pages/BatchDetail/ItemSummaryBar.tsx`
- Create: `src/tests/ItemSummaryBar.test.tsx`

- [ ] **Step 1: Escrever o teste (failing)**

Criar `src/tests/ItemSummaryBar.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ItemSummaryBar } from '@/pages/BatchDetail/ItemSummaryBar'
import type { Item } from '@/types/item'

function item(status: Item['status'], id = '1'): Item {
  return { id, fileBatchId: 'b1', data: null, status, createdAt: '', updatedAt: '' }
}

describe('ItemSummaryBar', () => {
  it('mostra contagem de processados', () => {
    render(<ItemSummaryBar items={[item('PROCESSED', '1'), item('PROCESSED', '2')]} isFetching={false} />)
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('processados')).toBeInTheDocument()
  })

  it('mostra contagem de erros em vermelho', () => {
    render(<ItemSummaryBar items={[item('ERROR')]} isFetching={false} />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('com erro')).toBeInTheDocument()
  })

  it('oculta pendentes quando count é 0', () => {
    render(<ItemSummaryBar items={[item('PROCESSED')]} isFetching={false} />)
    expect(screen.queryByText('pendentes')).not.toBeInTheDocument()
  })

  it('oculta erros quando count é 0', () => {
    render(<ItemSummaryBar items={[item('PROCESSED')]} isFetching={false} />)
    expect(screen.queryByText('com erro')).not.toBeInTheDocument()
  })

  it('mostra atualizando quando isFetching=true', () => {
    render(<ItemSummaryBar items={[]} isFetching={true} />)
    expect(screen.getByText('atualizando...')).toBeInTheDocument()
  })

  it('oculta atualizando quando isFetching=false', () => {
    render(<ItemSummaryBar items={[]} isFetching={false} />)
    expect(screen.queryByText('atualizando...')).not.toBeInTheDocument()
  })

  it('mostra todos os status juntos', () => {
    const items = [
      item('PROCESSED', '1'),
      item('ERROR', '2'),
      item('PENDING', '3'),
      item('IGNORED', '4'),
    ]
    render(<ItemSummaryBar items={items} isFetching={false} />)
    expect(screen.getByText('processados')).toBeInTheDocument()
    expect(screen.getByText('com erro')).toBeInTheDocument()
    expect(screen.getByText('pendentes')).toBeInTheDocument()
    expect(screen.getByText('ignorados')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Rodar o teste para confirmar que falha**

```bash
npx vitest run src/tests/ItemSummaryBar.test.tsx
```

Esperado: FAIL com `Cannot find module '@/pages/BatchDetail/ItemSummaryBar'`

- [ ] **Step 3: Criar o componente**

Criar `src/pages/BatchDetail/ItemSummaryBar.tsx`:

```tsx
import { Loader2 } from 'lucide-react'
import type { Item } from '@/types/item'

interface ItemSummaryBarProps {
  items: Item[]
  isFetching: boolean
}

export function ItemSummaryBar({ items, isFetching }: ItemSummaryBarProps) {
  const processed = items.filter((i) => i.status === 'PROCESSED').length
  const errors = items.filter((i) => i.status === 'ERROR').length
  const pending = items.filter((i) => i.status === 'PENDING').length
  const ignored = items.filter((i) => i.status === 'IGNORED').length

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-1 px-1 py-2 text-sm">
      {processed > 0 && (
        <span className="flex items-center gap-1.5 text-gray-600">
          <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
          <strong>{processed}</strong>&nbsp;processados
        </span>
      )}
      {errors > 0 && (
        <span className="flex items-center gap-1.5 text-red-600">
          <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
          <strong>{errors}</strong>&nbsp;com erro
        </span>
      )}
      {pending > 0 && (
        <span className="flex items-center gap-1.5 text-amber-600">
          <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
          <strong>{pending}</strong>&nbsp;pendentes
        </span>
      )}
      {ignored > 0 && (
        <span className="flex items-center gap-1.5 text-gray-400">
          <span className="w-2 h-2 rounded-full bg-gray-300 shrink-0" />
          <strong>{ignored}</strong>&nbsp;ignorados
        </span>
      )}
      {isFetching && (
        <span className="ml-auto flex items-center gap-1.5 text-gray-400 text-xs">
          <Loader2 className="w-3 h-3 animate-spin" />
          atualizando...
        </span>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Rodar os testes para confirmar que passam**

```bash
npx vitest run src/tests/ItemSummaryBar.test.tsx
```

Esperado: 7 testes passando

- [ ] **Step 5: Commit**

```bash
git add src/pages/BatchDetail/ItemSummaryBar.tsx src/tests/ItemSummaryBar.test.tsx
git commit -m "feat: add ItemSummaryBar component with status counts"
```

---

## Task 4: Atualizar EditItemModal — estado de sucesso + auto-close

**Files:**
- Modify: `src/pages/BatchDetail/EditItemModal.tsx`
- Create: `src/tests/EditItemModal.test.tsx`

- [ ] **Step 1: Escrever o teste (failing)**

Criar `src/tests/EditItemModal.test.tsx`:

```tsx
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { EditItemModal } from '@/pages/BatchDetail/EditItemModal'
import { renderWithProviders } from './utils'
import * as itemsApi from '@/api/items'
import type { Item } from '@/types/item'

vi.mock('@/api/items')

const mockItem: Item = {
  id: 'item-1',
  fileBatchId: 'batch-1',
  data: JSON.stringify({ NOME: 'João Silva', EMAIL: 'joao@test.com', CPF: '12345678901', TELEFONE: '11999999999' }),
  status: 'ERROR',
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-15T10:00:00Z',
}

describe('EditItemModal', () => {
  beforeEach(() => {
    vi.mocked(itemsApi.updateItem).mockResolvedValue({ ...mockItem, status: 'PENDING' })
    vi.mocked(itemsApi.listItems).mockResolvedValue([])
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('exibe estado de sucesso após salvar', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    const onClose = vi.fn()
    renderWithProviders(<EditItemModal item={mockItem} fileBatchId="batch-1" onClose={onClose} />)

    await user.click(screen.getByRole('button', { name: /salvar/i }))

    expect(await screen.findByText('Item corrigido!')).toBeInTheDocument()
    expect(screen.getByText(/será reprocessado/i)).toBeInTheDocument()
    expect(screen.getByText(/fechando automaticamente/i)).toBeInTheDocument()
  })

  it('chama onClose após 1.5s no estado de sucesso', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    const onClose = vi.fn()
    renderWithProviders(<EditItemModal item={mockItem} fileBatchId="batch-1" onClose={onClose} />)

    await user.click(screen.getByRole('button', { name: /salvar/i }))
    await screen.findByText('Item corrigido!')

    expect(onClose).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1500)
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1))
  })
})
```

- [ ] **Step 2: Rodar o teste para confirmar que falha**

```bash
npx vitest run src/tests/EditItemModal.test.tsx
```

Esperado: FAIL — modal fecha imediatamente sem mostrar estado de sucesso

- [ ] **Step 3: Atualizar EditItemModal**

Substituir o conteúdo completo de `src/pages/BatchDetail/EditItemModal.tsx`:

```tsx
import { useState, useEffect } from 'react'
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

  useEffect(() => {
    if (!mutation.isSuccess) return
    setShowSuccess(true)
    const timer = setTimeout(onClose, 1500)
    return () => clearTimeout(timer)
  }, [mutation.isSuccess, onClose])

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
            <p className="font-semibold text-gray-900 text-base">Item corrigido!</p>
            <p className="text-sm text-gray-500">
              Os dados foram salvos.<br />O item será reprocessado em breve.
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
```

- [ ] **Step 4: Rodar os testes**

```bash
npx vitest run src/tests/EditItemModal.test.tsx
```

Esperado: 2 testes passando

- [ ] **Step 5: Commit**

```bash
git add src/pages/BatchDetail/EditItemModal.tsx src/tests/EditItemModal.test.tsx
git commit -m "feat: show success state in EditItemModal before auto-close"
```

---

## Task 5: Atualizar ItemList — batchStatus + ItemSummaryBar

**Files:**
- Modify: `src/pages/BatchDetail/ItemList.tsx`
- Modify: `src/tests/ItemList.test.tsx`

- [ ] **Step 1: Adicionar teste para o ItemSummaryBar em ItemList**

Adicionar no final do `describe` em `src/tests/ItemList.test.tsx`:

```tsx
  it('renderiza ItemSummaryBar com contagem de status', async () => {
    renderWithProviders(<ItemList fileBatchId="batch-1" batchStatus="PROCESSED" />)
    expect(await screen.findByText('processados')).toBeInTheDocument()
    expect(await screen.findByText('com erro')).toBeInTheDocument()
  })
```

> `mockItems` já tem 1 PENDING (mapeado como "processados" não — PENDING não é "processados"). Ajuste: o mock tem 1 PENDING e 1 ERROR, então o summary vai mostrar "1 pendentes" e "1 com erro".

Substituir a asserção:
```tsx
  it('renderiza ItemSummaryBar com contagem de status', async () => {
    renderWithProviders(<ItemList fileBatchId="batch-1" batchStatus="PROCESSED" />)
    expect(await screen.findByText('pendentes')).toBeInTheDocument()
    expect(await screen.findByText('com erro')).toBeInTheDocument()
  })
```

- [ ] **Step 2: Rodar o teste para confirmar que falha**

```bash
npx vitest run src/tests/ItemList.test.tsx
```

Esperado: 3 testes passando, 1 falhando (`batchStatus` prop não existe ainda)

- [ ] **Step 3: Atualizar ItemList**

Substituir o conteúdo completo de `src/pages/BatchDetail/ItemList.tsx`:

```tsx
import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { StatusBadge } from '@/components/StatusBadge'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { EditItemModal } from './EditItemModal'
import { ItemSummaryBar } from './ItemSummaryBar'
import { useItems } from '@/hooks/useItems'
import { useIgnoreItem } from '@/hooks/useIgnoreItem'
import { ITEM_STATUS_LABEL } from '@/lib/enums'
import { formatCpf } from '@/lib/format'
import type { Item } from '@/types/item'
import type { BatchStatus } from '@/types/batch'

function parseItemData(data: string | null): { nome: string; email: string; cpf: string } {
  if (!data) return { nome: '—', email: '—', cpf: '—' }
  try {
    const parsed: Record<string, string> = JSON.parse(data)
    return {
      nome: parsed['NOME'] ?? '—',
      email: parsed['EMAIL'] ?? '—',
      cpf: parsed['CPF'] ?? '—',
    }
  } catch {
    return { nome: '—', email: '—', cpf: '—' }
  }
}

interface ItemListProps {
  fileBatchId: string
  batchStatus?: BatchStatus
}

export function ItemList({ fileBatchId, batchStatus }: ItemListProps) {
  const { data: items, isLoading, isFetching } = useItems(fileBatchId, batchStatus)
  const ignoreItem = useIgnoreItem(fileBatchId)
  const [confirmIgnore, setConfirmIgnore] = useState<Item | null>(null)
  const [editItem, setEditItem] = useState<Item | null>(null)

  return (
    <>
      {!isLoading && items && (
        <ItemSummaryBar items={items} isFetching={isFetching} />
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead className="hidden sm:table-cell">CPF</TableHead>
            <TableHead className="hidden lg:table-cell">Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className={`h-4 rounded ${i % 3 === 0 ? 'w-32' : i % 3 === 1 ? 'w-40' : 'w-28'}`} /></TableCell>
              <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-28 rounded" /></TableCell>
              <TableCell className="hidden lg:table-cell"><Skeleton className={`h-4 rounded ${i % 2 === 0 ? 'w-48' : 'w-40'}`} /></TableCell>
              <TableCell><Skeleton className="h-6 w-20 rounded-md" /></TableCell>
              <TableCell>
                <div className="flex gap-1 whitespace-nowrap">
                  <Skeleton className="h-8 w-14 rounded-md" />
                </div>
              </TableCell>
            </TableRow>
          ))}

          {!isLoading && items?.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-gray-400 py-8">
                Nenhum item encontrado.
              </TableCell>
            </TableRow>
          )}

          {items?.map((item) => {
            const { nome, email, cpf } = parseItemData(item.data)
            return (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{nome}</TableCell>
                <TableCell className="hidden sm:table-cell font-mono text-sm whitespace-nowrap">{formatCpf(cpf)}</TableCell>
                <TableCell className="hidden lg:table-cell text-sm text-gray-600">{email}</TableCell>
                <TableCell>
                  <StatusBadge status={item.status} label={ITEM_STATUS_LABEL[item.status]} />
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 whitespace-nowrap">
                    {(item.status === 'PENDING' || item.status === 'ERROR') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setConfirmIgnore(item)}
                      >
                        Ignorar
                      </Button>
                    )}
                    {item.status === 'ERROR' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditItem(item)}
                      >
                        Corrigir
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      {confirmIgnore && (
        <ConfirmDialog
          open
          title="Ignorar item"
          description={`Tem certeza que deseja ignorar o item de ${parseItemData(confirmIgnore.data).nome}?`}
          confirmLabel="Ignorar"
          loading={ignoreItem.isPending}
          onConfirm={() =>
            ignoreItem.mutate(confirmIgnore.id, { onSuccess: () => setConfirmIgnore(null) })
          }
          onCancel={() => setConfirmIgnore(null)}
        />
      )}

      {editItem && (
        <EditItemModal
          item={editItem}
          fileBatchId={fileBatchId}
          onClose={() => setEditItem(null)}
        />
      )}
    </>
  )
}
```

- [ ] **Step 4: Rodar todos os testes de ItemList**

```bash
npx vitest run src/tests/ItemList.test.tsx
```

Esperado: 4 testes passando

- [ ] **Step 5: Commit**

```bash
git add src/pages/BatchDetail/ItemList.tsx src/tests/ItemList.test.tsx
git commit -m "feat: render ItemSummaryBar in ItemList and pass batchStatus to useItems"
```

---

## Task 6: Atualizar BatchDetailPage — passar batch.status

**Files:**
- Modify: `src/pages/BatchDetail/BatchDetailPage.tsx`

- [ ] **Step 1: Atualizar a chamada de ItemList**

Em `src/pages/BatchDetail/BatchDetailPage.tsx`, linha 86, substituir:

```tsx
<ItemList fileBatchId={batch!.id} />
```

por:

```tsx
<ItemList fileBatchId={batch!.id} batchStatus={batch!.status} />
```

- [ ] **Step 2: Rodar a suite completa**

```bash
npx vitest run
```

Esperado: todos os testes passando sem erros de TypeScript

- [ ] **Step 3: Commit final**

```bash
git add src/pages/BatchDetail/BatchDetailPage.tsx
git commit -m "feat: pass batchStatus to ItemList for smarter polling"
```

---

## Checklist de verificação manual (após implementação)

- [ ] Corrigir um item com erro → modal fecha após ~1.5s mostrando "Item corrigido!"
- [ ] Após fechar o modal → status do item na tabela atualizado (PENDING ou PROCESSED)
- [ ] Após fechar o modal → status do lote no cabeçalho atualizado
- [ ] Barra de resumo mostra contadores corretos logo acima da tabela
- [ ] "atualizando..." aparece brevemente quando há refetch em background
- [ ] Ignorar um item → contadores na barra atualizam; status do lote atualiza
- [ ] Durante processamento (batch PROCESSING) → tabela faz polling a cada 3s
