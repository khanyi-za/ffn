'use client'

import Image from "next/image"
import Navigation from "./navigation"
import { useState, useEffect } from "react"

export default function AboutHero() {
  const [activeHero, setActiveHero] = useState(1)

  // Set up timer to rotate between heroes every 5.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHero(prev => (prev === 1 ? 2 : 1))
    }, 5500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Background image 1 - Simplified responsive system */}
      <div 
        className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${
          activeHero === 1 ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Image
          src="/images/ffn_about_us_team.png"
          alt="About Us - French for New team"
          fill
          className="object-cover object-[75%_center] sm:object-[65%_center] md:object-center lg:object-[40%_center] xl:object-center"
          sizes="100vw"
          priority
        />
      </div>

      {/* Background image 2 - Simplified responsive system */}
      <div 
        className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${
          activeHero === 2 ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Image
          src="/images/ffn_alternate_team.png"
          alt="About Us - French for New alternate team"
          fill
          className="object-cover object-[75%_center] sm:object-[65%_center] md:object-center lg:object-[40%_center] xl:object-center"
          sizes="100vw"
          priority
        />
      </div>

      {/* Navigation */}
      <Navigation activePage="ABOUT US" />

      {/* Main Hero Content */}
      <div className="relative z-10 flex flex-col h-screen items-start justify-end px-4 sm:px-6 md:px-12 lg:px-16 pb-12 sm:pb-16 md:pb-20 lg:pb-24 xl:pb-28">
        <div className="mb-0">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-white leading-tight">
            ABOUT US
          </h1>
          <div className="mt-4 sm:mt-6 md:mt-8">
            <Image
              src="/images/french_white_logo.svg"
              alt="French for New Logo"
              width={120}
              height={53}
              className="object-contain sm:w-[140px] sm:h-[62px] md:w-[180px] md:h-[80px] lg:w-[200px] lg:h-[89px]"
            />
          </div>
        </div>
      </div>
    </div>
  )
} 