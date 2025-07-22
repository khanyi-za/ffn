'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface PageLoaderProps {
  onLoadingComplete: () => void
}

export default function PageLoader({ onLoadingComplete }: PageLoaderProps) {
  const [progress, setProgress] = useState(0)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    // Smooth progress animation over 2.3 seconds
    const duration = 2300 // 2.3 seconds
    const interval = 50 // Update every 50ms
    const increment = (interval / duration) * 100

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + increment
        if (newProgress >= 100) {
          clearInterval(progressInterval)
          // Start exit animation
          setIsExiting(true)
          // Complete loading after exit animation
          setTimeout(() => {
            onLoadingComplete()
          }, 500) // 500ms exit animation
          return 100
        }
        return newProgress
      })
    }, interval)

    return () => clearInterval(progressInterval)
  }, [onLoadingComplete])

  return (
    <div className={`fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center transition-all duration-500 ${
      isExiting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
    }`}>
      {/* FFN Logo */}
      <div className="mb-12 animate-pulse">
        <Image
          src="/images/ffn_white_logo.svg"
          alt="French for New Logo"
          width={120}
          height={90}
          className="object-contain"
          priority
        />
      </div>

      {/* Loading Text */}
      <div className="mb-8">
        <h2 className="text-white font-serif text-xl md:text-2xl tracking-wider animate-fade-in">
          Loading Experience...
        </h2>
      </div>

      {/* Progress Bar Container */}
      <div className="w-64 md:w-80 h-1 bg-gray-800 rounded-full overflow-hidden">
        {/* Progress Bar Fill */}
        <div 
          className="h-full bg-gradient-to-r from-white via-gray-200 to-white rounded-full transition-all duration-100 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Progress Percentage */}
      <div className="mt-6">
        <span className="text-white/70 text-sm font-mono">
          {Math.round(progress)}%
        </span>
      </div>

      {/* Animated Dots */}
      <div className="mt-8 flex space-x-2">
        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
      `}</style>
    </div>
  )
} 