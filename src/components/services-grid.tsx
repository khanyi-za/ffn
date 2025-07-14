'use client'

import React, { useState, useEffect, useRef, ReactNode } from 'react';

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

// RevealText component for word-by-word text reveal
interface RevealTextProps {
  children: ReactNode;
}

function RevealText({ children }: RevealTextProps) {
  const textRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (!textRef.current) return
    
    // Select all span elements with class "word"
    const wordSpans = textRef.current.querySelectorAll('.word')
    
    if (!wordSpans.length) return
    
    // Initially set all words to dark
    wordSpans.forEach((word, index) => {
      word.classList.add('text-zinc-900')
      word.classList.add('transition-colors')
      word.classList.add('duration-800')
      // Add data attribute to track the global order
      word.setAttribute('data-index', index.toString())
      word.setAttribute('data-state', 'dark')
    })
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // When an element containing words enters viewport
        if (entry.isIntersecting) {
          // Get all words in this element
          const element = entry.target as HTMLElement
          const words = element.querySelectorAll('.word')
          
          words.forEach((word, wordIndex) => {
            const currentState = word.getAttribute('data-state')
            
            // Set a delay based on the word's position
            setTimeout(() => {
              if (currentState === 'dark') {
                // Change to white
                word.classList.remove('text-zinc-900')
                word.classList.add('text-white')
                word.setAttribute('data-state', 'light')
              } else {
                // Change to dark
                word.classList.remove('text-white')
                word.classList.add('text-zinc-900')
                word.setAttribute('data-state', 'dark')
              }
            }, wordIndex * 106) // 106ms delay between each word (1.7x faster)
          })
        }
      })
    }, {
      threshold: 0.8, // Trigger when element is 80% visible
      rootMargin: '0px 0px -10% 0px'
    })
    
    // Observe paragraphs and headings
    const elements = textRef.current.querySelectorAll('p, h3')
    elements.forEach((el) => {
      observer.observe(el)
    })
    
    return () => {
      elements.forEach((el) => {
        observer.unobserve(el)
      })
    }
  }, [])
  
  return (
    <div ref={textRef} className="relative">
      {children}
    </div>
  )
}

