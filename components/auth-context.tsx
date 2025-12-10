"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  onAuthStateChanged, 
  signOut 
} from "firebase/auth"
import { auth } from "@/lib/firebase" // Make sure this path matches your file structure

interface AuthContextType {
  isLoggedIn: boolean
  user: any | null
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
  const [isLoading, setIsLoading] = useState(true) // Helper to prevent flicker
  const router = useRouter()

  // --- THE FIX: Listen to Firebase for session changes ---
  useEffect(() => {
    // onAuthStateChanged automatically checks for an existing session
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // User found! Set state immediately.
        setUser({
          name: currentUser.displayName || "User",
          email: currentUser.email,
          photo: currentUser.photoURL,
          uid: currentUser.uid
        })
      } else {
        // No user found
        setUser(null)
      }
      setIsLoading(false) // Done checking
    })

    return () => unsubscribe()
  }, [])

  const logout = async () => {
    await signOut(auth) // Tell Firebase to delete session
    setUser(null)
    router.push("/")
  }

  // Helper for manual/dummy login (keeps compatibility)
  const login = (userData: any) => {
    setUser(userData)
    setIsModalOpen(false)
  }

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
      {/* Don't show the app until we know if the user is logged in */}
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
