"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Check,
  Upload,
  Building2,
  Camera,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Wifi,
  Wind,
  UtensilsCrossed,
  WashingMachine,
  Zap,
  Cctv,
  FileCheck,
  Home,
} from "lucide-react"

const steps = [
  { id: 1, name: "Property Details", icon: Building2 },
  { id: 2, name: "Photos & Media", icon: Camera },
  { id: 3, name: "Owner Verification", icon: ShieldCheck },
]

const facilities = [
  { id: "wifi", label: "WiFi", icon: Wifi },
  { id: "ac", label: "AC", icon: Wind },
  { id: "food", label: "Food", icon: UtensilsCrossed },
  { id: "laundry", label: "Laundry", icon: WashingMachine },
  { id: "power", label: "Power Backup", icon: Zap },
  { id: "cctv", label: "CCTV", icon: Cctv },
]

export default function AddPropertyWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [propertyName, setPropertyName] = useState("")
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([])
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([])

  const handleFacilityToggle = (facilityId: string) => {
    setSelectedFacilities((prev) =>
      prev.includes(facilityId) ? prev.filter((id) => id !== facilityId) : [...prev, facilityId],
    )
  }

  const handlePhotoUpload = () => {
    // Simulated photo upload
    setUploadedPhotos((prev) => [...prev, `/placeholder.svg?height=150&width=200&query=room photo ${prev.length + 1}`])
  }

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    // Simulated submission
    setCurrentStep(4)
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Progress Bar */}
      {currentStep < 4 && (
        <div className="mb-10">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      currentStep >= step.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {currentStep > step.id ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium text-center ${
                      currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 rounded-full transition-all ${
                      currentStep > step.id ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step Content */}
      <div className="bg-card rounded-2xl shadow-lg p-8">
        {/* Step 1: Property Details */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Property Details</h2>
              <p className="text-muted-foreground">Tell us about your property</p>
            </div>

            <div className="grid gap-6">
              <div className="space-y-2">
                <Label htmlFor="propertyName">Property Name</Label>
                <Input
                  id="propertyName"
                  placeholder="e.g., Greenwood Stay"
                  value={propertyName}
                  onChange={(e) => setPropertyName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Complete Address</Label>
                <Input id="address" placeholder="Street address, Area, City, PIN" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your property, nearby landmarks, and what makes it special..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Property Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="independent">Independent House</SelectItem>
                      <SelectItem value="hostel">Hostel</SelectItem>
                      <SelectItem value="pg">PG Accommodation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Gender Restriction</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="boys">Boys Only</SelectItem>
                      <SelectItem value="girls">Girls Only</SelectItem>
                      <SelectItem value="unisex">Unisex</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rent">Monthly Rent (₹)</Label>
                  <Input id="rent" type="number" placeholder="8000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deposit">Security Deposit (₹)</Label>
                  <Input id="deposit" type="number" placeholder="16000" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rules">House Rules</Label>
                <Textarea id="rules" placeholder="e.g., No smoking, Visitors allowed till 9 PM, etc." rows={2} />
              </div>

              {/* Facilities Grid */}
              <div className="space-y-3">
                <Label>Facilities Available</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {facilities.map((facility) => (
                    <div
                      key={facility.id}
                      onClick={() => handleFacilityToggle(facility.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedFacilities.includes(facility.id)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-muted-foreground/50"
                      }`}
                    >
                      <Checkbox checked={selectedFacilities.includes(facility.id)} className="pointer-events-none" />
                      <facility.icon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{facility.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={handleNext} className="rounded-full px-6">
                Next: Upload Photos
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Photos & Media */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Photos & Media</h2>
              <p className="text-muted-foreground">Upload images to showcase your property</p>
            </div>

            {/* Main Upload Dropzone */}
            <div
              onClick={handlePhotoUpload}
              className="border-2 border-dashed border-border rounded-2xl p-12 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
            >
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Drag & drop room photos here</h3>
              <p className="text-muted-foreground text-sm mb-4">or click to browse from your device</p>
              <p className="text-xs text-muted-foreground">Supports: JPG, PNG, WEBP (Max 5MB each)</p>
            </div>

            {/* Uploaded Photos Preview */}
            {uploadedPhotos.length > 0 && (
              <div className="space-y-3">
                <Label>Uploaded Photos ({uploadedPhotos.length})</Label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {uploadedPhotos.map((photo, index) => (
                    <div key={index} className="aspect-video bg-muted rounded-xl overflow-hidden relative group">
                      <img
                        src={photo || "/placeholder.svg"}
                        alt={`Room photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs">Photo {index + 1}</span>
                      </div>
                    </div>
                  ))}
                  <div
                    onClick={handlePhotoUpload}
                    className="aspect-video border-2 border-dashed border-border rounded-xl flex items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
                  >
                    <Upload className="w-6 h-6 text-muted-foreground" />
                  </div>
                </div>
              </div>
            )}

            {/* 360 View URL */}
            <div className="space-y-2">
              <Label htmlFor="view360">360° View URL (Optional)</Label>
              <Input id="view360" placeholder="https://your360view.com/tour/..." />
              <p className="text-xs text-muted-foreground">
                Add a link to a virtual tour from platforms like Matterport or Kuula
              </p>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handleBack} className="rounded-full px-6 bg-transparent">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button onClick={handleNext} className="rounded-full px-6">
                Next: Verify Ownership
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Owner Verification */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Owner Verification</h2>
              <p className="text-muted-foreground">Verify your identity to build trust with students</p>
            </div>

            <div className="bg-accent/50 rounded-xl p-4 flex gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-1">Why we verify owners</h4>
                <p className="text-sm text-muted-foreground">
                  To prevent fraud and protect students, we verify all property owners before their listings go live.
                  Your documents are encrypted and secure.
                </p>
              </div>
            </div>

            {/* Document Upload */}
            <div className="space-y-3">
              <Label>Upload Proof of Ownership</Label>
              <p className="text-sm text-muted-foreground">
                Please upload one of the following: Electricity Bill, Rent Agreement, or Property Tax Receipt
              </p>
              <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileCheck className="w-6 h-6 text-muted-foreground" />
                </div>
                <h4 className="font-medium text-foreground mb-1">Click to upload document</h4>
                <p className="text-xs text-muted-foreground">PDF, JPG, or PNG (Max 10MB)</p>
              </div>
            </div>

            {/* Owner ID */}
            <div className="space-y-2">
              <Label htmlFor="ownerId">Government ID Number (Aadhaar/PAN)</Label>
              <Input id="ownerId" placeholder="Enter your ID number" />
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handleBack} className="rounded-full px-6 bg-transparent">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button onClick={handleSubmit} className="rounded-full px-8">
                Submit Listing
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Success State */}
        {currentStep === 4 && (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">Listing Submitted Successfully!</h2>
            <p className="text-muted-foreground mb-2 max-w-md mx-auto">
              Your listing <span className="font-semibold text-foreground">"{propertyName || "Greenwood Stay"}"</span>{" "}
              has been submitted for review.
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              Our admin team will verify it within 24 hours. You'll receive an email once it's live.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button className="rounded-full px-8" asChild>
                <a href="/owner/dashboard">
                  <Home className="w-4 h-4 mr-2" />
                  Go to Dashboard
                </a>
              </Button>
              <Button variant="outline" className="rounded-full px-8 bg-transparent" asChild>
                <a href="/">Back to Home</a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
