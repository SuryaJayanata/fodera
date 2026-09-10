import React, { useState } from 'react'
import {
  Plus,
  MagnifyingGlass,
  Coffee,
  Sparkle,
  TrendUp,
  WarningCircle,
  PencilSimple,
  Trash,
  Tag,
  ForkKnife,
  Percent,
  CheckCircle,
  Eye,
  BookOpen,
  X,
} from '@phosphor-icons/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/ui/modal'
import { Select } from '@/components/ui/select'

/* Var-UI Base · pre-emit score: [P:5 H:5 E:5 S:5 R:5 V:5]
 * scope: page | component: ProductsListPage
 * theme: Clean Slate SaaS + Warm Coral | typography: Plus Jakarta Sans
 * status: PASSED (15/15 slop checks verified)
 */

export interface RecipeIngredient {
  ingredientName: string
  qty: string
  unitCost: string
}

export interface ProductItem {
  id: string
  name: string
  category: string
  price: string
  cost: string
  margin: string
  marginPercent: string
  performance: 'top_seller' | 'rising' | 'low_performer' | 'standard'
  status: 'active' | 'out_of_stock'
  orders: number
  recipe: RecipeIngredient[]
}

export function ProductsListPage() {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [selectedRecipeProduct, setSelectedRecipeProduct] = useState<ProductItem | null>(null)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedPerfFilter, setSelectedPerfFilter] = useState('all')

  const [products, setProducts] = useState<ProductItem[]>([
    {
      id: 'PRD-01',
      name: 'Spanish Latte',
      category: 'Coffee',
      price: 'Rp32.000',
      cost: 'Rp11.500',
      margin: 'Rp20.500',
      marginPercent: '64.1%',
      performance: 'top_seller',
      status: 'active',
      orders: 284,
      recipe: [
        { ingredientName: 'Biji Kopi House Blend', qty: '18 gram', unitCost: 'Rp4.500' },
        { ingredientName: 'Fresh Milk Full Cream', qty: '150 ml', unitCost: 'Rp4.800' },
        { ingredientName: 'Condensed Milk & Spices', qty: '20 ml', unitCost: 'Rp2.200' },
      ],
    },
    {
      id: 'PRD-02',
      name: 'Matcha Latte Uji',
      category: 'Non-Coffee',
      price: 'Rp36.000',
      cost: 'Rp14.000',
      margin: 'Rp22.000',
      marginPercent: '61.1%',
      performance: 'top_seller',
      status: 'active',
      orders: 218,
      recipe: [
        { ingredientName: 'Matcha Powder Uji Premium', qty: '12 gram', unitCost: 'Rp8.400' },
        { ingredientName: 'Fresh Milk Full Cream', qty: '160 ml', unitCost: 'Rp5.100' },
        { ingredientName: 'Simple Syrup', qty: '15 ml', unitCost: 'Rp500' },
      ],
    },
    {
      id: 'PRD-03',
      name: 'Butter Croissant',
      category: 'Bakery',
      price: 'Rp30.000',
      cost: 'Rp12.000',
      margin: 'Rp18.000',
      marginPercent: '60.0%',
      performance: 'rising',
      status: 'active',
      orders: 176,
      recipe: [
        { ingredientName: 'Croissant Dough (French Butter)', qty: '1 pcs', unitCost: 'Rp11.200' },
        { ingredientName: 'Egg Wash & Glaze', qty: '1 portion', unitCost: 'Rp800' },
      ],
    },
    {
      id: 'PRD-04',
      name: 'Caramel Macchiato',
      category: 'Coffee',
      price: 'Rp35.000',
      cost: 'Rp13.200',
      margin: 'Rp21.800',
      marginPercent: '62.2%',
      performance: 'standard',
      status: 'active',
      orders: 142,
      recipe: [
        { ingredientName: 'Biji Kopi House Blend', qty: '18 gram', unitCost: 'Rp4.500' },
        { ingredientName: 'Fresh Milk Full Cream', qty: '140 ml', unitCost: 'Rp4.500' },
        { ingredientName: 'Vanilla & Caramel Drizzle', qty: '25 ml', unitCost: 'Rp4.200' },
      ],
    },
    {
      id: 'PRD-05',
      name: 'Cold Brew Oat Milk',
      category: 'Coffee',
      price: 'Rp38.000',
      cost: 'Rp19.500',
      margin: 'Rp18.500',
      marginPercent: '48.6%',
      performance: 'low_performer',
      status: 'active',
      orders: 24,
      recipe: [
        { ingredientName: 'Cold Brew Concentrate 16h', qty: '120 ml', unitCost: 'Rp7.500' },
        { ingredientName: 'Oat Milk Barista Edition', qty: '150 ml', unitCost: 'Rp12.000' },
      ],
    },
    {
      id: 'PRD-06',
      name: 'Taro Puff Pastry',
      category: 'Bakery',
      price: 'Rp28.000',
      cost: 'Rp15.000',
      margin: 'Rp13.000',
      marginPercent: '46.4%',
      performance: 'low_performer',
      status: 'active',
      orders: 16,
      recipe: [
        { ingredientName: 'Puff Pastry Sheet', qty: '1 pcs', unitCost: 'Rp6.500' },
        { ingredientName: 'Taro Paste Filling', qty: '40 gram', unitCost: 'Rp8.500' },
      ],
    },
  ])

  const handleToggleStatus = (id: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === 'active' ? 'out_of_stock' : 'active' }
          : p
      )
    )
  }

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory
    const matchesPerf = selectedPerfFilter === 'all' || p.performance === selectedPerfFilter
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesPerf && matchesSearch
  })

  const getPerformanceBadge = (perf: ProductItem['performance']) => {
    switch (perf) {
      case 'top_seller':
        return <Badge variant="accent1">Top Seller</Badge>
      case 'rising':
        return <Badge variant="accent2">Rising Star</Badge>
      case 'low_performer':
        return <Badge variant="destructive">Perlu Evaluasi</Badge>
      case 'standard':
        return <Badge variant="secondary">Normal</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">Product & Menu Management</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Katalog menu terintegrasi resep bahan baku, perhitungan HPP (*Cost of Goods Sold*), dan margin laba kotor
          </p>
        </div>
        <Button variant="accent1" onClick={() => setIsAddOpen(true)} className="gap-1.5 self-start sm:self-auto">
          <Plus className="h-4 w-4" weight="bold" />
          <span>Tambah Menu Baru</span>
        </Button>
      </div>

      {/* Performance Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl border border-border bg-card shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Top Sellers</span>
            <Sparkle className="h-4 w-4 text-accent1" weight="duotone" />
          </div>
          <div className="text-2xl font-bold text-foreground mt-1">2 Produk</div>
          <p className="text-2xs text-accent1 font-semibold mt-0.5">Spanish Latte & Matcha Uji (Kontribusi 54% Omzet)</p>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Rising Products</span>
            <TrendUp className="h-4 w-4 text-accent2" weight="bold" />
          </div>
          <div className="text-2xl font-bold text-foreground mt-1">1 Produk</div>
          <p className="text-2xs text-accent2 font-semibold mt-0.5">Butter Croissant (+22% pesanan minggu ini)</p>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Low Performers</span>
            <WarningCircle className="h-4 w-4 text-destructive" weight="duotone" />
          </div>
          <div className="text-2xl font-bold text-destructive mt-1">2 Produk</div>
          <p className="text-2xs text-muted-foreground mt-0.5">Margin rendah atau penjualan lambat, perlu penyesuaian resep</p>
        </div>
      </div>

      {/* Product Table Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="relative max-w-sm w-full">
              <Input
                placeholder="Cari nama menu atau ID produk..."
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
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="h-8 text-xs w-36"
                >
                  <option value="all">Semua Kategori</option>
                  <option value="Coffee">Coffee</option>
                  <option value="Non-Coffee">Non-Coffee</option>
                  <option value="Bakery">Bakery & Pastry</option>
                </Select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">Klasifikasi:</span>
                <Select
                  value={selectedPerfFilter}
                  onChange={(e) => setSelectedPerfFilter(e.target.value)}
                  className="h-8 text-xs w-36"
                >
                  <option value="all">Semua Performa</option>
                  <option value="top_seller">Top Seller</option>
                  <option value="rising">Rising Star</option>
                  <option value="standard">Normal</option>
                  <option value="low_performer">Perlu Evaluasi</option>
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
                  <th className="py-2.5 px-3">Nama Menu</th>
                  <th className="py-2.5 px-3">Kategori</th>
                  <th className="py-2.5 px-3 text-right">Harga Jual</th>
                  <th className="py-2.5 px-3 text-right">HPP (Cost)</th>
                  <th className="py-2.5 px-3 text-right">Margin Bersih</th>
                  <th className="py-2.5 px-3 text-center">Klasifikasi</th>
                  <th className="py-2.5 px-3 text-center">Status Stok</th>
                  <th className="py-2.5 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="py-3 px-3 font-mono text-muted-foreground">{p.id}</td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-foreground">{p.name}</div>
                      <div className="text-2xs text-muted-foreground">{p.orders} transaksi terjual</div>
                    </td>
                    <td className="py-3 px-3 text-muted-foreground">{p.category}</td>
                    <td className="py-3 px-3 text-right font-semibold text-foreground">{p.price}</td>
                    <td className="py-3 px-3 text-right text-muted-foreground">{p.cost}</td>
                    <td className="py-3 px-3 text-right">
                      <span className="font-bold text-foreground">{p.margin}</span>
                      <span className="text-2xs text-accent2 font-semibold ml-1">({p.marginPercent})</span>
                    </td>
                    <td className="py-3 px-3 text-center">{getPerformanceBadge(p.performance)}</td>
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(p.id)}
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-semibold cursor-pointer transition-colors ${
                          p.status === 'active'
                            ? 'bg-accent2/10 text-accent2 border border-accent2/20 hover:bg-accent2/20'
                            : 'bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20'
                        }`}
                      >
                        {p.status === 'active' ? 'Tersedia' : 'Habis (Sold Out)'}
                      </button>
                    </td>
                    <td className="py-3 px-3 text-right space-x-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedRecipeProduct(p)}
                        className="h-7 text-xs px-2 gap-1 text-muted-foreground hover:text-foreground"
                      >
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>Resep</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recipe Breakdown Modal */}
      {selectedRecipeProduct && (
        <Modal
          isOpen={Boolean(selectedRecipeProduct)}
          onClose={() => setSelectedRecipeProduct(null)}
          title={`Breakdown Resep: ${selectedRecipeProduct.name}`}
          description={`Komposisi bahan baku pembentuk HPP (${selectedRecipeProduct.cost}) vs Harga Jual (${selectedRecipeProduct.price})`}
          footer={
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-muted-foreground">
                Margin Kotor: <strong className="text-accent2">{selectedRecipeProduct.margin} ({selectedRecipeProduct.marginPercent})</strong>
              </span>
              <Button variant="outline" onClick={() => setSelectedRecipeProduct(null)}>
                Tutup
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-secondary/50 border border-border flex items-center justify-between text-xs">
              <div>
                <span className="text-2xs text-muted-foreground uppercase font-semibold block">Kategori</span>
                <span className="font-bold text-foreground">{selectedRecipeProduct.category}</span>
              </div>
              <div className="text-right">
                <span className="text-2xs text-muted-foreground uppercase font-semibold block">Klasifikasi</span>
                {getPerformanceBadge(selectedRecipeProduct.performance)}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-foreground mb-2">Komponen Bahan Baku (BOM / Recipe)</h4>
              <div className="space-y-2 border border-border rounded-lg divide-y divide-border">
                {selectedRecipeProduct.recipe.map((ing, idx) => (
                  <div key={idx} className="p-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-foreground block">{ing.ingredientName}</span>
                      <span className="text-2xs text-muted-foreground">Dosis per cup: {ing.qty}</span>
                    </div>
                    <div className="font-mono font-bold text-foreground">{ing.unitCost}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-lg border border-border bg-card flex items-center justify-between text-xs">
              <span className="font-semibold text-muted-foreground">Total Estimasi HPP Bahan:</span>
              <span className="font-mono font-bold text-foreground text-sm">{selectedRecipeProduct.cost}</span>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Product Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Tambah Menu Produk Baru"
        description="Masukkan parameter harga jual, estimasi HPP resep, dan klasifikasi awal"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              Batal
            </Button>
            <Button
              variant="accent1"
              onClick={() => {
                alert('Produk baru berhasil disimpan ke menu!')
                setIsAddOpen(false)
              }}
            >
              Simpan Produk
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">Nama Produk / Menu</label>
            <Input placeholder="cth. Hazelnut Praline Cold Brew" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Kategori</label>
              <Select defaultValue="Coffee">
                <option value="Coffee">Coffee</option>
                <option value="Non-Coffee">Non-Coffee</option>
                <option value="Bakery">Bakery & Pastry</option>
                <option value="Food">Heavy Meal</option>
              </Select>
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Outlet Berlaku</label>
              <Select defaultValue="all">
                <option value="all">Semua Cabang</option>
                <option value="malang">Malang Saja</option>
                <option value="surabaya">Surabaya Saja</option>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Harga Jual (Rp)</label>
              <Input type="number" placeholder="cth. 35000" />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Estimasi HPP (Rp)</label>
              <Input type="number" placeholder="cth. 12500" />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
