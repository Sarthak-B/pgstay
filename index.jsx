import "./styles/global.css"
import Header from "./components/Header"
import Hero from "./components/Hero"
import Features from "./components/Features"
import Process from "./components/Process"
import Testimonials from "./components/Testimonials"
import CTA from "./components/CTA"
import Footer from "./components/Footer"

function App() {
  return (
    <div className="app">
      <Header />
      <Hero />
      <Features />
      <Process />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  )
}

export default App
