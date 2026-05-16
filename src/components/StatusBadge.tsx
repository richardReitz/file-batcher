import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: string
  label: string
}

const colorMap: Record<string, string> = {
  IMPORTED: 'bg-gray-100 text-gray-700 border-gray-300',
  PROCESSING: 'bg-blue-100 text-blue-700 border-blue-300 animate-pulse',
  PROCESSED: 'bg-green-100 text-green-700 border-green-300',
  SUCCESS: 'bg-green-100 text-green-700 border-green-300',
  CANCELLED: 'bg-orange-100 text-orange-700 border-orange-300',
  ERROR: 'bg-red-100 text-red-700 border-red-300',
  PENDING: 'bg-slate-100 text-slate-600 border-slate-300',
  IGNORED: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  ACTIVE: 'bg-green-100 text-green-700 border-green-300',
  INACTIVE: 'bg-red-100 text-red-700 border-red-300',
  TO_ACTIVE: 'bg-blue-100 text-blue-700 border-blue-300',
  TO_INACTIVE: 'bg-purple-100 text-purple-700 border-purple-300',
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      data-testid={`status-badge-${status}`}
      className={cn('font-medium', colorMap[status] ?? 'bg-gray-100 text-gray-700')}
    >
      {label}
    </Badge>
  )
}
