import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Playfair_Display } from "next/font/google"
import localFont from 'next/font/local'

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
})

const sugarMagic = localFont({
  src: './fonts/sugarmagicpersonaluseonly-jemyo.otf',
  variable: '--font-sugar-magic',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "French for New",
  description: "We follow culture. We endorse culture. We create culture.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${sugarMagic.variable}`}>{children}</body>
    </html>
  )
}

