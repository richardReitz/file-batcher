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
