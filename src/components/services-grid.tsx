'use client'

import React, { useState, useEffect, useRef } from 'react';

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

export default function ServicesGrid() {
  const services = [
    {
      id: 1,
      title: "Event Production",
      description: "We transform ideas into immersive experiences. By blending creative vision with technical precision, we design, manage, and execute seamless events that captivate audiences and leave a lasting impact."
    },
    {
      id: 2,
      title: "Event Planning",
      description: "Our team meticulously plans events of any size, ensuring every detail is taken care of to deliver a flawless experience that exceeds client expectations."
    },
    {
      id: 3,
      title: "Talent Management",
      description: "Leveraging our strong relationships with artists, we curate exceptional line-ups and deploy a dedicated team to manage talent on the day of the event, ensuring smooth coordination."
    },
    {
      id: 4,
      title: "Marketing",
      description: "We craft compelling marketing strategies to promote events effectively, ensuring they reach the right audience and maximize engagement."
    }
  ];

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
            <h3 className="font-serif text-4xl md:text-5xl font-light mb-6">
              1. Event Production
            </h3>
            <p className="text-base md:text-lg leading-relaxed max-w-md font-light">
              We transform ideas into immersive experiences. By blending creative vision with technical precision, we design, manage, and execute seamless events that captivate audiences and leave a lasting impact.
            </p>
          </div>
          
          {/* Item 3 */}
          <div className="flex flex-col pr-8 md:pr-16">
            <h3 className="font-serif text-4xl md:text-5xl font-light mb-6 opacity-90">
              3. Talent Management
            </h3>
            <p className="text-base md:text-lg leading-relaxed opacity-75 max-w-md font-light">
              Leveraging our strong relationships with artists, we curate exceptional line-ups and deploy a dedicated team to manage talent on the day of the event, ensuring smooth coordination.
            </p>
          </div>
        </div>
        
        {/* Right Column - Items 2 and 4 (with offset) */}
        <div className="flex flex-col gap-y-36 md:gap-y-40 mt-24 md:mt-32 pl-4">
          {/* Item 2 */}
          <div className="flex flex-col pr-8 md:pr-16">
            <h3 className="font-serif text-4xl md:text-5xl font-light mb-6">
              2. Event Planning
            </h3>
            <p className="text-base md:text-lg leading-relaxed max-w-md font-light">
              Our team meticulously plans events of any size, ensuring every detail is taken care of to deliver a flawless experience that exceeds client expectations.
            </p>
          </div>
          
          {/* Item 4 */}
          <div className="flex flex-col pr-8 md:pr-16">
            <h3 className="font-serif text-4xl md:text-5xl font-light mb-6 opacity-90">
              4. Marketing
            </h3>
            <p className="text-base md:text-lg leading-relaxed opacity-75 max-w-md font-light">
              We craft compelling marketing strategies to promote events effectively, ensuring they reach the right audience and maximize engagement.
            </p>
          </div>
        </div>
      </div>
      
      {/* Mobile Layout (hidden on desktop) */}
      <div className="md:hidden flex flex-col gap-y-16 max-w-xl mx-auto">
        {/* Item 1 */}
        <div className="flex flex-col">
          <h3 className="font-serif text-4xl font-light mb-4">
            1. Event Production
          </h3>
          <p className="text-base leading-relaxed font-light">
            We transform ideas into immersive experiences. By blending creative vision with technical precision, we design, manage, and execute seamless events that captivate audiences and leave a lasting impact.
          </p>
        </div>
        
        {/* Item 2 */}
        <div className="flex flex-col">
          <h3 className="font-serif text-4xl font-light mb-4">
            2. Event Planning
          </h3>
          <p className="text-base leading-relaxed font-light">
            Our team meticulously plans events of any size, ensuring every detail is taken care of to deliver a flawless experience that exceeds client expectations.
          </p>
        </div>
        
        {/* Item 3 */}
        <div className="flex flex-col">
          <h3 className="font-serif text-4xl font-light mb-4 opacity-90">
            3. Talent Management
          </h3>
          <p className="text-base leading-relaxed opacity-75 font-light">
            Leveraging our strong relationships with artists, we curate exceptional line-ups and deploy a dedicated team to manage talent on the day of the event, ensuring smooth coordination.
          </p>
        </div>
        
        {/* Item 4 */}
        <div className="flex flex-col">
          <h3 className="font-serif text-4xl font-light mb-4 opacity-90">
            4. Marketing
          </h3>
          <p className="text-base leading-relaxed opacity-75 font-light">
            We craft compelling marketing strategies to promote events effectively, ensuring they reach the right audience and maximize engagement.
          </p>
        </div>
      </div>
    </section>
  );
} 