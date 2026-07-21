"use client"

import { useState, useMemo, useEffect, useRef, Suspense } from "react"
import {
  Plus, Search, CheckCircle2, Circle, Clock,
  MoreHorizontal, Trash2, MessageSquare, X,
  ArrowUpDown, ListTodo, Check
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getWorkspaces, getTasks, createTask, updateTaskStatus,
  updateTask, deleteTask, getTaskComments, addTaskComment
} from "@/lib/api"
import { useSearchParams, useRouter } from "next/navigation"

// ── Helpers ──────────────────────────────────────────────

const STATUS_OPTIONS = [
  { value: "TODO", label: "Todo", icon: Circle, color: "text-gray-400", bg: "bg-gray-50 border-gray-200 text-gray-600" },
  { value: "IN_PROGRESS", label: "In Progress", icon: Clock, color: "text-[#6366F1]", bg: "bg-indigo-50 border-indigo-200 text-indigo-700" },
  { value: "DONE", label: "Done", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50 border-emerald-200 text-emerald-700" },
] as const

const PRIORITY_OPTIONS = [
  { value: "HIGH", label: "High", dot: "bg-red-500", bg: "bg-red-50 text-red-700 border-red-200" },
  { value: "MEDIUM", label: "Medium", dot: "bg-orange-400", bg: "bg-orange-50 text-orange-700 border-orange-200" },
  { value: "LOW", label: "Low", dot: "bg-blue-400", bg: "bg-blue-50 text-blue-600 border-blue-200" },
] as const

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

function dueDateLabel(dateStr: string) {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const due = new Date(dateStr)
  due.setHours(0, 0, 0, 0)
  const diffDays = Math.floor((due.getTime() - now.getTime()) / 86400000)
  if (diffDays < 0) return { text: `${Math.abs(diffDays)}d overdue`, className: "text-red-600 font-semibold" }
  if (diffDays === 0) return { text: "Today", className: "text-orange-600 font-semibold" }
  if (diffDays === 1) return { text: "Tomorrow", className: "text-orange-500" }
  if (diffDays <= 3) return { text: `In ${diffDays} days`, className: "text-amber-600" }
  return { text: new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), className: "text-gray-500" }
}

// ── Dropdown Component ───────────────────────────────────

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

// ── Main Component ──────────────────────────────────────

function TaskListContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryWorkspaceId = searchParams.get('workspace')

  const queryClient = useQueryClient()

  // UI state
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any | null>(null)
  const [newCommentText, setNewCommentText] = useState("")
  const [searchText, setSearchText] = useState("")

  // Filters
  const [filterStatus, setFilterStatus] = useState<string>("ALL")
  const [filterPriority, setFilterPriority] = useState<string>("ALL")
  const [sortBy, setSortBy] = useState<string>("createdAt")

  // New task form
  const [newTask, setNewTask] = useState({
    title: "", description: "", priority: "MEDIUM", assignee: "", dueDate: ""
  })

  // Workspace data
  const { data: workspaces } = useQuery({ queryKey: ['workspaces'], queryFn: getWorkspaces })
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>("ALL")

  useEffect(() => {
    if (queryWorkspaceId) {
      setSelectedWorkspaceId(queryWorkspaceId)
    }
  }, [queryWorkspaceId])

  // Fetch tasks for all workspaces or a single one
  const workspaceIds = useMemo(() => {
    if (!workspaces) return []
    if (selectedWorkspaceId === "ALL") return workspaces.map((w: any) => w._id)
    return [selectedWorkspaceId]
  }, [workspaces, selectedWorkspaceId])

  // Fetch tasks per workspace
  const taskQueries = useQuery({
    queryKey: ['all-tasks', workspaceIds],
    queryFn: async () => {
      if (workspaceIds.length === 0) return []
      const results = await Promise.all(
        workspaceIds.map(async (id: string) => {
          try {
            const tasks = await getTasks(id)
            const ws = workspaces?.find((w: any) => w._id === id)
            return (tasks || []).map((t: any) => ({
              ...t,
              workspaceId: id,
              workspaceName: ws?.name || 'Unknown',
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

  const allTasks = taskQueries.data || []
  const isLoading = taskQueries.isLoading

  // Apply filters and search
  const filteredTasks = useMemo(() => {
    let result = [...allTasks]

    if (searchText.trim()) {
      const q = searchText.toLowerCase()
      result = result.filter(t => t.title?.toLowerCase().includes(q))
    }
    if (filterStatus !== "ALL") {
      result = result.filter(t => t.status === filterStatus)
    }
    if (filterPriority !== "ALL") {
      result = result.filter(t => (t.priority || "MEDIUM").toUpperCase() === filterPriority)
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "dueDate") {
        if (!a.dueDate && !b.dueDate) return 0
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      }
      if (sortBy === "priority") {
        const order = { HIGH: 0, MEDIUM: 1, LOW: 2 } as any
        return (order[(a.priority || "MEDIUM").toUpperCase()] || 1) - (order[(b.priority || "MEDIUM").toUpperCase()] || 1)
      }
      if (sortBy === "title") return (a.title || "").localeCompare(b.title || "")
      // Default: createdAt desc
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    return result
  }, [allTasks, searchText, filterStatus, filterPriority, sortBy])

  // Counts
  const taskCounts = useMemo(() => ({
    total: allTasks.length,
    todo: allTasks.filter(t => t.status === "TODO").length,
    inProgress: allTasks.filter(t => t.status === "IN_PROGRESS").length,
    done: allTasks.filter(t => t.status === "DONE").length,
  }), [allTasks])

  // Active workspace for creating tasks
  const createWorkspaceId = selectedWorkspaceId === "ALL" ? workspaces?.[0]?._id : selectedWorkspaceId
  const activeWorkspaceMembers = useMemo(() => {
    if (!workspaces || !createWorkspaceId) return []
    const ws = workspaces.find((w: any) => w._id === createWorkspaceId)
    return ws?.members || []
  }, [workspaces, createWorkspaceId])

  const taskWorkspaceMembers = useMemo(() => {
    if (!workspaces || !selectedTask?.workspaceId) return []
    const ws = workspaces.find((w: any) => w._id === selectedTask.workspaceId)
    return ws?.members || []
  }, [workspaces, selectedTask?.workspaceId])

  // ── Mutations ──────────────────────────────────────────

  const createMutation = useMutation({
    mutationFn: (data: any) => createTask(data.workspaceId, data.body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-tasks'] })
      setIsNewTaskModalOpen(false)
      setNewTask({ title: "", description: "", priority: "MEDIUM", assignee: "", dueDate: "" })
    }
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ taskId, status }: { taskId: string, status: string }) => updateTaskStatus(taskId, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['all-tasks'] })
  })

  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, data }: { taskId: string, data: any }) => updateTask(taskId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['all-tasks'] })
  })

  const deleteMutation = useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-tasks'] })
      setSelectedTask(null)
    }
  })

  // Comments
  const { data: comments, refetch: refetchComments } = useQuery({
    queryKey: ['task-comments', selectedTask?._id],
    queryFn: () => getTaskComments(selectedTask._id),
    enabled: !!selectedTask?._id
  })

  const addCommentMutation = useMutation({
    mutationFn: (content: string) => addTaskComment(selectedTask._id, content),
    onSuccess: () => { refetchComments(); setNewCommentText("") }
  })

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.title.trim() || !createWorkspaceId) return
    const wsId = selectedWorkspaceId === "ALL"
      ? (newTask as any).workspaceId || createWorkspaceId
      : createWorkspaceId
    createMutation.mutate({
      workspaceId: wsId,
      body: {
        title: newTask.title,
        description: newTask.description || undefined,
        priority: newTask.priority,
        assignee: newTask.assignee || undefined,
        dueDate: newTask.dueDate || undefined,
      }
    })
  }

  const handleToggleComplete = (task: any) => {
    const nextStatus = task.status === "DONE" ? "TODO" : "DONE"
    updateStatusMutation.mutate({ taskId: task._id, status: nextStatus })
  }

  // ── Render ─────────────────────────────────────────────

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#FAFAFA]">

      {/* Header */}
      <div className="px-8 py-5 border-b border-gray-100 bg-white shrink-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
              <ListTodo className="w-4 h-4 text-gray-600" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 tracking-tight">Tasks</h1>
              <p className="text-[12px] text-gray-500 font-medium">
                {taskCounts.total} total · {taskCounts.todo} todo · {taskCounts.inProgress} active · {taskCounts.done} done
              </p>
            </div>
          </div>
          <Button className="bg-[#6366F1] hover:bg-[#4F46E5] text-white text-[13px] font-semibold h-8 px-3"
            onClick={() => setIsNewTaskModalOpen(true)}>
            <Plus className="w-3.5 h-3.5 mr-1.5" strokeWidth={2.5} />
            New Task
          </Button>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          {/* Workspace Selector */}
          <select
            value={selectedWorkspaceId}
            onChange={(e) => {
              setSelectedWorkspaceId(e.target.value)
              if (e.target.value !== "ALL") router.push(`/tasks?workspace=${e.target.value}`)
              else router.push('/tasks')
            }}
            className="h-7 bg-white border border-gray-200 rounded-md px-2 text-[12px] font-semibold text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
          >
            <option value="ALL">All Workspaces</option>
            {workspaces?.map((ws: any) => (
              <option key={ws._id} value={ws._id}>{ws.name}</option>
            ))}
          </select>

          <div className="w-px h-5 bg-gray-200" />

          {/* Status Filter */}
          <div className="flex items-center bg-gray-100 rounded-md p-0.5">
            {[
              { value: "ALL", label: "All" },
              ...STATUS_OPTIONS.map(s => ({ value: s.value, label: s.label }))
            ].map(opt => (
              <button key={opt.value}
                onClick={() => setFilterStatus(opt.value)}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                  filterStatus === opt.value
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Priority Filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="h-7 bg-white border border-gray-200 rounded-md px-2 text-[12px] font-semibold text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
          >
            <option value="ALL">All Priorities</option>
            {PRIORITY_OPTIONS.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>

          {/* Sort */}
          <Dropdown
            align="left"
            trigger={
              <button className="h-7 flex items-center gap-1 bg-white border border-gray-200 rounded-md px-2 text-[12px] font-semibold text-gray-700 hover:bg-gray-50">
                <ArrowUpDown className="w-3 h-3" />
                Sort
              </button>
            }
          >
            {[
              { value: "createdAt", label: "Newest" },
              { value: "dueDate", label: "Due Date" },
              { value: "priority", label: "Priority" },
              { value: "title", label: "Title" },
            ].map(opt => (
              <button key={opt.value}
                onClick={() => setSortBy(opt.value)}
                className={`w-full text-left px-3 py-1.5 text-[12px] font-medium hover:bg-gray-50 ${
                  sortBy === opt.value ? "text-[#6366F1] font-semibold" : "text-gray-700"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </Dropdown>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search tasks..."
              className="h-7 pl-8 pr-3 bg-white border border-gray-200 rounded-md text-[12px] font-medium text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#6366F1] w-48"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="p-12 text-center text-sm text-gray-400 font-medium">Loading tasks...</div>
        ) : filteredTasks.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center mx-auto mb-3">
              <ListTodo className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-sm font-semibold text-gray-600">No tasks found</p>
            <p className="text-xs text-gray-400 mt-1">
              {searchText || filterStatus !== "ALL" || filterPriority !== "ALL"
                ? "Try adjusting your filters."
                : "Create a new task to get started."}
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="sticky top-0 bg-[#FAFAFA] z-10">
              <tr className="border-b border-gray-200">
                <th className="w-10 px-3 py-2.5" />
                <th className="text-left px-3 py-2.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Title</th>
                <th className="text-left px-3 py-2.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider w-[120px]">Status</th>
                <th className="text-left px-3 py-2.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider w-[100px]">Priority</th>
                <th className="text-left px-3 py-2.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider w-[140px]">Assignee</th>
                <th className="text-left px-3 py-2.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider w-[130px]">Workspace</th>
                <th className="text-left px-3 py-2.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider w-[100px]">Due Date</th>
                <th className="text-left px-3 py-2.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider w-[80px]">Created</th>
                <th className="w-10 px-3 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => {
                const assignee = task.assignee || {}
                const assigneeName = assignee.name || 'Unassigned'
                const assigneeAvatar = assignee.avatar
                  ? `http://localhost:5000${assignee.avatar}`
                  : `https://api.dicebear.com/7.x/initials/svg?seed=${assigneeName.replace(/\s/g, '')}&backgroundColor=6366f1&textColor=ffffff`
                const isDone = task.status === "DONE"
                const statusOpt = STATUS_OPTIONS.find(s => s.value === task.status) || STATUS_OPTIONS[0]
                const priorityVal = (task.priority || "MEDIUM").toUpperCase()
                const priorityOpt = PRIORITY_OPTIONS.find(p => p.value === priorityVal) || PRIORITY_OPTIONS[1]
                const StatusIcon = statusOpt.icon

                return (
                  <tr key={task._id}
                    onClick={() => setSelectedTask(task)}
                    className="border-b border-gray-100 bg-white hover:bg-gray-50/80 transition-colors cursor-pointer group"
                  >
                    {/* Checkbox */}
                    <td className="px-3 py-2.5 text-center">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleToggleComplete(task) }}
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                          isDone
                            ? "bg-emerald-500 border-emerald-500"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        {isDone && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                      </button>
                    </td>

                    {/* Title */}
                    <td className="px-3 py-2.5">
                      <span className={`text-[13px] font-semibold leading-tight ${isDone ? "line-through text-gray-400" : "text-gray-900"}`}>
                        {task.title}
                      </span>
                      {task.description && (
                        <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{task.description}</p>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                      <Dropdown
                        trigger={
                          <button className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[11px] font-semibold ${statusOpt.bg} hover:opacity-80 transition-opacity`}>
                            <StatusIcon className="w-3 h-3" />
                            {statusOpt.label}
                          </button>
                        }
                      >
                        {STATUS_OPTIONS.map(s => {
                          const Icon = s.icon
                          return (
                            <button key={s.value}
                              onClick={() => updateStatusMutation.mutate({ taskId: task._id, status: s.value })}
                              className={`w-full text-left px-3 py-1.5 text-[12px] font-medium hover:bg-gray-50 flex items-center gap-2 ${
                                task.status === s.value ? "text-[#6366F1]" : "text-gray-700"
                              }`}
                            >
                              <Icon className={`w-3.5 h-3.5 ${s.color}`} />
                              {s.label}
                            </button>
                          )
                        })}
                      </Dropdown>
                    </td>

                    {/* Priority */}
                    <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                      <Dropdown
                        trigger={
                          <button className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[11px] font-semibold ${priorityOpt.bg} hover:opacity-80 transition-opacity`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${priorityOpt.dot}`} />
                            {priorityOpt.label}
                          </button>
                        }
                      >
                        {PRIORITY_OPTIONS.map(p => (
                          <button key={p.value}
                            onClick={() => updateTaskMutation.mutate({ taskId: task._id, data: { priority: p.value } })}
                            className={`w-full text-left px-3 py-1.5 text-[12px] font-medium hover:bg-gray-50 flex items-center gap-2 ${
                              priorityVal === p.value ? "text-[#6366F1]" : "text-gray-700"
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${p.dot}`} />
                            {p.label}
                          </button>
                        ))}
                      </Dropdown>
                    </td>

                    {/* Assignee */}
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                          <img src={assigneeAvatar} className="w-full h-full object-cover" alt="" />
                        </div>
                        <span className={`text-[12px] font-medium truncate ${assignee.name ? "text-gray-700" : "text-gray-400"}`}>
                          {assigneeName}
                        </span>
                      </div>
                    </td>

                    {/* Workspace */}
                    <td className="px-3 py-2.5">
                      <span className="text-[11px] font-semibold text-[#6366F1] bg-indigo-50 px-1.5 py-0.5 rounded">
                        {task.workspaceName}
                      </span>
                    </td>

                    {/* Due Date */}
                    <td className="px-3 py-2.5">
                      {task.dueDate ? (
                        <span className={`text-[12px] font-medium ${dueDateLabel(task.dueDate).className}`}>
                          {dueDateLabel(task.dueDate).text}
                        </span>
                      ) : (
                        <span className="text-[12px] text-gray-300">—</span>
                      )}
                    </td>

                    {/* Created */}
                    <td className="px-3 py-2.5">
                      <span className="text-[11px] text-gray-400 font-medium">
                        {relativeTime(task.createdAt)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                      <Dropdown
                        align="right"
                        trigger={
                          <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400">
                            <MoreHorizontal className="w-3.5 h-3.5" />
                          </button>
                        }
                      >
                        <button
                          onClick={() => setSelectedTask(task)}
                          className="w-full text-left px-3 py-1.5 text-[12px] font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          Comments
                        </button>
                        <button
                          onClick={() => { if (confirm("Delete this task?")) deleteMutation.mutate(task._id) }}
                          className="w-full text-left px-3 py-1.5 text-[12px] font-medium text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </Dropdown>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Create Task Modal ──────────────────────────── */}
      {isNewTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-gray-900">New Task</h2>
              <button onClick={() => setIsNewTaskModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateTask}>
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="text-[12px] font-semibold text-gray-700 block mb-1">Title</label>
                  <Input
                    value={newTask.title}
                    onChange={(e) => setNewTask(p => ({ ...p, title: e.target.value }))}
                    placeholder="What needs to be done?"
                    required
                    className="text-sm"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-[12px] font-semibold text-gray-700 block mb-1">Description <span className="text-gray-400 font-normal">(optional)</span></label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask(p => ({ ...p, description: e.target.value }))}
                    placeholder="Add more detail..."
                    rows={2}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6366F1] resize-none"
                  />
                </div>

                {/* Priority & Due Date row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[12px] font-semibold text-gray-700 block mb-1">Priority</label>
                    <div className="flex gap-1">
                      {PRIORITY_OPTIONS.map(p => (
                        <button key={p.value} type="button"
                          onClick={() => setNewTask(prev => ({ ...prev, priority: p.value }))}
                          className={`flex-1 py-1.5 rounded-md text-[11px] font-semibold border transition-colors ${
                            newTask.priority === p.value
                              ? p.bg
                              : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[12px] font-semibold text-gray-700 block mb-1">Due Date</label>
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask(p => ({ ...p, dueDate: e.target.value }))}
                      className="w-full h-9 bg-white border border-gray-200 rounded-lg px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                    />
                  </div>
                </div>

                {/* Assignee & Workspace row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[12px] font-semibold text-gray-700 block mb-1">Assignee</label>
                    <select
                      value={newTask.assignee}
                      onChange={(e) => setNewTask(p => ({ ...p, assignee: e.target.value }))}
                      className="w-full h-9 bg-white border border-gray-200 rounded-lg px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                    >
                      <option value="">Unassigned</option>
                      {activeWorkspaceMembers.map((m: any) => (
                        <option key={m.user?._id || m.user} value={m.user?._id || m.user}>
                          {m.user?.name || m.user?.email || 'Member'}
                        </option>
                      ))}
                    </select>
                  </div>
                  {selectedWorkspaceId === "ALL" && (
                    <div>
                      <label className="text-[12px] font-semibold text-gray-700 block mb-1">Workspace</label>
                      <select
                        value={(newTask as any).workspaceId || createWorkspaceId || ""}
                        onChange={(e) => setNewTask(p => ({ ...p, workspaceId: e.target.value } as any))}
                        className="w-full h-9 bg-white border border-gray-200 rounded-lg px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                      >
                        {workspaces?.map((ws: any) => (
                          <option key={ws._id} value={ws._id}>{ws.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-100">
                <Button type="button" variant="outline" className="text-[13px] h-8" onClick={() => setIsNewTaskModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#6366F1] hover:bg-[#4F46E5] text-white text-[13px] h-8" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Creating..." : "Create Task"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Task Detail / Comments Drawer ─────────────── */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-sm">
          <div className="bg-white h-full w-full max-w-lg p-6 overflow-y-auto flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-start pb-4 border-b border-gray-100 shrink-0">
              <div className="pr-4">
                <h2 className="text-base font-bold text-gray-900 leading-tight">{selectedTask.title}</h2>
                {selectedTask.description && (
                  <p className="text-[13px] text-gray-500 mt-1">{selectedTask.description}</p>
                )}
              </div>
              <button onClick={() => setSelectedTask(null)} className="text-gray-400 hover:text-gray-600 shrink-0 mt-0.5">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 py-5 space-y-5 flex flex-col min-h-0">
              {/* Attributes */}
              <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100 shrink-0">
                <div>
                  <span className="text-[11px] font-bold text-gray-400 block uppercase">Status</span>
                  <Dropdown
                    trigger={
                      <button className={`inline-flex items-center gap-1 mt-1 text-[12px] font-semibold px-2 py-0.5 rounded border ${
                        STATUS_OPTIONS.find(s => s.value === selectedTask.status)?.bg || "bg-gray-50 border-gray-200 text-gray-600"
                      } hover:opacity-80 transition-opacity`}>
                        {STATUS_OPTIONS.find(s => s.value === selectedTask.status)?.label || selectedTask.status}
                      </button>
                    }
                  >
                    {STATUS_OPTIONS.map(s => (
                      <button key={s.value}
                        onClick={() => {
                          updateStatusMutation.mutate({ taskId: selectedTask._id, status: s.value });
                          setSelectedTask((prev: any) => ({ ...prev, status: s.value }));
                        }}
                        className={`w-full text-left px-3 py-1.5 text-[12px] font-medium hover:bg-gray-50 flex items-center gap-2 ${
                          selectedTask.status === s.value ? "text-[#6366F1]" : "text-gray-700"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </Dropdown>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-gray-400 block uppercase">Priority</span>
                  <Dropdown
                    trigger={
                      <button className={`inline-flex items-center gap-1.5 mt-1 text-[12px] font-semibold px-2 py-0.5 rounded border ${
                        PRIORITY_OPTIONS.find(p => p.value === (selectedTask.priority || "MEDIUM").toUpperCase())?.bg || "bg-gray-50 border-gray-200 text-gray-600"
                      } hover:opacity-80 transition-opacity`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          PRIORITY_OPTIONS.find(p => p.value === (selectedTask.priority || "MEDIUM").toUpperCase())?.dot || "bg-gray-400"
                        }`} />
                        {PRIORITY_OPTIONS.find(p => p.value === (selectedTask.priority || "MEDIUM").toUpperCase())?.label || "Medium"}
                      </button>
                    }
                  >
                    {PRIORITY_OPTIONS.map(p => (
                      <button key={p.value}
                        onClick={() => {
                          updateTaskMutation.mutate({ taskId: selectedTask._id, data: { priority: p.value } });
                          setSelectedTask((prev: any) => ({ ...prev, priority: p.value }));
                        }}
                        className={`w-full text-left px-3 py-1.5 text-[12px] font-medium hover:bg-gray-50 flex items-center gap-2 ${
                          (selectedTask.priority || "MEDIUM").toUpperCase() === p.value ? "text-[#6366F1]" : "text-gray-700"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </Dropdown>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-gray-400 block uppercase">Workspace</span>
                  <span className="text-[12px] font-semibold text-gray-700 mt-1 block">{selectedTask.workspaceName}</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-gray-400 block uppercase">Assignee</span>
                  <Dropdown
                    trigger={
                      <button className="flex items-center gap-1.5 mt-1 hover:opacity-80 transition-opacity text-left">
                        <div className="w-4 h-4 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                          <img
                            src={selectedTask.assignee?.avatar
                              ? `http://localhost:5000${selectedTask.assignee.avatar}`
                              : `https://api.dicebear.com/7.x/initials/svg?seed=${(selectedTask.assignee?.name || 'U').replace(/\s/g, '')}&backgroundColor=6366f1&textColor=ffffff`}
                            className="w-full h-full object-cover" alt="" />
                        </div>
                        <span className="text-[12px] font-semibold text-gray-700">{selectedTask.assignee?.name || "Unassigned"}</span>
                      </button>
                    }
                  >
                    <button
                      onClick={() => {
                        updateTaskMutation.mutate({ taskId: selectedTask._id, data: { assignee: "" } });
                        setSelectedTask((prev: any) => ({ ...prev, assignee: null }));
                      }}
                      className="w-full text-left px-3 py-1.5 text-[12px] font-medium hover:bg-gray-50 text-gray-400"
                    >
                      Unassigned
                    </button>
                    {taskWorkspaceMembers.map((m: any) => {
                      const user = m.user || {};
                      const userName = user.name || user.email || 'Member';
                      return (
                        <button key={user._id || m.user}
                          onClick={() => {
                            updateTaskMutation.mutate({ taskId: selectedTask._id, data: { assignee: user._id || user } });
                            setSelectedTask((prev: any) => ({ ...prev, assignee: user }));
                          }}
                          className={`w-full text-left px-3 py-1.5 text-[12px] font-medium hover:bg-gray-50 ${
                            (selectedTask.assignee?._id || selectedTask.assignee) === (user._id || user) ? "text-[#6366F1]" : "text-gray-700"
                          }`}
                        >
                          {userName}
                        </button>
                      );
                    })}
                  </Dropdown>
                </div>
                {selectedTask.dueDate && (
                  <div className="col-span-2 pt-2 border-t border-gray-200/60">
                    <span className="text-[11px] font-bold text-gray-400 block uppercase">Due Date</span>
                    <span className={`text-[12px] font-semibold mt-1 block ${dueDateLabel(selectedTask.dueDate).className}`}>
                      {new Date(selectedTask.dueDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                      {' '}<span className="font-normal">({dueDateLabel(selectedTask.dueDate).text})</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Comments */}
              <div className="space-y-3 flex-1 flex flex-col min-h-0">
                <h3 className="text-[13px] font-bold text-gray-900 shrink-0">Comments</h3>

                <form onSubmit={(e) => { e.preventDefault(); if (!newCommentText.trim()) return; addCommentMutation.mutate(newCommentText) }} className="flex gap-2 shrink-0">
                  <Input
                    value={newCommentText}
                    onChange={e => setNewCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 bg-gray-50 text-sm"
                  />
                  <Button type="submit" className="bg-[#6366F1] hover:bg-[#4F46E5] text-white text-[12px] h-9" disabled={addCommentMutation.isPending}>
                    {addCommentMutation.isPending ? "..." : "Post"}
                  </Button>
                </form>

                <div className="space-y-3 overflow-y-auto flex-1 pr-1 custom-scrollbar">
                  {comments && comments.length > 0 ? (
                    comments.map((c: any) => {
                      const commenterName = c.user?.name || 'Someone'
                      const avatar = c.user?.avatar
                        ? `http://localhost:5000${c.user.avatar}`
                        : `https://api.dicebear.com/7.x/initials/svg?seed=${commenterName.replace(/\s/g, '')}&backgroundColor=6366f1&textColor=ffffff`
                      return (
                        <div key={c._id} className="flex gap-2.5 items-start p-3 bg-gray-50/50 border border-gray-100 rounded-lg">
                          <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-gray-200 bg-gray-100">
                            <img src={avatar} className="w-full h-full object-cover" alt="" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <span className="text-[12px] font-bold text-gray-900">{commenterName}</span>
                              <span className="text-[10px] text-gray-400">{relativeTime(c.createdAt)}</span>
                            </div>
                            <p className="text-[13px] text-gray-700 mt-0.5 leading-relaxed break-words">{c.content}</p>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center py-6 text-[12px] text-gray-400">No comments yet.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default function TaskBoard() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading Tasks...</div>}>
      <TaskListContent />
    </Suspense>
  )
}
