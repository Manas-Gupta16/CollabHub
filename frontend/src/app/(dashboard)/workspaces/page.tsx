"use client"

import Link from "next/link"
import { Search, Plus, MoreHorizontal, Users, Clock, Hash, Layers, Crown, ShieldCheck, ArrowRight, Sparkles, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useState, useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api, { getWorkspaces, createWorkspace } from "@/lib/api"
import { Input } from "@/components/ui/input"
import { UserAvatar } from "@/components/UserAvatar"
import { motion, AnimatePresence } from "framer-motion"

const iconGradients = [
  'from-indigo-500 via-indigo-600 to-violet-600',
  'from-amber-500 via-orange-500 to-red-500',
  'from-emerald-500 via-teal-600 to-cyan-600',
  'from-blue-500 via-indigo-500 to-purple-600',
  'from-pink-500 via-rose-500 to-purple-600',
  'from-violet-500 via-purple-600 to-indigo-600',
]

function getWorkspaceGradient(name: string) {
  let hash = 0
  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return iconGradients[Math.abs(hash) % iconGradients.length]
}

export default function WorkspacesPage() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newWorkspaceName, setNewWorkspaceName] = useState("")
  const [newWorkspaceDesc, setNewWorkspaceDesc] = useState("")

  // Filters
  const [searchText, setSearchText] = useState("")
  const [filterRole, setFilterRole] = useState("ALL")
  const [sortBy, setSortBy] = useState("recent")

  const { data: workspaces, isLoading } = useQuery({
    queryKey: ['workspaces'],
    queryFn: getWorkspaces,
  })

  // Get current user profile to determine role per workspace
  const { data: user } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await api.get('/auth/profile')
      return res.data?.user
    },
  })

  // Helper: get current user's role in a workspace
  const getUserRole = (ws: any) => {
    if (!user?._id || !ws?.members) return 'Member'
    const member = ws.members.find((m: any) => {
      const memberId = m.user?._id || m.user
      return memberId?.toString() === user._id?.toString()
    })
    if (!member) return 'Member'
    const role = member.role || 'MEMBER'
    return role.charAt(0) + role.slice(1).toLowerCase()
  }

  // Filtered & sorted workspaces
  const filteredWorkspaces = useMemo(() => {
    if (!workspaces) return []
    let result = [...workspaces]

    // Search
    if (searchText.trim()) {
      const q = searchText.toLowerCase()
      result = result.filter((ws: any) =>
        ws.name?.toLowerCase().includes(q) ||
        ws.description?.toLowerCase().includes(q)
      )
    }

    // Role filter
    if (filterRole !== "ALL") {
      result = result.filter((ws: any) => {
        const role = getUserRole(ws)
        return role.toUpperCase() === filterRole.toUpperCase()
      })
    }

    // Sort
    if (sortBy === "name") {
      result.sort((a: any, b: any) => (a.name || '').localeCompare(b.name || ''))
    } else if (sortBy === "members") {
      result.sort((a: any, b: any) => (b.members?.length || 0) - (a.members?.length || 0))
    } else {
      // recent — by createdAt desc
      result.sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    }

    return result
  }, [workspaces, searchText, filterRole, sortBy, user])

  const createMutation = useMutation({
    mutationFn: createWorkspace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] })
      setIsModalOpen(false)
      setNewWorkspaceName("")
      setNewWorkspaceDesc("")
    }
  })

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newWorkspaceName.trim()) return
    createMutation.mutate({ name: newWorkspaceName, description: newWorkspaceDesc })
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAFAFA] p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Workspaces</h1>
              {workspaces && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {workspaces.length} {workspaces.length === 1 ? 'workspace' : 'workspaces'}
                </span>
              )}
            </div>
            <p className="text-gray-500 text-sm mt-1">Manage and collaborate across team projects, channels, and deliverables.</p>
          </div>
          <Button 
            className="bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl font-semibold shadow-md shadow-indigo-500/20 px-5 cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Workspace
          </Button>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search workspaces by name or description..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-2xs placeholder:text-gray-400 font-medium"
            />
          </div>
          <div className="flex gap-2 shrink-0">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="bg-white border border-gray-200/80 rounded-xl px-3 py-2.5 text-xs font-semibold text-gray-700 shadow-2xs focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="ALL">All Roles</option>
              <option value="OWNER">Owner</option>
              <option value="ADMIN">Admin</option>
              <option value="MEMBER">Member</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-gray-200/80 rounded-xl px-3 py-2.5 text-xs font-semibold text-gray-700 shadow-2xs focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="recent">Sort by: Recent</option>
              <option value="name">Sort by: Name (A-Z)</option>
              <option value="members">Sort by: Members</option>
            </select>
          </div>
        </div>

        {/* Workspaces Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium text-gray-500">Loading workspaces...</p>
            </div>
          </div>
        ) : filteredWorkspaces.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-gray-200/80 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-[#6366F1] flex items-center justify-center mx-auto mb-3">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 text-sm">
              {searchText || filterRole !== "ALL" ? "No matching workspaces" : "No workspaces yet"}
            </h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              {searchText || filterRole !== "ALL" ? "Try adjusting your search query or filters." : "Create your first workspace to collaborate with your team."}
            </p>
            {!searchText && filterRole === "ALL" && (
              <Button onClick={() => setIsModalOpen(true)} className="mt-4 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl text-xs font-semibold">
                <Plus className="w-4 h-4 mr-1" /> Create Workspace
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredWorkspaces.map((ws: any, idx: number) => {
              const gradient = getWorkspaceGradient(ws.name || '')
              const initials = ws.name?.substring(0, 2).toUpperCase() || 'WS'
              const userRole = getUserRole(ws)
              const channelCount = ws.channels?.length || 0

              return (
                <motion.div
                  key={ws._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                  whileHover={{ y: -6 }}
                >
                  <Link href={`/workspaces/${ws._id}`}>
                    <Card className="hover:shadow-lg hover:border-indigo-300 transition-all cursor-pointer border-gray-200/80 overflow-hidden group bg-white rounded-2xl flex flex-col h-full">
                      <CardContent className="p-6 flex flex-col flex-1 justify-between">
                        <div>
                          {/* Header logo & role */}
                          <div className="flex justify-between items-start mb-4">
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md text-white font-bold text-base ring-4 ring-white`}>
                              {initials}
                            </div>
                            
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1 uppercase tracking-wider ${
                              userRole === 'Owner' ? 'bg-amber-50 text-amber-700 border-amber-200/60' :
                              userRole === 'Admin' ? 'bg-indigo-50 text-indigo-700 border-indigo-200/60' :
                              'bg-gray-100 text-gray-600 border-gray-200/60'
                            }`}>
                              {userRole === 'Owner' && <Crown className="w-3 h-3 text-amber-500 fill-amber-400" />}
                              {userRole === 'Admin' && <ShieldCheck className="w-3 h-3 text-indigo-600" />}
                              {userRole}
                            </span>
                          </div>
                          
                          {/* Title & description */}
                          <h3 className="text-base font-bold text-gray-900 group-hover:text-[#6366F1] transition-colors line-clamp-1 mb-1">
                            {ws.name}
                          </h3>
                          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed h-8">
                            {ws.description || 'Team workspace for projects and chat channels.'}
                          </p>
                          
                          {/* Meta stats */}
                          <div className="flex items-center gap-4 mt-4 text-xs font-medium text-gray-500 border-t border-gray-100 pt-3">
                            <div className="flex items-center gap-1.5">
                              <Users className="w-3.5 h-3.5 text-gray-400" />
                              <span>{ws.members?.length || 0} {ws.members?.length === 1 ? 'member' : 'members'}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Hash className="w-3.5 h-3.5 text-gray-400" />
                              <span>{channelCount} {channelCount === 1 ? 'channel' : 'channels'}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Footer member avatars stack & enter link */}
                        <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between">
                          <div className="flex -space-x-2">
                            {(ws.members || []).slice(0, 4).map((m: any, j: number) => (
                              <UserAvatar key={j} name={m.user?.name} avatar={m.user?.avatar} size="w-7 h-7 border-2 border-white text-[8px]" />
                            ))}
                            {(ws.members?.length || 0) > 4 && (
                              <div className="w-7 h-7 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[9px] font-bold text-gray-600">
                                +{ws.members.length - 4}
                              </div>
                            )}
                          </div>

                          <span className="text-xs font-semibold text-[#6366F1] group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                            Enter <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Create New Workspace Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 border border-gray-100"
              >
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-indigo-600" /> Create Workspace
                  </h2>
                </div>
                <p className="text-xs text-gray-500 mb-4">Set up a new workspace for your team and projects.</p>

                <form onSubmit={handleCreate}>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold uppercase text-gray-500 tracking-wider block mb-1.5">Workspace Name</label>
                      <Input 
                        value={newWorkspaceName} 
                        onChange={(e) => setNewWorkspaceName(e.target.value)} 
                        placeholder="e.g. Product Engineering" 
                        className="rounded-xl border-gray-200 focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase text-gray-500 tracking-wider block mb-1.5">Description</label>
                      <Input 
                        value={newWorkspaceDesc} 
                        onChange={(e) => setNewWorkspaceDesc(e.target.value)} 
                        placeholder="e.g. Workspace for team tasks & chat" 
                        className="rounded-xl border-gray-200 focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <Button type="button" variant="outline" className="rounded-xl border-gray-200 cursor-pointer" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    <Button type="submit" className="bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl font-semibold cursor-pointer" disabled={createMutation.isPending}>
                      {createMutation.isPending ? "Creating..." : "Create Workspace"}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}
