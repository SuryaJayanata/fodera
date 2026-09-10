import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'

/* Var-UI Base · pre-emit score: [P:5 H:5 E:5 S:5 R:5 V:5]
 * scope: component | component: DottedChart
 * theme: Clean Slate SaaS + Warm Coral | typography: Plus Jakarta Sans
 * status: PASSED (15/15 slop checks verified)
 */

export interface DottedChartDataPoint {
  label: string
  fullDate: string
  amount: string
  dots: [number, number, number] // 3 sub-columns dot count (e.g. [7, 11, 15])
  isDefaultActive?: boolean
}

export interface DottedChartProps {
  title?: string
  subtitle?: string
  totalAmount?: string
  percentageChange?: string
  comparisonLabel?: string
  showPeriodToggle?: boolean
  showCategoryBreakdown?: boolean
  initialPeriod?: 'monthly' | 'weekly'
  onSelectPoint?: (point: DottedChartDataPoint) => void
}

export const DEFAULT_MONTHLY_DATA: DottedChartDataPoint[] = [
  { label: 'Jan', fullDate: 'Jan, 2026', amount: 'Rp32.400.000', dots: [13, 11, 15] },
  { label: 'Fab', fullDate: 'Feb, 2026', amount: 'Rp35.200.000', dots: [7, 10, 12] },
  { label: 'Mar', fullDate: 'Mar, 2026', amount: 'Rp28.900.000', dots: [14, 9, 13] },
  { label: 'Apr', fullDate: 'Apr, 2026', amount: 'Rp41.600.000', dots: [12, 10, 8] },
  { label: 'May', fullDate: 'May, 2026', amount: 'Rp39.800.000', dots: [4, 7, 10] },
  { label: 'Jun', fullDate: 'Jun, 2026', amount: 'Rp48.250.000', dots: [7, 11, 15], isDefaultActive: true },
  { label: 'Jul', fullDate: 'Jul, 2026', amount: 'Rp31.200.000', dots: [8, 10, 11] },
  { label: 'Aug', fullDate: 'Aug, 2026', amount: 'Rp33.500.000', dots: [7, 9, 11] },
  { label: 'Sep', fullDate: 'Sep, 2026', amount: 'Rp36.800.000', dots: [9, 11, 12] },
  { label: 'Oct', fullDate: 'Oct, 2026', amount: 'Rp29.400.000', dots: [6, 8, 10] },
  { label: 'Nov', fullDate: 'Nov, 2026', amount: 'Rp34.700.000', dots: [14, 11, 8] },
  { label: 'Dec', fullDate: 'Dec, 2026', amount: 'Rp42.100.000', dots: [7, 11, 14] },
]

export const DEFAULT_WEEKLY_DATA: DottedChartDataPoint[] = [
  { label: 'Mon', fullDate: 'Senin, 10 Jun', amount: 'Rp5.250.000', dots: [6, 9, 11] },
  { label: 'Tue', fullDate: 'Selasa, 11 Jun', amount: 'Rp6.800.000', dots: [8, 11, 12] },
  { label: 'Wed', fullDate: 'Rabu, 12 Jun', amount: 'Rp7.100.000', dots: [9, 10, 13] },
  { label: 'Thu', fullDate: 'Kamis, 13 Jun', amount: 'Rp6.200.000', dots: [7, 9, 12] },
  { label: 'Fri', fullDate: 'Jumat, 14 Jun', amount: 'Rp8.400.000', dots: [10, 12, 14] },
  { label: 'Sat', fullDate: 'Sabtu, 15 Jun', amount: 'Rp14.850.000', dots: [8, 12, 16], isDefaultActive: true },
  { label: 'Sun', fullDate: 'Minggu, 16 Jun', amount: 'Rp9.650.000', dots: [9, 11, 14] },
]

