"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, MapPin, IndianRupee, BedDouble, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-context"

export default function Hero() {
  const router = useRouter()
  const { protectedAction } = useAuth()
  
  const [location, setLocation] = useState("")
  const [budget, setBudget] = useState("")
  const [roomType, setRoomType] = useState("")

  const colleges = [
    "Tula's Institute",
    "University of Petroleum and Energy Studies (UPES)",
    "Graphic Era University",
    "DIT University",
    "Uttaranchal University",
    "Doon University",
    "D.A.V. (P.G.) College",
    "DBS (P.G.) College"
  ];
  
  const roomTypes = ["Single Room", "Double Sharing", "Triple Sharing", "Any"]

  const handleSearch = () => {
    protectedAction(() => {
      const params = new URLSearchParams()
      if (location) params.set("location", location)
      if (budget) params.set("budget", budget)
      if (roomType) params.set("roomType", roomType)

      const queryString = params.toString()
      router.push(`/browse${queryString ? `?${queryString}` : ""}`)
    })
  }

  return (
    <section className="relative w-full pt-20 pb-32 md:pt-32 md:pb-48 overflow-hidden bg-background">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none opacity-30 dark:opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="container relative z-10 mx-auto px-4 flex flex-col items-center text-center">
        
        {/* Main Heading */}
        <div className="max-w-3xl space-y-6 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-border text-sm font-medium text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            India's Most Trusted Student Housing
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Find a home that feels <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">like home.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
            Discover verified PGs, hostels, and shared flats near your college. Zero brokerage, 100% transparency.
          </p>
        </div>

        {/* Search Card */}
        <div className="w-full max-w-4xl bg-white/80 dark:bg-card/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-4 md:p-6 animate-in zoom-in-95 duration-500 delay-300">
          <div className="grid md:grid-cols-[1fr_1fr_1fr_auto] gap-4">
            
            {/* Location Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-14 pl-10 pr-4 rounded-xl bg-secondary/50 border-transparent focus:border-primary focus:bg-background transition-all appearance-none outline-none font-medium"
              >
                <option value="">Select College / Area</option>
                {colleges.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Budget Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <IndianRupee className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
              <input
                type="text"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="Max Budget (e.g. 10000)"
                className="w-full h-14 pl-10 pr-4 rounded-xl bg-secondary/50 border border-transparent focus:border-primary focus:bg-background transition-all outline-none font-medium placeholder:text-muted-foreground/70"
              />
            </div>

            {/* Room Type Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <BedDouble className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="w-full h-14 pl-10 pr-4 rounded-xl bg-secondary/50 border-transparent focus:border-primary focus:bg-background transition-all appearance-none outline-none font-medium"
              >
                <option value="">Room Type</option>
                {roomTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Search Button */}
            <Button 
              onClick={handleSearch} 
              size="lg" 
              className="h-14 rounded-xl px-8 text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
            >
              Search
            </Button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-muted-foreground animate-in fade-in duration-1000 delay-500">
          <span>Popular:</span>
          {["Single Room near UPES", "Girls PG Dehradun", "Budget Rooms"].map((tag) => (
            <button key={tag} className="hover:text-primary underline decoration-dotted underline-offset-4 transition-colors">
              {tag}
            </button>
          ))}
        </div>

      </div>
    </section>
  )
}
