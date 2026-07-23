import React, { useState, useEffect } from "react"

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
  const avatarUrl = avatar
    ? (avatar.startsWith("http") || avatar.startsWith("blob:") || avatar.startsWith("data:"))
      ? avatar
      : `http://localhost:5000${avatar}`
    : null

  // Generate a premium soft color gradient based on name hash
  const colors = [
    "bg-indigo-50 text-indigo-700 border-indigo-100",
    "bg-amber-50 text-amber-700 border-amber-100",
    "bg-emerald-50 text-emerald-700 border-emerald-100",
    "bg-blue-50 text-blue-700 border-blue-100",
    "bg-pink-50 text-pink-700 border-pink-100",
    "bg-violet-50 text-violet-700 border-violet-100",
  ]

  let hash = 0
  for (let i = 0; i < userName.length; i++) {
    hash = userName.charCodeAt(i) + ((hash << 5) - hash)
  }
  const colorClass = colors[Math.abs(hash) % colors.length]

  if (avatarUrl && !hasError) {
    return (
      <div className={`${size} rounded-full overflow-hidden border border-gray-200 shrink-0 bg-gray-100 flex items-center justify-center shadow-sm`}>
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
