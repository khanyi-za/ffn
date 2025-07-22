'use client'

import { useState } from 'react'
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import ServicesGrid from "@/components/services-grid"
import PageLoader from "@/components/page-loader"

export default function ServicesDetailPage() {
  const [isLoading, setIsLoading] = useState(true)

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  if (isLoading) {
    return <PageLoader onLoadingComplete={handleLoadingComplete} />
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navigation activePage="SERVICES" />
      <ServicesGrid />
      <Footer />
    </main>
  )
} 