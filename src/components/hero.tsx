import Image from "next/image"
import Navigation from "./navigation"

export default function Hero() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Background image with responsive adjustments */}
      <div className="absolute inset-0 z-0">
        {/* Mobile (default) */}
        <div className="block sm:hidden">
          <Image
            src="/images/hero_home.png"
            alt="Event crowd with red lighting"
            fill
            className="object-cover object-[75%_center]"
            sizes="100vw"
            priority
          />
        </div>

        {/* Small screens */}
        <div className="hidden sm:block md:hidden">
          <Image
            src="/images/hero_home.png"
            alt="Event crowd with red lighting"
            fill
            className="object-cover object-[65%_center]"
            sizes="100vw"
            priority
          />
        </div>

        {/* Medium screens - our target perfect fit */}
        <div className="hidden md:block lg:hidden">
          <Image
            src="/images/hero_home.png"
            alt="Event crowd with red lighting"
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
        </div>

        {/* Large screens */}
        <div className="hidden lg:block xl:hidden">
          <Image
            src="/images/hero_home.png"
            alt="Event crowd with red lighting"
            fill
            className="object-cover object-[40%_center]"
            sizes="100vw"
            priority
          />
        </div>

        {/* Extra large screens */}
        <div className="hidden xl:block">
          <Image
            src="/images/hero_home.png"
            alt="Event crowd with red lighting"
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
        </div>
      </div>

      {/* Navigation */}
      <Navigation activePage="HOME" />

      {/* Main Hero Content */}
      <div className="relative z-10 flex flex-col justify-between h-screen">
        {/* Upper spacing to accommodate fixed navbar */}
        <div className="h-[var(--navbar-height)]"></div>
        
        {/* Center content with tagline */}
        <div className="flex-grow flex flex-col justify-center px-6 md:px-12">
          <h1 className="font-serif text-4xl md:text-[36px] font-light text-white max-w-md leading-tight">
            <div>WE FOLLOW CULTURE.</div>
            <div className="mt-2">WE ENDORSE CULTURE.</div>
            <div className="mt-2">WE CREATE CULTURE.</div>
          </h1>
        </div>

        {/* Bottom section with logo and scroll indicator */}
        <div className="flex items-end justify-between px-6 pb-8 md:px-12">
          <div className="w-20">
            <Image
              src="/images/ffn_white_logo.svg"
              alt="ffn logo"
              width={80}
              height={60}
              className="object-contain"
            />
          </div>
          <button className="text-white animate-bounce">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-arrow-down"
            >
              <path d="M12 5v14" />
              <path d="m19 12-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

