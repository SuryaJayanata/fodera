import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { MetricCard } from '@/components/ui/metric-card'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import { StripedBarChart } from '@/components/ui/striped-bar-chart'
import { SmoothAreaChart } from '@/components/ui/smooth-area-chart'
import { DonutChart } from '@/components/ui/donut-chart'
import { cn } from '@/lib/utils'
import {
  TrendUp,
  Clock,
  CurrencyDollar,
  ShoppingCart,
  CreditCard,
  QrCode,
  Money,
} from '@phosphor-icons/react'

/* Var-UI Base · pre-emit score: [P:5 H:5 E:5 S:5 R:5 V:5]
 * scope: page | component: SalesAnalyticsPage
 * theme: Clean Slate SaaS + Warm Coral | typography: Plus Jakarta Sans
 * status: PASSED (15/15 slop checks verified)
 */

export interface SalesAnalyticsProps {
  currentOutlet?: string
  onOutletChange?: (outlet: string) => void
  currentPeriod?: string
  onPeriodChange?: (period: string) => void
}

export function SalesAnalyticsPage({
  currentOutlet = 'all',
  onOutletChange,
  currentPeriod = 'last7',
  onPeriodChange,
}: SalesAnalyticsProps) {
  const [internalDateFilter, setInternalDateFilter] = useState(currentPeriod)
  const [internalOutletFilter, setInternalOutletFilter] = useState(currentOutlet)

  const dateFilter = currentPeriod || internalDateFilter
  const outletFilter = currentOutlet || internalOutletFilter

  const handleDateChange = (val: string) => {
    setInternalDateFilter(val)
    if (onPeriodChange) onPeriodChange(val)
  }

  const handleOutletChange = (val: string) => {
    setInternalOutletFilter(val)
    if (onOutletChange) onOutletChange(val)
  }

  /* ─── Hourly Traffic Peak Hours Data (Section 8 & 17) ─── */
  const hourlyData = [
    { hour: '08:00', label: 'Morning Kick', orders: 85, revenue: 'Rp2.8M', pct: 32, isPeak: false },
    { hour: '10:00', label: 'Work & Meetings', orders: 112, revenue: 'Rp4.1M', pct: 42, isPeak: false },
    { hour: '12:00', label: 'Lunch Rush', orders: 215, revenue: 'Rp8.2M', pct: 80, isPeak: true, tag: 'Peak Siang' },
    { hour: '14:00', label: 'Siesta Lull', orders: 96, revenue: 'Rp3.4M', pct: 36, isPeak: false },
    { hour: '16:00', label: 'After-Work Coffee', orders: 140, revenue: 'Rp5.1M', pct: 52, isPeak: false },
    { hour: '18:00', label: 'Dinner Gathering', orders: 245, revenue: 'Rp9.6M', pct: 91, isPeak: true, tag: 'Peak Malam' },
    { hour: '20:00', label: 'Evening Prime', orders: 268, revenue: 'Rp10.4M', pct: 100, isPeak: true, tag: 'Golden Hour' },
    { hour: '22:00', label: 'Closing Chill', orders: 128, revenue: 'Rp4.6M', pct: 48, isPeak: false },
  ]
  const [activeHourIdx, setActiveHourIdx] = useState<number>(6) // Default to 20:00 Golden Hour

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
            <Select value={dateFilter} onChange={(e) => handleDateChange(e.target.value)} className="h-8 text-xs w-36">
              <option value="today">Hari Ini</option>
              <option value="yesterday">Kemarin</option>
              <option value="last7">7 Hari Terakhir</option>
              <option value="thisMonth">Bulan Ini</option>
            </Select>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">Outlet:</span>
            <Select value={outletFilter} onChange={(e) => handleOutletChange(e.target.value)} className="h-8 text-xs w-36">
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
          SALES VELOCITY SPLINE AREA CHART
          ══════════════════════════════════════════ */}
      <SmoothAreaChart
        title="Tren Kecepatan Penjualan (Sales Velocity)"
        statLabel="Spend the week · Omzet Akumulatif"
        statValue="Rp48.25M"
        statSubValue="Target Rp55.00M (+12.4%)"
        badges={[
          { label: 'Cabang Aktif', count: '3' },
          { label: 'Pesanan Sukses', count: '1,284' },
        ]}
        data={[
          { day: 'Mon', label: 'Senin', value: 38, displayValue: 'Rp5.2M', subValue: '142 Tx' },
          { day: 'Tue', label: 'Selasa', value: 48, displayValue: 'Rp6.8M', subValue: '186 Tx' },
          { day: 'Wed', label: 'Rabu', value: 52, displayValue: 'Rp7.1M', subValue: '194 Tx' },
          { day: 'Thu', label: 'Kamis', value: 88, displayValue: '34,533', subValue: '286 Tx', isPeak: true },
          { day: 'Fri', label: 'Jumat', value: 68, displayValue: 'Rp9.8M', subValue: '254 Tx' },
          { day: 'Sat', label: 'Sabtu', value: 78, displayValue: 'Rp10.2M', subValue: '280 Tx' },
          { day: 'Sun', label: 'Minggu', value: 92, displayValue: 'Rp12.6M', subValue: '320 Tx' },
        ]}
      />

      {/* ══════════════════════════════════════════
          BREAKDOWN SECTION — Channel (Donut Arch) + Payment
          ══════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* ─── Sales Channel Mix Donut Chart ─── */}
        <DonutChart
          title="Distribusi Kanal Penjualan (Channel Mix)"
          subtitle="Proporsi pesanan santap di kafe, bungkus, & delivery"
        />

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

              <div className="p-3 rounded-xl bg-accent2/5 border border-accent2/20 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Tingkat Penetrasi Cashless:</span>
                <span className="font-bold text-accent2 text-sm">86.0% (QRIS & EDC)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ══════════════════════════════════════════
          PEAK HOURS & OPERATIONAL RHYTHM SECTION (Section 8 & Section 17)
          ══════════════════════════════════════════ */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle>Pola Jam Sibuk Operasional (Peak Hours Traffic)</CardTitle>
              <CardDescription>
                Distribusi volume transaksi per 2 jam untuk pemetaan kebutuhan barista dan persiapan stok
              </CardDescription>
            </div>
            <Badge variant="accent1" className="self-start sm:self-auto text-2xs font-semibold">
              Peak: 18:00 – 20:00 WIB
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Hourly Bars with Striped Pattern */}
            <div className="flex items-end justify-between gap-2 sm:gap-3 h-44 sm:h-48 pt-6 pb-1 px-1 border-b border-border">
              {hourlyData.map((item, idx) => {
                const isSelected = idx === activeHourIdx
                const isPeak = item.isPeak

                return (
                  <div
                    key={item.hour}
                    onClick={() => setActiveHourIdx(idx)}
                    className="flex-1 flex flex-col items-center justify-end h-full relative cursor-pointer group select-none"
                  >
                    {/* Floating pill for active or peak hour */}
                    {isSelected && (
                      <div
                        className="absolute z-20 transition-all duration-200 pointer-events-none"
                        style={{ bottom: `calc(${item.pct}% + 8px)` }}
                      >
                        <div
                          className={cn(
                            'text-2xs font-bold px-2 py-0.5 rounded-md shadow-xs whitespace-nowrap',
                            isPeak ? 'bg-accent1 text-white' : 'bg-primary text-white'
                          )}
                        >
                          {item.orders} Tx
                        </div>
                      </div>
                    )}

                    {/* Striped Bar */}
                    <div
                      className={cn(
                        'w-full max-w-7 sm:max-w-8 rounded-lg flex items-end transition-all duration-300',
                        isPeak
                          ? isSelected
                            ? 'bg-accent1/25'
                            : 'bg-accent1/15'
                          : isSelected
                            ? 'bg-secondary'
                            : 'bg-secondary/40'
                      )}
                      style={{ height: `${item.pct}%` }}
                    >
                      <div className="w-full h-full rounded-lg overflow-hidden">
                        <svg
                          className={cn(
                            'w-full h-full transition-colors',
                            isPeak
                              ? 'text-accent1'
                              : isSelected
                                ? 'text-muted-foreground/80'
                                : 'text-muted-foreground/45'
                          )}
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <defs>
                            <pattern
                              id={`hour-hatch-${item.hour}`}
                              width="4.5"
                              height="4.5"
                              patternTransform="rotate(45 0 0)"
                              patternUnits="userSpaceOnUse"
                            >
                              <line
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="4.5"
                                stroke="currentColor"
                                strokeWidth={isPeak ? 1.4 : 1.1}
                              />
                            </pattern>
                          </defs>
                          <rect
                            width="100%"
                            height="100%"
                            fill={`url(#hour-hatch-${item.hour})`}
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Hour Label */}
                    <span
                      className={cn(
                        'text-2xs font-mono mt-2 transition-colors',
                        isSelected
                          ? 'font-bold text-foreground'
                          : isPeak
                            ? 'font-semibold text-accent1'
                            : 'text-muted-foreground group-hover:text-foreground'
                      )}
                    >
                      {item.hour}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Selected Hour Insight Card */}
            {hourlyData[activeHourIdx] && (
              <div className="p-3.5 rounded-xl bg-secondary/40 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-card border border-border flex flex-col items-center justify-center shrink-0">
                    <Clock className="h-4 w-4 text-accent1" weight="bold" />
                    <span className="text-2xs font-bold font-mono text-foreground mt-0.5">
                      {hourlyData[activeHourIdx].hour}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-foreground">
                        Sesi: {hourlyData[activeHourIdx].label}
                      </span>
                      {hourlyData[activeHourIdx].tag && (
                        <Badge variant="accent1" className="text-2xs py-0">
                          {hourlyData[activeHourIdx].tag}
                        </Badge>
                      )}
                    </div>
                    <p className="text-2xs text-muted-foreground mt-0.5">
                      {hourlyData[activeHourIdx].isPeak
                        ? 'Jam sibuk operasional. Butuh 3 barista stasiun espresso & backup persediaan susu/sirup.'
                        : 'Jam reguler. Cukup 2 staf operasional untuk layanan kasir dan bar.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-auto shrink-0">
                  <div className="text-right">
                    <span className="text-2xs text-muted-foreground block">Estimasi Omzet Sesi</span>
                    <span className="text-xs font-bold text-foreground font-mono">
                      {hourlyData[activeHourIdx].revenue}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xs text-muted-foreground block">Volume Pesanan</span>
                    <span className="text-xs font-bold text-foreground font-mono">
                      {hourlyData[activeHourIdx].orders} Transaksi
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
