"use client"

import type React from "react"
import { useState } from "react"
import { X, GraduationCap, Building2, Mail, Lock, User, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-context"
import { useToast } from "@/hooks/use-toast"

// --- FIREBASE IMPORTS ---
import { 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile 
} from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore" 
import { auth, googleProvider, db } from "@/lib/firebase"

export default function AuthModal() {
  const { isModalOpen, closeModal } = useAuth()
  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState<"signin" | "register">("signin")
  const [role, setRole] = useState<"student" | "owner" | null>(null)
  const [loading, setLoading] = useState(false)

  // Form states
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")

  if (!isModalOpen) return null

  // --- 1. HANDLE FORM SUBMISSION (Real Logic) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (activeTab === "register") {
        // --- CREATE ACCOUNT FLOW ---
        if (!role) {
          throw new Error("Please select if you are a Student or Owner")
        }

        // 1. Create User
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user

        // 2. Update Name
        await updateProfile(user, { displayName: name })

        // 3. Save to DB
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          name: name,
          email: email,
          role: role,
          createdAt: new Date().toISOString()
        })

        toast({ title: "Account Created!", description: `Welcome, ${name}!` })
        closeModal()

      } else {
        // --- LOGIN FLOW ---
        await signInWithEmailAndPassword(auth, email, password)
        
        toast({ title: "Welcome back!" })
        closeModal()
      }

    } catch (error: any) {
      console.error("Auth Error:", error)
      let title = "Error"
      let message = error.message

      // --- CUSTOM ERROR MESSAGES ---
      if (error.code === 'auth/user-not-found') {
        title = "Account Not Found"
        message = "No account exists with this email. Please switch to 'Create Account'."
      } 
      else if (error.code === 'auth/wrong-password') {
        message = "Incorrect password. Please try again."
      } 
      else if (error.code === 'auth/invalid-credential') {
        title = "Login Failed"
        message = "Invalid email or password. If you don't have an account, please Create Account."
      }
      else if (error.code === 'auth/email-already-in-use') {
        message = "This email is already registered. Please Log In."
      }

      toast({
        title: title,
        description: message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // --- 2. HANDLE GOOGLE LOGIN ---
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user

      // Check DB for existing user to save default role
      const userDoc = await getDoc(doc(db, "users", user.uid))
      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          role: "student", // Default role
          photo: user.photoURL,
          createdAt: new Date().toISOString()
        })
      }

      toast({
        title: "Signed in with Google",
        description: `Welcome, ${result.user.displayName}`,
      })
      closeModal()
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
                <p className="text-sm text-muted-foreground mt-1">Sign in to your PGStay account</p>
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

              {/* Submit Button (LOGIN) - FIXED: Removed disabled={!role} */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-full py-6 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Login"}
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

              {/* Social Login */}
              <button
                type="button"
                onClick={handleGoogleLogin}
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
                <p className="text-sm text-muted-foreground mt-1">Join PGStay today</p>
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

              {/* Submit Button (REGISTER - Keeps disabled check for role) */}
              <Button
                type="submit"
                className="w-full rounded-full py-6 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                disabled={!role || loading}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account"}
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
