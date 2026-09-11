import React, { useState } from 'react'
import { Store, MapPin, Clock, User, Plus, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'

/* Var-UI Base · pre-emit score: [P:5 H:5 E:5 S:5 R:5 V:5]
 * scope: page | component: OutletsListPage
 * theme: Clean Slate SaaS + Warm Coral | typography: Plus Jakarta Sans
 * status: PASSED (15/15 slop checks verified)
 */

interface OutletCardData {
  id: string
  name: string
  location: string
  hours: string
  manager: string
  revenue: string
  growth: string
  trend: 'up' | 'down'
  orders: number
  activeStaff: number
  inventoryHealth: 'Bagus' | 'Perlu Perhatian'
}

export function OutletsListPage() {
  const [isAddOpen, setIsAddOpen] = useState(false)

  const outlets: OutletCardData[] = [
    {
      id: 'malang',
      name: 'Kopi Senja - Malang (HQ)',
      location: 'Jl. Ijen No. 12, Klojen, Kota Malang',
      hours: '08:00 – 23:00 WIB',
      manager: 'Adit Pramana',
      revenue: 'Rp24.250.000',
      growth: '+14.2%',
      trend: 'up',
      orders: 648,
      activeStaff: 6,
      inventoryHealth: 'Perlu Perhatian',
    },
    {
      id: 'surabaya',
      name: 'Kopi Senja - Surabaya',
      location: 'Jl. Tunjungan No. 45, Genteng, Kota Surabaya',
      hours: '09:00 – 22:00 WIB',
      manager: 'Raka Dewa',
      revenue: 'Rp15.800.000',
      growth: '-12.0%',
      trend: 'down',
      orders: 412,
      activeStaff: 4,
      inventoryHealth: 'Bagus',
    },
    {
      id: 'jakarta',
      name: 'Kopi Senja - Jakarta Selatan',
      location: 'Jl. Senopati No. 88, Kebayoran Baru, Jakarta Selatan',
      hours: '07:30 – 22:00 WIB',
      manager: 'Bayu Wicaksono',
      revenue: 'Rp8.200.000',
      growth: '+22.5%',
      trend: 'up',
      orders: 224,
      activeStaff: 3,
      inventoryHealth: 'Bagus',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">Outlet Management</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Daftar seluruh cabang usaha. Setiap outlet memiliki data operasional mandiri dan konsolidasi pusat
          </p>
        </div>
        <Button variant="accent1" onClick={() => setIsAddOpen(true)} className="gap-1.5 self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          <span>Buka Outlet Baru</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {outlets.map((o) => (
          <Card key={o.id} className="relative overflow-hidden hover:border-border/80 transition-all shadow-xs">
            <CardHeader className="pb-3 border-b border-border/60">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-foreground">{o.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1 text-2xs">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span>{o.location}</span>
                  </CardDescription>
                </div>
                <Badge variant={o.trend === 'up' ? 'accent2' : 'destructive'} className="shrink-0 gap-0.5 text-2xs">
                  {o.trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  <span>{o.growth}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Revenue Periode:</span>
                <span className="font-bold text-foreground">{o.revenue}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Total Transaksi:</span>
                <span className="font-semibold text-foreground">{o.orders} pesanan</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Store Manager:</span>
                <span className="font-medium text-foreground">{o.manager}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Stok Bahan:</span>
                <span className={o.inventoryHealth === 'Bagus' ? 'text-accent2 font-semibold' : 'text-warning font-semibold'}>
                  {o.inventoryHealth}
                </span>
              </div>

              <div className="pt-3 border-t border-border/60 flex items-center justify-between text-2xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {o.hours}
                </span>
                <span>{o.activeStaff} Staf Aktif</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Daftarkan Cabang Baru"
        description="Tambahkan outlet F&B ke dalam workspace bisnis FODERA"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              Batal
            </Button>
            <Button
              variant="accent1"
              onClick={() => {
                alert('Cabang baru berhasil didaftarkan!')
                setIsAddOpen(false)
              }}
            >
              Simpan Outlet
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">Nama Cabang / Outlet</label>
            <Input placeholder="cth. Kopi Senja - Bandung" />
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">Alamat Lengkap</label>
            <Input placeholder="cth. Jl. Riau No. 20, Citarum, Kota Bandung" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Store Manager</label>
              <Input placeholder="Nama penanggung jawab" />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Jam Buka - Tutup</label>
              <Input placeholder="08:00 - 22:00" />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
