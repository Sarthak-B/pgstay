"use client"

import type React from "react"
import { useState } from "react"
import { X, GraduationCap, Building2, Mail, Lock, User, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-context" 
import { useToast } from "@/hooks/use-toast"

// Firebase Imports
import { 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile 
} from "firebase/auth"
import { auth, googleProvider } from "@/lib/firebase"

// Supabase Import
import { supabase } from "@/lib/supabase"

export default function AuthModal() {
  const { isModalOpen, closeModal, login } = useAuth()
  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState<"signin" | "register">("signin")
  const [role, setRole] = useState<"student" | "owner" | null>(null)
  const [loading, setLoading] = useState(false)

  // Form states
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")

  if (!isModalOpen) return null

  // --- 1. EMAIL/PASSWORD HANDLER ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (activeTab === "register") {
        if (!role) throw new Error("Please select if you are a Student or Owner")

        // 1. Create User in Firebase
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user
        
        // 2. Save Name in Firebase
        await updateProfile(user, { displayName: name })

        // 3. Save Role to Supabase (Upsert ensures we write the role)
        const { error: dbError } = await supabase
          .from('users')
          .upsert([
            { uid: user.uid, name: name, email: email, role: role }
          ])
        
        if (dbError) throw dbError

        // 4. Force Login Context Update
        login({
          uid: user.uid,
          email: user.email,
          name: name,
          role: role, 
          photo: null
        })

        toast({ title: "Account Created!", description: `Welcome, ${name}!` })

      } else {
        await signInWithEmailAndPassword(auth, email, password)
        toast({ title: "Welcome back!" })
        closeModal()
      }

    } catch (error: any) {
      console.error(error)
      let title = "Error"
      let msg = error.message
      
      if (error.code === 'auth/email-already-in-use') {
        title = "Account Exists"
        msg = "Email already registered. Please Login."
      } else if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        title = "Login Failed"
        msg = "Invalid email or password."
      }

      toast({ title: title, description: msg, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  // --- 2. GOOGLE LOGIN HANDLER ---
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      let finalRole = 'student' // Default fallback

      const { data: existingUser } = await supabase
        .from('users')
        .select('role')
        .eq('uid', user.uid)
        .single()
      
      if (activeTab === 'register' && role) {
        finalRole = role
        await supabase.from('users').upsert([
          { uid: user.uid, name: user.displayName, email: user.email, role: finalRole }
        ])
      } 
      else if (existingUser) {
        finalRole = existingUser.role
      } 
      else {
        await supabase.from('users').insert([
          { uid: user.uid, name: user.displayName, email: user.email, role: 'student' }
        ])
      }

      login({
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        photo: user.photoURL,
        role: finalRole
      })

      toast({ title: "Signed in with Google" })
      
    } catch (error: any) {
      toast({ title: "Login Failed", description: "Google sign-in cancelled.", variant: "destructive" })
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={closeModal} />

      {/* Modal Card */}
      <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 fade-in duration-300" onClick={(e) => e.stopPropagation()}>
        <button onClick={closeModal} className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary transition-colors z-10"><X className="w-5 h-5 text-muted-foreground" /></button>

        {/* Tabs */}
        <div className="flex border-b border-border">
          <button onClick={() => setActiveTab("signin")} className={`flex-1 py-4 text-sm font-semibold transition-colors relative ${activeTab === "signin" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>Sign In{activeTab === "signin" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}</button>
          <button onClick={() => setActiveTab("register")} className={`flex-1 py-4 text-sm font-semibold transition-colors relative ${activeTab === "register" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>Create Account{activeTab === "register" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}</button>
        </div>

        {/* Form Content - Made padding slightly smaller (p-6 instead of p-6 sm:p-8) to reduce height */}
        <div className="p-6">
          
          {/* SIGN IN FORM */}
          {activeTab === "signin" ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-center mb-4"><h2 className="text-xl font-bold text-foreground">Welcome Back</h2><p className="text-sm text-muted-foreground mt-1">Sign in to your PGStay account</p></div>
              <div className="space-y-3">
                <div><label className="text-sm font-medium text-foreground mb-1 block">Email</label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className="w-full pl-11 pr-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" required /></div></div>
                <div><label className="text-sm font-medium text-foreground mb-1 block">Password</label><div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" /><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-11 pr-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" required /></div></div>
              </div>
              <div className="text-right"><button type="button" className="text-sm text-primary hover:underline font-medium">Forgot Password?</button></div>
              
              <Button type="submit" className="w-full rounded-full py-6 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Login"}
              </Button>

              <div className="relative my-4"><div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">or continue with</span></div></div>
              <button type="button" onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-3 py-3 border border-border rounded-full hover:bg-secondary transition-colors"><span className="text-sm font-medium text-foreground">Continue with Google</span></button>
            </form>
          ) : (
            
            /* REGISTER FORM */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-center mb-4"><h2 className="text-xl font-bold text-foreground">Create Account</h2><p className="text-sm text-muted-foreground mt-1">Join PGStay today</p></div>
              
              {/* Role Selection */}
              <div><label className="text-sm font-medium text-foreground mb-3 block">I am a...</label><div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setRole("student")} className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${role === "student" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 bg-secondary"}`}><div className={`w-12 h-12 rounded-full flex items-center justify-center ${role === "student" ? "bg-primary" : "bg-border"}`}><GraduationCap className={`w-6 h-6 ${role === "student" ? "text-primary-foreground" : "text-muted-foreground"}`} /></div><span className={`text-sm font-semibold ${role === "student" ? "text-primary" : "text-foreground"}`}>Student</span></button>
                  <button type="button" onClick={() => setRole("owner")} className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${role === "owner" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 bg-secondary"}`}><div className={`w-12 h-12 rounded-full flex items-center justify-center ${role === "owner" ? "bg-primary" : "bg-border"}`}><Building2 className={`w-6 h-6 ${role === "owner" ? "text-primary-foreground" : "text-muted-foreground"}`} /></div><span className={`text-sm font-semibold ${role === "owner" ? "text-primary" : "text-foreground"}`}>Owner</span></button>
              </div></div>

              <div className="space-y-3">
                <div><label className="text-sm font-medium text-foreground mb-1 block">Full Name</label><div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" /><input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="w-full pl-11 pr-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" required /></div></div>
                <div><label className="text-sm font-medium text-foreground mb-1 block">Email</label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className="w-full pl-11 pr-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" required /></div></div>
                <div><label className="text-sm font-medium text-foreground mb-1 block">Password</label><div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" /><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-11 pr-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" required /></div></div>
              </div>

              {/* Register Button */}
              <Button type="submit" className="w-full rounded-full py-6 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold" disabled={!role || loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account"}
              </Button>

              <div className="relative my-4"><div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">or continue with</span></div></div>
              
              {/* Google Button */}
              <button type="button" onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-3 py-3 border border-border rounded-full hover:bg-secondary transition-colors"><span className="text-sm font-medium text-foreground">Continue with Google</span></button>

              <p className="text-xs text-center text-muted-foreground">By signing up, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a></p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
