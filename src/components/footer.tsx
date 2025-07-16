import Image from "next/image"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-black text-white py-16">
      <div className="container mx-auto px-6 md:px-12 text-center">
        <p className="uppercase tracking-wide mb-4">WE WOULD LOVE TO HEAR FROM YOU.</p>
        <a
          href="mailto:info@frenchfornew.com"
          className="font-serif text-3xl md:text-5xl hover:text-gray-300 transition-colors inline-block mb-24"
        >
          info@frenchfornew.com
        </a>

        <div className="flex flex-col md:flex-row justify-between items-center mt-12">
          <div className="w-32 mb-8 md:mb-0">
            <Image
              src="/images/ffn_white_logo.svg"
              alt="ffn logo"
              width={120}
              height={80}
              className="object-contain"
            />
          </div>

          <div className="flex space-x-6">
            <Link
              href="https://www.instagram.com/french.for.new/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300"
            >
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
                className="lucide lucide-instagram"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
              <span className="sr-only">Instagram</span>
            </Link>

            <Link
              href="https://x.com/FrenchForNew"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300"
            >
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
                className="lucide"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              <span className="sr-only">X (formerly Twitter)</span>
            </Link>

            <Link
              href="https://www.youtube.com/@FrenchForNew"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300"
            >
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
                className="lucide lucide-youtube"
              >
                <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                <path d="m10 15 5-3-5-3z" />
              </svg>
              <span className="sr-only">YouTube</span>
            </Link>

            <Link
              href="https://www.tiktok.com/@frenchfornew"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300"
            >
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
                className="lucide"
              >
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
              </svg>
              <span className="sr-only">TikTok</span>
            </Link>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mt-12 pt-6 border-t border-gray-800">
          <div className="flex space-x-6 mb-4 md:mb-0">
            <Link href="/contact" className="text-sm text-gray-400 hover:text-white">
              CONTACT
            </Link>
            <Link href="/gallery" className="text-sm text-gray-400 hover:text-white">
              GALLERY
            </Link>
          </div>
          <div className="text-sm text-gray-400">© 2025 FrenchForNew</div>
        </div>
      </div>
    </footer>
  )
}

