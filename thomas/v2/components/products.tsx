export default function Products() {
  const products = [
    {
      id: 1,
      name: "Industrial Lubricants",
      image: "/product-industrial-lubricants.jpg",
    },
    {
      id: 2,
      name: "Metalworking Fluids",
      image: "/product-metalworking-fluids.jpg",
    },
    {
      id: 3,
      name: "Metalforming Fluids",
      image: "/product-metalforming-fluids.jpg",
    },
    {
      id: 4,
      name: "Food-Grade Lubricants",
      image: "/product-food-grade-lubricants.jpg",
    },
    {
      id: 5,
      name: "Greases & Gear-Making Compound",
      image: "/product-greases-gear.jpg",
    },
    {
      id: 6,
      name: "Rust Preventatives",
      image: "/product-rust-preventatives.jpg",
    },
    {
      id: 7,
      name: "Cutting Oils",
      image: "/product-cutting-oils.jpg",
    },
    {
      id: 8,
      name: "Cleaners",
      image: "/product-cleaners.jpg",
    },
  ]

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-lime-500 font-semibold text-sm md:text-base mb-4 uppercase tracking-wide">
            Unique Solutions Inspired by Your Unique Challenges
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Pioneering new technologies to accomplish your goals
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Cadillac Oil's highly experienced chemists, engineers and technicians have been solving customers'
            challenges for nearly 100 years — and we're just getting started.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <div key={product.id} className="group cursor-pointer">
              <div className="relative h-48 md:h-56 mb-4 rounded-lg overflow-hidden">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-center font-semibold text-gray-800 text-sm md:text-base">{product.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
