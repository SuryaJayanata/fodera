import React, { useState, useId } from 'react'
import { Faders, ArrowUpRight } from '@phosphor-icons/react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface SmoothChartDataPoint {
  day: string
  label: string
  value: number
  displayValue: string
  subValue?: string
  isPeak?: boolean
}

export interface SmoothAreaChartProps {
  title?: string
  statLabel?: string
  statValue?: string
  statSubValue?: string
  badges?: { label: string; count?: string | number }[]
  data?: SmoothChartDataPoint[]
  className?: string
  onFilterClick?: () => void
  onDetailClick?: () => void
}

const DEFAULT_DATA: SmoothChartDataPoint[] = [
  { day: 'Mon', label: 'Senin', value: 42, displayValue: 'Rp5.2M', subValue: '142 Tx' },
  { day: 'Tue', label: 'Selasa', value: 58, displayValue: 'Rp6.8M', subValue: '186 Tx' },
  { day: 'Wed', label: 'Rabu', value: 52, displayValue: 'Rp7.1M', subValue: '194 Tx' },
  { day: 'Thu', label: 'Kamis', value: 88, displayValue: '34,533', subValue: '286 Tx', isPeak: true },
  { day: 'Fri', label: 'Jumat', value: 65, displayValue: 'Rp9.8M', subValue: '254 Tx' },
  { day: 'Sat', label: 'Sabtu', value: 78, displayValue: 'Rp10.2M', subValue: '280 Tx' },
  { day: 'Sun', label: 'Minggu', value: 92, displayValue: 'Rp12.6M', subValue: '320 Tx' },
]

