"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { ThemeToggle } from "@/components/ThemeToggle"

export function LegalNavbar() {
  return (
    <nav className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between sticky top-0 z-50 bg-white/85 dark:bg-slate-950/85 backdrop-blur-md border-b border-gray-100 dark:border-slate-800/80 transition-colors">
      <div className="flex items-center gap-4">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Home
        </Link>
        <div className="h-4 w-px bg-gray-200 dark:bg-slate-800" />
        <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight text-gray-900 dark:text-gray-100 hover:opacity-85 transition-opacity">
          <div className="relative w-5 h-5 border-2 border-gray-900 dark:border-gray-100 rounded-[4px] flex items-center justify-center bg-transparent">
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white dark:bg-slate-950 border-2 border-gray-900 dark:border-gray-100 rounded-[2px]" />
          </div>
          <span>CollabHub</span>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Link href="/login" className="hidden sm:inline-flex text-xs font-bold text-gray-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2">
          Sign In
        </Link>
        <Link href="/pricing">
          <Button className="bg-[#5C55E6] hover:bg-[#4F46E5] text-white px-4 py-2 rounded-xl font-semibold text-xs shadow-xs transition-all cursor-pointer">
            View Pricing
          </Button>
        </Link>
      </div>
    </nav>
  )
}
