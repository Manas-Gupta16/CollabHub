"use client"

import { Button } from "@/components/ui/button"
import { Check, Settings, Bell, AtSign, FileText, CheckCircle2, Users, X } from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getNotifications, markNotificationRead, markAllNotificationsRead, acceptInvitation, rejectInvitation } from "@/lib/api"
import { useRouter } from "next/navigation"

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

export default function NotificationsPage() {
  const queryClient = useQueryClient()
  const router = useRouter()

  const { data: notificationsData, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications,
  })

  const markReadMutation = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] })
  })

  const markAllReadMutation = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] })
  })

  const acceptMutation = useMutation({
    mutationFn: acceptInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['workspaces'] })
      alert("Workspace invitation accepted!")
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || "Failed to accept invitation.")
    }
  })

  const rejectMutation = useMutation({
    mutationFn: rejectInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      alert("Workspace invitation declined.")
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || "Failed to decline invitation.")
    }
  })

  const handleNotificationClick = (item: any) => {
    if (!item.isRead && item.type !== 'WORKSPACE_INVITATION') {
      markReadMutation.mutate(item._id)
    }

    const workspaceId = typeof item.workspace === 'object' ? item.workspace?._id : item.workspace
    if (!workspaceId) return

    if (item.type === 'MENTION') {
      const match = item.message?.match(/#([a-zA-Z0-9_-]+)/)
      const channelName = match ? match[1] : 'General'
      router.push(`/messages?workspace=${workspaceId}&channel=${channelName}`)
    } else if (item.type === 'TASK_ASSIGNED' || item.type === 'NEW_COMMENT' || item.type === 'TASK_UPDATED') {
      router.push(`/tasks?workspace=${workspaceId}`)
    } else if (item.type !== 'WORKSPACE_INVITATION') {
      router.push(`/workspaces/${workspaceId}`)
    }
  }

  const notifications = notificationsData || []
  const unreadCount = notifications.filter((n: any) => !n.isRead).length

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#FAFAFA]">

      {/* Header */}
      <div className="px-8 py-5 border-b border-gray-100 bg-white shrink-0">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
                <Bell className="w-4 h-4 text-gray-600" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 tracking-tight">Notifications</h1>
                <p className="text-[12px] text-gray-500 font-medium">
                  You have {unreadCount} unread notification{unreadCount !== 1 && 's'}.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="h-8 text-[12px] border-gray-200 px-3 cursor-pointer" onClick={() => markAllReadMutation.mutate()} disabled={unreadCount === 0 || markAllReadMutation.isPending}>
                <Check className="w-3.5 h-3.5 mr-1.5" />
                {markAllReadMutation.isPending ? "Marking..." : "Mark all as read"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-8 py-6 space-y-4">
          {isLoading ? (
            <div className="text-center py-16 text-sm text-gray-400 font-medium">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center mx-auto mb-3">
                <Bell className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-sm font-semibold text-gray-600">No notifications yet</p>
              <p className="text-xs text-gray-400 mt-1">We'll alert you when something happens.</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {notifications.map((item: any) => {
                let IconComponent = Bell;
                let iconBg = 'bg-gray-100 text-gray-600';
                let title = item.title || 'Notification';
                
                if (item.type === 'WORKSPACE_INVITATION') {
                  IconComponent = Users;
                  iconBg = 'bg-indigo-50 text-[#6366F1]';
                  title = item.title || 'Workspace Invitation';
                } else if (item.type === 'TASK_ASSIGNED') {
                  IconComponent = CheckCircle2;
                  iconBg = 'bg-emerald-50 text-emerald-600';
                  title = item.title || 'Task Assigned';
                } else if (item.type === 'NEW_COMMENT') {
                  IconComponent = FileText;
                  iconBg = 'bg-amber-50 text-amber-600';
                  title = item.title || 'New Comment';
                } else if (item.type === 'MENTION') {
                  IconComponent = AtSign;
                  iconBg = 'bg-pink-50 text-pink-600';
                  title = item.title || 'New Mention';
                }

                return (
                  <div 
                    key={item._id} 
                    onClick={() => handleNotificationClick(item)}
                    className={`flex items-center gap-3 px-4 py-3.5 bg-white rounded-xl border transition-all cursor-pointer group hover:border-indigo-200 hover:shadow-xs ${
                      !item.isRead ? "border-indigo-100 bg-indigo-50/15" : "border-gray-100"
                    }`}
                  >
                     {/* Icon */}
                     <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>
                        <IconComponent className="w-4 h-4" strokeWidth={2}/>
                     </div>

                     {/* Content */}
                     <div className="flex-1 min-w-0">
                       <p className="text-[13px] text-gray-700 leading-tight">
                         <span className="font-semibold text-gray-900">{title}</span>{' '}
                         <span>{item.message}</span>
                       </p>
                       {item.type === 'WORKSPACE_INVITATION' && (
                         <div className="flex gap-2 mt-2">
                           <Button 
                             size="sm" 
                             className="bg-[#6366F1] hover:bg-[#4F46E5] text-white text-[11px] h-7 px-3 rounded-md shadow-sm cursor-pointer"
                             onClick={(e) => {
                               e.stopPropagation()
                               acceptMutation.mutate(item._id)
                             }}
                             disabled={acceptMutation.isPending || rejectMutation.isPending}
                           >
                             {acceptMutation.isPending ? 'Accepting...' : 'Accept'}
                           </Button>
                           <Button 
                             size="sm" 
                             variant="outline" 
                             className="border-gray-200 text-gray-600 text-[11px] h-7 px-3 rounded-md hover:bg-red-50 hover:text-red-600 hover:border-red-100 cursor-pointer"
                             onClick={(e) => {
                               e.stopPropagation()
                               rejectMutation.mutate(item._id)
                             }}
                             disabled={acceptMutation.isPending || rejectMutation.isPending}
                           >
                             {rejectMutation.isPending ? 'Declining...' : 'Decline'}
                           </Button>
                         </div>
                       )}
                     </div>

                     {/* Time */}
                     <span className="text-[11px] text-gray-400 font-medium shrink-0 w-16 text-right">
                       {relativeTime(item.createdAt)}
                     </span>

                     {/* Action dot */}
                     {!item.isRead && item.type !== 'WORKSPACE_INVITATION' && (
                       <button 
                         onClick={(e) => {
                           e.stopPropagation()
                           markReadMutation.mutate(item._id)
                         }} 
                         className="w-2.5 h-2.5 rounded-full bg-[#6366F1] shrink-0 shadow-sm hover:ring-4 ring-indigo-100 transition-all cursor-pointer" 
                         title="Mark as read"
                       />
                     )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
