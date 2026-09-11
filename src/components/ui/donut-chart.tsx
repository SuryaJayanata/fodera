import React, { useState, useId } from 'react'
import { DotsThree, ForkKnife, Coffee, Motorcycle } from '@phosphor-icons/react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface DonutSegment {
  id: string
  name: string
  shortName: string
  pct: number
  count: number
  amount: string
  strokeOpacity?: number
  strokeWidth?: number
  fillOpacity?: number
  pillClass?: string
  textClass?: string
  bgClass?: string
  borderClass?: string
  icon?: React.ComponentType<{ className?: string; weight?: any }>
}

export interface DonutChartProps {
  title?: string
  subtitle?: string
  segments?: DonutSegment[]
  centerTotalLabel?: string
  centerTotalValue?: string
  className?: string
  onViewDetails?: () => void
}

const DEFAULT_SEGMENTS: DonutSegment[] = [
  {
    id: 'dinein',
    name: 'Dine In (Santap di Kafe)',
    shortName: 'Dine In',
    pct: 58,
    count: 745,
    amount: 'Rp27.98M',
    strokeOpacity: 1,
    strokeWidth: 1.4,
    fillOpacity: 0.22,
    pillClass: 'bg-accent1',
    textClass: 'text-accent1',
    bgClass: 'bg-accent1/25',
    borderClass: 'border-accent1',
    icon: ForkKnife,
  },
  {
    id: 'takeaway',
    name: 'Takeaway (Bungkus / To Go)',
    shortName: 'Takeaway',
    pct: 26,
    count: 334,
    amount: 'Rp12.54M',
    strokeOpacity: 0.8,
    strokeWidth: 1.3,
    fillOpacity: 0.15,
    pillClass: 'bg-accent1/75',
    textClass: 'text-accent1',
    bgClass: 'bg-accent1/18',
    borderClass: 'border-accent1/70',
    icon: Coffee,
  },
  {
    id: 'delivery',
    name: 'Delivery (GoFood / GrabFood)',
    shortName: 'Delivery',
    pct: 16,
    count: 205,
    amount: 'Rp7.73M',
    strokeOpacity: 0.6,
    strokeWidth: 1.2,
    fillOpacity: 0.08,
    pillClass: 'bg-accent1/40',
    textClass: 'text-accent1',
    bgClass: 'bg-accent1/10',
    borderClass: 'border-accent1/40',
    icon: Motorcycle,
  },
]

// Polar to cartesian for semicircle arch (A=0 is left, A=90 is top, A=180 is right)
function getArchPoint(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180
  return {
    x: cx - r * Math.cos(rad),
    y: cy - r * Math.sin(rad),
  }
}

// Generates SVG path for an arch ribbon slice
function buildArchSlicePath(
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  startDeg: number,
  endDeg: number,
  gapDeg: number = 2.0
): string {
  const span = endDeg - startDeg
  if (span <= gapDeg) return ''

  const a1 = startDeg + gapDeg / 2
  const a2 = endDeg - gapDeg / 2

  const pOut1 = getArchPoint(cx, cy, outerR, a1)
  const pOut2 = getArchPoint(cx, cy, outerR, a2)
  const pIn2 = getArchPoint(cx, cy, innerR, a2)
  const pIn1 = getArchPoint(cx, cy, innerR, a1)

  return `M ${pOut1.x.toFixed(2)} ${pOut1.y.toFixed(2)} A ${outerR} ${outerR} 0 0 1 ${pOut2.x.toFixed(2)} ${pOut2.y.toFixed(2)} L ${pIn2.x.toFixed(2)} ${pIn2.y.toFixed(2)} A ${innerR} ${innerR} 0 0 0 ${pIn1.x.toFixed(2)} ${pIn1.y.toFixed(2)} Z`
}

