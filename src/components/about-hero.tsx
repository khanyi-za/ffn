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
      {/* Background image 1 with responsive adjustments */}
      <div 
        className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${
          activeHero === 1 ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Mobile (default) */}
        <div className="block sm:hidden">
          <Image
            src="/images/ffn_about_us_team.png"
            alt="About Us - French for New team"
            fill
            className="object-cover object-[75%_center]"
            sizes="100vw"
            priority
          />
        </div>

        {/* Small screens */}
        <div className="hidden sm:block md:hidden">
          <Image
            src="/images/ffn_about_us_team.png"
            alt="About Us - French for New team"
            fill
            className="object-cover object-[65%_center]"
            sizes="100vw"
            priority
          />
        </div>

        {/* Medium screens - our target perfect fit */}
        <div className="hidden md:block lg:hidden">
          <Image
            src="/images/ffn_about_us_team.png"
            alt="About Us - French for New team"
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
        </div>

        {/* Large screens */}
        <div className="hidden lg:block xl:hidden">
          <Image
            src="/images/ffn_about_us_team.png"
            alt="About Us - French for New team"
            fill
            className="object-cover object-[40%_center]"
            sizes="100vw"
            priority
          />
        </div>

        {/* Extra large screens */}
        <div className="hidden xl:block">
          <Image
            src="/images/ffn_about_us_team.png"
            alt="About Us - French for New team"
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
        </div>
      </div>

      {/* Background image 2 with responsive adjustments */}
      <div 
        className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${
          activeHero === 2 ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Mobile (default) */}
        <div className="block sm:hidden">
          <Image
            src="/images/ffn_alternate_team.png"
            alt="About Us - French for New alternate team"
            fill
            className="object-cover object-[75%_center]"
            sizes="100vw"
            priority
          />
        </div>

        {/* Small screens */}
        <div className="hidden sm:block md:hidden">
          <Image
            src="/images/ffn_alternate_team.png"
            alt="About Us - French for New alternate team"
            fill
            className="object-cover object-[65%_center]"
            sizes="100vw"
            priority
          />
        </div>

        {/* Medium screens - our target perfect fit */}
        <div className="hidden md:block lg:hidden">
          <Image
            src="/images/ffn_alternate_team.png"
            alt="About Us - French for New alternate team"
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
        </div>

        {/* Large screens */}
        <div className="hidden lg:block xl:hidden">
          <Image
            src="/images/ffn_alternate_team.png"
            alt="About Us - French for New alternate team"
            fill
            className="object-cover object-[40%_center]"
            sizes="100vw"
            priority
          />
        </div>

        {/* Extra large screens */}
        <div className="hidden xl:block">
          <Image
            src="/images/ffn_alternate_team.png"
            alt="About Us - French for New alternate team"
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
        </div>
      </div>

      {/* Navigation */}
      <Navigation activePage="ABOUT US" />

      {/* Main Hero Content */}
      <div className="relative z-10 flex flex-col h-screen items-start justify-end px-6 md:px-12 pb-16 md:pb-20 lg:pb-24">
        <div className="mb-0">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light text-white leading-tight">
            ABOUT US
          </h1>
          <div className="mt-6 md:mt-8">
            <Image
              src="/images/french_white_logo.svg"
              alt="French for New Logo"
              width={180}
              height={80}
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  )
} 