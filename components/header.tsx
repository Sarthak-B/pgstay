"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, X, Home, LogOut, User, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-context" 
import AuthModal from "@/components/auth-modal"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const { isLoggedIn, user, openModal, logout, protectedAction } = useAuth()

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                PGStay
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Home
              </Link>
              
              <button onClick={() => protectedAction(() => router.push("/browse"))} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Browse PGs
              </button>

              {/* Show "List Property" if user is NOT logged in OR if user IS an Owner */}
              {(!isLoggedIn || user?.role === 'owner') && (
                <button 
                  onClick={() => protectedAction(() => router.push("/owner/onboarding"))}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  List Property
                </button>
              )}

              {/* --- LOGGED IN STATE --- */}
              {isLoggedIn ? (
                <div className="flex items-center gap-4 ml-6 pl-6 border-l border-border">
                  
                  {/* OWNER DASHBOARD BUTTON (Visible only to owners) */}
                  {user?.role === 'owner' && (
                    <Link href="/owner/dashboard">
                      <Button variant="ghost" size="sm" className="font-semibold text-foreground">
                        <LayoutDashboard className="w-4 h-4 mr-2 text-primary" />
                        Dashboard
                      </Button>
                    </Link>
                  )}

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center text-primary border border-primary/20 overflow-hidden">
                      {user?.photo ? (
                        <img src={user.photo} alt="User" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                    </div>
                    <div className="hidden lg:block text-sm">
                      <p className="font-medium text-foreground">{user?.name || "User"}</p>
                      {/* Show Role for confirmation */}
                      <p className="text-xs text-primary font-bold capitalize">
                        {user?.role || "Student"}
                      </p>
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="icon" onClick={logout} className="text-muted-foreground hover:text-red-500">
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                /* --- LOGGED OUT STATE --- */
                <div className="flex items-center gap-4 ml-4">
                  <Button variant="ghost" onClick={openModal}>Login</Button>
                  <Button onClick={openModal} className="rounded-full shadow-md shadow-primary/20">Get Started</Button>
                </div>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Nav logic (simplified for brevity) */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border">
               <nav className="flex flex-col gap-2">
                 {/* ... (Existing mobile links) ... */}
                 {isLoggedIn && user?.role === 'owner' && (
                   <Link href="/owner/dashboard" className="px-4 py-3 font-medium text-primary">My Dashboard</Link>
                 )}
               </nav>
            </div>
          )}
        </div>
      </header>
      <AuthModal />
    </>
  )
}