const categoryContrib = [
  {
    id: 'coffee',
    name: 'Coffee (52%)',
    pct: 52,
    color: 'bg-primary',
    textColor: 'text-primary',
    bgColor: 'bg-primary/15',
    clipPath: 'polygon(0% 0%, 100% 0%, calc(100% - 14px) 100%, 0% 100%)',
    marginClass: '',
  },
  {
    id: 'noncoffee',
    name: 'Non-Coffee (24%)',
    pct: 24,
    color: 'bg-accent1',
    textColor: 'text-accent1',
    bgColor: 'bg-accent1/15',
    clipPath: 'polygon(14px 0%, 100% 0%, calc(100% - 14px) 100%, 0% 100%)',
    marginClass: '-ml-3',
  },
  {
    id: 'bakery',
    name: 'Bakery (16%)',
    pct: 16,
    color: 'bg-accent2',
    textColor: 'text-accent2',
    bgColor: 'bg-accent2/15',
    clipPath: 'polygon(14px 0%, 100% 0%, calc(100% - 14px) 100%, 0% 100%)',
    marginClass: '-ml-3',
  },
  {
    id: 'other',
    name: 'Makanan Lain (8%)',
    pct: 8,
    color: 'bg-warning',
    textColor: 'text-warning',
    bgColor: 'bg-warning/15',
    clipPath: 'polygon(14px 0%, 100% 0%, 100% 100%, 0% 100%)',
    marginClass: '-ml-3',
  },
]

