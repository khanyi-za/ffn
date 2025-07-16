'use client'

import Image from "next/image"
import { useState, useEffect } from "react"

interface HomePageEventsProps {
  className?: string
}

export default function HomePageEvents({
  className = "",
}: HomePageEventsProps) {
  // Array of all 6 images from row_images
  const allImages = [
    { src: "/row_images/gdn-a.JPG", alt: "Event image 1" },
    { src: "/row_images/kix-b.JPG", alt: "Event image 2" },
    { src: "/row_images/jw-a.jpg", alt: "Event image 3" },
    { src: "/row_images/gdn-b.JPG", alt: "Event image 4" },
    { src: "/row_images/jw-b.JPG", alt: "Event image 5" },
    { src: "/row_images/kix-a.jpg", alt: "Event image 6" },
  ]

  // State to track the starting index of the current 3 images
  const [currentIndex, setCurrentIndex] = useState(0)

  // Rotate to next image every 3.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        // For seamless single-image sliding, we need one extra position
        // Reset when we complete the full cycle
        const nextIndex = prev + 1
        return nextIndex > allImages.length ? 0 : nextIndex
      })
    }, 3500) // 3.5 seconds

    return () => clearInterval(interval)
  }, [allImages.length])

  // Create extended array with enough images for seamless looping
  const extendedImages = [...allImages, ...allImages, ...allImages.slice(0, 3)]

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <div 
        className="flex transition-transform duration-[2000ms] ease-out"
        style={{ 
          transform: `translateX(${currentIndex * (-100 / extendedImages.length)}%)`,
          width: `${(extendedImages.length / 3) * 100}%`
        }}
      >
        {extendedImages.map((image, index) => (
          <div 
            key={`image-${index}`} 
            className="relative aspect-[4/3] flex-shrink-0"
            style={{ width: `${100 / extendedImages.length}%` }}
          >
            <Image
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 33vw, 33vw"
            />
          </div>
        ))}
      </div>
    </div>
  )
} 