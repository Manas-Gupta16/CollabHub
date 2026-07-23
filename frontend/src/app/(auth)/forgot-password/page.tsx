"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { forgotPassword } from "@/lib/api"
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [successMsg, setSuccessMsg] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccessMsg("")
    setLoading(true)

    try {
      const res = await forgotPassword(email)
      setSuccessMsg(res?.message || "Password reset link sent! Check your inbox or terminal console.")
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Could not process password reset request. Please check your email."
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Mail className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Forgot your password?</h2>
        <p className="text-xs text-gray-500 mt-1">No worries! Enter your account email address below to receive a reset link.</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-medium">
          {error}
        </div>
      )}

      {successMsg ? (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
          <p className="text-sm font-semibold text-emerald-900">{successMsg}</p>
          <p className="text-xs text-emerald-700">If you are testing locally, check your backend terminal logs for the generated reset URL.</p>
          <Link href="/login" className="inline-block pt-2 text-xs font-bold text-indigo-600 hover:text-indigo-800">
            &larr; Back to Sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
              disabled={loading}
            />
          </div>

          <Button type="submit" className="w-full bg-[#5C55E6] hover:bg-[#4F46E5] text-white py-2.5 rounded-xl cursor-pointer" disabled={loading}>
            {loading ? "Sending link..." : "Send Reset Link"}
          </Button>

          <div className="text-center pt-2">
            <Link href="/login" className="text-xs font-semibold text-gray-500 hover:text-indigo-600 inline-flex items-center gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign in
            </Link>
          </div>
        </form>
      )}
    </div>
  )
}
