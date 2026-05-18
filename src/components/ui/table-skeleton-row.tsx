import { TableCell, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

type SkeletonCell = {
  width: string | string[]
  shape?: 'text' | 'badge' | 'button' | 'mono'
  hidden?: string
}

type TableSkeletonRowProps = {
  columns: SkeletonCell[]
  rows?: number
}

const shapeClass: Record<NonNullable<SkeletonCell['shape']>, string> = {
  text: 'h-4 rounded',
  mono: 'h-4 rounded',
  badge: 'h-6 rounded-full',
  button: 'h-8 rounded-md',
}

export function TableSkeletonRow({ columns, rows = 5 }: TableSkeletonRowProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {columns.map((col, colIndex) => {
            const widths = Array.isArray(col.width) ? col.width : [col.width]
            const width = widths[rowIndex % widths.length]
            const shape = shapeClass[col.shape ?? 'text']
            return (
              <TableCell key={colIndex} className={col.hidden}>
                <Skeleton variant="shimmer" className={`${shape} ${width}`} />
              </TableCell>
            )
          })}
        </TableRow>
      ))}
    </>
  )
}
