'use client'

import { useEffect, useRef } from "react"
import Image from "next/image"

export default function RecentCollaborations() {
  const videoRef = useRef<HTMLVideoElement>(null)

  // Initialize video when component mounts
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.7 // Slightly slow down the video
    }
  }, [])

  return (
    <section className="relative h-[91.8vh] py-24 md:py-32 border-t-[3px] border-b-[3px] border-white overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/videos/TBNE_Joburg.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Black overlay for better readability */}
        <div className="absolute inset-0 bg-black/70"></div>
      </div>

      {/* Content - positioned above the video */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16 text-white h-full flex flex-col">
        {/* Title with border */}
        <div className="flex justify-start -mt-12 md:-mt-16 -ml-2 md:-ml-6 mb-8">
          <div className="border-2 border-white inline-block px-8 py-4">
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light tracking-wider">
              Recent Collaborations
            </h2>
          </div>
        </div>
        
        {/* Description text */}
        <div className="flex justify-start -ml-2 md:-ml-6 mb-16 md:mb-20 max-w-3xl">
          <h5 className="text-2xl md:text-3xl font-serif font-light leading-relaxed pl-8">
            French For New recently worked with Bobby Nsenga to bring his famous one man show &ldquo;The Bobby Nsenga Experience&rdquo; to Joburg &amp; Cape Town
          </h5>
        </div>

        {/* Bottom section with logo only, positioned at absolute bottom */}
        <div className="absolute bottom-[-5px] left-0 right-0 w-full flex flex-col items-center justify-center text-center">
          {/* Logo */}
          <div className="w-20 md:w-28 lg:w-36 mb-0">
            <div className="relative aspect-square mx-auto transition-all duration-300 hover:scale-105 border-2 border-white overflow-hidden rounded-sm">
              <Image 
                src="/images/bobby_exp_logo.png"
                alt="Bobby Nsenga Experience"
                fill
                sizes="(max-width: 768px) 5rem, (max-width: 1024px) 7rem, 9rem"
                className="object-cover opacity-50"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 