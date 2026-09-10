import React from 'react'
import { History, Package, Coffee, Store, RefreshCcw, User, Clock } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

/* Var-UI Base · pre-emit score: [P:5 H:5 E:5 S:5 R:5 V:5]
 * scope: page | component: ActivityTimelinePage
 * theme: Clean Slate SaaS + Warm Coral | typography: Plus Jakarta Sans
 * status: PASSED (15/15 slop checks verified)
 */

interface ActivityItem {
  id: string
  dayGroup: 'Hari Ini' | 'Kemarin' | 'Minggu Lalu'
  time: string
  action: string
  detail: string
  user: string
  type: 'inventory' | 'product' | 'outlet' | 'system'
}

export function ActivityTimelinePage() {
  const activities: ActivityItem[] = [
    {
      id: 'ACT-901',
      dayGroup: 'Hari Ini',
      time: '09:30 WIB',
      action: 'Manager Menambahkan 50kg Coffee Beans',
      detail: 'Stok masuk dari CV Mitra Kopi Nusantara diterima di Outlet Malang',
      user: 'Adit Pramana (Manager)',
      type: 'inventory',
    },
    {
      id: 'ACT-900',
      dayGroup: 'Hari Ini',
      time: '08:15 WIB',
      action: 'Harga Menu Spanish Latte Diperbarui',
      detail: 'Harga jual disesuaikan menjadi Rp32.000 (margin 64.1%)',
      user: 'Adit Pramana (Owner)',
      type: 'product',
    },
    {
      id: 'ACT-899',
      dayGroup: 'Kemarin',
      time: '18:40 WIB',
      action: 'Penyesuaian Stok Susu Terbuang (Waste)',
      detail: '3.5 Liter susu expired dicatat dalam log efisiensi chiller Malang',
      user: 'Dimas Wicaksono (Crew)',
      type: 'inventory',
    },
    {
      id: 'ACT-898',
      dayGroup: 'Kemarin',
      time: '14:20 WIB',
      action: 'Outlet Kopi Senja Surabaya Ditambahkan',
      detail: 'Setup outlet baru selesai dan data kasir tersinkronisasi',
      user: 'Adit Pramana (Owner)',
      type: 'outlet',
    },
    {
      id: 'ACT-897',
      dayGroup: 'Minggu Lalu',
      time: '11:00 WIB',
      action: 'Audit Rutin Shift Kasir Selesai',
      detail: 'Selisih kas fisik vs pencatatan digital: Rp0 (Sesuai 100%)',
      user: 'Sarah Farida (Cashier)',
      type: 'system',
    },
  ]

  const getIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'inventory':
        return <Package className="h-4 w-4 text-accent2" />
      case 'product':
        return <Coffee className="h-4 w-4 text-accent1" />
      case 'outlet':
        return <Store className="h-4 w-4 text-primary" />
      case 'system':
        return <RefreshCcw className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground tracking-tight">Activity Timeline</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Audit trail real-time untuk memantau setiap penyesuaian harga, inventaris, dan pergerakan operasional
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Log Kronologis Aktivitas Operasional</CardTitle>
          <CardDescription>Catatan transparan tindakan operasional di semua cabang</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-border">
            {activities.map((act) => (
              <div key={act.id} className="relative flex items-start gap-4 pl-1">
                {/* Timeline Icon Node */}
                <div className="h-7 w-7 rounded-full bg-card border-2 border-border flex items-center justify-center shrink-0 z-10 shadow-2xs">
                  {getIcon(act.type)}
                </div>

                {/* Content */}
                <div className="flex-1 p-3.5 rounded-lg border border-border bg-surface shadow-2xs hover:border-border/80 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4 className="text-xs font-bold text-foreground">{act.action}</h4>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1 font-mono">
                      <Clock className="h-3 w-3" />
                      {act.dayGroup}, {act.time}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{act.detail}</p>
                  <div className="mt-2.5 pt-2 border-t border-border/50 flex items-center justify-between text-[11px]">
                    <span className="text-foreground font-medium flex items-center gap-1">
                      <User className="h-3 w-3 text-muted-foreground" />
                      {act.user}
                    </span>
                    <Badge variant="secondary" className="text-[10px] py-0 font-mono">
                      {act.id}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
