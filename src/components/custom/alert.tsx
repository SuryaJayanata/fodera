import * as React from 'react'
import { Info, WarningCircle, Warning, CheckCircle } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'info' | 'warning' | 'destructive' | 'success' | 'accent1'
  title?: string
  description?: string
  icon?: boolean
  action?: React.ReactNode
}

export function Alert({
  className,
  variant = 'default',
  title,
  description,
  icon = true,
  action,
  children,
  ...props
}: AlertProps) {
  const variants = {
    default: 'bg-secondary/60 border-border text-foreground',
    info: 'bg-sky-500/10 border-sky-500/20 text-sky-700',
    warning: 'bg-amber-500/10 border-amber-500/20 text-amber-800',
    destructive: 'bg-rose-500/10 border-rose-500/20 text-rose-700',
    success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800',
    accent1: 'bg-accent1/10 border-accent1/20 text-accent1',
  }

  const icons = {
    default: Info,
    info: Info,
    warning: Warning,
    destructive: WarningCircle,
    success: CheckCircle,
    accent1: WarningCircle,
  }

  const IconComponent = icons[variant]

  return (
    <div
      role="alert"
      className={cn(
        'relative w-full rounded-xl border p-4 text-xs transition-colors flex items-start justify-between gap-3',
        variants[variant],
        className
      )}
      {...props}
    >
      <div className="flex gap-3 flex-1 min-w-0">
        {icon && (
          <div className="shrink-0 mt-0.5">
            <IconComponent className="h-4 w-4" weight="bold" />
          </div>
        )}
        <div className="flex-1 space-y-1 min-w-0">
          {title && <h5 className="font-semibold leading-none tracking-tight">{title}</h5>}
          {description && <p className="text-2xs opacity-90 leading-relaxed">{description}</p>}
          {children}
        </div>
      </div>
      {action && <div className="shrink-0 self-center">{action}</div>}
    </div>
  )
}
