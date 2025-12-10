"use client"

import { useState } from "react"
import FilterSidebar from "@/components/filter-sidebar"
import PropertyGrid from "@/components/property-grid"
import MapPlaceholder from "@/components/map-placeholder"
import { SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SearchPageContent() {
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  return (
    <div className="max-w-[1920px] mx-auto">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden sticky top-16 z-40 bg-secondary border-b border-border p-4">
        <Button
          variant="outline"
          className="w-full rounded-full flex items-center justify-center gap-2 bg-card"
          onClick={() => setShowMobileFilters(true)}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </Button>
      </div>

      {/* Mobile Filter Overlay */}
      {showMobileFilters && (
        <div className="lg:hidden fixed inset-0 z-50 bg-foreground/50">
          <div className="absolute inset-y-0 left-0 w-full max-w-sm bg-card shadow-xl overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
              <h2 className="font-semibold text-foreground">Filters</h2>
              <button onClick={() => setShowMobileFilters(false)} className="p-2 hover:bg-secondary rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <FilterSidebar onClose={() => setShowMobileFilters(false)} />
          </div>
        </div>
      )}

      {/* Desktop Layout */}
      <div className="flex">
        {/* Filter Sidebar - Desktop */}
        <aside className="hidden lg:block w-80 xl:w-96 shrink-0 bg-card border-r border-border h-[calc(100vh-80px)] sticky top-20 overflow-y-auto">
          <FilterSidebar />
        </aside>

        {/* Listing Grid - Center */}
        <div className="flex-1 min-w-0">
          <PropertyGrid />
        </div>

        {/* Map Placeholder - Right */}
        <aside className="hidden xl:block w-[400px] 2xl:w-[500px] shrink-0 h-[calc(100vh-80px)] sticky top-20">
          <MapPlaceholder />
        </aside>
      </div>
    </div>
  )
}
