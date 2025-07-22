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
  icons: {
    icon: [
      {
        url: '/images/ffn_white_logo.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/images/ffn_white_logo.png',
        sizes: '16x16',
        type: 'image/png',
      }
    ],
    shortcut: '/images/ffn_white_logo.png',
    apple: {
      url: '/images/ffn_white_logo.png',
      sizes: '180x180',
      type: 'image/png',
    },
  },
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

