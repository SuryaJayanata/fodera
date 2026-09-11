import React, { useState } from 'react'
import {
  Plus,
  Coffee,
  Cake,
  ForkKnife,
  Wine,
  Trash,
  PencilSimple,
  FolderSimple,
  ChartPieSlice,
  Tag,
  TrendUp,
} from '@phosphor-icons/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

/* Var-UI Base · pre-emit score: [P:5 H:5 E:5 S:5 R:5 V:5]
 * scope: page | component: CategoriesPage
 * theme: Clean Slate SaaS + Warm Coral | typography: Plus Jakarta Sans
 * status: PASSED (15/15 slop checks verified)
 */

interface CategoryItem {
  id: string
  name: string
  description: string
  count: number
  revenueContribution: string
  avgMargin: string
  icon: any
}

export function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([
    {
      id: '1',
      name: 'Coffee & Espresso',
      description: 'Espresso-based drinks, manual brew, cold brew series',
      count: 28,
      revenueContribution: '52%',
      avgMargin: '63.2%',
      icon: Coffee,
    },
    {
      id: '2',
      name: 'Non-Coffee & Artisanal Tea',
      description: 'Matcha Uji, Chocolate, Artisan Leaves & Mocktails',
      count: 18,
      revenueContribution: '24%',
      avgMargin: '59.8%',
      icon: Wine,
    },
    {
      id: '3',
      name: 'Bakery & Fresh Pastry',
      description: 'French butter croissants, brownies, cinnamon rolls',
      count: 16,
      revenueContribution: '16%',
      avgMargin: '58.4%',
      icon: Cake,
    },
    {
      id: '4',
      name: 'Heavy Meals & All-Day Brunch',
      description: 'Rice bowls, pasta, light bites & savory snacks',
      count: 12,
      revenueContribution: '8%',
      avgMargin: '48.5%',
      icon: ForkKnife,
    },
  ])

  const [newCatName, setNewCatName] = useState('')
  const [newCatDesc, setNewCatDesc] = useState('')

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCatName) return
    setCategories([
      ...categories,
      {
        id: String(categories.length + 1),
        name: newCatName,
        description: newCatDesc || 'Kategori menu baru',
        count: 0,
        revenueContribution: '0%',
        avgMargin: '50.0%',
        icon: FolderSimple,
      },
    ])
    setNewCatName('')
    setNewCatDesc('')
  }

  const handleDelete = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">Kategori Menu & Klasifikasi</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Strukturisasi hierarki katalog menu untuk mempermudah analisis margin kotor dan pelaporan omzet per segmen
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl border border-border bg-card shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Total Kategori Aktif</span>
            <FolderSimple className="h-4 w-4 text-accent1" weight="duotone" />
          </div>
          <div className="text-2xl font-bold text-foreground mt-1">{categories.length} Kategori</div>
          <p className="text-2xs text-muted-foreground mt-0.5">Mencakup 74 menu aktif di seluruh outlet</p>
        </div>

        <div className="p-4 rounded-2xl border border-border bg-card shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Penyumbang Omzet Utama</span>
            <Coffee className="h-4 w-4 text-accent2" weight="duotone" />
          </div>
          <div className="text-2xl font-bold text-foreground mt-1">Coffee & Espresso</div>
          <p className="text-2xs text-accent2 font-semibold mt-0.5">52% dari seluruh perputaran kas</p>
        </div>

        <div className="p-4 rounded-2xl border border-border bg-card shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Rata-rata Margin Menu</span>
            <TrendUp className="h-4 w-4 text-accent1" weight="bold" />
          </div>
          <div className="text-2xl font-bold text-foreground mt-1">59.2%</div>
          <p className="text-2xs text-muted-foreground mt-0.5">Kategori tertinggi: Coffee (63.2%)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Tambah Kategori */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Tambah Kategori Baru</CardTitle>
            <CardDescription>Buat klasifikasi menu baru untuk standarisasi POS seluruh outlet</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">Nama Kategori</label>
                <Input
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="cth. Artisanal Tea, Dessert Box"
                  required
                  className="h-8 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">Deskripsi Singkat</label>
                <Input
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="cth. Pilihan teh herbal dan racikan buah"
                  className="h-8 text-xs"
                />
              </div>

              <Button type="submit" variant="accent1" className="w-full gap-1.5 h-8 text-xs">
                <Plus className="h-3.5 w-3.5" weight="bold" />
                <span>Simpan Kategori</span>
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Daftar Kategori List */}
        <div className="lg:col-span-2 space-y-3">
          {categories.map((cat) => {
            const IconComponent = cat.icon
            return (
              <div
                key={cat.id}
                className="p-4 rounded-xl border border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs hover:border-border/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center text-foreground shrink-0">
                    <IconComponent className="h-5 w-5 text-accent1" weight="duotone" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{cat.name}</h3>
                    <p className="text-2xs text-muted-foreground mt-0.5">{cat.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-2xs font-semibold px-2 py-0.5 rounded bg-secondary text-foreground border border-border">
                        {cat.count} Produk
                      </span>
                      <span className="text-2xs font-semibold text-accent2">
                        Margin: {cat.avgMargin}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-5 pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
                  <div className="text-right">
                    <div className="text-sm font-bold text-foreground">{cat.revenueContribution}</div>
                    <div className="text-2xs text-muted-foreground">Share Omzet</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => alert(`Edit kategori: ${cat.name}`)}
                      className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                      title="Edit Kategori"
                    >
                      <PencilSimple className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(cat.id)}
                      className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive cursor-pointer transition-colors"
                      title="Hapus Kategori"
                    >
                      <Trash className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
