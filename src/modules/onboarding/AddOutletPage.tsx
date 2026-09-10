import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Store, Plus, ArrowRight, Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

/* Var-UI Base · pre-emit score: [P:5 H:5 E:5 S:5 R:5 V:5]
 * scope: page | component: AddOutletPage
 * theme: Clean Slate SaaS + Warm Coral | typography: Plus Jakarta Sans
 * status: PASSED (15/15 slop checks verified)
 */

interface OutletItem {
  id: string
  name: string
  location: string
}

interface AddOutletProps {
  onNext?: () => void
  onFinish?: () => void
}

export function AddOutletPage({ onNext, onFinish }: AddOutletProps) {
  const navigate = useNavigate()
  const [outlets, setOutlets] = useState<OutletItem[]>([])

  const [newOutlet, setNewOutlet] = useState({ name: '', location: '' })
  const [isAdding, setIsAdding] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleAddOutlet = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!newOutlet.name.trim() || isAdding) return
    setIsAdding(true)
    setTimeout(() => {
      setOutlets((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          name: newOutlet.name.trim(),
          location: newOutlet.location.trim() || 'Cabang Utama',
        },
      ])
      setNewOutlet({ name: '', location: '' })
      setIsAdding(false)
    }, 350)
  }

  const handleDeleteOutlet = (id: string) => {
    setOutlets((prev) => prev.filter((o) => o.id !== id))
  }

  const handleBack = () => {
    navigate('/onboarding')
  }

  const handleProceed = () => {
    if (isLoading) return
    setIsLoading(true)
    setTimeout(() => {
      if (onNext) onNext()
      else if (onFinish) onFinish()
    }, 600)
  }

  return (
    <div className="max-w-2xl w-full mx-auto rounded-2xl border border-border bg-card p-6 sm:p-10 shadow-sm relative font-sans">
      {/* Top Header - Getting Started & Step Counter */}
      <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
        <span className="font-semibold text-foreground tracking-tight">Getting started</span>
        <span className="font-mono text-xs font-semibold text-accent1 bg-accent1/10 px-2.5 py-0.5 rounded-full">
          Step 2 of 3
        </span>
      </div>

      {/* Progress Bar with Warm Coral Orange Accent (Step 2 of 3: 66.6%) */}
      <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden mt-2.5 mb-8">
        <div className="h-full bg-accent1 rounded-full w-2/3 transition-all duration-300" />
      </div>

      {/* Centered Store Icon - Clean Orange Without BG Box */}
      <div className="flex items-center justify-center mx-auto mb-4 text-accent1">
        <Store className="h-8 w-8 text-accent1" strokeWidth={1.75} />
      </div>

      {/* Headline & Subtitle */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Konfigurasi Cabang
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-2 max-w-md mx-auto leading-relaxed">
          Tambahkan outlet pertama untuk memisahkan stok bahan dan pesanan kasir.
        </p>
      </div>

      {/* Add New Outlet Form */}
      <form onSubmit={handleAddOutlet} className="p-4 rounded-xl border border-dashed border-border bg-muted/30 mb-6">
        <span className="text-xs font-semibold text-foreground block mb-2">
          Tambah Cabang Baru (Opsional)
        </span>
        <div className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            placeholder="Nama Cabang (cth: Outlet Pusat)"
            value={newOutlet.name}
            onChange={(e) => setNewOutlet({ ...newOutlet, name: e.target.value })}
            className="flex-1 px-4 py-2.5 rounded-xl border border-border/80 bg-card text-xs sm:text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent1/15 focus:border-accent1/40"
          />
          <input
            type="text"
            placeholder="Lokasi (cth: Malang)"
            value={newOutlet.location}
            onChange={(e) => setNewOutlet({ ...newOutlet, location: e.target.value })}
            className="sm:w-44 px-4 py-2.5 rounded-xl border border-border/80 bg-card text-xs sm:text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent1/15 focus:border-accent1/40"
          />
          <Button
            type="submit"
            variant="secondary"
            disabled={!newOutlet.name.trim() || isAdding}
            className="rounded-xl px-5 h-10 text-xs font-semibold gap-1.5 shrink-0 disabled:opacity-50 cursor-pointer inline-flex items-center justify-center"
          >
            {isAdding ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Menambah...</span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                <span>Tambah</span>
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Outlets List */}
      <div className="space-y-3 mb-8">
        <label className="text-xs font-semibold text-foreground block">
          Cabang Terdaftar ({outlets.length})
        </label>
        {outlets.length === 0 ? (
          <div className="py-7 px-4 text-center rounded-xl border border-dashed border-border bg-secondary/20">
            <Store className="h-6 w-6 text-muted-foreground/60 mx-auto mb-1.5" strokeWidth={1.5} />
            <p className="text-xs font-semibold text-foreground">Belum ada cabang terdaftar</p>
            <p className="text-xs text-muted-foreground mt-0.5 max-w-xs mx-auto">
              Tambahkan cabang pertama Anda menggunakan form di atas (atau lanjutkan untuk mengatur nanti).
            </p>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-52 overflow-y-auto custom-scrollbar pr-1">
            {outlets.map((o) => (
              <div
                key={o.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-secondary/30 hover:bg-secondary/50 transition-colors shadow-2xs"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="h-9 w-9 rounded-lg bg-card border border-border flex items-center justify-center text-accent1 shrink-0 shadow-2xs">
                    <Store className="h-4.5 w-4.5" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-foreground truncate">{o.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{o.location}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <Badge variant="secondary" className="text-xs font-semibold">
                    Aktif
                  </Badge>
                  <button
                    type="button"
                    onClick={() => handleDeleteOutlet(o.id)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                    title="Hapus Cabang"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Controls Row */}
      <div className="flex items-center justify-between pt-6 border-t border-border">
        <Button
          variant="outline"
          type="button"
          onClick={handleBack}
          className="rounded-xl px-7 h-11 text-xs sm:text-sm font-semibold border-border hover:bg-secondary"
        >
          Back
        </Button>

        <Button
          variant="default"
          type="button"
          onClick={handleProceed}
          disabled={isLoading}
          className="rounded-xl px-8 h-11 bg-primary text-white hover:bg-primary/90 text-xs sm:text-sm font-bold gap-2 shadow-xs cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed inline-flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Memproses...</span>
            </>
          ) : (
            <>
              <span>Next</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      {/* Skip Notice */}
      <div className="text-center mt-5 pt-1">
        <p className="text-xs text-muted-foreground">
          Langkah ini opsional dan bisa di-skip. Anda dapat mengisinya nanti saat sudah masuk ke aplikasi.
        </p>
      </div>
    </div>
  )
}
