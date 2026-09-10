import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'accent1' | 'accent2' | 'ghost' | 'destructive'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none text-sm'

    const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
      default: 'bg-primary text-white hover:bg-primary/90 shadow-sm',
      secondary: 'bg-secondary text-foreground hover:bg-border/60 border border-border/80',
      outline: 'border border-border bg-card text-foreground hover:bg-secondary shadow-xs',
      accent1: 'bg-accent1 text-white hover:bg-accent1/90 shadow-sm font-semibold',
      accent2: 'bg-accent2 text-white hover:bg-accent2/90 shadow-sm font-semibold',
      ghost: 'text-foreground hover:bg-secondary',
      destructive: 'bg-destructive text-white hover:bg-destructive/90 shadow-sm',
    }

    const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
      default: 'h-9 px-4 py-2',
      sm: 'h-8 px-3 text-xs',
      lg: 'h-11 px-6 text-base',
      icon: 'h-9 w-9 p-0',
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'
