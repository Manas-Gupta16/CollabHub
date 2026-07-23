"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useRouter } from "next/navigation"
import api, { googleLogin } from "@/lib/api"
import { GoogleLogin } from "@react-oauth/google"

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
      <h2 className="text-center text-2xl font-bold text-gray-900 mb-6">Sign in to your account</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
          <input 
            type="email" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input 
            type="password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            disabled={loading}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input id="remember-me" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember me</label>
          </div>
          <div className="text-sm">
            <Link href="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">Forgot your password?</Link>
          </div>
        </div>
        <Button type="submit" className="w-full bg-[#5C55E6] hover:bg-[#4F46E5] text-white cursor-pointer" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 text-gray-500 font-semibold">Or continue with</span>
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

      <div className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
          Sign up
        </Link>
      </div>
    </div>
  )
}
