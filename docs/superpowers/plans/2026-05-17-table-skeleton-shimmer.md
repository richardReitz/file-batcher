# Table Skeleton Shimmer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace flat `animate-pulse` skeleton rows in all three tables with a shimmer animation and a shared `TableSkeletonRow` component whose columns have shapes that accurately reflect real content.

**Architecture:** Add a `shimmer` keyframe to Tailwind, extend the existing `Skeleton` component with an optional `variant` prop, then create a single shared `TableSkeletonRow` component. Each page replaces its inline skeleton rows with `<TableSkeletonRow>` calls.

**Tech Stack:** React, TypeScript, Tailwind CSS v3, Vitest + @testing-library/react

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `tailwind.config.js` | Modify | Add `shimmer` keyframe + animation |
| `src/components/ui/skeleton.tsx` | Modify | Add `variant?: 'pulse' \| 'shimmer'` prop |
| `src/components/ui/table-skeleton-row.tsx` | Create | Shared skeleton row component |
| `src/tests/TableSkeletonRow.test.tsx` | Create | Tests for the new component |
| `src/pages/BatchList/BatchListPage.tsx` | Modify | Use `<TableSkeletonRow>` |
| `src/pages/BatchDetail/ItemList.tsx` | Modify | Use `<TableSkeletonRow>` |
| `src/pages/Partners/PartnersPage.tsx` | Modify | Use `<TableSkeletonRow>` |

---

## Task 1: Add shimmer keyframe to Tailwind

**Files:**
- Modify: `tailwind.config.js`

- [ ] **Step 1: Add keyframe and animation**

In `tailwind.config.js`, inside `theme.extend`, add:

```js
theme: {
  extend: {
    // ...existing keys (borderRadius, colors)...
    keyframes: {
      shimmer: {
        '0%': { backgroundPosition: '200% 0' },
        '100%': { backgroundPosition: '-200% 0' },
      },
    },
    animation: {
      shimmer: 'shimmer 1.5s infinite linear',
    },
  },
},
```

- [ ] **Step 2: Verify Tailwind compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.js
git commit -m "feat: add shimmer keyframe animation to tailwind"
```

---

## Task 2: Extend Skeleton component with shimmer variant

**Files:**
- Modify: `src/components/ui/skeleton.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/tests/Skeleton.test.tsx`:

```tsx
import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Skeleton } from '@/components/ui/skeleton'

