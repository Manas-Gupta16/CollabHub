import React, { useState, useEffect } from "react"
import { getFileUrl } from "@/lib/api"
import { DEFAULT_AVATARS } from "@/constants/avatars"

interface UserAvatarProps {
  name?: string
  avatar?: string
  size?: string
}

export function UserAvatar({ name, avatar, size = "w-8 h-8 text-[12px] font-bold" }: UserAvatarProps) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setHasError(false)
  }, [avatar])

  const initials = (name || "?")
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase()

  const userName = name || "User"
  
  let rawUrl = avatar ? getFileUrl(avatar) : null

  // If avatar is a legacy external DiceBear URL, map to self-contained SVG Data URI
  if (rawUrl && rawUrl.includes("api.dicebear.com")) {
    const matched = DEFAULT_AVATARS.find(a => rawUrl?.toLowerCase().includes(`seed=${a.name.toLowerCase()}`))
    if (matched) {
      rawUrl = matched.url
    }
  }

  const avatarUrl = rawUrl

  // Generate a premium soft color gradient based on name hash
  const colors = [
    "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60",
    "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60",
    "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60",
    "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60",
    "bg-pink-50 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-800/60",
    "bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800/60",
  ]

  let hash = 0
  for (let i = 0; i < userName.length; i++) {
    hash = userName.charCodeAt(i) + ((hash << 5) - hash)
  }
  const colorClass = colors[Math.abs(hash) % colors.length]

  if (avatarUrl && !hasError) {
    return (
      <div className={`${size} rounded-full overflow-hidden border border-gray-200 dark:border-slate-700/80 shrink-0 bg-gray-100 dark:bg-slate-800 flex items-center justify-center shadow-sm`}>
        <img
          src={avatarUrl}
          className="w-full h-full object-cover"
          alt={userName}
          onError={() => setHasError(true)}
        />
      </div>
    )
  }

  return (
    <div className={`${size} rounded-full border flex items-center justify-center shrink-0 shadow-sm ${colorClass}`}>
      {initials}
    </div>
  )
}
