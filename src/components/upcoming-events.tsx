'use client'

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"

type Event = {
  id: number;
  title: string;
  image: string;
  date: string;
  location: string;
  link: string;
}

// TypewriterEffect component for the title
interface TypewriterEffectProps {
  text: string;
  speed?: number;
  restartDelay?: number;
  eraseSpeed?: number;
  shouldLoop?: boolean;
}

function TypewriterEffect({ 
  text, 
  speed = 150, 
  restartDelay = 3000,
  eraseSpeed = 75, // Faster erase speed
  shouldLoop = true
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

export default function UpcomingEvents() {
  const events: Event[] = [
    {
      id: 1,
      title: "SoundSet Sunday",
      image: "/images/flyer.png",
      date: "08 March 2024",
      location: "The PlayGround, 73JUTA ST, BRAAM JOBURG",
      link: "/events/soundset-sunday"
    },
    {
      id: 2,
      title: "The BobbyNsenga Experience",
      image: "/images/bobby_1.png",
      date: "08 March 2024",
      location: "The PlayGround, 73JUTA ST, BRAAM JOBURG",
      link: "/events/rare"
    },
    {
      id: 3,
      title: "The BobbyNsenga Experience",
      image: "/images/bobby_2.png",
      date: "15 March 2024",
      location: "The PlayGround, 73JUTA ST, BRAAM JOBURG",
      link: "/events/electric-session"
    },   
    {
      id: 4,
      title: "Planet Rare",
      image: "/images/rare_fly.png",
      date: "15 March 2024",
      location: "The PlayGround, 73JUTA ST, BRAAM JOBURG",
      link: "/events/electric-session"
    }
  ]

  const [isMounted, setIsMounted] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Mark component as mounted
    setIsMounted(true)
  }, [])

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 400,
        behavior: 'smooth'
      })
    }
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -400,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section className="bg-black text-white h-[85vh] flex flex-col justify-center relative border-b border-white overflow-hidden">
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white animate-ping origin-bottom scale-y-150"></div>
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 w-full">
        {/* Title with border */}
        <div className="flex justify-center mb-10 md:mb-14">
          <div className="border-2 border-white inline-block px-6 py-3 md:px-10 md:py-4">
            <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl font-light tracking-wider">
              <TypewriterEffect text="UPCOMING EVENTS..." speed={100} />
            </h2>
          </div>
        </div>

        {/* Horizontal scroll controls */}
        <div className="flex justify-end mb-6 md:mb-8">
          <div className="flex space-x-4">
            <button 
              onClick={scrollLeft}
              className="p-2 border border-white rounded-full hover:bg-white hover:text-black transition-colors"
              aria-label="Scroll left"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
            <button 
              onClick={scrollRight}
              className="p-2 border border-white rounded-full hover:bg-white hover:text-black transition-colors"
              aria-label="Scroll right"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Events display - horizontal scrollable layout */}
        <div 
          ref={scrollContainerRef}
          className="flex space-x-24 md:space-x-36 lg:space-x-48 mb-10 md:mb-14 overflow-x-auto hide-scrollbar scroll-smooth pb-4"
        >
          {/* Only render client-side content after mounting to prevent hydration mismatch */}
          {isMounted && events.map((event) => (
            <div key={event.id} className="w-[85vw] md:w-[40vw] lg:w-[35vw] xl:w-[30vw] flex-shrink-0">
              <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-8">
                {/* Event Image with white border */}
                <div className="flex-shrink-0 rounded-3xl border-[6px] border-white overflow-hidden w-full md:w-[300px] h-auto aspect-[4/5]">
                  <div className="relative w-full h-full">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 90vw, 300px"
                    />
                  </div>
                </div>

                {/* Event Details - Aligned to match the reference */}
                <div className="flex flex-col justify-center md:justify-start flex-1">
                  <h3 className="text-2xl md:text-4xl font-serif mb-3 md:mb-4 font-light">{event.title}</h3>
                  <p className="text-base md:text-lg mb-1 font-mono">{event.date}</p>
                  <p className="text-base md:text-lg mb-4 md:mb-6 font-mono">{event.location}</p>

                  {/* Buttons - Sized to match the reference */}
                  <div className="flex gap-4">
                    <Link 
                      href={`${event.link}/tickets`} 
                      className="inline-block border-2 border-white px-6 py-2 text-base font-medium tracking-wider hover:bg-white hover:text-black transition-colors"
                    >
                      TICKETS
                    </Link>
                    <Link 
                      href={event.link} 
                      className="inline-block border-2 border-white px-6 py-2 text-base font-medium tracking-wider hover:bg-white hover:text-black transition-colors"
                    >
                      EXPLORE
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Loading skeleton when not mounted */}
          {!isMounted && (
            <div className="w-[85vw] md:w-[40vw] flex-shrink-0">
              <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                <div className="flex-shrink-0 rounded-3xl border-[6px] border-white overflow-hidden w-full md:w-[300px] h-auto aspect-[4/5] bg-gray-900"></div>
                <div className="flex flex-col justify-center md:justify-start flex-1">
                  <div className="h-8 md:h-10 bg-gray-900 rounded w-3/4 mb-3 md:mb-4"></div>
                  <div className="h-4 bg-gray-900 rounded w-1/2 mb-1"></div>
                  <div className="h-4 bg-gray-900 rounded w-3/4 mb-4 md:mb-6"></div>
                  <div className="flex gap-4">
                    <div className="h-10 bg-gray-900 rounded w-24"></div>
                    <div className="h-10 bg-gray-900 rounded w-24"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
} 