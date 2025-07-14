'use client'

import Navigation from "@/components/navigation"
import AboutHero from "@/components/about-hero"
import Footer from "@/components/footer"
import Image from "next/image"
import { useState, useEffect, useRef, ReactNode } from "react"

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
  eraseSpeed = 75
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

// ScrollRevealText component for scroll-triggered text reveal
interface ScrollRevealTextProps {
  children: ReactNode;
}

function ScrollRevealText({ children }: ScrollRevealTextProps) {
  const textRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (!textRef.current) return
    
    // Select all span elements which will be individual words
    const wordSpans = textRef.current.querySelectorAll('.word')
    
    if (!wordSpans.length) return
    
    // Initially set all words to gray
    wordSpans.forEach((word, index) => {
      word.classList.add('text-zinc-900')
      word.classList.add('transition-colors')
      word.classList.add('duration-800')
      // Add data attribute to track the global order
      word.setAttribute('data-index', index.toString())
      word.setAttribute('data-state', 'gray')
    })
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // When a paragraph containing words enters viewport
        if (entry.isIntersecting) {
          // Get all words in this paragraph
          const paragraph = entry.target as HTMLElement
          const words = paragraph.querySelectorAll('.word')
          
          words.forEach((word, wordIndex) => {
            const currentState = word.getAttribute('data-state')
            
            // Set a delay based on the word's position
            setTimeout(() => {
              if (currentState === 'gray') {
                // Change to white
                word.classList.remove('text-zinc-900')
                word.classList.add('text-white')
                word.setAttribute('data-state', 'white')
              } else {
                // Change to gray
                word.classList.remove('text-white')
                word.classList.add('text-zinc-900')
                word.setAttribute('data-state', 'gray')
              }
            }, wordIndex * 180) // 180ms delay between each word
          })
        }
      })
    }, {
      threshold: 0.8, // Trigger when element is 80% visible
      rootMargin: '0px 0px -10% 0px'
    })
    
    // Observe each paragraph (we'll reveal words when paragraph enters viewport)
    const paragraphs = textRef.current.querySelectorAll('p')
    paragraphs.forEach((para) => {
      observer.observe(para)
    })
    
    return () => {
      paragraphs.forEach((para) => {
        observer.unobserve(para)
      })
    }
  }, [])
  
  return (
    <div ref={textRef} className="relative">
      {children}
    </div>
  )
}

