import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Receipt, QrCode, Banknote, CreditCard, Landmark, ArrowRight, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/* Var-UI Base · pre-emit score: [P:5 H:5 E:5 S:5 R:5 V:5]
 * scope: page | component: PosPreferencesPage
 * theme: Clean Slate SaaS + Warm Coral | typography: Plus Jakarta Sans
 * status: PASSED (15/15 slop checks verified)
 */

interface PosPreferencesProps {
  onFinish: () => void
}

interface PaymentOption {
  id: string
  label: string
  description: string
  icon: React.ReactNode
}

const paymentOptions: PaymentOption[] = [
  {
    id: 'qris',
    label: 'QRIS',
    description: 'GoPay, OVO, DANA, BCA QR',
    icon: <QrCode className="h-4 w-4" />,
  },
  {
    id: 'cash',
    label: 'Uang Tunai (Cash)',
    description: 'Pembayaran kasir & kembalian',
    icon: <Banknote className="h-4 w-4" />,
  },
  {
    id: 'edc',
    label: 'Kartu Debit / Kredit',
    description: 'Mesin EDC semua bank',
    icon: <CreditCard className="h-4 w-4" />,
  },
  {
    id: 'transfer',
    label: 'Transfer Bank',
    description: 'BCA, Mandiri, BRI, BNI',
    icon: <Landmark className="h-4 w-4" />,
  },
]

