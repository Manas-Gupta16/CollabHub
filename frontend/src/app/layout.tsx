import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CollabHub – Modern Team Collaboration Platform",
  description: "Collaboration that's effortless & powerful",
  icons: {
    icon: "/icon.svg",
  },
}

import ReactQueryProvider from "@/providers/ReactQueryProvider"
import { ThemeProvider } from "@/components/theme-provider"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-white dark:bg-slate-950 text-gray-900 dark:text-gray-100 transition-colors duration-200`}>
        <ThemeProvider defaultTheme="light" storageKey="collabhub_theme">
          <ReactQueryProvider>
            {children}
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
