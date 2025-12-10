"use client"

import type React from "react"

import { useState } from "react"
import { Heart, MapPin, Wifi, Wind, UtensilsCrossed, Star, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface PropertyCardProps {
  id: number
  image: string
  title: string
  price: number
  distance: string
  amenities: string[]
  rating: number
  genderTag: "Unisex" | "Boys Only" | "Girls Only"
  isVerified?: boolean
}

export default function PropertyCard({
  id,
  image,
  title,
  price,
  distance,
  amenities,
  rating,
  genderTag,
  isVerified = false,
}: PropertyCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)

  const handleWishlistClick = (e: React.MouseEvent) => {
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

  const getGenderTagColor = () => {
    switch (genderTag) {
      case "Boys Only":
        return "bg-blue-100 text-blue-700"
      case "Girls Only":
        return "bg-pink-100 text-pink-700"
      default:
        return "bg-purple-100 text-purple-700"
    }
  }

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "wifi":
        return <Wifi className="w-3 h-3" />
      case "ac":
        return <Wind className="w-3 h-3" />
      case "food":
        return <UtensilsCrossed className="w-3 h-3" />
      default:
        return null
    }
  }

  return (
    <Link href={`/property/${id}`}>
      <article className="bg-card rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistClick}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className="absolute top-3 right-3 w-9 h-9 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-card transition-colors shadow-sm"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${isWishlisted ? "fill-red-500 text-red-500" : "text-foreground"}`}
            />
          </button>

          {/* Gender Tag */}
          <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${getGenderTagColor()}`}>
            {genderTag}
          </span>

          {/* Verified Badge */}
          {isVerified && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              <ShieldCheck className="w-3 h-3" />
              Verified
            </div>
          )}

          {/* Rating Badge */}
          <div className="absolute bottom-3 right-3 bg-card/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-semibold text-foreground">{rating}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="font-semibold text-foreground text-base line-clamp-1 flex-1">{title}</h3>
            <p className="text-primary font-bold whitespace-nowrap">
              ₹{price.toLocaleString()}
              <span className="text-xs font-normal text-muted-foreground">/mo</span>
            </p>
          </div>

          {/* Distance */}
          <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
            <MapPin className="w-4 h-4" />
            <span>{distance} from campus</span>
          </div>

          {/* Amenities */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {amenities.slice(0, 4).map((amenity) => (
              <span
                key={amenity}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-secondary rounded-full text-xs font-medium text-foreground"
              >
                {getAmenityIcon(amenity)}
                {amenity}
              </span>
            ))}
          </div>
        </div>
      </article>
    </Link>
  )
}
