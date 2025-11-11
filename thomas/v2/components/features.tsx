import { Globe, ArrowRight, Zap, Wrench } from "lucide-react"

export default function Features() {
  const features = [
    {
      icon: Globe,
      title: "Deeply Experienced",
      description:
        "A century of formulating and troubleshooting has taught us a lot — and we'd like to share it with you.",
    },
    {
      icon: ArrowRight,
      title: "Flexible",
      description: "Our willingness to customize products and meet strict lead-times far exceeds our larger peers.",
    },
    {
      icon: Zap,
      title: "Technology Driven",
      description: "Innovation is at the core of everything we do — and our passion is solving customer challenges.",
    },
    {
      icon: Wrench,
      title: "Specialized",
      description: "We create highly specialized, highly engineered products within eight focused product families.",
    },
  ]

  return (
    <section className="bg-gray-900 py-16 md:py-24 relative">
      {/* Wave divider */}
      <svg
        className="absolute top-0 left-0 right-0 -translate-y-1/2 w-full z-0"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path d="M0,50 Q300,0 600,50 T1200,50 L1200,120 L0,120 Z" fill="rgb(17 24 39)" />
      </svg>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <Icon className="w-12 h-12 text-lime-400" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-bold text-lime-400 mb-3 uppercase tracking-wide">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