export function SmoothAreaChart({
  title = 'Total Spend',
  statLabel = 'Spend the week',
  statValue = 'Rp48.25M',
  statSubValue = 'Target Rp55.00M',
  badges = [
    { label: 'Cabang Aktif', count: '3' },
    { label: 'Total Pesanan', count: '1,284' },
  ],
  data = DEFAULT_DATA,
  className,
  onFilterClick,
  onDetailClick,
}: SmoothAreaChartProps) {
  const rawId = useId()
  const gradientId = `smooth-area-grad-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  // Find peak index
  const peakIdx = data.findIndex((d) => d.isPeak) >= 0
    ? data.findIndex((d) => d.isPeak)
    : data.reduce((maxI, d, i, arr) => (d.value > arr[maxI].value ? i : maxI), 0)

  // Active item is hovered item or peak item
  const activeIdx = hoveredIdx !== null ? hoveredIdx : peakIdx
  const activeItem = data[activeIdx]

  // SVG Coordinates calculation
  const svgWidth = 520
  const svgHeight = 180
  const paddingLeft = 32
  const paddingRight = 32
  const paddingTop = 36
  const paddingBottom = 28

  const chartWidth = svgWidth - paddingLeft - paddingRight
  const chartHeight = svgHeight - paddingTop - paddingBottom

  const minVal = 0
  const maxVal = Math.max(...data.map((d) => d.value)) * 1.15

  const points = data.map((d, i) => {
    const x = paddingLeft + (i / (data.length - 1)) * chartWidth
    const y = paddingTop + chartHeight - ((d.value - minVal) / (maxVal - minVal)) * chartHeight
    return { x, y, data: d }
  })

  // Generate smooth cubic Bezier spline path
  const generateSpline = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return ''
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`

    let path = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)]
      const p1 = pts[i]
      const p2 = pts[i + 1]
      const p3 = pts[Math.min(pts.length - 1, i + 2)]

      const tension = 0.22
      const cp1x = p1.x + (p2.x - p0.x) * tension
      const cp1y = p1.y + (p2.y - p0.y) * tension
      const cp2x = p2.x - (p3.x - p1.x) * tension
      const cp2y = p2.y - (p3.y - p1.y) * tension

      path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
    }
    return path
  }

  const linePath = generateSpline(points)
  const areaBottomY = paddingTop + chartHeight
  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${areaBottomY.toFixed(1)} L ${points[0].x.toFixed(1)} ${areaBottomY.toFixed(1)} Z`
    : ''

  const activePoint = points[activeIdx]

  return (
    <Card className={cn('rounded-2xl border-border bg-card shadow-2xs overflow-hidden', className)}>
      <CardContent className="p-5 sm:p-6">
        {/* Header: Title on left, Round action buttons on right */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold tracking-tight text-foreground">{title}</h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onFilterClick}
              className="h-9 w-9 rounded-full bg-secondary hover:bg-border transition-colors flex items-center justify-center text-foreground cursor-pointer"
              title="Filter"
            >
              <Faders className="h-4 w-4" weight="bold" />
            </button>
            <button
              type="button"
              onClick={onDetailClick}
              className="h-9 w-9 rounded-full bg-secondary hover:bg-border transition-colors flex items-center justify-center text-foreground cursor-pointer"
              title="View Details"
            >
              <ArrowUpRight className="h-4 w-4" weight="bold" />
            </button>
          </div>
        </div>

        {/* Main Content: Left Stat Summary + Right Smooth Spline Wave */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-6">
          {/* Left Column: Big Value + Subtitle + Stacked Badges */}
          <div className="w-full lg:w-48 shrink-0 flex flex-col justify-between">
            <div>
              <div className="text-xs font-medium text-muted-foreground">{statLabel}</div>
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mt-1 font-mono">
                {statValue}
              </div>
              {statSubValue && (
                <div className="text-xs text-muted-foreground mt-1">
                  {statSubValue}
                </div>
              )}
            </div>

            {/* Stacked Badges matching the reference image */}
            <div className="flex flex-wrap lg:flex-col gap-2 mt-4">
              {badges.map((b, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary text-foreground text-xs font-semibold"
                >
                  {b.count && <span className="text-foreground font-bold">{b.count}</span>}
                  <span className="text-muted-foreground font-medium">{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: The Smooth Wave Curve with Floating Pill Badge */}
          <div className="flex-1 min-w-0 relative">
            <div className="w-full overflow-hidden">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-auto overflow-visible select-none"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  {/* Subtle Gradient fill under the curve */}
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.12" className="text-muted-foreground" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0.00" className="text-muted-foreground" />
                  </linearGradient>
                </defs>

                {/* Shaded Area under spline */}
                {areaPath && (
                  <path
                    d={areaPath}
                    fill={`url(#${gradientId})`}
                    className="transition-all duration-300"
                  />
                )}

                {/* Spline Line Curve - Thinner line with non-scaling-stroke */}
                {linePath && (
                  <path
                    d={linePath}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-muted-foreground/70 transition-all duration-300"
                  />
                )}

                {/* Data Points (Dots on curve) */}
                {points.map((p, idx) => {
                  const isActive = idx === activeIdx
                  return (
                    <g
                      key={p.data.day}
                      className="cursor-pointer group"
                      onMouseEnter={() => setHoveredIdx(idx)}
                      onMouseLeave={() => setHoveredIdx(null)}
                    >
                      {/* Invisible larger hit target */}
                      <circle cx={p.x} cy={p.y} r="14" fill="transparent" />

                      {/* Visible Dot */}
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={isActive ? 2.5 : 1.75}
                        className={cn(
                          'transition-all duration-200',
                          isActive
                            ? 'fill-foreground'
                            : 'fill-foreground/80 hover:fill-foreground'
                        )}
                      />
                    </g>
                  )
                })}
              </svg>

              {/* Floating Highlight Pill Badge on Active / Peak Point - accent1 */}
              {activePoint && (
                <div
                  className="absolute pointer-events-none transition-all duration-200 -translate-x-1/2 -translate-y-full"
                  style={{
                    left: `${(activePoint.x / svgWidth) * 100}%`,
                    top: `${(activePoint.y / svgHeight) * 100 - 4}%`,
                  }}
                >
                  <div className="px-2.5 py-1 rounded-xl bg-accent1 text-white font-bold text-xs shadow-xs whitespace-nowrap">
                    {activeItem.displayValue}
                  </div>
                </div>
              )}
            </div>

            {/* X-Axis Labels: Mon, Tue, Wed, Thu, Fri, Sat, Sun */}
            <div className="flex items-center justify-between px-4 sm:px-6 mt-1">
              {data.map((d, idx) => (
                <button
                  key={d.day}
                  type="button"
                  onClick={() => setHoveredIdx(idx)}
                  className={cn(
                    'text-xs font-medium transition-colors cursor-pointer',
                    idx === activeIdx ? 'text-foreground font-bold' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {d.day}
                </button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
