'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import PageLoader from '@/components/page-loader'

// Product types
interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  images: string[];
  description: string;
  slug: string;
  details?: string[];
}

// Customer information types
interface CustomerInfo {
  email: string;
  firstName: string;
  lastName: string;
  streetAddress: string;
  city: string;
  province: string;
  postalCode: string;
  size: string;
}

// Payment links data from CSV files
const paymentLinks = {
  'football-jersey': {
    'Small': ['https://pay.yoco.com/r/4gbaxz', 'https://pay.yoco.com/r/m65oQn', 'https://pay.yoco.com/r/4x5zk1'],
    'Medium': ['https://pay.yoco.com/r/2pdGkb', 'https://pay.yoco.com/r/m99LyD', 'https://pay.yoco.com/r/7lkx66'],
    'Large': ['https://pay.yoco.com/r/mNMl5Y', 'https://pay.yoco.com/r/2A0Odw', 'https://pay.yoco.com/r/2wxJen'],
    'X-Large': ['https://pay.yoco.com/r/2Yan8B', 'https://pay.yoco.com/r/mREk8Q', 'https://pay.yoco.com/r/mey5Xb'],
    'XX-Large': ['https://pay.yoco.com/r/2QXr8R', 'https://pay.yoco.com/r/7v6zN3', 'https://pay.yoco.com/r/4GGx69'],
    'XXX-Large': ['https://pay.yoco.com/r/2wxJen', 'https://pay.yoco.com/r/m65oqD', 'https://pay.yoco.com/r/m99LKp']
  },
  'bowling-shirt': {
    'Small': ['https://pay.yoco.com/r/2YanrN', 'https://pay.yoco.com/r/2BB0eL', 'https://pay.yoco.com/r/2b0kaq'],
    'Medium': ['https://pay.yoco.com/r/4nqGN5', 'https://pay.yoco.com/r/mEwy0p', 'https://pay.yoco.com/r/m65oXD'],
    'Large': ['https://pay.yoco.com/r/4x5zW6', 'https://pay.yoco.com/r/2pdGN8', 'https://pay.yoco.com/r/4aOn59'],
    'X-Large': ['https://pay.yoco.com/r/7rXoae', 'https://pay.yoco.com/r/mREkrO', 'https://pay.yoco.com/r/mOdlY9'],
    'XX-Large': ['https://pay.yoco.com/r/2b0kkq', 'https://pay.yoco.com/r/2DZvvL', 'https://pay.yoco.com/r/2QXrr0'],
    'XXX-Large': ['https://pay.yoco.com/r/7XpAAR', 'https://pay.yoco.com/r/4gbaal', 'https://pay.yoco.com/r/4x5zz5']
  }
};

