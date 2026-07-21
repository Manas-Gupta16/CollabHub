"use client"

import { 
  Hash, 
  Settings, 
  Plus, 
  LogOut,
  Layout,
  FolderKanban,
  Activity,
  Bell,
  Search
} from "lucide-react"
import Link from "next/link"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api, { getWorkspaces, createChannel, globalSearch } from "@/lib/api"
import { useState, useEffect, Suspense } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { UserAvatar } from "@/components/UserAvatar"

function DashboardLayoutInner({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isMounted, setIsMounted] = useState(false)
  const queryClient = useQueryClient()
  const [isNewChannelModalOpen, setIsNewChannelModalOpen] = useState(false)
  const [newChannelName, setNewChannelName] = useState("")
  const [newChannelPrivate, setNewChannelPrivate] = useState(false)

  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true)
    // Auth guard: redirect to login if no token
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
    }
  }, [router])

  // Fetch logged-in user profile
  const { data: user } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await api.get('/auth/profile')
      return res.data?.user
    },
    enabled: isMounted && !!localStorage.getItem("token"),
  })

  const { data: workspaces, isLoading } = useQuery({
    queryKey: ['workspaces'],
    queryFn: getWorkspaces,
    enabled: isMounted && !!localStorage.getItem("token"),
  })

  // Extract ID from path if available, or fall back to query string client-side via reactive searchParams hook
  let currentWorkspaceId = pathname.match(/\/workspaces\/([a-zA-Z0-9_-]+)/)?.[1]
  if (!currentWorkspaceId) {
    currentWorkspaceId = searchParams.get('workspace') || undefined
  }
  const activeWorkspace = workspaces?.find((w: any) => w._id === currentWorkspaceId) || workspaces?.[0]

  const [searchResults, setSearchResults] = useState<any | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim() || !activeWorkspace?._id) return
    
    setIsSearching(true)
    try {
      const data = await globalSearch(activeWorkspace._id, searchQuery)
      setSearchResults(data)
    } catch (err) {
      console.error(err)
      alert("Failed to perform search.")
    } finally {
      setIsSearching(false)
    }
  }

  const createChannelMutation = useMutation({
    mutationFn: (data: { name: string; isPrivate: boolean }) => createChannel(activeWorkspace?._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] })
      queryClient.invalidateQueries({ queryKey: ['workspace', activeWorkspace?._id] })
      setIsNewChannelModalOpen(false)
      setNewChannelName("")
      setNewChannelPrivate(false)
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || "Failed to create channel")
    }
  })

  const handleCreateChannel = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newChannelName.trim()) return
    createChannelMutation.mutate({ name: newChannelName.trim(), isPrivate: newChannelPrivate })
  }
  
  const channels = activeWorkspace?.channels || [
    { name: 'General', isPrivate: false }
  ]

  const wsGradients = [
    'bg-gradient-to-br from-indigo-500 to-indigo-600',
    'bg-gradient-to-br from-amber-500 to-orange-500',
    'bg-gradient-to-br from-emerald-500 to-emerald-600',
    'bg-gradient-to-br from-blue-500 to-blue-600',
    'bg-gradient-to-br from-pink-500 to-rose-500',
    'bg-gradient-to-br from-violet-500 to-purple-600',
  ]

  function getWsGradient(name: string) {
    let hash = 0
    for (let i = 0; i < (name || '').length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
    return wsGradients[Math.abs(hash) % wsGradients.length]
  }

  const userName = user?.name || 'User'
  const userSeed = user?.name?.replace(/\s/g, '') || 'Oliver'
  const avatarUrl = user?.avatar ? `http://localhost:5000${user.avatar}` : `https://api.dicebear.com/7.x/initials/svg?seed=${userSeed}&backgroundColor=6366f1&textColor=ffffff`;

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

        {/* Workspace Search Button */}
        {activeWorkspace && (
          <div className="px-4 mb-4">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-100 hover:bg-gray-100 hover:border-gray-200 rounded-lg text-left text-xs font-semibold text-gray-500 transition-all shadow-sm"
            >
              <Search className="w-3.5 h-3.5" />
              Search workspace...
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
          
          {/* Navigation Menu */}
          <div className="mb-6">
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5 px-2">Menu</div>
            <div className="space-y-1">
              {[
                { name: 'Overview', href: '/dashboard', icon: <Layout className="w-4 h-4" /> },
                { name: 'Tasks', href: '/tasks', icon: <FolderKanban className="w-4 h-4" /> },
                { name: 'Activity Feed', href: '/activity', icon: <Activity className="w-4 h-4" /> },
                { name: 'Notifications', href: '/notifications', icon: <Bell className="w-4 h-4" /> },
              ].map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <div className={`flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[13px] font-medium transition-colors cursor-pointer ${isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'}`}>
                      {item.icon}
                      {item.name}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Workspaces */}
          <div className="mb-6">
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5 px-2">Workspaces</div>
            <div className="space-y-1">
              {isLoading ? (
                <div className="px-2 text-xs text-gray-400">Loading workspaces...</div>
              ) : workspaces?.length ? workspaces.map((ws: any) => (
                <Link key={ws._id} href={`/workspaces/${ws._id}`}>
                  <div className={`flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[13px] font-medium transition-colors cursor-pointer ${activeWorkspace?._id === ws._id ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'}`}>
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-[10px] text-white shrink-0 shadow-sm ${getWsGradient(ws.name || '')}`}>
                      {ws.name?.substring(0, 2).toUpperCase() || 'WS'}
                    </div>
                    <span className="truncate">{ws.name}</span>
                  </div>
                </Link>
              )) : (
                <div className="px-2 text-xs text-gray-400">No workspaces yet</div>
              )}
            </div>
          </div>

          {/* Channels */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5 px-2">
              Channels
              <Plus className="w-3 h-3 cursor-pointer hover:text-gray-600" strokeWidth={2.5} onClick={() => setIsNewChannelModalOpen(true)} />
            </div>
            <div className="space-y-1">
              {channels.map((channel: any, i: number) => {
                const isActive = pathname === '/messages' && i === 0;
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
            <UserAvatar name={userName} avatar={user?.avatar} size="w-8 h-8" />
            <div>
              <div className="text-[13px] font-bold text-gray-900 leading-tight">{userName}</div>
              <div className="text-[11px] text-gray-500 font-medium">Collab User</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Plus className="w-3.5 h-3.5 cursor-pointer hover:text-gray-600" onClick={() => router.push('/workspaces')} />
            <Link href="/settings">
              <Settings className="w-3.5 h-3.5 cursor-pointer hover:text-gray-600" />
            </Link>
            <LogOut 
              className="w-3.5 h-3.5 cursor-pointer hover:text-red-500 transition-colors" 
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/";
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {children}
      </div>

      {/* New Channel Modal */}
      {isNewChannelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Channel</h2>
            <form onSubmit={handleCreateChannel}>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-900 block mb-1">Channel Name</label>
                  <Input 
                    value={newChannelName} 
                    onChange={(e) => setNewChannelName(e.target.value)} 
                    placeholder="e.g. design-feedback" 
                    required
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox"
                    id="isPrivate"
                    checked={newChannelPrivate}
                    onChange={(e) => setNewChannelPrivate(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="isPrivate" className="text-sm font-medium text-gray-700">Make this channel private</label>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <Button type="button" variant="outline" onClick={() => setIsNewChannelModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-[#6366F1] hover:bg-[#4F46E5] text-white" disabled={createChannelMutation.isPending}>
                  {createChannelMutation.isPending ? "Creating..." : "Create Channel"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Search className="w-5 h-5 text-[#6366F1]" />
                Workspace Search ({activeWorkspace?.name})
              </h2>
              <Button variant="ghost" size="icon" onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }} className="text-gray-500">
                <span className="text-xl font-black">&times;</span>
              </Button>
            </div>

            <form onSubmit={handleSearchSubmit} className="mt-4 flex gap-2">
              <Input 
                value={searchQuery} 
                onChange={e => setSearchQuery(e.target.value)} 
                placeholder="Search tasks, messages, or comments..." 
                className="flex-1 bg-gray-50"
                autoFocus
              />
              <Button type="submit" className="bg-[#6366F1] hover:bg-[#4F46E5] text-white" disabled={isSearching}>
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </form>

            <div className="flex-1 overflow-y-auto mt-6 space-y-6 pr-2 custom-scrollbar">
              {isSearching && (
                <div className="text-center py-12 text-gray-500 font-medium">Searching workspace...</div>
              )}

              {!isSearching && searchResults && (
                <>
                  {/* Tasks */}
                  {searchResults.tasks && searchResults.tasks.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tasks ({searchResults.tasks.length})</h3>
                      <div className="space-y-2">
                        {searchResults.tasks.map((task: any) => (
                          <Link key={task._id} href={`/tasks`} onClick={() => setIsSearchOpen(false)}>
                            <div className="p-3 border border-gray-100 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors flex justify-between items-center cursor-pointer">
                              <div>
                                <h4 className="text-sm font-bold text-gray-900">{task.title}</h4>
                                <p className="text-xs text-gray-500 mt-1">{task.description || "No description"}</p>
                              </div>
                              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded border bg-white text-gray-600 border-gray-200">{task.status}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Messages */}
                  {searchResults.messages && searchResults.messages.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Chat Messages ({searchResults.messages.length})</h3>
                      <div className="space-y-2">
                        {searchResults.messages.map((msg: any) => (
                          <Link key={msg._id} href={`/messages?workspace=${activeWorkspace?._id}`} onClick={() => setIsSearchOpen(false)}>
                            <div className="p-3 border border-gray-100 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-gray-900">{msg.sender?.name || "Someone"}</span>
                                <span className="text-[10px] text-gray-400">{new Date(msg.createdAt).toLocaleDateString()}</span>
                              </div>
                              <p className="text-sm text-gray-700 font-medium leading-relaxed">{msg.content}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Comments */}
                  {searchResults.comments && searchResults.comments.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Task Comments ({searchResults.comments.length})</h3>
                      <div className="space-y-2">
                        {searchResults.comments.map((comment: any) => (
                          <Link key={comment._id} href={`/tasks`} onClick={() => setIsSearchOpen(false)}>
                            <div className="p-3 border border-gray-100 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-gray-900">{comment.user?.name || "Someone"} on <span className="text-[#6366F1]">"{comment.task?.title || 'Task'}"</span></span>
                                <span className="text-[10px] text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                              </div>
                              <p className="text-sm text-gray-700 font-medium leading-relaxed">{comment.content}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {(!searchResults.tasks?.length && !searchResults.messages?.length && !searchResults.comments?.length) && (
                    <div className="text-center py-12 text-gray-400 font-medium">No results found for "{searchQuery}"</div>
                  )}
                </>
              )}

              {!searchResults && !isSearching && (
                <div className="text-center py-12 text-gray-400 font-medium">Type a search query to search across this workspace</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-[#FAFAFA] text-gray-500 font-semibold">Loading CollabHub...</div>}>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </Suspense>
  )
}
