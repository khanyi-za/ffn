'use client'

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

// TypewriterEffect component for the title
interface TypewriterEffectProps {
  text: string;
  speed?: number;
  restartDelay?: number;
  eraseSpeed?: number;
  onComplete?: () => void;
}

function TypewriterEffect({ 
  text, 
  speed = 150, 
  restartDelay = 3000,
  eraseSpeed = 75,
  onComplete
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
      // Call onComplete when typing is done
      if (onComplete) {
        onComplete();
      }
      
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
  }, [displayText, isComplete, isErasing, isPaused, speed, eraseSpeed, restartDelay, onComplete])
  
  return (
    <span className="inline-block">
      {displayText}
      {(!isComplete || isErasing) && 
        <span className="inline-block ml-1 animate-pulse">|</span>
      }
    </span>
  )
}

export default function LogoCarousel() {
  const logoContainerRef = useRef<HTMLDivElement>(null)

  const handleTitleComplete = () => {
    // Function is used by TypewriterEffect onComplete callback
  }

  return (
    <section className="bg-black text-white py-16 md:py-24 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        {/* Title with border */}
        <div className="flex justify-center mb-16">
          <div className="border-2 border-white inline-block px-6 py-3 md:px-10 md:py-4">
            <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl font-light tracking-wider">
              <TypewriterEffect 
                text="OUR CLIENTS..." 
                speed={120} 
                onComplete={handleTitleComplete}
              />
            </h2>
          </div>
        </div>

        {/* Mission statement */}
        <div className="max-w-5xl mx-auto text-center mb-16">
          <p className="font-serif text-2xl md:text-3xl lg:text-4xl font-light leading-snug text-white">
            We connect global and local brands with diverse South African consumers, fostering lasting relationships through immersive events that bridge socio-economic segments seamlessly.
          </p>
        </div>

        {/* Logo Carousel animation with white background */}
        <div className="bg-white py-3 rounded-xl">
          <div 
            ref={logoContainerRef}
            className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_white_50px,_white_calc(100%-50px),transparent_100%)]"
          >
            {/* First instance of the logos */}
            <ul className="flex items-center justify-center md:justify-start [&_li]:mx-2 [&_img]:max-w-none animate-infinite-scroll">
              {logos.map((logo, index) => (
                <li key={`logo-1-${index}`} className="px-2 flex items-center justify-center">
                  <div className="transition-all duration-300 hover:scale-110 group cursor-pointer">
                    <Image 
                      src={logo.src} 
                      alt={logo.alt} 
                      width={100} 
                      height={40} 
                      className="max-h-12 w-auto group-hover:animate-bounce-once object-contain" 
                    />
                  </div>
                </li>
              ))}
            </ul>
            
            {/* Duplicate instance of the logos - needed for continuous scrolling effect */}
            <ul className="flex items-center justify-center md:justify-start [&_li]:mx-2 [&_img]:max-w-none animate-infinite-scroll" aria-hidden="true">
              {logos.map((logo, index) => (
                <li key={`logo-2-${index}`} className="px-2 flex items-center justify-center">
                  <div className="transition-all duration-300 hover:scale-110 group cursor-pointer">
                    <Image 
                      src={logo.src} 
                      alt={logo.alt} 
                      width={100} 
                      height={40} 
                      className="max-h-12 w-auto group-hover:animate-bounce-once object-contain" 
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

// Logo data
const logos = [
  { src: '/Logos/BAI Logo_Lanyard.png', alt: 'BAI Logo' },
  { src: '/Logos/Once Upon A Time .png', alt: 'Once Upon A Time' },
  { src: '/Logos/TBNE LOGO.PNG', alt: 'TBNE' },
  { src: '/Logos/Grants-Logo.png', alt: 'Grants' },
  { src: '/Logos/don-julio-tequila-logo-3645080EB7-seeklogo.com.png', alt: 'Don Julio' },
  { src: '/Logos/Casamigos-logo.png', alt: 'Casamigos' },
  { src: '/Logos/jagermeister-logo-png-transparent.png', alt: 'Jagermeister' },
  { src: '/Logos/gordons-1-logo-png-transparent.png', alt: 'Gordons' },
  { src: '/Logos/Johnnie-Walker-Logo.png', alt: 'Johnnie Walker' },
  { src: '/Logos/Kix logo.png', alt: 'Kix' },
  { src: '/Logos/Flying_fish.png', alt: 'Flying Fish' },
]; 