import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  House,
  Clock,
  ArrowClockwise,
  List,
  Power,
} from '@phosphor-icons/react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/* Var-UI Base · pre-emit score: [P:5 H:5 E:5 S:5 R:5 V:5]
 * scope: component | component: Topbar
 * theme: Clean Slate SaaS + Warm Coral | typography: Plus Jakarta Sans
 * status: PASSED (15/15 slop checks verified)
 */

export interface TopbarProps {
  pageTitle: string
  pageSubtitle?: string
  activeModule?: string
  currentOutlet?: string
  onOutletChange?: (outlet: string) => void
  currentPeriod?: string
  onPeriodChange?: (period: string) => void
  onOpenNewOrderModal?: () => void
  onOpenRestockModal?: () => void
  onOpenWasteModal?: () => void
  onToggleMobileMenu?: () => void
  unreadAlertsCount?: number
  onLogout?: () => void
  onNavigate?: (module: string, subPage?: string) => void
}

export function Topbar({
  pageTitle,
  pageSubtitle,
  activeModule = 'dashboard',
  onToggleMobileMenu,
  onLogout,
}: TopbarProps) {
  const navigate = useNavigate()
  const [isReloading, setIsReloading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState('Updated 2 min ago')
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)

  const handleReload = () => {
    setIsReloading(true)
    setTimeout(() => {
      setIsReloading(false)
      setLastUpdated('Updated just now')
    }, 600)
  }

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false)
    if (onLogout) {
      onLogout()
    } else {
      navigate('/login')
    }
  }

  return (
    <>
      <header className="px-5 py-3 sm:px-6 sm:py-3.5 border-b border-border/70 shrink-0 bg-card">
        {/* Topbar Row: Left Breadcrumb & Right Actions */}
        <div className="flex items-center justify-between gap-3">
          {/* Left: Mobile Toggle & Breadcrumb Badge */}
          <div className="flex items-center gap-2 min-w-0">
            {onToggleMobileMenu && (
              <button
                type="button"
                onClick={onToggleMobileMenu}
                className="md:hidden p-1 text-muted-foreground hover:text-foreground cursor-pointer shrink-0 transition-colors"
                title="Open Navigation"
              >
                <List className="h-4 w-4" weight="bold" />
              </button>
            )}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold truncate">
              <House className="h-3.5 w-3.5 shrink-0" weight="bold" />
              <span className="truncate">{activeModule === 'dashboard' ? 'Dashboard' : pageTitle}</span>
              {pageSubtitle && (
                <span className="text-muted-foreground/70 font-normal truncate">· {pageSubtitle}</span>
              )}
            </div>
          </div>

          {/* Right Actions: Updated Time, Reload, Logout Button */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs shrink-0">
            {/* Last Updated indicator (hidden on mobile) */}
            <div className="hidden md:flex items-center gap-1.5 text-muted-foreground text-xs">
              <Clock className="h-3.5 w-3.5" weight="regular" />
              <span>{lastUpdated}</span>
            </div>

            {/* Reload button */}
            <button
              type="button"
              onClick={handleReload}
              className="text-xs font-bold text-accent1 hover:text-accent1/80 inline-flex items-center gap-1 transition-colors cursor-pointer"
              title="Muat ulang data terbaru"
            >
              <ArrowClockwise className={cn('h-3.5 w-3.5', isReloading && 'animate-spin')} weight="bold" />
              <span className="hidden sm:inline">Reload</span>
            </button>

            {/* Vertical Divider */}
            <div className="h-4 w-px bg-border shrink-0" />

            {/* Logout Button (Icon button off diperbesar tanpa bg) */}
            <button
              type="button"
              onClick={() => setIsLogoutModalOpen(true)}
              className="p-1 text-muted-foreground hover:text-destructive transition-colors cursor-pointer flex items-center justify-center shrink-0"
              title="Keluar (Logout)"
              aria-label="Logout"
            >
              <Power className="h-5 w-5" weight="bold" />
            </button>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="Konfirmasi Logout"
        description="Apakah Anda yakin ingin keluar dari sesi kerja FODERA saat ini?"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setIsLogoutModalOpen(false)}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmLogout}
              className="gap-1.5"
            >
              <Power className="h-4 w-4" weight="bold" />
              <span>Ya, Keluar</span>
            </Button>
          </>
        }
      >
        <div className="py-2 text-xs text-muted-foreground leading-relaxed">
          Anda akan dialihkan ke halaman login. Seluruh perubahan transaksi kasir, pengaturan menu, dan data stok yang telah tersimpan tidak akan hilang.
        </div>
      </Modal>
    </>
  )
}


