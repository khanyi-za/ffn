"use client"

import Footer from "@/components/footer"
import Navigation from "@/components/navigation"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"

// Define type interfaces
interface EventData {
  dates: {
    [date: string]: string[];
  };
}

interface EventsDataType {
  [eventName: string]: EventData;
}

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  aspectRatio: string;
}

interface GalleryImagesType {
  [photographer: string]: GalleryImage[];
}

// Define events, dates, and photographers in a hierarchical structure
const EVENTS_DATA: EventsDataType = {
  "Sunset Sunday": {
    dates: {
      "09 March 2025": ["Wanday Group Media X"],
      "06 Jan 2025": ["hood Universal", "Marian Charambira"],
      "22 Dec 2024": ["Marian Charambira", "Micaelasling Photography"],
    }
  },
  "Rare": {
    dates: {
      "09 March 2025": ["Wanday Group Media X"],
    }
  },
  "Electric Sessions": {
    dates: {
      "09 March 2025": ["Wanday Group Media X"],
    }
  }
}

// Sample gallery images
const GALLERY_IMAGES: GalleryImagesType = {
  "hood Universal": [
    { id: 'hu1', src: '/images/ep_1.png', alt: 'Street scene', aspectRatio: 'wide' },
    { id: 'hu2', src: '/images/hp_1.png', alt: 'Urban portrait', aspectRatio: 'tall' },
    { id: 'hu3', src: '/images/hp_2.png', alt: 'City landscape', aspectRatio: 'wide' },
    { id: 'hu4', src: '/images/hp_3.png', alt: 'Graffiti art', aspectRatio: 'tall' },
    { id: 'hu5', src: '/images/ep_2.png', alt: 'Street art', aspectRatio: 'square' },
    { id: 'hu6', src: '/images/video_variable.png', alt: 'Urban environment', aspectRatio: 'square' },
    { id: 'hu7', src: '/images/flyer.png', alt: 'Street fashion', aspectRatio: 'tall' },
    { id: 'hu8', src: '/images/ep_3.png', alt: 'City street', aspectRatio: 'wide' }
  ],
  "Marian Charambira": [
    { id: 'm1', src: '/images/hp_1.png', alt: 'Concert wide shot', aspectRatio: 'wide' },
    { id: 'm2', src: '/images/hp_2.png', alt: 'Portrait photography', aspectRatio: 'tall' },
    { id: 'm3', src: '/images/hp_3.png', alt: 'Event crowd', aspectRatio: 'wide' },
    { id: 'm4', src: '/images/ep_1.png', alt: 'Backstage moment', aspectRatio: 'square' },
    { id: 'm5', src: '/images/video_variable.png', alt: 'Event portrait', aspectRatio: 'tall' },
    { id: 'm6', src: '/images/ep_2.png', alt: 'Concert shot', aspectRatio: 'wide' },
    { id: 'm7', src: '/images/flyer.png', alt: 'Music festival', aspectRatio: 'wide' },
    { id: 'm8', src: '/images/ep_3.png', alt: 'Artist performance', aspectRatio: 'square' }
  ],
  "Wanday Group Media X": [
    { id: 'w1', src: '/images/ep_1.png', alt: 'Event scene', aspectRatio: 'wide' },
    { id: 'w2', src: '/images/hp_1.png', alt: 'Studio portrait', aspectRatio: 'tall' },
    { id: 'w3', src: '/images/hp_2.png', alt: 'Group photo', aspectRatio: 'wide' },
    { id: 'w4', src: '/images/hp_3.png', alt: 'Fashion shot', aspectRatio: 'tall' },
    { id: 'w5', src: '/images/ep_2.png', alt: 'Promotional image', aspectRatio: 'square' },
    { id: 'w6', src: '/images/video_variable.png', alt: 'Media content', aspectRatio: 'wide' }
  ],
  "Micaelasling Photography": [
    { id: 'mp1', src: '/images/hp_1.png', alt: 'Night photography', aspectRatio: 'wide' },
    { id: 'mp2', src: '/images/hp_2.png', alt: 'Studio work', aspectRatio: 'tall' },
    { id: 'mp3', src: '/images/hp_3.png', alt: 'Creative lighting', aspectRatio: 'square' },
    { id: 'mp4', src: '/images/ep_1.png', alt: 'Product shot', aspectRatio: 'wide' }
  ]
}

