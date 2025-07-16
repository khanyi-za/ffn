import Image from "next/image";
import AnimatedCounter from "./AnimatedCounter";

export default function StatsSection() {
  return (
    <section className="bg-black text-white py-16 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-10 lg:gap-12">
          {/* Mobile: 2x2 Grid, Desktop: Column Layout */}
          <div className="w-full lg:w-1/2 mb-8 md:mb-12 lg:mb-0">
            
            {/* Mobile & Tablet: 2x2 Grid Layout */}
            <div className="grid grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:hidden">
              {/* Stat 1 - Cities */}
              <div className="text-center sm:text-left">
                <h2 className="text-[1.75rem] sm:text-[2rem] md:text-[2.5rem] font-serif font-light">
                  <AnimatedCounter end={4} className="inline-block" />
                  <span className="ml-1 sm:ml-2">Cities</span>
                </h2>
                <p className="text-sm sm:text-base md:text-lg mt-1">Our Team is Active in.</p>
              </div>
              
              {/* Stat 2 - Events */}
              <div className="text-center sm:text-left">
                <h2 className="text-[1.75rem] sm:text-[2rem] md:text-[2.5rem] font-serif font-light">
                  <AnimatedCounter end={70} suffix="+" className="inline-block" />
                </h2>
                <p className="text-sm sm:text-base md:text-lg mt-1">Events Hosted.</p>
              </div>
              
              {/* Stat 3 - Tickets */}
              <div className="text-center sm:text-left">
                <h2 className="text-[1.75rem] sm:text-[2rem] md:text-[2.5rem] font-serif font-light">
                  <AnimatedCounter end={5000} suffix="+" className="inline-block" duration={2500} />
                </h2>
                <p className="text-sm sm:text-base md:text-lg mt-1">Tickets Sold.</p>
              </div>
              
              {/* Stat 4 - Collaborations */}
              <div className="text-center sm:text-left">
                <h2 className="text-[1.75rem] sm:text-[2rem] md:text-[2.5rem] font-serif font-light">
                  <AnimatedCounter end={50} suffix="+" className="inline-block" />
                </h2>
                <p className="text-sm sm:text-base md:text-lg mt-1">Client Collaborations.</p>
              </div>
            </div>

            {/* Desktop: Vertical Stack Layout */}
            <div className="hidden lg:block space-y-12 xl:space-y-16 text-left">
            <div>
                <h2 className="text-[2.5rem] xl:text-[3.3rem] font-serif font-light">
                <AnimatedCounter end={4} className="inline-block" />
                <span className="ml-2">Cities</span>
              </h2>
                <p className="text-xl xl:text-2xl mt-1">Our Team is Active in.</p>
            </div>
            
            <div>
                <h2 className="text-[2.5rem] xl:text-[3.3rem] font-serif font-light">
                <AnimatedCounter end={70} suffix="+" className="inline-block" />
              </h2>
                <p className="text-xl xl:text-2xl mt-1">Events Hosted.</p>
            </div>
            
            <div>
                <h2 className="text-[2.5rem] xl:text-[3.3rem] font-serif font-light">
                <AnimatedCounter end={5000} suffix="+" className="inline-block" duration={2500} />
              </h2>
                <p className="text-xl xl:text-2xl mt-1">Tickets Sold.</p>
            </div>
            
            <div>
                <h2 className="text-[2.5rem] xl:text-[3.3rem] font-serif font-light">
                <AnimatedCounter end={50} suffix="+" className="inline-block" />
              </h2>
                <p className="text-xl xl:text-2xl mt-1">Client Collaborations.</p>
              </div>
            </div>
          </div>
          
          {/* Right side image */}
          <div className="w-full lg:w-[55%] max-w-lg lg:max-w-none">
            <div className="rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-white">
              <div className="relative w-full aspect-[4/3] sm:aspect-square lg:aspect-[4/3.3]">
                <Image 
                  src="/images/Dj_home_page.png" 
                  alt="DJ performing at an event with a crowd"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 55vw"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 