// Product data
const products: Product[] = [
  {
    id: 'football-jersey',
    name: 'Football Jersey',
    price: 700.00,
    currency: 'ZAR',
    images: [
      '/merch/football_jersey/994A1511.jpg',
      '/merch/football_jersey/994A1558.jpg',
      '/merch/football_jersey/994A1579.jpg',
      '/merch/football_jersey/shop_4.jpg'
    ],
    description: 'Premium quality French For New football jersey',
    slug: 'football-jersey',
    details: [
      'High-quality fabric',
      'French For New branding',
      'Comfortable fit',
      'Available in multiple sizes'
    ]
  },
  {
    id: 'bowling-shirt',
    name: 'Bowling Shirt',
    price: 800.00,
    currency: 'ZAR',
    images: [
      '/merch/bowling_shirt/994A1352.jpg',
      '/merch/bowling_shirt/994A1369.jpg',
      '/merch/bowling_shirt/994A1382.jpg',
      '/merch/bowling_shirt/994A1427.jpg',
      '/merch/bowling_shirt/994A1438.jpg'
    ],
    description: 'Stylish French For New bowling shirt',
    slug: 'bowling-shirt',
    details: [
      'Premium bowling shirt design',
      'French For New exclusive',
      'Retro styling',
      'Comfortable casual wear'
    ]
  }
];

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lastUsedLink, setLastUsedLink] = useState<string>('')
  
  // Customer form state
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    email: '',
    firstName: '',
    lastName: '',
    streetAddress: '',
    city: '',
    province: '',
    postalCode: '',
    size: ''
  })

  // Size options
  const sizeOptions = ['Small', 'Medium', 'Large', 'X-Large', 'XX-Large', 'XXX-Large']

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  // Find the product based on slug
  const product = products.find(p => p.slug === params.slug)

  // Handle customer info input changes
  const handleCustomerInfoChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Check if all required fields are filled
  const isFormValid = () => {
    return customerInfo.email.trim() !== '' &&
           customerInfo.firstName.trim() !== '' &&
           customerInfo.lastName.trim() !== '' &&
           customerInfo.streetAddress.trim() !== '' &&
           customerInfo.city.trim() !== '' &&
           customerInfo.province.trim() !== '' &&
           customerInfo.postalCode.trim() !== '' &&
           customerInfo.size.trim() !== ''
  }

  // Random link selection with no consecutive repeats
  const getRandomPaymentLink = (productId: string, size: string): string => {
    const productLinks = paymentLinks[productId as keyof typeof paymentLinks]
    if (!productLinks) return ''
    
    const links = productLinks[size as keyof typeof productLinks]
    if (!links || links.length === 0) return ''
    
    // Filter out the last used link to avoid consecutive repeats
    const availableLinks = lastUsedLink ? links.filter((link: string) => link !== lastUsedLink) : links
    
    // If all links were the same (shouldn't happen), use all links
    const linksToChooseFrom = availableLinks.length > 0 ? availableLinks : links
    
    // Select random link
    const randomIndex = Math.floor(Math.random() * linksToChooseFrom.length)
    const selectedLink = linksToChooseFrom[randomIndex]
    
    // Update last used link
    setLastUsedLink(selectedLink)
    
    return selectedLink
  }


  // Handle purchase
  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!isFormValid()) {
      alert('Please fill in all required details.')
      return
    }
    
    if (!product) {
      alert('Product not found.')
      return
    }
    
    setIsSubmitting(true)

    try {
      // Send purchase notification email to admin
      const notificationResponse = await fetch('/api/purchase-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product: product,
          customerInfo: customerInfo
        }),
      })

      if (!notificationResponse.ok) {
        console.error('Failed to send purchase notification email')
        // Continue with purchase even if email fails
      }

      // Get random payment link for the selected size
      const paymentLink = getRandomPaymentLink(product.id, customerInfo.size)
      
      if (!paymentLink) {
        alert('Payment link not available for this size. Please try again.')
        setIsSubmitting(false)
        return
      }

      // Store customer info for potential future use (optional)
      const orderData = {
        product: product,
        customerInfo: customerInfo,
        quantity: 1,
        total: product.price,
        timestamp: new Date().toISOString()
      }
      
      localStorage.setItem('lastOrderInfo', JSON.stringify(orderData))
      
      // Open payment link in new tab
      window.open(paymentLink, '_blank')
      
    } catch (error) {
      console.error('Error processing order:', error)
      alert('There was an error processing your order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <PageLoader onLoadingComplete={handleLoadingComplete} />
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-black text-white with-hero-nav">
        <Navigation />
        <div className="container mx-auto px-6 pt-36 pb-12 text-center">
          <h1 className="font-serif text-4xl mb-8">Product Not Found</h1>
          <p className="text-gray-400 mb-8">The product you're looking for doesn't exist.</p>
          <button 
            onClick={() => router.push('/shop')}
            className="bg-white text-black px-6 py-3 rounded hover:bg-gray-200 transition-colors"
          >
            Back to Shop
          </button>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white with-hero-nav">
      <Navigation />
      
      <div className="container mx-auto px-6 pt-36 pb-12 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-900 rounded-lg overflow-hidden">
              <Image
                src={product.images[currentImageIndex]}
                alt={`${product.name} - Image ${currentImageIndex + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
            
            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative aspect-square bg-gray-900 rounded-lg overflow-hidden border-2 transition-colors ${
                    currentImageIndex === index ? 'border-white' : 'border-transparent hover:border-gray-500'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="25vw"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="font-serif text-4xl md:text-5xl font-light mb-4">{product.name}</h1>
              <p className="text-gray-400 text-lg mb-6">{product.description}</p>
              <p className="text-orange-500 text-3xl font-medium">R{product.price.toFixed(2)}</p>
            </div>

            {/* Customer Information Form */}
            <form onSubmit={handlePurchase} className="space-y-6">
              <div>
                <h3 className="font-serif text-xl mb-4">Purchase Information</h3>
                
                {/* Size Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-3">Size *</label>
                  <div className="grid grid-cols-3 gap-2">
                    {sizeOptions.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleCustomerInfoChange('size', size)}
                        className={`py-2 px-3 text-sm border rounded transition-colors ${
                          customerInfo.size === size
                            ? 'border-orange-500 bg-orange-500 text-black'
                            : 'border-gray-600 text-white hover:border-gray-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Email */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={customerInfo.email}
                    onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                    placeholder="your@email.com"
                  />
                </div>

                {/* Name */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name *</label>
                    <input
                      type="text"
                      required
                      value={customerInfo.firstName}
                      onChange={(e) => handleCustomerInfoChange('firstName', e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name *</label>
                    <input
                      type="text"
                      required
                      value={customerInfo.lastName}
                      onChange={(e) => handleCustomerInfoChange('lastName', e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                      placeholder="Doe"
                    />
                  </div>
                </div>


                {/* Address */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Street Address *</label>
                  <input
                    type="text"
                    required
                    value={customerInfo.streetAddress}
                    onChange={(e) => handleCustomerInfoChange('streetAddress', e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">City *</label>
                    <input
                      type="text"
                      required
                      value={customerInfo.city}
                      onChange={(e) => handleCustomerInfoChange('city', e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                      placeholder="Cape Town"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Province *</label>
                    <select
                      required
                      value={customerInfo.province}
                      onChange={(e) => handleCustomerInfoChange('province', e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                    >
                      <option value="">Select Province</option>
                      <option value="Western Cape">Western Cape</option>
                      <option value="Eastern Cape">Eastern Cape</option>
                      <option value="Northern Cape">Northern Cape</option>
                      <option value="Free State">Free State</option>
                      <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                      <option value="North West">North West</option>
                      <option value="Gauteng">Gauteng</option>
                      <option value="Mpumalanga">Mpumalanga</option>
                      <option value="Limpopo">Limpopo</option>
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Postal Code *</label>
                  <input
                    type="text"
                    required
                    value={customerInfo.postalCode}
                    onChange={(e) => handleCustomerInfoChange('postalCode', e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                    placeholder="8001"
                  />
                </div>
              </div>

              {/* Purchase Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 px-6 font-medium text-lg rounded transition-colors ${
                  isSubmitting
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-orange-500 text-white hover:bg-orange-600'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  `Purchase - R${product.price.toFixed(2)}`
                )}
              </button>
            </form>

            {/* Back to Shop */}
            <button
              onClick={() => router.push('/shop')}
              className="text-gray-400 hover:text-white transition-colors flex items-center mt-4"
            >
              ← Back to Shop
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}