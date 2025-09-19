'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import PageLoader from '@/components/page-loader'

// Types
interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  images: string[];
  description: string;
  slug: string;
}

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

interface OrderData {
  product: Product;
  customerInfo: CustomerInfo;
  quantity: number;
  total: number;
}

export default function CheckoutPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  useEffect(() => {
    // Load order data from localStorage
    const savedOrder = localStorage.getItem('pendingOrder')
    if (savedOrder) {
      try {
        const parsed = JSON.parse(savedOrder)
        setOrderData(parsed)
      } catch (error) {
        console.error('Error parsing order data:', error)
        router.push('/shop')
      }
    } else {
      router.push('/shop')
    }
  }, [router])

  const generateOrderNumber = () => {
    return 'FFN' + Date.now().toString().slice(-6)
  }

  const handleCompleteOrder = async () => {
    if (!orderData) return

    setIsProcessing(true)

    try {
      // Here you would typically:
      // 1. Send order to your backend
      // 2. Process payment
      // 3. Send confirmation email
      // 4. Update inventory
      
      // For now, we'll simulate this with a delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const newOrderNumber = generateOrderNumber()
      setOrderNumber(newOrderNumber)
      setOrderComplete(true)
      
      // Clear the pending order
      localStorage.removeItem('pendingOrder')
      
    } catch (error) {
      console.error('Error processing order:', error)
      alert('There was an error processing your order. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return <PageLoader onLoadingComplete={handleLoadingComplete} />
  }

  if (!orderData) {
    return (
      <main className="min-h-screen bg-black text-white with-hero-nav">
        <Navigation />
        <div className="container mx-auto px-6 pt-36 pb-12 text-center">
          <h1 className="font-serif text-4xl mb-8">No Order Found</h1>
          <p className="text-gray-400 mb-8">Please add items to your cart first.</p>
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

  if (orderComplete) {
    return (
      <main className="min-h-screen bg-black text-white with-hero-nav">
        <Navigation />
        <div className="container mx-auto px-6 pt-36 pb-12 text-center max-w-2xl">
          <div className="bg-green-900/20 border border-green-500 rounded-lg p-8 mb-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            
            <h1 className="font-serif text-3xl md:text-4xl mb-4 text-green-300">Order Confirmed!</h1>
            <p className="text-lg mb-6 text-green-100">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
            
            <div className="bg-black/50 rounded-lg p-6 mb-6">
              <h2 className="font-serif text-xl mb-4">Order Details</h2>
              <div className="text-left space-y-2">
                <p><strong>Order Number:</strong> {orderNumber}</p>
                <p><strong>Product:</strong> {orderData.product.name}</p>
                <p><strong>Size:</strong> {orderData.customerInfo.size}</p>
                <p><strong>Quantity:</strong> {orderData.quantity}</p>
                <p><strong>Total:</strong> R{orderData.total.toFixed(2)}</p>
                <p><strong>Email:</strong> {orderData.customerInfo.email}</p>
              </div>
            </div>
            
            <p className="text-sm text-gray-300 mb-6">
              A confirmation email has been sent to {orderData.customerInfo.email} with your order details and tracking information.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => router.push('/shop')}
                className="bg-white text-black px-6 py-3 rounded hover:bg-gray-200 transition-colors"
              >
                Continue Shopping
              </button>
              <button 
                onClick={() => router.push('/')}
                className="border border-white text-white px-6 py-3 rounded hover:bg-white hover:text-black transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white with-hero-nav">
      <Navigation />
      
      <div className="container mx-auto px-6 pt-36 pb-12 md:px-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl font-light mb-8">Checkout</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Order Summary */}
            <div className="space-y-6">
              <h2 className="font-serif text-2xl mb-6">Order Summary</h2>
              
              <div className="bg-gray-900 rounded-lg p-6">
                <div className="flex space-x-4 mb-6">
                  <div className="relative w-20 h-20 bg-gray-800 rounded-lg overflow-hidden">
                    <Image
                      src={orderData.product.images[0]}
                      alt={orderData.product.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-lg">{orderData.product.name}</h3>
                    <p className="text-gray-400">{orderData.product.description}</p>
                    <p className="text-sm text-gray-300 mb-1">Size: {orderData.customerInfo.size}</p>
                    <p className="text-orange-500 font-medium">R{orderData.product.price.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Qty: {orderData.quantity}</p>
                  </div>
                </div>
                
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span>Subtotal</span>
                    <span>R{orderData.product.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span>Shipping</span>
                    <span>FREE</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-medium border-t border-gray-700 pt-2">
                    <span>Total</span>
                    <span className="text-orange-500">R{orderData.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="space-y-6">
              <h2 className="font-serif text-2xl mb-6">Shipping Information</h2>
              
              <div className="bg-gray-900 rounded-lg p-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Contact Information</h4>
                    <p className="text-gray-300">{orderData.customerInfo.email}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Customer Name</h4>
                    <p className="text-gray-300">
                      {orderData.customerInfo.firstName} {orderData.customerInfo.lastName}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Shipping Address</h4>
                    <div className="text-gray-300">
                      <p>{orderData.customerInfo.streetAddress}</p>
                      <p>{orderData.customerInfo.city}, {orderData.customerInfo.province}</p>
                      <p>{orderData.customerInfo.postalCode}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-gray-900 rounded-lg p-6">
                <h4 className="font-medium mb-4">Payment Method</h4>
                <div className="bg-blue-900/20 border border-blue-500 rounded p-4">
                  <p className="text-blue-300 text-sm">
                    <strong>Bank Transfer / EFT</strong><br />
                    Payment instructions will be sent to your email after placing the order.
                    Your order will be processed once payment is confirmed.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4">
                <button
                  onClick={() => router.back()}
                  className="flex-1 border border-gray-600 text-white py-3 px-6 font-medium hover:bg-gray-800 transition-colors rounded"
                >
                  Back
                </button>
                <button
                  onClick={handleCompleteOrder}
                  disabled={isProcessing}
                  className={`flex-1 py-3 px-6 font-medium rounded transition-colors ${
                    isProcessing
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-orange-500 text-white hover:bg-orange-600'
                  }`}
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Place Order'
                  )}
                </button>
              </div>
              
              <p className="text-xs text-gray-400 text-center">
                By placing this order, you agree to our terms and conditions.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}