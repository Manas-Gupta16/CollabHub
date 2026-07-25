"use client"

import { useTheme } from "@/components/theme-provider"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light")
    } else {
      setTheme("dark")
    }
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-2 text-xs font-semibold ${className}`}
      title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-amber-400 shrink-0" />
      ) : (
        <Moon className="w-4 h-4 text-indigo-600 shrink-0" />
      )}
    </button>
  )
}
