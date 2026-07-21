"use client"

import { useState, useMemo } from "react"
import {
  CheckCircle2, Clock, Users, MessageSquare, Plus, Trash2,
  UserPlus, Hash, FolderPlus, ArrowRight, Search, Filter,
  ListTodo, ExternalLink
} from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { getWorkspaces, getWorkspaceActivity } from "@/lib/api"
import Link from "next/link"

// Map activity action strings to icons & colors
function getActivityMeta(action: string) {
  if (action.includes("created task")) return { icon: Plus, color: "text-indigo-500", bg: "bg-indigo-50", label: "Task created" }
  if (action.includes("assigned task")) return { icon: UserPlus, color: "text-blue-500", bg: "bg-blue-50", label: "Task assigned" }
  if (action.includes("updated task status") || action.includes("Updated task")) return { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50", label: "Status updated" }
  if (action.includes("commented")) return { icon: MessageSquare, color: "text-amber-500", bg: "bg-amber-50", label: "Comment added" }
  if (action.includes("deleted task")) return { icon: Trash2, color: "text-red-400", bg: "bg-red-50", label: "Task deleted" }
  if (action.includes("added member")) return { icon: UserPlus, color: "text-violet-500", bg: "bg-violet-50", label: "Member added" }
  if (action.includes("created workspace")) return { icon: FolderPlus, color: "text-indigo-500", bg: "bg-indigo-50", label: "Workspace created" }
  if (action.includes("updated role")) return { icon: Users, color: "text-orange-500", bg: "bg-orange-50", label: "Role updated" }
  if (action.includes("created channel")) return { icon: Hash, color: "text-pink-500", bg: "bg-pink-50", label: "Channel created" }
  return { icon: Clock, color: "text-gray-400", bg: "bg-gray-50", label: "Activity" }
}

// Build a link for the activity
function getActivityLink(action: string, details: string, workspaceId: string) {
  const isTask = action.includes("task") || details?.toLowerCase().includes("task")
  const isWorkspace = action.includes("workspace") || action.includes("channel") || action.includes("member") || action.includes("role")

  if (isTask) return `/tasks?workspace=${workspaceId}`
  if (isWorkspace) return `/workspaces/${workspaceId}`
  return null
}

function relativeTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString()
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

export default function ActivityPage() {
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>("ALL")
  const [searchText, setSearchText] = useState("")
  const [filterType, setFilterType] = useState<string>("ALL")

  const { data: workspaces } = useQuery({ queryKey: ['workspaces'], queryFn: getWorkspaces })

  // Fetch activities from selected workspace(s)
  const workspaceIds = useMemo(() => {
    if (!workspaces) return []
    if (selectedWorkspace === "ALL") return workspaces.map((w: any) => w._id)
    return [selectedWorkspace]
  }, [workspaces, selectedWorkspace])

  const { data: allActivities, isLoading } = useQuery({
    queryKey: ['all-activities', workspaceIds],
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

  // Filter & search
  const filteredActivities = useMemo(() => {
    let result = allActivities || []

    if (searchText.trim()) {
      const q = searchText.toLowerCase()
      result = result.filter((a: any) =>
        a.details?.toLowerCase().includes(q) ||
        a.action?.toLowerCase().includes(q) ||
        a.user?.name?.toLowerCase().includes(q)
      )
    }

    if (filterType !== "ALL") {
      result = result.filter((a: any) => {
        const action = (a.details || a.action || '').toLowerCase()
        if (filterType === "TASK") return action.includes("task")
        if (filterType === "MEMBER") return action.includes("member") || action.includes("role")
        if (filterType === "WORKSPACE") return action.includes("workspace") || action.includes("channel")
        return true
      })
    }

    return result
  }, [allActivities, searchText, filterType])

  // Group by date
  const groupedActivities = useMemo(() => {
    const groups: { date: string; dateLabel: string; items: any[] }[] = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    for (const act of filteredActivities) {
      const d = new Date(act.createdAt)
      d.setHours(0, 0, 0, 0)
      const dateKey = d.toISOString().split('T')[0]

      let dateLabel = d.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })
      if (d.getTime() === today.getTime()) dateLabel = "Today"
      else if (d.getTime() === yesterday.getTime()) dateLabel = "Yesterday"

      let group = groups.find(g => g.date === dateKey)
      if (!group) {
        group = { date: dateKey, dateLabel, items: [] }
        groups.push(group)
      }
      group.items.push(act)
    }
    return groups
  }, [filteredActivities])

  const totalCount = allActivities?.length || 0

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#FAFAFA]">

      {/* Header */}
      <div className="px-8 py-5 border-b border-gray-100 bg-white shrink-0">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
                <ListTodo className="w-4 h-4 text-gray-600" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 tracking-tight">Activity</h1>
                <p className="text-[12px] text-gray-500 font-medium">
                  {totalCount} events across your workspaces
                </p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <select
              value={selectedWorkspace}
              onChange={(e) => setSelectedWorkspace(e.target.value)}
              className="h-7 bg-white border border-gray-200 rounded-md px-2 text-[12px] font-semibold text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
            >
              <option value="ALL">All Workspaces</option>
              {workspaces?.map((ws: any) => (
                <option key={ws._id} value={ws._id}>{ws.name}</option>
              ))}
            </select>

            <div className="w-px h-5 bg-gray-200" />

            {/* Type filter */}
            <div className="flex items-center bg-gray-100 rounded-md p-0.5">
              {[
                { value: "ALL", label: "All" },
                { value: "TASK", label: "Tasks" },
                { value: "MEMBER", label: "Members" },
                { value: "WORKSPACE", label: "Workspace" },
              ].map(opt => (
                <button key={opt.value}
                  onClick={() => setFilterType(opt.value)}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                    filterType === opt.value
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="flex-1" />

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search activity..."
                className="h-7 pl-8 pr-3 bg-white border border-gray-200 rounded-md text-[12px] font-medium text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#6366F1] w-48"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Activity List */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-8 py-6 space-y-6">
          {isLoading ? (
            <div className="text-center py-16 text-sm text-gray-400 font-medium">Loading activity...</div>
          ) : groupedActivities.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center mx-auto mb-3">
                <Clock className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-sm font-semibold text-gray-600">No activity found</p>
              <p className="text-xs text-gray-400 mt-1">
                {searchText || filterType !== "ALL" ? "Try adjusting your filters." : "Activity will show up here as you work."}
              </p>
            </div>
          ) : (
            groupedActivities.map(group => (
              <div key={group.date}>
                {/* Date header */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[12px] font-bold text-gray-900">{group.dateLabel}</span>
                  <div className="h-px bg-gray-200 flex-1" />
                  <span className="text-[11px] text-gray-400 font-medium">{group.items.length} events</span>
                </div>

                {/* Activity items */}
                <div className="space-y-1.5">
                  {group.items.map((act: any) => {
                    const meta = getActivityMeta((act.details || act.action || '').toLowerCase())
                    const Icon = meta.icon
                    const userName = act.user?.name || 'Someone'
                    const avatarUrl = act.user?.avatar
                      ? `http://localhost:5000${act.user.avatar}`
                      : `https://api.dicebear.com/7.x/initials/svg?seed=${userName.replace(/\s/g, '')}&backgroundColor=6366f1&textColor=ffffff`
                    const link = getActivityLink(
                      (act.details || act.action || '').toLowerCase(),
                      act.details || '',
                      act.workspaceId
                    )
                    const actionText = act.details || (act.action ? act.action.replace(/_/g, ' ') : '')

                    const content = (
                      <div className={`flex items-center gap-3 px-4 py-3 bg-white rounded-lg border border-gray-100 transition-all group ${
                        link ? "hover:border-gray-200 hover:shadow-sm cursor-pointer" : ""
                      }`}>
                        {/* Icon */}
                        <div className={`w-8 h-8 rounded-lg ${meta.bg} flex items-center justify-center shrink-0`}>
                          <Icon className={`w-4 h-4 ${meta.color}`} strokeWidth={2} />
                        </div>

                        {/* Avatar */}
                        <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                          <img src={avatarUrl} className="w-full h-full object-cover" alt="" />
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] text-gray-700 leading-tight">
                            <span className="font-semibold text-gray-900">{userName}</span>{' '}
                            <span>{actionText}</span>
                          </p>
                        </div>

                        {/* Workspace badge */}
                        <span className={`text-[10px] font-semibold text-white px-1.5 py-0.5 rounded bg-gradient-to-r ${getWsGradient(act.workspaceName || '')} shrink-0`}>
                          {act.workspaceName}
                        </span>

                        {/* Time */}
                        <span className="text-[11px] text-gray-400 font-medium shrink-0 w-14 text-right">
                          {relativeTime(act.createdAt)}
                        </span>

                        {/* Link arrow */}
                        {link && (
                          <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#6366F1] transition-colors shrink-0" />
                        )}
                      </div>
                    )

                    if (link) {
                      return <Link key={act._id} href={link}>{content}</Link>
                    }
                    return <div key={act._id}>{content}</div>
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
