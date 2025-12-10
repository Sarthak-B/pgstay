"use client"

import { useState } from "react"
import {
  Star,
  MapPin,
  Wifi,
  Wind,
  UtensilsCrossed,
  ShieldCheck,
  Cctv,
  Zap,
  Car,
  Dumbbell,
  Clock,
  Ban,
  Users,
  Phone,
  MessageCircle,
  ChevronLeft,
  Heart,
  Share2,
  X,
  Calendar,
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

// Mock data for properties
const propertiesData: Record<string, PropertyData> = {
  "1": {
    id: 1,
    title: "Sunrise PG for Boys",
    address: "123 College Road, Near IIT Gate, Delhi",
    rating: 4.5,
    reviewCount: 128,
    price: 8000,
    deposit: 16000,
    images: [
      "/modern-boys-pg-room-with-study-area.jpg",
      "/cozy-boys-hostel-single-room.jpg",
      "/spacious-unisex-pg-common-area.jpg",
      "/luxury-student-accommodation-with-amenities.jpg",
      "/budget-friendly-shared-pg-room.jpg",
    ],
    description:
      "Welcome to Sunrise PG, your perfect home away from campus! Our fully furnished rooms come with modern amenities designed specifically for students. Located just 500 meters from the IIT main gate, you'll have easy access to your classes while enjoying a peaceful living environment. Our friendly staff ensures 24/7 security and cleanliness.",
    amenities: ["WiFi", "AC", "Food", "Laundry", "CCTV", "Power Backup", "Parking", "Gym"],
    houseRules: [
      "No smoking inside the premises",
      "Gate closes at 10 PM (late entry with prior notice)",
      "Visitors allowed only in common areas",
      "Keep noise levels low after 9 PM",
      "Weekly room inspection for hygiene",
    ],
    genderTag: "Boys Only" as const,
    roomTypes: ["Single", "Double Sharing", "Triple Sharing"],
    ownerName: "Rajesh Kumar",
    ownerPhone: "+91 98765 43210",
    isVerified: true,
    distance: "0.5km",
  },
  "2": {
    id: 2,
    title: "Rose Girls Hostel",
    address: "45 University Avenue, Sector 15, Noida",
    rating: 4.8,
    reviewCount: 256,
    price: 9500,
    deposit: 19000,
    images: [
      "/premium-girls-hostel-room-with-balcony.jpg",
      "/cozy-girls-hostel-room-pink-theme.jpg",
      "/spacious-unisex-pg-common-area.jpg",
      "/luxury-student-accommodation-with-amenities.jpg",
      "/modern-student-pg-room-with-bed-and-desk.jpg",
    ],
    description:
      "Rose Girls Hostel offers premium accommodation for female students seeking a safe, comfortable, and homely environment. Our property features spacious rooms with attached bathrooms, a beautiful rooftop garden, and excellent home-cooked meals. With female wardens available 24/7 and top-notch security systems, parents can rest assured about their daughter's safety.",
    amenities: ["WiFi", "AC", "Food", "Laundry", "CCTV", "Power Backup"],
    houseRules: [
      "Entry gate closes at 9 PM",
      "Male visitors not allowed beyond reception",
      "Quiet hours from 10 PM to 7 AM",
      "No cooking appliances in rooms",
      "Mandatory biometric attendance",
    ],
    genderTag: "Girls Only" as const,
    roomTypes: ["Single", "Double Sharing"],
    ownerName: "Priya Sharma",
    ownerPhone: "+91 87654 32109",
    isVerified: true,
    distance: "1.2km",
  },
}

// Default property for any ID not in our mock data
const defaultProperty: PropertyData = {
  id: 0,
  title: "Premium Student PG",
  address: "Near College Campus, Delhi NCR",
  rating: 4.3,
  reviewCount: 89,
  price: 7500,
  deposit: 15000,
  images: [
    "/modern-student-pg-room-with-bed-and-desk.jpg",
    "/spacious-unisex-pg-common-area.jpg",
    "/budget-friendly-shared-pg-room.jpg",
    "/luxury-student-accommodation-with-amenities.jpg",
    "/cozy-boys-hostel-single-room.jpg",
  ],
  description:
    "A comfortable and affordable PG accommodation for students. Located conveniently near major colleges with all essential amenities for a hassle-free stay.",
  amenities: ["WiFi", "AC", "Food", "Laundry", "CCTV", "Power Backup"],
  houseRules: [
    "No smoking on premises",
    "Gate closes at 10:30 PM",
    "Visitors allowed till 8 PM",
    "Maintain cleanliness in common areas",
  ],
  genderTag: "Unisex" as const,
  roomTypes: ["Double Sharing", "Triple Sharing"],
  ownerName: "Property Manager",
  ownerPhone: "+91 99999 88888",
  isVerified: false,
  distance: "0.8km",
}

interface PropertyData {
  id: number
  title: string
  address: string
  rating: number
  reviewCount: number
  price: number
  deposit: number
  images: string[]
  description: string
  amenities: string[]
  houseRules: string[]
  genderTag: "Boys Only" | "Girls Only" | "Unisex"
  roomTypes: string[]
  ownerName: string
  ownerPhone: string
  isVerified: boolean
  distance: string
}

interface PropertyDetailsContentProps {
  propertyId: string
}

export default function PropertyDetailsContent({ propertyId }: PropertyDetailsContentProps) {
  const property = propertiesData[propertyId] || defaultProperty
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [showBookVisitModal, setShowBookVisitModal] = useState(false)
  const [visitDate, setVisitDate] = useState("")
  const [visitTime, setVisitTime] = useState("")

  const handleWishlistClick = () => {
    setIsWishlisted(!isWishlisted)
    if (!isWishlisted) {
      toast.success("Saved to your Wishlist!", {
        description: `${property.title} has been added to your favorites.`,
      })
    } else {
      toast.info("Removed from Wishlist", {
        description: `${property.title} has been removed from your favorites.`,
      })
    }
  }

  const handleShareClick = () => {
    toast.success("Link copied!", {
      description: "Property link has been copied to clipboard.",
    })
  }

  const handleChatWithOwner = () => {
    toast.info("Opening chat window...", {
      description: `Connecting you with ${property.ownerName}`,
    })
  }

  const handleBookVisitSubmit = () => {
    if (!visitDate || !visitTime) {
      toast.error("Please select date and time")
      return
    }
    setShowBookVisitModal(false)
    toast.success("Visit Scheduled!", {
      description: `Your visit is booked for ${visitDate} at ${visitTime}`,
    })
    setVisitDate("")
    setVisitTime("")
  }

  const getAmenityIcon = (amenity: string) => {
    const iconClass = "w-5 h-5"
    switch (amenity.toLowerCase()) {
      case "wifi":
        return <Wifi className={iconClass} />
      case "ac":
        return <Wind className={iconClass} />
      case "food":
        return <UtensilsCrossed className={iconClass} />
      case "laundry":
        return <UtensilsCrossed className={iconClass} />
      case "cctv":
        return <Cctv className={iconClass} />
      case "power backup":
        return <Zap className={iconClass} />
      case "parking":
        return <Car className={iconClass} />
      case "gym":
        return <Dumbbell className={iconClass} />
      default:
        return <ShieldCheck className={iconClass} />
    }
  }

  const getGenderTagColor = () => {
    switch (property.genderTag) {
      case "Boys Only":
        return "bg-blue-100 text-blue-700"
      case "Girls Only":
        return "bg-pink-100 text-pink-700"
      default:
        return "bg-purple-100 text-purple-700"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="font-medium">Back to Search</span>
            </Link>
            <div className="flex items-center gap-3">
              <button
                onClick={handleShareClick}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                aria-label="Share property"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={handleWishlistClick}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={`w-5 h-5 transition-colors ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{property.title}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getGenderTagColor()}`}>
              {property.genderTag}
            </span>
            {property.isVerified && (
              <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                <ShieldCheck className="w-4 h-4" />
                Verified
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{property.address}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="font-semibold text-foreground">{property.rating}</span>
              <span>({property.reviewCount} reviews)</span>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Main Image */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden group">
              <img
                src={property.images[selectedImage] || "/placeholder.svg"}
                alt={property.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            {/* Thumbnail Grid */}
            <div className="grid grid-cols-2 gap-4">
              {property.images.slice(1, 5).map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index + 1)}
                  className={`relative aspect-[4/3] rounded-xl overflow-hidden group ${
                    selectedImage === index + 1 ? "ring-2 ring-primary ring-offset-2" : ""
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${property.title} view ${index + 2}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {index === 3 && property.images.length > 5 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-semibold">+{property.images.length - 5} more</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content - 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - 70% */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4">About this PG</h2>
              <p className="text-muted-foreground leading-relaxed">{property.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {property.roomTypes.map((type) => (
                  <span key={type} className="px-4 py-2 bg-secondary rounded-full text-sm font-medium text-foreground">
                    {type} available
                  </span>
                ))}
              </div>
            </section>

            {/* Amenities */}
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {property.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-foreground">
                      {getAmenityIcon(amenity)}
                    </div>
                    <span className="font-medium text-foreground">{amenity}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* House Rules */}
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4">House Rules</h2>
              <div className="bg-accent rounded-2xl p-6">
                <ul className="space-y-3">
                  {property.houseRules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        {rule.toLowerCase().includes("no") || rule.toLowerCase().includes("not") ? (
                          <Ban className="w-3.5 h-3.5 text-primary-foreground" />
                        ) : rule.toLowerCase().includes("gate") || rule.toLowerCase().includes("pm") ? (
                          <Clock className="w-3.5 h-3.5 text-primary-foreground" />
                        ) : (
                          <Users className="w-3.5 h-3.5 text-primary-foreground" />
                        )}
                      </div>
                      <span className="text-foreground">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Location Map Placeholder */}
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4">Location</h2>
              <div className="relative bg-secondary rounded-2xl overflow-hidden aspect-[16/9]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground font-medium">Map View</p>
                    <p className="text-sm text-muted-foreground">{property.distance} from campus</p>
                  </div>
                </div>
                <button className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors">
                  View on Google Maps
                </button>
              </div>
            </section>
          </div>

          {/* Right Column - Sticky Booking Card - 30% */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-card rounded-2xl shadow-lg border border-border p-6">
                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-3xl font-bold text-foreground">₹{property.price.toLocaleString()}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Security Deposit: ₹{property.deposit.toLocaleString()} (Refundable)
                  </p>
                </div>

                {/* Owner Info */}
                <div className="flex items-center gap-4 p-4 bg-secondary rounded-xl mb-6">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg">
                    {property.ownerName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{property.ownerName}</p>
                    <p className="text-sm text-muted-foreground">Property Owner</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={() => setShowBookVisitModal(true)}
                    className="w-full h-12 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-5 h-5" />
                    Book a Visit
                  </Button>
                  <Button
                    onClick={handleChatWithOwner}
                    variant="outline"
                    className="w-full h-12 rounded-full font-semibold flex items-center justify-center gap-2 bg-transparent"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Chat with Owner
                  </Button>
                  <a
                    href={`tel:${property.ownerPhone}`}
                    className="w-full h-12 border border-border rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-secondary transition-colors text-foreground"
                  >
                    <Phone className="w-5 h-5" />
                    Call Now
                  </a>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                    <span>Verified by PGStay</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Book Visit Modal */}
      {showBookVisitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowBookVisitModal(false)} />
          <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowBookVisitModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-bold text-foreground mb-2">Schedule a Visit</h3>
            <p className="text-muted-foreground mb-6">Choose your preferred date and time to visit {property.title}</p>

            <div className="space-y-4">
              <div>
                <label htmlFor="visitDate" className="block text-sm font-medium text-foreground mb-2">
                  Preferred Date
                </label>
                <input
                  type="date"
                  id="visitDate"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-3 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                />
              </div>

              <div>
                <label htmlFor="visitTime" className="block text-sm font-medium text-foreground mb-2">
                  Preferred Time
                </label>
                <select
                  id="visitTime"
                  value={visitTime}
                  onChange={(e) => setVisitTime(e.target.value)}
                  className="w-full px-4 py-3 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground appearance-none cursor-pointer"
                >
                  <option value="">Select a time slot</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="2:00 PM">2:00 PM</option>
                  <option value="3:00 PM">3:00 PM</option>
                  <option value="4:00 PM">4:00 PM</option>
                  <option value="5:00 PM">5:00 PM</option>
                </select>
              </div>

              <Button
                onClick={handleBookVisitSubmit}
                className="w-full h-12 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-colors mt-2"
              >
                Confirm Visit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
