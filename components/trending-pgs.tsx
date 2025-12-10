"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import ListingCard from "./listing-card"

const listings = [
  {
    id: 1,
    image: "/modern-student-pg-room-with-bed-and-desk-clean-int.jpg",
    title: "Sunrise PG for Boys",
    price: 8000,
    distance: "0.5km",
    amenities: ["Wifi", "AC", "Meals"],
    rating: 4.8,
  },
  {
    id: 2,
    image: "/cozy-student-accommodation-room-with-natural-light.jpg",
    title: "Green Valley Stay",
    price: 7500,
    distance: "0.8km",
    amenities: ["Wifi", "Laundry"],
    rating: 4.6,
  },
  {
    id: 3,
    image: "/spacious-shared-room-for-students-with-study-area.jpg",
    title: "Campus Corner PG",
    price: 9500,
    distance: "0.3km",
    amenities: ["Wifi", "AC", "Gym"],
    rating: 4.9,
  },
  {
    id: 4,
    image: "/budget-friendly-student-room-with-basic-amenities.jpg",
    title: "Student Hub Residency",
    price: 6500,
    distance: "1.2km",
    amenities: ["Wifi", "Meals"],
    rating: 4.5,
  },
  {
    id: 5,
    image: "/premium-pg-accommodation-for-students-air-conditio.jpg",
    title: "Elite Student Living",
    price: 12000,
    distance: "0.4km",
    amenities: ["Wifi", "AC", "Meals", "Gym"],
    rating: 4.9,
  },
]

export default function TrendingPGs() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340
      const newScrollLeft =
        direction === "left"
          ? scrollContainerRef.current.scrollLeft - scrollAmount
          : scrollContainerRef.current.scrollLeft + scrollAmount

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      })
    }
  }

  return (
    <section className="bg-background py-16 lg:py-24" id="browse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 lg:mb-12">
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">Featured Listings</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance">
              Popular Near Your College.
            </h2>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-border hover:bg-secondary bg-transparent"
              onClick={() => scroll("left")}
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-border hover:bg-secondary bg-transparent"
              onClick={() => scroll("right")}
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Carousel */}
        <div ref={scrollContainerRef} className="flex gap-6 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory">
          {listings.map((listing) => (
            <div key={listing.id} className="snap-start">
              <ListingCard {...listing} />
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <Button
            variant="outline"
            className="rounded-full px-8 py-6 border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors bg-transparent"
            asChild
          >
            <a href="/browse">View All PGs</a>
          </Button>
        </div>
      </div>
    </section>
  )
}
