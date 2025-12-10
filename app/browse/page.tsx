"use client"

import { useState, useMemo, useEffect } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import FilterSidebar from "@/components/filter-sidebar"
import PropertyCard from "@/components/property-card"
import { Button } from "@/components/ui/button"
import { SlidersHorizontal, X, ChevronDown, ChevronLeft, ChevronRight, Lock } from "lucide-react"
import { useAuth } from "@/components/auth-context" // 1. Import Auth Hook

// Sample property data
const allProperties = [
  {
    id: 1,
    image: "/modern-student-pg-room-with-bed-and-desk.jpg",
    title: "Sunshine PG for Boys",
    price: 8000,
    distance: "0.5 km",
    amenities: ["WiFi", "AC", "Food"],
    rating: 4.5,
    genderTag: "Boys Only" as const,
    isVerified: true,
  },
  {
    id: 2,
    image: "/cozy-girls-hostel-room-pink-theme.jpg",
    title: "Grace Girls Hostel",
    price: 9500,
    distance: "0.8 km",
    amenities: ["WiFi", "AC", "Food", "Laundry"],
    rating: 4.8,
    genderTag: "Girls Only" as const,
    isVerified: true,
  },
  {
    id: 3,
    image: "/spacious-unisex-pg-common-area.jpg",
    title: "Campus View Co-Living",
    price: 12000,
    distance: "0.3 km",
    amenities: ["WiFi", "AC", "Gym"],
    rating: 4.6,
    genderTag: "Unisex" as const,
    isVerified: true,
  },
  {
    id: 4,
    image: "/modern-boys-pg-room-with-study-area.jpg",
    title: "Scholar's Den PG",
    price: 7500,
    distance: "1.2 km",
    amenities: ["WiFi", "Food"],
    rating: 4.2,
    genderTag: "Boys Only" as const,
    isVerified: false,
  },
  {
    id: 5,
    image: "/premium-girls-hostel-room-with-balcony.jpg",
    title: "Pearl Ladies PG",
    price: 11000,
    distance: "0.6 km",
    amenities: ["WiFi", "AC", "Food", "Laundry"],
    rating: 4.7,
    genderTag: "Girls Only" as const,
    isVerified: true,
  },
  {
    id: 6,
    image: "/budget-friendly-shared-pg-room.jpg",
    title: "Budget Stay PG",
    price: 5500,
    distance: "1.5 km",
    amenities: ["WiFi", "Food"],
    rating: 4.0,
    genderTag: "Unisex" as const,
    isVerified: false,
  },
  {
    id: 7,
    image: "/luxury-student-accommodation-with-amenities.jpg",
    title: "Elite Student Living",
    price: 15000,
    distance: "0.4 km",
    amenities: ["WiFi", "AC", "Food", "Gym"],
    rating: 4.9,
    genderTag: "Unisex" as const,
    isVerified: true,
  },
  {
    id: 8,
    image: "/cozy-boys-hostel-single-room.jpg",
    title: "Metro Boys Hostel",
    price: 6500,
    distance: "2.0 km",
    amenities: ["WiFi", "Laundry"],
    rating: 4.1,
    genderTag: "Boys Only" as const,
    isVerified: false,
  },
]

const ITEMS_PER_PAGE = 6

