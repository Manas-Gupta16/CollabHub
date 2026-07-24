"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Users, 
  Settings, 
  Hash, 
  MoreHorizontal, 
  Activity, 
  CheckCircle2, 
  Plus, 
  MessageSquare, 
  Clock, 
  ChevronRight, 
  Layers, 
  UserPlus, 
  Crown,
  Check,
  ListTodo,
  Shield,
  ShieldCheck,
  UserCheck,
  UserX
} from "lucide-react"
import Link from "next/link"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useState, use, useEffect, useRef } from "react"
import { UserAvatar } from "@/components/UserAvatar"
import api, { 
  getWorkspaceById, 
  getWorkspaceStats, 
  getWorkspaceActivity, 
  addMemberToWorkspace, 
  getTasks, 
  createTask, 
  removeMemberFromWorkspace, 
  updateMemberRole,
  updateTaskStatus
} from "@/lib/api"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { getSocket } from "@/lib/socket"

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
        <div className={`absolute z-50 mt-1 bg-white border border-gray-200/80 rounded-xl shadow-xl py-1.5 min-w-[170px] transition-all animate-in fade-in zoom-in-95 ${align === "right" ? "right-0" : "left-0"}`}
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
  
  // Task state
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskAssignee, setNewTaskAssignee] = useState("")
  const [taskFilter, setTaskFilter] = useState<'ALL' | 'TODO' | 'IN_PROGRESS' | 'DONE'>('ALL')

  // Real-time Socket Presence
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([])

  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    const handleOnlineList = (ids: string[]) => {
      setOnlineUserIds(ids || [])
    }

    socket.emit("get_online_users")
    socket.on("online_users_list", handleOnlineList)

    return () => {
      socket.off("online_users_list", handleOnlineList)
    }
  }, [])

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

  const updateMemberRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) => updateMemberRole(id, userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace', id] })
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || "Failed to update member role.")
    }
  })

  const updateTaskStatusMutation = useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: string }) => updateTaskStatus(taskId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace-tasks', id] })
      queryClient.invalidateQueries({ queryKey: ['workspace-stats', id] })
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
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-gray-500">Loading workspace dashboard...</p>
        </div>
      </div>
    )
  }

  if (!workspace) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-lg font-bold text-gray-900">Workspace not found</h2>
        <p className="text-sm text-gray-500 mt-1 mb-4">The workspace you are looking for does not exist or you don't have access.</p>
        <Button onClick={() => router.push('/workspaces')} className="bg-[#6366F1] hover:bg-[#4F46E5] text-white">Back to Workspaces</Button>
      </div>
    )
  }

  const wsGradients = [
    'from-indigo-500 via-indigo-600 to-violet-600',
    'from-amber-500 via-orange-500 to-red-500',
    'from-emerald-500 via-teal-600 to-cyan-600',
    'from-blue-500 via-indigo-500 to-purple-600',
    'from-pink-500 via-rose-500 to-purple-600',
    'from-violet-500 via-purple-600 to-indigo-600',
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
  const isOwner = currentUserMember?.role === 'OWNER'

  const allTasks = tasks || []
  const completedTasksCount = allTasks.filter((t: any) => t.status === 'DONE').length
  const totalTasksCount = allTasks.length
  const completionPercentage = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0

  const filteredTasks = allTasks.filter((task: any) => {
    if (taskFilter === 'ALL') return true
    return task.status === taskFilter
  })

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAFAFA] p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 gap-2 font-medium">
          <Link href="/workspaces" className="hover:text-gray-900 transition-colors flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" />
            Workspaces
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-gray-900 font-semibold">{workspace.name}</span>
        </div>

        {/* Workspace Header Card (Theme Matched) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-[#6366F1] border border-indigo-100/80 flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{workspace.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {members.length} {members.length === 1 ? 'member' : 'members'}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active Project
                </span>
              </div>
              <p className="text-gray-500 text-xs mt-1 font-medium max-w-xl">
                {workspace.description || 'Main workspace for team collaboration and project deliverables.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
            <Button 
              variant="outline" 
              className="border-gray-200 hover:bg-gray-50/80 rounded-xl font-semibold text-xs text-gray-700 shadow-2xs cursor-pointer" 
              onClick={() => setIsInviteModalOpen(true)}
            >
              <UserPlus className="w-4 h-4 mr-1.5 text-gray-500" /> Invite Team
            </Button>
            {isOwner && (
              <Button 
                variant="outline" 
                className="border-gray-200 hover:bg-gray-50/80 rounded-xl p-2.5 text-gray-500 cursor-pointer"
                onClick={() => alert("Workspace Settings modal")}
              >
                <Settings className="w-4 h-4" />
              </Button>
            )}
            <Link href={`/messages?workspace=${id}&channel=${defaultChannel}`}>
              <Button className="bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl font-semibold text-xs shadow-md shadow-indigo-500/20 cursor-pointer flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4" /> Open Chat
              </Button>
            </Link>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card 
            onClick={() => {
              const el = document.getElementById('team-members-section')
              el?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="border-gray-200/80 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all rounded-2xl bg-white cursor-pointer group active:scale-[0.99]"
            title="Click to view team members"
          >
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400 group-hover:text-indigo-600 uppercase tracking-wider transition-colors">Team Members</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats?.totalMembers || members.length}</h3>
                <p className="text-xs text-gray-500 mt-0.5">Active collaborators</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-[#6366F1] group-hover:bg-indigo-600 group-hover:text-white transition-all flex items-center justify-center shrink-0 shadow-inner">
                <Users className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card 
            onClick={() => router.push(`/messages?workspace=${workspace._id}&channel=${defaultChannel}`)}
            className="border-gray-200/80 shadow-sm hover:shadow-md hover:border-purple-300 transition-all rounded-2xl bg-white cursor-pointer group active:scale-[0.99]"
            title="Click to open channel messages"
          >
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400 group-hover:text-purple-600 uppercase tracking-wider transition-colors">Channels</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats?.totalChannels || workspace.channels?.length || 0}</h3>
                <p className="text-xs text-gray-500 mt-0.5">Sidebar chat rooms</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all flex items-center justify-center shrink-0 shadow-inner">
                <Hash className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card 
            onClick={() => {
              setTaskFilter('ALL')
              const el = document.getElementById('tasks-section')
              el?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="border-gray-200/80 shadow-sm hover:shadow-md hover:border-amber-300 transition-all rounded-2xl bg-white cursor-pointer group active:scale-[0.99]"
            title="Click to view all tasks"
          >
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400 group-hover:text-amber-600 uppercase tracking-wider transition-colors">Total Tasks</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{totalTasksCount}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{completedTasksCount} completed</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all flex items-center justify-center shrink-0 shadow-inner">
                <ListTodo className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card 
            onClick={() => {
              setTaskFilter('DONE')
              const el = document.getElementById('tasks-section')
              el?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="border-gray-200/80 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all rounded-2xl bg-white cursor-pointer group active:scale-[0.99]"
            title="Click to view completed tasks"
          >
            <CardContent className="p-5 flex items-center justify-between">
              <div className="w-full pr-2">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-semibold text-gray-400 group-hover:text-emerald-600 uppercase tracking-wider transition-colors">Progress</p>
                  <span className="text-xs font-bold text-emerald-600">{completionPercentage}%</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{completedTasksCount}/{totalTasksCount}</h3>
                <div className="w-full bg-gray-100 h-2 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all flex items-center justify-center shrink-0 shadow-inner ml-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column (Tasks & Recent Activity) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Workspace Tasks Section */}
            <Card id="tasks-section" className="border-gray-200/80 shadow-sm rounded-2xl bg-white overflow-hidden scroll-mt-6">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                <div>
                  <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    Tasks & Milestones
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                      {filteredTasks.length}
                    </span>
                  </CardTitle>
                  <p className="text-xs text-gray-500 mt-0.5">Track and manage workspace deliverables</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-gray-100 p-1 rounded-xl text-xs font-medium">
                    {(['ALL', 'TODO', 'IN_PROGRESS', 'DONE'] as const).map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setTaskFilter(filter)}
                        className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                          taskFilter === filter 
                            ? 'bg-white text-gray-900 font-semibold shadow-xs' 
                            : 'text-gray-500 hover:text-gray-800'
                        }`}
                      >
                        {filter === 'ALL' ? 'All' : filter === 'TODO' ? 'To Do' : filter === 'IN_PROGRESS' ? 'In Progress' : 'Done'}
                      </button>
                    ))}
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl font-medium shadow-xs cursor-pointer" 
                    onClick={() => setIsNewTaskModalOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-1" /> New Task
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                  {filteredTasks.map((task: any) => {
                    const assignee = task.assignee || task.assignees?.[0] || {}
                    const assigneeName = assignee.name || 'Unassigned'
                    const isDone = task.status === 'DONE'

                    return (
                      <div 
                        key={task._id} 
                        className="p-4 sm:px-6 flex items-center justify-between hover:bg-gray-50/80 transition-colors group cursor-pointer"
                        onClick={() => {
                          const nextStatus = isDone ? 'TODO' : 'DONE'
                          updateTaskStatusMutation.mutate({ taskId: task._id, status: nextStatus })
                        }}
                      >
                        <div className="flex items-center gap-3.5 min-w-0 pr-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              const nextStatus = isDone ? 'TODO' : 'DONE'
                              updateTaskStatusMutation.mutate({ taskId: task._id, status: nextStatus })
                            }}
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                              isDone 
                                ? 'bg-emerald-500 border-emerald-500 text-white' 
                                : 'border-gray-300 text-transparent hover:border-indigo-400'
                            }`}
                            title={isDone ? "Mark as To Do" : "Mark as Done"}
                          >
                            <Check className="w-3 h-3 stroke-[3]" />
                          </button>
                          <div className="min-w-0">
                            <div className={`font-semibold text-sm truncate ${isDone ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                              {task.title}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <UserAvatar name={assigneeName} avatar={assignee.avatar} size="w-4 h-4 text-[7px]" />
                              <span className="text-xs text-gray-500 truncate">
                                {assigneeName}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border ${
                            isDone ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' :
                            task.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-700 border-blue-200/60' :
                            'bg-gray-100 text-gray-600 border-gray-200/60'
                          }`}>
                            {isDone ? 'Done' : task.status === 'IN_PROGRESS' ? 'In Progress' : 'To Do'}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                  
                  {filteredTasks.length === 0 && (
                    <div className="p-8 text-center">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mx-auto mb-3">
                        <ListTodo className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-semibold text-gray-700">No tasks found</p>
                      <p className="text-xs text-gray-500 mt-1">Create a new task to get started on workspace goals.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Workspace Activity (Moved UP for high visibility) */}
            <Card className="border-gray-200/80 shadow-sm rounded-2xl bg-white">
              <CardHeader className="pb-4 border-b border-gray-100">
                <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-600" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {activityList && activityList.length > 0 ? (
                    activityList.slice(0, 8).map((act: any, i: number) => (
                      <div key={i} className="flex gap-4 relative before:absolute before:left-4 before:top-8 before:bottom-[-24px] before:w-px before:bg-gray-200/80 last:before:hidden">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#6366F1] z-10 shrink-0 shadow-xs">
                          <Activity className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            <span className="font-bold text-gray-900">{act.user?.name || 'A team member'}</span> {act.details || (act.action ? act.action.replace(/_/g, ' ').toLowerCase() : '')}
                          </p>
                          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(act.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex gap-4 relative">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#6366F1] z-10 shrink-0">
                        <Activity className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Workspace initialized</p>
                        <p className="text-xs text-gray-400 mt-1">Ready for team activity updates.</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Right Column (Team Members & Workspace Settings Launcher) */}
          <div className="space-y-6">
            
            {/* Team Members Card */}
            <Card id="team-members-section" className="border-gray-200/80 shadow-sm rounded-2xl bg-white overflow-visible scroll-mt-6">
              <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-100">
                <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  Team Members
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {members.length}
                  </span>
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsInviteModalOpen(true)}
                  className="h-8 w-8 text-indigo-600 hover:bg-indigo-50 rounded-lg cursor-pointer"
                  title="Invite Member"
                >
                  <UserPlus className="w-4 h-4" />
                </Button>
              </CardHeader>

              <CardContent className="pt-4 overflow-visible">
                <div className="space-y-3.5">
                  {(showAllMembers ? members : members.slice(0, 8)).map((member: any, i: number) => {
                    const user = member.user || {}
                    const userName = user.name || `User ${i}`
                    const role = member.role || 'MEMBER'
                    const uId = (user._id || user).toString()
                    const isOnline = onlineUserIds.includes(uId) || (userProfile?._id && uId === userProfile._id.toString())
                    
                    return (
                      <div key={i} className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50/80 transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative">
                            <UserAvatar name={userName} avatar={user.avatar} size="w-9 h-9 text-[11px]" />
                            <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-white rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-gray-300'}`} title={isOnline ? 'Online' : 'Offline'} />
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-bold text-gray-900 truncate flex items-center gap-1.5">
                              {userName}
                              {role === 'OWNER' && <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-400 shrink-0" />}
                              {role === 'ADMIN' && <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                            </div>
                            <div className="text-xs text-gray-400 truncate flex items-center gap-1">
                              <span>{user.email || 'Member'}</span>
                              <span>•</span>
                              <span className={isOnline ? 'text-emerald-600 font-semibold' : 'text-gray-400'}>{isOnline ? 'Online' : 'Offline'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider ${
                            role === 'OWNER' ? 'bg-amber-50 text-amber-700 border border-amber-200/60' :
                            role === 'ADMIN' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/60' :
                            'bg-gray-100 text-gray-600 border border-gray-200/60'
                          }`}>
                            {role}
                          </span>

                          {/* Member Actions (Owner can update role to ADMIN/MEMBER or remove) */}
                          {isOwner && role !== 'OWNER' && (
                            <Dropdown
                              align="right"
                              trigger={
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-gray-700 rounded-lg cursor-pointer">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              }
                            >
                              {role === 'MEMBER' ? (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    updateMemberRoleMutation.mutate({ userId: uId, role: 'ADMIN' })
                                  }}
                                  className="w-full text-left px-3 py-2 text-[12px] font-semibold text-indigo-600 hover:bg-indigo-50 flex items-center gap-2 cursor-pointer"
                                >
                                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" /> Promote to Admin
                                </button>
                              ) : (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    updateMemberRoleMutation.mutate({ userId: uId, role: 'MEMBER' })
                                  }}
                                  className="w-full text-left px-3 py-2 text-[12px] font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                                >
                                  <Shield className="w-3.5 h-3.5 text-gray-400" /> Make Member
                                </button>
                              )}

                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  if (confirm(`Remove member ${userName} from workspace?`)) {
                                    removeMemberMutation.mutate(uId);
                                  }
                                }}
                                className="w-full text-left px-3 py-2 text-[12px] font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                              >
                                <UserX className="w-3.5 h-3.5 text-red-500" /> Remove Member
                              </button>
                            </Dropdown>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {members.length > 8 && !showAllMembers && (
                  <Button 
                    variant="outline" 
                    className="w-full mt-4 border-gray-200 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-50 cursor-pointer" 
                    onClick={() => setShowAllMembers(true)}
                  >
                    View all {members.length} members
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Workspace Settings Card */}
            <Card className="border-gray-200/80 shadow-sm rounded-2xl bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white p-6 relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 text-indigo-300 border border-white/10">
                  <Settings className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Workspace Management</h3>
                <p className="text-xs text-indigo-200 mt-1.5 leading-relaxed">
                  Update workspace details, member permissions, or general preferences.
                </p>
                <div className="mt-4 flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => router.push(`/settings?workspace=${workspace._id}&tab=workspace`)}
                    className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold rounded-xl text-xs shadow-sm cursor-pointer"
                  >
                    Open Settings
                  </Button>
                </div>
              </div>
            </Card>

          </div>

        </div>

        {/* Invite Workspace Member Modal */}
        {isInviteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-indigo-600" /> Invite to Workspace
                </h2>
              </div>
              <p className="text-xs text-gray-500 mb-4">Send an invitation to join <strong className="text-gray-800">{workspace.name}</strong>.</p>
              
              <form onSubmit={handleInvite}>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-gray-500 tracking-wider block mb-1.5">Email Address</label>
                    <Input 
                      type="email"
                      value={inviteEmail} 
                      onChange={(e) => setInviteEmail(e.target.value)} 
                      placeholder="e.g. teammate@collabhub.com" 
                      className="rounded-xl border-gray-200 focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <Button type="button" variant="outline" className="rounded-xl border-gray-200 cursor-pointer" onClick={() => setIsInviteModalOpen(false)}>Cancel</Button>
                  <Button type="submit" className="bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl font-semibold cursor-pointer" disabled={inviteMutation.isPending}>
                    {inviteMutation.isPending ? "Sending..." : "Send Invite"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* New Task Modal */}
        {isNewTaskModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <ListTodo className="w-5 h-5 text-indigo-600" /> Create Workspace Task
                </h2>
              </div>
              
              <form onSubmit={handleCreateTask}>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-gray-500 tracking-wider block mb-1.5">Task Title</label>
                    <Input 
                      value={newTaskTitle} 
                      onChange={(e) => setNewTaskTitle(e.target.value)} 
                      placeholder="e.g. Refactor API authentication" 
                      className="rounded-xl border-gray-200 focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-gray-500 tracking-wider block mb-1.5">Assignee</label>
                    <select
                      value={newTaskAssignee}
                      onChange={(e) => setNewTaskAssignee(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                <div className="flex justify-end gap-3 mt-6">
                  <Button type="button" variant="outline" className="rounded-xl border-gray-200 cursor-pointer" onClick={() => setIsNewTaskModalOpen(false)}>Cancel</Button>
                  <Button type="submit" className="bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl font-semibold cursor-pointer" disabled={createTaskMutation.isPending}>
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
