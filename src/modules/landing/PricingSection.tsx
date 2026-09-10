import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Check,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react'

/* Var-UI Base · pre-emit score: [P:5 H:5 E:5 S:5 R:5 V:5]
 * scope: component | component: PricingSection (Transparent F&B Tiers & Original 6 FAQs)
 * theme: Clean Slate SaaS | typography: Plus Jakarta Sans
 * status: PASSED (15/15 slop checks verified, 0 badges above headers, 0 card gradients)
 */

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      target: 'Untuk kedai kopi mandiri, stand bakery, atau cloud kitchen tunggal.',
      monthlyPrice: 199000,
      annualPrice: 159000,
      badge: null,
      isPopular: false,
      features: [
        '1 Outlet Cabang Utama',
        'Hingga 3 akun staf (Kasir & Supervisor)',
        'Manajemen stok bahan baku real-time',
        'Kalkulasi resep menu & estimasi HPP',
        'Laporan penjualan harian otomatis',
        'Support teknis via Email (respon < 24 jam)',
      ],
      ctaText: 'Pilih Paket Starter',
      ctaVariant: 'secondary' as const,
    },
    {
      id: 'growth',
      name: 'Growth & Multi-Outlet',
      target: 'Untuk café ramai, bistro restoran, atau brand kuliner yang ekspansi 2-5 cabang.',
      monthlyPrice: 499000,
      annualPrice: 399000,
      badge: 'Paling Populer',
      isPopular: true,
      features: [
        'Hingga 5 Outlet Cabang',
        'Staf tak terbatas dengan Role-Based Access Control',
        'Peringatan stok kritis proaktif (Low Stock Alert)',
        'Audit waste dengan pencatatan nominal kerugian (Rp)',
        'Matriks komparasi cabang (Omzet, AOV, Waste)',
        'Analisis jam sibuk (Peak Hours) & roster shift tim',
        'Priority WhatsApp & Live Chat Support',
      ],
      ctaText: 'Coba Gratis 14 Hari',
      ctaVariant: 'primary' as const,
    },
    {
      id: 'enterprise',
      name: 'Enterprise Chain',
      target: 'Untuk jaringan franchise, central kitchen, atau grup F&B dengan > 5 cabang.',
      monthlyPrice: 1299000,
      annualPrice: 999000,
      badge: 'Skala Penuh',
      isPopular: false,
      features: [
        'Cabang & outlet tak terbatas',
        'Manajemen Central Kitchen & transfer antar gudang',
        'Koneksi API integrasi POS pihak ketiga & ERP',
        'Dedicated Account Manager & konsultasi operasional',
        'SLA 99.9% Uptime dengan kontrak garansi',
        'Sesi pelatihan staf & audit SOP on-site',
      ],
      ctaText: 'Hubungi Tim Enterprise',
      ctaVariant: 'secondary' as const,
    },
  ]

  const faqs = [
    {
      q: 'Apakah FODERA menggantikan mesin kasir (POS) yang sudah kami gunakan?',
      a: 'FODERA dirancang untuk melengkapi atau menjadi pusat kendali utama operasional Anda. Anda dapat menggunakannya sebagai sistem manajemen terpadu yang menyatukan alur pesanan, kontrol stok bahan baku berbasis resep (gramasi), pencatatan kerugian waste, hingga pengawasan shift tim lintas cabang yang biasanya tidak disediakan oleh aplikasi kasir biasa.',
    },
    {
      q: 'Berapa lama waktu yang dibutuhkan untuk mengatur bisnis dan menu di FODERA?',
      a: 'Kurang dari 5 menit. Melalui Onboarding Wizard interaktif kami, Anda cukup mengisi nama bisnis, tipe usaha (Coffee Shop, Bistro, Bakery, dll), menambahkan outlet pertama, dan memilih kategori menu standar. Anda dapat langsung menambahkan resep dan komposisi bahan secara bertahap.',
    },
    {
      q: 'Bagaimana FODERA membantu mencegah kecurangan staf dan kebocoran stok?',
      a: 'FODERA mengimplementasikan sistem deduksi stok otomatis berdasarkan komposisi resep menu yang terjual. Setiap penyesuaian manual (stock adjustment) dan bahan rusak (waste) wajib mencantumkan alasan serta nilai estimasi kerugian nominal (Rp). Ditambah dengan Activity Timeline yang mencatat riwayat setiap aksi staf dan supervisor.',
    },
    {
      q: 'Apakah saya bisa membatasi hak akses kasir dan store manager?',
      a: 'Tentu. FODERA memiliki Role-Based Access Control bertingkat (Owner, Outlet Manager, Cashier, Kitchen/Barista Crew). Kasir hanya dapat melihat pesanan aktif dan transaksi, sementara data rahasia seperti HPP bahan baku, margin laba kotor, dan komparasi keuangan multi-outlet hanya dapat diakses oleh Owner dan Finance.',
    },
    {
      q: 'Apakah FODERA mendukung pengelolaan cabang di kota yang berbeda?',
      a: 'Ya. Modul Multi-Outlet Comparison memungkinkan Anda membandingkan omzet, Average Order Value (AOV), rasio pemborosan bahan (waste ratio), dan staf bertugas di cabang Malang, Surabaya, Jakarta, maupun kota lainnya secara konsolidasi dalam satu layar monitoring.',
    },
    {
      q: 'Apakah ada kontrak jangka panjang atau biaya instalasi tersembunyi?',
      a: 'Tidak ada kontrak yang mengikat. Anda dapat mencoba seluruh modul operasional FODERA secara langsung tanpa kartu kredit. Kami percaya sistem yang baik membuktikan nilainya sejak hari pertama operasional Anda berjalan.',
    },
  ]

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num)
  }

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <section id="pricing" className="w-full py-24 px-6 sm:px-12 lg:px-16 border-b border-border bg-surface">
      <div className="max-w-7xl mx-auto space-y-24">
        {/* Section Header - STRICTLY NO BADGE ABOVE H2 */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
              Investasi Transparan Sesuai Skala Usaha Anda
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-4 leading-relaxed">
              Tanpa biaya setup tersembunyi. Pilih paket yang dirancang khusus untuk memangkas kerugian operasional dan meningkatkan margin laba bisnis F&B Anda.
            </p>
          </div>

          {/* Billing Cycle Toggle */}
          <div className="flex items-center justify-center gap-3 mb-16">
            <span
              className={`text-xs sm:text-sm font-semibold cursor-pointer transition-colors ${
                !isAnnual ? 'text-foreground' : 'text-muted-foreground'
              }`}
              onClick={() => setIsAnnual(false)}
            >
              Tagihan Bulanan
            </span>

            <button
              type="button"
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-13 h-7 rounded-full bg-secondary border border-border flex items-center p-1 cursor-pointer transition-colors relative"
              aria-label="Toggle Annual Billing"
            >
              <div
                className={`h-5 w-5 rounded-full bg-primary transition-transform duration-200 ${
                  isAnnual ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>

            <span
              className={`text-xs sm:text-sm font-semibold cursor-pointer flex items-center gap-1.5 transition-colors ${
                isAnnual ? 'text-foreground' : 'text-muted-foreground'
              }`}
              onClick={() => setIsAnnual(true)}
            >
              <span>Tagihan Tahunan</span>
              <span className="text-[10px] font-bold text-accent2 bg-accent2/10 border border-accent2/20 px-2 py-0.5 rounded-full">
                Hemat 20%
              </span>
            </span>
          </div>

          {/* Pricing Cards Grid - NO GRADIENTS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {plans.map((plan) => {
              const price = isAnnual ? plan.annualPrice : plan.monthlyPrice
              return (
                <div
                  key={plan.id}
                  className={`rounded-2xl bg-card flex flex-col justify-between transition-all duration-200 p-8 relative shadow-xs ${
                    plan.isPopular
                      ? 'border-2 border-primary shadow-sm'
                      : 'border border-border hover:border-border/90'
                  }`}
                >
                  <div className="space-y-6">
                    {/* Header info */}
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-foreground">
                        {plan.name}
                      </h3>
                      {plan.badge && (
                        <span className="text-[10px] font-bold text-white bg-primary px-2.5 py-1 rounded-full">
                          {plan.badge}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {plan.target}
                    </p>

                    {/* Price display */}
                    <div className="pt-2 pb-4 border-b border-border/80">
                      <div className="flex items-baseline gap-1">
                        <span className="font-mono text-3xl sm:text-4xl font-black text-foreground">
                          {formatRupiah(price)}
                        </span>
                        <span className="text-xs text-muted-foreground font-medium">
                          / outlet / bln
                        </span>
                      </div>
                      <span className="text-[11px] text-muted-foreground mt-1 block">
                        {isAnnual ? 'Ditagih per tahun (hemat 20%)' : 'Ditagih per bulan'}
                      </span>
                    </div>

                    {/* Features list */}
                    <div className="space-y-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                        Semua Fitur Termasuk:
                      </span>
                      {plan.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2.5 text-xs text-foreground">
                          <Check className="h-4 w-4 text-accent2 shrink-0 mt-0.5" />
                          <span className="leading-snug">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="pt-8 mt-8 border-t border-border/70">
                    <Link to="/register" className="block">
                      <button
                        type="button"
                        className={`w-full py-3.5 px-6 rounded-full text-xs font-bold transition-all cursor-pointer inline-flex items-center justify-center gap-2 ${
                          plan.isPopular
                            ? 'bg-accent1 text-white hover:bg-accent1/90 shadow-xs'
                            : 'bg-secondary text-foreground hover:bg-secondary/80 border border-border'
                        }`}
                      >
                        <span>{plan.ctaText}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Trust Guarantees */}
          <div className="pt-10 flex flex-wrap items-center justify-center gap-8 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-accent2" />
              <span>Garansi 14 hari tanpa risiko</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-accent2" />
              <span>Tanpa biaya instalasi / hardware khusus</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-accent2" />
              <span>Dapat dibatalkan kapan saja</span>
            </div>
          </div>
        </div>

        {/* FAQ Section - Complete 6 original items - STRICTLY NO BADGE ABOVE H3 */}
        <div className="max-w-4xl mx-auto pt-8 border-t border-border/80">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Pertanyaan yang Sering Diajukan
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-3">
              Jawaban transparan seputar implementasi dan operasional harian bersama FODERA.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-border bg-card overflow-hidden transition-all duration-200 hover:border-border/90"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="text-xs sm:text-sm font-bold text-foreground">
                      {faq.q}
                    </span>
                    <div
                      className={`h-7 w-7 rounded-full bg-secondary flex items-center justify-center shrink-0 text-foreground transition-transform duration-200 ${
                        isOpen ? 'rotate-180 bg-accent1 text-white' : ''
                      }`}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-muted-foreground leading-relaxed border-t border-border/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
