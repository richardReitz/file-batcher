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
