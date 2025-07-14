'use client'

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"

// TypewriterEffect component for the title
interface TypewriterEffectProps {
  text: string;
  speed?: number;
  restartDelay?: number;
  eraseSpeed?: number;
}

function TypewriterEffect({ 
  text, 
  speed = 150, 
  restartDelay = 3000,
  eraseSpeed = 75, // Faster erase speed
}: TypewriterEffectProps) {
  const [displayText, setDisplayText] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const [isErasing, setIsErasing] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const textRef = useRef(text)
  const indexRef = useRef(0)
  
  // Reset state if text changes
  useEffect(() => {
    setDisplayText('')
    setIsComplete(false)
    setIsErasing(false)
    setIsPaused(false)
    textRef.current = text
    indexRef.current = 0
  }, [text])
  
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined
    
    // Complete state - wait before starting to erase
    if (isComplete && !isErasing) {
      timer = setTimeout(() => {
        setIsErasing(true)
      }, restartDelay)
      
      return () => clearTimeout(timer)
    }
    
    // Erasing state - erase one character at a time
    if (isErasing) {
      if (displayText.length > 0) {
        timer = setTimeout(() => {
          setDisplayText(prev => prev.substring(0, prev.length - 1))
        }, eraseSpeed)
      } else {
        // When erasing is done, reset to typing state
        setIsErasing(false)
        setIsComplete(false)
        indexRef.current = 0
      }
      
      return () => {
        if (timer) clearTimeout(timer)
      }
    }
    
    // Typing state - add one character at a time
    if (!isComplete && !isErasing && !isPaused) {
      if (indexRef.current < textRef.current.length) {
        timer = setTimeout(() => {
          setDisplayText(textRef.current.substring(0, indexRef.current + 1))
          indexRef.current += 1
          
          // Mark as complete when done typing
          if (indexRef.current >= textRef.current.length) {
            setIsComplete(true)
          }
        }, speed)
      }
    }
    
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [displayText, isComplete, isErasing, isPaused, speed, eraseSpeed, restartDelay])
  
  return (
    <span className="inline-block">
      {displayText}
      {(!isComplete || isErasing) && 
        <span className="inline-block ml-1 animate-pulse">|</span>
      }
    </span>
  )
}

interface EventUpdatesProps {
  eventName?: string
  description?: string
  tagline?: string
  eventDate?: string
  eventLocation?: string
  eventVideo?: string
  logoImage?: string
}

export default function EventUpdates({
  eventName = "SOUNDSET SUNDAY",
  description = "Lorem ipsum dolor sit amet consectetur. Aliquam sapien mattis proin ut interdum tincidunt. Curabitur mauris enim rhoncus ullamcorper. Sceleris que nibh pretium",
  tagline = "We Do Cool Stuff All The Time, We Just Happen To Show It On Sundays.",
  eventDate = "27 APRIL 25",
  eventLocation = "Parkview Event Space, Woodstock",
  eventVideo = "/videos/soundset_video.mp4",
  logoImage = "/images/ss_color_transparent.png",
}: EventUpdatesProps) {
  return (
    <section className="bg-black text-white pt-0 pb-16 md:pb-24 relative">
      <div className="container mx-auto px-6 md:px-12 max-w-6xl mt-16 md:mt-24">
        {/* Top section with logo and title - now grouped together */}
        <div className="flex flex-col md:flex-row items-center md:items-start mb-16 md:mb-24">
          {/* Logo and Title Group */}
          <div className="flex flex-col md:flex-row items-center md:items-center gap-6 md:gap-8">
            {/* Logo */}
            <div className="w-40 md:w-64 border-2 border-white p-3 rounded-lg flex items-center justify-center">
              <Image
                src={logoImage || "/placeholder.svg"}
                alt={`${eventName} logo`}
                width={200}
                height={160}
                className="object-contain"
              />
            </div>

            {/* Event Title */}
            <div className="border-2 border-white inline-block px-8 py-4 md:min-w-[400px] text-center">
              <h2 className="font-serif text-3xl md:text-5xl font-light">
                <TypewriterEffect 
                  text={`${eventName}...`}
                  speed={120}
                  restartDelay={4000}
                />
              </h2>
            </div>
          </div>
        </div>

        {/* Content section with description and video */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          {/* Event Description */}
          <div className="md:pr-8">
            <p className="text-2xl md:text-4xl font-serif font-light leading-relaxed mb-16">{description}</p>
            <p className="font-mono text-sm md:text-base pl-4 md:pl-8">{tagline}</p>
          </div>

          {/* Event Video - replaced Image with video */}
          <div className="rounded-3xl overflow-hidden h-[440px] border-3 border-white -mx-3 md:transform md:scale-110">
            <video 
              src={eventVideo || "/videos/placeholder.mp4"}
              autoPlay
              muted
              loop
              playsInline
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="flex justify-center mb-8">
          <hr className="w-full max-w-5xl border-gray-700" />
        </div>

        {/* Upcoming Event */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 max-w-5xl mx-auto">
          <div>
            <h3 className="text-lg font-serif italic mb-2">Upcoming Event</h3>
            <p className="font-mono">
              {eventDate} @ {eventLocation}
            </p>
          </div>
          <Link href="/events/tickets" className="flex items-center mt-4 md:mt-0 group">
            <span className="mr-2 font-medium uppercase">Buy Tickets</span>
            <span className="group-hover:translate-x-1 transition-transform">&gt;</span>
          </Link>
        </div>

        {/* Divider */}
        <div className="flex justify-center my-8">
          <hr className="w-full max-w-5xl border-gray-700" />
        </div>

        {/* Gallery */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 max-w-5xl mx-auto">
          <div>
            <h3 className="text-lg font-serif italic mb-2">Gallery</h3>
            <p className="font-mono">MEMORIES FROM THE PREVIOUS EVENT.</p>
          </div>
          <Link href="/gallery" className="flex items-center mt-4 md:mt-0 group">
            <span className="mr-2 font-medium uppercase">See Gallery</span>
            <span className="group-hover:translate-x-1 transition-transform">&gt;</span>
          </Link>
        </div>

        {/* Divider */}
        <div className="flex justify-center my-8">
          <hr className="w-full max-w-5xl border-gray-700" />
        </div>

        {/* Shop */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 max-w-5xl mx-auto">
          <div>
            <h3 className="text-lg font-serif italic mb-2">Shop</h3>
            <p className="font-mono">SOUNDSET SUNDAY MERCH.</p>
          </div>
          <div className="flex items-center mt-4 md:mt-0 group cursor-default">
            <span className="mr-2 font-medium uppercase">Explore Shop</span>
            <span className="group-hover:translate-x-1 transition-transform">&gt;</span>
          </div>
        </div>

        {/* Final Divider */}
        <div className="flex justify-center mt-8">
          <hr className="w-full max-w-5xl border-gray-700" />
        </div>
      </div>
    </section>
  )
}

