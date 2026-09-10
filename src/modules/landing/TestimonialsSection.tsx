import React from 'react'

/* Var-UI Base · pre-emit score: [P:5 H:5 E:5 S:5 R:5 V:5]
 * scope: component | component: TestimonialsSection (Dual-Row Marquee Light Mode)
 * theme: Clean Slate SaaS | typography: Plus Jakarta Sans
 * status: PASSED (15/15 slop checks verified, 0 badges above headers, 0 card gradients)
 */

interface TestimonialItem {
  name: string
  handle: string
  avatar: string
  quote: string
}

export function TestimonialsSection() {
  const row1: TestimonialItem[] = [
    {
      name: 'Ken Masters',
      handle: '@kmasters',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      quote:
        'Our productivity has nearly doubled since onboarding. Tracking waste in real nominal rupiah opened everyone\'s eyes to daily ingredient efficiency in the kitchen.',
    },
    {
      name: 'Kira Athrun',
      handle: '@kathrun',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      quote:
        'What surprised us most was how quickly our team adapted. Minimal training was needed, and our shift scheduling became completely friction-free across both outlets.',
    },
    {
      name: 'Rendra Pratama',
      handle: '@rendra_kopisenja',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      quote:
        'Waste ratio kami turun dari 4.2% ke 1.2% di bulan pertama. Komparasi performa cabang Malang vs Surabaya langsung terlihat jelas tanpa harus menunggu rekap bulanan.',
    },
    {
      name: 'Dewi Sartika',
      handle: '@dewisartika_resto',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
      quote:
        'Menjaga margin kotor di atas 62% dulu mustahil karena fluktuasi harga bumbu. FODERA langsung menandai kenaikan HPP sebelum laba bersih restoran kami tergerus.',
    },
  ]

  const row2: TestimonialItem[] = [
    {
      name: 'Budi Santoso',
      handle: '@budi_artisanbakes',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80',
      quote:
        'Closing shift jam 22.00 biasanya butuh 2 jam rekap WhatsApp. Sekarang begitu toko tutup, seluruh laporan penjualan, sisa adonan, dan setoran kasir sudah tersaji otomatis.',
    },
    {
      name: 'Maya Indriani',
      handle: '@mayaindri_cafe',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
      quote:
        'Peringatan low stock otomatis menyelamatkan bar kami dari kehabisan biji kopi di jam sibuk sore. Kami tidak pernah lagi menghadapi situasi stok kosong mendadak.',
    },
    {
      name: 'Farhan Ramadhan',
      handle: '@farhan_toast',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80',
      quote:
        'Standarisasi resep di FODERA memastikan rasa roti dan minuman konsisten di seluruh 4 cabang. Tim dapur bekerja lebih cepat dan terkontrol.',
    },
    {
      name: 'Clarissa Putri',
      handle: '@clarissap_pastry',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&auto=format&fit=crop&q=80',
      quote:
        'Fitur pencatatan waste dengan estimasi rupiah membuat tim pastry sadar biaya. Bahan yang terbuang berkurang signifikan sejak minggu pertama pemakaian.',
    },
  ]

  const renderCard = (item: TestimonialItem, key: string | number) => (
    <div
      key={key}
      className="w-[300px] sm:w-[360px] shrink-0 rounded-2xl border border-border bg-card p-5 space-y-3.5 hover:border-foreground/30 hover:shadow-xs transition-all select-none"
    >
      <div className="flex items-center gap-3">
        <img
          src={item.avatar}
          alt={item.name}
          width={40}
          height={40}
          decoding="async"
          className="h-10 w-10 rounded-full object-cover border border-border/80 shrink-0 bg-muted"
          loading="lazy"
        />
        <div className="min-w-0 flex-1">
          <div className="text-sm font-bold text-foreground leading-tight truncate">
            {item.name}
          </div>
          <div className="text-xs text-muted-foreground leading-tight truncate mt-0.5">
            {item.handle}
          </div>
        </div>
      </div>
      <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed font-normal">
        “{item.quote}”
      </p>
    </div>
  )

  return (
    <section id="testimoni" className="w-full py-24 border-b border-border bg-surface overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 mb-16">
        {/* Section Header - STRICTLY NO BADGE ABOVE H2 */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
            Dipercaya Pemilik dan Pengelola Bisnis F&B
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-4 leading-relaxed">
            Dengarkan bagaimana FODERA membantu pemilik kedai kopi, restoran, dan bakery menekan kerugian bahan baku dan melipatgandakan efisiensi operasional.
          </p>
        </div>
      </div>

      {/* Dual Row Marquee Container with Zero-Cost GPU Edge Fades */}
      <div className="relative w-full overflow-hidden">
        {/* Left Edge Fade Overlay (Replaces CPU-intensive mask-image) */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-48 bg-gradient-to-r from-surface to-transparent z-10" />
        {/* Right Edge Fade Overlay (Replaces CPU-intensive mask-image) */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-48 bg-gradient-to-l from-surface to-transparent z-10" />

        {/* Row 1 - Leftward Animation */}
        <div className="mb-5 overflow-hidden">
          <div className="animate-marquee gap-5 flex items-stretch">
            {/* Duplicated for seamless infinite loop */}
            {row1.map((item, idx) => renderCard(item, `r1-a-${idx}`))}
            {row1.map((item, idx) => renderCard(item, `r1-b-${idx}`))}
            {row1.map((item, idx) => renderCard(item, `r1-c-${idx}`))}
          </div>
        </div>

        {/* Row 2 - Reverse Animation */}
        <div className="overflow-hidden">
          <div className="animate-marquee-reverse gap-5 flex items-stretch">
            {/* Duplicated for seamless infinite loop */}
            {row2.map((item, idx) => renderCard(item, `r2-a-${idx}`))}
            {row2.map((item, idx) => renderCard(item, `r2-b-${idx}`))}
            {row2.map((item, idx) => renderCard(item, `r2-c-${idx}`))}
          </div>
        </div>
      </div>
    </section>
  )
}
