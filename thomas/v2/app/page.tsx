import Header from "@/components/header"
import Hero from "@/components/hero"
import Products from "@/components/products"
import Features from "@/components/features"
import Footer from "@/components/footer"
import Certificates from "@/components/certificates"
import PDFLibrary from "@/components/pdf-library"
import Contact from "@/components/contact"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Products />
      <Features />
      <Certificates />
      <PDFLibrary />
      <Contact />
      <Footer />
    </main>
  )
}
