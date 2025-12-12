"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/components/auth-context"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { 
  Plus, 
  Home, 
  BarChart3, 
  Trash2, 
  ExternalLink, 
  MapPin, 
  Loader2,
  AlertCircle 
} from "lucide-react"

// Firebase
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface Property {
  id: string
  title: string
  address: string
  price: number
  type: string
  images: string[]
  isVerified: boolean
  views?: number
}

export default function OwnerDashboard() {
  const { user, isLoggedIn } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // --- 1. Fetch Owner's Properties ---
  useEffect(() => {
    const fetchProperties = async () => {
      if (!user) return

      try {
        const q = query(collection(db, "properties"), where("ownerId", "==", user.uid))
        const querySnapshot = await getDocs(q)
        
        const fetchedProps = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Property[]
        
        setProperties(fetchedProps)
      } catch (error) {
        console.error("Error fetching properties:", error)
        toast({ title: "Error", description: "Failed to load your properties.", variant: "destructive" })
      } finally {
        setLoading(false)
      }
    }

    if (isLoggedIn) {
      if (user?.role !== 'owner' && user?.role !== undefined) {
        // Optional: Redirect students away from owner dashboard
        // router.push("/") 
      }
      fetchProperties()
    } else if (!loading && !isLoggedIn) {
      // Redirect if not logged in
      router.push("/")
    }
  }, [user, isLoggedIn, loading, router, toast])

  // --- 2. Handle Delete Property ---
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property? This cannot be undone.")) return

    setDeletingId(id)
    try {
      await deleteDoc(doc(db, "properties", id))
      setProperties(prev => prev.filter(p => p.id !== id))
      toast({ title: "Property Deleted", description: "Your listing has been removed." })
    } catch (error) {
      toast({ title: "Error", description: "Could not delete property.", variant: "destructive" })
    } finally {
      setDeletingId(null)
    }
  }

  // --- 3. Loading State ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Owner Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your listings and track performance.</p>
          </div>
          <Link href="/owner/onboarding">
            <Button className="rounded-full shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4 mr-2" /> List New Property
            </Button>
          </Link>
        </div>

        {/* --- Stats Overview --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{properties.length}</div>
              <p className="text-xs text-muted-foreground">Active properties</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Across all listings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verification Status</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {properties.filter(p => p.isVerified).length} / {properties.length}
              </div>
              <p className="text-xs text-muted-foreground">Listings verified</p>
            </CardContent>
          </Card>
        </div>

        {/* --- Property Grid --- */}
        <h2 className="text-xl font-semibold mb-6">Your Properties</h2>
        
        {properties.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-border rounded-xl bg-card">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <Home className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No properties listed yet</h3>
            <p className="text-muted-foreground mb-6">Start earning by listing your first property today.</p>
            <Link href="/owner/onboarding">
              <Button>List Your First Property</Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Card key={property.id} className="overflow-hidden hover:shadow-md transition-shadow group">
                {/* Image Section */}
                <div className="relative h-48 bg-muted">
                  <Image 
                    src={property.images?.[0] || "/placeholder.svg"} 
                    alt={property.title} 
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute top-2 right-2">
                    {property.isVerified ? (
                      <Badge className="bg-green-500 hover:bg-green-600">Verified</Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pending</Badge>
                    )}
                  </div>
                </div>

                {/* Content Section */}
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg line-clamp-1">{property.title}</CardTitle>
                    <span className="font-bold text-primary">₹{property.price}</span>
                  </div>
                  <CardDescription className="flex items-center gap-1 line-clamp-1">
                    <MapPin className="w-3 h-3" />
                    {property.address}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pb-2">
                  <div className="text-xs text-muted-foreground flex gap-2">
                    <span className="bg-secondary px-2 py-1 rounded-md capitalize">{property.type}</span>
                    <span className="bg-secondary px-2 py-1 rounded-md capitalize">{property.type === 'pg' ? 'PG' : property.type}</span>
                  </div>
                </CardContent>

                <CardFooter className="pt-4 border-t border-border flex justify-between gap-2">
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href={`/property/${property.id}`}>
                      <ExternalLink className="w-3 h-3 mr-2" /> View
                    </Link>
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleDelete(property.id)}
                    disabled={deletingId === property.id}
                  >
                    {deletingId === property.id ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <>
                        <Trash2 className="w-3 h-3 mr-2" /> Delete
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}