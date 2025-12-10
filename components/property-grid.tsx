"use client"

import PropertyCard from "@/components/property-card"
import { Grid3X3, LayoutList, ChevronDown } from "lucide-react"
import { useState, useRef, useEffect } from "react"

// Mock data for properties
const mockProperties = [
  {
    id: 1,
    image: "/modern-student-pg-room-with-bed-and-desk.jpg",
    title: "Sunrise PG for Boys",
    price: 8000,
    distance: "0.5 km",
    amenities: ["Wifi", "AC", "Food"],
    rating: 4.5,
    genderTag: "Boys Only" as const,
    isVerified: true,
  },
  {
    id: 2,
    image: "/cozy-girls-hostel-room-pink-theme.jpg",
    title: "Lakshmi Girls Hostel",
    price: 7500,
    distance: "0.8 km",
    amenities: ["Wifi", "Food", "Laundry"],
    rating: 4.8,
    genderTag: "Girls Only" as const,
    isVerified: true,
  },
  {
    id: 3,
    image: "/spacious-unisex-pg-common-area.jpg",
    title: "Green Valley PG",
    price: 9500,
    distance: "1.2 km",
    amenities: ["Wifi", "AC"],
    rating: 4.2,
    genderTag: "Unisex" as const,
    isVerified: false,
  },
  {
    id: 4,
    image: "/student-accommodation-single-room.jpg",
    title: "Campus Corner Stay",
    price: 6500,
    distance: "0.3 km",
    amenities: ["Wifi", "Food"],
    rating: 4.6,
    genderTag: "Unisex" as const,
    isVerified: true,
  },
  {
    id: 5,
    image: "/premium-boys-hostel-room-with-balcony.jpg",
    title: "Royal Boys PG",
    price: 12000,
    distance: "1.5 km",
    amenities: ["Wifi", "AC", "Food", "Laundry"],
    rating: 4.9,
    genderTag: "Boys Only" as const,
    isVerified: true,
  },
  {
    id: 6,
    image: "/budget-friendly-girls-pg-room.jpg",
    title: "Comfort Girls Stay",
    price: 5500,
    distance: "2.0 km",
    amenities: ["Wifi", "Food"],
    rating: 4.1,
    genderTag: "Girls Only" as const,
    isVerified: false,
  },
  {
    id: 7,
    image: "/modern-co-living-space-for-students.jpg",
    title: "StudyNest Co-Living",
    price: 10500,
    distance: "0.7 km",
    amenities: ["Wifi", "AC", "Laundry"],
    rating: 4.7,
    genderTag: "Unisex" as const,
    isVerified: true,
  },
  {
    id: 8,
    image: "/affordable-student-room-near-college.jpg",
    title: "Budget Stay PG",
    price: 4500,
    distance: "2.5 km",
    amenities: ["Wifi"],
    rating: 3.9,
    genderTag: "Boys Only" as const,
    isVerified: false,
  },
]

export default function PropertyGrid() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("relevance")
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const sortOptions = [
    { value: "relevance", label: "Relevance" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "distance", label: "Distance: Nearest" },
    { value: "rating", label: "Rating: Highest" },
  ]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setSortDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const sortedProperties = [...mockProperties].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "distance":
        return Number.parseFloat(a.distance) - Number.parseFloat(b.distance)
      case "rating":
        return b.rating - a.rating
      default:
        return 0
    }
  })

  const currentSortLabel = sortOptions.find((opt) => opt.value === sortBy)?.label || "Relevance"

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-foreground">PGs Near You</h1>
          <p className="text-sm text-muted-foreground mt-1">{mockProperties.length} properties found</p>
        </div>

        <div className="flex items-center gap-3">
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2.5 bg-card rounded-full border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors"
            >
              <span className="hidden sm:inline text-muted-foreground">Sort:</span>
              <span>{currentSortLabel}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${sortDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {sortDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-card rounded-xl border border-border shadow-lg z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value)
                      setSortDropdownOpen(false)
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm transition-colors
                      ${
                        sortBy === option.value
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-foreground hover:bg-secondary"
                      }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-card rounded-full p-1 shadow-sm border border-border">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-full transition-colors ${
                viewMode === "grid"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-label="Grid view"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-full transition-colors ${
                viewMode === "list"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-label="List view"
            >
              <LayoutList className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6 overflow-x-auto hide-scrollbar pb-2">
        {["All", "Verified", "Under ₹8k", "AC Included", "Food Included"].map((filter, index) => (
          <button
            key={filter}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                ${
                  index === 0
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-foreground border border-border hover:bg-secondary"
                }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Property Grid */}
      <div
        className={`grid gap-4 lg:gap-6 ${
          viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3" : "grid-cols-1"
        }`}
      >
        {sortedProperties.map((property) => (
          <PropertyCard key={property.id} {...property} />
        ))}
      </div>

      {/* Load More */}
      <div className="flex justify-center mt-8">
        <button className="px-8 py-3 rounded-full border-2 border-primary text-primary font-medium hover:bg-primary hover:text-primary-foreground transition-colors">
          Load More Properties
        </button>
      </div>
    </div>
  )
}
