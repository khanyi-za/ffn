'use client'

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

export default function Navigation({ activePage = "" }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY
      setScrolled(offset > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  const navItems = [
    { name: "HOME", path: "/" },
    { name: "ABOUT US", path: "/about-us" },
    { name: "SERVICES", path: "/services" },
    { name: "EVENTS", path: "/events" },
    { name: "GALLERY", path: "/gallery" },
    { name: "CONTACT", path: "/contact" },
  ]

  return (
    <header className={`fixed w-full top-0 left-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-black/90 backdrop-blur-sm py-1 md:py-2' : 'bg-transparent py-3 md:py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center relative">
          {/* Logo kept in the same position but made smaller */}
          <div className="w-[102px] md:w-32 -ml-4 -mt-1">
            <Link href="/">
              <Image
                src="/images/french_white_logo.svg"
                alt="French for New Logo"
                width={140}
                height={60}
                className="object-contain"
              />
            </Link>
          </div>
          
          {/* Desktop Navigation - Moved more to the right and up */}
          <nav className="hidden md:block absolute left-[58%] transform -translate-x-1/2 -mt-1">
            <ul className="flex space-x-12 text-white">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className={`relative text-lg tracking-wider hover:text-gray-300 transition-colors whitespace-nowrap px-3 py-1 ${
                      activePage === item.name ? "border border-white" : ""
                    } !font-sugar-magic`}
                    style={{ fontFamily: "var(--font-sugar-magic)" }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Mobile Menu Button - Kept at far right */}
          <button 
            onClick={toggleMenu} 
            className="block md:hidden text-white z-50 ml-auto -mt-1 p-2 touch-manipulation"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-x"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-menu"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black z-40 md:hidden min-h-screen w-full">
          <div className="flex flex-col items-center justify-center h-screen">
            <ul className="flex flex-col space-y-[38px] text-white text-center">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-[19px] tracking-wider hover:text-gray-300 transition-colors px-4 py-2 touch-manipulation ${
                      activePage === item.name ? "border border-white" : ""
                    } !font-sugar-magic`}
                    style={{ fontFamily: "var(--font-sugar-magic)" }}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </header>
  )
}

