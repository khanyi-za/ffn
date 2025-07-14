import Image from "next/image";
import AnimatedCounter from "./AnimatedCounter";

export default function StatsSection() {
  return (
    <section className="bg-black text-white h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 w-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Left side statistics */}
          <div className="w-full md:w-1/2 mb-12 md:mb-0 space-y-16 text-left">
            <div>
              <h2 className="text-[2.5rem] md:text-[3.3rem] lg:text-[3.3rem] font-serif font-light">
                <AnimatedCounter end={4} className="inline-block" />
                <span className="ml-2">Cities</span>
              </h2>
              <p className="text-xl md:text-2xl mt-1">Our Team is Active in.</p>
            </div>
            
            <div>
              <h2 className="text-[2.5rem] md:text-[3.3rem] lg:text-[3.3rem] font-serif font-light">
                <AnimatedCounter end={70} suffix="+" className="inline-block" />
              </h2>
              <p className="text-xl md:text-2xl mt-1">Events Hosted.</p>
            </div>
            
            <div>
              <h2 className="text-[2.5rem] md:text-[3.3rem] lg:text-[3.3rem] font-serif font-light">
                <AnimatedCounter end={5000} suffix="+" className="inline-block" duration={2500} />
              </h2>
              <p className="text-xl md:text-2xl mt-1">Tickets Sold.</p>
            </div>
            
            <div>
              <h2 className="text-[2.5rem] md:text-[3.3rem] lg:text-[3.3rem] font-serif font-light">
                <AnimatedCounter end={50} suffix="+" className="inline-block" />
              </h2>
              <p className="text-xl md:text-2xl mt-1">Client Collaborations.</p>
            </div>
          </div>
          
          {/* Right side image */}
          <div className="w-full md:w-[55%]">
            <div className="rounded-3xl overflow-hidden border-2 border-white">
              <div className="relative w-full aspect-square md:aspect-[4/3.3]">
                <Image 
                  src="/images/Dj_home_page.png" 
                  alt="DJ performing at an event with a crowd"
                  fill
                  className="object-cover rounded-2xl"
                  sizes="(max-width: 768px) 100vw, 55vw"
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