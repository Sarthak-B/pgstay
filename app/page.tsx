import Header from "@/components/header"
import Hero from "@/components/hero"
import ProcessSection from "@/components/process-section"
import TrendingPGs from "@/components/trending-pgs"
import OwnerSection from "@/components/owner-section"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <ProcessSection />
      <TrendingPGs />
      <OwnerSection />
      <Footer />
    </main>
  )
}
