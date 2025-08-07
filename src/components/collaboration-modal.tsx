"use client"

import type React from "react"
import { useState } from "react"

interface CollaborationModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CollaborationModal({ isOpen, onClose }: CollaborationModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    genre: "",
    email: "",
    gender: "",
    location: "",
    mixLink: "",
    instagramHandle: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      const response = await fetch('/api/collaboration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'Thank you for your interest! We\'ll review your submission and get back to you soon.'
        })
        // Reset form after successful submission
        setFormData({
          name: "",
          genre: "",
          email: "",
          gender: "",
          location: "",
          mixLink: "",
          instagramHandle: "",
        })
        // Close modal after 3 seconds
        setTimeout(() => {
          onClose()
          setSubmitStatus({ type: null, message: '' })
        }, 3000)
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.error || 'Something went wrong. Please try again.'
        })
      }
    } catch (error) {
      console.error("Error submitting collaboration form:", error)
      setSubmitStatus({
        type: 'error',
        message: 'Failed to send submission. Please check your connection and try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
      setSubmitStatus({ type: null, message: '' })
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-black border border-white max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/20">
          <h2 className="text-2xl md:text-3xl font-serif text-white">Collaborate With Us</h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-white hover:text-gray-300 text-3xl leading-none disabled:opacity-50"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {/* Status Message */}
          {submitStatus.type && (
            <div className={`mb-6 p-4 rounded-lg border ${
              submitStatus.type === 'success' 
                ? 'bg-green-900/20 border-green-500 text-green-300'
                : 'bg-red-900/20 border-red-500 text-red-300'
            }`}>
              {submitStatus.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-lg text-white">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="w-full bg-transparent border-b border-white/50 focus:border-white pb-2 outline-none text-white placeholder-gray-400 disabled:opacity-50"
                placeholder="Your full name"
              />
            </div>

            {/* Genre */}
            <div className="space-y-2">
              <label htmlFor="genre" className="block text-lg text-white">
                Genre *
              </label>
              <input
                type="text"
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="w-full bg-transparent border-b border-white/50 focus:border-white pb-2 outline-none text-white placeholder-gray-400 disabled:opacity-50"
                placeholder="e.g. Afrohouse, Amapiano, Hip Hop"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-lg text-white">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="w-full bg-transparent border-b border-white/50 focus:border-white pb-2 outline-none text-white placeholder-gray-400 disabled:opacity-50"
                placeholder="your@email.com"
              />
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label htmlFor="gender" className="block text-lg text-white">
                Gender *
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="w-full bg-black border-b border-white/50 focus:border-white pb-2 outline-none text-white disabled:opacity-50"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label htmlFor="location" className="block text-lg text-white">
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="w-full bg-transparent border-b border-white/50 focus:border-white pb-2 outline-none text-white placeholder-gray-400 disabled:opacity-50"
                placeholder="City, Country"
              />
            </div>

            {/* Mix Link */}
            <div className="space-y-2">
              <label htmlFor="mixLink" className="block text-lg text-white">
                Link to Your Mix *
              </label>
              <input
                type="url"
                id="mixLink"
                name="mixLink"
                value={formData.mixLink}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="w-full bg-transparent border-b border-white/50 focus:border-white pb-2 outline-none text-white placeholder-gray-400 disabled:opacity-50"
                placeholder="https://soundcloud.com/yourprofile/yourmix"
              />
            </div>

            {/* Instagram Handle */}
            <div className="space-y-2">
              <label htmlFor="instagramHandle" className="block text-lg text-white">
                Instagram Handle *
              </label>
              <input
                type="text"
                id="instagramHandle"
                name="instagramHandle"
                value={formData.instagramHandle}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="w-full bg-transparent border-b border-white/50 focus:border-white pb-2 outline-none text-white placeholder-gray-400 disabled:opacity-50"
                placeholder="@yourhandle"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`border border-white py-3 px-8 text-lg transition-all duration-200 ${
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
                    <span>Submitting...</span>
                  </span>
                ) : (
                  "Submit Collaboration Request"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}