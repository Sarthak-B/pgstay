"use client"

import { MapPin, Search, ZoomIn, ZoomOut, Locate } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MapPlaceholder() {
  return (
    <div className="relative h-full w-full bg-secondary">
      {/* Map Background Placeholder */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url('/city-map-with-streets-and-landmarks.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Map Overlay for better visibility */}
        <div className="absolute inset-0 bg-secondary/30" />
      </div>

      {/* Map Markers */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Marker 1 */}
        <div className="absolute top-[25%] left-[30%] pointer-events-auto">
          <div className="relative group cursor-pointer">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <span className="text-primary-foreground text-sm font-bold">₹8K</span>
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-primary" />
          </div>
        </div>

        {/* Marker 2 */}
        <div className="absolute top-[40%] left-[55%] pointer-events-auto">
          <div className="relative group cursor-pointer">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <span className="text-primary-foreground text-sm font-bold">₹7K</span>
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-primary" />
          </div>
        </div>

        {/* Marker 3 */}
        <div className="absolute top-[60%] left-[40%] pointer-events-auto">
          <div className="relative group cursor-pointer">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <span className="text-primary-foreground text-sm font-bold">₹10K</span>
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-primary" />
          </div>
        </div>

        {/* Marker 4 */}
        <div className="absolute top-[35%] left-[70%] pointer-events-auto">
          <div className="relative group cursor-pointer">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <span className="text-primary-foreground text-sm font-bold">₹6K</span>
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-primary" />
          </div>
        </div>

        {/* College Marker */}
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
          <div className="relative group cursor-pointer">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg border-4 border-card">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-card px-2 py-1 rounded text-xs font-medium shadow whitespace-nowrap">
              Your College
            </div>
          </div>
        </div>
      </div>

      {/* Search in Area Button */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
        <Button className="rounded-full bg-card text-foreground shadow-lg hover:bg-card/90 border border-border px-6">
          <Search className="w-4 h-4 mr-2" />
          Search in this area
        </Button>
      </div>

      {/* Map Controls */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10">
        <button className="w-10 h-10 bg-card rounded-lg shadow-lg flex items-center justify-center hover:bg-secondary transition-colors border border-border">
          <ZoomIn className="w-5 h-5 text-foreground" />
        </button>
        <button className="w-10 h-10 bg-card rounded-lg shadow-lg flex items-center justify-center hover:bg-secondary transition-colors border border-border">
          <ZoomOut className="w-5 h-5 text-foreground" />
        </button>
        <button className="w-10 h-10 bg-card rounded-lg shadow-lg flex items-center justify-center hover:bg-secondary transition-colors border border-border mt-2">
          <Locate className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-card rounded-xl shadow-lg p-3 z-10 border border-border">
        <p className="text-xs font-semibold text-foreground mb-2">Legend</p>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary rounded-full" />
            <span className="text-xs text-muted-foreground">PG Location</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-600 rounded-full" />
            <span className="text-xs text-muted-foreground">Your College</span>
          </div>
        </div>
      </div>

      {/* Attribution */}
      <div className="absolute bottom-4 right-4 text-xs text-muted-foreground bg-card/80 px-2 py-1 rounded">
        Map data placeholder
      </div>
    </div>
  )
}
