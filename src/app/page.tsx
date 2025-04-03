import Hero from "@/components/hero"
import UpcomingEvents from "@/components/upcoming-events"
import StatsSection from "@/components/stats-section"
import LogoCarousel from "@/components/logo-carousel"
import EventImagesRow from "@/components/event-images-row"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="with-hero-nav">
      <Hero />
      <UpcomingEvents />
      <StatsSection />
      <LogoCarousel />
      <EventImagesRow 
        images={[
          {
            src: "/images/ep_1.png",
            alt: "Event image 1",
          },
          {
            src: "/images/ep_2.png",
            alt: "Event image 2",
          },
          {
            src: "/images/ep_3.png",
            alt: "Event image 3",
          },
        ]}
      />
      <Footer />
    </main>
  )
}

