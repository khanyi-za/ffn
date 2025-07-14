import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shop - French for New',
  description: 'Merchandise coming soon - French for New official shop',
}

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 