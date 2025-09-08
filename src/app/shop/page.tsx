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
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  
  // Newsletter form state
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' })

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  const images = [
    { src: "/shop_images/shop_1.jpg", alt: "French for New Merchandise Collection" },
    { src: "/shop_images/shop_2.jpg", alt: "Soundset Sunday Merch" },
    { src: "/shop_images/shop_3.jpg", alt: "French for New Apparel" },
    { src: "/shop_images/shop_4.jpg", alt: "Event Merchandise Collection" },
    { src: "/shop_images/shop_5.jpg", alt: "Limited Edition Merch" }
  ];

  const heroImages = [
    { src: "/images/merch_hero_1.png", alt: "Hero background image 1" },
    { src: "/images/merch_hero_2.png", alt: "Hero background image 2" }
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000); // Change image every 3 seconds
    
    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    const heroInterval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev === 0 ? 1 : 0));
    }, 5000); // Change hero background every 5 seconds
    
    return () => clearInterval(heroInterval);
  }, []);

  // Newsletter form submission handler
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: '' })

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'Thank you! We\'ll notify you when our merchandise drops.'
        })
        setEmail("") // Reset form
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.error || 'Something went wrong. Please try again.'
        })
      }
    } catch (error) {
      console.error("Error submitting newsletter signup:", error)
      setSubmitStatus({
        type: 'error',
        message: 'Failed to sign up. Please check your connection and try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <PageLoader onLoadingComplete={handleLoadingComplete} />
  }
  
  return (
    <main className="min-h-screen bg-black text-white with-hero-nav">
      <Navigation activePage="SHOP" />
      
      {/* Hero Section */}
      <section className="relative h-[50vh] sm:h-screen flex items-center justify-center overflow-hidden">
        {/* Background image 1 */}
        <div 
          className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${
            currentHeroImage === 0 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={heroImages[0].src}
            alt={heroImages[0].alt}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>

        {/* Background image 2 */}
        <div 
          className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${
            currentHeroImage === 1 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={heroImages[1].src}
            alt={heroImages[1].alt}
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>

        {/* Overlay for better text readability */}
        <div className="absolute inset-0 z-5 bg-black/40"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex items-center justify-center h-full">
          <div className="animate-fadeIn">
            <h1 className="font-serif text-2xl md:text-5xl lg:text-6xl font-light tracking-wide text-white border-2 border-white px-6 py-4">
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
              
              <a href="#newsletter-signup" className="inline-flex items-center text-orange-500 text-xl hover:text-orange-400 transition-colors group">
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
      <section id="newsletter-signup" className="py-20 bg-black">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-light mb-8">
            BE THE FIRST TO KNOW
          </h2>
          
          <p className="text-lg mb-10 max-w-2xl mx-auto">
            Sign up to receive updates about our merchandise launch and get early access to limited drops.
          </p>
          
          {/* Status Message */}
          {submitStatus.type && (
            <div className={`mb-8 p-4 rounded-lg border max-w-md mx-auto ${
              submitStatus.type === 'success' 
                ? 'bg-green-900/20 border-green-500 text-green-300'
                : 'bg-red-900/20 border-red-500 text-red-300'
            }`}>
              {submitStatus.message}
            </div>
          )}
          
          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <input 
                type="email" 
                placeholder="Your Email Address" 
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  // Clear status when user starts typing
                  if (submitStatus.type) {
                    setSubmitStatus({ type: null, message: '' })
                  }
                }}
                required
                disabled={isSubmitting}
                className="bg-black border border-white px-6 py-3 flex-grow text-white focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50"
              />
              <button 
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-3 font-medium transition ${
                  isSubmitting
                    ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                    : 'bg-white text-black hover:bg-gray-200'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center space-x-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" className="opacity-25" />
                      <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Submitting...</span>
                  </span>
                ) : (
                  "NOTIFY ME"
                )}
              </button>
            </div>
            <p className="text-xs mt-4 text-gray-400">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </form>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </main>
  )
} 