import React from 'react'
import { ArrowUpRight, ArrowDownRight } from '@phosphor-icons/react'
import { Card, CardContent } from './card'
import { Badge } from './badge'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  title: string
  value: string
  change?: string
  trend?: 'up' | 'down' | 'neutral'
  subtitle?: string
  icon?: React.ComponentType<{ className?: string; weight?: any }>
  className?: string
  accentColor?: 'accent1' | 'accent2' | 'primary' | 'secondary'
}

export function MetricCard({
  title,
  value,
  change,
  trend = 'up',
  subtitle,
  icon: Icon,
  className,
  accentColor = 'accent1',
}: MetricCardProps) {
  return (
    <Card className={cn('overflow-hidden transition-all hover:border-border/80', className)}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">{title}</span>
          {Icon && (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-foreground">
              <Icon className="h-4 w-4" />
            </div>
          )}
        </div>

        <div className="mt-3 flex items-baseline justify-between gap-2">
          <div className="text-2xl font-extrabold tracking-tight text-foreground">{value}</div>
          {change && (
            <Badge
              variant={trend === 'up' ? 'accent2' : trend === 'down' ? 'destructive' : 'secondary'}
              className="flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5"
            >
              {trend === 'up' && <ArrowUpRight className="h-3 w-3" />}
              {trend === 'down' && <ArrowDownRight className="h-3 w-3" />}
              {change}
            </Badge>
          )}
        </div>

        {subtitle && (
          <div className="mt-2 text-xs text-muted-foreground">
            {subtitle}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