export function DonutChart({
  title = 'Distribusi Kanal Penjualan',
  subtitle,
  segments = DEFAULT_SEGMENTS,
  centerTotalLabel = 'Total Pesanan',
  centerTotalValue = '1,284',
  className,
  onViewDetails,
}: DonutChartProps) {
  const rawId = useId()
  const patternId = rawId.replace(/[^a-zA-Z0-9_-]/g, '')

  const [hoveredId, setHoveredId] = useState<string | null>(null)

  // Arch geometry
  const cx = 110
  const cy = 120
  const baseOuterR = 95
  const innerR = 70

  const hoveredSegment = segments.find((s) => s.id === hoveredId)

  // Build arch slices
  let currentDeg = 0
  const renderedSlices = segments.map((seg) => {
    const spanDeg = (seg.pct / 100) * 180
    const startDeg = currentDeg
    const endDeg = currentDeg + spanDeg
    currentDeg += spanDeg

    const isHovered = hoveredId === seg.id
    const outerR = isHovered ? baseOuterR + 3 : baseOuterR
    const pathD = buildArchSlicePath(cx, cy, innerR, outerR, startDeg, endDeg, 2.2)

    return {
      ...seg,
      pathD,
      isHovered,
    }
  })

  return (
    <Card className={cn('rounded-2xl border-border bg-card shadow-2xs overflow-hidden', className)}>
      <CardContent className="p-5 sm:p-6">
        {/* Header: Title on left, '...' on right matching reference */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div>
            <h3 className="text-base font-bold tracking-tight text-foreground">{title}</h3>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onViewDetails}
            className="h-8 w-8 rounded-full hover:bg-secondary transition-colors flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
            title="Menu Pilihan"
          >
            <DotsThree className="h-5 w-5" weight="bold" />
          </button>
        </div>

        {/* Semi-Circle Arch Gauge with Fine Diagonal Striped Line Pattern in Vibrant Orange */}
        <div className="relative flex flex-col items-center justify-center pt-2 pb-1">
          <svg
            viewBox="0 0 220 135"
            className="w-full max-w-xs h-auto select-none overflow-visible text-accent1"
          >
            {/* Diagonal hatch pattern defs per segment - strictly using warm orange token var(--color-accent1) */}
            <defs>
              {segments.map((seg) => (
                <pattern
                  key={seg.id}
                  id={`arch-hatch-${patternId}-${seg.id}`}
                  width="4"
                  height="4"
                  patternTransform="rotate(45 0 0)"
                  patternUnits="userSpaceOnUse"
                >
                  <line
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="4"
                    stroke="var(--color-accent1)"
                    strokeOpacity={seg.strokeOpacity ?? 1}
                    strokeWidth={seg.strokeWidth ?? 1.3}
                  />
                </pattern>
              ))}
            </defs>

            {/* Arch Ribbon Slices - Borderless with vibrant warm orange tones */}
            {renderedSlices.map((seg) => {
              const isHovered = hoveredId === seg.id
              const isAnyHovered = Boolean(hoveredId)
              const baseFillOpacity = seg.fillOpacity ?? 0.18
              const effectiveFillOpacity = isHovered
                ? baseFillOpacity + 0.14
                : isAnyHovered
                  ? baseFillOpacity * 0.6
                  : baseFillOpacity

              return (
                <g
                  key={seg.id}
                  className="cursor-pointer group"
                  onMouseEnter={() => setHoveredId(seg.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* 1. Underlying warm orange tint */}
                  <path
                    d={seg.pathD}
                    fill="var(--color-accent1)"
                    fillOpacity={effectiveFillOpacity}
                    className="transition-all duration-200"
                  />

                  {/* 2. Clear & vibrant orange diagonal line/striped pattern */}
                  <path
                    d={seg.pathD}
                    fill={`url(#arch-hatch-${patternId}-${seg.id})`}
                    className={cn(
                      'transition-all duration-200',
                      isAnyHovered && !isHovered ? 'opacity-35' : 'opacity-100'
                    )}
                  />
                </g>
              )
            })}

            {/* Center Information inside the Arch - Positioned lower into the arch opening */}
            <g className="pointer-events-none select-none">
              {hoveredSegment ? (
                <>
                  <text
                    x={cx}
                    y="97"
                    textAnchor="middle"
                    className="font-bold font-mono text-base fill-foreground tracking-tight"
                  >
                    {hoveredSegment.pct}%
                  </text>
                  <text
                    x={cx}
                    y="114"
                    textAnchor="middle"
                    className="font-medium text-2xs fill-muted-foreground"
                  >
                    {hoveredSegment.shortName} · {hoveredSegment.count} Tx
                  </text>
                </>
              ) : (
                <>
                  <text
                    x={cx}
                    y="97"
                    textAnchor="middle"
                    className="font-bold font-mono text-base fill-foreground tracking-tight"
                  >
                    {centerTotalValue}
                  </text>
                  <text
                    x={cx}
                    y="114"
                    textAnchor="middle"
                    className="font-medium text-2xs fill-muted-foreground"
                  >
                    {centerTotalLabel}
                  </text>
                </>
              )}
            </g>
          </svg>
        </div>

        {/* Breakdown Channel List with warm orange indicator pills matching reference screenshot */}
        <div className="space-y-2.5 mt-3 pt-3 border-t border-border">
          {segments.map((seg) => {
            const isHovered = hoveredId === seg.id
            return (
              <div
                key={seg.id}
                onMouseEnter={() => setHoveredId(seg.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={cn(
                  'flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors',
                  isHovered ? 'bg-secondary' : 'hover:bg-secondary/50'
                )}
              >
                {/* Left: Warm orange pill indicator matching reference + Name */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={cn(
                      'h-2.5 w-6 rounded-full overflow-hidden relative shrink-0 transition-all',
                      seg.pillClass || 'bg-accent1'
                    )}
                  >
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      <rect
                        width="100%"
                        height="100%"
                        fill={`url(#arch-hatch-${patternId}-${seg.id})`}
                      />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-foreground truncate">
                    {seg.name}
                  </span>
                </div>

                {/* Right: Quantity & Percentage */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-bold text-foreground font-mono">
                    {seg.count}
                  </span>
                  <Badge variant="secondary" className="text-2xs font-bold px-1.5 py-0.5">
                    {seg.pct}%
                  </Badge>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom Full-Width "View Details" Button matching reference screenshot */}
        <Button
          variant="outline"
          onClick={onViewDetails}
          className="w-full mt-4 text-xs font-semibold py-2 rounded-xl cursor-pointer hover:bg-secondary transition-colors"
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  )
}
