'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from "next/image"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import ServicesGrid from "@/components/services-grid"
// import RecentCollaborations from "@/components/recent-collaborations"
import ContactService from "@/components/contact-service"
import PageLoader from "@/components/page-loader"


type Service = {
  id: number;
  title: string;
  image: string;
  alt: string;
}

export default function ServicesPage() {
  const [isLoading, setIsLoading] = useState(true)

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  const services: Service[] = [
    {
      id: 0,
      title: "Event Production",
      image: "/images/event_production.png",
      alt: "Event Production - crowd in venue"
    },
    {
      id: 1,
      title: "Event Planning",
      image: "/images/event_planning.png",
      alt: "Event Planning services"
    },
    {
      id: 2,
      title: "Marketing",
      image: "/images/marketing.png",
      alt: "Marketing services"
    },
    {
      id: 3,
      title: "Talent Management",
      image: "/images/talent_managment.png",
      alt: "Talent Management services"
    }
  ]

  const [activeIndex, setActiveIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setActiveIndex(index)
    setTimeout(() => setIsTransitioning(false), 500) // Match this to the transition duration
  }, [isTransitioning])

  const goToNext = useCallback(() => {
    const nextIndex = activeIndex === services.length - 1 ? 0 : activeIndex + 1
    goToSlide(nextIndex)
  }, [activeIndex, services.length, goToSlide])

  const goToPrev = useCallback(() => {
    const prevIndex = activeIndex === 0 ? services.length - 1 : activeIndex - 1
    goToSlide(prevIndex)
  }, [activeIndex, services.length, goToSlide])

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      goToNext()
    }, 3000) // Change slide every 3 seconds
    
    return () => clearInterval(interval)
  }, [goToNext])

  if (isLoading) {
    return <PageLoader onLoadingComplete={handleLoadingComplete} />
  }

  return (
    <main className="flex flex-col with-hero-nav">
      {/* Services Section with Full-Screen Image */}
      <div className="h-[75vh] md:h-screen w-full overflow-hidden relative">
        <div className="relative h-full w-full bg-black">
          {/* Background image carousel */}
          {services.map((service, index) => (
            <div 
              key={service.id}
              className={`absolute inset-0 z-0 transition-opacity duration-500 ease-in-out ${
                activeIndex === index ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={service.image}
                alt={service.alt}
                fill
                className="object-cover object-center"
                sizes="100vw"
                priority={index === 0}
              />
            </div>
          ))}

          {/* Navigation */}
          <Navigation activePage="SERVICES" />

          {/* Main Content */}
          <div className="absolute inset-0 z-10 flex flex-col justify-between pt-24 pb-16">
            {/* Service Title - now positioned in the bottom section above the logo */}
            <div className="flex-grow"></div>

            {/* Navigation buttons (invisible but clickable) */}
            <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 flex justify-between px-4 md:px-8 pointer-events-none">
              <button
                onClick={goToPrev}
                className="h-40 w-40 focus:outline-none pointer-events-auto bg-transparent"
                aria-label="Previous slide"
              />
              <button
                onClick={goToNext}
                className="h-40 w-40 focus:outline-none pointer-events-auto bg-transparent"
                aria-label="Next slide"
              />
            </div>
            
            {/* Visible navigation controls */}
            <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 flex justify-between px-6 md:px-12 lg:px-16 pointer-events-none">
              <button
                onClick={goToPrev}
                className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border border-white bg-black/30 hover:bg-white group transition-all duration-300 focus:outline-none pointer-events-auto"
                aria-label="Previous service"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white group-hover:text-black lucide lucide-chevron-left">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </button>
              <button
                onClick={goToNext}
                className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border border-white bg-black/30 hover:bg-white group transition-all duration-300 focus:outline-none pointer-events-auto"
                aria-label="Next service"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white group-hover:text-black lucide lucide-chevron-right">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </button>
            </div>

            {/* Bottom section with title, logo and pagination */}
            <div className="w-full flex flex-col items-center">
              {/* Service Title moved here */}
              <div className="mb-12 md:mb-16 relative h-[70px] md:h-[80px] w-full flex items-center justify-center">
                {services.map((service, index) => (
                  <h1 
                    key={service.id}
                    className={`font-serif text-[51px] md:text-7xl font-light text-white text-center transition-opacity duration-500 ease-in-out absolute left-0 right-0 ${
                      activeIndex === index ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    {service.title === "Talent Management" ? (
                      <>
                        <span className="md:hidden">Talent<br />Management</span>
                        <span className="hidden md:inline">Talent Management</span>
                      </>
                    ) : (
                      service.title
                    )}
                  </h1>
                ))}
              </div>
              
              {/* FFN Logo */}
              <div className="w-16 mb-4">
                <Image
                  src="/images/ffn_white_logo.svg"
                  alt="ffn logo"
                  width={64}
                  height={48}
                  className="object-contain"
                />
              </div>
              
              {/* Pagination dots */}
              <div className="flex justify-center space-x-2">
                {services.map((service, index) => (
                  <button
                    key={service.id}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      activeIndex === index ? 'bg-white' : 'bg-white/50'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Detail Grid Section */}
      <ServicesGrid />

      {/* Recent Collaborations Section */}
      {/* <RecentCollaborations /> */}

      {/* Contact Service Section */}
      <ContactService />

      {/* Footer */}
      <Footer />
    </main>
  )
} 