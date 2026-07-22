"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  CheckCircle2, 
  Clock, 
  Users, 
  Plus, 
  FolderKanban, 
  ArrowRight, 
  ListTodo, 
  Activity, 
  Check, 
  Sparkles, 
  Hash, 
  Lock, 
  MessageSquare, 
  Bell, 
  Pin, 
  Calendar, 
  Send,
  AlertCircle,
  UserPlus
} from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api, { 
  getWorkspaces, 
  getTasks, 
  getWorkspaceActivity, 
  updateTaskStatus, 
  createTask, 
  getNotifications, 
  markNotificationRead,
  acceptInvitation,
  rejectInvitation
} from "@/lib/api"
import Link from "next/link"
import { UserAvatar } from "@/components/UserAvatar"
import { useRouter } from "next/navigation"

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

function relativeTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function Dashboard() {
  const queryClient = useQueryClient()
  const router = useRouter()

  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>("ALL")
  const [dashboardTaskFilter, setDashboardTaskFilter] = useState<'ALL' | 'MY_TASKS' | 'IN_PROGRESS' | 'DONE'>('ALL')
  
  // Point 1: Inline Quick Task Bar state
  const [quickTaskTitle, setQuickTaskTitle] = useState("")
  const [quickTaskWsId, setQuickTaskWsId] = useState("")

  // Fetch workspaces
  const { data: workspaces } = useQuery({
    queryKey: ['workspaces'],
    queryFn: getWorkspaces,
  })

  // Set default quick task workspace ID
  useEffect(() => {
    if (workspaces && workspaces.length > 0 && !quickTaskWsId) {
      setQuickTaskWsId(workspaces[0]._id)
    }
  }, [workspaces, quickTaskWsId])

  // Fetch logged in user profile
  const { data: user } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await api.get('/auth/profile')
      return res.data?.user
    },
  })
  const userName = user?.name || 'User'

  // Fetch notifications for Point 8
  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications,
  })

  // Workspace IDs to query
  const workspaceIds = useMemo(() => {
    if (!workspaces) return []
    if (selectedWorkspaceId === "ALL") return workspaces.map((w: any) => w._id)
    return [selectedWorkspaceId]
  }, [workspaces, selectedWorkspaceId])

  // Fetch tasks across selected workspaces
  const { data: tasks, isLoading: isTasksLoading } = useQuery({
    queryKey: ['dashboard-tasks', workspaceIds],
    queryFn: async () => {
      if (workspaceIds.length === 0) return []
      const results = await Promise.all(
        workspaceIds.map(async (id: string) => {
          try {
            const workspaceTasks = await getTasks(id)
            const ws = workspaces?.find((w: any) => w._id === id)
            return (workspaceTasks || []).map((t: any) => ({
              ...t,
              workspaceId: id,
              workspaceName: ws?.name || 'Workspace',
            }))
          } catch {
            return []
          }
        })
      )
      return results.flat()
    },
    enabled: workspaceIds.length > 0,
  })

  // Fetch activity logs across selected workspaces
  const { data: activityList, isLoading: isActivityLoading } = useQuery({
    queryKey: ['dashboard-activity', workspaceIds],
    queryFn: async () => {
      if (workspaceIds.length === 0) return []
      const results = await Promise.all(
        workspaceIds.map(async (id: string) => {
          try {
            const activities = await getWorkspaceActivity(id)
            const ws = workspaces?.find((w: any) => w._id === id)
            return (activities || []).map((a: any) => ({
              ...a,
              workspaceId: id,
              workspaceName: ws?.name || 'Workspace',
            }))
          } catch {
            return []
          }
        })
      )
      return results.flat().sort((a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    },
    enabled: workspaceIds.length > 0,
  })

  // Point 1: Create Quick Task Mutation
  const createQuickTaskMutation = useMutation({
    mutationFn: ({ wsId, title }: { wsId: string; title: string }) => createTask(wsId, { title, status: 'TODO' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-tasks'] })
      setQuickTaskTitle("")
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || "Failed to create quick task.")
    }
  })

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ taskId, status }: { taskId: string, status: string }) => updateTaskStatus(taskId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-tasks'] })
    }
  })

  // Point 8: Notification mutations
  const markReadMutation = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    }
  })

  const acceptInviteMutation = useMutation({
    mutationFn: acceptInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['workspaces'] })
      alert("Invitation accepted!")
    }
  })

  const handleQuickTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!quickTaskTitle.trim()) return
    const targetWsId = quickTaskWsId || (workspaces?.[0]?._id)
    if (!targetWsId) {
      alert("Please select or create a workspace first.")
      return
    }
    createQuickTaskMutation.mutate({ wsId: targetWsId, title: quickTaskTitle.trim() })
  }

  // Stats calculation & Priority breakdown for Point 4
  const totalTasks = tasks?.length || 0
  const inProgressTasks = tasks?.filter((t: any) => t.status === 'IN_PROGRESS').length || 0
  const doneTasks = tasks?.filter((t: any) => t.status === 'DONE').length || 0
  const pendingTasks = tasks?.filter((t: any) => t.status !== 'DONE').length || 0

  const highPriorityCount = tasks?.filter((t: any) => t.priority === 'High').length || 0
  const mediumPriorityCount = tasks?.filter((t: any) => t.priority === 'Medium').length || 0
  const lowPriorityCount = tasks?.filter((t: any) => t.priority === 'Low' || !t.priority).length || 0

  // Point 2: Filtered tasks list (including "Assigned to Me")
  const filteredTasksList = useMemo(() => {
    if (!tasks) return []
    if (dashboardTaskFilter === 'MY_TASKS') {
      return tasks.filter((t: any) => {
        const assigneeId = (t.assignee?._id || t.assignee)?.toString()
        return assigneeId && assigneeId === user?._id?.toString()
      })
    }
    if (dashboardTaskFilter === 'IN_PROGRESS') return tasks.filter((t: any) => t.status === 'IN_PROGRESS')
    if (dashboardTaskFilter === 'DONE') return tasks.filter((t: any) => t.status === 'DONE')
    return tasks
  }, [tasks, dashboardTaskFilter, user])

  // Point 7: Team Members Presence List across selected workspaces
  const activeWorkspace = useMemo(() => {
    if (selectedWorkspaceId !== "ALL") {
      return workspaces?.find((w: any) => w._id === selectedWorkspaceId)
    }
    return workspaces?.[0]
  }, [workspaces, selectedWorkspaceId])

  const totalMembers = useMemo(() => {
    if (!workspaces) return 0
    if (selectedWorkspaceId !== "ALL") {
      const ws = workspaces.find((w: any) => w._id === selectedWorkspaceId)
      return ws?.members?.length || 0
    }
    const memberSet = new Set()
    workspaces.forEach((ws: any) => {
      ws.members?.forEach((m: any) => {
        const id = m.user?._id || m.user
        if (id) memberSet.add(id.toString())
      })
    })
    return memberSet.size
  }, [workspaces, selectedWorkspaceId])

  const activeWorkspaceName = selectedWorkspaceId === "ALL"
    ? "all workspaces"
    : activeWorkspace?.name || 'workspace'

  const summaryText = pendingTasks > 0
    ? `You have ${pendingTasks} active task${pendingTasks > 1 ? 's' : ''} to work on in ${activeWorkspaceName}.`
    : `You're all caught up! No active tasks in ${activeWorkspaceName}.`

  const getGreeting = () => {
    const hr = new Date().getHours()
    if (hr < 12) return 'Good morning'
    if (hr < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAFAFA] p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{getGreeting()}, {userName}</h1>
            <p className="text-xs text-gray-500 mt-1 font-medium">
              {summaryText}
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <select
              value={selectedWorkspaceId}
              onChange={(e) => setSelectedWorkspaceId(e.target.value)}
              className="bg-white border border-gray-200/80 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 shadow-2xs focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="ALL">All Workspaces</option>
              {workspaces?.map((ws: any) => (
                <option key={ws._id} value={ws._id}>{ws.name}</option>
              ))}
            </select>
            <Link href="/tasks">
              <button className="px-4 py-2 bg-[#6366F1] hover:bg-[#4F46E5] rounded-xl text-xs font-semibold text-white transition-all flex items-center gap-1.5 shadow-md shadow-indigo-500/20 cursor-pointer">
                <Plus className="w-4 h-4" />
                New Task
              </button>
            </Link>
          </div>
        </div>

        {/* Point 1: Inline Quick-Task Creation Bar */}
        <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 p-4 sm:p-5 rounded-2xl text-white shadow-md relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
          <form onSubmit={handleQuickTaskSubmit} className="relative z-10 flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs shrink-0">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Quick Add:</span>
            </div>
            <input 
              type="text"
              value={quickTaskTitle}
              onChange={(e) => setQuickTaskTitle(e.target.value)}
              placeholder="What are you working on today? (Type task title and press Enter...)"
              className="flex-1 bg-white/10 backdrop-blur-md border border-white/15 rounded-xl px-4 py-2 text-xs text-white placeholder:text-indigo-200/60 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full"
            />
            {workspaces && workspaces.length > 0 && (
              <select
                value={quickTaskWsId}
                onChange={(e) => setQuickTaskWsId(e.target.value)}
                className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl px-3 py-2 text-xs text-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 shrink-0 w-full sm:w-auto"
              >
                {workspaces.map((ws: any) => (
                  <option key={ws._id} value={ws._id} className="text-gray-900">{ws.name}</option>
                ))}
              </select>
            )}
            <button
              type="submit"
              disabled={!quickTaskTitle.trim() || createQuickTaskMutation.isPending}
              className="w-full sm:w-auto px-4 py-2 bg-white text-indigo-900 hover:bg-indigo-50 disabled:opacity-50 font-bold text-xs rounded-xl shadow-xs transition-all shrink-0 cursor-pointer"
            >
              {createQuickTaskMutation.isPending ? "Adding..." : "+ Add Task"}
            </button>
          </form>
        </div>

        {/* Sleek Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card 
            onClick={() => setDashboardTaskFilter('ALL')}
            className={`border-gray-200/80 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all rounded-2xl bg-white cursor-pointer group active:scale-[0.99] ${
              dashboardTaskFilter === 'ALL' ? 'ring-2 ring-indigo-500' : ''
            }`}
            title="Click to view all tasks"
          >
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400 group-hover:text-indigo-600 uppercase tracking-wider transition-colors">Total Tasks</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{totalTasks}</h3>
              </div>
              <div className="w-11 h-11 rounded-xl bg-indigo-50 text-[#6366F1] group-hover:bg-indigo-600 group-hover:text-white transition-all flex items-center justify-center shrink-0 shadow-inner">
                <FolderKanban className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card 
            onClick={() => setDashboardTaskFilter('IN_PROGRESS')}
            className={`border-gray-200/80 shadow-sm hover:shadow-md hover:border-amber-300 transition-all rounded-2xl bg-white cursor-pointer group active:scale-[0.99] ${
              dashboardTaskFilter === 'IN_PROGRESS' ? 'ring-2 ring-amber-500' : ''
            }`}
            title="Click to filter In Progress tasks"
          >
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400 group-hover:text-amber-600 uppercase tracking-wider transition-colors">In Progress</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{inProgressTasks}</h3>
              </div>
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all flex items-center justify-center shrink-0 shadow-inner">
                <Clock className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card 
            onClick={() => setDashboardTaskFilter('DONE')}
            className={`border-gray-200/80 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all rounded-2xl bg-white cursor-pointer group active:scale-[0.99] ${
              dashboardTaskFilter === 'DONE' ? 'ring-2 ring-emerald-500' : ''
            }`}
            title="Click to filter Done tasks"
          >
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400 group-hover:text-emerald-600 uppercase tracking-wider transition-colors">Done Tasks</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{doneTasks}</h3>
              </div>
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all flex items-center justify-center shrink-0 shadow-inner">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card 
            onClick={() => router.push('/workspaces')}
            className="border-gray-200/80 shadow-sm hover:shadow-md hover:border-blue-300 transition-all rounded-2xl bg-white cursor-pointer group active:scale-[0.99]"
            title="Click to view workspace members"
          >
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400 group-hover:text-blue-600 uppercase tracking-wider transition-colors">Total Members</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{totalMembers}</h3>
              </div>
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all flex items-center justify-center shrink-0 shadow-inner">
                <Users className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Point 4: Task Priority & Health Breakdown Bar */}
        <Card className="border-gray-200/80 shadow-sm rounded-2xl bg-white p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Project Health & Priority Breakdown</h3>
              <p className="text-xs text-gray-400 mt-0.5">Task distribution by urgency across {activeWorkspaceName}</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-red-600">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> High: {highPriorityCount}
              </span>
              <span className="flex items-center gap-1.5 text-amber-600">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Medium: {mediumPriorityCount}
              </span>
              <span className="flex items-center gap-1.5 text-blue-600">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Low: {lowPriorityCount}
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden flex">
            <div className="bg-red-500 h-full" style={{ width: `${totalTasks > 0 ? (highPriorityCount / totalTasks) * 100 : 0}%` }} title="High Priority" />
            <div className="bg-amber-500 h-full" style={{ width: `${totalTasks > 0 ? (mediumPriorityCount / totalTasks) * 100 : 0}%` }} title="Medium Priority" />
            <div className="bg-blue-500 h-full" style={{ width: `${totalTasks > 0 ? (lowPriorityCount / totalTasks) * 100 : 0}%` }} title="Low Priority" />
          </div>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column (Recent Tasks & Active Channels) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Point 2: Recent Tasks with Filter Tabs */}
            <Card className="border-gray-200/80 shadow-sm rounded-2xl bg-white overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    Recent Tasks
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                      {filteredTasksList.length}
                    </span>
                  </h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">Manage deliverables across {activeWorkspaceName}</p>
                </div>

                {/* Point 2: Task Filter Tabs */}
                <div className="flex items-center bg-gray-100 p-1 rounded-xl text-xs font-medium self-start sm:self-auto">
                  {(['ALL', 'MY_TASKS', 'IN_PROGRESS', 'DONE'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setDashboardTaskFilter(filter)}
                      className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                        dashboardTaskFilter === filter 
                          ? 'bg-white text-gray-900 font-semibold shadow-xs' 
                          : 'text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      {filter === 'ALL' ? 'All' : filter === 'MY_TASKS' ? 'My Tasks' : filter === 'IN_PROGRESS' ? 'In Progress' : 'Done'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {isTasksLoading ? (
                  <div className="text-center py-12 text-xs text-gray-400">Loading tasks...</div>
                ) : filteredTasksList.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mx-auto mb-2">
                      <ListTodo className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-semibold text-gray-700">No tasks found</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">No tasks match your selected filter.</p>
                  </div>
                ) : (
                  filteredTasksList.slice(0, 6).map((task: any) => {
                    const assignee = task.assignee || {}
                    const isDone = task.status === 'DONE'

                    return (
                      <div 
                        key={task._id} 
                        className="flex items-center justify-between p-4 hover:bg-gray-50/80 transition-colors group cursor-pointer"
                        onClick={() => updateStatusMutation.mutate({ taskId: task._id, status: isDone ? 'TODO' : 'DONE' })}
                      >
                        <div className="flex items-center gap-3.5 min-w-0 pr-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              updateStatusMutation.mutate({ taskId: task._id, status: isDone ? 'TODO' : 'DONE' })
                            }}
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                              isDone ? "bg-emerald-500 border-emerald-500 text-white" : "border-gray-300 text-transparent hover:border-indigo-400"
                            }`}
                            title={isDone ? "Mark as To Do" : "Mark as Done"}
                          >
                            <Check className="w-3 h-3 stroke-[3]" />
                          </button>

                          <div className="flex items-center gap-2.5 min-w-0">
                            <UserAvatar name={assignee.name || 'Unassigned'} avatar={assignee.avatar} size="w-6 h-6 text-[8px]" />
                            <div className="min-w-0">
                              <h4 className={`font-semibold text-sm truncate ${isDone ? "line-through text-gray-400" : "text-gray-900"}`}>
                                {task.title}
                              </h4>
                              <p className="text-xs text-gray-400 mt-0.5 truncate">
                                {task.status === 'TODO' ? 'To Do' : task.status === 'IN_PROGRESS' ? 'In Progress' : 'Done'} · <span className="font-semibold text-indigo-600">{task.workspaceName}</span>
                              </p>
                            </div>
                          </div>
                        </div>

                        <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-lg border shrink-0 ${
                          task.priority === 'High' ? 'bg-red-50 text-red-700 border-red-200/60' :
                          task.priority === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200/60' :
                          'bg-blue-50 text-blue-700 border-blue-200/60'
                        }`}>
                          {task.priority || 'Medium'}
                        </span>
                      </div>
                    )
                  })
                )}
              </div>
            </Card>

            {/* Point 3: Active Workspace Channels Preview Card */}
            <Card className="border-gray-200/80 shadow-sm rounded-2xl bg-white overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-indigo-600" /> Active Channels
                  </h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">Jump directly into topic discussions</p>
                </div>
                {activeWorkspace && (
                  <Link href={`/messages?workspace=${activeWorkspace._id}&channel=General`} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                    Open Chat &rarr;
                  </Link>
                )}
              </div>

              <div className="divide-y divide-gray-100">
                {(activeWorkspace?.channels || [{ name: 'General', isPrivate: false }]).map((channel: any, i: number) => {
                  const isPrivate = !!channel.isPrivate
                  return (
                    <div 
                      key={i} 
                      onClick={() => router.push(`/messages?workspace=${activeWorkspace?._id}&channel=${channel.name}`)}
                      className="p-4 flex items-center justify-between hover:bg-indigo-50/40 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                          isPrivate ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'
                        }`}>
                          {isPrivate ? <Lock className="w-4 h-4" /> : <Hash className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                            #{channel.name}
                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                              isPrivate ? 'bg-amber-50 text-amber-700 border border-amber-200/60' : 'bg-indigo-50 text-indigo-700 border border-indigo-200/60'
                            }`}>
                              {isPrivate ? 'Private' : 'Public'}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            {isPrivate ? 'Invited members only' : 'Open team discussion'}
                          </p>
                        </div>
                      </div>

                      <button className="px-3 py-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-lg text-xs font-semibold transition-all">
                        Chat &rarr;
                      </button>
                    </div>
                  )
                })}
              </div>
            </Card>

            {/* Point 5: Key Deadlines & Pinned Links Widget */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="border-gray-200/80 shadow-sm rounded-2xl bg-white p-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-indigo-600" /> Key Deadlines
                </h4>
                {activeWorkspace?.keyDeadlines && activeWorkspace.keyDeadlines.length > 0 ? (
                  <div className="space-y-2">
                    {activeWorkspace.keyDeadlines.map((dl: any, i: number) => (
                      <div key={i} className="flex justify-between items-center p-2 rounded-xl bg-gray-50 text-xs">
                        <span className="font-semibold text-gray-800">{dl.title}</span>
                        <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                          {new Date(dl.date).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">No key deadlines set for this workspace.</p>
                )}
              </Card>

              <Card className="border-gray-200/80 shadow-sm rounded-2xl bg-white p-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
                  <Pin className="w-4 h-4 text-red-500" /> Pinned Resources
                </h4>
                {activeWorkspace?.pinnedLinks && activeWorkspace.pinnedLinks.length > 0 ? (
                  <div className="space-y-2">
                    {activeWorkspace.pinnedLinks.map((link: any, i: number) => (
                      <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-semibold text-indigo-600 hover:underline truncate p-1.5 rounded-lg hover:bg-indigo-50">
                        <Pin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        <span className="truncate">{link.title || link.url}</span>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">No pinned resource links.</p>
                )}
              </Card>
            </div>

          </div>

          {/* Right Column (Live Presence, Notifications & Activity Stream) */}
          <div className="space-y-6">

            {/* Point 7: Live Team Presence Roster */}
            <Card className="border-gray-200/80 shadow-sm rounded-2xl bg-white p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-600" /> Team Online ({activeWorkspace?.members?.length || 0})
                </h3>
              </div>

              <div className="space-y-2.5">
                {(activeWorkspace?.members || []).map((m: any, i: number) => {
                  const u = m.user || {}
                  const uName = u.name || 'Member'
                  
                  return (
                    <div key={i} className="flex items-center justify-between p-1.5 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="relative">
                          <UserAvatar name={uName} avatar={u.avatar} size="w-7 h-7 text-[9px]" />
                          <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
                        </div>
                        <span className="text-xs font-semibold text-gray-800 truncate">{uName}</span>
                      </div>
                      <button 
                        onClick={() => router.push(`/messages?workspace=${activeWorkspace?._id}&channel=General`)}
                        className="px-2.5 py-1 text-[10px] font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                      >
                        Chat
                      </button>
                    </div>
                  )
                })}
              </div>
            </Card>

            {/* Point 8: Live Notification Feed Card */}
            <Card className="border-gray-200/80 shadow-sm rounded-2xl bg-white p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-500" /> Notifications
                </h3>
                {notifications && notifications.length > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700">
                    {notifications.filter((n: any) => !n.isRead).length} new
                  </span>
                )}
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
                {notifications && notifications.length > 0 ? (
                  notifications.slice(0, 5).map((notif: any) => (
                    <div key={notif._id} className={`p-3 rounded-xl border text-xs space-y-2 ${
                      notif.isRead ? 'bg-white border-gray-100 text-gray-600' : 'bg-amber-50/30 border-amber-200/60 text-gray-900 font-medium'
                    }`}>
                      <p className="leading-snug">{notif.message}</p>
                      
                      <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                        <span className="text-[10px] text-gray-400">{relativeTime(notif.createdAt)}</span>
                        
                        <div className="flex items-center gap-2">
                          {notif.type === 'INVITATION' && !notif.isRead && (
                            <button
                              onClick={() => acceptInviteMutation.mutate(notif._id)}
                              className="px-2 py-0.5 text-[10px] font-bold bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                            >
                              Accept
                            </button>
                          )}
                          {!notif.isRead && (
                            <button
                              onClick={() => markReadMutation.mutate(notif._id)}
                              className="text-[10px] font-bold text-gray-500 hover:text-gray-800"
                            >
                              Mark Read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 italic text-center py-4">No recent notifications.</p>
                )}
              </div>
            </Card>

            {/* Recent Activity Feed */}
            <Card className="border-gray-200/80 shadow-sm rounded-2xl bg-white flex flex-col overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-600" /> Recent Activity
                </h3>
                <p className="text-xs text-gray-500 font-medium mt-0.5">Timeline for {activeWorkspaceName}</p>
              </div>

              <div className="p-5 space-y-4 overflow-y-auto max-h-[380px] custom-scrollbar flex-1">
                {isActivityLoading ? (
                  <div className="text-center text-xs text-gray-400 py-10">Loading activity...</div>
                ) : !activityList || activityList.length === 0 ? (
                  <div className="text-center text-xs text-gray-400 py-10">No recent activity.</div>
                ) : (
                  activityList.slice(0, 8).map((act: any, i: number) => {
                    const user = act.user || {}
                    const actionText = act.details || (act.action ? act.action.replace(/_/g, ' ').toLowerCase() : '')

                    return (
                      <div key={act._id || i} className="flex gap-3 relative before:absolute before:left-3.5 before:top-8 before:bottom-[-20px] before:w-px before:bg-gray-200/80 last:before:hidden">
                        <div className="z-10 shrink-0">
                          <UserAvatar name={user.name} avatar={user.avatar} size="w-7 h-7 text-[9px]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-gray-700 font-medium leading-relaxed">
                            <span className="font-bold text-gray-900">{user.name || 'Someone'}</span> {actionText}
                          </p>
                          <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {relativeTime(act.createdAt)}
                          </p>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </Card>

          </div>

        </div>

      </div>
    </div>
  )
}
