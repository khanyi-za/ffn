'use client'

import Image from "next/image"
import Link from "next/link"

export default function MerchComingSoon() {
  const previewImages = [
    { src: '/preview_gallery/DSC06344.jpg', alt: 'Gallery preview 1' },
    { src: '/preview_gallery/HOOD7031.JPG', alt: 'Gallery preview 2' },
    { src: '/preview_gallery/HOOD6830.jpg', alt: 'Gallery preview 3' },
    { src: '/preview_gallery/HOOD6845.jpg', alt: 'Gallery preview 4' }
  ]

  return (
    <section className="bg-black py-8 sm:py-12 md:py-16">
      {/* Gallery Preview Row */}
      <div className="flex justify-center px-4 sm:px-6 md:px-0 mb-8 sm:mb-12 md:mb-16">
        <div className="w-full sm:w-[90%] md:w-[80%] lg:w-[70%]">
          {/* Section Title */}
          <div className="flex justify-center mb-4 sm:mb-6 md:mb-8">
            <div className="border-2 border-white px-4 sm:px-6 py-2 sm:py-3 rounded-md sm:rounded-lg">
              <p className="text-white text-xs sm:text-sm md:text-base font-medium tracking-wider">
                See Photos From Past Events
              </p>
            </div>
          </div>

          {/* Images Grid with Overlay */}
          <div className="relative">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
              {previewImages.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square overflow-hidden rounded-md sm:rounded-lg border-2 border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 22vw, (max-width: 1024px) 20vw, 17vw"
                  />
                </div>
              ))}
            </div>

            {/* Centered "See gallery" overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Link 
                href="/gallery"
                className="border-2 border-white bg-black/20 backdrop-blur-md px-6 sm:px-8 py-3 sm:py-4 rounded-lg pointer-events-auto hover:bg-black/40 hover:scale-105 transition-all duration-500 cursor-pointer animate-pulse hover:animate-none shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                {/* Camera icon */}
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  className="text-white sm:w-5 sm:h-5"
                >
                  <path 
                    d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 4H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                  <circle 
                    cx="12" 
                    cy="13" 
                    r="4" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="text-white text-sm sm:text-base font-medium tracking-wider">
                  See gallery
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Merch Component */}
      <div className="flex justify-center px-4 sm:px-6 md:px-0">
        <div className="w-full sm:w-[90%] md:w-[80%] lg:w-[70%] grid grid-cols-2 min-h-[40vh] sm:min-h-[50vh] md:min-h-[56vh] rounded-lg sm:rounded-xl md:rounded-2xl border-2 sm:border-3 md:border-4 border-white overflow-hidden">
          {/* Left side - Image */}
          <div className="relative overflow-hidden" style={{ backgroundColor: '#B8986A' }}>
            <div className="relative w-full h-full">
              <Image
                src="/merch/merch_coming.jpg"
                alt="Person wearing beige KUNYE hoodie"
                fill
                className="object-cover object-center"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 45vw, (max-width: 1024px) 40vw, 35vw"
              />
            </div>
          </div>
          
          {/* Right side - Content */}
          <div className="flex flex-col items-center justify-center py-6 sm:py-8 md:py-12 px-3 sm:px-4 md:px-8 text-center" style={{ backgroundColor: '#E8D5B7' }}>
            {/* Shopping bag icon */}
            <div className="mb-3 sm:mb-4 md:mb-6">
              <svg 
                width="32" 
                height="32" 
                viewBox="0 0 24 24" 
                fill="none" 
                className="text-[#B8986A] sm:w-12 sm:h-12 md:w-16 md:h-16"
              >
                <path 
                  d="M19 7H16V6C16 4.897 15.103 4 14 4H10C8.897 4 8 4.897 8 6V7H5C4.447 7 4 7.447 4 8V18C4 19.103 4.897 20 6 20H18C19.103 20 20 19.103 20 18V8C20 7.447 19.553 7 19 7ZM10 6H14V7H10V6ZM18 18H6V9H8V10C8 10.553 8.447 11 9 11S10 10.553 10 10V9H14V10C14 10.553 14.447 11 15 11S16 10.553 16 10V9H18V18Z" 
                  fill="currentColor"
                />
              </svg>
            </div>
            
            {/* Main heading */}
            <h2 className="font-serif text-lg sm:text-2xl md:text-4xl lg:text-5xl font-bold text-black mb-2 sm:mb-3 md:mb-4 tracking-wide leading-tight">
              FFN<br />MERCH
            </h2>
            
            {/* Coming soon text */}
            <p className="text-[#B8986A] text-xs sm:text-sm md:text-lg lg:text-xl font-medium tracking-widest">
              COMING SOON
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}