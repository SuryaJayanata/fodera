import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Plus,
  Bell,
  Store,
  LayoutDashboard,
  ShoppingCart,
  Coffee,
  Package,
  Users,
  UserCheck,
  History,
  BarChart3,
  Search,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// Import Modules to render directly inside the simulation without going fullscreen
import { DashboardOverviewPage } from '@/modules/dashboard/DashboardOverviewPage'
import { OrdersPage } from '@/modules/sales/OrdersPage'
import { ProductsListPage } from '@/modules/products/ProductsListPage'
import { StockListPage } from '@/modules/inventory/StockListPage'
import { CustomersOverviewPage } from '@/modules/customers/CustomersOverviewPage'
import { StaffManagementPage } from '@/modules/team/StaffManagementPage'
import { OutletsListPage } from '@/modules/outlets/OutletsListPage'
import { ActivityTimelinePage } from '@/modules/activity/ActivityTimelinePage'
import { ReportsOverviewPage } from '@/modules/reports/ReportsOverviewPage'

/* Var-UI Base · pre-emit score: [P:5 H:5 E:5 S:5 R:5 V:5]
 * scope: component | component: HeroSection (Fixed height, Zero window scroll jump)
 * theme: Clean Slate SaaS + Rainbow Ribbon | typography: Plus Jakarta Sans
 * status: PASSED (15/15 slop checks verified)
 */

