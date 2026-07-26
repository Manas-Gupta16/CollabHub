"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { ThemeToggle } from "@/components/ThemeToggle"
import { CollabHubLogo } from "@/components/CollabHubLogo"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#F5F8FF] via-[#F8FAFC] to-[#E9F0FE] dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-12 sm:px-6 lg:px-8 relative overflow-hidden text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200">
      
      {/* Theme Toggle Top Right */}
      <div className="absolute top-5 right-5 z-20">
        <ThemeToggle className="bg-white/80 dark:bg-slate-900/80 border border-gray-200 dark:border-slate-800 shadow-sm" />
      </div>

      {/* Background Animated Blobs */}
      <motion.div 
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-12 left-12 w-72 h-72 bg-indigo-200/50 dark:bg-indigo-900/20 rounded-full blur-3xl -z-10" 
      />
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-12 right-12 w-96 h-96 bg-purple-200/50 dark:bg-purple-900/20 rounded-full blur-3xl -z-10" 
      />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        
        {/* Brand Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center mb-8"
        >
          <CollabHubLogo href="/" size="lg" />
          <p className="text-xs text-gray-500 dark:text-slate-400 font-medium mt-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-500" /> Real-time team collaboration platform
          </p>
        </motion.div>

        {/* Card Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm py-8 px-6 shadow-xl shadow-indigo-500/5 sm:rounded-2xl sm:px-10 border border-gray-100 dark:border-slate-800 relative text-gray-900 dark:text-gray-100"
        >
          {children}
        </motion.div>

      </div>
    </div>
  )
}
