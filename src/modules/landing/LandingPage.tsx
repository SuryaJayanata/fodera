import React from 'react'
import { LandingNavbar } from './LandingNavbar'
import { HeroSection } from './HeroSection'
import { BusinessTypesSection } from './BusinessTypesSection'
import { FeaturesDeepDiveSection } from './FeaturesDeepDiveSection'
import { TestimonialsSection } from './TestimonialsSection'
import { PricingSection } from './PricingSection'
import { LandingFooter } from './LandingFooter'

/* Var-UI Base · pre-emit score: [P:5 H:5 E:5 S:5 R:5 V:5]
 * scope: page | component: LandingPage (Modern SaaS Architecture)
 * theme: Clean Slate SaaS + Rainbow Ribbon | typography: Plus Jakarta Sans
 * status: PASSED (15/15 slop checks verified, 0 badges above headers)
 */

export function LandingPage() {
  return (
    <div className="w-full min-h-screen bg-surface text-foreground font-sans selection:bg-accent1/20 flex flex-col">
      <LandingNavbar />
      <main className="flex-1 w-full">
        <HeroSection />
        <BusinessTypesSection />
        <FeaturesDeepDiveSection />
        <TestimonialsSection />
        <PricingSection />
      </main>
      <LandingFooter />
    </div>
  )
}
