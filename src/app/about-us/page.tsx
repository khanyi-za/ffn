'use client'

import AboutHero from "@/components/about-hero"
import Footer from "@/components/footer"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"

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
  eraseSpeed = 75,
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

export default function AboutUs() {
  return (
    <main className="bg-black text-white with-hero-nav">
      <AboutHero />
      
      {/* What We Do Section */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl mb-16 font-light">What We Do?</h2>
          
          <div className="font-serif text-[28px] sm:text-3xl md:text-4xl lg:text-5xl leading-tight">
            <p className="mb-0">
              <span>Frenchfornew curates unforgettable</span>
            </p>
            <p className="mb-0">
              <span>experiences by blending creativity,</span>
            </p>
            <p className="mb-0">
              <span>culture, and innovation, transforming</span>
            </p>
            <p className="mb-0">
              <span>events into vibrant cele</span><span className="text-gray-500">brations of</span>
            </p>
            <p className="mb-0">
              <span className="text-gray-500">music and art.</span>
            </p>
          </div>
        </div>
      </section>
      
      {/* Our History Section */}
      <section className="h-screen flex items-center border-t border-gray-800">
        <div className="w-full px-6 md:px-12 lg:px-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 lg:gap-24 items-center">
            {/* Left column - Text content */}
            <div className="max-w-xl">
              <div className="inline-block border-2 border-white px-8 py-4 mb-12 md:mb-20">
                <h2 className="font-serif text-4xl md:text-5xl font-light">
                  <TypewriterEffect text="Our History..." speed={120} />
                </h2>
              </div>
              
              <p className="text-2xl md:text-3xl leading-relaxed">
                French For New, founded in 2021 by DJ duo Nouveaux (Thubelihle Nkutha & Neo Mosito), is an events company driven by community and inclusion. From Soundset Sunday (2019) to A Rare Experience and Eclectic Sessions, they create immersive events that connect people and offer brands unique exposure.
              </p>
            </div>
            
            {/* Right column - Image slider */}
            <div className="relative flex justify-center md:justify-end">
              <div className="relative rounded-lg overflow-hidden w-full md:w-[90%] aspect-[4/5] border-2 border-white">
                <Image 
                  src="/images/founders_1.jpeg" 
                  alt="DJ duo Nouveaux performing" 
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                
                {/* Slide indicator */}
                <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-sm text-sm">
                  5/5
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Meet the Team Section */}
      <section className="min-h-screen py-24 border-t border-gray-800">
        <div className="w-full">
          <h2 className="font-serif text-5xl md:text-6xl text-center mb-16 md:mb-24 font-light">Meet the Team</h2>
          
          <div className="overflow-x-auto scrollbar-hide">
            <div 
              id="team-scroll-container"
              className="flex flex-row flex-nowrap px-6 md:px-12 lg:px-16 space-x-8"
            >
              {/* Team Member 1 */}
              <div className="w-full md:w-1/3 flex-shrink-0 px-4">
                <div className="flex flex-col">
                  <h3 className="text-2xl md:text-3xl font-serif mb-8 text-center md:text-left">Thubelihle Nkutha</h3>
                  
                  <div className="relative aspect-[3/4] mb-4 grayscale">
                    <Image 
                      src="/images/member_a.png" 
                      alt="Thubelihle Nkutha" 
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                  
                  <div className="bg-white text-black py-2 px-6 inline-block self-start mt-2">
                    <p className="text-sm font-medium">Co Founder & CEO</p>
                  </div>
                </div>
              </div>
              
              {/* Team Member 2 */}
              <div className="w-full md:w-1/3 flex-shrink-0 px-4">
                <div className="flex flex-col">
                  <h3 className="text-2xl md:text-3xl font-serif mb-8 text-center md:text-left">Neo Mosito</h3>
                  
                  <div className="relative aspect-[3/4] mb-4 grayscale">
                    <Image 
                      src="/images/member_b.png" 
                      alt="Neo Mosito" 
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                  
                  <div className="bg-white text-black py-2 px-6 inline-block self-start mt-2">
                    <p className="text-sm font-medium">Co Founder & CFO</p>
                  </div>
                </div>
              </div>
              
              {/* Team Member 3 */}
              <div className="w-full md:w-1/3 flex-shrink-0 px-4">
                <div className="flex flex-col">
                  <h3 className="text-2xl md:text-3xl font-serif mb-8 text-center md:text-left">Sango Velaphi</h3>
                  
                  <div className="relative aspect-[3/4] mb-4 grayscale">
                    <Image 
                      src="/images/member_c.png"
                      alt="Sango Velaphi" 
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                  
                  <div className="bg-white text-black py-2 px-6 inline-block self-start mt-2">
                    <p className="text-sm font-medium">Head Of Operations</p>
                  </div>
                </div>
              </div>
              
              {/* Team Member 4 */}
              <div className="w-full md:w-1/3 flex-shrink-0 px-4">
                <div className="flex flex-col">
                  <h3 className="text-2xl md:text-3xl font-serif mb-8 text-center md:text-left">Team Member</h3>
                  
                  <div className="relative aspect-[3/4] mb-4 grayscale">
                    <Image 
                      src="/images/member_d.png"
                      alt="Team member" 
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                  
                  <div className="bg-white text-black py-2 px-6 inline-block self-start mt-2">
                    <p className="text-sm font-medium">Position Title</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Horizontal scroll controls */}
          <div className="flex justify-center mt-16 space-x-4">
            <button 
              onClick={() => {
                const container = document.getElementById('team-scroll-container');
                if (container) {
                  container.scrollBy({ left: -300, behavior: 'smooth' });
                }
              }}
              className="p-2 border border-white rounded-full hover:bg-white hover:text-black transition-colors"
              aria-label="Scroll left"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
            <button 
              onClick={() => {
                const container = document.getElementById('team-scroll-container');
                if (container) {
                  container.scrollBy({ left: 300, behavior: 'smooth' });
                }
              }}
              className="p-2 border border-white rounded-full hover:bg-white hover:text-black transition-colors"
              aria-label="Scroll right"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  )
} 