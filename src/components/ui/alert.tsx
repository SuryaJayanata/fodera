import * as React from 'react'
import { Info, WarningCircle, Warning, CheckCircle } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive' | 'warning' | 'success' | 'accent1'
  title?: string
  action?: React.ReactNode
}

export function Alert({
  className,
  variant = 'default',
  title,
  action,
  children,
  ...props
}: AlertProps) {
  const icons = {
    default: Info,
    destructive: WarningCircle,
    warning: Warning,
    success: CheckCircle,
    accent1: WarningCircle,
  }

  const IconComponent = icons[variant]

  const variantStyles = {
    default: 'border-border bg-secondary/60 text-foreground',
    destructive: 'border-destructive/30 bg-destructive/5 text-destructive',
    warning: 'border-warning/30 bg-warning/5 text-warning',
    success: 'border-success/30 bg-success/5 text-foreground',
    accent1: 'border-accent1/30 bg-accent1/5 text-accent1',
  }

  const iconColors = {
    default: 'text-muted-foreground',
    destructive: 'text-destructive',
    warning: 'text-warning',
    success: 'text-success',
    accent1: 'text-accent1',
  }

  return (
    <div
      role="alert"
      className={cn(
        'relative flex items-start gap-3 rounded-lg border p-4 text-sm transition-all',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      <IconComponent className={cn('h-4 w-4 shrink-0 mt-0.5', iconColors[variant])} />
      <div className="flex-1">
        {title && <h5 className="font-semibold leading-tight tracking-tight mb-0.5">{title}</h5>}
        <div className="text-xs leading-relaxed text-muted-foreground">{children}</div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
