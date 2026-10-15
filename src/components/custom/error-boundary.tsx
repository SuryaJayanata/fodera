import React, { Component, ErrorInfo, ReactNode } from 'react'
import { WarningCircle, ArrowClockwise } from '@phosphor-icons/react'
import { Button } from './button'

interface Props {
  children: ReactNode
  fallbackTitle?: string
  fallbackMessage?: string
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 rounded-2xl border border-destructive/20 bg-destructive/5 text-center space-y-3 my-4">
          <div className="flex items-center justify-center">
            <div className="h-10 w-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
              <WarningCircle className="h-6 w-6" weight="duotone" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              {this.props.fallbackTitle || 'Terjadi kendala visual pada komponen ini'}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
              {this.props.fallbackMessage ||
                this.state.error?.message ||
                'Komponen mengalami interupsi render. Silakan muat ulang tampilan.'}
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 pt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={this.handleReset}
              className="gap-1.5 text-xs"
            >
              <ArrowClockwise className="h-3.5 w-3.5" />
              <span>Coba Lagi</span>
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
