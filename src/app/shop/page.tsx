'use client'

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import PageLoader from "@/components/page-loader"

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

export default function Shop() {
  const [isLoading, setIsLoading] = useState(true)
  const [currentImage, setCurrentImage] = useState(0);

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  const images = [
    { src: "/images/merch_1.jpeg", alt: "Soundset Sunday Merch & French for New Merch" },
    { src: "/images/merch_2.jpeg", alt: "Soundset Sunday Merch & French for New Collection" }
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev === 0 ? 1 : 0));
    }, 3000); // Change image every 3 seconds
    
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return <PageLoader onLoadingComplete={handleLoadingComplete} />
  }
  
  return (
    <main className="min-h-screen bg-black text-white">
      <Navigation activePage="SHOP" />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-black/25"></div>
          <Image
            src="/images/merch_background.jpeg" 
            alt="Shop Coming Soon Background"
            fill
            priority
            className="object-cover mix-blend-overlay opacity-30"
          />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex items-center justify-center h-full">
          <div className="animate-fadeIn">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light tracking-wide text-white border-2 border-white px-6 py-4">
              <TypewriterEffect 
                text="COMING SOON..." 
                speed={120}
                restartDelay={4000}
              />
            </h1>
          </div>
        </div>
      </section>
      
      {/* Merchandise Showcase Section */}
      <section className="py-24 bg-black">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <p className="text-white text-2xl mb-6">Coming Soon</p>
              
              <h3 className="text-gray-400 text-4xl md:text-5xl font-light mb-12">
                Soundset Sunday Merch &<br />
                French for New Merch
              </h3>
              
              <a href="#" className="inline-flex items-center text-orange-500 text-xl hover:text-orange-400 transition-colors group">
                Be the first to know 
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>
            
            <div className="relative h-[588px] w-full">
              <Image
                src={images[currentImage].src}
                alt={images[currentImage].alt}
                fill
                className="rounded-md object-cover transition-opacity duration-500"
                sizes="(max-width: 768px) 100vw, 800px"
              />
              <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`w-2 h-2 rounded-full ${
                      index === currentImage ? "bg-orange-500" : "bg-gray-500"
                    }`}
                    aria-label={`View image ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Newsletter signup */}
      <section className="py-20 bg-black">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-light mb-8">
            BE THE FIRST TO KNOW
          </h2>
          
          <p className="text-lg mb-10 max-w-2xl mx-auto">
            Sign up to receive updates about our merchandise launch and get early access to limited drops.
          </p>
          
          <div className="max-w-md mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <input 
                type="email" 
                placeholder="Your Email Address" 
                className="bg-black border border-white px-6 py-3 flex-grow text-white focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="bg-white text-black px-6 py-3 font-medium hover:bg-gray-200 transition">
                NOTIFY ME
              </button>
            </div>
            <p className="text-xs mt-4 text-gray-400">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </main>
  )
} 