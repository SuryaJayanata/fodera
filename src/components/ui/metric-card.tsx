import React from 'react'
import { ArrowUpRight, ArrowDownRight } from '@phosphor-icons/react'
import { Card, CardContent } from './card'
import { Badge } from './badge'
import { cn } from '@/lib/utils'

export interface MetricCardProps {
  title: string
  value: string | number
  change?: string
  trend?: 'up' | 'down' | 'neutral'
  subtitle?: string
  subtitleClassName?: string
  icon?: React.ComponentType<{ className?: string; weight?: any }>
  iconClassName?: string
  iconPosition?: 'left' | 'right'
  className?: string
  accentColor?: 'accent1' | 'accent2' | 'primary' | 'secondary'
  sparkline?: number[] | null | false
  sparklineVariant?: 'striped' | 'solid'
  barColor?: 'accent1' | 'accent2' | 'primary' | 'warning' | 'muted'
  onClick?: () => void
}

export function MetricCard({
  title,
  value,
  change,
  trend = 'up',
  subtitle,
  subtitleClassName,
  icon: Icon,
  iconClassName,
  iconPosition = 'left',
  className,
  sparkline = [65, 45, 100, 80, 60],
  sparklineVariant = 'striped',
  barColor = 'accent1',
  onClick,
}: MetricCardProps) {
  const rawId = React.useId()
  const patternId = rawId.replace(/[^a-zA-Z0-9_-]/g, '')

  const colorMap = {
    accent1: {
      bg: 'bg-accent1/15',
      text: 'text-accent1',
      solid: 'bg-accent1',
    },
    accent2: {
      bg: 'bg-accent2/15',
      text: 'text-accent2',
      solid: 'bg-accent2',
    },
    primary: {
      bg: 'bg-primary/15',
      text: 'text-primary',
      solid: 'bg-primary',
    },
    warning: {
      bg: 'bg-warning/15',
      text: 'text-warning',
      solid: 'bg-warning',
    },
    muted: {
      bg: 'bg-secondary/60',
      text: 'text-muted-foreground/70',
      solid: 'bg-muted-foreground/40',
    },
  }
  const barColors = colorMap[barColor] || colorMap.accent1

  return (
    <Card
      onClick={onClick}
      className={cn(
        'rounded-2xl border-border bg-card shadow-2xs overflow-hidden transition-all hover:border-border/80 hover:shadow-xs',
        onClick && 'cursor-pointer active:scale-98',
        className
      )}
    >
      <CardContent className="p-4 sm:p-5">
        {/* Top Row: Icon + Title on left, Trend Badge on right */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {Icon && iconPosition === 'left' && (
              <Icon className={cn('h-4 w-4 shrink-0', iconClassName || 'text-foreground')} weight="bold" />
            )}
            <span className="text-xs font-semibold text-foreground truncate tracking-tight">
              {title}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {change && (
              <Badge
                variant={trend === 'up' ? 'accent2' : trend === 'down' ? 'destructive' : 'secondary'}
                className="text-2xs font-semibold px-1.5 py-0.5 shrink-0"
              >
                {trend === 'up' && <ArrowUpRight className="h-3 w-3 inline mr-0.5" />}
                {trend === 'down' && <ArrowDownRight className="h-3 w-3 inline mr-0.5" />}
                {change}
              </Badge>
            )}
            {Icon && iconPosition === 'right' && (
              <Icon className={cn('h-4 w-4 shrink-0', iconClassName || 'text-foreground')} weight="bold" />
            )}
          </div>
        </div>

        {/* Bottom Row: Big Value & Subtitle on left, Mini Spark Bar Chart on right */}
        <div className="mt-3.5 flex items-end justify-between gap-2">
          <div className="min-w-0">
            <div className="text-2xl font-extrabold tracking-tight text-foreground truncate">
              {value}
            </div>
            {subtitle && (
              <div className={cn('text-2xs text-muted-foreground mt-0.5 truncate', subtitleClassName)}>
                {subtitle}
              </div>
            )}
          </div>

          {/* Mini Bar Chart */}
          {sparkline && sparkline.length > 0 && (
            <div className="flex items-end gap-1 sm:gap-1.5 h-8 shrink-0 pb-0.5" aria-hidden="true">
              {sparkline.map((val, i) => {
                if (sparklineVariant === 'solid') {
                  return (
                    <div
                      key={i}
                      style={{ height: `${Math.max(22, Math.min(100, val))}%` }}
                      className={cn('w-1.5 sm:w-2 rounded-full transition-all', barColors.solid)}
                    />
                  )
                }

                return (
                  <div
                    key={i}
                    style={{ height: `${Math.max(22, Math.min(100, val))}%` }}
                    className={cn(
                      'w-2 sm:w-2.5 rounded-sm overflow-hidden transition-all',
                      barColors.bg
                    )}
                  >
                    <svg
                      className={cn('w-full h-full', barColors.text)}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {i === 0 && (
                        <defs>
                          <pattern
                            id={`spark-hatch-${patternId}`}
                            width="3.5"
                            height="3.5"
                            patternTransform="rotate(45 0 0)"
                            patternUnits="userSpaceOnUse"
                          >
                            <line
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="3.5"
                              stroke="currentColor"
                              strokeWidth={1.1}
                            />
                          </pattern>
                        </defs>
                      )}
                      <rect
                        width="100%"
                        height="100%"
                        fill={`url(#spark-hatch-${patternId})`}
                      />
                    </svg>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