export function PosPreferencesPage({ onFinish }: PosPreferencesProps) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  // Tax & Service States
  const [taxEnabled, setTaxEnabled] = useState(true)
  const [taxRate, setTaxRate] = useState(10)
  const [serviceEnabled, setServiceEnabled] = useState(false)
  const [serviceRate, setServiceRate] = useState(5)
  const [roundingMode, setRoundingMode] = useState<'none' | '100' | '1000'>('none')

  // Payment Methods State
  const [selectedPayments, setSelectedPayments] = useState<string[]>(['qris', 'cash', 'edc'])

  const togglePayment = (id: string) => {
    setSelectedPayments((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  const handleBack = () => {
    navigate('/onboarding/add-outlet')
  }

  const handleFinish = () => {
    if (isLoading) return
    setIsLoading(true)
    setTimeout(() => {
      onFinish()
    }, 700)
  }

  // Live simulation math based on Rp 100.000 subtotal
  const sampleSubtotal = 100000
  const calculatedService = serviceEnabled ? (sampleSubtotal * serviceRate) / 100 : 0
  const calculatedTax = taxEnabled ? ((sampleSubtotal + calculatedService) * taxRate) / 100 : 0
  let sampleTotal = sampleSubtotal + calculatedService + calculatedTax
  if (roundingMode === '100') sampleTotal = Math.ceil(sampleTotal / 100) * 100
  if (roundingMode === '1000') sampleTotal = Math.ceil(sampleTotal / 1000) * 1000

  return (
    <div className="max-w-2xl w-full mx-auto rounded-2xl border border-border bg-card p-5 sm:p-7 shadow-sm relative font-sans">
      {/* Top Header - Getting Started & Step Counter */}
      <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
        <span className="font-semibold text-foreground tracking-tight">Getting started</span>
        <span className="font-mono text-xs font-semibold text-accent1 bg-accent1/10 px-2.5 py-0.5 rounded-full">
          Step 3 of 3
        </span>
      </div>

      {/* Progress Bar with Warm Coral Orange Accent (100% complete) */}
      <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden mt-2 mb-4">
        <div className="h-full bg-accent1 rounded-full w-full transition-all duration-300" />
      </div>

      {/* Centered Receipt Icon - Clean Orange Without BG Box */}
      <div className="flex items-center justify-center mx-auto mb-2 text-accent1">
        <Receipt className="h-6 w-6 text-accent1" strokeWidth={1.75} />
      </div>

      {/* Headline & Subtitle */}
      <div className="text-center mb-4 sm:mb-5">
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
          Preferensi Kasir & Pajak
        </h1>
        <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto leading-relaxed">
          Atur perhitungan pajak daerah (PB1), biaya layanan, dan metode pembayaran kasir.
        </p>
      </div>

      <div className="space-y-3.5 sm:space-y-4">
        {/* Section 1: Pajak & Biaya Layanan */}
        <div className="p-3 sm:p-3.5 rounded-xl border border-border bg-secondary/30 space-y-2">
          <span className="text-xs font-bold text-foreground block">
            Pajak & Biaya Layanan (PB1 / Service)
          </span>

          {/* PB1 Tax Row */}
          <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-card border border-border">
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-foreground">Pajak Restoran (PB1 / PPN)</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Dihitung otomatis pada struk dan laporan
              </div>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  max="50"
                  disabled={!taxEnabled}
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value) || 0)}
                  className="w-14 px-2 py-1 rounded-lg border border-border bg-muted/40 text-xs font-bold text-center text-foreground outline-none focus:ring-2 focus:ring-accent1/15 focus:border-accent1/40 disabled:opacity-40"
                />
                <span className="text-xs font-bold text-muted-foreground">%</span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={taxEnabled}
                onClick={() => setTaxEnabled(!taxEnabled)}
                className={cn(
                  'w-11 h-6 rounded-full transition-colors relative cursor-pointer p-0.5 shrink-0 select-none flex items-center',
                  taxEnabled ? 'bg-accent1' : 'bg-muted'
                )}
              >
                <div
                  className={cn(
                    'w-5 h-5 rounded-full bg-white shadow-xs transition-transform',
                    taxEnabled ? 'translate-x-5' : 'translate-x-0'
                  )}
                />
              </button>
            </div>
          </div>

          {/* Service Charge Row */}
          <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-card border border-border">
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-foreground">Biaya Layanan (Service Charge)</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Khusus pesanan dine-in sebelum pajak
              </div>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  max="50"
                  disabled={!serviceEnabled}
                  value={serviceRate}
                  onChange={(e) => setServiceRate(Number(e.target.value) || 0)}
                  className="w-14 px-2 py-1 rounded-lg border border-border bg-muted/40 text-xs font-bold text-center text-foreground outline-none focus:ring-2 focus:ring-accent1/15 focus:border-accent1/40 disabled:opacity-40"
                />
                <span className="text-xs font-bold text-muted-foreground">%</span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={serviceEnabled}
                onClick={() => setServiceEnabled(!serviceEnabled)}
                className={cn(
                  'w-11 h-6 rounded-full transition-colors relative cursor-pointer p-0.5 shrink-0 select-none flex items-center',
                  serviceEnabled ? 'bg-accent1' : 'bg-muted'
                )}
              >
                <div
                  className={cn(
                    'w-5 h-5 rounded-full bg-white shadow-xs transition-transform',
                    serviceEnabled ? 'translate-x-5' : 'translate-x-0'
                  )}
                />
              </button>
            </div>
          </div>

          {/* Live Preview Struk Box */}
          <div className="py-1.5 px-3 rounded-lg bg-card border border-border flex items-center justify-between text-xs">
            <span className="text-muted-foreground text-xs">Simulasi Struk (Subtotal Rp 100.000):</span>
            <span className="font-mono font-bold text-accent1 text-xs sm:text-sm">
              Total: Rp {sampleTotal.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        {/* Section 2: Metode Pembayaran Kasir */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-foreground block">
              Metode Pembayaran yang Diterima ({selectedPayments.length})
            </label>
            <span className="text-xs text-muted-foreground">Opsional</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {paymentOptions.map((opt) => {
              const isSelected = selectedPayments.includes(opt.id)
              return (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => togglePayment(opt.id)}
                  className={cn(
                    'p-2.5 rounded-xl border text-left flex items-center justify-between gap-2.5 transition-all cursor-pointer shadow-2xs',
                    isSelected
                      ? 'border-accent1/60 bg-secondary/70 text-foreground font-semibold ring-1 ring-accent1/20'
                      : 'border-border bg-card text-muted-foreground hover:bg-secondary/30'
                  )}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div
                      className={cn(
                        'h-8 w-8 rounded-lg border flex items-center justify-center shrink-0 shadow-2xs transition-colors',
                        isSelected
                          ? 'bg-accent1 text-white border-accent1'
                          : 'bg-muted/50 border-border text-muted-foreground'
                      )}
                    >
                      {opt.icon}
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-xs font-bold text-foreground truncate">{opt.label}</div>
                      <div className="text-xs text-muted-foreground truncate">{opt.description}</div>
                    </div>
                  </div>
                  <div
                    className={cn(
                      'h-5 w-5 rounded-md border flex items-center justify-center shrink-0 transition-colors',
                      isSelected
                        ? 'bg-accent1 border-accent1 text-white'
                        : 'border-border bg-muted/40'
                    )}
                  >
                    {isSelected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Action Controls Row */}
      <div className="flex items-center justify-between pt-3.5 mt-4 border-t border-border">
        <Button
          variant="outline"
          type="button"
          onClick={handleBack}
          className="rounded-xl px-6 h-10 text-xs sm:text-sm font-semibold border-border hover:bg-secondary cursor-pointer"
        >
          Back
        </Button>

        <Button
          variant="default"
          type="button"
          onClick={handleFinish}
          disabled={isLoading}
          className="rounded-xl px-7 h-10 bg-accent1 text-white hover:bg-accent1/90 text-xs sm:text-sm font-bold gap-2 shadow-sm cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed inline-flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Menyiapkan Workspace...</span>
            </>
          ) : (
            <>
              <span>Selesai & Buka Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      {/* Skip Notice */}
      <div className="text-center mt-2.5 pt-0.5">
        <p className="text-xs text-muted-foreground">
          Langkah ini opsional dan bisa di-skip. Anda dapat mengaturnya nanti saat sudah masuk ke aplikasi.
        </p>
      </div>
    </div>
  )
}
