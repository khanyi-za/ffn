'use client'

import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import EventUpdates from "@/components/event-updates"
import EventImagesRow from "@/components/event-images-row"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'

// Define the type for event data
type EventDataType = {
  eventName: string;
  description: string;
  tagline: string;
  eventDate: string;
  eventLocation: string;
  eventVideo: string;
  logoImage: string;
  images: Array<{
    src: string;
    alt: string;
  }>;
}

// Define the type for the event data object
type EventsDataObjectType = {
  [key: string]: EventDataType;
}

// Event data structure
const eventData: EventsDataObjectType = {
  "soundset-sunday": {
    eventName: "SOUNDSET SUNDAY",
    description: "Soundset Sunday is the heartbeat of the culture — a sacred gathering where hip-hop flows, amapiano move, house lifts, and R&B heals. More than a party, it's a sonic sanctuary",
    tagline: "Canvas of Sound Under the Sunday Sky",
    eventDate: "08 MARCH 25",
    eventLocation: "THE PLAYGROUND, 73 JUTA ST, BRAAM.",
    eventVideo: "/videos/A_Soundset.mp4",
    logoImage: "/event_logos/Soundset.png",
    images: [
      {
        src: "/images/ep_1.png",
        alt: "SoundSet Sunday event with green lighting and logo",
      },
      {
        src: "/images/ep_2.png",
        alt: "People dancing at SoundSet Sunday with blue lighting",
      },
      {
        src: "/images/ep_3.png",
        alt: "Crowded indoor venue at SoundSet Sunday event",
      },
    ]
  },
  "the-bobbynsenga-experience": {
    eventName: "THE BOBBYNSENGA EXPERIENCE",
    description: "Step into the soulful world of The Bobby Nsenga Experience — a live, vinyl-spun journey that feels like your favorite Sunday morning, elevated. Tickets are limited.",
    tagline: "Vinyl. Vibes. Nsenga.",
    eventDate: "15 APRIL 25",
    eventLocation: "THE PLAYGROUND, 73 JUTA ST, BRAAM.",
    eventVideo: "/videos/TBNE_Joburg.mp4",
    logoImage: "/images/bobby_exp_logo.png",
    images: [
      {
        src: "/images/ep_1.png",
        alt: "The Bobby Nsenga Experience event featuring vinyl setup",
      },
      {
        src: "/images/ep_2.png",
        alt: "Bobby Nsenga performing at the experience",
      },
      {
        src: "/images/ep_3.png",
        alt: "Crowd enjoying The Bobby Nsenga Experience",
      },
    ]
  },
  "rare": {
    eventName: "A RARE EXPERIENCE",
    description: "A unique experience showcasing experimental music and digital art. Join us for an unforgettable night where boundaries are pushed and expectations are exceeded.",
    tagline: "Where Music Meets Art In Rare Form.",
    eventDate: "22 APRIL 25",
    eventLocation: "STUDIO 88, ROSEBANK.",
    eventVideo: "/videos/A_Soundset.mp4",
    logoImage: "/event_logos/Rare.png",
    images: [
      {
        src: "/images/ep_1.png",
        alt: "RARE event with vibrant lighting",
      },
      {
        src: "/images/ep_2.png",
        alt: "Artists performing at RARE experience",
      },
      {
        src: "/images/ep_3.png",
        alt: "Digital art installation at RARE event",
      },
    ]
  },
  "electic-session": {
    eventName: "ELECTIC SESSIONS",
    description: "An immersive audio-visual journey through electronic soundscapes. Our carefully curated lineup brings together the best in electronic music.",
    tagline: "Discover The Future Of Sound.",
    eventDate: "15 MAY 25",
    eventLocation: "AND CLUB, NEWTOWN.",
    eventVideo: "/videos/A_Soundset.mp4",
    logoImage: "/event_logos/Electic_Sessions.png",
    images: [
      {
        src: "/images/ep_1.png",
        alt: "Electic Session featuring visual projections",
      },
      {
        src: "/images/ep_2.png",
        alt: "DJ performing at Electic Session",
      },
      {
        src: "/images/ep_3.png",
        alt: "Crowd at Electic Session event",
      },
    ]
  }
}

