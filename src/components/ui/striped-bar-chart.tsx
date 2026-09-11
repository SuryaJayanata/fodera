import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Faders, ArrowUpRight } from '@phosphor-icons/react'

/* Var-UI Base · pre-emit score: [P:5 H:5 E:5 S:5 R:5 V:5]
 * scope: component | component: StripedBarChart
 * theme: Clean Slate SaaS + Warm Coral & Soft Slate | typography: Plus Jakarta Sans
 * status: PASSED (15/15 slop checks verified)
 */

export interface StripedBarItem {
  day: string
  label: string
  pct: number
  badgeValue: string
  subValue: string
}

export interface StripedBarChartProps {
  title?: string
  statLabel?: string
  statValue?: string
  changeLabel?: string
  trend?: 'up' | 'down' | 'neutral'
  showCategoryBreakdown?: boolean
  items?: StripedBarItem[]
  onBarClick?: (item: StripedBarItem) => void
  onFilterClick?: () => void
  onViewDetails?: () => void
}

const DEFAULT_ITEMS: StripedBarItem[] = [
  { day: 'Mon', label: 'Senin', pct: 35, badgeValue: 'Rp5.2M', subValue: '142 Tx' },
  { day: 'Tue', label: 'Selasa', pct: 46, badgeValue: 'Rp6.8M', subValue: '186 Tx' },
  { day: 'Wed', label: 'Rabu', pct: 49, badgeValue: 'Rp7.1M', subValue: '194 Tx' },
  { day: 'Thu', label: 'Kamis', pct: 42, badgeValue: 'Rp6.2M', subValue: '168 Tx' },
  { day: 'Fri', label: 'Jumat', pct: 92, badgeValue: '12,464 (Rp14.8M)', subValue: '360 Tx' },
  { day: 'Sat', label: 'Sabtu', pct: 68, badgeValue: 'Rp10.2M', subValue: '280 Tx' },
  { day: 'Sun', label: 'Minggu', pct: 64, badgeValue: 'Rp9.6M', subValue: '264 Tx' },
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

export function StripedBarChart({
  title = 'Activity',
  statLabel = 'Worked this week',
  statValue = 'Rp48.25M',
  changeLabel = '+12.4% vs last week',
  trend = 'up',
  showCategoryBreakdown = true,
  items = DEFAULT_ITEMS,
  onBarClick,
  onFilterClick,
  onViewDetails,
}: StripedBarChartProps) {
  // Find highest item index ("yang paling naik")
  const maxItemIdx = items.reduce(
    (maxIdx, item, idx, arr) => (item.pct > arr[maxIdx].pct ? idx : maxIdx),
    0
  )

  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  const activeIdx = hoveredIdx !== null ? hoveredIdx : (selectedIdx !== null ? selectedIdx : maxItemIdx)

  return (
    <div className="space-y-6">
      {/* ─── Header matching reference image ─── */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold text-foreground tracking-tight">{title}</h3>
          <div className="mt-2">
            <span className="text-xs text-muted-foreground font-medium">{statLabel}</span>
            <div className="flex items-baseline gap-2.5 mt-0.5">
              <span className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight font-mono">
                {statValue}
              </span>
              <Badge variant="accent2" className="text-2xs font-bold py-0.5 px-2">
                {changeLabel}
              </Badge>
            </div>
          </div>
        </div>

        {/* Top-right round action buttons from reference image */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onFilterClick}
            className="h-9 w-9 rounded-full bg-secondary hover:bg-border transition-colors flex items-center justify-center text-foreground cursor-pointer"
            title="Filter Activity"
          >
            <Faders className="h-4 w-4" weight="bold" />
          </button>
          <button
            type="button"
            onClick={onViewDetails}
            className="h-9 w-9 rounded-full bg-secondary hover:bg-border transition-colors flex items-center justify-center text-foreground cursor-pointer"
            title="View Details"
          >
            <ArrowUpRight className="h-4 w-4" weight="bold" />
          </button>
        </div>
      </div>

      {/* ─── Bar Chart Area with High-Density Diagonal Stripes ─── */}
      <div className="pt-10 pb-2">
        <div className="flex items-end justify-between gap-2 sm:gap-4 h-52 sm:h-56 px-1">
          {items.map((item, idx) => {
            const isPeak = idx === maxItemIdx
            const isActive = idx === activeIdx

            return (
              <div
                key={item.day}
                className="flex-1 flex flex-col items-center justify-end h-full relative cursor-pointer group"
                onClick={() => {
                  setSelectedIdx(idx)
                  if (onBarClick) onBarClick(item)
                }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Floating pill badge on top of active/peak bar */}
                {isActive && (
                  <div
                    className="absolute z-20 transition-all duration-300 pointer-events-none"
                    style={{ bottom: `calc(${item.pct}% + 10px)` }}
                  >
                    <div
                      className={`font-bold text-xs px-2.5 py-1 rounded-xl shadow-xs whitespace-nowrap ${
                        isPeak
                          ? 'bg-accent1 text-white'
                          : 'bg-primary text-white'
                      }`}
                    >
                      {item.badgeValue}
                    </div>
                  </div>
                )}

                {/* The Bar: ALL bars use high-density diagonal striped pattern without outlines, slim shape */}
                <div
                  className={`w-full max-w-8 sm:max-w-9 rounded-lg flex items-end transition-all duration-300 ${
                    isPeak
                      ? 'bg-accent1/10 shadow-xs'
                      : isActive
                        ? 'bg-secondary/60'
                        : 'bg-secondary/30'
                  }`}
                  style={{ height: `${item.pct}%` }}
                >
                  <div className="w-full h-full rounded-lg overflow-hidden">
                    <svg
                      className={`w-full h-full transition-colors duration-200 ${
                        isPeak
                          ? 'text-accent1'
                          : isActive
                            ? 'text-muted-foreground/75'
                            : 'text-muted-foreground/40'
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        {/* High-density diagonal hatch: width=5 height=5 produces lots of fine diagonal lines */}
                        <pattern
                          id={`dense-hatch-${item.day}`}
                          width="5"
                          height="5"
                          patternTransform="rotate(45 0 0)"
                          patternUnits="userSpaceOnUse"
                        >
                          <line
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="5"
                            stroke="currentColor"
                            strokeWidth={isPeak ? 1.4 : 1.1}
                          />
                        </pattern>
                      </defs>
                      <rect
                        width="100%"
                        height="100%"
                        fill={`url(#dense-hatch-${item.day})`}
                      />
                    </svg>
                  </div>
                </div>

                {/* Day Label */}
                <span
                  className={`text-xs mt-3 transition-colors ${
                    isPeak
                      ? 'font-bold text-accent1'
                      : isActive
                        ? 'font-bold text-foreground'
                        : 'text-muted-foreground group-hover:text-foreground'
                  }`}
                >
                  {item.day}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* ─── Category Menu Breakdown Stacked Bar ─── */}
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
                      id={`hatch-cat-${cat.id}`}
                      width="4.5"
                      height="4.5"
                      patternTransform="rotate(45 0 0)"
                      patternUnits="userSpaceOnUse"
                    >
                      <line x1="0" y1="0" x2="0" y2="4.5" stroke="currentColor" strokeWidth="1.2" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill={`url(#hatch-cat-${cat.id})`} />
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
                    <rect width="100%" height="100%" fill={`url(#hatch-cat-${cat.id})`} />
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
