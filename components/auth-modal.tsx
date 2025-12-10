"use client"

import type React from "react"
import { useState } from "react"
import { X, GraduationCap, Building2, Mail, Lock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-context" // Import Context
import { useToast } from "@/hooks/use-toast"

// Firebase Imports
import { signInWithPopup } from "firebase/auth"
import { auth, googleProvider } from "@/lib/firebase"

export default function AuthModal() {
  // 1. Hook into Global Auth State (No props needed)
  const { isModalOpen, closeModal, login } = useAuth()
  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState<"signin" | "register">("signin")
  const [role, setRole] = useState<"student" | "owner" | null>(null)

  // Form states
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")

  // 2. Return null if modal shouldn't be open
  if (!isModalOpen) return null

  // 3. Handle Standard Email/Pass Login (Simulated for now)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const userData = {
      name: name || email.split("@")[0], // Fallback name
      email: email,
      role: role || "student"
    }

    login(userData) // Updates global context
    
    toast({
      title: activeTab === "signin" ? "Welcome back!" : "Account created!",
      description: `Logged in as ${userData.name}`,
    })
    // Note: login() in context usually closes modal, but we can ensure it here
    closeModal()
  }

  // 4. Handle Google Login (Real Firebase Auth)
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      // Context listener handles the state update automatically
      closeModal()
      
      toast({
        title: "Signed in with Google",
        description: `Welcome, ${result.user.displayName}`,
      })
    } catch (error: any) {
      console.error(error)
      toast({
        title: "Login Failed",
        description: "Google sign-in was cancelled or failed.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop with blur & Close handler */}
      <div 
        className="absolute inset-0 bg-foreground/60 backdrop-blur-sm animate-in fade-in duration-200" 
        onClick={closeModal} 
      />

      {/* Modal Card */}
      <div
        className="relative bg-card rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 fade-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary transition-colors z-10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* Tabs */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab("signin")}
            className={`flex-1 py-4 text-sm font-semibold transition-colors relative
              ${activeTab === "signin" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            Sign In
            {activeTab === "signin" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`flex-1 py-4 text-sm font-semibold transition-colors relative
              ${activeTab === "register" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            Create Account
            {activeTab === "register" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 sm:p-8">
          {activeTab === "signin" ? (
            /* Sign In Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-foreground">Welcome Back</h2>
                <p className="text-sm text-muted-foreground mt-1">Sign in to your PGSpot account</p>
              </div>

              <div className="space-y-4">
                {/* Email Field */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      className="w-full pl-11 pr-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <button type="button" className="text-sm text-primary hover:underline font-medium">
                  Forgot Password?
                </button>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full rounded-full py-6 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
              >
                Login
              </Button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">or continue with</span>
                </div>
              </div>

              {/* Social Login (Google) */}
              <button
                type="button"
                onClick={handleGoogleLogin} // Connected to Firebase
                className="w-full flex items-center justify-center gap-3 py-3 border border-border rounded-full hover:bg-secondary transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-sm font-medium text-foreground">Continue with Google</span>
              </button>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-foreground">Create Account</h2>
                <p className="text-sm text-muted-foreground mt-1">Join PGSpot today</p>
              </div>

              {/* Role Selection */}
              <div>
                <label className="text-sm font-medium text-foreground mb-3 block">I am a...</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("student")}
                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2
                      ${
                        role === "student"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50 bg-secondary"
                      }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center
                      ${role === "student" ? "bg-primary" : "bg-border"}`}
                    >
                      <GraduationCap
                        className={`w-6 h-6 ${role === "student" ? "text-primary-foreground" : "text-muted-foreground"}`}
                      />
                    </div>
                    <span
                      className={`text-sm font-semibold ${role === "student" ? "text-primary" : "text-foreground"}`}
                    >
                      Student
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("owner")}
                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2
                      ${
                        role === "owner"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50 bg-secondary"
                      }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center
                      ${role === "owner" ? "bg-primary" : "bg-border"}`}
                    >
                      <Building2
                        className={`w-6 h-6 ${role === "owner" ? "text-primary-foreground" : "text-muted-foreground"}`}
                      />
                    </div>
                    <span className={`text-sm font-semibold ${role === "owner" ? "text-primary" : "text-foreground"}`}>
                      Owner
                    </span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {/* Name Field */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full pl-11 pr-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      className="w-full pl-11 pr-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full rounded-full py-6 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                disabled={!role}
              >
                Create Account
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                By signing up, you agree to our{" "}
                <a href="#" className="text-primary hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary hover:underline">
                  Privacy Policy
                </a>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
