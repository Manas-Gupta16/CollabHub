"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Settings, Hash, MoreHorizontal, Activity, ArrowUpRight, MessageSquare, CheckCircle2, Plus } from "lucide-react"
import Link from "next/link"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useState, use, useEffect, useRef } from "react"
import { UserAvatar } from "@/components/UserAvatar"
import api, { getWorkspaceById, getWorkspaceStats, getWorkspaceActivity, addMemberToWorkspace, getTasks, createTask, removeMemberFromWorkspace, deleteChannel } from "@/lib/api"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"

function Dropdown({ trigger, children, align = "left" }: {
  trigger: React.ReactNode
  children: React.ReactNode
  align?: "left" | "right"
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <div onClick={(e) => { e.stopPropagation(); setOpen(!open) }}>{trigger}</div>
      {open && (
        <div className={`absolute z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[140px] ${align === "right" ? "right-0" : "left-0"}`}
          onClick={(e) => { e.stopPropagation(); setOpen(false) }}>
          {children}
        </div>
      )}
    </div>
  )
}

export default function WorkspaceOverview({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const resolvedParams = use(params)
  const id = resolvedParams.id

  const queryClient = useQueryClient()
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [showAllMembers, setShowAllMembers] = useState(false)
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskAssignee, setNewTaskAssignee] = useState("")

  const { data: workspace, isLoading } = useQuery({
    queryKey: ['workspace', id],
    queryFn: () => getWorkspaceById(id),
    enabled: !!id
  })

  const { data: userProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await api.get('/auth/profile')
      return res.data?.user
    }
  })

  const { data: stats } = useQuery({
    queryKey: ['workspace-stats', id],
    queryFn: () => getWorkspaceStats(id),
    enabled: !!id
  })

  const { data: activityList } = useQuery({
    queryKey: ['workspace-activity', id],
    queryFn: () => getWorkspaceActivity(id),
    enabled: !!id
  })

  const { data: tasks } = useQuery({
    queryKey: ['workspace-tasks', id],
    queryFn: () => getTasks(id),
    enabled: !!id
  })

  const removeMemberMutation = useMutation({
    mutationFn: (userId: string) => removeMemberFromWorkspace(id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace', id] })
      alert("Member removed successfully!")
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || "Failed to remove member.")
    }
  })

  const deleteChannelMutation = useMutation({
    mutationFn: (channelName: string) => deleteChannel(id, channelName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace', id] })
      alert("Channel deleted successfully!")
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || "Failed to delete channel.")
    }
  })

  const createTaskMutation = useMutation({
    mutationFn: (data: any) => createTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace-tasks', id] })
      queryClient.invalidateQueries({ queryKey: ['workspace-stats', id] })
      setIsNewTaskModalOpen(false)
      setNewTaskTitle("")
      setNewTaskAssignee("")
    }
  })

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return
    createTaskMutation.mutate({ title: newTaskTitle, status: 'TODO', assignee: newTaskAssignee || undefined })
  }

  const inviteMutation = useMutation({
    mutationFn: (email: string) => addMemberToWorkspace(id, email, 'MEMBER'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace', id] })
      setIsInviteModalOpen(false)
      setInviteEmail("")
      alert("User invited successfully!")
    },
    onError: () => {
      alert("Failed to invite user. They might not exist.")
    }
  })

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteEmail.trim()) return
    inviteMutation.mutate(inviteEmail)
  }

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading workspace...</div>
  }

  if (!workspace) {
    return <div className="p-8 text-center text-gray-500">Workspace not found</div>
  }

  const wsGradients = [
    'from-indigo-500 to-indigo-600',
    'from-amber-500 to-orange-500',
    'from-emerald-500 to-emerald-600',
    'from-blue-500 to-blue-600',
    'from-pink-500 to-rose-500',
    'from-violet-500 to-purple-600',
  ]

  function getWsGradient(name: string) {
    let hash = 0
    for (let i = 0; i < (name || '').length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
    return wsGradients[Math.abs(hash) % wsGradients.length]
  }

  const initials = workspace.name?.substring(0, 2).toUpperCase() || 'WS'
  const headerGradient = getWsGradient(workspace.name || '')
  const defaultChannel = workspace.channels?.[0]?.name || 'General'
  const members = workspace.members || []
  const currentUserMember = workspace.members?.find((m: any) => (m.user?._id || m.user) === userProfile?._id)
  const canManageChannels = currentUserMember?.role === 'OWNER' || currentUserMember?.role === 'ADMIN'
  const isOwner = currentUserMember?.role === 'OWNER'

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
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center font-bold text-2xl text-white shadow-md bg-gradient-to-br ${headerGradient}`}>
                {initials}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{workspace.name}</h1>
                <p className="text-gray-500 text-sm mt-1">{workspace.description || 'Workspace overview'}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-gray-200" onClick={() => setIsInviteModalOpen(true)}>
                <Users className="w-4 h-4 mr-2" />
                Invite
              </Button>
              <Button variant="outline" className="border-gray-200" onClick={() => router.push('/settings')}>
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
                   <div><div className="text-2xl font-bold text-gray-900">{stats?.totalMembers || members.length}</div><div className="text-xs font-medium text-gray-500 uppercase">Members</div></div>
                 </CardContent>
               </Card>
               <Card>
                 <CardContent className="p-4 flex items-center gap-4">
                   <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500"><CheckCircle2 className="w-5 h-5"/></div>
                   <div><div className="text-2xl font-bold text-gray-900">{stats?.totalChannels || workspace.channels?.length || 0}</div><div className="text-xs font-medium text-gray-500 uppercase">Channels</div></div>
                 </CardContent>
               </Card>
               <Card>
                 <CardContent className="p-4 flex items-center gap-4">
                   <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500"><Activity className="w-5 h-5"/></div>
                   <div><div className="text-2xl font-bold text-gray-900">{stats?.totalTasks || 0}</div><div className="text-xs font-medium text-gray-500 uppercase">Tasks</div></div>
                 </CardContent>
               </Card>
            </div>

            {/* Tasks Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between py-4">
                <CardTitle className="text-lg">Tasks</CardTitle>
                <Button 
                  size="sm" 
                  className="bg-[#6366F1] hover:bg-[#4F46E5] text-white" 
                  onClick={() => setIsNewTaskModalOpen(true)}
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> New Task
                </Button>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <div className="divide-y divide-gray-100">
                  {tasks?.map((task: any) => {
                    const assignee = task.assignee || task.assignees?.[0] || {}
                    const assigneeName = assignee.name || 'Unassigned'
                    const assigneeAvatar = assignee.avatar ? `http://localhost:5000${assignee.avatar}` : `https://api.dicebear.com/7.x/initials/svg?seed=${assigneeName.replace(/\s/g, '')}&backgroundColor=6366f1&textColor=ffffff`
                    return (
                      <div 
                        key={task._id} 
                        className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <UserAvatar name={assigneeName} avatar={assignee.avatar} size="w-6 h-6 text-[8px]" />
                          <div>
                            <div className="font-semibold text-gray-900 text-sm">{task.title}</div>
                            <div className="text-xs text-gray-500 mt-0.5">Assigned to: <span className="font-semibold">{assigneeName}</span></div>
                          </div>
                        </div>
                        <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded border ${
                          task.status === 'DONE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                          task.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                          'bg-gray-50 text-gray-600 border-gray-100'
                        }`}>
                          {task.status}
                        </span>
                      </div>
                    )
                  })}
                  {(!tasks || tasks.length === 0) && (
                    <div className="px-6 py-8 text-sm text-gray-500 text-center">No tasks in this workspace yet</div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Channels List */}
            <Card className="overflow-visible">
              <CardHeader className="flex flex-row items-center justify-between py-4">
                <CardTitle className="text-lg">Channels</CardTitle>
                <Button variant="ghost" size="sm" className="text-[#6366F1]" onClick={() => router.push(`/messages?workspace=${workspace._id}&channel=${defaultChannel}`)}>View all</Button>
              </CardHeader>
              <CardContent className="px-0 pb-0 overflow-visible">
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
                      <div onClick={(e) => e.stopPropagation()}>
                        <Dropdown
                          align="right"
                          trigger={
                            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 h-8 w-8 text-gray-400 hover:text-gray-600">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          }
                        >
                          <button
                            onClick={() => router.push(`/messages?workspace=${workspace._id}&channel=${channel.name}`)}
                            className="w-full text-left px-3 py-1.5 text-[12px] font-medium text-gray-700 hover:bg-gray-50"
                          >
                            Open Channel
                          </button>
                          {canManageChannels && channel.name.toLowerCase() !== 'general' && (
                            <button
                              onClick={() => {
                                if (confirm(`Delete channel #${channel.name}?`)) {
                                  deleteChannelMutation.mutate(channel.name);
                                }
                              }}
                              className="w-full text-left px-3 py-1.5 text-[12px] font-medium text-red-600 hover:bg-red-50"
                            >
                              Delete Channel
                            </button>
                          )}
                        </Dropdown>
                      </div>
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
                  {activityList && activityList.length > 0 ? activityList.map((act: any, i: number) => (
                    <div key={i} className="flex gap-4 relative before:absolute before:left-4 before:top-8 before:bottom-[-24px] before:w-px before:bg-gray-200 last:before:hidden">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 z-10 shrink-0"><Activity className="w-4 h-4"/></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900"><span className="font-bold">{act.user?.name || 'Someone'}</span> {act.details || (act.action ? act.action.replace(/_/g, ' ').toLowerCase() : '')}</p>
                        <p className="text-xs text-gray-500 mt-1">{new Date(act.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  )) : (
                    <div className="flex gap-4 relative">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 z-10 shrink-0"><MessageSquare className="w-4 h-4"/></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Workspace created</p>
                        <p className="text-xs text-gray-500 mt-1">Recently</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Right Column */}
          <div className="space-y-6">
             {/* Team Members */}
             <Card className="overflow-visible">
               <CardHeader className="py-4">
                 <CardTitle className="text-lg">Team Members ({members.length})</CardTitle>
               </CardHeader>
               <CardContent className="overflow-visible">
                 <div className="space-y-4">
                   {(showAllMembers ? members : members.slice(0, 5)).map((member: any, i: number) => {
                     const user = member.user || {}
                     const userName = user.name || `User ${i}`
                     const userSeed = userName.replace(/\s/g, '') || 'Oliver'
                     return (
                       <div key={i} className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                           <UserAvatar name={userName} avatar={user.avatar} size="w-8 h-8 text-[11px]" />
                           <div>
                             <div className="text-sm font-semibold text-gray-900">{userName}</div>
                             <div className="text-xs text-gray-500">{member.role || 'Member'}</div>
                           </div>
                         </div>
                          {isOwner && member.role !== 'OWNER' ? (
                            <Dropdown
                              align="right"
                              trigger={
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600">
                                  <MoreHorizontal className="w-4 h-4 animate-in fade-in" />
                                </Button>
                              }
                            >
                              <button
                                onClick={() => {
                                  if (confirm(`Remove member ${userName} from the workspace?`)) {
                                    removeMemberMutation.mutate(user._id || user);
                                  }
                                }}
                                className="w-full text-left px-3 py-1.5 text-[12px] font-medium text-red-600 hover:bg-red-50"
                              >
                                Remove Member
                              </button>
                            </Dropdown>
                          ) : (
                            <div className="w-8 h-8" />
                          )}
                       </div>
                     )
                   })}
                 </div>
                 {members.length > 5 && !showAllMembers && (
                   <Button variant="outline" className="w-full mt-6" onClick={() => setShowAllMembers(true)}>View all {members.length} members</Button>
                 )}
               </CardContent>
             </Card>
          </div>

        </div>

        {/* Invite Modal */}
        {isInviteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Invite to Workspace</h2>
              <form onSubmit={handleInvite}>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-900 block mb-1">Email Address</label>
                    <Input 
                      type="email"
                      value={inviteEmail} 
                      onChange={(e) => setInviteEmail(e.target.value)} 
                      placeholder="e.g. colleague@example.com" 
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-8">
                  <Button type="button" variant="outline" onClick={() => setIsInviteModalOpen(false)}>Cancel</Button>
                  <Button type="submit" className="bg-[#6366F1] hover:bg-[#4F46E5] text-white" disabled={inviteMutation.isPending}>
                    {inviteMutation.isPending ? "Inviting..." : "Send Invite"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* New Task Modal */}
        {isNewTaskModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Task</h2>
              <form onSubmit={handleCreateTask}>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-900 block mb-1">Task Title</label>
                    <Input 
                      value={newTaskTitle} 
                      onChange={(e) => setNewTaskTitle(e.target.value)} 
                      placeholder="e.g. Design landing page" 
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-900 block mb-1">Assignee</label>
                    <select
                      value={newTaskAssignee}
                      onChange={(e) => setNewTaskAssignee(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                    >
                      <option value="">Unassigned</option>
                      {(workspace?.members || []).map((m: any) => (
                        <option key={m.user?._id || m.user} value={m.user?._id || m.user}>
                          {m.user?.name || m.user?.email || 'Unknown Member'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-8">
                  <Button type="button" variant="outline" onClick={() => setIsNewTaskModalOpen(false)}>Cancel</Button>
                  <Button type="submit" className="bg-[#6366F1] hover:bg-[#4F46E5] text-white" disabled={createTaskMutation.isPending}>
                    {createTaskMutation.isPending ? "Creating..." : "Create Task"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
