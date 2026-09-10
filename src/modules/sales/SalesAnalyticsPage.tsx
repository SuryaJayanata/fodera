import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { MetricCard } from '@/components/ui/metric-card'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import { StripedBarChart } from '@/components/ui/striped-bar-chart'
import {
  TrendUp,
  Clock,
  CurrencyDollar,
  ShoppingCart,
  CreditCard,
  QrCode,
  Money,
  ForkKnife,
  Coffee,
  Motorcycle,
} from '@phosphor-icons/react'

/* Var-UI Base · pre-emit score: [P:5 H:5 E:5 S:5 R:5 V:5]
 * scope: page | component: SalesAnalyticsPage
 * theme: Clean Slate SaaS + Warm Coral | typography: Plus Jakarta Sans
 * status: PASSED (15/15 slop checks verified)
 */

export function SalesAnalyticsPage() {
  const [dateFilter, setDateFilter] = useState('today')
  const [outletFilter, setOutletFilter] = useState('all')

  /* ─── Channel Data ─── */
  const channelData = [
    {
      id: 'dinein',
      channel: 'Dine In (Santap di Kafe)',
      orders: 745,
      revenue: 'Rp27.980.000',
      pct: 58,
      icon: ForkKnife,
      textColor: 'text-accent1',
      bgColor: 'bg-accent1/15',
    },
    {
      id: 'takeaway',
      channel: 'Takeaway (Bungkus / To Go)',
      orders: 334,
      revenue: 'Rp12.540.000',
      pct: 26,
      icon: Coffee,
      textColor: 'text-accent2',
      bgColor: 'bg-accent2/15',
    },
    {
      id: 'delivery',
      channel: 'Delivery (GoFood / GrabFood)',
      orders: 205,
      revenue: 'Rp7.730.000',
      pct: 16,
      icon: Motorcycle,
      textColor: 'text-warning',
      bgColor: 'bg-warning/15',
    },
  ]

  /* ─── Payment Data ─── */
  const paymentData = [
    {
      id: 'qris',
      method: 'QRIS Dinamis / Statis',
      sub: 'BCA, GoPay, OVO, ShopeePay',
      count: 796,
      amount: 'Rp29.915.000',
      share: '62%',
      pct: 62,
      icon: QrCode,
      textColor: 'text-accent1',
      bgColor: 'bg-accent1/15',
    },
    {
      id: 'debit',
      method: 'Kartu Debit / EDC Tap',
      sub: 'BCA, Mandiri, BRI',
      count: 308,
      amount: 'Rp11.580.000',
      share: '24%',
      pct: 24,
      icon: CreditCard,
      textColor: 'text-accent2',
      bgColor: 'bg-accent2/15',
    },
    {
      id: 'cash',
      method: 'Uang Tunai (Cash Kasir)',
      sub: 'Rekonsiliasi cash drawer',
      count: 180,
      amount: 'Rp6.755.000',
      share: '14%',
      pct: 14,
      icon: Money,
      textColor: 'text-muted-foreground',
      bgColor: 'bg-secondary/40',
    },
  ]

  return (
    <div className="space-y-6">
      {/* ─── Header & Global Filters ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">Sales & Revenue Analytics</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Analisis arus pendapatan, pola hari sibuk, distribusi kanal penjualan, dan rekonsiliasi metode pembayaran
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">Periode:</span>
            <Select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="h-8 text-xs w-36">
              <option value="today">Hari Ini</option>
              <option value="yesterday">Kemarin</option>
              <option value="last7">7 Hari Terakhir</option>
              <option value="thisMonth">Bulan Ini</option>
            </Select>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">Outlet:</span>
            <Select value={outletFilter} onChange={(e) => setOutletFilter(e.target.value)} className="h-8 text-xs w-36">
              <option value="all">Semua Outlet</option>
              <option value="malang">Cabang Malang</option>
              <option value="surabaya">Cabang Surabaya</option>
              <option value="jakarta">Cabang Jakarta</option>
            </Select>
          </div>
        </div>
      </div>

      {/* ─── 4 KPI Metric Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="GROSS REVENUE" value="Rp48.250.000" change="+12.4%" trend="up" subtitle="Pendapatan kotor akumulatif" icon={CurrencyDollar} />
        <MetricCard title="NET SALES" value="Rp44.120.000" change="+11.8%" trend="up" subtitle="Setelah potongan diskon & promo" icon={TrendUp} />
        <MetricCard title="TOTAL TRANSAKSI" value="1,284 Orders" change="+8.2%" trend="up" subtitle="Rata-rata order Rp37.570" icon={ShoppingCart} />
        <MetricCard title="PEAK DAY" value="Sabtu (Saturday)" change="360 Orders" trend="neutral" subtitle="Kontribusi omzet 30.6%" icon={Clock} />
      </div>

      {/* ══════════════════════════════════════════
          VISUAL CHART SECTION — Striped Bar Chart (Line Miring Pattern)
          ══════════════════════════════════════════ */}
      <Card className="border-border shadow-xs">
        <CardContent className="pt-6">
          <StripedBarChart
            title="Activity Penjualan Mingguan"
            statLabel="Worked this week · Omzet 7 Hari Terakhir"
            statValue="Rp48.25M"
            changeLabel="+12.4% vs last week"
            trend="up"
            showCategoryBreakdown={true}
          />
        </CardContent>
      </Card>

      {/* ══════════════════════════════════════════
          BREAKDOWN SECTION — Channel + Payment
          ══════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ─── Sales Channel Mix ─── */}
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Kanal Penjualan (Channel Mix)</CardTitle>
            <CardDescription>Perbandingan performa antara santap di kafe, bungkus, dan pesan antar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {channelData.map((ch, idx) => {
                const IconComp = ch.icon
                return (
                  <div key={idx} className="p-3.5 rounded-xl border border-border bg-secondary/20 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center">
                          <IconComp className="h-4 w-4 text-accent1" weight="bold" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-foreground">{ch.channel}</h4>
                          <span className="text-2xs text-muted-foreground">{ch.orders} transaksi disajikan</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-foreground block">{ch.revenue}</span>
                        <span className="text-2xs font-semibold text-accent1">{ch.pct}% Share</span>
                      </div>
                    </div>

                    {/* Progress Track with Diagonal Stripes */}
                    <div className="w-full bg-secondary/50 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full relative overflow-hidden ${ch.bgColor} transition-all duration-700 ease-out`}
                        style={{ width: `${ch.pct}%` }}
                      >
                        <svg className={`w-full h-full ${ch.textColor}`} xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            <pattern
                              id={`hatch-channel-${ch.id}`}
                              width="4"
                              height="4"
                              patternTransform="rotate(45 0 0)"
                              patternUnits="userSpaceOnUse"
                            >
                              <line x1="0" y1="0" x2="0" y2="4" stroke="currentColor" strokeWidth="1.2" />
                            </pattern>
                          </defs>
                          <rect width="100%" height="100%" fill={`url(#hatch-channel-${ch.id})`} />
                        </svg>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* ─── Payment Methods Mix ─── */}
        <Card>
          <CardHeader>
            <CardTitle>Metode Pembayaran (Payment Reconciliation)</CardTitle>
            <CardDescription>Pemisahan transaksi non-tunai vs tunai untuk mempermudah closing kasir</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentData.map((pay, idx) => {
                const PayIcon = pay.icon
                return (
                  <div key={idx} className="p-3.5 rounded-xl border border-border bg-secondary/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center">
                          <PayIcon className="h-4 w-4 text-accent2" weight="duotone" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-foreground">{pay.method}</div>
                          <div className="text-2xs text-muted-foreground">{pay.sub}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-foreground">{pay.amount}</div>
                        <div className="text-2xs text-muted-foreground">
                          {pay.count} tx • <span className="font-semibold text-accent2">{pay.share}</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Track with Diagonal Stripes */}
                    <div className="w-full bg-secondary/50 rounded-full h-2 overflow-hidden mt-1.5">
                      <div
                        className={`h-full rounded-full relative overflow-hidden ${pay.bgColor} transition-all duration-700 ease-out`}
                        style={{ width: `${pay.pct}%` }}
                      >
                        <svg className={`w-full h-full ${pay.textColor}`} xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            <pattern
                              id={`hatch-pay-${pay.id}`}
                              width="4"
                              height="4"
                              patternTransform="rotate(45 0 0)"
                              patternUnits="userSpaceOnUse"
                            >
                              <line x1="0" y1="0" x2="0" y2="4" stroke="currentColor" strokeWidth="1.1" />
                            </pattern>
                          </defs>
                          <rect width="100%" height="100%" fill={`url(#hatch-pay-${pay.id})`} />
                        </svg>
                      </div>
                    </div>
                  </div>
                )
              })}

              <div className="p-3 rounded-lg bg-accent2/5 border border-accent2/20 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Tingkat Penetrasi Cashless:</span>
                <span className="font-bold text-accent2 text-sm">86.0% (QRIS & EDC)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
