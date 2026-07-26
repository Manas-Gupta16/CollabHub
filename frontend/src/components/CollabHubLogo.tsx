"use client"

import React from "react"
import Link from "next/link"

interface CollabHubLogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  showText?: boolean
  href?: string
  className?: string
  textClassName?: string
}

export function CollabHubLogo({
  size = "md",
  showText = true,
  href,
  className = "",
  textClassName = "",
}: CollabHubLogoProps) {
  // Dimension mappings for the logo icon badge
  const iconSizes = {
    sm: "w-6 h-6 rounded-md shadow-xs",
    md: "w-8 h-8 rounded-lg shadow-sm",
    lg: "w-10 h-10 rounded-xl shadow-md",
    xl: "w-12 h-12 rounded-2xl shadow-lg",
  }

  const svgSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4.5 h-4.5",
    lg: "w-5.5 h-5.5",
    xl: "w-7 h-7",
  }

  const textSizes = {
    sm: "text-base font-bold",
    md: "text-lg font-bold tracking-tight",
    lg: "text-xl font-extrabold tracking-tight",
    xl: "text-2xl font-black tracking-tight",
  }

  const logoContent = (
    <div className={`flex items-center gap-2.5 group cursor-pointer ${className}`}>
      {/* Icon Badge */}
      <div
        className={`${iconSizes[size]} bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-indigo-500/25 group-hover:scale-105 group-hover:shadow-indigo-500/40 transition-all duration-200`}
      >
        <svg
          className={`${svgSizes[size]} text-white fill-current`}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Central Hub & Interlocking Nodes Symbol */}
          <path d="M12 2a4 4 0 0 1 3.995 3.8L16 6a4 4 0 0 1-3.8 3.995L12 10a4 4 0 0 1-3.995-3.8L8 6a4 4 0 0 1 3.8-3.995L12 2zm-5 11a3.5 3.5 0 0 1 3.495 3.3L10.5 16.5a3.5 3.5 0 0 1-3.3 3.495L7 20a3.5 3.5 0 0 1-3.495-3.3L3.5 16.5a3.5 3.5 0 0 1 3.3-3.495L7 13zm10 0a3.5 3.5 0 0 1 3.495 3.3l.005.2a3.5 3.5 0 0 1-3.3 3.495l-.2.005a3.5 3.5 0 0 1-3.495-3.3l-.005-.2a3.5 3.5 0 0 1 3.3-3.495l.2-.005zM12 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-5 11a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm10 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
          <path
            d="M8.5 7.5l-3 7m7-7l3 7"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            fill="none"
            className="opacity-75"
          />
        </svg>
      </div>

      {/* Brand Text */}
      {showText && (
        <span
          className={`${textSizes[size]} text-gray-900 dark:text-gray-100 ${textClassName}`}
        >
          Collab<span className="text-indigo-600 dark:text-indigo-400">Hub</span>
        </span>
      )}
    </div>
  )

  if (href) {
    return <Link href={href}>{logoContent}</Link>
  }

  return logoContent
}
