import React, { useState } from 'react'
import {
  Package,
  DollarSign,
  Layers,
  Users,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Clock,
  Store,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

/* Var-UI Base · pre-emit score: [P:5 H:5 E:5 S:5 R:5 V:5]
 * scope: component | component: FeaturesDeepDiveSection
 * theme: Clean Slate SaaS + Warm Coral | typography: Plus Jakarta Sans
 * status: PASSED (15/15 slop checks verified)
 */

export function FeaturesDeepDiveSection() {
  const [activePillar, setActivePillar] = useState<'inventory' | 'margin' | 'multi' | 'shifts'>('inventory')

  return (
    <section id="pilar" className="w-full py-24 px-6 sm:px-12 lg:px-16 border-b border-border bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Fitur Mendalam untuk Efisiensi Operasional Nyata
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-3 leading-relaxed">
            FODERA bukan sekadar pencatat transaksi. Setiap modul dirancang untuk memangkas kebocoran biaya dan mempercepat pengambilan keputusan manajemen.
          </p>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          <button
            type="button"
            onClick={() => setActivePillar('inventory')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activePillar === 'inventory'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-card text-muted-foreground hover:text-foreground border border-border/80'
            }`}
          >
            <Package className="h-4 w-4" />
            <span>1. Inventaris & Waste Alert</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePillar('margin')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activePillar === 'margin'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-card text-muted-foreground hover:text-foreground border border-border/80'
            }`}
          >
            <DollarSign className="h-4 w-4" />
            <span>2. Resep & Kontrol Margin HPP</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePillar('multi')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activePillar === 'multi'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-card text-muted-foreground hover:text-foreground border border-border/80'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>3. Matriks Multi-Outlet</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePillar('shifts')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activePillar === 'shifts'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-card text-muted-foreground hover:text-foreground border border-border/80'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>4. Antrean Order & Tim Shift</span>
          </button>
        </div>

        {/* Content Display for Active Pillar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-2xl border border-border bg-card p-6 sm:p-10 shadow-sm">
          {/* Left Column: Description & Value Proposition (5 Cols) */}
          <div className="lg:col-span-5 space-y-5 text-left">
            {activePillar === 'inventory' && (
              <>
                <h3 className="text-2xl font-extrabold tracking-tight text-foreground">
                  Hentikan Kebocoran Bahan dengan Peringatan Proaktif
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Daripada memeriksa lemari es dan gudang manual setiap malam, FODERA secara otomatis mendeteksi bahan yang menipis di bawah ambang batas minimum dan mencatat nilai nominal kerugian saat bahan kedaluwarsa.
                </p>
                <div className="space-y-2.5 pt-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-accent2 shrink-0" />
                    <span>Ambang batas minimum otomatis (Low Stock Alert)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-accent2 shrink-0" />
                    <span>Audit waste dengan estimasi kerugian nominal (Rp)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-accent2 shrink-0" />
                    <span>Buku besar siklus stok: Beli → Pakai → Waste → Sisa</span>
                  </div>
                </div>
              </>
            )}

            {activePillar === 'margin' && (
              <>
                <h3 className="text-2xl font-extrabold tracking-tight text-foreground">
                  Ketahui Persis Margin Laba Bersih Setiap Menu
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Banyak pemilik F&B merasa ramai pesanan tetapi laba tipis karena HPP bahan baku naik tanpa disadari. FODERA menghitung margin riil per produk dan mengelompokkan menu Top Seller vs Low Performer.
                </p>
                <div className="space-y-2.5 pt-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-accent2 shrink-0" />
                    <span>Komposisi bahan baku & estimasi biaya resep otomatis</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-accent2 shrink-0" />
                    <span>Identifikasi menu underperforming sebelum membebani kas</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-accent2 shrink-0" />
                    <span>Proteksi margin laba kotor di atas 60% per item</span>
                  </div>
                </div>
              </>
            )}

            {activePillar === 'multi' && (
              <>
                <h3 className="text-2xl font-extrabold tracking-tight text-foreground">
                  Pantau Malang, Surabaya, dan Jakarta Tanpa Pusing
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Setiap cabang memiliki store manager dan data operasional tersendiri, namun pemilik dapat melihat perbandingan konsolidasinya secara berdampingan untuk melihat cabang yang paling efisien.
                </p>
                <div className="space-y-2.5 pt-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-accent2 shrink-0" />
                    <span>Komparasi omzet, AOV, dan rasio waste antar outlet</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-accent2 shrink-0" />
                    <span>Deteksi anomali penjualan cabang drop sebelum terlambat</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-accent2 shrink-0" />
                    <span>Sinkronisasi menu dan penetapan harga lintas wilayah</span>
                  </div>
                </div>
              </>
            )}

            {activePillar === 'shifts' && (
              <>
                <h3 className="text-2xl font-extrabold tracking-tight text-foreground">
                  Hubungkan Jadwal Staf dengan Jam Paling Ramai
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Jangan sampai bar kekurangan barista saat jam sibuk (Peak Hours 18:00 - 20:00). FODERA menghubungkan roster jadwal staf langsung dengan proyeksi waktu transaksi terpadat.
                </p>
                <div className="space-y-2.5 pt-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-accent2 shrink-0" />
                    <span>Pipeline antrean visual (New → Preparing → Ready)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-accent2 shrink-0" />
                    <span>Roster pembagian peran: Barista, Kasir, Kitchen, Crew</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-accent2 shrink-0" />
                    <span>Evaluasi kehadiran dan kecekatan operasional tim</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right Column: High-Fidelity Interactive Preview Snippet (7 Cols) */}
          <div className="lg:col-span-7 bg-background rounded-xl border border-border p-5 shadow-xs">
            {activePillar === 'inventory' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div>
                    <span className="text-xs font-bold text-foreground block">Inventory Health Alert</span>
                    <span className="text-[11px] text-muted-foreground">Status bahan baku di Outlet Malang</span>
                  </div>
                  <Badge variant="warning">2 Bahan Kritis</Badge>
                </div>

                <div className="space-y-2.5">
                  <div className="p-3 rounded-lg border border-warning/30 bg-warning/5 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-foreground">Biji Kopi Arabica Gayo</div>
                      <div className="text-[11px] text-muted-foreground">Supplier: CV Mitra Nusantara · Min: 20 kg</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-warning">Sisa 18 kg</div>
                      <div className="text-[10px] font-semibold text-accent1">Perlu Restock Segera</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border border-warning/30 bg-warning/5 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-foreground">Gula Aren Organik</div>
                      <div className="text-[11px] text-muted-foreground">Supplier: UD Tani Manis · Min: 10 kg</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-warning">Sisa 6 kg</div>
                      <div className="text-[10px] font-semibold text-accent1">Batas Minimum Kritis</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border border-border bg-card flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-foreground">Fresh Milk Full Cream</div>
                      <div className="text-[11px] text-muted-foreground">Greenfields Indonesia · Min: 15 L</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-accent2">Sisa 42 L</div>
                      <div className="text-[10px] text-muted-foreground">Kondisi Aman</div>
                    </div>
                  </div>
                </div>

                {/* Waste Loss Indicator */}
                <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/20 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-destructive block">Pencatatan Waste Terkini</span>
                    <span className="text-muted-foreground text-[11px]">3.5 Liter Susu Expired di Chiller</span>
                  </div>
                  <span className="font-mono font-bold text-destructive">Kerugian: Rp119.000</span>
                </div>
              </div>
            )}

            {activePillar === 'margin' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div>
                    <span className="text-xs font-bold text-foreground block">Katalog Resep & Margin Laba</span>
                    <span className="text-[11px] text-muted-foreground">Evaluasi harga jual vs HPP riil</span>
                  </div>
                  <Badge variant="accent2">Margin Rata-rata 61.8%</Badge>
                </div>

                <div className="space-y-2.5">
                  <div className="p-3 rounded-lg border border-border bg-card flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-foreground flex items-center gap-2">
                        <span>Spanish Latte</span>
                        <Badge variant="accent1" className="text-[9px] py-0">Top Seller</Badge>
                      </div>
                      <div className="text-[11px] text-muted-foreground">HPP Bahan: Rp11.500 · 284 Orders</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-foreground">Rp32.000</div>
                      <div className="text-[10px] text-accent2 font-bold">+Rp20.500 (64.1%)</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border border-border bg-card flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-foreground flex items-center gap-2">
                        <span>Matcha Latte Uji</span>
                        <Badge variant="accent2" className="text-[9px] py-0">Top Seller</Badge>
                      </div>
                      <div className="text-[11px] text-muted-foreground">HPP Bahan: Rp14.000 · 218 Orders</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-foreground">Rp36.000</div>
                      <div className="text-[10px] text-accent2 font-bold">+Rp22.000 (61.1%)</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border border-destructive/30 bg-destructive/5 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-foreground flex items-center gap-2">
                        <span>Cold Brew Oat Milk</span>
                        <Badge variant="destructive" className="text-[9px] py-0">Low Performer</Badge>
                      </div>
                      <div className="text-[11px] text-muted-foreground">HPP Bahan Tinggi: Rp19.500 · Hanya 24 Orders</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-foreground">Rp38.000</div>
                      <div className="text-[10px] text-destructive font-bold">+Rp18.500 (48.6%)</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activePillar === 'multi' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div>
                    <span className="text-xs font-bold text-foreground block">Matriks Komparasi 3 Cabang</span>
                    <span className="text-[11px] text-muted-foreground">Konsolidasi grup usaha Kopi Senja</span>
                  </div>
                  <Badge variant="secondary">Total Omzet: Rp48.25M</Badge>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-lg border border-border bg-card flex items-center justify-between">
                    <div>
                      <div className="font-bold text-foreground flex items-center gap-1.5">
                        <Store className="h-3.5 w-3.5 text-accent1" />
                        <span>Kopi Senja — Malang (HQ)</span>
                      </div>
                      <div className="text-[11px] text-muted-foreground">648 pesanan · AOV Rp37.422 · Waste 1.2%</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-foreground">Rp24.25M (50.3%)</div>
                      <div className="text-[10px] font-bold text-accent2">+14.2% Growth</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border border-destructive/20 bg-destructive/5 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-foreground flex items-center gap-1.5">
                        <Store className="h-3.5 w-3.5 text-destructive" />
                        <span>Kopi Senja — Surabaya</span>
                      </div>
                      <div className="text-[11px] text-muted-foreground">412 pesanan · AOV Rp38.349 · Waste 2.8%</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-destructive">Rp15.80M (32.7%)</div>
                      <div className="text-[10px] font-bold text-destructive">-12.0% Penurunan</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border border-border bg-card flex items-center justify-between">
                    <div>
                      <div className="font-bold text-foreground flex items-center gap-1.5">
                        <Store className="h-3.5 w-3.5 text-accent2" />
                        <span>Kopi Senja — Jakarta Selatan</span>
                      </div>
                      <div className="text-[11px] text-muted-foreground">224 pesanan · AOV Rp36.607 · Waste 0.8%</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-foreground">Rp8.20M (17.0%)</div>
                      <div className="text-[10px] font-bold text-accent2">+22.5% Fast Growth</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activePillar === 'shifts' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div>
                    <span className="text-xs font-bold text-foreground block">Roster Shift & Peak Hours</span>
                    <span className="text-[11px] text-muted-foreground">Kesiapan staf bar pada jam sibuk</span>
                  </div>
                  <Badge variant="accent1">Peak: 18:00 – 20:00</Badge>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg border border-border bg-card flex items-center justify-between">
                    <div>
                      <span className="font-bold text-foreground block">Adit Pramana · Manager</span>
                      <span className="text-[11px] text-muted-foreground">Shift Pagi: 08:00 – 16:00 WIB</span>
                    </div>
                    <Badge variant="accent2">Bertugas</Badge>
                  </div>

                  <div className="p-2.5 rounded-lg border border-border bg-card flex items-center justify-between">
                    <div>
                      <span className="font-bold text-foreground block">Raka Dewa · Head Barista</span>
                      <span className="text-[11px] text-muted-foreground">Shift Siang-Malam: 12:00 – 20:00 WIB</span>
                    </div>
                    <Badge variant="accent2">Bertugas</Badge>
                  </div>

                  <div className="p-2.5 rounded-lg border border-border bg-card flex items-center justify-between">
                    <div>
                      <span className="font-bold text-foreground block">Dimas Wicaksono · Barista Crew</span>
                      <span className="text-[11px] text-muted-foreground">Shift Malam: 16:00 – 23:00 WIB</span>
                    </div>
                    <Badge variant="secondary">Shift Berikutnya</Badge>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