export default function GalleryPage() {
  // Initialize with first event, date, and photographer
  const [activeEvent, setActiveEvent] = useState<string>("Sunset Sunday");
  const [activeDate, setActiveDate] = useState<string>("09 March 2025");
  const [activePhotographer, setActivePhotographer] = useState<string>("Wanday Group Media X");
  
  // Event date options based on selected event
  const dateOptions = Object.keys(EVENTS_DATA[activeEvent].dates);
  
  // Safely get photographer options with fallback to empty array if undefined
  const photographerOptions = activeDate && EVENTS_DATA[activeEvent].dates[activeDate] 
    ? EVENTS_DATA[activeEvent].dates[activeDate] 
    : [];
  
  // Handle event changes - ensure date is valid for the selected event
  const handleEventChange = (newEvent: string) => {
    setActiveEvent(newEvent);
    // Date selection will be handled by the useEffect
  };
  
  // Update date and photographer when event changes
  useEffect(() => {
    // Get only dates associated with the selected event
    const eventDates = Object.keys(EVENTS_DATA[activeEvent].dates);
    
    // Sort dates in chronological order (newest first)
    const sortedDates = [...eventDates].sort((a, b) => {
      // Parse dates (accounting for different formats)
      const dateA = new Date(a.replace(/(\d+)\s+([A-Za-z]+)\s+(\d+)/, "$2 $1, $3"));
      const dateB = new Date(b.replace(/(\d+)\s+([A-Za-z]+)\s+(\d+)/, "$2 $1, $3"));
      // Sort in descending order (newest first)
      return dateB.getTime() - dateA.getTime();
    });
    
    // Select the newest date (first in the sorted array)
    const newestDate = sortedDates[0];
    
    // Always update date when event changes to ensure it's valid
    setActiveDate(newestDate);
    
    // And update the photographer based on the new date
    if (EVENTS_DATA[activeEvent].dates[newestDate] && EVENTS_DATA[activeEvent].dates[newestDate].length > 0) {
      setActivePhotographer(EVENTS_DATA[activeEvent].dates[newestDate][0]);
    }
    
    console.log(`Event changed to: ${activeEvent}`);
    console.log(`Available dates: ${eventDates.join(", ")}`);
    console.log(`Selected date: ${newestDate}`);
  }, [activeEvent]);
  
  // Update photographer when date changes
  useEffect(() => {
    // Only update if we have a valid date and photographers for it
    if (activeDate && EVENTS_DATA[activeEvent].dates[activeDate] && EVENTS_DATA[activeEvent].dates[activeDate].length > 0) {
      setActivePhotographer(EVENTS_DATA[activeEvent].dates[activeDate][0]);
    }
  }, [activeDate, activeEvent]);

  // Custom dropdown component with white border
  const CustomDropdown = ({ 
    value, 
    options, 
    onChange, 
    className = "",
    isLarge = false
  }: { 
    value: string, 
    options: string[], 
    onChange: (value: string) => void,
    className?: string,
    isLarge?: boolean
  }) => (
    <div className={`relative inline-block ${className}`}>
      <div className="relative">
        <div className={`flex items-center justify-between text-white border-2 border-white rounded-lg px-4 py-2 cursor-pointer ${isLarge ? 'text-5xl md:text-6xl font-serif' : 'text-lg md:text-xl'}`}>
          <div>{value}</div>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
        <select 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        >
          {options.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen with-hero-nav">
      {/* Gallery Hero Section */}
      <div className="relative h-[75vh] w-full overflow-hidden bg-black">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/gallery_page_hero.png"
            alt="Gallery hero image showing people at an event"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>

        {/* Navigation */}
        <Navigation activePage="GALLERY" />

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col justify-between h-full px-6 md:px-12 pb-12">
          <div className="mt-auto">
            {/* Event filter dropdown (replacing <h1>) */}
            <CustomDropdown 
              value={activeEvent}
              options={Object.keys(EVENTS_DATA)}
              onChange={handleEventChange}
              isLarge={true}
            />
            
            {/* Date filter dropdown (replacing <p>) */}
            <div className="mt-2">
              <CustomDropdown 
                value={activeDate}
                options={dateOptions}
                onChange={setActiveDate}
              />
            </div>
          </div>

          <div className="flex justify-between items-end w-full">
            {/* FFN Logo */}
            <div className="w-16 md:w-20">
              <Image
                src="/images/ffn_white_logo.svg"
                alt="ffn logo"
                width={80}
                height={60}
                className="object-contain"
              />
            </div>

            {/* Gallery Button */}
            <Link
              href="/gallery"
              className="border-2 border-white text-white px-8 py-3 text-lg md:text-xl font-medium tracking-wider hover:bg-white hover:text-black transition-colors inline-block rounded-lg"
            >
              GALLERY
            </Link>
          </div>
        </div>
      </div>

      {/* Photographer Filter Section */}
      <div className="backdrop-blur-md bg-white/30 py-4 px-6 md:px-12 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex space-x-12 overflow-x-auto pb-2 hide-scrollbar">
            <h2 className="font-mono text-black font-semibold whitespace-nowrap">
              Photographers
            </h2>

            {/* Generate photographer buttons dynamically based on active date */}
            {photographerOptions.length > 0 ? (
              photographerOptions.map(photographer => (
                <button 
                  key={photographer}
                  className={`font-mono whitespace-nowrap pb-1 transition-colors ${
                    activePhotographer === photographer 
                      ? "text-black border-2 border-black px-4 py-1 rounded-lg" 
                      : "text-black/60 hover:text-black hover:border-b hover:border-black"
                  }`}
                  onClick={() => setActivePhotographer(photographer)}
                >
                  {photographer}
                </button>
              ))
            ) : (
              <div className="text-black/60">No photographers available</div>
            )}
          </div>

          <div className="flex items-center space-x-6">
            <button className="text-black/60 hover:text-black transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-heart"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </button>
            <button className="text-black/60 hover:text-black transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-download"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" x2="12" y1="15" y2="3" />
              </svg>
            </button>
            <button className="text-black/60 hover:text-black transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-more-vertical"
              >
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="19" r="1" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Gallery Waterfall Grid */}
      <div className="bg-white py-8">
        <div className="px-2 md:px-4">
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-0.5 md:gap-1">
            {GALLERY_IMAGES[activePhotographer] ? 
              GALLERY_IMAGES[activePhotographer].map((image: GalleryImage) => (
                <div key={image.id} className="relative mb-1 break-inside-avoid">
                  <div className={`w-full ${
                    image.aspectRatio === "square" ? "aspect-square" :
                    image.aspectRatio === "tall" ? "aspect-tall" :
                    "aspect-wide"
                  }`}>
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover rounded-lg"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, (max-width: 1600px) 33vw, 25vw"
                    />
                  </div>
                </div>
              )) : 
              <div className="col-span-full text-center py-10 text-gray-500">
                No images available for this photographer
              </div>
            }
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

