'use client'

import Image from "next/image"
import Navigation from "./navigation"
import { useState, useEffect } from "react"

export default function Hero() {
  const [activeHero, setActiveHero] = useState(1)

  // Set up timer to rotate between heroes every 3 seconds
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
            src="/images/hero_home.png"
            alt="Event crowd with red lighting"
            fill
            className="object-cover object-[75%_center]"
            sizes="100vw"
            priority
          />
        </div>

        {/* Small screens */}
        <div className="hidden sm:block md:hidden">
          <Image
            src="/images/hero_home.png"
            alt="Event crowd with red lighting"
            fill
            className="object-cover object-[65%_center]"
            sizes="100vw"
            priority
          />
        </div>

        {/* Medium screens - our target perfect fit */}
        <div className="hidden md:block lg:hidden">
          <Image
            src="/images/hero_home.png"
            alt="Event crowd with red lighting"
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
        </div>

        {/* Large screens */}
        <div className="hidden lg:block xl:hidden">
          <Image
            src="/images/hero_home.png"
            alt="Event crowd with red lighting"
            fill
            className="object-cover object-[40%_center]"
            sizes="100vw"
            priority
          />
        </div>

        {/* Extra large screens */}
        <div className="hidden xl:block">
          <Image
            src="/images/hero_home.png"
            alt="Event crowd with red lighting"
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
            src="/images/HERO_v2.jpg"
            alt="Alternative hero image"
            fill
            className="object-cover object-[75%_center]"
            sizes="100vw"
            priority
          />
        </div>

        {/* Small screens */}
        <div className="hidden sm:block md:hidden">
          <Image
            src="/images/HERO_v2.jpg"
            alt="Alternative hero image"
            fill
            className="object-cover object-[65%_center]"
            sizes="100vw"
            priority
          />
        </div>

        {/* Medium screens - our target perfect fit */}
        <div className="hidden md:block lg:hidden">
          <Image
            src="/images/HERO_v2.jpg"
            alt="Alternative hero image"
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
        </div>

        {/* Large screens */}
        <div className="hidden lg:block xl:hidden">
          <Image
            src="/images/HERO_v2.jpg"
            alt="Alternative hero image"
            fill
            className="object-cover object-[40%_center]"
            sizes="100vw"
            priority
          />
        </div>

        {/* Extra large screens */}
        <div className="hidden xl:block">
          <Image
            src="/images/HERO_v2.jpg"
            alt="Alternative hero image"
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
        </div>
      </div>

      {/* Navigation */}
      <Navigation activePage="HOME" />

      {/* Main Hero Content */}
      <div className="relative z-10 flex flex-col justify-between h-screen">
        {/* Upper spacing to accommodate fixed navbar */}
        <div className="h-[var(--navbar-height)]"></div>
        
        {/* Center content with tagline */}
        <div className="flex-grow flex flex-col justify-center px-6 md:px-12 pt-[20vh]">
          {/* First tagline - shows when first hero is active */}
          <h1 
            className={`font-serif text-[31px] md:text-[36px] font-light text-white max-w-md leading-tight transition-opacity duration-1000 ease-in-out ${
              activeHero === 1 ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div>WE FOLLOW CULTURE.</div>
            <div className="mt-2">WE ENDORSE CULTURE.</div>
            <div className="mt-2">WE CREATE CULTURE.</div>
          </h1>

          {/* Second tagline - shows when second hero is active */}
          <h1 
            className={`font-serif text-[23px] md:text-[32px] font-light text-white max-w-xl leading-tight absolute transition-opacity duration-1000 ease-in-out ${
              activeHero === 2 ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="whitespace-nowrap">LIVE MUSIC EVENT EXPERIENCES.</div>
            <div className="mt-2 whitespace-nowrap">IMMERSIVE EVENT PRODUCTION.</div>
            <div className="mt-2 whitespace-nowrap">VIBRANT EXHIBITIONS OF MUSIC & ART.</div>
          </h1>
        </div>

        {/* Bottom section with logo and scroll indicator */}
        <div className="flex items-end justify-between px-6 pb-8 md:px-12">
          <div className="w-20">
            <Image
              src="/images/ffn_white_logo.svg"
              alt="ffn logo"
              width={80}
              height={60}
              className="object-contain"
            />
          </div>
          <button className="text-white animate-bounce">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-arrow-down"
            >
              <path d="M12 5v14" />
              <path d="m19 12-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

