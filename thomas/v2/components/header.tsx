export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-center gap-8">
          {/* Left Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="font-semibold text-gray-800 hover:text-lime-600 transition">
              OUR PRODUCTS
            </a>
            <a href="#" className="font-semibold text-gray-800 hover:text-lime-600 transition">
              SERVICES
            </a>
          </nav>

          {/* Logo - Center */}
          <div className="flex-shrink-0 flex flex-col items-center">
            <div className="w-20 h-20 bg-gradient-to-b from-lime-400 to-lime-600 rounded-full border-4 border-lime-700 flex items-center justify-center shadow-lg">
              <div className="text-2xl font-bold text-gray-900">TG</div>
            </div>
            <p className="mt-2 font-bold text-gray-800 text-sm tracking-wide">THOMAS GROZIER</p>
          </div>

          {/* Right Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="font-semibold text-gray-800 hover:text-lime-600 transition">
              ABOUT US
            </a>
            <a href="#" className="font-semibold text-gray-800 hover:text-lime-600 transition">
              CONTACT US
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-gray-800">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
