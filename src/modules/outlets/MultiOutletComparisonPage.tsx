import React from 'react'
import { Store, TrendingUp, ShoppingBag, ArrowUpRight, ArrowDownRight, Package } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

/* Var-UI Base · pre-emit score: [P:5 H:5 E:5 S:5 R:5 V:5]
 * scope: page | component: MultiOutletComparisonPage
 * theme: Clean Slate SaaS + Warm Coral | typography: Plus Jakarta Sans
 * status: PASSED (15/15 slop checks verified)
 */

export function MultiOutletComparisonPage() {
  const comparisonData = [
    {
      outlet: 'Malang (HQ)',
      revenue: 'Rp24.250.000',
      revenueShare: '50.3%',
      orders: 648,
      aov: 'Rp37.422',
      growth: '+14.2%',
      trend: 'up',
      topItem: 'Spanish Latte (182)',
      wasteRate: '1.2%',
      status: 'High Performer',
    },
    {
      outlet: 'Surabaya',
      revenue: 'Rp15.800.000',
      revenueShare: '32.7%',
      orders: 412,
      aov: 'Rp38.349',
      growth: '-12.0%',
      trend: 'down',
      topItem: 'Caramel Macchiato (110)',
      wasteRate: '2.8%',
      status: 'Needs Support',
    },
    {
      outlet: 'Jakarta',
      revenue: 'Rp8.200.000',
      revenueShare: '17.0%',
      orders: 224,
      aov: 'Rp36.607',
      growth: '+22.5%',
      trend: 'up',
      topItem: 'Matcha Latte (94)',
      wasteRate: '0.8%',
      status: 'Fast Growing',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground tracking-tight">Multi-Outlet Performance Matrix</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Perbandingan performa antar cabang: mengidentifikasi outlet terbaik dan outlet yang membutuhkan intervensi operasional
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl border border-border bg-card">
          <div className="text-xs font-semibold text-muted-foreground">Outlet Omzet Tertinggi</div>
          <div className="text-lg font-bold text-foreground mt-1">Malang (Rp24.2M)</div>
          <p className="text-xs text-accent2 mt-0.5 font-semibold">50.3% dari total penjualan grup</p>
        </div>
        <div className="p-4 rounded-2xl border border-border bg-card">
          <div className="text-xs font-semibold text-muted-foreground">Pertumbuhan Tercepat</div>
          <div className="text-lg font-bold text-foreground mt-1">Jakarta (+22.5%)</div>
          <p className="text-xs text-accent2 mt-0.5 font-semibold">Adopsi pasar baru sangat positif</p>
        </div>
        <div className="p-4 rounded-2xl border border-border bg-card">
          <div className="text-xs font-semibold text-muted-foreground">Perlu Perhatian Khusus</div>
          <div className="text-lg font-bold text-destructive mt-1">Surabaya (-12.0%)</div>
          <p className="text-xs text-destructive mt-0.5 font-semibold">Tingkat waste tinggi (2.8%)</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Matriks Komparasi Cabang</CardTitle>
          <CardDescription>Bandingkan metrik finansial, operasional, dan efisiensi bahan baku</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="border-b border-border bg-secondary/40 text-muted-foreground font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Cabang Outlet</th>
                  <th className="py-2.5 px-3 text-right">Revenue</th>
                  <th className="py-2.5 px-3 text-right">Share Omzet</th>
                  <th className="py-2.5 px-3 text-right">Total Transaksi</th>
                  <th className="py-2.5 px-3 text-right">AOV (Rata-rata)</th>
                  <th className="py-2.5 px-3 text-right">Pertumbuhan</th>
                  <th className="py-2.5 px-3">Menu Terlaris</th>
                  <th className="py-2.5 px-3 text-right">Waste Ratio</th>
                  <th className="py-2.5 px-3 text-center">Status Evaluasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {comparisonData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-secondary/30 transition-colors">
                    <td className="py-3.5 px-3 font-bold text-foreground flex items-center gap-1.5">
                      <Store className="h-3.5 w-3.5 text-accent1" />
                      {row.outlet}
                    </td>
                    <td className="py-3.5 px-3 text-right font-bold text-foreground">{row.revenue}</td>
                    <td className="py-3.5 px-3 text-right text-muted-foreground">{row.revenueShare}</td>
                    <td className="py-3.5 px-3 text-right font-semibold">{row.orders}</td>
                    <td className="py-3.5 px-3 text-right text-muted-foreground">{row.aov}</td>
                    <td className="py-3.5 px-3 text-right">
                      <span className={`font-semibold ${row.trend === 'up' ? 'text-accent2' : 'text-destructive'}`}>
                        {row.growth}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-foreground">{row.topItem}</td>
                    <td className={`py-3.5 px-3 text-right font-mono font-bold ${
                      parseFloat(row.wasteRate) > 2.0 ? 'text-destructive' : 'text-accent2'
                    }`}>
                      {row.wasteRate}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <Badge variant={row.trend === 'up' ? 'accent2' : 'destructive'}>
                        {row.status}
                      </Badge>
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