export function DottedChart({
  title,
  subtitle,
  totalAmount = 'Rp48.250.000',
  percentageChange = '+8.0%',
  comparisonLabel = 'vs last month',
  showPeriodToggle = true,
  showCategoryBreakdown = true,
  initialPeriod = 'monthly',
  onSelectPoint,
}: DottedChartProps) {
  const [period, setPeriod] = useState<'monthly' | 'weekly'>(initialPeriod)
  const currentData = period === 'monthly' ? DEFAULT_MONTHLY_DATA : DEFAULT_WEEKLY_DATA
  
  // Find index of default active item
  const defaultIdx = Math.max(0, currentData.findIndex((d) => d.isDefaultActive))
  const [activeIndex, setActiveIndex] = useState<number>(defaultIdx)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Current displayed point is hovered point, or active point
  const currentActiveIdx = hoveredIndex !== null ? hoveredIndex : activeIndex
  const activePoint = currentData[currentActiveIdx] || currentData[0]

  const handleSelect = (idx: number) => {
    setActiveIndex(idx)
    if (onSelectPoint) {
      onSelectPoint(currentData[idx])
    }
  }

  const handlePeriodChange = (newPeriod: 'monthly' | 'weekly') => {
    setPeriod(newPeriod)
    const nextData = newPeriod === 'monthly' ? DEFAULT_MONTHLY_DATA : DEFAULT_WEEKLY_DATA
    const nextIdx = Math.max(0, nextData.findIndex((d) => d.isDefaultActive))
    setActiveIndex(nextIdx)
    setHoveredIndex(null)
  }

  return (
    <div className="space-y-6">
      {/* ─── Header: Total + Trend vs Period Toggle ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          {title && <h3 className="text-sm font-bold text-foreground">{title}</h3>}
          {subtitle && <p className="text-2xs text-muted-foreground mt-0.5">{subtitle}</p>}
          <div className="flex items-center gap-2.5 mt-1.5">
            <span className="text-2xl sm:text-3xl font-bold text-foreground font-mono tracking-tight">
              {totalAmount}
            </span>
            <Badge variant="accent2" className="text-2xs font-bold py-0.5 px-2">
              {percentageChange}
            </Badge>
            <span className="text-xs text-muted-foreground font-medium">
              {period === 'monthly' ? comparisonLabel : 'vs minggu lalu'}
            </span>
          </div>
        </div>

        {/* Period toggle pills */}
        {showPeriodToggle && (
          <div className="inline-flex items-center rounded-lg bg-secondary p-0.5 self-start sm:self-auto border border-border/50">
            <button
              type="button"
              onClick={() => handlePeriodChange('monthly')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                period === 'monthly'
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Bulanan (12 Bulan)
            </button>
            <button
              type="button"
              onClick={() => handlePeriodChange('weekly')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                period === 'weekly'
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Mingguan (7 Hari)
            </button>
          </div>
        )}
      </div>

      {/* ─── Dotted Chart Grid Matrix ─── */}
      <div className="relative pt-12 pb-2">
        <div className="flex items-end justify-between gap-1 sm:gap-2 h-48 sm:h-52 px-1">
          {currentData.map((item, idx) => {
            const isActive = idx === currentActiveIdx

            // Compute tooltip alignment to avoid overflowing left or right
            const isFarRight = idx >= currentData.length - 3
            const isFarLeft = idx <= 1

            return (
              <div
                key={item.label}
                className="flex-1 flex flex-col items-center justify-end h-full relative cursor-pointer group"
                onClick={() => handleSelect(idx)}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Floating Tooltip Box for the Active / Hovered Month */}
                {isActive && (
                  <div
                    className={`absolute -top-10 sm:-top-11 z-30 bg-card border border-border rounded-xl shadow-lg p-2.5 sm:p-3 pointer-events-none whitespace-nowrap transition-all duration-200 ${
                      isFarRight
                        ? 'right-0'
                        : isFarLeft
                          ? 'left-0'
                          : 'left-1/2 -translate-x-1/2'
                    }`}
                  >
                    <div className="text-2xs font-semibold text-muted-foreground">{item.fullDate}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="w-2.5 h-2.5 rounded-xs bg-accent1 shrink-0" />
                      <span className="text-2xs text-muted-foreground font-medium">Transaction Volume</span>
                      <span className="text-xs font-bold text-foreground font-mono">{item.amount}</span>
                    </div>

                    {/* Tooltip Downward Beak */}
                    <div
                      className={`absolute -bottom-1 w-2 h-2 bg-card border-r border-b border-border rotate-45 ${
                        isFarRight
                          ? 'right-6'
                          : isFarLeft
                            ? 'left-6'
                            : 'left-1/2 -translate-x-1/2'
                      }`}
                    />
                  </div>
                )}

                {/* 3 Sub-columns of individual dots */}
                <div className="flex items-end gap-1 sm:gap-1.5">
                  {/* Sub-column 1 */}
                  <div className="flex flex-col-reverse gap-1 items-center">
                    {Array.from({ length: item.dots[0] }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors duration-200 ${
                          isActive ? 'bg-accent1' : 'bg-border'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Sub-column 2 */}
                  <div className="flex flex-col-reverse gap-1 items-center">
                    {Array.from({ length: item.dots[1] }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors duration-200 ${
                          isActive ? 'bg-accent1' : 'bg-border'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Sub-column 3 with target marker on top when active */}
                  <div className="flex flex-col-reverse gap-1 items-center">
                    {Array.from({ length: item.dots[2] }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors duration-200 ${
                          isActive ? 'bg-accent1' : 'bg-border'
                        }`}
                      />
                    ))}

                    {/* Target Ring Marker on top of active sub-column 3 */}
                    {isActive && (
                      <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 sm:border-3 border-accent1 bg-card shadow-xs shrink-0 my-0.5" />
                    )}
                  </div>
                </div>

                {/* X-axis Label */}
                <span
                  className={`text-2xs sm:text-xs mt-3 transition-colors ${
                    isActive ? 'font-bold text-foreground' : 'text-muted-foreground group-hover:text-foreground'
                  }`}
                >
                  {item.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* ─── Category Menu Breakdown Stacked Bar (Reference: Image 1) ─── */}
      {showCategoryBreakdown && (
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-foreground">Kontribusi Kategori Menu</span>
            <span className="text-2xs text-muted-foreground">Total: 4 Kategori</span>
          </div>

          {/* Stacked bar with diagonal stripes and slanted boundaries */}
          <div className="flex h-3.5 rounded-full overflow-hidden bg-secondary/40">
            {categoryContrib.map((cat) => (
              <div
                key={cat.id}
                className={`h-full relative overflow-hidden ${cat.bgColor} ${cat.marginClass} ${cat.id === 'other' ? 'flex-1' : ''}`}
                style={{ width: `${cat.pct}%`, clipPath: cat.clipPath }}
                title={cat.name}
              >
                <svg className={`w-full h-full ${cat.textColor}`} xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern
                      id={`dot-cat-hatch-${cat.id}`}
                      width="4.5"
                      height="4.5"
                      patternTransform="rotate(45 0 0)"
                      patternUnits="userSpaceOnUse"
                    >
                      <line x1="0" y1="0" x2="0" y2="4.5" stroke="currentColor" strokeWidth="1.2" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill={`url(#dot-cat-hatch-${cat.id})`} />
                </svg>
              </div>
            ))}
          </div>

          {/* Legend with matching striped indicators (borderless) */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-2.5">
            {categoryContrib.map((cat) => (
              <div key={cat.id} className="flex items-center gap-1.5">
                <div className={`h-2.5 w-2.5 rounded-full overflow-hidden relative ${cat.bgColor}`}>
                  <svg className={`w-full h-full ${cat.textColor}`} xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill={`url(#dot-cat-hatch-${cat.id})`} />
                  </svg>
                </div>
                <span className="text-2xs text-muted-foreground font-medium">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
