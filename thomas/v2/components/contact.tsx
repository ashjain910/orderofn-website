"use client"

import type React from "react"

import { useState } from "react"
import { MapPin, Phone, Clock } from "lucide-react"

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  })

  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setFormData({ name: "", email: "", phone: "", company: "", message: "" })
      setSubmitted(false)
    }, 3000)
  }

  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Get In Touch</h2>
          <p className="text-gray-400 text-lg">
            We're here to help. Contact us for product inquiries, technical support, or partnerships.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Info Cards */}
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-lime-500 transition">
            <div className="flex items-center mb-4">
              <MapPin className="w-6 h-6 text-lime-500 mr-3" />
              <h3 className="text-xl font-semibold">Address</h3>
            </div>
            <p className="text-gray-300">Cadillac Oil Co.</p>
            <p className="text-gray-400 text-sm">123 Industrial Park Drive</p>
            <p className="text-gray-400 text-sm">Manufacturing City, State 12345</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-lime-500 transition">
            <div className="flex items-center mb-4">
              <Phone className="w-6 h-6 text-lime-500 mr-3" />
              <h3 className="text-xl font-semibold">Phone</h3>
            </div>
            <p className="text-gray-300 font-semibold">+1 (555) 123-4567</p>
            <p className="text-gray-400 text-sm">Sales & General Inquiries</p>
            <p className="text-gray-300 font-semibold mt-2">+1 (555) 987-6543</p>
            <p className="text-gray-400 text-sm">Technical Support</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-lime-500 transition">
            <div className="flex items-center mb-4">
              <Clock className="w-6 h-6 text-lime-500 mr-3" />
              <h3 className="text-xl font-semibold">Business Hours</h3>
            </div>
            <p className="text-gray-300">Monday - Friday</p>
            <p className="text-gray-400 text-sm">8:00 AM - 6:00 PM (EST)</p>
            <p className="text-gray-300 mt-2">Saturday</p>
            <p className="text-gray-400 text-sm">9:00 AM - 2:00 PM (EST)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Map */}
          <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.1234567890!2d-74.0060!3d40.7128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a22a3855555%3A0x1c6b829b5b5b5b5b!2s123%20Industrial%20Park%20Dr!5e0!3m2!1sen!2sus!4v1234567890"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Cadillac Oil Co. Location"
            />
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-lime-500"
                placeholder="Your name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-lime-500"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-lime-500"
                  placeholder="(555) 000-0000"
                />
              </div>
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium mb-2">
                Company
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-lime-500"
                placeholder="Your company"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-lime-500 resize-none"
                placeholder="Tell us about your inquiry..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-lime-500 hover:bg-lime-600 text-black font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              {submitted ? "Message Sent!" : "Send Inquiry"}
            </button>
            {submitted && <p className="text-lime-500 text-sm text-center">Thank you! We'll be in touch soon.</p>}
          </form>
        </div>
      </div>
    </section>
  )
}
