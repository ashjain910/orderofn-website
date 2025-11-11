"use client"

import { Download } from "lucide-react"
import { useState } from "react"

export default function PDFLibrary() {
  const [selectedCategory, setSelectedCategory] = useState("all")

  const documents = [
    {
      category: "certifications",
      title: "AS/NZS ISO 9001:2015 Certificate",
      description: "Quality Management System Certification",
      icon: "📋",
    },
    {
      category: "certifications",
      title: "WRAS BS 6920 Approval",
      description: "Water Regulations Advisory Scheme",
      icon: "📋",
    },
    {
      category: "certifications",
      title: "ACS Approvals Document",
      description: "Approvals for Chemicals Scheme",
      icon: "📋",
    },
    {
      category: "specs",
      title: "Pipe Jointing Lubricants - Technical Data",
      description: "Complete specifications and properties",
      icon: "📊",
    },
    {
      category: "specs",
      title: "Graphite Lubricants - Data Sheet",
      description: "Performance characteristics and applications",
      icon: "📊",
    },
    {
      category: "specs",
      title: "High-Temperature Lubricants - Tech Specs",
      description: "Operating ranges and performance data",
      icon: "📊",
    },
    {
      category: "sds",
      title: "Industrial Lubricants - SDS",
      description: "Safety Data Sheet - Complete hazard information",
      icon: "⚠️",
    },
    {
      category: "sds",
      title: "Metalworking Fluids - SDS",
      description: "Safety Data Sheet - Handling and storage",
      icon: "⚠️",
    },
    {
      category: "sds",
      title: "Cutting Oils - SDS",
      description: "Safety Data Sheet - Emergency procedures",
      icon: "⚠️",
    },
  ]

  const filtered = selectedCategory === "all" ? documents : documents.filter((doc) => doc.category === selectedCategory)

  return (
    <section className="bg-gray-900 py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-1">Resource Library</h2>
          <p className="text-gray-400 text-xs">Download certifications, technical data, and safety information</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-1 mb-4">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-0.5 rounded-lg font-semibold text-xs transition-colors duration-300 ${
              selectedCategory === "all" ? "bg-lime-400 text-gray-950" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            All Documents
          </button>
          <button
            onClick={() => setSelectedCategory("certifications")}
            className={`px-3 py-0.5 rounded-lg font-semibold text-xs transition-colors duration-300 ${
              selectedCategory === "certifications"
                ? "bg-lime-400 text-gray-950"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            Certifications
          </button>
          <button
            onClick={() => setSelectedCategory("specs")}
            className={`px-3 py-0.5 rounded-lg font-semibold text-xs transition-colors duration-300 ${
              selectedCategory === "specs" ? "bg-lime-400 text-gray-950" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            Technical Data
          </button>
          <button
            onClick={() => setSelectedCategory("sds")}
            className={`px-3 py-0.5 rounded-lg font-semibold text-xs transition-colors duration-300 ${
              selectedCategory === "sds" ? "bg-lime-400 text-gray-950" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            Safety Data Sheets
          </button>
        </div>

        {/* Document Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {filtered.map((doc, index) => (
            <a
              key={index}
              href="#"
              className="group bg-gray-800 border border-gray-700 rounded-lg p-2 hover:border-lime-400 transition-all duration-300 hover:shadow-lg hover:shadow-lime-400/10"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="text-lg">{doc.icon}</div>
                <Download className="w-3 h-3 text-gray-500 group-hover:text-lime-400 transition-colors duration-300" />
              </div>
              <h3 className="text-sm font-bold text-white mb-0.5 group-hover:text-lime-400 transition-colors duration-300">
                {doc.title}
              </h3>
              <p className="text-gray-400 text-2xs">{doc.description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
