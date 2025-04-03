import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import ServicesGrid from "@/components/services-grid"

export default function ServicesDetailPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navigation activePage="SERVICES" />
      <ServicesGrid />
      <Footer />
    </main>
  )
} 