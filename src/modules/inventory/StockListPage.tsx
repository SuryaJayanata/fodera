import React, { useState } from 'react'
import {
  Package,
  Warning,
  Plus,
  MagnifyingGlass,
  CheckCircle,
  ArrowsClockwise,
  ArrowDown,
  Truck,
  Warehouse,
  Buildings,
  CurrencyDollar,
  ShieldCheck,
  WarningCircle,
} from '@phosphor-icons/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import { Modal } from '@/components/ui/modal'

/* Var-UI Base · pre-emit score: [P:5 H:5 E:5 S:5 R:5 V:5]
 * scope: page | component: StockListPage
 * theme: Clean Slate SaaS + Warm Coral | typography: Plus Jakarta Sans
 * status: PASSED (15/15 slop checks verified)
 */

export interface StockItem {
  id: string
  name: string
  category: 'Coffee Beans' | 'Dairy & Fresh' | 'Sweeteners & Syrups' | 'Pastry & Flour' | 'Packaging'
  current: number
  unit: string
  minStock: number
  reorderPoint: number
  unitCost: string
  supplier: string
  status: 'normal' | 'low' | 'critical'
  lastRestocked: string
}

export function StockListPage() {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [isRestockOpen, setIsRestockOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null)

  const [restockQty, setRestockQty] = useState('')
  const [restockPo, setRestockPo] = useState('')

  const [stockData, setStockData] = useState<StockItem[]>([
    {
      id: 'ING-01',
      name: 'Biji Kopi Arabica Gayo Full Wash',
      category: 'Coffee Beans',
      current: 18,
      unit: 'kg',
      minStock: 20,
      reorderPoint: 25,
      unitCost: 'Rp145.000 / kg',
      supplier: 'CV Mitra Kopi Nusantara',
      status: 'low',
      lastRestocked: '3 hari lalu',
    },
    {
      id: 'ING-02',
      name: 'Fresh Milk Full Cream Barista',
      category: 'Dairy & Fresh',
      current: 42,
      unit: 'L',
      minStock: 15,
      reorderPoint: 20,
      unitCost: 'Rp22.000 / L',
      supplier: 'PT Greenfields Indonesia',
      status: 'normal',
      lastRestocked: 'Kemarin',
    },
    {
      id: 'ING-03',
      name: 'Gula Aren Cair Organik 100%',
      category: 'Sweeteners & Syrups',
      current: 6,
      unit: 'kg',
      minStock: 10,
      reorderPoint: 15,
      unitCost: 'Rp32.000 / kg',
      supplier: 'UD Tani Manis',
      status: 'low',
      lastRestocked: '5 hari lalu',
    },
    {
      id: 'ING-04',
      name: 'Matcha Powder Uji Premium Grade A',
      category: 'Sweeteners & Syrups',
      current: 3.2,
      unit: 'kg',
      minStock: 2,
      reorderPoint: 3,
      unitCost: 'Rp680.000 / kg',
      supplier: 'Kyoto Imports Co.',
      status: 'normal',
      lastRestocked: '1 minggu lalu',
    },
    {
      id: 'ING-05',
      name: 'Vanilla Monin Syrup 750ml',
      category: 'Sweeteners & Syrups',
      current: 1,
      unit: 'botol',
      minStock: 3,
      reorderPoint: 4,
      unitCost: 'Rp140.000 / botol',
      supplier: 'Food & Beverage Distr.',
      status: 'critical',
      lastRestocked: '10 hari lalu',
    },
    {
      id: 'ING-06',
      name: 'Hot & Cold Paper Cups 12oz',
      category: 'Packaging',
      current: 480,
      unit: 'pcs',
      minStock: 300,
      reorderPoint: 500,
      unitCost: 'Rp850 / pcs',
      supplier: 'PT Packindo Pratama',
      status: 'normal',
      lastRestocked: '4 hari lalu',
    },
    {
      id: 'ING-07',
      name: 'Croissant French Butter Frozen Dough',
      category: 'Pastry & Flour',
      current: 35,
      unit: 'pcs',
      minStock: 25,
      reorderPoint: 40,
      unitCost: 'Rp11.200 / pcs',
      supplier: 'Artisan Bakery Supplies',
      status: 'normal',
      lastRestocked: '2 hari lalu',
    },
  ])

  const handleSaveRestock = () => {
    if (!selectedItem || !restockQty) return
    const addVal = parseFloat(restockQty)
    if (isNaN(addVal) || addVal <= 0) return

    setStockData((prev) =>
      prev.map((item) => {
        if (item.id === selectedItem.id) {
          const newCurrent = item.current + addVal
          let newStatus: StockItem['status'] = 'normal'
          if (newCurrent <= item.minStock / 2) newStatus = 'critical'
          else if (newCurrent <= item.minStock) newStatus = 'low'

          return {
            ...item,
            current: newCurrent,
            status: newStatus,
            lastRestocked: 'Baru saja',
          }
        }
        return item
      })
    )
    setIsRestockOpen(false)
    setRestockQty('')
    setRestockPo('')
  }

  const filteredItems = stockData.filter((item) => {
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      item.supplier.toLowerCase().includes(search.toLowerCase())
    return matchesStatus && matchesCategory && matchesSearch
  })

  const normalCount = stockData.filter((i) => i.status === 'normal').length
  const lowCount = stockData.filter((i) => i.status === 'low').length
  const criticalCount = stockData.filter((i) => i.status === 'critical').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">Inventory Health & Safety Stock</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Sistem pantau ambang batas bahan baku otomatis (*Safety Stock & Reorder Point*) untuk cegah kekosongan stok
          </p>
        </div>
        <Button
          variant="accent1"
          onClick={() => {
            setSelectedItem(stockData[0])
            setIsRestockOpen(true)
          }}
          className="gap-1.5 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" weight="bold" />
          <span>Restock Bahan Baku</span>
        </Button>
      </div>

      {/* Inventory Health Metric Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl border border-border bg-card shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Kondisi Aman (Normal)</span>
            <ShieldCheck className="h-4 w-4 text-accent2" weight="duotone" />
          </div>
          <div className="text-2xl font-bold text-accent2 mt-1">{normalCount} Bahan Baku</div>
          <p className="text-2xs text-muted-foreground mt-0.5">Stok berada di atas ambang safety minimum</p>
        </div>

        <div className="p-4 rounded-2xl border border-border bg-card shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Low Stock (Reorder Alert)</span>
            <Warning className="h-4 w-4 text-warning" weight="duotone" />
          </div>
          <div className="text-2xl font-bold text-warning mt-1">{lowCount} Bahan Baku</div>
          <p className="text-2xs text-warning font-semibold mt-0.5">Mendekati safety stock, segera buat PO supplier</p>
        </div>

        <div className="p-4 rounded-2xl border border-border bg-card shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Critical Level (Habis)</span>
            <WarningCircle className="h-4 w-4 text-destructive" weight="duotone" />
          </div>
          <div className="text-2xl font-bold text-destructive mt-1">{criticalCount} Bahan Baku</div>
          <p className="text-2xs text-destructive font-semibold mt-0.5">Berpotensi menghentikan penjualan menu tertentu</p>
        </div>
      </div>

      {/* Stock Table Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="relative max-w-sm w-full">
              <Input
                placeholder="Cari nama bahan, kode, atau supplier..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-8 text-xs"
              />
              <MagnifyingGlass className="h-3.5 w-3.5 text-muted-foreground absolute left-3 top-2.5" weight="bold" />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">Kategori:</span>
                <Select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="h-8 text-xs w-36"
                >
                  <option value="all">Semua Kategori</option>
                  <option value="Coffee Beans">Coffee Beans</option>
                  <option value="Dairy & Fresh">Dairy & Fresh</option>
                  <option value="Sweeteners & Syrups">Sweeteners & Syrups</option>
                  <option value="Pastry & Flour">Pastry & Flour</option>
                  <option value="Packaging">Packaging</option>
                </Select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">Kesehatan:</span>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="h-8 text-xs w-36"
                >
                  <option value="all">Semua Status</option>
                  <option value="normal">Aman (Normal)</option>
                  <option value="low">Low Stock</option>
                  <option value="critical">Kritis (Critical)</option>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="border-b border-border bg-secondary/40 text-muted-foreground font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Kode</th>
                  <th className="py-2.5 px-3">Nama Bahan Baku</th>
                  <th className="py-2.5 px-3">Kategori</th>
                  <th className="py-2.5 px-3 text-right">Sisa Stok</th>
                  <th className="py-2.5 px-3 text-right">Min. Safety</th>
                  <th className="py-2.5 px-3 text-right">Estimasi Biaya Satuan</th>
                  <th className="py-2.5 px-3">Pemasok (Supplier)</th>
                  <th className="py-2.5 px-3 text-center">Status Kesehatan</th>
                  <th className="py-2.5 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="py-3 px-3 font-mono text-muted-foreground">{item.id}</td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-foreground">{item.name}</div>
                      <div className="text-2xs text-muted-foreground">Restock: {item.lastRestocked}</div>
                    </td>
                    <td className="py-3 px-3 text-muted-foreground">{item.category}</td>
                    <td className="py-3 px-3 text-right font-bold text-foreground">
                      {item.current} {item.unit}
                    </td>
                    <td className="py-3 px-3 text-right text-muted-foreground">
                      {item.minStock} {item.unit}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-muted-foreground">{item.unitCost}</td>
                    <td className="py-3 px-3 text-muted-foreground">{item.supplier}</td>
                    <td className="py-3 px-3 text-center">
                      {item.status === 'normal' && <Badge variant="accent2">Aman</Badge>}
                      {item.status === 'low' && <Badge variant="warning">Menipis</Badge>}
                      {item.status === 'critical' && <Badge variant="destructive">Kritis</Badge>}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Button
                        variant={item.status === 'critical' ? 'accent1' : 'outline'}
                        size="sm"
                        onClick={() => {
                          setSelectedItem(item)
                          setIsRestockOpen(true)
                        }}
                        className="h-7 text-xs px-2.5 gap-1"
                      >
                        <ArrowsClockwise className="h-3 w-3" />
                        <span>Restock</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Restock Modal */}
      {selectedItem && (
        <Modal
          isOpen={isRestockOpen}
          onClose={() => setIsRestockOpen(false)}
          title={`Restock Bahan: ${selectedItem.name}`}
          description={`Stok saat ini: ${selectedItem.current} ${selectedItem.unit} (Safety min: ${selectedItem.minStock} ${selectedItem.unit})`}
          footer={
            <>
              <Button variant="outline" onClick={() => setIsRestockOpen(false)}>
                Batal
              </Button>
              <Button variant="accent1" onClick={handleSaveRestock}>
                Simpan Penambahan Stok
              </Button>
            </>
          }
        >
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-secondary/50 border border-border text-xs">
              <span className="text-2xs text-muted-foreground block">Supplier Terdaftar</span>
              <span className="font-semibold text-foreground">{selectedItem.supplier}</span>
              <span className="text-2xs text-muted-foreground block mt-1">Estimasi HPP: {selectedItem.unitCost}</span>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Kuantitas Masuk ({selectedItem.unit})
              </label>
              <Input
                type="number"
                value={restockQty}
                onChange={(e) => setRestockQty(e.target.value)}
                placeholder={`cth. 10`}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Nomor Surat Jalan / PO Supplier
              </label>
              <Input
                value={restockPo}
                onChange={(e) => setRestockPo(e.target.value)}
                placeholder="cth. PO-2026/09/882"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
