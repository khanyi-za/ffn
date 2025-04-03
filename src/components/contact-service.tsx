import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ContactService() {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image
          src="/images/services_page_bottom.png"
          alt="Event crowd"
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-black/25" />
      </div>

      {/* Content Container */}
      <div className="relative h-full flex flex-col">
        {/* Text Container - Top Half */}
        <div className="h-[35vh] pt-12 px-6 md:px-8 lg:px-12">
          <h2 className="font-serif text-[2rem] md:text-[2.75rem] lg:text-[3.25rem] xl:text-[3.75rem] 
            text-white font-light leading-[1.05] tracking-normal max-w-[70%] lg:max-w-[65%]">
            From seamless planning to top&#8209;tier talent and impactful marketing, we bring people together through electrifying performances and immersive atmospheres.
          </h2>
        </div>

        {/* Button Container - Bottom Half */}
        <div className="flex-1 flex items-center justify-center pb-12">
          <div className="relative group">
            <Link 
              href="/contact"
              className="inline-block border border-white text-white text-lg px-10 py-3 
                hover:bg-white hover:text-black transition-all duration-300"
            >
              Connect with us.
            </Link>
            {/* Button glow effect */}
            <div className="absolute -inset-[1px] bg-white/5 blur-[2px] group-hover:bg-white/20 transition-colors duration-300" />
          </div>
        </div>
      </div>
    </section>
  );
} 