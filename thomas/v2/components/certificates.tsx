import { CheckCircle2 } from "lucide-react"

export default function Certificates() {
  const certificates = [
    {
      name: "AS/NZS ISO 9001:2015",
      description: "Quality Management System",
    },
    {
      name: "WRAS BS 6920",
      description: "Water Regulations Advisory Scheme",
    },
    {
      name: "ACS",
      description: "Approvals for Chemicals Scheme",
    },
  ]

  return (
    <section className="bg-gray-950 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Certifications & Approvals</h2>
          <p className="text-gray-400 text-lg">Our commitment to quality and safety standards</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {certificates.map((cert, index) => (
            <div
              key={index}
              className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-lime-400 transition-colors duration-300"
            >
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-8 h-8 text-lime-400 flex-shrink-0 mt-1" strokeWidth={1.5} />
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{cert.name}</h3>
                  <p className="text-gray-400 text-sm">{cert.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
