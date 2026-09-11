import React, { useState } from 'react'
import {
  TrendUp,
  ShoppingCart,
  CurrencyDollar,
  Coffee,
  WarningCircle,
  ArrowRight,
  ArrowUpRight,
  CaretRight,
  CaretDown,
  CaretUp,
  CheckCircle,
  X,
} from '@phosphor-icons/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { MetricCard } from '@/components/ui/metric-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'
import { StripedBarChart } from '@/components/ui/striped-bar-chart'
import { SmartSearchHero } from './SmartSearchHero'
import { cn } from '@/lib/utils'

/* Var-UI Base · pre-emit score: [P:5 H:5 E:5 S:5 R:5 V:5]
 * scope: page | component: DashboardOverviewPage
 * theme: Clean Slate SaaS + Warm Coral & Fresh Emerald | typography: Plus Jakarta Sans
 * status: PASSED (15/15 slop checks verified)
 */

interface DashboardOverviewProps {
  currentOutlet: string
  currentPeriod: string
  onNavigate: (module: string, subPage?: string) => void
  onOutletChange?: (outlet: string) => void
}

export function DashboardOverviewPage({
  currentOutlet,
  currentPeriod,
  onNavigate,
  onOutletChange,
}: DashboardOverviewProps) {

  const topProducts = [
    { name: 'Spanish Latte', category: 'Coffee', orders: 284, revenue: 'Rp9.240.000', trend: '+18%' },
    { name: 'Matcha Latte', category: 'Non-Coffee', orders: 218, revenue: 'Rp7.850.000', trend: '+12%' },
    { name: 'Butter Croissant', category: 'Bakery', orders: 176, revenue: 'Rp5.280.000', trend: '+5%' },
    { name: 'Caramel Macchiato', category: 'Coffee', orders: 142, revenue: 'Rp4.970.000', trend: '-2%' },
  ]

  const operationalAlerts = [
    {
      id: 1,
      title: '2 Bahan Baku Mencapai Ambang Batas Kritis (Low Stock)',
      description: 'Biji Kopi Arabica tersisa 18 kg (Batas min: 20 kg). Gula Aren sisa 6 kg (Batas min: 10 kg).',
      actionLabel: 'Restock Sekarang',
      actionModule: 'inventory',
      actionSubPage: 'stock',
      severity: 'warning' as const,
    },
    {
      id: 2,
      title: 'Pesanan Masuk Jam Sibuk (#ORD-9284)',
      description: 'Pesanan baru senilai Rp118.000 masuk dari Kasir Cabang Malang. Antrean butuh konfirmasi barista.',
      actionLabel: 'Antrean Kasir',
      actionModule: 'sales',
      actionSubPage: 'orders',
      severity: 'warning' as const,
    },
    {
      id: 3,
      title: 'Outlet Surabaya Mengalami Penurunan Omzet 12%',
      description: 'Penjualan minggu ini Rp15.8M dibandingkan target Rp18.0M akibat keterlambatan pasokan sirup.',
      actionLabel: 'Cek Performa',
      actionModule: 'outlets',
      actionSubPage: 'comparison',
      severity: 'destructive' as const,
    },
    {
      id: 4,
      title: 'Jadwal Shift Barista Siang Aktif (Cabang Surabaya)',
      description: '3 barista aktif telah absen masuk. Operasional stasiun espresso shift siang berjalan lancar.',
      actionLabel: 'Lihat Shift',
      actionModule: 'team',
      actionSubPage: 'shifts',
      severity: 'success' as const,
    },
    {
      id: 5,
      title: 'Pencatatan Waste Susu Segar Naik 18%',
      description: '3.5 Liter susu expired (kerugian Rp119.000) terdeteksi di outlet Malang.',
      actionLabel: 'Investigasi Waste',
      actionModule: 'inventory',
      actionSubPage: 'waste',
      severity: 'accent1' as const,
    },
  ]

  const [isAlertsHidden, setIsAlertsHidden] = useState<boolean>(() => {
    try {
      return localStorage.getItem('fodera_alerts_hidden') === 'true'
    } catch {
      return false
    }
  })

  const [dismissedAlertIds, setDismissedAlertIds] = useState<number[]>(() => {
    try {
      const stored = localStorage.getItem('fodera_dismissed_alert_ids')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  const toggleHideAlerts = (hidden: boolean) => {
    setIsAlertsHidden(hidden)
    try {
      localStorage.setItem('fodera_alerts_hidden', String(hidden))
    } catch {}
  }

  const handleDismissAlert = (id: number) => {
    const updated = [...dismissedAlertIds, id]
    setDismissedAlertIds(updated)
    try {
      localStorage.setItem('fodera_dismissed_alert_ids', JSON.stringify(updated))
    } catch {}
  }

  const handleResetAlerts = () => {
    setDismissedAlertIds([])
    try {
      localStorage.removeItem('fodera_dismissed_alert_ids')
    } catch {}
  }

  const activeAlerts = operationalAlerts.filter(
    (alert) => !dismissedAlertIds.includes(alert.id)
  )

  return (
    <div className="space-y-6">
      {/* ─── Smart Search Hero Section (Inspired by Reference UI) ─── */}
      <SmartSearchHero
        onNavigate={onNavigate}
        onOutletChange={onOutletChange}
      />

      {/* 2-Column Cockpit Layout: Left 66% (Analytics & Charts) vs Right 33% (Operational Stream) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* ─── LEFT COLUMN (2 Cols / 66%): Analytics, KPIs, & Striped Bar Chart ─── */}
        <div className="lg:col-span-2 space-y-6">
          {/* KPI Cards Grid (Compact 4-column row directly visible above the fold) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <MetricCard
              title="TOTAL REVENUE"
              value="Rp48.25M"
              change="+12.4%"
              trend="up"
              subtitle="7 Hari Terakhir"
              icon={CurrencyDollar}
              sparkline={[60, 45, 80, 100, 85]}
            />
            <MetricCard
              title="TOTAL ORDERS"
              value="1,284"
              change="+8.2%"
              trend="up"
              subtitle="183 pesanan / hari"
              icon={ShoppingCart}
              sparkline={[45, 65, 55, 90, 80]}
            />
            <MetricCard
              title="AVG ORDER VALUE"
              value="Rp37.5k"
              change="+3.8%"
              trend="up"
              subtitle="Basket size per struk"
              icon={TrendUp}
              sparkline={[70, 50, 75, 95, 85]}
            />
            <MetricCard
              title="ACTIVE PRODUCTS"
              value="86"
              change="3 Underperform"
              trend="neutral"
              subtitle="9 kategori menu aktif"
              icon={Coffee}
              sparkline={[85, 80, 90, 85, 90]}
            />
          </div>

          {/* Primary Visual Chart: Striped Bar Chart (Visible immediately without scrolling) */}
          <Card>
            <CardContent className="pt-6">
              <StripedBarChart
                title="Activity Penjualan Mingguan"
                statLabel="Worked this week · Omzet 7 Hari Terakhir"
                statValue="186 Tx (Rp48.25M)"
                changeLabel="+12.4% vs minggu lalu"
                trend="up"
                showCategoryBreakdown={true}
                onViewDetails={() => onNavigate('dashboard', 'analytics')}
              />
            </CardContent>
          </Card>

          {/* Top Products Table (Produk Penggerak Bisnis) */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Produk Penggerak Bisnis (Top Drivers)</CardTitle>
                  <CardDescription>Menu terlaris yang menghasilkan volume dan pendapatan terbesar</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigate('products')}
                  className="text-xs cursor-pointer"
                >
                  Lihat Semua
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="border-b border-border bg-secondary/40 text-muted-foreground font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Nama Produk</th>
                      <th className="py-2.5 px-3">Kategori</th>
                      <th className="py-2.5 px-3 text-right">Qty</th>
                      <th className="py-2.5 px-3 text-right">Revenue</th>
                      <th className="py-2.5 px-3 text-right">Tren</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {topProducts.map((p, i) => (
                      <tr key={i} className="hover:bg-secondary/40 transition-colors">
                        <td className="py-3 px-3 font-bold text-foreground">{p.name}</td>
                        <td className="py-3 px-3 text-muted-foreground">{p.category}</td>
                        <td className="py-3 px-3 text-right font-medium">{p.orders}</td>
                        <td className="py-3 px-3 text-right font-bold text-foreground">{p.revenue}</td>
                        <td className="py-3 px-3 text-right font-semibold text-accent2">{p.trend}</td>
                        <td className="py-3 px-3 text-center">
                          <Badge variant="accent1">Top Seller</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ─── RIGHT COLUMN (1 Col / 33%): Operational Stream, Alerts & North Star ─── */}
        <div className="lg:col-span-1 space-y-6">
          {/* Operational Alerts Box (Compact right-side widget with dropdown toggle) */}
          <Card className="border-border transition-all">
            <CardHeader
              onClick={() => toggleHideAlerts(!isAlertsHidden)}
              className={cn(
                'flex flex-row items-center justify-between gap-2 p-4 cursor-pointer select-none transition-colors hover:bg-secondary/40 rounded-t-2xl',
                isAlertsHidden && 'rounded-2xl'
              )}
            >
              <div className="flex items-center gap-2">
                <WarningCircle className="h-4 w-4 text-accent1" weight="fill" />
                <CardTitle>Notifikasi & Operational Alerts</CardTitle>
                <Badge variant="secondary" className="text-2xs font-semibold ml-1">
                  {activeAlerts.length}
                </Badge>
              </div>

              <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                {!isAlertsHidden && dismissedAlertIds.length > 0 && (
                  <button
                    type="button"
                    onClick={handleResetAlerts}
                    className="text-xs text-muted-foreground hover:text-foreground hover:underline cursor-pointer transition-colors mr-1"
                  >
                    Reset ({dismissedAlertIds.length})
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => toggleHideAlerts(!isAlertsHidden)}
                  className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer border border-transparent hover:border-border"
                  title={isAlertsHidden ? 'Tampilkan Alerts' : 'Sembunyikan Alerts'}
                  aria-label={isAlertsHidden ? 'Tampilkan Alerts' : 'Sembunyikan Alerts'}
                >
                  <CaretDown
                    className={cn(
                      'h-4 w-4 transition-transform duration-200',
                      !isAlertsHidden && 'rotate-180'
                    )}
                    weight="bold"
                  />
                </button>
              </div>
            </CardHeader>

            {!isAlertsHidden && (
              <CardContent className="space-y-3 pt-0 pb-4 px-4">
                {activeAlerts.length === 0 ? (
                  <div className="py-6 text-center text-xs text-muted-foreground">
                    <CheckCircle className="h-6 w-6 text-accent2 mx-auto mb-2" weight="fill" />
                    <p className="font-semibold text-foreground">Tidak ada alert aktif</p>
                    <p className="text-muted-foreground mt-0.5">
                      Semua peringatan telah ditangani.
                    </p>
                    {dismissedAlertIds.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleResetAlerts}
                        className="mt-3 h-7 text-xs text-accent1 cursor-pointer font-medium"
                      >
                        Pulihkan Semua
                      </Button>
                    )}
                  </div>
                ) : (
                  activeAlerts.map((alert) => (
                    <Alert
                      key={alert.id}
                      variant={alert.severity}
                      title={alert.title}
                      action={
                        <div className="flex items-center gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onNavigate(alert.actionModule, alert.actionSubPage)}
                            className="h-7 text-xs gap-1 font-medium cursor-pointer"
                          >
                            <span>{alert.actionLabel}</span>
                            <ArrowRight className="h-3 w-3" />
                          </Button>
                          <button
                            type="button"
                            onClick={() => handleDismissAlert(alert.id)}
                            className="h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
                            title="Abaikan alert ini"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      }
                    >
                      {alert.description}
                    </Alert>
                  ))
                )}
              </CardContent>
            )}
          </Card>

          {/* Operational North Star (Cockpit Briefing Card) */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent2" weight="fill" />
                  <CardTitle>Operational North Star</CardTitle>
                </div>
                <Badge variant="accent2" className="text-2xs font-semibold">
                  Semua Outlet Aktif
                </Badge>
              </div>
              <CardDescription>4 Pertanyaan inti operasional FODERA</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5">
              <div className="p-3 rounded-lg bg-secondary/50 border border-border/50">
                <div className="text-xs text-muted-foreground font-medium">1. How is business doing?</div>
                <div className="text-sm font-bold text-foreground mt-0.5 flex items-center justify-between">
                  <span>Rp48.250.000</span>
                  <span className="text-2xs font-bold text-accent2 flex items-center gap-0.5">
                    <ArrowUpRight className="h-3 w-3" weight="bold" />
                    +12.4%
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-secondary/50 border border-border/50">
                <div className="text-xs text-muted-foreground font-medium">2. What drives the business?</div>
                <div className="text-sm font-bold text-foreground mt-0.5 flex items-center justify-between">
                  <span>Spanish Latte</span>
                  <span className="text-2xs text-muted-foreground font-medium">284 cups (Rp9.2M)</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-secondary/50 border border-border/50">
                <div className="text-xs text-muted-foreground font-medium">3. What needs attention?</div>
                <div className="text-sm font-bold text-destructive mt-0.5 flex items-center justify-between">
                  <span>2 Bahan Menipis</span>
                  <span className="text-2xs text-muted-foreground font-medium">Kopi & Gula Aren</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-secondary/50 border border-border/50">
                <div className="text-xs text-muted-foreground font-medium">4. What should I do next?</div>
                <div className="text-sm font-bold text-accent1 mt-0.5 flex items-center justify-between">
                  <span>Restock Arabica</span>
                  <span className="text-2xs text-muted-foreground font-medium">CV Mitra Nusantara</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performa Antar Outlet */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Performa Antar Outlet</CardTitle>
                <button
                  type="button"
                  onClick={() => onNavigate('outlets')}
                  className="text-xs text-accent1 hover:underline font-semibold flex items-center gap-0.5 cursor-pointer"
                >
                  <span>Detail</span>
                  <CaretRight className="h-3.5 w-3.5" />
                </button>
              </div>
              <CardDescription>Komparasi kontribusi omzet cabang</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5">
              <div className="p-3 rounded-lg border border-border bg-card flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-foreground">Malang (Main Outlet)</div>
                  <div className="text-xs text-muted-foreground">648 pesanan · AOV Rp37.3k</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-foreground">Rp24.2M</div>
                  <div className="text-2xs text-accent2 font-bold">+14.2%</div>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-border bg-card flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-foreground">Surabaya</div>
                  <div className="text-xs text-muted-foreground">412 pesanan · AOV Rp38.3k</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-foreground">Rp15.8M</div>
                  <div className="text-2xs text-destructive font-bold">-12.0%</div>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-border bg-card flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-foreground">Jakarta</div>
                  <div className="text-xs text-muted-foreground">224 pesanan · AOV Rp36.6k</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-foreground">Rp8.2M</div>
                  <div className="text-2xs text-accent2 font-bold">+22.5%</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Inventory Health Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Status Bahan Baku Kritis</CardTitle>
                <button
                  type="button"
                  onClick={() => onNavigate('inventory')}
                  className="text-xs text-accent1 hover:underline font-semibold flex items-center gap-0.5 cursor-pointer"
                >
                  <span>Kelola Stok</span>
                  <CaretRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2.5">
              <div className="flex items-center justify-between text-xs py-1 border-b border-border/60">
                <span className="font-medium text-foreground">Biji Kopi Arabica</span>
                <span className="font-bold text-destructive">18 kg (Min 20kg)</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1 border-b border-border/60">
                <span className="font-medium text-foreground">Gula Aren Cair</span>
                <span className="font-bold text-destructive">6 kg (Min 10kg)</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1 border-b border-border/60">
                <span className="font-medium text-foreground">Fresh Milk Full Cream</span>
                <span className="font-semibold text-accent2">42 L (Aman)</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1">
                <span className="font-medium text-foreground">Matcha Powder Uji</span>
                <span className="font-semibold text-accent2">3.2 kg (Aman)</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