export default function AboutUs() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      })
    }
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      })
    }
  }

  return (
    <main className="bg-black text-white with-hero-nav">
      <Navigation />
      <AboutHero />
      
      {/* What We Do Section */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl mb-16 font-light">What We Do?</h2>
          
          <div className="font-serif text-[28px] sm:text-3xl md:text-4xl lg:text-5xl leading-tight">
            <ScrollRevealText>
              <p className="mb-0">
                <span className="word">Frenchfornew</span>{' '}
                <span className="word">curates</span>{' '}
                <span className="word">unforgettable</span>
              </p>
              <p className="mb-0">
                <span className="word">experiences</span>{' '}
                <span className="word">by</span>{' '}
                <span className="word">blending</span>{' '}
                <span className="word">creativity,</span>
              </p>
              <p className="mb-0">
                <span className="word">culture,</span>{' '}
                <span className="word">and</span>{' '}
                <span className="word">innovation,</span>{' '}
                <span className="word">transforming</span>
              </p>
              <p className="mb-0">
                <span className="word">events</span>{' '}
                <span className="word">into</span>{' '}
                <span className="word">vibrant</span>{' '}
                <span className="word">celebrations</span>{' '}
                <span className="word">of</span>
              </p>
              <p className="mb-0">
                <span className="word">music</span>{' '}
                <span className="word">and</span>{' '}
                <span className="word">art.</span>
              </p>
            </ScrollRevealText>
          </div>
        </div>
      </section>
      
      {/* Our History Section */}
      <section className="h-screen flex items-center border-t border-gray-800">
        <div className="w-full px-6 md:px-12 lg:px-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 lg:gap-24 items-center">
            {/* Left column - Text content */}
            <div className="max-w-xl">
              <div className="inline-block border-2 border-white px-8 py-4 mb-7 md:mb-12">
                <h2 className="font-serif text-4xl md:text-5xl font-light">
                  <TypewriterEffect text="Our History..." speed={120} />
                </h2>
              </div>
              
              <p className="text-2xl md:text-3xl leading-relaxed">
              French For New is an events company, founded at the twilight of the year 2021 and founded on the principle of community and togetherness. The brainchild of Thubelihle Nkutha & Neo Mosito who saw a gap for turning their love for music into an events company.
              French For New is a company that centres its values and goals around the idea that each person who walks through our doors belongs and that they are coming to be part of a greater group. One that does not isolate and discriminate but rather looks to grow.
              </p>
            </div>
            
            {/* Right column - Image slider */}
            <div className="relative flex justify-center md:justify-end">
              <div className="relative rounded-lg overflow-hidden w-full md:w-[90%] aspect-[4/5] border-2 border-white">
                <Image 
                  src="/images/duo_founders.jpg" 
                  alt="DJ duo Nouveaux performing" 
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                

              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Meet the Team Section */}
      <section className="min-h-screen py-24 border-t border-gray-800">
        <div className="w-full">
          <h2 className="font-serif text-5xl md:text-6xl text-center mb-16 md:mb-24 font-light">Meet the Team</h2>
          
          <div 
            ref={scrollContainerRef}
            className="flex flex-row flex-nowrap px-6 md:px-12 lg:px-16 space-x-8 overflow-x-auto hide-scrollbar scroll-smooth"
          >
              {/* Team Member 1 */}
              <div className="w-[85vw] md:w-[35vw] lg:w-[30vw] flex-shrink-0 px-4">
                <div className="flex flex-col">
                  <h3 className="text-2xl md:text-3xl font-serif mb-8 text-center md:text-left">Thubelihle Nkutha</h3>
                  
                  <div className="relative aspect-[3/4] mb-4 grayscale hover:grayscale-0 transition-all duration-300">
                    <Image 
                      src="/images/Thube.jpg" 
                      alt="Thubelihle Nkutha" 
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                  
                  <div className="bg-white text-black py-2 px-6 inline-block self-start mt-2">
                    <p className="text-sm font-medium">Co-Founder & CEO</p>
                  </div>
                </div>
              </div>
              
              {/* Team Member 2 */}
              <div className="w-[85vw] md:w-[35vw] lg:w-[30vw] flex-shrink-0 px-4">
                <div className="flex flex-col">
                  <h3 className="text-2xl md:text-3xl font-serif mb-8 text-center md:text-left">Neo Mosito</h3>
                  
                  <div className="relative aspect-[3/4] mb-4 grayscale hover:grayscale-0 transition-all duration-300">
                    <Image 
                      src="/images/Neo.jpg" 
                      alt="Neo Mosito" 
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                  
                  <div className="bg-white text-black py-2 px-6 inline-block self-start mt-2">
                    <p className="text-sm font-medium">Co-Founder & CFO</p>
                  </div>
                </div>
              </div>
              
              {/* Team Member 3 */}
              <div className="w-[85vw] md:w-[35vw] lg:w-[30vw] flex-shrink-0 px-4">
                <div className="flex flex-col">
                  <h3 className="text-2xl md:text-3xl font-serif mb-8 text-center md:text-left">Sango Velaphi</h3>
                  
                  <div className="relative aspect-[3/4] mb-4 grayscale hover:grayscale-0 transition-all duration-300">
                    <Image 
                      src="/images/Sango.jpg"
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
              <div className="w-[85vw] md:w-[35vw] lg:w-[30vw] flex-shrink-0 px-4">
                <div className="flex flex-col">
                  <h3 className="text-2xl md:text-3xl font-serif mb-8 text-center md:text-left">Itumeleng Mosisili</h3>
                  
                  <div className="relative aspect-[3/4] mb-4 grayscale hover:grayscale-0 transition-all duration-300">
                    <Image 
                      src="/images/Itu.jpg"
                      alt="Team member" 
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                  
                  <div className="bg-white text-black py-2 px-6 inline-block self-start mt-2">
                    <p className="text-sm font-medium">Junior Operations Manager</p>
                  </div>
                </div>
              </div>
              
              {/* Team Member 5 */}
              <div className="w-[85vw] md:w-[35vw] lg:w-[30vw] flex-shrink-0 px-4">
                <div className="flex flex-col">
                  <h3 className="text-2xl md:text-3xl font-serif mb-8 text-center md:text-left">Emihle January</h3>
                  
                  <div className="relative aspect-[3/4] mb-4 grayscale hover:grayscale-0 transition-all duration-300">
                    <Image 
                      src="/images/Emihle.jpg"
                      alt="Emihle" 
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                  
                  <div className="bg-white text-black py-2 px-6 inline-block self-start mt-2">
                    <p className="text-sm font-medium">Social Media and Creative Lead</p>
                  </div>
                </div>
              </div>
            </div>
          
          {/* Horizontal scroll controls */}
          <div className="flex justify-center mt-16 space-x-4">
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
      </section>
      
      <Footer />
    </main>
  )
} 