'use client'

import { useState } from 'react'
import Hero from "@/components/hero"
import UpcomingEvents from "@/components/upcoming-events"
import StatsSection from "@/components/stats-section"
import MerchComingSoon from "@/components/merch-coming-soon"
import LogoCarousel from "@/components/logo-carousel"
import HomePageEvents from "@/components/home-page-events"
import Footer from "@/components/footer"
import PageLoader from "@/components/page-loader"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  if (isLoading) {
    return <PageLoader onLoadingComplete={handleLoadingComplete} />
  }

  return (
    <main className="with-hero-nav">
     <Hero />
      <UpcomingEvents />
      <StatsSection />
      <MerchComingSoon />
      <LogoCarousel />
      <HomePageEvents />
      <Footer />
    </main>
  )
}