// Hero content component - only event cards and hero elements
function EventHeroContent() {
  const [selectedEvent, setSelectedEvent] = useState<string>("soundset-sunday")
  const searchParams = useSearchParams()
  
  useEffect(() => {
    const event = searchParams?.get('event') || "soundset-sunday"
    if (event in eventData) {
      setSelectedEvent(event)
    }
  }, [searchParams])

  const handleEventCardClick = () => {
    // Scroll to details section after card click
    setTimeout(() => {
      const detailsSection = document.getElementById('event-details')
      if (detailsSection) {
        // Calculate offset to show title in upper portion of viewport
        const yOffset = -window.innerHeight * 0.1; // 10% from top of viewport
        const y = detailsSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
        
        window.scrollTo({
          top: y,
          behavior: 'smooth'
        });
      }
    }, 100)
  }

  return (
    <div className="relative z-10 flex flex-col h-[85vh]">
      <div className="container mx-auto px-6 md:px-12 flex flex-col items-center h-full">
        {/* Spacer to push content down */}
        <div className="flex-grow mb-56 md:mb-72 lg:mb-96"></div>
        
        {/* Events Heading */}
        <h3 className="text-2xl md:text-3xl font-serif font-light text-white mb-6 text-center border-2 border-white inline-block px-8 py-2 mx-auto scale-105 origin-center">Our Events</h3>
        
        {/* Event Cards Section */}
        <div className="mb-17 md:mb-20">
          {/* Event Cards */}
          <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-6 w-full max-w-5xl mx-auto mb-12">
            {/* SoundSet Sunday Card */}
            <div className="w-full md:w-36 lg:w-36 flex flex-col items-center">
              <Link 
                href="/events?event=soundset-sunday" 
                className="block w-full"
                onClick={() => handleEventCardClick()}
              >
                <div className={`relative aspect-square ${selectedEvent === "soundset-sunday" ? "border-4 border-white rounded-3xl" : "border-4 border-black rounded-2xl"} overflow-hidden bg-black w-full`}>
                  <Image
                    src="/event_logos/Soundset.png"
                    alt="SoundSet Sunday"
                    fill
                    className="object-contain p-3"
                    sizes="(max-width: 768px) 100vw, 150px"
                  />
                </div>
              </Link>
              <h3 className="text-center text-sm md:text-base font-serif font-light mt-3">SoundSet Sunday</h3>
            </div>

            {/* RARE Card */}
            <div className="w-full md:w-36 lg:w-36 flex flex-col items-center">
              <Link 
                href="/events?event=rare" 
                className="block w-full"
                onClick={() => handleEventCardClick()}
              >
                <div className={`relative aspect-square ${selectedEvent === "rare" ? "border-4 border-white rounded-3xl" : "border-4 border-black rounded-2xl"} overflow-hidden w-full`}>
                  <Image
                    src="/event_logos/Rare.png"
                    alt="RARE"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 150px"
                  />
                </div>
              </Link>
              <h3 className="text-center text-sm md:text-base font-serif font-light mt-3">RARE</h3>
            </div>

            {/* Electic Session Card */}
            <div className="w-full md:w-36 lg:w-36 flex flex-col items-center">
              <Link 
                href="/events?event=electic-session" 
                className="block w-full"
                onClick={() => handleEventCardClick()}
              >
                <div className={`relative aspect-square ${selectedEvent === "electic-session" ? "border-4 border-white rounded-3xl" : "border-4 border-black rounded-2xl"} overflow-hidden w-full`}>
                  <Image
                    src="/event_logos/Electic_Sessions.png"
                    alt="Electric Session"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 150px"
                  />
                </div>
              </Link>
              <h3 className="text-center text-sm md:text-base font-serif font-light mt-3">Electic Session</h3>
            </div>
          </div>
        </div>

        {/* More Info Button */}
        <div className="text-center mb-[3.625rem] md:mb-[4.75rem] -mt-15 md:-mt-23">
          <p className="text-sm mb-4">More Info</p>
          <div className="w-60 h-10 mx-auto relative pb-4">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 100 50"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-white stroke-2 transform scale-[2.25] animate-bounce"
            >
              <path d="M5 5 L50 45 L95 5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

// Detail content component - event updates and images
function EventDetailContent() {
  const [currentEventData, setCurrentEventData] = useState<EventDataType>(eventData["soundset-sunday"])
  const [isTransitioning, setIsTransitioning] = useState(false)
  const searchParams = useSearchParams()
  
  useEffect(() => {
    const event = searchParams?.get('event') || "soundset-sunday"
    if (event in eventData) {
      setIsTransitioning(true)
      setCurrentEventData(eventData[event])
      setTimeout(() => setIsTransitioning(false), 500)
    }
  }, [searchParams])

  return (
    <div id="event-details">
      {/* Event Updates Section */}
      <div className={`transition-all duration-500 ${isTransitioning ? 'translate-y-10 opacity-0' : 'translate-y-0 opacity-100'}`}>
        <EventUpdates
          eventName={currentEventData.eventName}
          description={currentEventData.description}
          tagline={currentEventData.tagline}
          eventDate={currentEventData.eventDate}
          eventLocation={currentEventData.eventLocation}
          eventVideo={currentEventData.eventVideo}
          logoImage={currentEventData.logoImage}
        />
      </div>

      {/* Event Images Row */}
      <EventImagesRow images={currentEventData.images} />
    </div>
  )
}

export default function EventsPage() {
  return (
    <main className="bg-black text-white with-hero-nav">
      {/* Hero Section with Background Image */}
      <div className="relative h-[85vh]">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/landing_events_page.png"
            alt="Event crowd with KIX branded umbrellas"
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
        </div>

        {/* Navigation */}
        <Navigation activePage="EVENTS" />

        {/* Hero Content Only - Event Cards */}
        <Suspense fallback={<div className="h-[85vh] flex items-center justify-center text-white text-2xl">Loading events...</div>}>
          <EventHeroContent />
        </Suspense>
      </div>

      {/* Event Detail Sections - Outside Background Container */}
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white text-2xl">Loading event details...</div>}>
        <EventDetailContent />
      </Suspense>

      {/* Footer */}
      <Footer />
    </main>
  )
}

