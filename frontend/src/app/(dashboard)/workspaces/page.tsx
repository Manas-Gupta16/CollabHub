"use client"

import Link from "next/link"
import { Search, Plus, MoreHorizontal, Users, Clock, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { getWorkspaces } from "@/lib/api"

const colorPalette = ['bg-blue-500', 'bg-orange-500', 'bg-purple-500', 'bg-gray-400', 'bg-pink-500', 'bg-emerald-500']
const roles = ['Owner', 'Member', 'Admin', 'Guest']

export default function WorkspacesPage() {
  const { data: workspaces, isLoading } = useQuery({
    queryKey: ['workspaces'],
    queryFn: getWorkspaces,
  })

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-[#F5F8FF] to-[#E9F0FE] p-8 relative">

      {/* Animated character decoration */}
      <div className="absolute bottom-8 right-12 w-24 h-28 opacity-30 hidden xl:block pointer-events-none">
        <img src="https://api.dicebear.com/7.x/micah/svg?seed=WorkspaceBot&backgroundColor=transparent&mouth=smile" alt="" className="w-full h-full object-contain" />
      </div>

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Workspaces</h1>
            <p className="text-gray-500 mt-1">Manage and collaborate across all your projects.</p>
          </div>
          <Button className="bg-[#6366F1] hover:bg-[#4F46E5] text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Workspace
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Search workspaces..."
              className="w-full pl-9 pr-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent transition-all shadow-sm"
            />
          </div>
          <div className="flex gap-2">
            <select className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-lg px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1]">
              <option>All Roles</option>
              <option>Owner</option>
              <option>Admin</option>
              <option>Member</option>
            </select>
            <select className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-lg px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1]">
              <option>Sort by: Recent</option>
              <option>Sort by: Name (A-Z)</option>
              <option>Sort by: Members</option>
            </select>
          </div>
        </div>

        {/* Workspaces Grid */}
        {isLoading ? (
          <div className="text-center py-20 text-gray-400 text-sm">Loading workspaces...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaces?.map((ws: any, i: number) => (
              <Link key={ws._id} href={`/workspaces/${ws._id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-gray-200/60 overflow-hidden group bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-0">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`w-12 h-12 rounded-xl ${colorPalette[i % colorPalette.length]} bg-opacity-10 flex items-center justify-center`}>
                          <Briefcase className={`w-6 h-6 ${colorPalette[i % colorPalette.length].replace('bg-', 'text-')}`} />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                            {roles[i % roles.length]}
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
                          <div key={j} className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                             <img src={`https://api.dicebear.com/7.x/micah/svg?seed=${m.user?.name || `user${j}`}&backgroundColor=f3f4f6`} className="w-full h-full object-cover" />
                          </div>
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
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
