# Table Skeleton Shimmer — Design Spec

**Date:** 2026-05-17  
**Scope:** BatchListPage, ItemList, PartnersPage

## Problem

The current skeleton loading state in all three tables uses `animate-pulse` with flat horizontal bars of varying widths. This feels visually poor: the animation is too subtle, the shapes don't reflect the actual content (badges, buttons, monospaced text), and there's no hierarchy between cell types.

## Solution Overview

Three improvements in tandem:
1. Replace `animate-pulse` with a shimmer (sliding gradient) animation
2. Extract a shared `TableSkeletonRow` component parameterized by column definitions
3. Define accurate per-table column shapes that mimic real content

---

## 1. Shimmer Animation

Add a `shimmer` keyframe animation to Tailwind config:

```js
// tailwind.config.js
keyframes: {
  shimmer: {
    '0%': { backgroundPosition: '200% 0' },
    '100%': { backgroundPosition: '-200% 0' },
  },
},
animation: {
  shimmer: 'shimmer 1.5s infinite linear',
},
```

The `Skeleton` component gains a `variant` prop:

```tsx
// src/components/ui/skeleton.tsx
type SkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: 'pulse' | 'shimmer'
}
```

- `pulse` (default): existing `animate-pulse bg-primary/10` — keeps backward compatibility
- `shimmer`: `animate-shimmer bg-gradient-to-r from-muted via-muted-foreground/10 to-muted bg-[length:200%_100%]`

All three tables use `variant="shimmer"`.

---

## 2. Shared `TableSkeletonRow` Component

Location: `src/components/ui/table-skeleton-row.tsx`

```ts
type SkeletonCell = {
  width: string | string[]  // single width or array rotated by row index
  shape?: 'text' | 'badge' | 'button' | 'mono'  // default: 'text'
  hidden?: string            // responsive class, e.g. 'hidden sm:table-cell'
}

type TableSkeletonRowProps = {
  columns: SkeletonCell[]
  rows?: number         // default: 5
}
```

Shape styles:
| Shape | Classes |
|---|---|
| `text` | `h-4 rounded` |
| `mono` | `h-4 rounded` |
| `badge` | `h-6 rounded-full` |
| `button` | `h-8 rounded-md` |

Each page calls `<TableSkeletonRow columns={...} rows={n} />` inside `<TableBody>`.

---

## 3. Column Definitions Per Table

### BatchListPage — 5 rows

| Column | Shape | Width pattern |
|---|---|---|
| ID | `mono` | `w-20` (hidden sm) |
| Ação | `badge` | `w-16` |
| Status | `badge` | `w-20` |
| Arquivo | `text` | `w-36` / `w-28` (alternated) |
| Atualizado em | `text` | `w-32` (hidden lg) |
| Actions | `button` | `w-20` |

### ItemList — 5 rows

| Column | Shape | Width pattern |
|---|---|---|
| Nome | `text` | `w-32` / `w-40` / `w-28` (3-cycle) |
| CPF | `mono` | `w-28` (hidden sm) |
| Email | `text` | `w-48` / `w-40` (alternated, hidden lg) |
| Status | `badge` | `w-20` |
| Actions | `button` | `w-14` |

### PartnersPage — 8 rows

| Column | Shape | Width pattern |
|---|---|---|
| Nome | `text` | `w-32` / `w-40` / `w-28` (3-cycle) |
| CPF | `mono` | `w-28` |
| Email | `text` | `w-48` / `w-40` (alternated) |
| Telefone | `text` | `w-24` (hidden lg) |
| Status | `badge` | `w-16` |
| Actions | `button` | `w-16` |

Width alternation is computed by row index inside `TableSkeletonRow` using the `columns` array — each cell with multiple widths passes them as an array `width: ['w-32', 'w-40', 'w-28']` and the component picks `widths[i % widths.length]`.

---

## Files Changed

- `tailwind.config.js` — add `shimmer` keyframe + animation
- `src/components/ui/skeleton.tsx` — add `variant` prop
- `src/components/ui/table-skeleton-row.tsx` — new shared component
- `src/pages/BatchList/BatchListPage.tsx` — replace inline skeleton rows
- `src/pages/BatchDetail/ItemList.tsx` — replace inline skeleton rows
- `src/pages/Partners/PartnersPage.tsx` — replace inline skeleton rows

## Out of Scope

- Skeleton for non-table loading states (cards, forms)
- Dark mode adjustments
- Animation on page transitions
