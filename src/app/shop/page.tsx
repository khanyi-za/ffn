'use client'

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import PageLoader from "@/components/page-loader"

// Product types
interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  images: string[];
  description: string;
  slug: string;
}

// Product data
const products: Product[] = [
  {
    id: 'football-jersey',
    name: 'Football Jersey',
    price: 700.00,
    currency: 'ZAR',
    images: [
      '/merch/football_jersey/994A1511.jpg',
      '/merch/football_jersey/994A1558.jpg',
      '/merch/football_jersey/994A1579.jpg',
      '/merch/football_jersey/shop_4.jpg'
    ],
    description: 'Premium quality French For New football jersey',
    slug: 'football-jersey'
  },
  {
    id: 'bowling-shirt',
    name: 'Bowling Shirt',
    price: 800.00,
    currency: 'ZAR',
    images: [
      '/merch/bowling_shirt/994A1352.jpg',
      '/merch/bowling_shirt/994A1369.jpg',
      '/merch/bowling_shirt/994A1382.jpg',
      '/merch/bowling_shirt/994A1427.jpg',
      '/merch/bowling_shirt/994A1438.jpg'
    ],
    description: 'Stylish French For New bowling shirt',
    slug: 'bowling-shirt'
  }
];

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
  const [currentHeroImage, setCurrentHeroImage] = useState(0)

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }


  const heroImages = [
    { src: "/images/merch_hero_1.png", alt: "Hero background image 1" },
    { src: "/images/merch_hero_2.png", alt: "Hero background image 2" }
  ];
  

  useEffect(() => {
    const heroInterval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev === 0 ? 1 : 0));
    }, 5000); // Change hero background every 5 seconds
    
    return () => clearInterval(heroInterval);
  }, []);


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
        <div className="absolute inset-0 z-5 bg-black/10"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex items-center justify-center h-full">
          <div className="animate-fadeIn">
            <h1 className="font-serif text-2xl md:text-5xl lg:text-6xl font-light tracking-wide text-white border-2 border-white px-6 py-4">
              <TypewriterEffect 
                text="SHOP..." 
                speed={120}
                restartDelay={4000}
              />
            </h1>
          </div>
        </div>
      </section>
      
      {/* Products Section */}
      <section className="py-24 bg-black">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-light mb-4 text-white">
              Our Collection
            </h2>
            <p className="text-gray-400 text-lg">
              Premium French For New merchandise
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
            {products.map((product) => (
              <div key={product.id} className="group">
                <Link href={`/shop/${product.slug}`}>
                  <div className="relative aspect-square mb-6 overflow-hidden rounded-lg bg-gray-900">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white font-medium text-lg border border-white px-6 py-2 rounded">
                        View Details
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="font-serif text-2xl md:text-3xl font-light text-white mb-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-400 mb-4">{product.description}</p>
                    <p className="text-orange-500 text-xl font-medium">
                      R{product.price.toFixed(2)}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      
      {/* Footer */}
      <Footer />
    </main>
  )
} 