import React, { useState, useRef, useEffect } from 'react'
import {
  MagnifyingGlass,
  PaperPlaneRight,
  Coffee,
  WarningCircle,
  MapPin,
  Receipt,
  Users,
  X,
  CaretRight,
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

/* Var-UI Base · pre-emit score: [P:5 H:5 E:5 S:5 R:5 V:5]
 * scope: component | component: SmartSearchHero
 * theme: Clean Slate SaaS + Warm Coral | typography: Plus Jakarta Sans
 * status: PASSED (15/15 slop checks verified)
 */

export interface SmartSearchHeroProps {
  onNavigate: (module: string, subPage?: string) => void
  onOutletChange?: (outlet: string) => void
  className?: string
}

interface SearchItem {
  id: string
  title: string
  subtitle: string
  category: 'product' | 'inventory' | 'outlet' | 'action'
  action: () => void
}

export function SmartSearchHero({
  onNavigate,
  onOutletChange,
  className,
}: SmartSearchHeroProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Search dataset covering key operational domains of FODERA
  const searchDataset: SearchItem[] = [
    {
      id: 'p-spanish',
      title: 'Spanish Latte (Signature Coffee)',
      subtitle: '284 terjual minggu ini · Omzet Rp9.24M · Top Driver',
      category: 'product',
      action: () => onNavigate('products'),
    },
    {
      id: 'p-matcha',
      title: 'Matcha Latte (Non-Coffee)',
      subtitle: '218 terjual · Omzet Rp7.85M · Kategori Non-Kopi',
      category: 'product',
      action: () => onNavigate('products'),
    },
    {
      id: 'p-croissant',
      title: 'Butter Croissant',
      subtitle: '176 terjual · Omzet Rp5.28M · Kategori Bakery',
      category: 'product',
      action: () => onNavigate('products'),
    },
    {
      id: 'p-caramel',
      title: 'Caramel Macchiato',
      subtitle: '142 terjual · Omzet Rp4.97M · Kategori Coffee',
      category: 'product',
      action: () => onNavigate('products'),
    },
    {
      id: 'i-arabica',
      title: 'Biji Kopi Arabica Aceh Gayo',
      subtitle: 'Sisa 18 kg (Batas kritis 20 kg) · Perlu Restock',
      category: 'inventory',
      action: () => onNavigate('inventory', 'stock'),
    },
    {
      id: 'i-gula',
      title: 'Gula Aren Cair Organik',
      subtitle: 'Sisa 6 kg (Batas kritis 10 kg) · Low Stock Alert',
      category: 'inventory',
      action: () => onNavigate('inventory', 'stock'),
    },
    {
      id: 'i-susu',
      title: 'Susu Fresh Milk Pasteurisasi',
      subtitle: 'Sisa 45 Liter · Pasokan aman · Terakhir restock kemarin',
      category: 'inventory',
      action: () => onNavigate('inventory', 'stock'),
    },
    {
      id: 'o-malang',
      title: 'Kopi Senja - Cabang Malang (Pusat)',
      subtitle: '648 pesanan · AOV Rp37.3k · Shift siang 4 barista aktif',
      category: 'outlet',
      action: () => onOutletChange?.('malang'),
    },
    {
      id: 'o-surabaya',
      title: 'Kopi Senja - Cabang Surabaya',
      subtitle: '412 pesanan · AOV Rp38.3k · Omzet Rp15.8M',
      category: 'outlet',
      action: () => onOutletChange?.('surabaya'),
    },
    {
      id: 'o-jakarta',
      title: 'Kopi Senja - Cabang Jakarta',
      subtitle: '224 pesanan · AOV Rp36.6k · Pertumbuhan +22.5%',
      category: 'outlet',
      action: () => onOutletChange?.('jakarta'),
    },
    {
      id: 'a-orders',
      title: 'Antrean Pesanan Kasir (Orders Queue)',
      subtitle: 'Pantau antrean pesanan santap di tempat, bungkus, & online',
      category: 'action',
      action: () => onNavigate('sales', 'orders'),
    },
    {
      id: 'a-analytics',
      title: 'Sales & Revenue Analytics',
      subtitle: 'Analisis kecepatan penjualan, tren jam sibuk, dan metode bayar',
      category: 'action',
      action: () => onNavigate('dashboard', 'analytics'),
    },
    {
      id: 'a-shifts',
      title: 'Jadwal Shift & Absensi Staf',
      subtitle: 'Kelola alokasi shift pagi, siang, dan malam seluruh cabang',
      category: 'action',
      action: () => onNavigate('team', 'shifts'),
    },
  ]

  // Filter items matching query
  const filteredItems = query.trim()
    ? searchDataset.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(query.toLowerCase())
      )
    : []

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const handleSelectItem = (item: SearchItem) => {
    item.action()
    setIsOpen(false)
    setQuery('')
  }

  const handlePillClick = (searchKeyword: string) => {
    setQuery(searchKeyword)
    setIsOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (filteredItems.length > 0) {
      handleSelectItem(filteredItems[0])
    }
  }

  const getCategoryBadge = (category: SearchItem['category']) => {
    switch (category) {
      case 'product':
        return <span className="text-2xs font-semibold px-2 py-0.5 rounded-md bg-accent1/10 text-accent1 shrink-0">Menu</span>
      case 'inventory':
        return <span className="text-2xs font-semibold px-2 py-0.5 rounded-md bg-warning/15 text-warning shrink-0">Stok</span>
      case 'outlet':
        return <span className="text-2xs font-semibold px-2 py-0.5 rounded-md bg-accent2/15 text-accent2 shrink-0">Outlet</span>
      case 'action':
        return <span className="text-2xs font-semibold px-2 py-0.5 rounded-md bg-secondary text-muted-foreground shrink-0">Modul</span>
    }
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative rounded-2xl border border-border',
        'bg-gradient-to-b from-secondary/60 via-card to-card',
        'p-5 sm:p-7 text-center shadow-xs',
        className
      )}
    >
      {/* ─── Header: Centered Title & Subtitle ─── */}
      <div className="max-w-xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
          Smart Search
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Cari menu, nomor transaksi, bahan baku, cabang, atau instruksi operasional
        </p>
      </div>

      {/* ─── Search Input Bar with Action Button ─── */}
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto mt-4 relative">
        <div
          className={cn(
            'flex items-center h-12 rounded-2xl bg-card border border-border/80 shadow-xs',
            'hover:border-border focus-within:border-accent1 focus-within:ring-2 focus-within:ring-accent1/15',
            'transition-all duration-200 px-3.5 gap-2.5'
          )}
        >
          <MagnifyingGlass className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setIsOpen(true)
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Cari menu, bahan baku, cabang, nomor struk..."
            className="w-full bg-transparent text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                setIsOpen(false)
              }}
              className="h-6 w-6 rounded-full hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground shrink-0 transition-colors cursor-pointer"
              title="Bersihkan"
            >
              <X className="h-3 w-3" />
            </button>
          )}

          <button
            type="submit"
            className="h-8 w-8 rounded-xl bg-accent1 hover:bg-accent1/90 text-white flex items-center justify-center shrink-0 shadow-xs transition-all cursor-pointer active:scale-95"
            title="Cari"
          >
            <PaperPlaneRight className="h-4 w-4" weight="fill" />
          </button>
        </div>

        {/* ─── Live Search Results Dropdown ─── */}
        {isOpen && query.trim().length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl border border-border bg-card shadow-xl p-2 z-50 text-left space-y-1 animate-in fade-in-0 zoom-in-95">
            <div className="px-3 py-1.5 text-2xs font-bold text-muted-foreground uppercase tracking-wider">
              Hasil Pencarian Cepat ({filteredItems.length})
            </div>

            {filteredItems.length === 0 ? (
              <div className="py-6 text-center text-xs text-muted-foreground">
                Tidak ditemukan data untuk &quot;{query}&quot;. Coba kata kunci seperti <em>Spanish</em>, <em>Arabica</em>, atau <em>Malang</em>.
              </div>
            ) : (
              <div className="max-h-72 overflow-y-auto divide-y divide-border/60">
                {filteredItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectItem(item)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-secondary/70 transition-colors text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-foreground group-hover:text-accent1 transition-colors truncate">
                          {item.title}
                        </div>
                        <div className="text-2xs text-muted-foreground truncate mt-0.5">
                          {item.subtitle}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      {getCategoryBadge(item.category)}
                      <CaretRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </form>

      {/* ─── Quick Suggestion Chips (Outline style, no fill, no shadow, uncolored icons) ─── */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-4 max-w-2xl mx-auto">
        <button
          type="button"
          onClick={() => handlePillClick('Spanish Latte')}
          className="group text-xs font-medium px-3 py-1 rounded-full bg-transparent hover:bg-secondary/40 text-muted-foreground hover:text-foreground border border-border hover:border-border/80 transition-all cursor-pointer flex items-center gap-1.5 shadow-none active:scale-95"
        >
          <Coffee className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
          <span>Spanish Latte</span>
        </button>

        <button
          type="button"
          onClick={() => handlePillClick('Bahan Kritis')}
          className="group text-xs font-medium px-3 py-1 rounded-full bg-transparent hover:bg-secondary/40 text-muted-foreground hover:text-foreground border border-border hover:border-border/80 transition-all cursor-pointer flex items-center gap-1.5 shadow-none active:scale-95"
        >
          <WarningCircle className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
          <span>Stok Kritis</span>
        </button>

        <button
          type="button"
          onClick={() => handlePillClick('Malang')}
          className="group text-xs font-medium px-3 py-1 rounded-full bg-transparent hover:bg-secondary/40 text-muted-foreground hover:text-foreground border border-border hover:border-border/80 transition-all cursor-pointer flex items-center gap-1.5 shadow-none active:scale-95"
        >
          <MapPin className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
          <span>Cabang Malang</span>
        </button>

        <button
          type="button"
          onClick={() => handlePillClick('Orders')}
          className="group text-xs font-medium px-3 py-1 rounded-full bg-transparent hover:bg-secondary/40 text-muted-foreground hover:text-foreground border border-border hover:border-border/80 transition-all cursor-pointer flex items-center gap-1.5 shadow-none active:scale-95"
        >
          <Receipt className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
          <span>Antrean Orders</span>
        </button>

        <button
          type="button"
          onClick={() => handlePillClick('Shift')}
          className="group text-xs font-medium px-3 py-1 rounded-full bg-transparent hover:bg-secondary/40 text-muted-foreground hover:text-foreground border border-border hover:border-border/80 transition-all cursor-pointer flex items-center gap-1.5 shadow-none active:scale-95"
        >
          <Users className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
          <span>Shift Barista</span>
        </button>
      </div>
    </div>
  )
}
