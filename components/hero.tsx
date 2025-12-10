"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, MapPin, IndianRupee, BedDouble } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-context" // 1. Import the auth hook

export default function Hero() {
  const router = useRouter()
  const { protectedAction } = useAuth() // 2. Get the protection helper
  
  const [location, setLocation] = useState("")
  const [budget, setBudget] = useState("")
  const [roomType, setRoomType] = useState("")

  const colleges = [
    "Tula's Institute",
    "University of Petroleum and Energy Studies (UPES)",
    "Graphic Era University",
    "DIT University",
    "Uttaranchal University",
    "IMS Unison University",
    "Doon University",
    "BFIT Group of Institutions",
    "Himalayan Institute of Technology",
    "Dev Bhoomi Uttarakhand University",
    "D.A.V. (P.G.) College, Dehradun",
    "DBS (P.G.) College, Dehradun",
    "MKP P.G. College, Dehradun",
    "Swami Rama Himalayan University",
    "The ICFAI University, Dehradun",
    "Sardar Bhagwan Singh University, Dehradun",
    "Himgiri Zee University, Dehradun",
    "Shivalik College of Engineering, Dehradun"
  ];
  
  const roomTypes = ["Single Room", "Double Sharing", "Triple Sharing", "Any"]

  const handleSearch = () => {
    // 3. Wrap navigation logic in protectedAction
    // Checks if logged in: Yes -> Search | No -> Open Login Modal
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
    <section className="relative bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-28">
        {/* Centered Content Container */}
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full text-sm text-muted-foreground mb-6">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            1,200+ verified PGs listed
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance mb-6">
            Find Your Home Away From Campus.
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto">
            Discover verified PGs and rooms near your college. Book directly with owners, take virtual tours, and move
            in hassle-free.
          </p>

          <div className="bg-card rounded-2xl shadow-lg p-6 lg:p-8 border border-border">
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              {/* Location Select */}
              <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  College/Location
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select College</option>
                  {colleges.map((college) => (
                    <option key={college} value={college}>
                      {college}
                    </option>
                  ))}
                </select>
              </div>

              {/* Budget Input */}
              <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-muted-foreground" />
                  Budget
                </label>
                <input
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="₹5,000 - ₹15,000"
                  className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Room Type Select */}
              <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <BedDouble className="w-4 h-4 text-muted-foreground" />
                  Room Type
                </label>
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select Type</option>
                  {roomTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Button
              onClick={handleSearch}
              className="w-full sm:w-auto rounded-full px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90 text-base font-medium"
            >
              <Search className="w-5 h-5 mr-2" />
              Search Rooms
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-10">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-secondary border-2 border-background" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground"></span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