export default function BrowsePage() {
  // 2. Get Authentication State
  const { isLoggedIn, openModal } = useAuth()
  const [isClient, setIsClient] = useState(false)

  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [sortBy, setSortBy] = useState("recommended")
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  // Filter state (synced from sidebar)
  const [filters, setFilters] = useState({
    rentRange: [2000, 20000] as [number, number],
    amenities: {
      wifi: false,
      ac: false,
      food: false,
      laundry: false,
      gym: false,
      powerBackup: false,
    },
    verifiedOnly: false,
    roomType: [] as string[],
    genderPreference: "any",
  })

  // Prevent Hydration Error
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Sort options
  const sortOptions = [
    { value: "recommended", label: "Recommended" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "distance", label: "Distance: Nearest" },
    { value: "rating", label: "Rating: Highest" },
  ]

  // Filter and sort properties
  const filteredAndSortedProperties = useMemo(() => {
    let result = [...allProperties]

    // Apply filters
    result = result.filter((property) => {
      // Rent range filter
      if (property.price < filters.rentRange[0] || property.price > filters.rentRange[1]) {
        return false
      }

      // Gender preference filter
      if (filters.genderPreference !== "any") {
        const genderMap: Record<string, string> = {
          boys: "Boys Only",
          girls: "Girls Only",
          unisex: "Unisex",
        }
        if (property.genderTag !== genderMap[filters.genderPreference]) {
          return false
        }
      }

      // Verified only filter
      if (filters.verifiedOnly && !property.isVerified) {
        return false
      }

      // Amenities filter
      const selectedAmenities = Object.entries(filters.amenities)
        .filter(([, selected]) => selected)
        .map(([key]) => key)

      if (selectedAmenities.length > 0) {
        const propertyAmenities = property.amenities.map((a) => a.toLowerCase())
        const hasAllAmenities = selectedAmenities.every((amenity) => {
          if (amenity === "powerBackup") return propertyAmenities.includes("power backup")
          return propertyAmenities.includes(amenity)
        })
        if (!hasAllAmenities) return false
      }

      return true
    })

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        result.sort((a, b) => b.price - a.price)
        break
      case "distance":
        result.sort((a, b) => Number.parseFloat(a.distance) - Number.parseFloat(b.distance))
        break
      case "rating":
        result.sort((a, b) => b.rating - a.rating)
        break
      default:
        // Recommended - prioritize verified and high rating
        result.sort((a, b) => {
          if (a.isVerified !== b.isVerified) return a.isVerified ? -1 : 1
          return b.rating - a.rating
        })
    }

    return result
  }, [filters, sortBy])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProperties.length / ITEMS_PER_PAGE)
  const paginatedProperties = filteredAndSortedProperties.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page on filter change
  }

  // --- 3. ACCESS RESTRICTED VIEW ---
  if (isClient && !isLoggedIn) {
    return (
      <div className="min-h-screen bg-secondary flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-4 text-center">
          <div className="bg-card p-8 rounded-3xl shadow-xl max-w-md w-full border border-border">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Access Restricted</h1>
            <p className="text-muted-foreground mb-8">
              You must be logged in to browse properties and view details.
            </p>
            <Button onClick={openModal} className="w-full h-12 rounded-xl text-base bg-primary text-primary-foreground hover:bg-primary/90">
              Log In / Sign Up
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // --- 4. NORMAL VIEW (LOGGED IN) ---
  return (
    <div className="min-h-screen bg-secondary">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Browse All PGs</h1>
          <p className="text-muted-foreground">
            {filteredAndSortedProperties.length} properties found near your campus
          </p>
        </div>

        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <Button
            variant="outline"
            onClick={() => setShowMobileFilters(true)}
            className="w-full rounded-xl border-border bg-card"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-80 shrink-0">
            <div className="bg-card rounded-2xl shadow-lg border border-border sticky top-24">
              <div className="p-4 border-b border-border">
                <h2 className="font-semibold text-foreground text-lg">Filters</h2>
              </div>
              <FilterSidebar onFiltersChange={handleFiltersChange} />
            </div>
          </aside>

          {/* Mobile Filter Drawer */}
          {showMobileFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
              <div className="absolute left-0 top-0 bottom-0 w-full max-w-sm bg-card shadow-xl overflow-y-auto">
                <div className="sticky top-0 bg-card p-4 border-b border-border flex items-center justify-between z-10">
                  <h2 className="font-semibold text-foreground text-lg">Filters</h2>
                  <button onClick={() => setShowMobileFilters(false)} className="p-2 hover:bg-secondary rounded-full">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <FilterSidebar onClose={() => setShowMobileFilters(false)} onFiltersChange={handleFiltersChange} />
              </div>
            </div>
          )}

          {/* Listings Grid */}
          <div className="flex-1 min-w-0">
            {/* Sort Bar */}
            <div className="bg-card rounded-xl shadow-sm border border-border p-4 mb-6 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Showing {paginatedProperties.length} of {filteredAndSortedProperties.length} results
              </span>

              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary hover:bg-border transition-colors text-sm font-medium"
                >
                  Sort: {sortOptions.find((o) => o.value === sortBy)?.label}
                  <ChevronDown className={`w-4 h-4 transition-transform ${showSortDropdown ? "rotate-180" : ""}`} />
                </button>

                {showSortDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowSortDropdown(false)} />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-card rounded-xl shadow-lg border border-border py-2 z-20">
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value)
                            setShowSortDropdown(false)
                          }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-secondary transition-colors
                            ${sortBy === option.value ? "text-primary font-medium" : "text-foreground"}`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Property Grid */}
            {paginatedProperties.length > 0 ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedProperties.map((property) => (
                  <PropertyCard key={property.id} {...property} />
                ))}
              </div>
            ) : (
              <div className="bg-card rounded-2xl shadow-lg border border-border p-12 text-center">
                <p className="text-muted-foreground text-lg mb-4">No properties match your filters</p>
                <Button
                  variant="outline"
                  onClick={() =>
                    setFilters({
                      rentRange: [2000, 20000],
                      amenities: {
                        wifi: false,
                        ac: false,
                        food: false,
                        laundry: false,
                        gym: false,
                        powerBackup: false,
                      },
                      verifiedOnly: false,
                      roomType: [],
                      genderPreference: "any",
                    })
                  }
                  className="rounded-full"
                >
                  Clear All Filters
                </Button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rounded-xl border-border"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-xl text-sm font-medium transition-colors
                        ${
                          currentPage === page
                            ? "bg-primary text-primary-foreground"
                            : "bg-card border border-border hover:bg-secondary"
                        }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-xl border-border"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
