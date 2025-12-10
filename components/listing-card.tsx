"use client"

import type React from "react"

import { useState } from "react"
import { Wifi, Wind, MapPin, Heart } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface ListingCardProps {
  id?: number
  image: string
  title: string
  price: number
  distance: string
  amenities: string[]
  rating: number
}

export default function ListingCard({ id = 1, image, title, price, distance, amenities, rating }: ListingCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
    if (!isWishlisted) {
      toast.success("Saved to your Wishlist!", {
        description: `${title} has been added to your favorites.`,
      })
    } else {
      toast.info("Removed from Wishlist", {
        description: `${title} has been removed from your favorites.`,
      })
    }
  }

  return (
    <Link href={`/property/${id}`}>
      <div className="min-w-[280px] sm:min-w-[320px] bg-card rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <button
            onClick={handleWishlistToggle}
            className="absolute top-4 right-4 w-10 h-10 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-card transition-colors"
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={`w-5 h-5 transition-colors ${isWishlisted ? "fill-red-500 text-red-500" : "text-foreground"}`}
            />
          </button>
          {/* Rating Badge */}
          <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
            <span className="text-yellow-500">★</span>
            <span className="text-sm font-medium text-foreground">{rating}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h3 className="font-semibold text-foreground text-lg line-clamp-1">{title}</h3>
            <p className="text-primary font-bold whitespace-nowrap">
              ₹{price.toLocaleString()}
              <span className="text-sm font-normal text-muted-foreground">/mo</span>
            </p>
          </div>

          {/* Distance */}
          <div className="flex items-center gap-1 text-muted-foreground text-sm mb-4">
            <MapPin className="w-4 h-4" />
            <span>Distance: {distance}</span>
          </div>

          {/* Amenities */}
          <div className="flex items-center gap-2 flex-wrap">
            {amenities.map((amenity) => (
              <span
                key={amenity}
                className="inline-flex items-center gap-1 px-3 py-1 bg-secondary rounded-full text-xs font-medium text-foreground"
              >
                {amenity === "Wifi" && <Wifi className="w-3 h-3" />}
                {amenity === "AC" && <Wind className="w-3 h-3" />}
                {amenity}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}
