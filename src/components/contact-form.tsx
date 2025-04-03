"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      // Reset form after successful submission
      setFormData({
        name: "",
        email: "",
        message: "",
      })
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
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
            className="w-full bg-transparent border-b border-white/50 focus:border-white pb-2 outline-none"
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
            className="w-full bg-transparent border-b border-white/50 focus:border-white pb-2 outline-none"
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
            className="w-full bg-transparent border-b border-white/50 focus:border-white pb-2 outline-none resize-none"
          ></textarea>
        </div>
      </div>

      <div className="mt-12">
        <p className="text-sm mb-6">
          Are you an artist seeking to collaborate with us? Follow this link:{" "}
          <Link href="/collaborate" className="text-blue-400 hover:underline">
            COLLABORATE WITH US
          </Link>
        </p>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="border border-white py-2 px-12 text-lg hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </form>
  )
}

