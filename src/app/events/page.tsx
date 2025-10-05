'use client'

import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import EventUpdates from "@/components/event-updates"
import EventImagesRow from "@/components/event-images-row"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import PageLoader from "@/components/page-loader"

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
    eventDate: "12 OCTOBER 2025",
    eventLocation: "Parkview Event Space, Woodstock",
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
    eventDate: "27 APRIL 25",
    eventLocation: "Parkview Event Space, Woodstock",
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
    eventDate: "27 APRIL 25",
    eventLocation: "Parkview Event Space, Woodstock",
    eventVideo: "/videos/rare_video.mp4",
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
    eventDate: "25 JULY 25",
    eventLocation: "Democracy Bar, Illovo",
    eventVideo: "/videos/electic_sessions_video.mp4",
    logoImage: "/event_logos/Electic_Sessions.png",
    images: [
      {
        src: "/images/ep_1.png",
        alt: "Eclectic Session featuring visual projections",
      },
      {
        src: "/images/ep_2.png",
        alt: "DJ performing at Eclectic Session",
      },
      {
        src: "/images/ep_3.png",
        alt: "Crowd at Eclectic Session event",
      },
    ]
  }
}

function EventsContent() {
  const [isLoading, setIsLoading] = useState(true)

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  // Helper function to format display text
  const formatDisplayText = (text: string) => {
    if (text === "Electic Sessions") {
      return "Eclectic Sessions";
    }
    return text;
  };

  const [selectedEvent, setSelectedEvent] = useState<string>("soundset-sunday")
  const [currentEventData, setCurrentEventData] = useState<EventDataType>(eventData["soundset-sunday"])
  const [isTransitioning, setIsTransitioning] = useState(false)
  const searchParams = useSearchParams()
  
  useEffect(() => {
    const event = searchParams?.get('event') || "soundset-sunday"
    if (event in eventData) {
      setSelectedEvent(event)
      setIsTransitioning(true)
      setCurrentEventData(eventData[event])
      setTimeout(() => setIsTransitioning(false), 500)
    }
  }, [searchParams])

  const handleEventCardClick = () => {
    // Scroll to details section after card click
    setTimeout(() => {
      const detailsSection = document.getElementById('event-details')
      if (detailsSection) {
        detailsSection.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
  }

  if (isLoading) {
    return <PageLoader onLoadingComplete={handleLoadingComplete} />
  }

  return (
    <div className="bg-black text-white">
      {/* Navigation */}
      <Navigation activePage="EVENTS" />

      {/* Hero Section */}
      <div className="relative h-[80vh] sm:min-h-screen">
        <div className="absolute inset-0">
          <Image
            src="/images/landing_events_page.png"
            alt="Events page hero"
            fill
            className="object-cover"
            priority
          />
        </div>
        
        <div className="relative z-10 flex flex-col h-full text-center">
          {/* Title positioned at top */}
          <div className="pt-72">
            <h1 className="text-[25px] sm:text-3xl font-serif font-light text-white mb-[41px] sm:mb-14 border-2 border-white px-[23px] sm:px-8 py-[12px] sm:py-4 inline-block">
              Our Events
            </h1>
          </div>
          
          {/* Cards positioned in center-bottom area */}
          <div className="flex-1 flex flex-col items-center justify-center">
            {/* Event Cards */}
            <div className="flex gap-[23px] sm:gap-8 mb-[35px] sm:mb-12">
              {/* SoundSet Sunday */}
              <div className="w-[93px] sm:w-32 text-center">
                <Link href="/events?event=soundset-sunday" onClick={handleEventCardClick}>
                  <div className={`relative w-full h-[93px] sm:h-32 mb-[12px] sm:mb-4 ${selectedEvent === "soundset-sunday" ? "border-4 border-white" : "border-4 border-black"} rounded-2xl overflow-hidden bg-black transition-all duration-300 hover:scale-105`}>
                    <Image
                      src="/event_logos/Soundset.png"
                      alt="SoundSet Sunday"
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                </Link>
                <h3 className="text-[10px] sm:text-sm font-serif font-light">Soundset Sunday</h3>
              </div>

              {/* RARE */}
              <div className="w-[93px] sm:w-32 text-center">
                <Link href="/events?event=rare" onClick={handleEventCardClick}>
                  <div className={`relative w-full h-[93px] sm:h-32 mb-[12px] sm:mb-4 ${selectedEvent === "rare" ? "border-4 border-white" : "border-4 border-black"} rounded-2xl overflow-hidden bg-black transition-all duration-300 hover:scale-105`}>
                    <Image
                      src="/event_logos/Rare.png"
                      alt="RARE"
                      fill
                      className="object-cover"
                    />
                  </div>
                </Link>
                <h3 className="text-[10px] sm:text-sm font-serif font-light">RARE</h3>
              </div>

              {/* Eclectic Session */}
              <div className="w-[93px] sm:w-32 text-center">
                <Link href="/events?event=electic-session" onClick={handleEventCardClick}>
                  <div className={`relative w-full h-[93px] sm:h-32 mb-[12px] sm:mb-4 ${selectedEvent === "electic-session" ? "border-4 border-white" : "border-4 border-black"} rounded-2xl overflow-hidden bg-black transition-all duration-300 hover:scale-105`}>
                    <Image
                      src="/event_logos/Electic_Sessions.png"
                      alt="Eclectic Session"
                      fill
                      className="object-cover"
                    />
                  </div>
                </Link>
                <h3 className="text-[10px] sm:text-sm font-serif font-light">{formatDisplayText("Electic Sessions")}</h3>
              </div>
            </div>

            {/* More Info */}
            <div className="pb-[47px] sm:pb-16">
              <p className="mb-[12px] sm:mb-4 text-[13px] sm:text-lg">More Info</p>
              <svg
                width="58"
                height="29"
                viewBox="0 0 100 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="sm:w-[80px] sm:h-[40px] stroke-white stroke-2 mx-auto animate-bounce"
              >
                <path d="M5 5 L50 45 L95 5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Event Details */}
      <div id="event-details" className={`transition-all duration-500 ${isTransitioning ? 'translate-y-10 opacity-0' : 'translate-y-0 opacity-100'}`}>
        <EventUpdates
          eventName={currentEventData.eventName}
          description={currentEventData.description}
          tagline={currentEventData.tagline}
          eventDate={currentEventData.eventDate}
          eventLocation={currentEventData.eventLocation}
          eventVideo={currentEventData.eventVideo}
          logoImage={currentEventData.logoImage}
        />
        
        <EventImagesRow images={currentEventData.images} />
      </div>

      <Footer />
    </div>
  )
}

export default function EventsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EventsContent />
    </Suspense>
  )
}

