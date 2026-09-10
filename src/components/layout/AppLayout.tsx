import React, { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'

interface AppLayoutProps {
  activeModule: string
  activeSubPage: string
  onNavigate: (module: string, subPage?: string) => void
  currentOutlet: string
  onOutletChange: (outlet: string) => void
  currentPeriod: string
  onPeriodChange: (period: string) => void
  pageTitle: string
  pageSubtitle?: string
  children: React.ReactNode
}

export function AppLayout({
  activeModule,
  activeSubPage,
  onNavigate,
  currentOutlet,
  onOutletChange,
  currentPeriod,
  onPeriodChange,
  pageTitle,
  pageSubtitle,
  children,
}: AppLayoutProps) {
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false)
  const [isRestockOpen, setIsRestockOpen] = useState(false)
  const [isWasteOpen, setIsWasteOpen] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <div className="flex h-full w-full bg-secondary/50 text-foreground font-sans overflow-hidden p-2 sm:p-3 lg:p-4 gap-3 lg:gap-4">
      {/* Sidebar Navigation (Transparent background, floating on outer canvas) */}
      <Sidebar
        activeModule={activeModule}
        activeSubPage={activeSubPage}
        onNavigate={(mod, sub) => {
          onNavigate(mod, sub)
          setIsMobileOpen(false)
        }}
        onOpenQuickSearch={() => alert('Search dialog: Cari transaksi, produk, cabang, atau kontak...')}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        currentOutlet={currentOutlet}
        onOutletChange={onOutletChange}
      />

      {/* Main Content Area: Floating Rounded White Container as in Reference Image */}
      <div className="flex-1 flex flex-col min-w-0 bg-card rounded-2xl md:rounded-3xl border border-border/80 shadow-xs overflow-hidden h-full">
        <Topbar
          pageTitle={pageTitle}
          pageSubtitle={pageSubtitle}
          activeModule={activeModule}
          currentOutlet={currentOutlet}
          onOutletChange={onOutletChange}
          currentPeriod={currentPeriod}
          onPeriodChange={onPeriodChange}
          onOpenNewOrderModal={() => setIsNewOrderOpen(true)}
          onOpenRestockModal={() => setIsRestockOpen(true)}
          onOpenWasteModal={() => setIsWasteOpen(true)}
          onToggleMobileMenu={() => setIsMobileOpen(!isMobileOpen)}
        />

        <ScrollArea as="main" className="flex-1 p-4 sm:p-6 space-y-6">
          {children}
        </ScrollArea>
      </div>

      {/* Quick Action Modal: New Order */}
      <Modal
        isOpen={isNewOrderOpen}
        onClose={() => setIsNewOrderOpen(false)}
        title="Catat Pesanan Baru"
        description="Input transaksi penjualan operasional langsung ke sistem FODERA"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsNewOrderOpen(false)}>
              Batal
            </Button>
            <Button
              variant="accent1"
              onClick={() => {
                alert('Pesanan berhasil disimpan ke antrean operasional.')
                setIsNewOrderOpen(false)
              }}
            >
              Simpan Pesanan
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">Outlet</label>
            <Select defaultValue={currentOutlet === 'all' ? 'malang' : currentOutlet}>
              <option value="malang">Kopi Senja - Malang</option>
              <option value="surabaya">Kopi Senja - Surabaya</option>
              <option value="jakarta">Kopi Senja - Jakarta</option>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Nama Customer</label>
              <Input placeholder="cth. Budi Santoso" />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Tipe Pesanan</label>
              <Select defaultValue="dine-in">
                <option value="dine-in">Dine In</option>
                <option value="takeaway">Takeaway</option>
                <option value="delivery">Delivery</option>
              </Select>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">Pilih Produk</label>
            <Select defaultValue="1">
              <option value="1">Spanish Latte — Rp32.000 (Stok: Aman)</option>
              <option value="2">Matcha Latte — Rp36.000 (Stok: Aman)</option>
              <option value="3">Butter Croissant — Rp30.000 (Stok: 12 pcs)</option>
              <option value="4">Caramel Macchiato — Rp35.000</option>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Jumlah (Qty)</label>
              <Input type="number" defaultValue="1" min="1" />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Metode Pembayaran</label>
              <Select defaultValue="qris">
                <option value="qris">QRIS / E-Wallet</option>
                <option value="cash">Tunai (Cash)</option>
                <option value="card">Debit / Credit Card</option>
              </Select>
            </div>
          </div>
        </div>
      </Modal>

      {/* Quick Action Modal: Restock Inventory */}
      <Modal
        isOpen={isRestockOpen}
        onClose={() => setIsRestockOpen(false)}
        title="Catat Restock Bahan Baku"
        description="Perbarui stok bahan masuk (Stock In) untuk outlet"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsRestockOpen(false)}>
              Batal
            </Button>
            <Button
              variant="accent2"
              onClick={() => {
                alert('Stok bahan berhasil ditambahkan!')
                setIsRestockOpen(false)
              }}
            >
              Konfirmasi Restock
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">Bahan Baku (Ingredient)</label>
            <Select defaultValue="beans">
              <option value="beans">Biji Kopi Arabica (Sisa: 18 kg · Low Stock)</option>
              <option value="milk">Fresh Milk Full Cream (Sisa: 42 L)</option>
              <option value="sugar">Gula Aren Organik (Sisa: 6 kg · Low Stock)</option>
              <option value="matcha">Matcha Powder Uji (Sisa: 3 kg)</option>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Jumlah Masuk</label>
              <Input type="number" placeholder="cth. 25" />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Satuan</label>
              <Select defaultValue="kg">
                <option value="kg">Kilogram (kg)</option>
                <option value="l">Liter (L)</option>
                <option value="pcs">Pieces (pcs)</option>
              </Select>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">Supplier / Sumber</label>
            <Input placeholder="cth. CV Mitra Kopi Nusantara" />
          </div>
        </div>
      </Modal>

      {/* Quick Action Modal: Record Waste */}
      <Modal
        isOpen={isWasteOpen}
        onClose={() => setIsWasteOpen(false)}
        title="Catat Waste / Kerusakan Bahan"
        description="Lacak kehilangan inventory untuk efisiensi operasional"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsWasteOpen(false)}>
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                alert('Pencatatan waste berhasil disimpan!')
                setIsWasteOpen(false)
              }}
            >
              Simpan Log Waste
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">Bahan yang Rusak / Terbuang</label>
            <Select defaultValue="milk">
              <option value="milk">Fresh Milk Full Cream</option>
              <option value="croissant">Butter Croissant</option>
              <option value="syrup">Vanilla Syrup</option>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Jumlah Terbuang</label>
              <Input placeholder="cth. 3.5" />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Alasan (Reason)</label>
              <Select defaultValue="expired">
                <option value="expired">Expired / Basi</option>
                <option value="spilled">Tumpah / Spilled</option>
                <option value="quality">Kualitas Menurun</option>
                <option value="failed">Kesalahan Barista</option>
              </Select>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">Catatan Tambahan</label>
            <Textarea placeholder="Kulkas chiller mati mendadak semalam..." rows={2} />
          </div>
        </div>
      </Modal>
    </div>
  )
}
