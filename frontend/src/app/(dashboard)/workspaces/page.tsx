"use client"

import Link from "next/link"
import { Search, Plus, MoreHorizontal, Users, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useState, useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api, { getWorkspaces, createWorkspace } from "@/lib/api"
import { Input } from "@/components/ui/input"
import { UserAvatar } from "@/components/UserAvatar"

const iconColors = [
  { bg: 'bg-indigo-100', text: 'text-indigo-600', gradient: 'from-indigo-500 to-indigo-600' },
  { bg: 'bg-amber-100', text: 'text-amber-600', gradient: 'from-amber-500 to-orange-500' },
  { bg: 'bg-emerald-100', text: 'text-emerald-600', gradient: 'from-emerald-500 to-emerald-600' },
  { bg: 'bg-blue-100', text: 'text-blue-600', gradient: 'from-blue-500 to-blue-600' },
  { bg: 'bg-pink-100', text: 'text-pink-600', gradient: 'from-pink-500 to-rose-500' },
  { bg: 'bg-violet-100', text: 'text-violet-600', gradient: 'from-violet-500 to-purple-600' },
]

function getWorkspaceColor(name: string) {
  let hash = 0
  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return iconColors[Math.abs(hash) % iconColors.length]
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
    // Backend stores OWNER, ADMIN, MEMBER — display nicely
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
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-[#F5F8FF] to-[#E9F0FE] p-8 relative">

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Workspaces</h1>
            <p className="text-gray-500 mt-1">Manage and collaborate across all your projects.</p>
          </div>
          <Button className="bg-[#6366F1] hover:bg-[#4F46E5] text-white" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Workspace
          </Button>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Workspace</h2>
              <form onSubmit={handleCreate}>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-900 block mb-1">Workspace Name</label>
                    <Input 
                      value={newWorkspaceName} 
                      onChange={(e) => setNewWorkspaceName(e.target.value)} 
                      placeholder="e.g. Design Team Hub" 
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-900 block mb-1">Description</label>
                    <Input 
                      value={newWorkspaceDesc} 
                      onChange={(e) => setNewWorkspaceDesc(e.target.value)} 
                      placeholder="e.g. Main project workspace" 
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-8">
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                  <Button type="submit" className="bg-[#6366F1] hover:bg-[#4F46E5] text-white" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Creating..." : "Create Workspace"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search workspaces..."
              className="w-full pl-9 pr-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent transition-all shadow-sm"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-lg px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
            >
              <option value="ALL">All Roles</option>
              <option value="OWNER">Owner</option>
              <option value="ADMIN">Admin</option>
              <option value="MEMBER">Member</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-lg px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
            >
              <option value="recent">Sort by: Recent</option>
              <option value="name">Sort by: Name (A-Z)</option>
              <option value="members">Sort by: Members</option>
            </select>
          </div>
        </div>

        {/* Workspaces Grid */}
        {isLoading ? (
          <div className="text-center py-20 text-gray-400 text-sm">Loading workspaces...</div>
        ) : filteredWorkspaces.length === 0 ? (
          <div className="text-center py-20 text-gray-400 text-sm">
            {searchText || filterRole !== "ALL" ? "No workspaces match your filters." : "No workspaces yet. Create one to get started!"}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkspaces.map((ws: any) => {
              const colors = getWorkspaceColor(ws.name || '')
              const initials = ws.name?.substring(0, 2).toUpperCase() || 'WS'
              const userRole = getUserRole(ws)

              return (
                <Link key={ws._id} href={`/workspaces/${ws._id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer border-gray-200/60 overflow-hidden group bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-0">
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-sm`}>
                            <span className="text-white font-bold text-sm">{initials}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[11px] font-medium px-2 py-1 rounded-full ${
                              userRole === 'Owner' ? 'bg-indigo-50 text-indigo-600' :
                              userRole === 'Admin' ? 'bg-amber-50 text-amber-600' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {userRole}
                            </span>
                            <button className="p-1.5 text-gray-400 hover:text-gray-900 rounded-md hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.preventDefault()}>
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#6366F1] transition-colors line-clamp-1 mb-1">
                          {ws.name}
                        </h3>
                        
                        <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1.5">
                            <Users className="w-4 h-4" />
                            <span>{ws.members?.length || 0} members</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            <span>Active</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Footer members avatars */}
                      <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
                        <div className="flex -space-x-2">
                          {(ws.members || []).slice(0, 3).map((m: any, j: number) => (
                            <UserAvatar key={j} name={m.user?.name} avatar={m.user?.avatar} size="w-6 h-6 border-2 border-white text-[8px]" />
                          ))}
                          {(ws.members?.length || 0) > 3 && (
                            <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-medium text-gray-600">
                              +{ws.members.length - 3}
                            </div>
                          )}
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 text-[#6366F1] hover:bg-indigo-50">
                          Enter <span className="ml-1">→</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}
