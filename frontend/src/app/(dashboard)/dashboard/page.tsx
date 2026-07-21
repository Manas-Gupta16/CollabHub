"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Clock, Users, Plus, FolderKanban, ArrowRight, ListTodo, Activity, Check } from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api, { getWorkspaces, getTasks, getWorkspaceActivity, updateTaskStatus } from "@/lib/api"
import Link from "next/link"
import { UserAvatar } from "@/components/UserAvatar"

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
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>("ALL")

  // Fetch workspaces
  const { data: workspaces } = useQuery({
    queryKey: ['workspaces'],
    queryFn: getWorkspaces,
  })

  // Set default workspace to ALL or first one
  useEffect(() => {
    if (workspaces && workspaces.length > 0 && selectedWorkspaceId === "ALL") {
      // Default to ALL or first workspace
    }
  }, [workspaces])

  // Fetch logged in user profile
  const { data: user } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await api.get('/auth/profile')
      return res.data?.user
    },
  })
  const userName = user?.name || 'User'

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

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ taskId, status }: { taskId: string, status: string }) => updateTaskStatus(taskId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-tasks'] })
    }
  })

  // Stats calculation
  const totalTasks = tasks?.length || 0
  const inProgressTasks = tasks?.filter((t: any) => t.status === 'IN_PROGRESS').length || 0
  const doneTasks = tasks?.filter((t: any) => t.status === 'DONE').length || 0
  const pendingTasks = tasks?.filter((t: any) => t.status !== 'DONE').length || 0

  // Aggregate unique members
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
    : workspaces?.find((w: any) => w._id === selectedWorkspaceId)?.name || 'workspace'

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
    <div className="flex-1 overflow-y-auto bg-[#FAFAFA] p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-5 bg-transparent">
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">{getGreeting()}, {userName}</h1>
            <p className="text-[13px] text-gray-500 font-medium mt-1">
              {summaryText}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedWorkspaceId}
              onChange={(e) => setSelectedWorkspaceId(e.target.value)}
              className="h-8 bg-white border border-gray-200 rounded-lg px-2 text-[12px] font-semibold text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#6366F1] shadow-sm"
            >
              <option value="ALL">All Workspaces</option>
              {workspaces?.map((ws: any) => (
                <option key={ws._id} value={ws._id}>{ws.name}</option>
              ))}
            </select>
            <Link href="/tasks">
              <button className="px-3 h-8 bg-[#6366F1] hover:bg-[#4F46E5] rounded-lg text-[12px] font-semibold text-white transition-colors flex items-center gap-1.5 shadow-sm">
                <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                New Task
              </button>
            </Link>
          </div>
        </div>

        {/* Sleek Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Tasks", val: totalTasks, icon: FolderKanban, color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
            { label: "In Progress", val: inProgressTasks, icon: Clock, color: "text-amber-600 bg-amber-50 border-amber-100" },
            { label: "Done Tasks", val: doneTasks, icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
            { label: "Total Members", val: totalMembers, icon: Users, color: "text-blue-600 bg-blue-50 border-blue-100" },
          ].map((card, i) => {
            const Icon = card.icon
            return (
              <div key={i} className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{card.label}</span>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">{card.val}</h3>
                </div>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center border ${card.color}`}>
                  <Icon className="w-4 h-4" strokeWidth={2.5} />
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Tasks */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Recent Tasks</h3>
                  <p className="text-[12px] text-gray-500 font-medium mt-0.5">Recently updated tasks in {activeWorkspaceName}</p>
                </div>
                <Link href="/tasks" className="text-[12px] font-bold text-[#6366F1] hover:text-[#4F46E5] transition-colors flex items-center gap-1">
                  View Tasks <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="divide-y divide-gray-100">
                {isTasksLoading ? (
                  <div className="text-center py-10 text-xs text-gray-400">Loading tasks...</div>
                ) : !tasks || tasks.length === 0 ? (
                  <div className="text-center py-12 text-xs text-gray-400">No tasks found. Create one to get started!</div>
                ) : (
                  tasks.slice(0, 5).map((task: any) => {
                    const assignee = task.assignee || {}
                    const isDone = task.status === 'DONE'
                    return (
                      <div key={task._id} className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors group">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateStatusMutation.mutate({ taskId: task._id, status: isDone ? 'TODO' : 'DONE' })}
                            className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                              isDone ? "bg-emerald-500 border-emerald-500" : "border-gray-300 hover:border-gray-400"
                            }`}
                          >
                            {isDone && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                          </button>

                          <div className="flex items-center gap-2">
                            <UserAvatar name={assignee.name} avatar={assignee.avatar} size="w-5 h-5 text-[9px]" />
                            <div>
                              <h4 className={`font-semibold text-[13px] leading-tight ${isDone ? "line-through text-gray-400" : "text-gray-900"}`}>
                                {task.title}
                              </h4>
                              <p className="text-[11px] text-gray-400 mt-0.5">
                                {task.status === 'TODO' ? 'Todo' : task.status === 'IN_PROGRESS' ? 'In Progress' : 'Done'} · <span className="font-semibold text-[#6366F1]">{task.workspaceName}</span>
                              </p>
                            </div>
                          </div>
                        </div>

                        <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded border ${
                          task.priority === 'High' ? 'bg-red-50 text-red-600 border-red-100' :
                          task.priority === 'Medium' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                          'bg-blue-50 text-blue-600 border-blue-100'
                        }`}>
                          {task.priority || 'Low'}
                        </span>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            {/* Recent Workspaces */}
            <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Recent Workspaces</h3>
                  <p className="text-[12px] text-gray-500 font-medium mt-0.5">Your recently accessed workspaces</p>
                </div>
                <Link href="/workspaces" className="text-[12px] font-bold text-[#6366F1] hover:text-[#4F46E5] transition-colors flex items-center gap-1">
                  View All <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {workspaces?.slice(0, 4).map((ws: any) => {
                  const gradient = getWsGradient(ws.name || '')
                  const initials = ws.name?.substring(0, 2).toUpperCase() || 'WS'

                  return (
                    <Link key={ws._id} href={`/workspaces/${ws._id}`}>
                      <div className="p-4 rounded-xl border border-gray-200/60 bg-gray-50/30 hover:bg-gray-50/80 hover:border-gray-300 transition-all cursor-pointer group">
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`w-8 h-8 rounded-md ${gradient} flex items-center justify-center font-bold text-[11px] text-white shadow-sm`}>
                            {initials}
                          </div>
                          <div>
                            <h4 className="font-bold text-[13px] text-gray-900 group-hover:text-[#6366F1] transition-colors line-clamp-1">{ws.name}</h4>
                            <p className="text-[11px] font-medium text-gray-500">{ws.members?.length || 0} members</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex -space-x-1.5">
                            {(ws.members || []).slice(0, 3).map((m: any, j: number) => (
                              <UserAvatar key={j} name={m.user?.name} avatar={m.user?.avatar} size="w-5 h-5 text-[9px] border-2 border-white shadow-sm" />
                            ))}
                          </div>
                          <span className="text-[11px] font-bold text-gray-400 group-hover:text-gray-600 transition-colors">Enter &rarr;</span>
                        </div>
                      </div>
                    </Link>
                  )
                }) || (
                  <div className="col-span-2 text-center text-sm text-gray-400 py-8">No workspaces yet. Create one to get started!</div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm h-full flex flex-col overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-900">Recent Activity</h3>
                <p className="text-[12px] text-gray-500 font-medium mt-0.5">Timeline for {activeWorkspaceName}</p>
              </div>

              <div className="p-5 space-y-4 overflow-y-auto max-h-[420px] custom-scrollbar flex-1">
                {isActivityLoading ? (
                  <div className="text-center text-xs text-gray-400 py-10">Loading activity...</div>
                ) : !activityList || activityList.length === 0 ? (
                  <div className="text-center text-xs text-gray-400 py-10">No recent activity.</div>
                ) : (
                  activityList.slice(0, 8).map((act: any, i: number) => {
                    const user = act.user || {}
                    const actionText = act.details || (act.action ? act.action.replace(/_/g, ' ').toLowerCase() : '')

                    return (
                      <div key={act._id || i} className="flex gap-3 relative before:absolute before:left-3.5 before:top-7 before:bottom-[-20px] before:w-px before:bg-gray-100 last:before:hidden">
                        <div className="z-10">
                          <UserAvatar name={user.name} avatar={user.avatar} size="w-7 h-7 text-[10px]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[12px] text-gray-700 font-medium leading-tight">
                            <span className="font-bold text-gray-900">{user.name || 'Someone'}</span> {actionText}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-1">
                            {relativeTime(act.createdAt)}
                          </p>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                <Link href="/activity">
                  <button className="w-full py-1.5 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg text-[12px] font-bold text-gray-600 transition-colors shadow-sm">
                    View All Activity
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
