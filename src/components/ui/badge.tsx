import * as React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'accent1' | 'accent2' | 'destructive' | 'warning'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants: Record<NonNullable<BadgeProps['variant']>, string> = {
    default: 'bg-primary text-white',
    secondary: 'bg-secondary text-foreground border border-border/80',
    outline: 'border border-border text-foreground',
    accent1: 'bg-accent1/10 text-accent1 border border-accent1/20 font-semibold',
    accent2: 'bg-accent2/10 text-accent2 border border-accent2/20 font-semibold',
    destructive: 'bg-destructive/10 text-destructive border border-destructive/20 font-semibold',
    warning: 'bg-warning/10 text-warning border border-warning/20 font-semibold',
  }

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors select-none',
        variants[variant],
        className
      )}
      {...props}
    />
  )
}
