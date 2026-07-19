"use client"

import { 
  Hash, 
  Settings, 
  Plus, 
  LogOut
} from "lucide-react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { getWorkspaces } from "@/lib/api"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const { data: workspaces, isLoading } = useQuery({
    queryKey: ['workspaces'],
    queryFn: getWorkspaces
  })

  // Extract ID from path if available
  const currentWorkspaceId = pathname.match(/\/workspaces\/([a-zA-Z0-9_-]+)/)?.[1]
  const activeWorkspace = workspaces?.find((w: any) => w._id === currentWorkspaceId) || workspaces?.[0]
  
  const channels = activeWorkspace?.channels || [
    { name: 'general', isPrivate: false }
  ]

  const colors = ['bg-blue-500', 'bg-orange-500', 'bg-purple-500', 'bg-gray-400', 'bg-emerald-500']

  if (!isMounted) return null

  return (
    <div className="flex h-screen bg-white text-gray-900 font-sans overflow-hidden">
      {/* Sidebar - Exact match to image */}
      <div className="w-[260px] border-r border-gray-100 flex flex-col bg-white shrink-0">
        
        {/* Logo */}
        <Link href="/dashboard" className="h-14 flex items-center px-6 mb-2">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
             <div className="relative w-5 h-5 border-[1.5px] border-gray-900 rounded-[3px] bg-transparent">
               <div className="absolute -top-[1.5px] -right-[1.5px] w-[8px] h-[8px] bg-white border-[1.5px] border-gray-900 rounded-[2px]"></div>
             </div>
             CollabHub
          </div>
        </Link>

        <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
          
          {/* Workspaces */}
          <div className="mb-6">
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5 px-2">Workspaces</div>
            <div className="space-y-1">
              {isLoading ? (
                <div className="px-2 text-xs text-gray-400">Loading workspaces...</div>
              ) : workspaces?.map((ws: any, i: number) => (
                <Link key={ws._id} href={`/workspaces/${ws._id}`}>
                  <div className={`flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[13px] font-medium transition-colors cursor-pointer ${activeWorkspace?._id === ws._id ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'}`}>
                    <div className={`w-2.5 h-2.5 rounded-[2px] ${colors[i % colors.length]}`}></div>
                    {ws.name}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Channels */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5 px-2">
              Channels
              <Plus className="w-3 h-3 cursor-pointer hover:text-gray-600" strokeWidth={2.5} />
            </div>
            <div className="space-y-1">
              {channels.map((channel: any, i: number) => {
                const isActive = pathname === '/messages' && i === 0; // Simple highlight for demo
                return (
                  <Link 
                    key={channel._id || i} 
                    href={`/messages?workspace=${activeWorkspace?._id}&channel=${channel.name}`}
                    className={`flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
                      isActive
                        ? 'bg-gray-100 text-gray-900 font-bold' 
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Hash className={`w-3.5 h-3.5 ${isActive ? 'text-gray-900' : 'text-gray-400'}`} strokeWidth={isActive ? 2.5 : 2} />
                    {channel.name}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* User Profile at Bottom */}
        <div className="mt-auto p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 shadow-sm border border-gray-100">
               <img src="https://api.dicebear.com/7.x/micah/svg?seed=Oliver&backgroundColor=f3f4f6" alt="avatar" className="w-full h-full object-cover"/>
            </div>
            <div>
              <div className="text-[13px] font-bold text-gray-900 leading-tight">Destriee</div>
              <div className="text-[11px] text-gray-500 font-medium">Collab User</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Plus className="w-3.5 h-3.5 cursor-pointer hover:text-gray-600" />
            <Settings className="w-3.5 h-3.5 cursor-pointer hover:text-gray-600" />
            <LogOut 
              className="w-3.5 h-3.5 cursor-pointer hover:text-red-500 transition-colors" 
              onClick={() => {
                localStorage.removeItem("token");
                router.push("/");
              }}
              title="Sign Out"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {children}
      </div>
    </div>
  )
}
