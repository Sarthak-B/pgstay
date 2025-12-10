import Header from "@/components/header"
import Footer from "@/components/footer"
import AddPropertyWizard from "@/components/add-property-wizard"

export default function OwnerOnboardingPage() {
  return (
    <div className="min-h-screen bg-accent">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AddPropertyWizard />
      </main>
      <Footer />
    </div>
  )
}
