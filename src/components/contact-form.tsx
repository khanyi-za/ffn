"use client"

import type React from "react"

import { useState } from "react"
import CollaborationModal from "./collaboration-modal"

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' })
  const [isCollabModalOpen, setIsCollabModalOpen] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear any previous status messages when user starts typing
    if (submitStatus.type) {
      setSubmitStatus({ type: null, message: '' })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: '' })

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        // Success
        setSubmitStatus({
          type: 'success',
          message: 'Thank you! Your message has been sent successfully. We\'ll get back to you soon.'
        })
        // Reset form after successful submission
        setFormData({
          name: "",
          email: "",
          message: "",
        })
      } else {
        // API returned an error
        setSubmitStatus({
          type: 'error',
          message: result.error || 'Something went wrong. Please try again.'
        })
      }
    } catch (error) {
      // Network or other error
      console.error("Error submitting form:", error)
      setSubmitStatus({
        type: 'error',
        message: 'Failed to send message. Please check your connection and try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Status Message */}
      {submitStatus.type && (
        <div className={`mb-8 p-4 rounded-lg border ${
          submitStatus.type === 'success' 
            ? 'bg-green-900/20 border-green-500 text-green-300'
            : 'bg-red-900/20 border-red-500 text-red-300'
        }`}>
          {submitStatus.message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-lg">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              className="w-full bg-transparent border-b border-white/50 focus:border-white pb-2 outline-none disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-lg">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              className="w-full bg-transparent border-b border-white/50 focus:border-white pb-2 outline-none disabled:opacity-50"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label htmlFor="message" className="block text-lg">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={1}
              disabled={isSubmitting}
              className="w-full bg-transparent border-b border-white/50 focus:border-white pb-2 outline-none resize-none disabled:opacity-50"
            ></textarea>
          </div>
        </div>

        <div className="mt-12">
          <p className="text-xl mb-6">
            Are you an artist seeking to collaborate with us?{" "}
            <button
              type="button"
              onClick={() => setIsCollabModalOpen(true)}
              className="text-blue-400 hover:underline cursor-pointer"
            >
              COLLABORATE WITH US
            </button>
          </p>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`border border-white py-2 px-12 text-lg transition-all duration-200 ${
                isSubmitting
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-white hover:text-black'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center space-x-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" className="opacity-25" />
                    <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Sending...</span>
                </span>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Collaboration Modal */}
      <CollaborationModal 
        isOpen={isCollabModalOpen}
        onClose={() => setIsCollabModalOpen(false)}
      />
    </div>
  )
}

