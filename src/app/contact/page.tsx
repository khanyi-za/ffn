'use client'

import { useState } from 'react'
import ContactForm from "@/components/contact-form"
import Footer from "@/components/footer"
import Navigation from "@/components/navigation"
import PageLoader from "@/components/page-loader"

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(true)

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  if (isLoading) {
    return <PageLoader onLoadingComplete={handleLoadingComplete} />
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <Navigation activePage="CONTACT" />

      {/* Contact Content */}
      <div className="container mx-auto px-6 pt-36 pb-12 md:px-12 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl md:text-6xl font-light mb-6">Get In Touch.</h1>
          <p className="text-lg">For bookings, collaborations, or general inquiries, reach out to us:</p>
        </div>

        <ContactForm />
      </div>

      {/* Footer */}
      <Footer />
    </main>
  )
}