describe('Skeleton', () => {
  it('uses animate-pulse by default', () => {
    const { container } = render(<Skeleton />)
    expect(container.firstChild).toHaveClass('animate-pulse')
  })

  it('uses animate-shimmer when variant is shimmer', () => {
    const { container } = render(<Skeleton variant="shimmer" />)
    expect(container.firstChild).toHaveClass('animate-shimmer')
    expect(container.firstChild).not.toHaveClass('animate-pulse')
  })

  it('forwards className correctly', () => {
    const { container } = render(<Skeleton variant="shimmer" className="w-32 h-4" />)
    expect(container.firstChild).toHaveClass('w-32', 'h-4')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/tests/Skeleton.test.tsx
```

Expected: FAIL — `variant` prop does not exist yet.

- [ ] **Step 3: Update Skeleton component**

Replace the full contents of `src/components/ui/skeleton.tsx` with:

```tsx
import { cn } from "@/lib/utils"

type SkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: 'pulse' | 'shimmer'
}

function Skeleton({ className, variant = 'pulse', ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-md",
        variant === 'shimmer'
          ? "animate-shimmer bg-gradient-to-r from-muted via-muted-foreground/10 to-muted bg-[length:200%_100%]"
          : "animate-pulse bg-primary/10",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/tests/Skeleton.test.tsx
```

Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/skeleton.tsx src/tests/Skeleton.test.tsx
git commit -m "feat: add shimmer variant to Skeleton component"
```

---

## Task 3: Create TableSkeletonRow component

**Files:**
- Create: `src/components/ui/table-skeleton-row.tsx`
- Create: `src/tests/TableSkeletonRow.test.tsx`

- [ ] **Step 1: Write the failing tests**

Create `src/tests/TableSkeletonRow.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Table, TableBody } from '@/components/ui/table'
import { TableSkeletonRow } from '@/components/ui/table-skeleton-row'

function wrap(ui: React.ReactElement) {
  return render(<Table><TableBody>{ui}</TableBody></Table>)
}

const columns = [
  { width: 'w-32', shape: 'text' as const },
  { width: 'w-28', shape: 'mono' as const },
  { width: 'w-20', shape: 'badge' as const },
  { width: 'w-16', shape: 'button' as const },
]

describe('TableSkeletonRow', () => {
  it('renders correct number of rows', () => {
    wrap(<TableSkeletonRow columns={columns} rows={3} />)
    // Each row has one cell per column; badge shape has h-6
    const badges = document.querySelectorAll('.h-6')
    expect(badges).toHaveLength(3)
  })

  it('renders 5 rows by default', () => {
    wrap(<TableSkeletonRow columns={columns} />)
    const badges = document.querySelectorAll('.h-6')
    expect(badges).toHaveLength(5)
  })

  it('applies badge shape class h-6 and rounded-full', () => {
    wrap(<TableSkeletonRow columns={[{ width: 'w-20', shape: 'badge' }]} rows={1} />)
    const el = document.querySelector('.h-6')
    expect(el).toHaveClass('rounded-full')
  })

  it('applies button shape class h-8', () => {
    wrap(<TableSkeletonRow columns={[{ width: 'w-16', shape: 'button' }]} rows={1} />)
    expect(document.querySelector('.h-8')).toBeInTheDocument()
  })

  it('rotates width array by row index', () => {
    wrap(<TableSkeletonRow columns={[{ width: ['w-32', 'w-40'], shape: 'text' }]} rows={2} />)
    expect(document.querySelector('.w-32')).toBeInTheDocument()
    expect(document.querySelector('.w-40')).toBeInTheDocument()
  })

  it('applies hidden class to cell when specified', () => {
    wrap(
      <TableSkeletonRow
        columns={[{ width: 'w-24', shape: 'text', hidden: 'hidden sm:table-cell' }]}
        rows={1}
      />
    )
    const cell = document.querySelector('td')
    expect(cell).toHaveClass('hidden')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/tests/TableSkeletonRow.test.tsx
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create the component**

Create `src/components/ui/table-skeleton-row.tsx`:

```tsx
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
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run src/tests/TableSkeletonRow.test.tsx
```

Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/table-skeleton-row.tsx src/tests/TableSkeletonRow.test.tsx
git commit -m "feat: add TableSkeletonRow shared component"
```

---

## Task 4: Update BatchListPage

**Files:**
- Modify: `src/pages/BatchList/BatchListPage.tsx`

- [ ] **Step 1: Replace the inline skeleton block**

In `src/pages/BatchList/BatchListPage.tsx`:

1. Add the import at the top:
```tsx
import { TableSkeletonRow } from '@/components/ui/table-skeleton-row'
```

2. Remove the `Skeleton` import (it's no longer used directly in this file):
```tsx
// Remove this line:
import { Skeleton } from '@/components/ui/skeleton'
```

3. Replace the `{isLoading && Array.from(...).map(...)}` block (lines 83–92) with:
```tsx
{isLoading && (
  <TableSkeletonRow
    rows={5}
    columns={[
      { width: 'w-20', shape: 'mono', hidden: 'hidden sm:table-cell' },
      { width: 'w-16', shape: 'badge' },
      { width: 'w-20', shape: 'badge' },
      { width: ['w-36', 'w-28'], shape: 'text' },
      { width: 'w-32', shape: 'text', hidden: 'hidden lg:table-cell' },
      { width: 'w-20', shape: 'button' },
    ]}
  />
)}
```

- [ ] **Step 2: Run existing tests to verify no regressions**

```bash
npx vitest run src/tests/BatchList.test.tsx
```

Expected: PASS (all existing tests).

- [ ] **Step 3: Commit**

```bash
git add src/pages/BatchList/BatchListPage.tsx
git commit -m "feat: use TableSkeletonRow in BatchListPage"
```

---

## Task 5: Update ItemList

**Files:**
- Modify: `src/pages/BatchDetail/ItemList.tsx`

- [ ] **Step 1: Replace the inline skeleton block**

In `src/pages/BatchDetail/ItemList.tsx`:

1. Add the import:
```tsx
import { TableSkeletonRow } from '@/components/ui/table-skeleton-row'
```

2. Remove the `Skeleton` import (no longer used directly).

3. Replace the `{isLoading && Array.from(...).map(...)}` block (lines 58–70) with:
```tsx
{isLoading && (
  <TableSkeletonRow
    rows={5}
    columns={[
      { width: ['w-32', 'w-40', 'w-28'], shape: 'text' },
      { width: 'w-28', shape: 'mono', hidden: 'hidden sm:table-cell' },
      { width: ['w-48', 'w-40'], shape: 'text', hidden: 'hidden lg:table-cell' },
      { width: 'w-20', shape: 'badge' },
      { width: 'w-14', shape: 'button' },
    ]}
  />
)}
```

- [ ] **Step 2: Run existing tests**

```bash
npx vitest run src/tests/ItemList.test.tsx
```

Expected: PASS (all existing tests).

- [ ] **Step 3: Commit**

```bash
git add src/pages/BatchDetail/ItemList.tsx
git commit -m "feat: use TableSkeletonRow in ItemList"
```

---

## Task 6: Update PartnersPage

**Files:**
- Modify: `src/pages/Partners/PartnersPage.tsx`

- [ ] **Step 1: Replace the inline skeleton block**

In `src/pages/Partners/PartnersPage.tsx`:

1. Add the import:
```tsx
import { TableSkeletonRow } from '@/components/ui/table-skeleton-row'
```

2. Remove the `Skeleton` import.

3. Replace the `{isLoading && Array.from(...).map(...)}` block (lines 59–68) with:
```tsx
{isLoading && (
  <TableSkeletonRow
    rows={8}
    columns={[
      { width: ['w-32', 'w-40', 'w-28'], shape: 'text' },
      { width: 'w-28', shape: 'mono' },
      { width: ['w-48', 'w-40'], shape: 'text' },
      { width: 'w-24', shape: 'text', hidden: 'hidden lg:table-cell' },
      { width: 'w-16', shape: 'badge' },
      { width: 'w-16', shape: 'button' },
    ]}
  />
)}
```

- [ ] **Step 2: Run full test suite**

```bash
npx vitest run
```

Expected: All tests PASS.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Partners/PartnersPage.tsx
git commit -m "feat: use TableSkeletonRow in PartnersPage"
```

---

## Task 7: Smoke test in browser

**No files to change — validation only.**

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

- [ ] **Step 2: Verify shimmer in each table**

- Open the Lotes page (`/batches`) — on first load, verify 5 rows animate with a sliding shimmer (not a fade pulse)
- Open any batch detail — verify the Items table skeleton matches
- Open Parceiros — verify 8 rows with shimmer

- [ ] **Step 3: Check responsiveness**

Resize to mobile width — verify `hidden sm:table-cell` and `hidden lg:table-cell` columns disappear correctly in skeleton rows (same as in real rows).
