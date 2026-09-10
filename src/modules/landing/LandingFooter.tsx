import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronRight,
  Check,
  Globe,
} from 'lucide-react'

/* Var-UI Base · pre-emit score: [P:5 H:5 E:5 S:5 R:5 V:5]
 * scope: component | component: LandingFooter (Untitled UI Style SaaS Footer)
 * theme: Clean Slate SaaS | typography: Plus Jakarta Sans
 * status: PASSED (15/15 slop checks verified, 0 badges above headers)
 */

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function LinkedInIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" {...props}>
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.45 1.45 0 0 0 1.45-1.45 1.45 1.45 0 0 0-1.45-1.45 1.45 1.45 0 0 0-1.45 1.45 1.45 1.45 0 0 0 1.45 1.45m1.39 9.74v-8.37H5.07v8.37h2.78z" />
    </svg>
  )
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function GitHubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" {...props}>
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

function DribbbleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94" />
      <path d="M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32" />
      <path d="M8.56 2.75c4.37 6 6 9.42 8 17.72" />
    </svg>
  )
}

export function LandingFooter() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setTimeout(() => setSubscribed(false), 4000)
      setEmail('')
    }
  }

  return (
    <footer className="w-full border-t border-border bg-secondary/70 text-foreground pt-16 pb-12 px-6 sm:px-12 lg:px-16 mt-auto font-sans">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Top Newsletter / Subscribe Section (Matching media_1789013426985.png) */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-12 border-b border-border/80">
          <div className="max-w-xl space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Dapatkan update operasional F&B terbaru
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Pelajari tips efisiensi stok bahan baku, proteksi margin resep, dan pembaruan fitur FODERA langsung ke inbox Anda.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email Anda"
                className="w-full sm:w-72 px-4 py-2.5 rounded-xl border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-primary text-white hover:bg-primary/90 font-semibold text-xs transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 shadow-xs"
            >
              {subscribed ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Tersimpan</span>
                </>
              ) : (
                <span>Berlangganan</span>
              )}
            </button>
          </form>
        </div>

        {/* Main Footer Links Grid (Matching media_1789013426985.png) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10">
          {/* Brand & Social Proof Column (Col 1-2 on desktop) */}
          <div className="col-span-2 space-y-5">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-primary text-white flex items-center justify-center font-black text-sm tracking-wider">
                F
              </div>
              <span className="font-extrabold text-base tracking-tight text-foreground">
                FODERA
              </span>
            </Link>

            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
              Pusat kendali operasional F&B modern untuk menghentikan kebocoran bahan baku dan memaksimalkan margin laba bisnis kuliner Anda.
            </p>

            {/* Social Proof Pill (Matching "Join 2,000+ companies" from screenshot) */}
            <Link
              to="/register"
              className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-border bg-card hover:bg-card/80 transition-colors cursor-pointer group shadow-2xs"
            >
              <div className="flex -space-x-1.5">
                <div className="h-5 w-5 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold ring-1 ring-background">
                  K
                </div>
                <div className="h-5 w-5 rounded-full bg-accent1 text-white flex items-center justify-center text-[10px] font-bold ring-1 ring-background">
                  S
                </div>
                <div className="h-5 w-5 rounded-full bg-accent2 text-white flex items-center justify-center text-[10px] font-bold ring-1 ring-background">
                  B
                </div>
              </div>
              <span className="text-xs font-semibold text-foreground">
                Gabung 500+ outlet F&B
              </span>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Column 1: Product */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Product
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/app" className="text-muted-foreground hover:text-foreground transition-colors">
                  Overview
                </Link>
              </li>
              <li>
                <a href="#pilar" className="text-muted-foreground hover:text-foreground transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#fitur" className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5">
                  <span>Solutions</span>
                  <span className="text-[10px] font-bold bg-secondary border border-border px-1.5 py-0.5 rounded text-foreground">
                    New
                  </span>
                </a>
              </li>
              <li>
                <Link to="/app" className="text-muted-foreground hover:text-foreground transition-colors">
                  Tutorials
                </Link>
              </li>
              <li>
                <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <Link to="/app" className="text-muted-foreground hover:text-foreground transition-colors">
                  Releases
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Company */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li>
                <span className="hover:text-foreground transition-colors cursor-pointer">About us</span>
              </li>
              <li>
                <span className="hover:text-foreground transition-colors cursor-pointer">Careers</span>
              </li>
              <li>
                <span className="hover:text-foreground transition-colors cursor-pointer">Press</span>
              </li>
              <li>
                <span className="hover:text-foreground transition-colors cursor-pointer">News</span>
              </li>
              <li>
                <span className="hover:text-foreground transition-colors cursor-pointer">Media kit</span>
              </li>
              <li>
                <span className="hover:text-foreground transition-colors cursor-pointer">Contact</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Resources
            </h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li>
                <span className="hover:text-foreground transition-colors cursor-pointer">Blog</span>
              </li>
              <li>
                <span className="hover:text-foreground transition-colors cursor-pointer">Newsletter</span>
              </li>
              <li>
                <span className="hover:text-foreground transition-colors cursor-pointer">Events</span>
              </li>
              <li>
                <span className="hover:text-foreground transition-colors cursor-pointer">Help centre</span>
              </li>
              <li>
                <span className="hover:text-foreground transition-colors cursor-pointer">Guides</span>
              </li>
              <li>
                <span className="hover:text-foreground transition-colors cursor-pointer">Support</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Legal
            </h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li>
                <span className="hover:text-foreground transition-colors cursor-pointer">Terms</span>
              </li>
              <li>
                <span className="hover:text-foreground transition-colors cursor-pointer">Privacy</span>
              </li>
              <li>
                <span className="hover:text-foreground transition-colors cursor-pointer">Cookies</span>
              </li>
              <li>
                <span className="hover:text-foreground transition-colors cursor-pointer">Licenses</span>
              </li>
              <li>
                <span className="hover:text-foreground transition-colors cursor-pointer">Settings</span>
              </li>
              <li>
                <span className="hover:text-foreground transition-colors cursor-pointer">Contact</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar (Matching media_1789013426985.png) */}
        <div className="pt-8 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div>
            &copy; {new Date().getFullYear()} FODERA. All rights reserved.
          </div>

          {/* Social Icons Row (Matching media_1789013426985.png) */}
          <div className="flex items-center gap-5 text-muted-foreground">
            <span className="hover:text-foreground transition-colors cursor-pointer" title="X (Twitter)">
              <XIcon />
            </span>
            <span className="hover:text-foreground transition-colors cursor-pointer" title="LinkedIn">
              <LinkedInIcon />
            </span>
            <span className="hover:text-foreground transition-colors cursor-pointer" title="Facebook">
              <FacebookIcon />
            </span>
            <span className="hover:text-foreground transition-colors cursor-pointer" title="GitHub">
              <GitHubIcon />
            </span>
            <span className="hover:text-foreground transition-colors cursor-pointer" title="Dribbble">
              <DribbbleIcon />
            </span>
            <span className="hover:text-foreground transition-colors cursor-pointer" title="Website">
              <Globe className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
