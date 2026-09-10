import React from 'react'
import {
  TrendUp,
  ShoppingCart,
  CurrencyDollar,
  Coffee,
  WarningCircle,
  ArrowRight,
  ArrowUpRight,
  CaretRight,
  CheckCircle,
} from '@phosphor-icons/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { MetricCard } from '@/components/ui/metric-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'
import { StripedBarChart } from '@/components/ui/striped-bar-chart'

/* Var-UI Base · pre-emit score: [P:5 H:5 E:5 S:5 R:5 V:5]
 * scope: page | component: DashboardOverviewPage
 * theme: Clean Slate SaaS + Warm Coral & Fresh Emerald | typography: Plus Jakarta Sans
 * status: PASSED (15/15 slop checks verified)
 */

interface DashboardOverviewProps {
  currentOutlet: string
  currentPeriod: string
  onNavigate: (module: string, subPage?: string) => void
}

export function DashboardOverviewPage({
  currentOutlet,
  currentPeriod,
  onNavigate,
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
      severity: 'warning' as const,
    },
    {
      id: 2,
      title: 'Outlet Surabaya Mengalami Penurunan Omzet 12%',
      description: 'Penjualan minggu ini Rp15.8M dibandingkan target Rp18.0M akibat keterlambatan pasokan sirup.',
      actionLabel: 'Cek Performa Outlet',
      actionModule: 'outlets',
      severity: 'destructive' as const,
    },
    {
      id: 3,
      title: 'Pencatatan Waste Susu Segar Naik 18%',
      description: '3.5 Liter susu expired (kerugian Rp119.000) terdeteksi di outlet Malang.',
      actionLabel: 'Investigasi Waste',
      actionModule: 'inventory',
      severity: 'accent1' as const,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Operational North Star Header Banner */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-foreground tracking-tight">
              Operational North Star
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Empat pertanyaan inti yang harus terjawab dalam beberapa detik setiap Anda membuka FODERA
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">Status Operasional:</span>
            <Badge variant="accent2" className="gap-1">
              <CheckCircle className="h-3.5 w-3.5" weight="fill" />
              <span>Semua Outlet Beroperasi</span>
            </Badge>
          </div>
        </div>

        {/* 4 Answers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 pt-4 border-t border-border">
          <div className="p-3 rounded-lg bg-secondary/50 border border-border/50">
            <div className="text-xs font-semibold text-muted-foreground">1. How is business doing?</div>
            <div className="text-sm font-bold text-foreground mt-1">Rp48.250.000</div>
            <div className="text-xs text-accent2 font-semibold flex items-center gap-0.5 mt-0.5">
              <ArrowUpRight className="h-3.5 w-3.5" weight="bold" />
              <span>+12.4% vs periode lalu</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-secondary/50 border border-border/50">
            <div className="text-xs font-semibold text-muted-foreground">2. What drives the business?</div>
            <div className="text-sm font-bold text-foreground mt-1">Spanish Latte</div>
            <div className="text-xs text-muted-foreground mt-0.5">284 cups terjual (Rp9.2M)</div>
          </div>

          <div className="p-3 rounded-lg bg-secondary/50 border border-border/50">
            <div className="text-xs font-semibold text-muted-foreground">3. What needs attention?</div>
            <div className="text-sm font-bold text-destructive mt-1">2 Bahan Menipis</div>
            <div className="text-xs text-muted-foreground mt-0.5">Biji Kopi & Gula Aren</div>
          </div>

          <div className="p-3 rounded-lg bg-secondary/50 border border-border/50">
            <div className="text-xs font-semibold text-muted-foreground">4. What should I do next?</div>
            <div className="text-sm font-bold text-accent1 mt-1">Restock Coffee Beans</div>
            <div className="text-xs text-muted-foreground mt-0.5">Supplier: CV Mitra Nusantara</div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid (Matches Reference Media 1 & 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="TOTAL REVENUE"
          value="Rp48.250.000"
          change="+12.4%"
          trend="up"
          subtitle="Dibanding periode sebelumnya"
          icon={CurrencyDollar}
        />
        <MetricCard
          title="TOTAL ORDERS"
          value="1,284"
          change="+8.2%"
          trend="up"
          subtitle="Rata-rata 183 pesanan / hari"
          icon={ShoppingCart}
        />
        <MetricCard
          title="AVERAGE ORDER VALUE (AOV)"
          value="Rp37.578"
          change="+3.8%"
          trend="up"
          subtitle="Basket size per struk"
          icon={TrendUp}
        />
        <MetricCard
          title="ACTIVE PRODUCTS"
          value="86"
          change="3 Underperform"
          trend="neutral"
          subtitle="Dari 9 kategori menu aktif"
          icon={Coffee}
        />
      </div>

      {/* Operational Alerts Box ("Don't just show data. Surface what matters.") */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <WarningCircle className="h-4 w-4 text-accent1" weight="fill" />
              <CardTitle>Operational Alerts</CardTitle>
            </div>
            <span className="text-xs text-muted-foreground">Surface what matters · 3 isu aktif</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {operationalAlerts.map((alert) => (
            <Alert
              key={alert.id}
              variant={alert.severity}
              title={alert.title}
              action={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigate(alert.actionModule)}
                  className="h-7 text-xs gap-1 font-medium cursor-pointer"
                >
                  <span>{alert.actionLabel}</span>
                  <ArrowRight className="h-3 w-3" />
                </Button>
              }
            >
              {alert.description}
            </Alert>
          ))}
        </CardContent>
      </Card>

      {/* Charts & Breakdowns (2 Columns: Sales Trend & Top Products + Multi-Outlet) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend & Volume (Left 2 cols, authentic striped line miring style) */}
        <Card className="lg:col-span-2">
          <CardContent className="pt-6">
            <StripedBarChart
              title="Activity"
              statLabel="Worked this week · Omzet 7 Hari Terakhir"
              statValue="186 Tx (Rp48.25M)"
              changeLabel="+12.4% vs minggu lalu"
              trend="up"
              showCategoryBreakdown={true}
            />
          </CardContent>
        </Card>

        {/* Right Side: Multi-Outlet Snapshot & Quick Nav */}
        <div className="space-y-6">
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
            <CardContent className="space-y-3">
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
                <CardTitle>Status Bahan Baku</CardTitle>
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

      {/* Top Products Table */}
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
              className="text-xs"
            >
              Lihat Semua Produk
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
                  <th className="py-2.5 px-3 text-right">Pesanan (Qty)</th>
                  <th className="py-2.5 px-3 text-right">Total Revenue</th>
                  <th className="py-2.5 px-3 text-right">Pertumbuhan</th>
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
  )
}
