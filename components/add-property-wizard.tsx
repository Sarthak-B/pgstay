"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-context" 
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  Check, Upload, Building2, Camera, ShieldCheck, ChevronRight, ChevronLeft,
  Wifi, Wind, UtensilsCrossed, WashingMachine, Zap, Cctv, Loader2, X, Home
} from "lucide-react"

// --- FIREBASE IMPORTS ---
import { collection, addDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

// --- CLOUDINARY CONFIGURATION ---
// 1. Go to cloudinary.com -> Settings -> Upload -> Add upload preset -> Signing Mode: "Unsigned"
const CLOUD_NAME = "dl1gryspq"; // <--- Cloud name
const UPLOAD_PRESET = "pgstay-data"; // <--- Preset name

const steps = [
  { id: 1, name: "Property Details", icon: Building2 },
  { id: 2, name: "Photos & Media", icon: Camera },
  { id: 3, name: "Owner Verification", icon: ShieldCheck },
]

const facilitiesList = [
  { id: "wifi", label: "WiFi", icon: Wifi },
  { id: "ac", label: "AC", icon: Wind },
  { id: "food", label: "Food", icon: UtensilsCrossed },
  { id: "laundry", label: "Laundry", icon: WashingMachine },
  { id: "power", label: "Power Backup", icon: Zap },
  { id: "cctv", label: "CCTV", icon: Cctv },
]

export default function AddPropertyWizard() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    propertyName: "",
    address: "",
    description: "",
    type: "",
    gender: "",
    rent: "",
    deposit: "",
    rules: "",
    ownerId: ""
  })
  
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([]) // Stores the actual files
  const [imagePreviews, setImagePreviews] = useState<string[]>([]) // Stores preview URLs

  // --- HANDLERS ---

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFacilityToggle = (facilityId: string) => {
    setSelectedFacilities(prev =>
      prev.includes(facilityId) ? prev.filter(id => id !== facilityId) : [...prev, facilityId]
    )
  }

  // Real File Selection Handler
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      
      // Limit to 5 files for now to be safe
      if (imageFiles.length + newFiles.length > 5) {
        toast({ title: "Limit Reached", description: "You can only upload up to 5 photos.", variant: "destructive" })
        return
      }

      setImageFiles(prev => [...prev, ...newFiles])
      
      // Create local preview URLs immediately so user can see what they picked
      const newPreviews = newFiles.map(file => URL.createObjectURL(file))
      setImagePreviews(prev => [...prev, ...newPreviews])
    }
  }

  const removePhoto = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleNext = () => {
    // Basic validation
    if (currentStep === 1) {
      if (!formData.propertyName || !formData.address || !formData.rent) {
        toast({ title: "Missing Info", description: "Please fill in Property Name, Address, and Rent.", variant: "destructive" })
        return
      }
    }
    if (currentStep < 4) setCurrentStep(currentStep + 1)
  }

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  // --- SUBMISSION LOGIC ---
  const handleSubmit = async () => {
    if (!user) return toast({ title: "Error", description: "You must be logged in.", variant: "destructive" })
    
    if (imageFiles.length === 0) return toast({ title: "No Photos", description: "Please upload at least one photo.", variant: "destructive" })

    setLoading(true)
    setUploading(true)

    try {
      // 1. Upload Images to Cloudinary
      // We map over the files and upload them one by one
      const uploadPromises = imageFiles.map(async (file) => {
        const data = new FormData()
        data.append("file", file)
        data.append("upload_preset", UPLOAD_PRESET) 

        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
          method: "POST",
          body: data
        })

        if (!res.ok) throw new Error("Failed to upload image")
        const json = await res.json()
        return json.secure_url // This is the permanent URL from Cloudinary
      })

      const imageUrls = await Promise.all(uploadPromises)

      // 2. Save Property Data to Firestore
      await addDoc(collection(db, "properties"), {
        ownerId: user.uid,
        ownerName: user.name,
        ownerEmail: user.email,
        title: formData.propertyName,
        address: formData.address,
        description: formData.description,
        type: formData.type || "pg",
        genderTag: formData.gender || "unisex",
        price: Number(formData.rent),
        deposit: Number(formData.deposit),
        rules: formData.rules,
        facilities: selectedFacilities,
        images: imageUrls, // Saving the real Cloudinary URLs
        verificationId: formData.ownerId,
        isVerified: false,
        createdAt: new Date().toISOString()
      })

      toast({ title: "Success!", description: "Your property has been listed." })
      setCurrentStep(4) // Move to success screen

    } catch (error: any) {
      console.error("Submission Error:", error)
      toast({ title: "Error", description: "Something went wrong. Please check your connection.", variant: "destructive" })
    } finally {
      setLoading(false)
      setUploading(false)
    }
  }

  // --- RENDER ---
  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Progress Bar */}
      {currentStep < 4 && (
        <div className="mb-10">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${currentStep >= step.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                    {currentStep > step.id ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                  </div>
                  <span className={`mt-2 text-xs font-medium text-center ${currentStep >= step.id ? "text-foreground" : "text-muted-foreground"}`}>
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && <div className={`flex-1 h-1 mx-4 rounded-full transition-all ${currentStep > step.id ? "bg-primary" : "bg-muted"}`} />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step Content */}
      <div className="bg-card rounded-2xl shadow-lg p-8 border border-border">
        
        {/* STEP 1: DETAILS */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Property Details</h2>
              <p className="text-muted-foreground">Tell us about your property</p>
            </div>

            <div className="grid gap-6">
              <div className="space-y-2">
                <Label>Property Name</Label>
                <Input placeholder="e.g., Greenwood Stay" value={formData.propertyName} onChange={(e) => handleInputChange("propertyName", e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Complete Address</Label>
                <Input placeholder="Street address, Area, City, PIN" value={formData.address} onChange={(e) => handleInputChange("address", e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea placeholder="Describe your property..." rows={3} value={formData.description} onChange={(e) => handleInputChange("description", e.target.value)} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Property Type</Label>
                  <Select onValueChange={(val) => handleInputChange("type", val)}>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
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
                  <Select onValueChange={(val) => handleInputChange("gender", val)}>
                    <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
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
                  <Label>Monthly Rent (₹)</Label>
                  <Input type="number" placeholder="8000" value={formData.rent} onChange={(e) => handleInputChange("rent", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Security Deposit (₹)</Label>
                  <Input type="number" placeholder="16000" value={formData.deposit} onChange={(e) => handleInputChange("deposit", e.target.value)} />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Facilities Available</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {facilitiesList.map((facility) => (
                    <div key={facility.id} onClick={() => handleFacilityToggle(facility.id)} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${selectedFacilities.includes(facility.id) ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/50"}`}>
                      <Checkbox checked={selectedFacilities.includes(facility.id)} className="pointer-events-none" />
                      <facility.icon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{facility.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={handleNext} className="rounded-full px-6">Next: Upload Photos <ChevronRight className="w-4 h-4 ml-2" /></Button>
            </div>
          </div>
        )}

        {/* STEP 2: PHOTOS */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Photos & Media</h2>
              <p className="text-muted-foreground">Upload real images of your property</p>
            </div>

            {/* Drag & Drop Area */}
            <div className="border-2 border-dashed border-border rounded-2xl p-12 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all relative">
              <input 
                type="file" 
                multiple 
                accept="image/*"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Click to select photos</h3>
              <p className="text-muted-foreground text-sm mb-4">JPG, PNG (Max 5MB each)</p>
            </div>

            {/* Preview Grid */}
            {imagePreviews.length > 0 && (
              <div className="space-y-3">
                <Label>Selected Photos ({imagePreviews.length})</Label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {imagePreviews.map((src, index) => (
                    <div key={index} className="aspect-video bg-muted rounded-xl overflow-hidden relative group">
                      <img src={src} alt="Preview" className="w-full h-full object-cover" />
                      <button onClick={() => removePhoto(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handleBack} className="rounded-full px-6">Back</Button>
              <Button onClick={handleNext} className="rounded-full px-6">Next: Verify Ownership <ChevronRight className="w-4 h-4 ml-2" /></Button>
            </div>
          </div>
        )}

        {/* STEP 3: VERIFICATION */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Owner Verification</h2>
              <p className="text-muted-foreground">Verify your identity to build trust</p>
            </div>

            <div className="space-y-2">
              <Label>Government ID Number (Aadhaar/PAN)</Label>
              <Input placeholder="Enter your ID number" value={formData.ownerId} onChange={(e) => handleInputChange("ownerId", e.target.value)} />
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handleBack} className="rounded-full px-6">Back</Button>
              {/* SUBMIT BUTTON */}
              <Button onClick={handleSubmit} disabled={loading} className="rounded-full px-8">
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {uploading ? "Uploading..." : "Submitting..."}</> : "Submit Listing"}
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: SUCCESS */}
        {currentStep === 4 && (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">Listing Submitted Successfully!</h2>
            <p className="text-muted-foreground mb-8">
              Your property has been saved to the database and images uploaded.
            </p>
            <div className="flex justify-center gap-4">
              <Button className="rounded-full px-8" onClick={() => router.push("/owner/dashboard")}>
                Go to My Dashboard
              </Button>
              <Button variant="outline" className="rounded-full px-8" onClick={() => router.push("/")}>
                Go Home
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