export default function ServicesGrid() {
  // Split text into words for the reveal effect
  const splitTextIntoWords = (text: string) => {
    return text.split(' ').map((word, index) => (
      <span key={index}>
        <span className="word">{word}</span>
        {index < text.split(' ').length - 1 ? ' ' : ''}
      </span>
    ));
  };

  return (
    <section className="w-full min-h-screen bg-black text-white px-6 md:px-16 lg:px-24 flex flex-col justify-center py-16">
      <div className="flex justify-start mb-20 md:mb-24">
        <div className="inline-block border-2 border-white px-8 py-4">
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light">
            <TypewriterEffect text="Our Services..." speed={120} />
          </h2>
        </div>
      </div>
      
      {/* Desktop Layout (hidden on mobile) */}
      <div className="hidden md:grid md:grid-cols-2 gap-x-10 max-w-7xl mx-auto relative">
        {/* Left Column - Items 1 and 3 */}
        <div className="flex flex-col gap-y-36 md:gap-y-40 pr-4">
          {/* Item 1 */}
          <div className="flex flex-col pr-8 md:pr-16">
            <RevealText>
              <h3 className="font-serif text-4xl md:text-5xl font-light mb-6">
                {splitTextIntoWords("1. Event Production")}
              </h3>
              <p className="text-base md:text-lg leading-relaxed max-w-md font-light">
                {splitTextIntoWords(
                  "We transform ideas into immersive experiences. By blending creative vision with technical precision, we design, manage, and execute seamless events that captivate audiences and leave a lasting impact."
                )}
              </p>
            </RevealText>
          </div>
          
          {/* Item 3 */}
          <div className="flex flex-col pr-8 md:pr-16">
            <RevealText>
              <h3 className="font-serif text-4xl md:text-5xl font-light mb-6 opacity-90">
                {splitTextIntoWords("3. Marketing")}
              </h3>
              <p className="text-base md:text-lg leading-relaxed opacity-75 max-w-md font-light">
                {splitTextIntoWords(
                  "We craft compelling marketing strategies to promote events effectively, ensuring they reach the right audience and maximize engagement."
                )}
              </p>
            </RevealText>
          </div>
        </div>
        
        {/* Right Column - Items 2 and 4 (with offset) */}
        <div className="flex flex-col gap-y-36 md:gap-y-40 mt-24 md:mt-32 pl-4">
          {/* Item 2 */}
          <div className="flex flex-col pr-8 md:pr-16">
            <RevealText>
              <h3 className="font-serif text-4xl md:text-5xl font-light mb-6">
                {splitTextIntoWords("2. Event Planning")}
              </h3>
              <p className="text-base md:text-lg leading-relaxed max-w-md font-light">
                {splitTextIntoWords(
                  "Our team meticulously plans events of any size, ensuring every detail is taken care of to deliver a flawless experience that exceeds client expectations."
                )}
              </p>
            </RevealText>
          </div>
          
          {/* Item 4 */}
          <div className="flex flex-col pr-8 md:pr-16">
            <RevealText>
              <h3 className="font-serif text-4xl md:text-5xl font-light mb-6 opacity-90">
                {splitTextIntoWords("4. Talent Management")}
              </h3>
              <p className="text-base md:text-lg leading-relaxed opacity-75 max-w-md font-light">
                {splitTextIntoWords(
                  "Leveraging our strong relationships with artists, we curate exceptional line-ups and deploy a dedicated team to manage talent on the day of the event, ensuring smooth coordination."
                )}
              </p>
            </RevealText>
          </div>
        </div>
      </div>
      
      {/* Mobile Layout (hidden on desktop) */}
      <div className="md:hidden flex flex-col gap-y-16 max-w-xl mx-auto">
        {/* Item 1 */}
        <div className="flex flex-col">
          <RevealText>
            <h3 className="font-serif text-4xl font-light mb-4">
              {splitTextIntoWords("1. Event Production")}
            </h3>
            <p className="text-base leading-relaxed font-light">
              {splitTextIntoWords(
                "We transform ideas into immersive experiences. By blending creative vision with technical precision, we design, manage, and execute seamless events that captivate audiences and leave a lasting impact."
              )}
            </p>
          </RevealText>
        </div>
        
        {/* Item 2 */}
        <div className="flex flex-col">
          <RevealText>
            <h3 className="font-serif text-4xl font-light mb-4">
              {splitTextIntoWords("2. Event Planning")}
            </h3>
            <p className="text-base leading-relaxed font-light">
              {splitTextIntoWords(
                "Our team meticulously plans events of any size, ensuring every detail is taken care of to deliver a flawless experience that exceeds client expectations."
              )}
            </p>
          </RevealText>
        </div>
        
        {/* Item 3 */}
        <div className="flex flex-col">
          <RevealText>
            <h3 className="font-serif text-4xl font-light mb-4 opacity-90">
              {splitTextIntoWords("3. Marketing")}
            </h3>
            <p className="text-base leading-relaxed opacity-75 font-light">
              {splitTextIntoWords(
                "We craft compelling marketing strategies to promote events effectively, ensuring they reach the right audience and maximize engagement."
              )}
            </p>
          </RevealText>
        </div>
        
        {/* Item 4 */}
        <div className="flex flex-col">
          <RevealText>
            <h3 className="font-serif text-4xl font-light mb-4 opacity-90">
              {splitTextIntoWords("4. Talent Management")}
            </h3>
            <p className="text-base leading-relaxed opacity-75 font-light">
              {splitTextIntoWords(
                "Leveraging our strong relationships with artists, we curate exceptional line-ups and deploy a dedicated team to manage talent on the day of the event, ensuring smooth coordination."
              )}
            </p>
          </RevealText>
        </div>
      </div>
    </section>
  );
} 