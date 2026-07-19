'use client'

import Navbar from './Navbar'
import HeroSection from './HeroSection'
import FeaturesSection from './FeaturesSection'
import HowItWorksSection from './HowItWorksSection'
import StatsSection from './StatsSection'
import SPMBBanner from './SPMBBanner'
import Footer from './Footer'

interface LandingPageProps {
  settings: Record<string, any>
  studentCount: number
}

export default function LandingPage({ settings, studentCount }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-200">
      <Navbar settings={settings} />
      <main>
        <HeroSection settings={settings} studentCount={studentCount} />
        <FeaturesSection />
        <HowItWorksSection />
        <StatsSection studentCount={studentCount} />
        {settings.spmb_enabled && <SPMBBanner settings={settings} />}
      </main>
      <Footer settings={settings} />
    </div>
  )
}
