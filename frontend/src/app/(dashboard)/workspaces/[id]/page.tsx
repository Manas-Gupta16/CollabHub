"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Settings, Hash, MoreHorizontal, Activity, ArrowUpRight, MessageSquare, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { getWorkspaceById } from "@/lib/api"
import { useRouter } from "next/navigation"

import { use } from "react"

export default function WorkspaceOverview({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const resolvedParams = use(params)
  const id = resolvedParams.id

  const { data: workspace, isLoading } = useQuery({
    queryKey: ['workspace', id],
    queryFn: () => getWorkspaceById(id),
    enabled: !!id
  })

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading workspace...</div>
  }

  if (!workspace) {
    return <div className="p-8 text-center text-gray-500">Workspace not found</div>
  }

  const defaultChannel = workspace.channels?.[0]?.name || 'general'
  const members = workspace.members || []
  const initials = workspace.name?.substring(0, 2).toUpperCase() || 'WS'

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAFAFA] p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Breadcrumb & Header */}
        <div>
          <div className="flex items-center text-sm text-gray-500 mb-4 gap-2 font-medium">
            <Link href="/workspaces" className="hover:text-gray-900 transition-colors">Workspaces</Link>
            <span>/</span>
            <span className="text-gray-900">{workspace.name}</span>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold text-2xl">
                {initials}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{workspace.name}</h1>
                <p className="text-gray-500 text-sm mt-1">{workspace.description || 'Workspace overview'}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-gray-200">
                <Users className="w-4 h-4 mr-2" />
                Invite
              </Button>
              <Button variant="outline" className="border-gray-200">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button 
                className="bg-[#6366F1] hover:bg-[#4F46E5] text-white"
                onClick={() => router.push(`/messages?workspace=${workspace._id}&channel=${defaultChannel}`)}
              >
                Open Workspace
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
               <Card>
                 <CardContent className="p-4 flex items-center gap-4">
                   <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-[#6366F1]"><Users className="w-5 h-5"/></div>
                   <div><div className="text-2xl font-bold text-gray-900">{members.length}</div><div className="text-xs font-medium text-gray-500 uppercase">Members</div></div>
                 </CardContent>
               </Card>
               <Card>
                 <CardContent className="p-4 flex items-center gap-4">
                   <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500"><CheckCircle2 className="w-5 h-5"/></div>
                   <div><div className="text-2xl font-bold text-gray-900">{workspace.channels?.length || 0}</div><div className="text-xs font-medium text-gray-500 uppercase">Channels</div></div>
                 </CardContent>
               </Card>
               <Card>
                 <CardContent className="p-4 flex items-center gap-4">
                   <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500"><Activity className="w-5 h-5"/></div>
                   <div><div className="text-2xl font-bold text-gray-900">Active</div><div className="text-xs font-medium text-gray-500 uppercase">Status</div></div>
                 </CardContent>
               </Card>
            </div>

            {/* Channels List */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between py-4">
                <CardTitle className="text-lg">Channels</CardTitle>
                <Button variant="ghost" size="sm" className="text-[#6366F1]">View all</Button>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <div className="divide-y divide-gray-100">
                  {workspace.channels?.map((channel: any, i: number) => (
                    <div 
                      key={i} 
                      onClick={() => router.push(`/messages?workspace=${workspace._id}&channel=${channel.name}`)}
                      className="px-6 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                          <Hash className="w-4 h-4 text-gray-500" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{channel.name}</div>
                          <div className="text-xs text-gray-500">{channel.isPrivate ? 'Private' : 'Public'}</div>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100"><ArrowUpRight className="w-4 h-4 text-gray-400"/></Button>
                    </div>
                  ))}
                  {(!workspace.channels || workspace.channels.length === 0) && (
                    <div className="px-6 py-4 text-sm text-gray-500 text-center">No channels yet</div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex gap-4 relative before:absolute before:left-4 before:top-8 before:bottom-[-24px] before:w-px before:bg-gray-200 last:before:hidden">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 z-10 shrink-0"><MessageSquare className="w-4 h-4"/></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Workspace created</p>
                      <p className="text-xs text-gray-500 mt-1">Recently</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Right Column */}
          <div className="space-y-6">
             {/* Team Members */}
             <Card>
               <CardHeader className="py-4">
                 <CardTitle className="text-lg">Team Members ({members.length})</CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="space-y-4">
                   {members.slice(0, 5).map((member: any, i: number) => {
                     const user = member.user || {}
                     const userName = user.name || `User ${i}`
                     const userSeed = userName.replace(/\s/g, '') || 'Oliver'
                     return (
                       <div key={i} className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-gray-100">
                             <img src={`https://api.dicebear.com/7.x/micah/svg?seed=${userSeed}&backgroundColor=transparent&mouth=smile`} className="w-full h-full object-cover"/>
                           </div>
                           <div>
                             <div className="text-sm font-semibold text-gray-900">{userName}</div>
                             <div className="text-xs text-gray-500">{member.role || 'Member'}</div>
                           </div>
                         </div>
                         <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="w-4 h-4 text-gray-400"/></Button>
                       </div>
                     )
                   })}
                 </div>
                 {members.length > 5 && (
                   <Button variant="outline" className="w-full mt-6">View all {members.length} members</Button>
                 )}
               </CardContent>
             </Card>
          </div>

        </div>

      </div>
    </div>
  )
}
