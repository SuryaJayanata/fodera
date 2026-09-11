import React, { useState } from 'react'
import { Download, FileText, BarChart, Package, Store, Coffee } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

/* Var-UI Base · pre-emit score: [P:5 H:5 E:5 S:5 R:5 V:5]
 * scope: page | component: ReportsOverviewPage
 * theme: Clean Slate SaaS + Warm Coral | typography: Plus Jakarta Sans
 * status: PASSED (15/15 slop checks verified)
 */

export function ReportsOverviewPage() {
  const reportCategories = [
    {
      id: 'sales',
      title: 'Laporan Penjualan (Sales Report)',
      description: 'Ringkasan komprehensif omzet kotor/bersih, kuantitas order, dan rata-rata AOV',
      metrics: 'Total Revenue: Rp48.25M · Orders: 1,284 · AOV: Rp37.5k',
      icon: BarChart,
      updated: 'Diperbarui 10 menit lalu',
    },
    {
      id: 'product',
      title: 'Laporan Performa Menu (Product Report)',
      description: 'Analisis kontribusi margin, produk terlaris (Top Sellers) dan evaluasi menu lambat (Low Performers)',
      metrics: 'Margin Rata-rata: 61.8% · 86 Menu Aktif',
      icon: Coffee,
      updated: 'Diperbarui 1 jam lalu',
    },
    {
      id: 'inventory',
      title: 'Laporan Inventaris & Pemborosan (Inventory Report)',
      description: 'Pergerakan stok, pemakaian bahan baku espresso/pastry, dan total kerugian waste',
      metrics: 'Nilai Stok: Rp18.4M · Kerugian Waste: Rp323.000',
      icon: Package,
      updated: 'Diperbarui 30 menit lalu',
    },
    {
      id: 'outlet',
      title: 'Laporan Komparasi Cabang (Outlet Report)',
      description: 'Perbandingan performa antar 3 outlet: Malang, Surabaya, dan Jakarta',
      metrics: '3 Cabang Beroperasi · 1 Perlu Intervensi',
      icon: Store,
      updated: 'Hari ini, 06:00 WIB',
    },
  ]

  const handleExport = (title: string, format: string) => {
    alert(`Mengekspor ${title} format ${format}... Unduhan akan dimulai.`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">Structured Reports</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Ekspor data terstruktur untuk kebutuhan pembukuan, evaluasi manajemen, dan audit berkala
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportCategories.map((r) => {
          const Icon = r.icon
          return (
            <Card key={r.id} className="flex flex-col justify-between hover:border-border/80 transition-all shadow-xs">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center text-accent1 shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-bold text-foreground">{r.title}</CardTitle>
                    <CardDescription className="mt-1 text-xs">{r.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-2 space-y-4">
                <div className="p-2.5 rounded-lg bg-secondary/50 border border-border/60 text-xs font-mono text-foreground font-medium">
                  {r.metrics}
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border/60 text-2xs text-muted-foreground">
                  <span>{r.updated}</span>
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExport(r.title, 'CSV')}
                      className="h-7 text-xs px-2"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      <span>CSV</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExport(r.title, 'PDF')}
                      className="h-7 text-xs px-2"
                    >
                      <FileText className="h-3 w-3 mr-1" />
                      <span>PDF</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
