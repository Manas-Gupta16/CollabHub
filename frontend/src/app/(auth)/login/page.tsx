"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useRouter } from "next/navigation"
import api, { googleLogin } from "@/lib/api"
import { GoogleLogin } from "@react-oauth/google"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Lock, ArrowRight, AlertCircle } from "lucide-react"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await api.post("/auth/login", { email, password })
      const token = res.data?.data?.token
      if (token) {
        localStorage.setItem("token", token)
        window.location.href = "/dashboard"
      } else {
        setError("Login failed. No token received.")
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || "Invalid email or password."
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse.credential) return
    setError("")
    setLoading(true)

    try {
      const data = await googleLogin(credentialResponse.credential)
      if (data?.token) {
        localStorage.setItem("token", data.token)
        window.location.href = "/dashboard"
      } else {
        setError("Google Sign-In failed. Please try again.")
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Google Sign-In failed."
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleError = () => {
    setError("Google Authentication was unsuccessful. Please try again.")
  }

  return (
    <div>
      <h2 className="text-center text-2xl font-bold text-gray-900 mb-1 tracking-tight">Welcome back</h2>
      <p className="text-center text-xs text-gray-500 font-medium mb-6">Sign in to access your workspaces and team channels</p>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Email address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full pl-9 pr-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white text-xs transition-all font-medium"
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-9 pr-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white text-xs transition-all font-medium"
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center">
            <input id="remember-me" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer" />
            <label htmlFor="remember-me" className="ml-2 block text-xs text-gray-600 font-medium cursor-pointer">Remember me</label>
          </div>
          <div className="text-xs font-semibold">
            <Link href="/forgot-password" className="text-indigo-600 hover:text-indigo-700 transition-colors">Forgot your password?</Link>
          </div>
        </div>

        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <Button type="submit" className="w-full bg-[#5C55E6] hover:bg-[#4F46E5] text-white py-2.5 rounded-xl font-bold text-xs shadow-md shadow-indigo-500/20 cursor-pointer flex items-center justify-center gap-2" disabled={loading}>
            {loading ? "Signing in..." : "Sign in to CollabHub"} <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </motion.div>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-[11px] uppercase">
          <span className="bg-white px-3 text-gray-400 font-bold tracking-wider">Or continue with</span>
        </div>
      </div>

      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          theme="outline"
          shape="pill"
          width="100%"
        />
      </div>

      <div className="mt-6 text-center text-xs text-gray-500 font-medium">
        Don't have an account?{" "}
        <Link href="/signup" className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
          Create account free
        </Link>
      </div>
    </div>
  )
}
