import Hero from "@/components/hero"
import UpcomingEvents from "@/components/upcoming-events"
import StatsSection from "@/components/stats-section"
import LogoCarousel from "@/components/logo-carousel"
import HomePageEvents from "@/components/home-page-events"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="with-hero-nav">
      <Hero />
      <UpcomingEvents />
      <StatsSection />
      <LogoCarousel />
      <HomePageEvents />
      <Footer />
    </main>
  )
}

