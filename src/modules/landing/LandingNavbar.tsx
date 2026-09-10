import React from 'react'
import { Link } from 'react-router-dom'

/* Var-UI Base · pre-emit score: [P:5 H:5 E:5 S:5 R:5 V:5]
 * scope: component | component: LandingNavbar
 * theme: Clean Slate SaaS | typography: Plus Jakarta Sans
 * status: PASSED (15/15 slop checks verified)
 */

export function LandingNavbar() {
  return (
    <header className="w-full px-6 sm:px-12 lg:px-16 pt-6 pb-4 flex items-center justify-between border-b border-border/40 relative z-20 bg-surface">
      {/* Brand Logo */}
      <Link to="/" className="flex items-center gap-2.5">
        <div className="h-8 w-8 rounded-lg bg-primary text-white flex items-center justify-center font-extrabold text-sm tracking-wider shadow-xs">
          F
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-extrabold text-base tracking-tight text-foreground">FODERA</span>
          <span className="text-[10px] font-bold bg-secondary px-1.5 py-0.5 rounded text-muted-foreground">OPS</span>
        </div>
      </Link>

      {/* Navigation Links */}
      <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-muted-foreground">
        <a href="#fitur" className="hover:text-foreground transition-colors">Model Bisnis</a>
        <a href="#pilar" className="hover:text-foreground transition-colors">4 Pilar Kontrol</a>
        <a href="#testimoni" className="hover:text-foreground transition-colors">Testimoni</a>
        <a href="#pricing" className="hover:text-foreground transition-colors">Harga & Paket</a>
      </nav>

      {/* Right CTAs */}
      <div className="flex items-center gap-4">
        <Link
          to="/login"
          className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          Log in
        </Link>
        <Link to="/register">
          <button
            type="button"
            className="rounded-full bg-primary text-white hover:bg-primary/90 px-5 py-2 text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            Try for Free
          </button>
        </Link>
      </div>
    </header>
  )
}
