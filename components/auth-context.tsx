"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { auth } from "@/lib/firebase" // Firebase for Auth
import { supabase } from "@/lib/supabase" // Supabase for Database

interface AuthContextType {
  isLoggedIn: boolean
  user: any | null // Holds name, email, photo, AND role
  login: (userData: any) => void
  logout: () => void
  isModalOpen: boolean
  openModal: () => void
  closeModal: () => void
  protectedAction: (action: () => void) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Listen for Firebase Auth changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // 1. Default User Object (Role starts as 'student' fallback)
        let userData: any = {
          uid: currentUser.uid,
          email: currentUser.email,
          name: currentUser.displayName || "User",
          photo: currentUser.photoURL,
          role: "student" // Default value so buttons don't break
        }

        // 2. Fetch Real Role from Supabase Database
        try {
          const { data, error } = await supabase
            .from('users')
            .select('role, name')
            .eq('uid', currentUser.uid)
            .single()

          if (data) {
            // Overwrite with database data
            userData.role = data.role || "student"
            // Use the name from DB if available (user might have updated it)
            if (data.name) userData.name = data.name 
          }
          
          if (error && error.code !== 'PGRST116') {
            // PGRST116 is "Row not found", which is fine for new users
            console.error("Supabase fetch error:", error)
          }

        } catch (error) {
          console.error("Error connecting to Supabase:", error)
        }

        setUser(userData)
        setIsModalOpen(false)
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const logout = async () => {
    await signOut(auth) // Sign out from Firebase
    setUser(null)
    router.push("/")
  }

  // Manual login helper (used rarely now since Firebase handles it)
  const login = (userData: any) => { setUser(userData); setIsModalOpen(false) }
  
  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const protectedAction = (action: () => void) => {
    if (user) {
      action()
    } else {
      openModal()
    }
  }

  return (
    <AuthContext.Provider 
      value={{ 
        isLoggedIn: !!user, 
        user, 
        login, 
        logout, 
        isModalOpen, 
        openModal, 
        closeModal,
        protectedAction 
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
