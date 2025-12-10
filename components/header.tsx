"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, X, Home, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-context" // Import the Context Hook
import AuthModal from "@/components/auth-modal"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  
  // Get global auth functions
  const { isLoggedIn, user, openModal, logout, protectedAction } = useAuth()

  const navLinks = [
    { name: "Home", href: "/" },
    // We handle these with clicks now, not hrefs, to protect them
    { name: "Browse PGs", action: () => protectedAction(() => router.push("/browse")) },
    { name: "List Property", action: () => protectedAction(() => router.push("/owner/onboarding")) },
  ]

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">PGSpot</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
                Home
              </Link>
              
              <button 
                onClick={() => protectedAction(() => router.push("/browse"))}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
              >
                Browse PGs
              </button>

              <button 
                onClick={() => protectedAction(() => router.push("/owner/onboarding"))}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
              >
                List Property
              </button>

              {isLoggedIn ? (
                <div className="flex items-center gap-4 ml-4">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                      {user?.photo ? (
                        <img src={user.photo} alt="User" className="w-full h-full rounded-full" />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                    </div>
                    <span className="hidden lg:inline">{user?.name || "User"}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={logout}>
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </Button>
                </div>
              ) : (
                <button
                  onClick={openModal} // Uses global openModal
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
                >
                  Login
                </button>
              )}
            </nav>

            {/* CTA Button (Desktop) */}
            <div className="hidden md:block ml-4">
              {!isLoggedIn && (
                <Button
                  className="rounded-full px-6 bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={openModal}
                >
                  Get Started
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border">
              <nav className="flex flex-col gap-4">
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    protectedAction(() => router.push("/browse"))
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium py-2 text-left"
                >
                  Browse PGs
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    protectedAction(() => router.push("/owner/onboarding"))
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium py-2 text-left"
                >
                  List Property
                </button>

                {!isLoggedIn ? (
                  <>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false)
                        openModal()
                      }}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium py-2 text-left"
                    >
                      Login
                    </button>
                    <Button
                      className="rounded-full w-full mt-2 bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() => {
                        setMobileMenuOpen(false)
                        openModal()
                      }}
                    >
                      Get Started
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    className="rounded-full w-full mt-2"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      logout()
                    }}
                  >
                    Logout
                  </Button>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Render the Modal WITHOUT PROPS */}
      <AuthModal />
    </>
  )
}
