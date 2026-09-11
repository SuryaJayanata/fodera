import * as React from 'react'
import { X } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

export interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  side?: 'right' | 'left'
  className?: string
}

export function Drawer({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = 'xl',
  side = 'right',
  className,
}: DrawerProps) {
  const [isRendered, setIsRendered] = React.useState(isOpen)
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    let animTimer: any
    let closeTimer: any

    if (isOpen) {
      setIsRendered(true)
      // Small tick ensures browser paints the initial off-screen transform
      animTimer = setTimeout(() => {
        setIsVisible(true)
      }, 25)
      document.body.style.overflow = 'hidden'
    } else {
      setIsVisible(false)
      closeTimer = setTimeout(() => {
        setIsRendered(false)
      }, 350)
    }

    return () => {
      clearTimeout(animTimer)
      clearTimeout(closeTimer)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  React.useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isRendered) return null

  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  }[maxWidth]

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-primary/40 backdrop-blur-xs transition-opacity duration-300 ease-out',
          isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Floating Container */}
      <div
        className={cn(
          'fixed inset-0 z-50 flex pointer-events-none p-3 sm:p-4 overflow-hidden',
          side === 'right' ? 'justify-end' : 'justify-start'
        )}
      >
        {/* Floating Card Drawer Panel */}
        <div
          className={cn(
            'pointer-events-auto relative flex h-full w-full flex-col rounded-2xl border border-border bg-card shadow-xl transition-all duration-350 ease-out text-card-foreground overflow-hidden transform-gpu will-change-transform',
            maxWidthClass,
            isVisible
              ? 'translate-x-0 opacity-100'
              : side === 'right'
              ? 'translate-x-full opacity-0'
              : '-translate-x-full opacity-0',
            className
          )}
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          {(title || description) && (
            <div className="flex items-start justify-between p-6 pb-4 bg-card shrink-0">
              <div>
                {title && (
                  <h2 className="text-xl font-bold text-foreground tracking-tight">
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer shrink-0 ml-3"
                aria-label="Tutup"
              >
                <X className="h-4 w-4" weight="bold" />
              </button>
            </div>
          )}

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 py-2 custom-scrollbar space-y-5">
            {children}
          </div>

          {/* Stacked Action Footer */}
          {footer && (
            <div className="p-6 pt-4 border-t border-border bg-card shrink-0">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
