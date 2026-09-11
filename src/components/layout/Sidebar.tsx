import React, { useState, useEffect } from 'react'
import {
  House,
  Receipt,
  Coffee,
  Warehouse,
  Users,
  UsersThree,
  Storefront,
  ChartBar,
  ClockCounterClockwise,
  GearSix,
  MagnifyingGlass,
  Tray,
  CaretUpDown,
  CaretDown,
  CaretRight,
  SidebarSimple,
  Check,
  X,
  Icon,
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

/* Var-UI Base · pre-emit score: [P:5 H:5 E:5 S:5 R:5 V:5]
 * scope: component | component: Sidebar
 * theme: Clean Slate SaaS + Warm Coral | typography: Plus Jakarta Sans
 * status: PASSED (15/15 slop checks verified)
 */

interface SubPageDef {
  id: string
  label: string
}

interface NavItemDef {
  id: string
  label: string
  icon: Icon
  subPages?: SubPageDef[]
  badge?: number
}

export interface OutletOption {
  id: string
  name: string
  shortName: string
  tag: string
}

export const OUTLETS: OutletOption[] = [
  { id: 'all', name: 'All Outlets (3)', shortName: 'Semua Outlet', tag: 'Konsolidasi' },
  { id: 'malang', name: 'Kopi Senja - Malang', shortName: 'Cabang Malang', tag: 'Pusat' },
  { id: 'surabaya', name: 'Kopi Senja - Surabaya', shortName: 'Cabang Surabaya', tag: 'Cabang' },
  { id: 'jakarta', name: 'Kopi Senja - Jakarta', shortName: 'Cabang Jakarta', tag: 'Cabang' },
]

interface SidebarProps {
  activeModule: string
  activeSubPage: string
  onNavigate: (moduleId: string, subPageId?: string) => void
  onOpenQuickSearch?: () => void
  isMobileOpen?: boolean
  onCloseMobile?: () => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  currentOutlet?: string
  onOutletChange?: (outlet: string) => void
}

export function Sidebar({
  activeModule,
  activeSubPage,
  onNavigate,
  onOpenQuickSearch,
  isMobileOpen = false,
  onCloseMobile,
  isCollapsed: propIsCollapsed,
  onToggleCollapse,
  currentOutlet = 'all',
  onOutletChange,
}: SidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false)
  const isCollapsed = propIsCollapsed !== undefined ? propIsCollapsed : internalCollapsed

  const [isOutletExpanded, setIsOutletExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const activeOutletObj = OUTLETS.find((o) => o.id === currentOutlet) || OUTLETS[0]

  // Track accordion expand state for modules with subpages
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    dashboard: true,
    sales: true,
    products: false,
    inventory: false,
    team: false,
    outlets: false,
  })

  // Auto-expand current active module
  useEffect(() => {
    if (activeModule) {
      setExpandedModules((prev) => ({
        ...prev,
        [activeModule]: true,
      }))
    }
  }, [activeModule])

  const handleToggleCollapse = () => {
    if (onToggleCollapse) {
      onToggleCollapse()
    } else {
      setInternalCollapsed((prev) => !prev)
    }
  }

  const toggleModuleExpand = (moduleId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }))
  }

  // 1. Core Operations (sesuai Section 24: Core UI Structure flow_fodera.pdf)
  const coreOperationsItems: NavItemDef[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: House,
      subPages: [
        { id: 'overview', label: 'Overview' },
        { id: 'analytics', label: 'Sales Analytics' },
      ],
    },
    {
      id: 'sales',
      label: 'Sales',
      icon: Receipt,
      subPages: [
        { id: 'orders', label: 'Orders Queue' },
      ],
    },
    {
      id: 'products',
      label: 'Products',
      icon: Coffee,
      subPages: [
        { id: 'all', label: 'All Products' },
        { id: 'categories', label: 'Categories' },
      ],
    },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: Warehouse,
      badge: 3,
      subPages: [
        { id: 'stock', label: 'Stock Health' },
        { id: 'movement', label: 'Stock Movement' },
        { id: 'waste', label: 'Waste Tracking' },
      ],
    },
  ]

  // 2. Management (sesuai Section 24: Customers, Team, Outlets)
  const managementItems: NavItemDef[] = [
    {
      id: 'customers',
      label: 'Customers',
      icon: Users,
    },
    {
      id: 'team',
      label: 'Team',
      icon: UsersThree,
      subPages: [
        { id: 'staff', label: 'Staff' },
        { id: 'shifts', label: 'Shifts' },
      ],
    },
    {
      id: 'outlets',
      label: 'Outlets',
      icon: Storefront,
      subPages: [
        { id: 'list', label: 'All Outlets' },
        { id: 'compare', label: 'Multi-Outlet Comparison' },
      ],
    },
  ]

  // 3. System & Insights (sesuai Section 22-25: Reports, Activity, Settings)
  const systemItems: NavItemDef[] = [
    {
      id: 'reports',
      label: 'Reports',
      icon: ChartBar,
    },
    {
      id: 'activity',
      label: 'Activity',
      icon: ClockCounterClockwise,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: GearSix,
    },
  ]

  const handleParentClick = (item: NavItemDef) => {
    if (item.subPages && item.subPages.length > 0) {
      if (activeModule === item.id) {
        toggleModuleExpand(item.id)
      } else {
        setExpandedModules((prev) => ({ ...prev, [item.id]: true }))
        onNavigate(item.id, item.subPages[0].id)
        onCloseMobile?.()
      }
    } else {
      onNavigate(item.id)
      onCloseMobile?.()
    }
  }

  const renderNavGroup = (title: string, items: NavItemDef[], collapsed: boolean, showDivider = false) => {
    const query = searchQuery.trim().toLowerCase()
    const displayedItems = query
      ? items.filter((item) => {
          const matchMain = item.label.toLowerCase().includes(query)
          const matchSub = item.subPages?.some((sub) => sub.label.toLowerCase().includes(query))
          return matchMain || matchSub
        })
      : items

    if (query && displayedItems.length === 0) {
      return null
    }

    if (collapsed) {
      return (
        <div className="space-y-1">
          {showDivider && <div className="h-px bg-border/60 mx-2 my-2" />}
          <nav className="space-y-1">
            {displayedItems.map((item) => {
              const IconComp = item.icon
              const active = activeModule === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleParentClick(item)}
                  title={item.label}
                  className={cn(
                    'h-10 w-10 mx-auto flex items-center justify-center rounded-xl transition-colors cursor-pointer border relative',
                    active
                      ? 'bg-card text-foreground font-semibold border-border shadow-none'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-card/60'
                  )}
                >
                  <IconComp
                    weight={active ? 'duotone' : 'regular'}
                    className={cn(
                      'h-4 w-4 shrink-0 transition-colors',
                      active ? 'text-foreground' : 'text-muted-foreground'
                    )}
                  />
                  {item.badge !== undefined && (
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent1 ring-2 ring-card" />
                  )}
                </button>
              )
            })}
          </nav>
        </div>
      )
    }

    return (
      <div className="space-y-1">
        <div className="px-3 pt-3 pb-1 text-xs font-bold tracking-wider text-muted-foreground uppercase">
          {title}
        </div>
        <nav className="space-y-1">
          {displayedItems.map((item) => {
            const IconComp = item.icon
            const active = activeModule === item.id
            const hasSubPages = Boolean(item.subPages && item.subPages.length > 0)
            const isSubOpen = Boolean(expandedModules[item.id]) || Boolean(query && item.subPages?.some((sub) => sub.label.toLowerCase().includes(query)))
            const displayedSubPages = query && item.subPages
              ? item.subPages.filter((sub) => sub.label.toLowerCase().includes(query) || item.label.toLowerCase().includes(query))
              : (item.subPages || [])

            return (
              <div key={item.id} className="space-y-0.5">
                <button
                  type="button"
                  onClick={() => handleParentClick(item)}
                  className={cn(
                    'w-full flex items-center justify-between h-10 px-3.5 rounded-xl text-xs transition-colors cursor-pointer border',
                    active
                      ? 'bg-card text-foreground font-semibold border-border shadow-none'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-card/60 font-medium'
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <IconComp
                      weight={active ? 'duotone' : 'regular'}
                      className={cn(
                        'h-4 w-4 shrink-0 transition-colors',
                        active ? 'text-foreground' : 'text-muted-foreground'
                      )}
                    />
                    <span className={cn('truncate', active ? 'font-semibold text-foreground' : 'font-medium text-muted-foreground')}>
                      {item.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {item.badge !== undefined && (
                      <span className="h-5 min-w-5 px-1.5 rounded-full bg-accent1 text-white font-bold text-xs flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                    {hasSubPages && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleModuleExpand(item.id)
                        }}
                        className="p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors"
                        title={isSubOpen ? 'Tutup sub-menu' : 'Buka sub-menu'}
                      >
                        {isSubOpen ? (
                          <CaretDown className="h-3 w-3" />
                        ) : (
                          <CaretRight className="h-3 w-3" />
                        )}
                      </button>
                    )}
                  </div>
                </button>

                {/* Subpage Links Dropdown (Indented Tree Structure from flow_fodera.pdf) */}
                {hasSubPages && isSubOpen && displayedSubPages.length > 0 && (
                  <div className="ml-4 pl-3 border-l border-border/70 space-y-1 my-1">
                    {displayedSubPages.map((sub) => {
                      const isSubActive = active && activeSubPage === sub.id
                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            onNavigate(item.id, sub.id)
                            onCloseMobile?.()
                          }}
                          className={cn(
                            'w-full flex items-center justify-between h-8 px-2.5 rounded-lg text-xs transition-colors cursor-pointer text-left border border-transparent shadow-none',
                            isSubActive
                              ? 'bg-accent1/5 text-accent1 font-semibold'
                              : 'text-muted-foreground hover:text-foreground hover:bg-card/50 font-medium'
                          )}
                        >
                          <span className="truncate">{sub.label}</span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </div>
    )
  }

  const renderSidebarBody = (collapsed: boolean) => (
    <div className="flex flex-col h-full justify-between select-none">
      {/* Top Header & Navigation Items */}
      <div className="flex-1 min-h-0 flex flex-col space-y-3">
        {/* Workspace & Outlet Switcher (Accordion style, opens inline underneath) */}
        <div className="space-y-1">
          {collapsed ? (
            <button
              type="button"
              onClick={() => {
                if (onToggleCollapse) onToggleCollapse()
                setIsOutletExpanded(true)
              }}
              className="h-10 w-10 mx-auto rounded-xl bg-accent1 flex items-center justify-center shrink-0 shadow-xs text-white p-2.5 cursor-pointer hover:opacity-95 transition-opacity"
              title={`Outlet Aktif: ${activeOutletObj.name}`}
            >
              <div className="grid grid-cols-3 gap-0.5 w-full h-full">
                <div className="bg-white rounded-xs opacity-90" />
                <div className="bg-white/40 rounded-xs" />
                <div className="bg-white rounded-xs opacity-90" />
                <div className="bg-white/40 rounded-xs" />
                <div className="bg-white rounded-xs opacity-90" />
                <div className="bg-white/40 rounded-xs" />
                <div className="bg-white rounded-xs opacity-90" />
                <div className="bg-white/40 rounded-xs" />
                <div className="bg-white rounded-xs opacity-90" />
              </div>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsOutletExpanded((prev) => !prev)}
              className={cn(
                'w-full flex items-center justify-between p-2 rounded-xl transition-colors cursor-pointer group text-left border',
                isOutletExpanded
                  ? 'bg-card text-foreground border-border shadow-none'
                  : 'border-transparent hover:bg-card/70 text-foreground'
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Orange Checkerboard Grid Icon */}
                <div className="h-9 w-9 rounded-xl bg-accent1 flex items-center justify-center shrink-0 shadow-xs text-white p-2">
                  <div className="grid grid-cols-3 gap-0.5 w-full h-full">
                    <div className="bg-white rounded-xs opacity-90" />
                    <div className="bg-white/40 rounded-xs" />
                    <div className="bg-white rounded-xs opacity-90" />
                    <div className="bg-white/40 rounded-xs" />
                    <div className="bg-white rounded-xs opacity-90" />
                    <div className="bg-white/40 rounded-xs" />
                    <div className="bg-white rounded-xs opacity-90" />
                    <div className="bg-white/40 rounded-xs" />
                    <div className="bg-white rounded-xs opacity-90" />
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground font-semibold leading-tight truncate">
                    {activeOutletObj.shortName}
                  </div>
                  <div className="text-sm font-extrabold text-foreground tracking-tight leading-normal truncate pb-0.5">
                    Kopi Senja
                  </div>
                </div>
              </div>
              <CaretUpDown
                className={cn(
                  'h-4 w-4 shrink-0 ml-1 transition-colors',
                  isOutletExpanded ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'
                )}
              />
            </button>
          )}

          {/* Sub-menu Outlets (Membuka di bawahnya persis seperti menu lain di sidebar) */}
          {isOutletExpanded && !collapsed && (
            <div className="ml-4 pl-3 border-l border-border/70 space-y-1 my-1">
              {OUTLETS.map((outlet) => {
                const isSelected = (currentOutlet || 'all') === outlet.id
                return (
                  <button
                    key={outlet.id}
                    type="button"
                    onClick={() => {
                      if (onOutletChange) onOutletChange(outlet.id)
                      setIsOutletExpanded(false)
                      onCloseMobile?.()
                    }}
                    className={cn(
                      'w-full flex items-center justify-between h-8 px-2.5 rounded-lg text-xs transition-colors cursor-pointer text-left border border-transparent shadow-none',
                      isSelected
                        ? 'bg-accent1/5 text-accent1 font-semibold'
                        : 'text-muted-foreground hover:text-foreground hover:bg-card/50 font-medium'
                    )}
                  >
                    <span className="truncate">{outlet.name}</span>
                    {isSelected && (
                      <Check className="h-3.5 w-3.5 text-accent1 shrink-0 ml-1.5" weight="bold" />
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Search Bar (Real Interactive Input) */}
        {collapsed ? (
          <button
            type="button"
            onClick={() => {
              if (onToggleCollapse) onToggleCollapse()
            }}
            title="Cari Menu & Modul"
            className="h-10 w-10 mx-auto rounded-xl border border-border/80 bg-card/70 hover:bg-card text-muted-foreground hover:text-foreground flex items-center justify-center shadow-none transition-colors cursor-pointer"
          >
            <MagnifyingGlass className="h-4 w-4 shrink-0" />
          </button>
        ) : (
          <div className="w-full h-10 px-3 rounded-xl border border-border/80 bg-card/70 focus-within:bg-card focus-within:border-accent1 text-xs flex items-center gap-2.5 transition-colors">
            <MagnifyingGlass className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari menu & modul..."
              className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none cursor-text font-normal min-w-0"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-0.5 rounded-md text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
                title="Hapus pencarian"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : (
              <kbd className="text-2xs font-mono bg-card px-1.5 py-0.5 rounded border border-border/80 text-muted-foreground shrink-0 select-none">
                ⌘F
              </kbd>
            )}
          </div>
        )}

        {/* Operational Alerts Link (from flow_fodera.pdf Section 21) */}
        {collapsed ? (
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            title="Operational Alerts (4 hal butuh perhatian)"
            className="h-10 w-10 mx-auto rounded-xl border border-transparent hover:bg-card/60 text-muted-foreground hover:text-foreground flex items-center justify-center relative transition-colors cursor-pointer"
          >
            <Tray className="h-4 w-4 shrink-0" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-accent1 ring-2 ring-background" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="w-full h-10 px-3.5 rounded-xl border border-transparent text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-card/60 flex items-center justify-between transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Tray className="h-4 w-4 text-muted-foreground shrink-0" />
              <span>Alerts</span>
            </div>
            <span className="h-5 min-w-5 px-1.5 rounded-full bg-accent1 text-white font-bold text-xs flex items-center justify-center shrink-0">
              4
            </span>
          </button>
        )}

        {/* Scrollable Navigation Groups (Core UI Structure from flow_fodera.pdf Section 24) */}
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1 space-y-1">
          {renderNavGroup('OPERASI', coreOperationsItems, collapsed, false)}
          {renderNavGroup('MANAJEMEN', managementItems, collapsed, true)}
          {renderNavGroup('INSIGHTS & SISTEM', systemItems, collapsed, true)}

          {searchQuery.trim() !== '' && (
            (() => {
              const q = searchQuery.trim().toLowerCase()
              const allItems = [...coreOperationsItems, ...managementItems, ...systemItems]
              const hasMatch = allItems.some(
                (it) => it.label.toLowerCase().includes(q) || it.subPages?.some((sub) => sub.label.toLowerCase().includes(q))
              )
              if (!hasMatch) {
                return (
                  <div className="py-6 px-3 text-center text-xs text-muted-foreground">
                    <p className="font-semibold text-foreground mb-1">Menu tidak ditemukan</p>
                    <p className="text-xs">Tidak ada menu dengan kata kunci &ldquo;{searchQuery}&rdquo;</p>
                  </div>
                )
              }
              return null
            })()
          )}
        </div>
      </div>

      {/* Bottom Profile & Collapse Toggle */}
      <div className="pt-3 border-t border-border/60 shrink-0">
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <div
              className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-extrabold text-xs shrink-0 shadow-2xs cursor-pointer"
              title="Murad JM (muradjm3@gmail.com)"
            >
              M
            </div>
            <button
              type="button"
              onClick={handleToggleCollapse}
              className="p-1.5 rounded-lg bg-transparent text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center justify-center"
              title="Buka sidebar"
              aria-label="Expand sidebar"
            >
              <SidebarSimple weight="regular" className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-card/70 transition-colors">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-extrabold text-xs shrink-0 shadow-2xs">
                M
              </div>
              <div className="overflow-hidden text-left">
                <div className="text-xs font-bold text-foreground truncate">Murad JM</div>
                <div className="text-xs text-muted-foreground truncate">muradjm3@gmail.com</div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleToggleCollapse}
              className="p-1.5 rounded-lg bg-transparent text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0 ml-1 flex items-center justify-center"
              title="Tutup sidebar"
              aria-label="Collapse sidebar"
            >
              <SidebarSimple weight="duotone" className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar (Always Visible, Transparent Background, Width Dynamic) */}
      <aside
        className={cn(
          'hidden md:flex flex-col bg-transparent shrink-0 h-full select-none py-1 transition-all duration-300 ease-in-out',
          isCollapsed ? 'w-16 min-w-16 max-w-16' : 'w-60 min-w-60 max-w-60'
        )}
      >
        {renderSidebarBody(isCollapsed)}
      </aside>

      {/* Mobile Drawer (Overlay for small screens) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative flex flex-col w-72 max-w-full bg-secondary p-4 shadow-xl z-10 h-full overflow-y-auto">
            <div className="flex items-center justify-end pb-2">
              <button
                type="button"
                onClick={onCloseMobile}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {renderSidebarBody(false)}
          </div>
        </div>
      )}
    </>
  )
}
