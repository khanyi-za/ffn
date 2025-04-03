import Image from "next/image"
import Navigation from "./navigation"

export default function AboutHero() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Background image with dark overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/about_us_hero.png"
          alt="About Us - French for New team at night"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Navigation */}
      <Navigation activePage="ABOUT US" />

      {/* Main Hero Content */}
      <div className="relative z-10 flex flex-col h-screen items-start justify-end px-6 md:px-12 pb-16 md:pb-20 lg:pb-24">
        <div className="mb-0">
          <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl font-light text-white leading-tight">
            ABOUT US
          </h1>
          <div className="mt-6 md:mt-8">
            <Image
              src="/images/french_white_logo.svg"
              alt="French for New Logo"
              width={180}
              height={80}
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  )
} 