import React from 'react'

interface AuthSplitLayoutProps {
  children: React.ReactNode
}

export function AuthSplitLayout({ children }: AuthSplitLayoutProps) {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-background font-sans text-foreground">
      {/* Left Pane - Authentication Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-10 lg:p-12 xl:p-16">
        <div className="max-w-md w-full mx-auto py-6 sm:py-8">
          {children}
        </div>
      </div>

      {/* Right Pane - Visual Artwork (Clean without testimonial card, matching media_1789014808035.png) */}
      <div className="hidden lg:flex lg:w-1/2 p-4 sm:p-6 lg:p-8 flex-col justify-center">
        <div className="w-full h-full min-h-160 rounded-3xl overflow-hidden relative shadow-xl select-none">
          {/* Layered Organic 3D Ribbon Artwork Background */}
          <div className="absolute inset-0 bg-primary overflow-hidden">
            <svg
              className="absolute inset-0 w-full h-full object-cover"
              viewBox="0 0 800 1000"
              preserveAspectRatio="xMidYMid slice"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="gradBase" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e1b4b" />
                  <stop offset="40%" stopColor="#312e81" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>

                <linearGradient id="ribbon1" x1="10%" y1="0%" x2="90%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.9" />
                  <stop offset="45%" stopColor="#818cf8" stopOpacity="0.95" />
                  <stop offset="75%" stopColor="#e11d48" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0.85" />
                </linearGradient>

                <linearGradient id="ribbon2" x1="0%" y1="20%" x2="100%" y2="80%">
                  <stop offset="0%" stopColor="#4338ca" />
                  <stop offset="50%" stopColor="#6366f1" />
                  <stop offset="85%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#ea580c" />
                </linearGradient>

                <linearGradient id="ribbon3" x1="20%" y1="0%" x2="80%" y2="100%">
                  <stop offset="0%" stopColor="#1e1b4b" />
                  <stop offset="30%" stopColor="#3730a3" />
                  <stop offset="70%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#db2777" />
                </linearGradient>

                <linearGradient id="highlight" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#fbcfe8" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>

                <filter id="shadowFilter" x="-10%" y="-10%" width="120%" height="120%">
                  <feDropShadow dx="-15" dy="25" stdDeviation="20" floodColor="#090514" floodOpacity="0.6" />
                </filter>
              </defs>

              {/* Background Canvas */}
              <rect width="1000" height="1200" fill="url(#gradBase)" />

              {/* Deep Shadow Wave Underlayer */}
              <path
                d="M-50 1100 C 150 900, 300 700, 450 450 C 600 200, 750 100, 950 -50 L 1050 -50 L 1050 1150 Z"
                fill="#0b0a1d"
                opacity="0.8"
              />

              {/* Layer 1: Diagonal Ribbon Deep Curve */}
              <path
                d="M -100 850 C 120 750, 280 520, 420 320 C 560 120, 700 -20, 850 -100 L 950 -50 C 800 120, 650 300, 490 550 C 330 800, 150 980, -50 1050 Z"
                fill="url(#ribbon3)"
                filter="url(#shadowFilter)"
              />

              {/* Layer 2: Main Diagonal Glowing Violet-Coral Fold */}
              <path
                d="M -50 720 C 140 620, 310 420, 460 210 C 600 20, 720 -60, 880 -120 L 980 -50 C 820 40, 680 180, 520 430 C 360 680, 180 840, -10 920 Z"
                fill="url(#ribbon2)"
                filter="url(#shadowFilter)"
              />

              {/* Layer 3: Vibrant Highlight Curve */}
              <path
                d="M -20 580 C 160 480, 340 310, 490 120 C 620 -40, 750 -100, 900 -140 L 980 -80 C 820 -10, 690 120, 540 350 C 380 580, 200 720, 20 780 Z"
                fill="url(#ribbon1)"
                filter="url(#shadowFilter)"
              />

              {/* Soft Light Sheen / Rim highlights */}
              <path
                d="M -50 720 C 140 620, 310 420, 460 210 C 600 20, 720 -60, 880 -120"
                stroke="url(#highlight)"
                strokeWidth="4"
                fill="none"
              />
              <path
                d="M -20 580 C 160 480, 340 310, 490 120 C 620 -40, 750 -100, 900 -140"
                stroke="url(#highlight)"
                strokeWidth="6"
                fill="none"
              />
            </svg>
          </div>

          {/* Ambient Lighting Glow Overlays */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent1/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/40 rounded-full blur-3xl pointer-events-none" />
        </div>
      </div>
    </div>
  )
}
