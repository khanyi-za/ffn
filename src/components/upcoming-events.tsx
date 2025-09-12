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
  ticketReleaseDate?: string;
  isSoldOut?: boolean;
}

interface CountdownTimerProps {
  targetDate?: string;
  isSoldOut?: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

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
  eraseSpeed = 75 // Faster erase speed
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

// CountdownTimer component
function CountdownTimer({ targetDate, isSoldOut }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    if (!targetDate) return

    const calculateTimeLeft = () => {
      const target = new Date(targetDate).getTime()
      const now = new Date().getTime()
      const difference = target - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({ days, hours, minutes, seconds })
        setIsExpired(false)
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        setIsExpired(true)
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  const formatTime = (time: number) => {
    return time.toString().padStart(2, '0')
  }

  if (isSoldOut) {
    return (
      <div className="border-2 border-red-500 p-4 bg-black rounded-lg">
        <p className="text-xs text-red-400 text-center mb-3 font-mono">
          Event Status:
        </p>
        <div className="font-mono text-2xl text-red-500 text-center">
          SOLD OUT
        </div>
      </div>
    )
  }

  if (isExpired) {
    return (
      <div className="border-2 border-white p-4 bg-black rounded-lg">
        <p className="text-xs text-white/80 text-center mb-3 font-mono">
          Tickets Are Live In:
        </p>
        <div className="font-mono text-2xl text-white text-center">
          🎫 LIVE NOW!
        </div>
      </div>
    )
  }

  return (
    <div className="border-2 border-white p-4 bg-black rounded-lg">
      <p className="text-xs text-white/80 text-center mb-3 font-mono">
        Tickets Are Live In:
      </p>
      <div className="flex justify-center items-center gap-1">
        {/* Days */}
        <div className="flex flex-col items-center">
          <div className="font-mono text-2xl lg:text-3xl text-white">
            {formatTime(timeLeft.days)}
          </div>
          <div className="text-xs text-white/70 font-mono">
            days
          </div>
        </div>
        
        <div className="font-mono text-2xl lg:text-3xl text-white mx-1">:</div>
        
        {/* Hours */}
        <div className="flex flex-col items-center">
          <div className="font-mono text-2xl lg:text-3xl text-white">
            {formatTime(timeLeft.hours)}
          </div>
          <div className="text-xs text-white/70 font-mono">
            hrs
          </div>
        </div>
        
        <div className="font-mono text-2xl lg:text-3xl text-white mx-1">:</div>
        
        {/* Minutes */}
        <div className="flex flex-col items-center">
          <div className="font-mono text-2xl lg:text-3xl text-white">
            {formatTime(timeLeft.minutes)}
          </div>
          <div className="text-xs text-white/70 font-mono">
            mins
          </div>
        </div>
        
        <div className="font-mono text-2xl lg:text-3xl text-white mx-1">:</div>
        
        {/* Seconds */}
        <div className="flex flex-col items-center">
          <div className="font-mono text-2xl lg:text-3xl text-white">
            {formatTime(timeLeft.seconds)}
          </div>
          <div className="text-xs text-white/70 font-mono">
            sec
          </div>
        </div>
      </div>
    </div>
  )
}

export default function UpcomingEvents() {
  // Helper function to format display text
  const formatDisplayText = (text: string) => {
    if (text === "Electic Sessions") {
      return "Eclectic Sessions";
    }
    return text;
  };

  const events: Event[] = [
    {
      id: 2,
      title: "Soundset Sunday",
      image: "/upcoming_events_poster/ANNOUNCER.png",
      date: "14 September 2025",
      location: "The Playground 73 Juta St, Braam",
      link: "https://fixr.co/event/soundset-sunday-tickets-532387198",
      ticketReleaseDate: "2025-09-12T12:00:00"
    },
    {
      id: 1,
      title: "Soundset Sunday, Season Ticket",
      image: "/upcoming_events_poster/SEASON_TICKET.png",
      date: "26 August 2025",
      location: "",
      link: "https://fixr.co/event/soundset-sunday-season-ticket-tickets-646071320",
      isSoldOut: true
    }
  ]

  const [isMounted, setIsMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
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

  const handleExploreClick = () => {
    setIsLoading(true)
    // Loading will be cleared when page actually transitions
    // Add a timeout as backup in case navigation doesn't happen
    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }

  return (
    <section className="bg-black text-white min-h-[85vh] py-16 md:py-16 lg:py-20 xl:py-24 flex flex-col justify-center relative border-b border-white overflow-hidden">
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white animate-ping origin-bottom scale-y-150"></div>
      
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white text-base md:text-lg font-serif tracking-wider">Loading...</p>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 w-full">
        {/* Title with border */}
        <div className="flex justify-center mb-6 md:mb-8">
          <div className="border-2 border-white inline-block px-8 py-4 max-w-full">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light tracking-wider whitespace-nowrap">
              <TypewriterEffect text="UPCOMING EVENTS..." speed={100} />
            </h2>
          </div>
        </div>

        {/* Horizontal scroll controls */}
        <div className="flex justify-end mb-6 md:mb-8">
          <div className="flex space-x-3 md:space-x-4">
            <button 
              onClick={scrollLeft}
              className="p-2 md:p-3 border border-white rounded-full hover:bg-white hover:text-black transition-colors touch-manipulation"
              aria-label="Scroll left"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="md:w-6 md:h-6 lucide lucide-chevron-left">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
            <button 
              onClick={scrollRight}
              className="p-2 md:p-3 border border-white rounded-full hover:bg-white hover:text-black transition-colors touch-manipulation"
              aria-label="Scroll right"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="md:w-6 md:h-6 lucide lucide-chevron-right">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Events display or creative placeholder */}
        {isMounted && events.length === 0 ? (
          /* Creative placeholder for no events */
          <div className="flex flex-col items-center justify-center min-h-[400px] mb-8 md:mb-12">
            {/* Animated vinyl record */}
            <div className="relative mb-8">
              <div className="w-32 h-32 md:w-40 md:h-40 bg-black border-2 border-white rounded-full flex items-center justify-center animate-spin-slow">
                <div className="w-16 h-16 md:w-20 md:h-20 border-2 border-white rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
              {/* Sound waves */}
              <div className="absolute -top-2 -left-2 w-36 h-36 md:w-44 md:h-44 border border-white/30 rounded-full animate-ping"></div>
              <div className="absolute -top-4 -left-4 w-40 h-40 md:w-48 md:h-48 border border-white/20 rounded-full animate-ping animation-delay-75"></div>
            </div>
            
            {/* Creative message */}
            <div className="text-center max-w-2xl">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-serif mb-4 tracking-wider">
                <TypewriterEffect text="The Stage Is Set..." speed={120} />
              </h3>
              <p className="text-lg md:text-xl text-white/80 mb-6 leading-relaxed">
                Something extraordinary is brewing in our creative kitchen. 
                <br className="hidden sm:block" />
                New experiences are being crafted with passion and precision.
              </p>
              
              {/* Call to action */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link 
                  href="/contact" 
                  className="inline-block border-2 border-white px-8 py-3 text-base font-medium tracking-wider hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105"
                >
                  GET NOTIFIED
                </Link>
                <Link 
                  href="/events" 
                  className="inline-block border-2 border-white/60 px-8 py-3 text-base font-medium tracking-wider text-white/80 hover:border-white hover:text-white transition-all duration-300"
                >
                  EXPLORE PAST EVENTS
                </Link>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-1/2 left-4 transform -translate-y-1/2 opacity-20">
              <div className="text-6xl md:text-8xl font-serif">♪</div>
            </div>
            <div className="absolute top-1/3 right-8 transform -translate-y-1/2 opacity-20">
              <div className="text-4xl md:text-6xl font-serif">♫</div>
            </div>
          </div>
        ) : (
          /* Regular events display - horizontal scrollable layout */
          <div 
            ref={scrollContainerRef}
            className="flex space-x-6 sm:space-x-8 md:space-x-24 lg:space-x-36 xl:space-x-48 mb-6 md:mb-8 overflow-x-auto hide-scrollbar scroll-smooth pb-4"
          >
            {/* Only render client-side content after mounting to prevent hydration mismatch */}
            {isMounted && events.map((event) => (
              <div key={event.id} className="w-[75vw] sm:w-[70vw] md:w-[40vw] lg:w-[35vw] xl:w-[30vw] flex-shrink-0">
                <div className="flex flex-col gap-4 sm:gap-6 md:flex-row md:items-start md:gap-8">
                  {/* Event Image with white border */}
                  <div className="flex-shrink-0 rounded-2xl sm:rounded-3xl border-4 sm:border-[6px] border-white overflow-hidden w-full md:w-[300px] h-auto aspect-[4/5]">
                    <div className="relative w-full h-full">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 75vw, (max-width: 768px) 70vw, 300px"
                      />
                    </div>
                  </div>

                  {/* Right Side Container */}
                  <div className="flex flex-col flex-1 gap-4">
                    {/* Countdown Timer - Medium+ screens only */}
                    <div className="hidden md:block">
                      <CountdownTimer 
                        targetDate={event.ticketReleaseDate} 
                        isSoldOut={event.isSoldOut}
                      />
                    </div>
                    
                    {/* Event Details - Aligned to match the reference */}
                    <div className="flex flex-col justify-center md:justify-start">
                      <h3 className="text-xl sm:text-2xl md:text-4xl font-serif mb-2 sm:mb-3 md:mb-4 font-light">{formatDisplayText(event.title)}</h3>
                      <p className="text-sm sm:text-base md:text-lg mb-1 font-mono">{event.date}</p>
                      <p className="text-sm sm:text-base md:text-lg mb-3 sm:mb-4 md:mb-6 font-mono">{event.location}</p>

                      {/* Buttons - Sized to match the reference */}
                      <div className="flex gap-3 sm:gap-4">
                        {event.isSoldOut ? (
                          <button 
                            disabled
                            className="inline-block border-2 border-red-500 px-4 py-2 sm:px-6 sm:py-2 text-sm sm:text-base font-medium tracking-wider bg-red-500/20 text-red-400 cursor-not-allowed"
                          >
                            SOLD OUT
                          </button>
                        ) : (
                          <Link 
                            href={event.link} 
                            className="inline-block border-2 border-white px-4 py-2 sm:px-6 sm:py-2 text-sm sm:text-base font-medium tracking-wider hover:bg-white hover:text-black transition-colors touch-manipulation"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            TICKETS
                          </Link>
                        )}
                        <Link 
                          href="/events?event=soundset-sunday" 
                          className="inline-block border-2 border-white px-4 py-2 sm:px-6 sm:py-2 text-sm sm:text-base font-medium tracking-wider hover:bg-white hover:text-black transition-colors touch-manipulation"
                          onClick={handleExploreClick}
                        >
                          EXPLORE
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Loading skeleton when not mounted */}
            {!isMounted && (
              <div className="w-[75vw] sm:w-[70vw] md:w-[40vw] flex-shrink-0">
                <div className="flex flex-col gap-4 sm:gap-6 md:flex-row md:gap-8">
                  <div className="flex-shrink-0 rounded-2xl sm:rounded-3xl border-4 sm:border-[6px] border-white overflow-hidden w-full md:w-[300px] h-auto aspect-[4/5] bg-gray-900"></div>
                  <div className="flex flex-col justify-center md:justify-start flex-1">
                    <div className="h-6 sm:h-8 md:h-10 bg-gray-900 rounded w-3/4 mb-2 sm:mb-3 md:mb-4"></div>
                    <div className="h-3 sm:h-4 bg-gray-900 rounded w-1/2 mb-1"></div>
                    <div className="h-3 sm:h-4 bg-gray-900 rounded w-3/4 mb-3 sm:mb-4 md:mb-6"></div>
                    <div className="flex gap-3 sm:gap-4">
                      <div className="h-8 sm:h-10 bg-gray-900 rounded w-20 sm:w-24"></div>
                      <div className="h-8 sm:h-10 bg-gray-900 rounded w-20 sm:w-24"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
} 