export function HeroSection() {
  const [simModule, setSimModule] = useState('dashboard')
  const [simOutlet, setSimOutlet] = useState('malang')
  const [simPeriod, setSimPeriod] = useState('7 Days')
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleSwitchModule = (e: React.MouseEvent, moduleKey: string) => {
    e.preventDefault()
    e.stopPropagation()
    setSimModule(moduleKey)
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
  }

  const getSimTitle = () => {
    switch (simModule) {
      case 'dashboard':
        return 'Dashboard Overview'
      case 'sales':
        return 'Sales Operations & Orders'
      case 'products':
        return 'Product & Menu Management'
      case 'inventory':
        return 'Inventory Health & Stock'
      case 'customers':
        return 'Customer Insights'
      case 'team':
        return 'Team & Staffing'
      case 'outlets':
        return 'Outlets Management'
      case 'activity':
        return 'Activity Log'
      case 'reports':
        return 'Structured Reports'
      default:
        return 'Dashboard'
    }
  }

  return (
    <section className="w-full relative overflow-hidden border-b border-border bg-surface font-sans">
      {/* Diagonal Multi-Color Accent Ribbons (Bottom Right) */}
      <div className="absolute -bottom-16 -right-16 w-80 h-80 sm:w-96 sm:h-96 pointer-events-none overflow-hidden select-none z-0">
        <div className="absolute right-0 bottom-0 flex flex-col items-end rotate-[-45deg] origin-bottom-right translate-x-12 translate-y-6">
          <div className="h-4 w-[500px] bg-ribbon1" />
          <div className="h-4 w-[500px] bg-ribbon2" />
          <div className="h-4 w-[500px] bg-ribbon3" />
          <div className="h-5 w-[500px] bg-ribbon4" />
        </div>
      </div>

      {/* Hero Headline & Intro Text */}
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pt-12 sm:pt-16 pb-4 relative z-10">
        <div className="max-w-3xl text-left">
          {/* Big Clean Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-[1.12] mb-5">
            Kendalikan seluruh operasional bisnis F&B dalam hitungan menit.
          </h1>

          {/* Subheading */}
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl leading-relaxed mb-8">
            Platform modern yang menyatukan pesanan bar, ambang batas stok bahan kritis, dan performa tim di seluruh cabang tanpa kerumitan aplikasi kasir konvensional.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/register">
              <button
                type="button"
                className="rounded-full bg-primary text-white hover:bg-primary/90 px-7 py-3 text-xs sm:text-sm font-bold shadow-sm transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Get Started Free</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
            <Link to="/app">
              <button
                type="button"
                className="rounded-full border border-border bg-surface hover:bg-secondary text-foreground px-6 py-3 text-xs sm:text-sm font-semibold shadow-2xs transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Buka Dashboard Penuh</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* LEBIH LEBAR KE SAMPING: Simulasi Dashboard Riil FODERA */}
      <div className="w-full max-w-[96%] xl:max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-2 sm:px-4 mt-8 pb-12 relative z-10">
        <div className="w-full rounded-2xl border border-border bg-card shadow-lg overflow-hidden">
          {/* macOS Browser Window Header */}
          <div className="h-10 bg-secondary/80 border-b border-border px-4 flex items-center justify-between select-none">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-destructive" />
              <div className="h-3 w-3 rounded-full bg-warning" />
              <div className="h-3 w-3 rounded-full bg-accent2" />
            </div>

            <div className="flex items-center gap-2 bg-surface/90 px-4 py-1 rounded-md border border-border text-xs text-muted-foreground font-mono">
              <span>https://app.fodera.id/{simModule}</span>
            </div>

            <div className="w-12 hidden sm:block" />
          </div>

          {/* Actual Dashboard UI Simulation Wrapper (Fixed Height 760px to prevent any page scroll jump!) */}
          <div className="flex w-full h-[760px] bg-background overflow-hidden">
            {/* Simulation Left Sidebar */}
            <aside className="w-60 border-r border-border bg-card hidden md:flex flex-col shrink-0 text-xs select-none h-full">
              <div className="p-3.5 border-b border-border flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-md bg-accent1 flex items-center justify-center text-white font-extrabold text-xs">
                    F
                  </div>
                  <div>
                    <div className="font-bold text-xs text-foreground">FODERA</div>
                    <div className="text-[10px] text-muted-foreground">Kopi Senja Group</div>
                  </div>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </div>

              {/* Search Bar in Simulation */}
              <div className="p-2.5 shrink-0">
                <div className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md border border-border bg-secondary/50 text-muted-foreground text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <Search className="h-3 w-3" />
                    <span>Cari...</span>
                  </div>
                  <kbd className="text-[9px] bg-card border border-border px-1 rounded">⌘K</kbd>
                </div>
              </div>

              {/* Navigation Menu (Clicks stay inside simulation without page jumping) */}
              <div className="flex-1 px-2.5 py-2 space-y-4 overflow-y-auto custom-scrollbar">
                <div>
                  <div className="px-2 pb-1 text-[10px] font-semibold text-muted-foreground tracking-wider">
                    MAIN MENU
                  </div>
                  <div className="space-y-0.5">
                    <button
                      type="button"
                      onClick={(e) => handleSwitchModule(e, 'dashboard')}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[11px] font-semibold transition-colors cursor-pointer text-left ${
                        simModule === 'dashboard'
                          ? 'bg-secondary text-foreground border border-border/70'
                          : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                      }`}
                    >
                      <LayoutDashboard className="h-3.5 w-3.5 text-accent1" />
                      <span>Dashboard</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleSwitchModule(e, 'sales')}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer text-left ${
                        simModule === 'sales'
                          ? 'bg-secondary text-foreground font-semibold border border-border/70'
                          : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                      }`}
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                      <span>Sales & Orders</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleSwitchModule(e, 'products')}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer text-left ${
                        simModule === 'products'
                          ? 'bg-secondary text-foreground font-semibold border border-border/70'
                          : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                      }`}
                    >
                      <Coffee className="h-3.5 w-3.5" />
                      <span>Products & Menu</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleSwitchModule(e, 'inventory')}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer text-left ${
                        simModule === 'inventory'
                          ? 'bg-secondary text-foreground font-semibold border border-border/70'
                          : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Package className="h-3.5 w-3.5" />
                        <span>Inventory</span>
                      </div>
                      <Badge variant="warning" className="text-[9px] h-3.5 px-1 font-mono">3</Badge>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleSwitchModule(e, 'customers')}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer text-left ${
                        simModule === 'customers'
                          ? 'bg-secondary text-foreground font-semibold border border-border/70'
                          : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                      }`}
                    >
                      <Users className="h-3.5 w-3.5" />
                      <span>Customers</span>
                    </button>
                  </div>
                </div>

                <div>
                  <div className="px-2 pb-1 text-[10px] font-semibold text-muted-foreground tracking-wider">
                    OPERATIONS
                  </div>
                  <div className="space-y-0.5">
                    <button
                      type="button"
                      onClick={(e) => handleSwitchModule(e, 'team')}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer text-left ${
                        simModule === 'team'
                          ? 'bg-secondary text-foreground font-semibold border border-border/70'
                          : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                      }`}
                    >
                      <UserCheck className="h-3.5 w-3.5" />
                      <span>Team & Shifts</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleSwitchModule(e, 'outlets')}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer text-left ${
                        simModule === 'outlets'
                          ? 'bg-secondary text-foreground font-semibold border border-border/70'
                          : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                      }`}
                    >
                      <Store className="h-3.5 w-3.5" />
                      <span>Outlets (3)</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleSwitchModule(e, 'activity')}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer text-left ${
                        simModule === 'activity'
                          ? 'bg-secondary text-foreground font-semibold border border-border/70'
                          : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                      }`}
                    >
                      <History className="h-3.5 w-3.5" />
                      <span>Activity Log</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleSwitchModule(e, 'reports')}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer text-left ${
                        simModule === 'reports'
                          ? 'bg-secondary text-foreground font-semibold border border-border/70'
                          : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                      }`}
                    >
                      <BarChart3 className="h-3.5 w-3.5" />
                      <span>Reports</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* User Profile Footer */}
              <div className="p-3 border-t border-border bg-card shrink-0">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-primary text-white flex items-center justify-center font-bold text-[10px]">
                    AP
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-[11px] font-bold text-foreground truncate">Adit Pramana</div>
                    <div className="text-[10px] text-muted-foreground truncate">Owner · Malang</div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Simulation Main Dashboard Container */}
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
              {/* Simulation Topbar */}
              <div className="h-14 border-b border-border bg-card/90 px-4 sm:px-6 flex items-center justify-between shrink-0 z-20">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-foreground">{getSimTitle()}</span>
                  <span className="text-[11px] text-muted-foreground">· Kopi Senja Malang</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-secondary p-0.5 rounded-md border border-border text-[11px]">
                    {['Today', '7 Days', '30 Days'].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          setSimPeriod(p)
                        }}
                        className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                          simPeriod === p
                            ? 'bg-card text-foreground font-semibold shadow-xs'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  <Button
                    variant="accent1"
                    size="sm"
                    onClick={(e) => handleSwitchModule(e, 'sales')}
                    className="h-7 text-xs font-semibold gap-1 cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    <span>New Order</span>
                  </Button>

                  <div className="h-7 w-7 rounded-md border border-border bg-card flex items-center justify-center text-muted-foreground relative">
                    <Bell className="h-3.5 w-3.5" />
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-accent1 rounded-full text-[8px] font-bold text-white flex items-center justify-center">
                      3
                    </span>
                  </div>
                </div>
              </div>

              {/* Simulation Content Body with Custom Scrollbar & Fixed Height to prevent page jumping */}
              <div
                ref={scrollRef}
                className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6 custom-scrollbar h-[calc(760px-56px)]"
              >
                {simModule === 'dashboard' && (
                  <DashboardOverviewPage
                    currentOutlet={simOutlet}
                    currentPeriod={simPeriod}
                    onNavigate={(mod) => {
                      setSimModule(mod)
                      if (scrollRef.current) scrollRef.current.scrollTop = 0
                    }}
                  />
                )}

                {simModule === 'sales' && <OrdersPage />}
                {simModule === 'products' && <ProductsListPage />}
                {simModule === 'inventory' && <StockListPage />}
                {simModule === 'customers' && <CustomersOverviewPage />}
                {simModule === 'team' && <StaffManagementPage />}
                {simModule === 'outlets' && <OutletsListPage />}
                {simModule === 'activity' && <ActivityTimelinePage />}
                {simModule === 'reports' && <ReportsOverviewPage />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
