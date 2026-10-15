import * as React from 'react'
import { Badge as ShadcnBadge, BadgeProps as ShadcnBadgeProps } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface CustomBadgeProps extends Omit<ShadcnBadgeProps, 'variant'> {
  variant?:
    | 'default'
    | 'secondary'
    | 'destructive'
    | 'outline'
    | 'accent1'
    | 'accent2'
    | 'warning'
}

export function Badge({ className, variant = 'default', ...props }: CustomBadgeProps) {
  if (variant === 'accent1') {
    return (
      <div
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-accent1/10 text-accent1 border border-accent1/20 transition-colors select-none',
          className
        )}
        {...props}
      />
    )
  }

  if (variant === 'accent2') {
    return (
      <div
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-accent2/10 text-accent2 border border-accent2/20 transition-colors select-none',
          className
        )}
        {...props}
      />
    )
  }

  if (variant === 'warning') {
    return (
      <div
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-warning/10 text-warning border border-warning/20 transition-colors select-none',
          className
        )}
        {...props}
      />
    )
  }

  return (
    <ShadcnBadge
      variant={variant as ShadcnBadgeProps['variant']}
      className={className}
      {...props}
    />
  )
}
