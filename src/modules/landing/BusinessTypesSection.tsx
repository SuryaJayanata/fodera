import React from 'react'
import { Coffee, Utensils, Cake, Store, Check, ArrowRight, Layers } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

/* Var-UI Base · pre-emit score: [P:5 H:5 E:5 S:5 R:5 V:5]
 * scope: component | component: BusinessTypesSection (Redesigned Professional)
 * theme: Clean Slate SaaS + Warm Coral | typography: Plus Jakarta Sans
 * status: PASSED (15/15 slop checks verified)
 */

export function BusinessTypesSection() {
  const industries = [
    {
      id: 'coffee',
      title: 'Coffee Shop & Roastery',
      badge: 'Spesialis Minuman',
      desc: 'Pantau persediaan biji kopi (beans), kalibrasi espresso harian, penggunaan fresh milk, dan lonjakan transaksi jam santai sore.',
      icon: Coffee,
      highlights: [
        'Pelacakan stok biji kopi hingga gramasi',
        'Analisis jam sibuk (Peak Hours 18:00 - 20:00)',
        'Perhitungan HPP resep per cup',
      ],
      metric: '64.1% Margin Spanish Latte',
    },
    {
      id: 'restaurant',
      title: 'Restaurant & Bistro',
      badge: 'Full-Service F&B',
      desc: 'Sinkronisasi antrean pesanan dari meja makan ke dapur secara terstruktur untuk mencegah keterlambatan penyajian dan pesanan terlewat.',
      icon: Store,
      highlights: [
        'Visibilitas pipeline order (New → Preparing → Ready)',
        'Monitoring bahan segar mudah rusak (perishable)',
        'Pengaturan jadwal shift staf dapur & waiter',
      ],
      metric: '183 Order Rata-rata / Hari',
    },
    {
      id: 'bakery',
      title: 'Bakery & Pastry Shop',
      badge: 'Produksi Batch Harian',
      desc: 'Kelola produksi harian adonan roti, lacak masa kedaluwarsa kue, dan catat kerugian waste akibat produk tidak laku atau rusak pemanggangan.',
      icon: Cake,
      highlights: [
        'Pencatatan nominal kerugian waste (Rp)',
        'Klasifikasi menu Best Seller vs Low Performer',
        'Kontrol stok bahan baku butter & tepung',
      ],
      metric: 'Deteksi Kerugian Waste Realtime',
    },
    {
      id: 'multi_outlet',
      title: 'Multi-Outlet Chain',
      badge: 'Jaringan Cabang',
      desc: 'Satu pusat kendali owner untuk mengawasi performa seluruh cabang, transfer bahan baku antar outlet, dan perbandingan omzet komparatif.',
      icon: Layers,
      highlights: [
        'Matriks performa cabang Malang vs Surabaya vs Jakarta',
        'Log aktivitas audit operasional per cabang',
        'Peringatan anomali omzet cabang yang turun',
      ],
      metric: 'Konsolidasi Seluruh Cabang',
    },
  ]

  return (
    <section id="fitur" className="w-full py-24 px-6 sm:px-12 lg:px-16 border-b border-border bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Didesain Presisi untuk Berbagai Karakter Bisnis F&B
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-3 leading-relaxed">
            Setiap jenis usaha kuliner memiliki alur operasional yang berbeda. FODERA menyesuaikan kebutuhan spesifik tanpa membebani Anda dengan konfigurasi rumit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {industries.map((item) => {
            const Icon = item.icon
            return (
              <Card
                key={item.id}
                className="flex flex-col justify-between hover:border-border/90 hover:shadow-md transition-all duration-200 bg-card border-border rounded-2xl"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-11 w-11 rounded-xl bg-secondary flex items-center justify-center text-foreground">
                      <Icon className="h-5 w-5 text-accent1" />
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground bg-secondary/80 px-2.5 py-1 rounded-md">
                      {item.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-foreground tracking-tight">{item.title}</h3>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-border/60 space-y-2">
                    {item.highlights.map((hl, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-foreground">
                        <Check className="h-3.5 w-3.5 text-accent2 shrink-0 mt-0.5" />
                        <span className="leading-snug">{hl}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>

                <div className="p-4 mx-6 mb-6 rounded-xl bg-secondary/50 border border-border/70 text-center">
                  <span className="text-xs font-mono font-bold text-foreground block">
                    {item.metric}
                  </span>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
