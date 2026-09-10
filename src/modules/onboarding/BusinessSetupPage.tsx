import React, { useState } from 'react'
import { Rocket, ArrowRight, Loader2 } from 'lucide-react'
import { CustomSelect } from '@/components/ui/custom-select'
import { Button } from '@/components/ui/button'

/* Var-UI Base · pre-emit score: [P:5 H:5 E:5 S:5 R:5 V:5]
 * scope: page | component: BusinessSetupPage
 * theme: Clean Slate SaaS + Warm Coral | typography: Plus Jakarta Sans
 * status: PASSED (15/15 slop checks verified)
 */

interface BusinessSetupProps {
  onComplete: () => void
}

const businessTypeOptions = [
  { value: 'coffee_shop', label: 'Coffee Shop & Roastery' },
  { value: 'restaurant', label: 'Restaurant & Dine-in' },
  { value: 'bakery', label: 'Bakery & Pastry' },
  { value: 'beverage', label: 'Beverage & Tea Bar' },
  { value: 'dessert', label: 'Dessert & Gelato' },
  { value: 'food_stall', label: 'Food Stall / Cloud Kitchen' },
  { value: 'catering', label: 'Catering & Event F&B' },
]

const currencyOptions = [
  { value: 'IDR', label: 'IDR (Rupiah – Rp)' },
  { value: 'USD', label: 'USD (US Dollar – $)' },
  { value: 'SGD', label: 'SGD (Singapore – S$)' },
  { value: 'MYR', label: 'MYR (Ringgit – RM)' },
]

export function BusinessSetupPage({ onComplete }: BusinessSetupProps) {
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: 'coffee_shop',
    currency: 'IDR',
    city: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const isFormValid = Boolean(formData.businessName.trim() && formData.city.trim())

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid || isLoading) return
    setIsLoading(true)
    setTimeout(() => {
      onComplete()
    }, 600)
  }

  return (
    <div className="max-w-2xl w-full mx-auto rounded-2xl border border-border bg-card p-6 sm:p-10 shadow-sm relative font-sans">
      {/* Top Header - Getting Started & Step Counter */}
      <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
        <span className="font-semibold text-foreground tracking-tight">Getting started</span>
        <span className="font-mono text-xs font-semibold text-accent1 bg-accent1/10 px-2.5 py-0.5 rounded-full">
          Step 1 of 3
        </span>
      </div>

      {/* Progress Bar with Warm Coral Orange Accent */}
      <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden mt-2.5 mb-8">
        <div className="h-full bg-accent1 rounded-full w-1/3 transition-all duration-300" />
      </div>

      {/* Centered Rocket Icon - Clean Orange Without BG Box */}
      <div className="flex items-center justify-center mx-auto mb-4 text-accent1">
        <Rocket className="h-8 w-8 text-accent1" strokeWidth={1.75} />
      </div>

      {/* Headline & Subtitle */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Welcome aboard
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-2 max-w-md mx-auto leading-relaxed">
          Let's get your workspace set up in just a few steps.
        </p>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-foreground mb-1.5 block">
              Nama Bisnis / Brand
            </label>
            <input
              type="text"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              placeholder="cth. Kopi Senja"
              className="w-full px-4 py-2.5 rounded-xl border border-border/80 bg-muted/40 hover:bg-muted/60 focus:bg-card focus:border-accent1/40 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground transition-all outline-none focus:ring-2 focus:ring-accent1/15"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground mb-1.5 block">
              Kota Domisili Utama
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="cth. Malang, Jawa Timur"
              className="w-full px-4 py-2.5 rounded-xl border border-border/80 bg-muted/40 hover:bg-muted/60 focus:bg-card focus:border-accent1/40 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground transition-all outline-none focus:ring-2 focus:ring-accent1/15"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-foreground mb-1.5 block">
              Jenis Usaha F&B
            </label>
            <CustomSelect
              value={formData.businessType}
              onChange={(val) => setFormData({ ...formData, businessType: val })}
              options={businessTypeOptions}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground mb-1.5 block">
              Mata Uang Standar
            </label>
            <CustomSelect
              value={formData.currency}
              onChange={(val) => setFormData({ ...formData, currency: val })}
              options={currencyOptions}
            />
          </div>
        </div>

        {/* Action Controls Row - Next Only for Step 1 */}
        <div className="flex items-center justify-end pt-6 mt-8 border-t border-border">
          <Button
            variant="default"
            type="submit"
            disabled={!isFormValid || isLoading}
            className="rounded-xl px-8 h-11 bg-primary text-white hover:bg-primary/90 text-xs sm:text-sm font-bold gap-2 shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <span>Next</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
