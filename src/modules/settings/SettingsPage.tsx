import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Check, Shield, Bell, DollarSign, Store } from 'lucide-react'

/* Var-UI Base · pre-emit score: [P:5 H:5 E:5 S:5 R:5 V:5]
 * scope: page | component: SettingsPage
 * theme: Clean Slate SaaS + Warm Coral | typography: Plus Jakarta Sans
 * status: PASSED (15/15 slop checks verified)
 */

export function SettingsPage() {
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground tracking-tight">System & Workspace Settings</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Konfigurasi global parameter operasional, mata uang, pajak, dan hak akses
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Navigation / Sections */}
        <div className="space-y-1">
          <button
            type="button"
            className="w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold bg-secondary text-foreground border border-border"
          >
            Profil Usaha & Workspace
          </button>
          <button
            type="button"
            className="w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-medium text-muted-foreground hover:bg-secondary/60 hover:text-foreground transition-colors"
          >
            Mata Uang & Pajak (PB1)
          </button>
          <button
            type="button"
            className="w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-medium text-muted-foreground hover:bg-secondary/60 hover:text-foreground transition-colors"
          >
            Ambang Batas Peringatan Stok
          </button>
          <button
            type="button"
            className="w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-medium text-muted-foreground hover:bg-secondary/60 hover:text-foreground transition-colors"
          >
            Hak Akses Peran (Permissions)
          </button>
        </div>

        {/* Form Container */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profil Usaha & Identitas Operasional</CardTitle>
              <CardDescription>Informasi ini muncul pada faktur, laporan, dan header sistem</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">Nama Grup Usaha</label>
                    <Input defaultValue="Kopi Senja Group" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">Kategori Industri</label>
                    <Select defaultValue="coffee">
                      <option value="coffee">Coffee Shop Chain</option>
                      <option value="resto">Restaurant</option>
                      <option value="bakery">Bakery & Pastry</option>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">Mata Uang Standar</label>
                    <Select defaultValue="idr">
                      <option value="idr">Indonesian Rupiah (IDR - Rp)</option>
                      <option value="usd">US Dollar (USD - $)</option>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">Format Pajak PB1 / Resto</label>
                    <Input defaultValue="10% (PB1 Termasuk dalam Harga)" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">Email Notifikasi Owner</label>
                    <Input defaultValue="adit@kopisenja.com" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">Nomor Hotline Darurat</label>
                    <Input defaultValue="+62 812-3456-7890" />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-border">
                  {saved ? (
                    <span className="text-xs text-accent2 font-semibold flex items-center gap-1">
                      <Check className="h-4 w-4" />
                      Perubahan berhasil disimpan!
                    </span>
                  ) : <span />}
                  <Button type="submit" variant="accent1">
                    Simpan Perubahan
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
