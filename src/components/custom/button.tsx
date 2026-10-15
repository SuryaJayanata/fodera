import * as React from 'react'
import { Button as ShadcnButton, ButtonProps as ShadcnButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface CustomButtonProps extends Omit<ShadcnButtonProps, 'variant'> {
  variant?:
    | 'default'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'destructive'
    | 'link'
    | 'accent1'
    | 'accent2'
}

export const Button = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    if (variant === 'accent1') {
      return (
        <ShadcnButton
          ref={ref}
          variant="default"
          className={cn(
 'bg-accent1 text-white hover:bg-accent1/90 font-semibold border-transparent cursor-pointer',
            className
          )}
          {...props}
        />
      )
    }

    if (variant === 'accent2') {
      return (
        <ShadcnButton
          ref={ref}
          variant="default"
          className={cn(
 'bg-accent2 text-white hover:bg-accent2/90 font-semibold border-transparent cursor-pointer',
            className
          )}
          {...props}
        />
      )
    }

    return (
      <ShadcnButton
        ref={ref}
        variant={variant as ShadcnButtonProps['variant']}
        className={cn('cursor-pointer', className)}
        {...props}
      />
    )
  }
)
Button.displayName = 'CustomButton'
