import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'vertical' | 'horizontal' | 'both'
  as?: 'div' | 'main' | 'section' | 'nav' | 'aside'
}

/**
 * Reusable Custom Scrollbar Component
 * Provides a sleek, 5px thin scrollbar with accent1/5 background tint and no stepper arrows.
 */
export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
  (
    {
      className,
      children,
      orientation = 'vertical',
      as = 'div',
      ...props
    },
    ref
  ) => {
    const Component = as

    return (
      <Component
        ref={ref}
        className={cn(
          'relative custom-scrollbar',
          orientation === 'vertical' && 'overflow-y-auto overflow-x-hidden',
          orientation === 'horizontal' && 'overflow-x-auto overflow-y-hidden',
          orientation === 'both' && 'overflow-auto',
          className
        )}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

ScrollArea.displayName = 'CustomScrollArea'

export const CustomScrollbar = ScrollArea
