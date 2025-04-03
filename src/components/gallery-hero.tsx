import Image from "next/image"
import Navigation from "./navigation"

export default function GalleryHero() {
  return (
    <div className="relative h-[500px] md:h-[600px] w-full overflow-hidden bg-black">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/placeholder.svg?height=1200&width=1600" // Replace with your actual image of the two girls
          alt="Gallery hero image with two girls"
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
      </div>

      {/* Navigation */}
      <Navigation activePage="GALLERY" />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col justify-center h-full px-6 md:px-12">
        <h1 className="font-serif text-4xl md:text-[50px] font-light text-white max-w-md leading-tight">Our Gallery</h1>
      </div>
    </div>
  )
}

