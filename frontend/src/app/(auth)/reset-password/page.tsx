"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { resetPassword } from "@/lib/api"
import { KeyRound, CheckCircle2 } from "lucide-react"

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''
  
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [successMsg, setSuccessMsg] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccessMsg("")

    if (!token) {
      setError("Missing or invalid reset token. Please request a new password reset link.")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setLoading(true)

    try {
      const res = await resetPassword({ token, password })
      setSuccessMsg(res?.message || "Password reset successful! Redirecting to login...")
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Password reset failed. The token may be expired."
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <KeyRound className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Set new password</h2>
        <p className="text-xs text-gray-500 mt-1">Please enter your new password below.</p>
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
          <Link href="/login" className="inline-block text-xs font-bold text-indigo-600 hover:text-indigo-800">
            Click here if not redirected automatically &rarr;
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input 
              type="password" 
              required 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
              disabled={loading}
            />
          </div>

          <Button type="submit" className="w-full bg-[#5C55E6] hover:bg-[#4F46E5] text-white py-2.5 rounded-xl cursor-pointer mt-2" disabled={loading}>
            {loading ? "Updating password..." : "Reset Password"}
          </Button>

          <div className="text-center pt-2">
            <Link href="/login" className="text-xs font-semibold text-gray-500 hover:text-indigo-600">
              Back to Sign in
            </Link>
          </div>
        </form>
      )}
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  )
}
