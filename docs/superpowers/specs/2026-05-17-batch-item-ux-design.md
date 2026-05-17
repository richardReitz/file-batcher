# Batch Item UX — Bug Fixes + Feedback de Status

## Problema

O fluxo de correção de itens com erro tem dois bugs e um gap de UX:

1. **Bug — invalidação incompleta:** `useUpdateItem` e `useIgnoreItem` só invalidam `['items', fileBatchId]`. A query `['batch', id]` nunca é invalidada, então o cabeçalho do lote (status badge, data de atualização) não reflete o estado real após uma correção ou ignorar.

2. **Bug — polling para cedo:** `useItems` só faz polling quando há itens `PENDING`. Quando todos os itens são `PROCESSED` ou `ERROR` (processamento concluído), o polling para. Se o usuário corrige um item, `invalidateQueries` dispara um único refetch, mas se o backend for assíncrono o item volta a `PENDING` brevemente — e o polling precisa reiniciar. O `refetchInterval` baseado em dados retornados deveria cobrir isso, mas não é explícito para o estado de batch `PROCESSING`.

3. **Gap de UX — feedback após correção:** O modal fecha imediatamente ao salvar. O toast existe mas pode passar despercebido. O usuário não tem confirmação visual clara de que a correção funcionou, e a tabela pode demorar a refletir o novo status do item.

4. **Gap de UX — progresso invisível:** Durante o processamento do lote (status `PROCESSING`, ~200ms por item), não há visibilidade do avanço. Não há como saber quantos itens já foram processados ou quantos tiveram erro.

## Solução

### 1. Bug fix — invalidação de batch em mutações de item

Em `useUpdateItem` e `useIgnoreItem`, adicionar:

```ts
queryClient.invalidateQueries({ queryKey: ['batch', fileBatchId] })
```

Isso garante que o cabeçalho do lote atualize imediatamente após qualquer ação sobre um item.

### 2. Bug fix — polling de items mais robusto

Em `useItems`, o `refetchInterval` passa a receber o `batchStatus` como parâmetro e faz polling quando `batchStatus === 'PROCESSING'`, além da condição atual de itens `PENDING`:

```ts
// useItems agora aceita batchStatus opcional
refetchInterval: (query) => {
  if (batchStatus === 'PROCESSING') return 3000
  if (query.state.data?.some((i) => i.status === 'PENDING')) return 3000
  return false
}
```

O `batchStatus` é passado pela `BatchDetailPage` via prop para `ItemList`, que repassa para `useItems`.

### 3. UX — estado de sucesso no modal de correção

Ao invés de fechar o modal imediatamente em `onSuccess`, o `EditItemModal` exibe um estado de confirmação por 1.5s antes de fechar automaticamente:

- Ícone de check verde
- Texto: "Item corrigido! Os dados foram salvos. O item será reprocessado em breve."
- Footer: "Fechando automaticamente..."

**Implementação:** remover o `onSuccess: onClose` do `mutation.mutate()`. O hook `useUpdateItem` continua disparando `invalidateQueries` e toast. O `EditItemModal` usa `useEffect` observando `mutation.isSuccess` para iniciar um timeout de 1.5s que chama `onClose`.

O toast em `useUpdateItem` pode ser removido já que o modal agora tem feedback próprio — evita duplicação.

### 4. UX — barra de resumo de status (novo componente)

Um novo componente `ItemSummaryBar` é adicionado entre o card de metadados e a tabela de itens em `BatchDetailPage`.

**Dados:** calculados localmente a partir do array de `items` retornado por `useItems` — sem chamada extra à API.

**Layout:** linha horizontal com contadores por status:

```
● 12 processados  ● 2 com erro  ● 1 ignorado       atualizando... ●
```

**Regras de exibição:**
- "Processados" sempre visível quando > 0
- "Com erro" visível somente quando > 0, em vermelho
- "Pendentes" visível somente quando > 0, em âmbar
- "Ignorados" visível somente quando > 0, em cinza
- "atualizando..." com ponto pulsante aparece quando `isFetching && !isLoading` (background refetch)

**Localização:** `src/pages/BatchDetail/ItemSummaryBar.tsx` — consumido no topo de `ItemList`, que já tem acesso direto a `items` e `isFetching` via `useItems`.

## Arquivos afetados

| Arquivo | Mudança |
|---|---|
| `src/hooks/useUpdateItem.ts` | Adicionar invalidação de `['batch', fileBatchId]`; remover toast |
| `src/hooks/useIgnoreItem.ts` | Adicionar invalidação de `['batch', fileBatchId]` |
| `src/hooks/useItems.ts` | Aceitar `batchStatus?: BatchStatus`; expandir `refetchInterval` |
| `src/pages/BatchDetail/EditItemModal.tsx` | Remover `onSuccess: onClose` do mutate; adicionar estado de sucesso com auto-close via `useEffect` |
| `src/pages/BatchDetail/ItemList.tsx` | Aceitar e repassar `batchStatus` para `useItems`; renderizar `ItemSummaryBar` |
| `src/pages/BatchDetail/BatchDetailPage.tsx` | Passar `batch.status` para `ItemList` |
| `src/pages/BatchDetail/ItemSummaryBar.tsx` | **Novo** — componente de contadores por status |

## Fora de escopo

- Mostrar a mensagem de erro específica de cada item (a API não retorna esse campo no tipo `Item`)
- Mover o botão "Iniciar Processamento" para a tela de detalhe (o usuário não relatou isso como dor)
- Qualquer mudança na lógica de processamento em lote
