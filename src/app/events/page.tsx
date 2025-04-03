'use client'

import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import EventUpdates from "@/components/event-updates"
import EventImagesRow from "@/components/event-images-row"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

// Define the type for event data
type EventDataType = {
  eventName: string;
  description: string;
  tagline: string;
  eventDate: string;
  eventLocation: string;
  eventImage: string;
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
    description: "Lorem ipsum dolor sit amet consectetur. Aliquam sapien mattis proin ut interdum tincidunt. Curabitur mauris enim rhoncus ullamcorper. Sceleris que nibh pretium",
    tagline: "We Do Cool Stuff All The Time, We Just Happen To Show It On Sundays.",
    eventDate: "08 MARCH 25",
    eventLocation: "THE PLAYGROUND, 73 JUTA ST, BRAAM.",
    eventImage: "/images/video_variable.png",
    logoImage: "/images/soundset_logo.png",
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
  "rare": {
    eventName: "RARE",
    description: "A unique experience showcasing experimental music and digital art. Join us for an unforgettable night where boundaries are pushed and expectations are exceeded.",
    tagline: "Where Music Meets Art In Rare Form.",
    eventDate: "22 APRIL 25",
    eventLocation: "STUDIO 88, ROSEBANK.",
    eventImage: "/images/rare_event.png",
    logoImage: "/images/rare_experience_logo.png",
    images: [
      {
        src: "/images/rare_1.png",
        alt: "RARE event with vibrant lighting",
      },
      {
        src: "/images/rare_2.png",
        alt: "Artists performing at RARE experience",
      },
      {
        src: "/images/rare_3.png",
        alt: "Digital art installation at RARE event",
      },
    ]
  },
  "electic-session": {
    eventName: "ELECTIC SESSION",
    description: "An immersive audio-visual journey through electronic soundscapes. Our carefully curated lineup brings together the best in electronic music.",
    tagline: "Discover The Future Of Sound.",
    eventDate: "15 MAY 25",
    eventLocation: "AND CLUB, NEWTOWN.",
    eventImage: "/images/electic_event.png",
    logoImage: "/images/electic_session_logo.png",
    images: [
      {
        src: "/images/electic_1.png",
        alt: "Electic Session featuring visual projections",
      },
      {
        src: "/images/electic_2.png",
        alt: "DJ performing at Electic Session",
      },
      {
        src: "/images/electic_3.png",
        alt: "Crowd at Electic Session event",
      },
    ]
  }
}

export default function EventsPage() {
  // Client-side state for selected event
  const [selectedEvent, setSelectedEvent] = useState<string>("soundset-sunday")
  const [currentEventData, setCurrentEventData] = useState<EventDataType>(eventData["soundset-sunday"])
  
  // Use search params to get selected event
  const searchParams = useSearchParams()
  
  useEffect(() => {
    const event = searchParams?.get('event') || "soundset-sunday"
    if (event in eventData) {
      setSelectedEvent(event)
      setCurrentEventData(eventData[event])
    }
  }, [searchParams])

  return (
    <main className="min-h-screen bg-black text-white with-hero-nav">
      {/* Background Image */}
      <div className="relative min-h-screen">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/events_page_hero.png"
            alt="Event crowd with KIX branded umbrellas"
            fill
            className="object-cover object-center brightness-75"
            sizes="100vw"
            priority
          />
        </div>

        {/* Navigation */}
        <Navigation activePage="EVENTS" />

        {/* Events Content - Adjusted to position cards lower */}
        <div className="relative z-10 flex flex-col h-screen">
          <div className="container mx-auto px-6 md:px-12 flex flex-col items-center h-full">
            {/* Spacer to push content down */}
            <div className="flex-grow mb-56 md:mb-72 lg:mb-96"></div>
            
            {/* Event Cards Section */}
            <div className="mb-20 md:mb-24">
              {/* Event Cards */}
              <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-6 w-full max-w-5xl mx-auto mb-12">
                {/* SoundSet Sunday Card */}
                <div className="w-full md:w-40 lg:w-44 flex flex-col items-center">
                  <Link href="/events?event=soundset-sunday" className="block w-full">
                    <div className={`relative aspect-square ${selectedEvent === "soundset-sunday" ? "border-4 border-white rounded-3xl" : "rounded-2xl"} overflow-hidden bg-black w-full`}>
                      <Image
                        src="/images/soundset_logo.png"
                        alt="SoundSet Sunday"
                        fill
                        className="object-contain p-3"
                        sizes="(max-width: 768px) 100vw, 180px"
                      />
                    </div>
                  </Link>
                  <h3 className="text-center text-sm md:text-base font-serif font-light mt-3">SoundSet Sunday</h3>
                </div>

                {/* RARE Card */}
                <div className="w-full md:w-40 lg:w-44 flex flex-col items-center">
                  <Link href="/events?event=rare" className="block w-full">
                    <div className={`relative aspect-square ${selectedEvent === "rare" ? "border-4 border-white rounded-3xl" : "rounded-2xl"} overflow-hidden bg-black w-full`}>
                      <Image
                        src="/images/rare_experience_logo.png"
                        alt="RARE"
                        fill
                        className="object-contain p-3"
                        sizes="(max-width: 768px) 100vw, 180px"
                      />
                    </div>
                  </Link>
                  <h3 className="text-center text-sm md:text-base font-serif font-light mt-3">RARE</h3>
                </div>

                {/* Electic Session Card */}
                <div className="w-full md:w-40 lg:w-44 flex flex-col items-center">
                  <Link href="/events?event=electic-session" className="block w-full">
                    <div className={`relative aspect-square ${selectedEvent === "electic-session" ? "border-4 border-white rounded-3xl" : "rounded-2xl"} overflow-hidden bg-black w-full`}>
                      <Image
                        src="/images/electic_session_logo.png"
                        alt="Electric Session"
                        fill
                        className="object-contain p-3"
                        sizes="(max-width: 768px) 100vw, 180px"
                      />
                    </div>
                  </Link>
                  <h3 className="text-center text-sm md:text-base font-serif font-light mt-3">Electic Session</h3>
                </div>
              </div>
            </div>

            {/* More Info Button */}
            <div className="text-center mb-8">
              <p className="text-xl mb-4">More Info</p>
              <div className="w-60 h-10 mx-auto relative">
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 100 50"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-white stroke-2"
                >
                  <path d="M5 5 L50 45 L95 5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Updates Section - Now Dynamic */}
      <EventUpdates
        eventName={currentEventData.eventName}
        description={currentEventData.description}
        tagline={currentEventData.tagline}
        eventDate={currentEventData.eventDate}
        eventLocation={currentEventData.eventLocation}
        eventImage={currentEventData.eventImage}
        logoImage={currentEventData.logoImage}
      />

      {/* Event Images Row - Now Dynamic */}
      <EventImagesRow images={currentEventData.images} />

      {/* Footer */}
      <Footer />
    </main>
  )
}

