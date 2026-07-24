"use client"

import { 
  Plus, Search, CheckCircle2, Pin, Calendar, Send, Lock, Hash, 
  Users, UserPlus, Sparkles, MessageSquare, ShieldCheck, Trash2, 
  ExternalLink, Circle, Pencil, Check, X 
} from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api, { 
  getWorkspaces, getWorkspaceMessages, sendMessage, getWorkspaceById, 
  addMemberToChannel, addPinnedLink, deletePinnedLink, addTeamGoal, 
  toggleTeamGoal, deleteTeamGoal, updateMessage, deleteMessage 
} from "@/lib/api"
import { useState, useMemo, useEffect, Suspense } from "react"
import { UserAvatar } from "@/components/UserAvatar"
import { getSocket } from "@/lib/socket"

function MessagesContent() {
  const searchParams = useSearchParams()
  const queryWorkspaceId = searchParams.get('workspace')
  const queryChannel = searchParams.get('channel') || 'General'
  
  const queryClient = useQueryClient()
  const [newMessage, setNewMessage] = useState("")
  const [messageSearch, setMessageSearch] = useState("")
  const [isAddChannelMemberOpen, setIsAddChannelMemberOpen] = useState(false)
  const [memberToAdd, setMemberToAdd] = useState("")

  const [showMentionPopup, setShowMentionPopup] = useState(false)
  const [mentionQuery, setMentionQuery] = useState("")

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

  // Pinned Links & Team Goals state
  const [isAddLinkOpen, setIsAddLinkOpen] = useState(false)
  const [linkTitle, setLinkTitle] = useState("")
  const [linkUrl, setLinkUrl] = useState("")

  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false)
  const [goalTitle, setGoalTitle] = useState("")

  const { data: userProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await api.get('/auth/profile')
      return res.data?.user
    }
  })

  const { data: workspaces } = useQuery({ queryKey: ['workspaces'], queryFn: getWorkspaces })
  const activeWorkspaceId = queryWorkspaceId || workspaces?.[0]?._id

  const { data: activeWorkspace } = useQuery({
    queryKey: ['workspace', activeWorkspaceId],
    queryFn: () => getWorkspaceById(activeWorkspaceId),
    enabled: !!activeWorkspaceId
  })

  const currentChannelObj = activeWorkspace?.channels?.find(
    (c: any) => c.name.toLowerCase() === queryChannel.toLowerCase()
  )
  const isPrivateChannel = !!currentChannelObj?.isPrivate
  const channelMembers = currentChannelObj?.members || []

  const { data: messages, isLoading, isError, error } = useQuery({
    queryKey: ['messages', activeWorkspaceId, queryChannel],
    queryFn: () => getWorkspaceMessages(activeWorkspaceId, queryChannel),
    enabled: !!activeWorkspaceId,
    refetchInterval: 3000
  })

  const sendMutation = useMutation({
    mutationFn: (content: string) => sendMessage(activeWorkspaceId, { content, channel: queryChannel }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', activeWorkspaceId, queryChannel] })
      setNewMessage("")
      setShowMentionPopup(false)
    }
  })

  const addMemberToChannelMutation = useMutation({
    mutationFn: (userId: string) => addMemberToChannel(activeWorkspaceId, queryChannel, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace', activeWorkspaceId] })
      setIsAddChannelMemberOpen(false)
      setMemberToAdd("")
      alert("Member added to channel!")
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || "Failed to add member to channel.")
    }
  })

  // Pinned Links Mutations
  const addPinnedLinkMutation = useMutation({
    mutationFn: (data: { title: string; url: string }) => addPinnedLink(activeWorkspaceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace', activeWorkspaceId] })
      setIsAddLinkOpen(false)
      setLinkTitle("")
      setLinkUrl("")
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || "Failed to add link.")
    }
  })

  const deletePinnedLinkMutation = useMutation({
    mutationFn: (linkId: string) => deletePinnedLink(activeWorkspaceId, linkId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace', activeWorkspaceId] })
    }
  })

  // Team Goals Mutations
  const addTeamGoalMutation = useMutation({
    mutationFn: (data: { title: string }) => addTeamGoal(activeWorkspaceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace', activeWorkspaceId] })
      setIsAddGoalOpen(false)
      setGoalTitle("")
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || "Failed to add goal.")
    }
  })

  const toggleTeamGoalMutation = useMutation({
    mutationFn: (goalId: string) => toggleTeamGoal(activeWorkspaceId, goalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace', activeWorkspaceId] })
    }
  })

  const deleteTeamGoalMutation = useMutation({
    mutationFn: (goalId: string) => deleteTeamGoal(activeWorkspaceId, goalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace', activeWorkspaceId] })
    }
  })

  // Logged in user profile & permissions
  const { data: currentUser } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await api.get('/auth/profile')
      return res.data?.user
    }
  })

  const currentMember = activeWorkspace?.members?.find(
    (m: any) => (m.user?._id || m.user)?.toString() === currentUser?._id?.toString()
  )
  const isOwnerOrAdmin = currentMember?.role === 'OWNER' || currentMember?.role === 'ADMIN'

  // Edit Message State & Mutations
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editingContent, setEditingContent] = useState("")

  const updateMessageMutation = useMutation({
    mutationFn: ({ messageId, content }: { messageId: string; content: string }) => updateMessage(messageId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', activeWorkspaceId, queryChannel] })
      setEditingMessageId(null)
      setEditingContent("")
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || "Failed to update message.")
    }
  })

  const deleteMessageMutation = useMutation({
    mutationFn: (messageId: string) => deleteMessage(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', activeWorkspaceId, queryChannel] })
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || "Failed to delete message.")
    }
  })

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !activeWorkspaceId) return
    sendMutation.mutate(newMessage)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setNewMessage(val)

    const lastAtIndex = val.lastIndexOf('@')
    if (lastAtIndex !== -1 && (lastAtIndex === 0 || val[lastAtIndex - 1] === ' ')) {
      const query = val.slice(lastAtIndex + 1)
      const matchesAnyMember = (activeWorkspace?.members || []).some((m: any) => {
        const uName = (m.user?.name || '').toLowerCase()
        const uEmail = (m.user?.email || '').toLowerCase()
        return uName.includes(query.toLowerCase()) || uEmail.includes(query.toLowerCase())
      })

      if (query.length > 0 && matchesAnyMember) {
        setMentionQuery(query.toLowerCase())
        setShowMentionPopup(true)
        return
      }
    }
    setShowMentionPopup(false)
  }

  const insertMention = (userName: string) => {
    const lastAtIndex = newMessage.lastIndexOf('@')
    if (lastAtIndex !== -1) {
      const prefix = newMessage.slice(0, lastAtIndex)
      setNewMessage(`${prefix}@${userName} `)
    }
    setShowMentionPopup(false)
  }

  const matchingMembers = useMemo(() => {
    if (!activeWorkspace?.members) return []
    return activeWorkspace.members.filter((m: any) => {
      const name = (m.user?.name || '').toLowerCase()
      const email = (m.user?.email || '').toLowerCase()
      return name.includes(mentionQuery) || email.includes(mentionQuery)
    })
  }, [activeWorkspace, mentionQuery])

  const renderMessageContent = (content: string) => {
    if (!content) return null

    // Extract member names from active workspace
    const memberNames = (activeWorkspace?.members || [])
      .map((m: any) => m.user?.name)
      .filter(Boolean)
      .sort((a: string, b: string) => b.length - a.length)

    // Build regex pattern for matching mentions: match known full names first, or fallback to single word mentions
    const escapedNames = memberNames.map((n: string) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    const mentionPattern = escapedNames.length > 0 
      ? `@(?:${escapedNames.join('|')}|[a-zA-Z0-9_]+)`
      : `@[a-zA-Z0-9_]+`

    const regex = new RegExp(`(https?:\\/\\/[^\\s]+|${mentionPattern})`, 'gi')
    const parts = content.split(regex)

    return parts.map((part, i) => {
      if (part.startsWith('http://') || part.startsWith('https://')) {
        return (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-indigo-600 underline hover:text-indigo-800 font-semibold break-all"
          >
            {part}
          </a>
        )
      }
      if (part.startsWith('@')) {
        return (
          <span key={i} className="font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md border border-indigo-100/60 inline-block my-0.5 break-all">
            {part}
          </span>
        )
      }
      return part
    })
  }

  const filteredMessages = (messages || [])?.filter((msg: any) => 
    !messageSearch.trim() || msg.content.toLowerCase().includes(messageSearch.toLowerCase())
  )

  return (
    <div className="flex-1 flex overflow-hidden bg-white">
      
      {/* Center Chat Area */}
      <div className="flex-1 min-w-0 flex flex-col border-r border-gray-100">
        
        {/* Header */}
        <div className="h-14 border-b border-gray-100 flex items-center justify-between px-6 shrink-0 bg-white shadow-2xs z-10">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
              isPrivateChannel ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-[#6366F1]'
            }`}>
              {isPrivateChannel ? <Lock className="w-4 h-4" /> : <Hash className="w-4 h-4" />}
            </div>
            <div>
              <div className="font-bold text-sm text-gray-900 tracking-tight flex items-center gap-2">
                #{queryChannel}
                <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] border uppercase tracking-wider ${
                  isPrivateChannel 
                    ? 'bg-amber-50 text-amber-700 border-amber-200/60' 
                    : 'bg-indigo-50 text-indigo-700 border-indigo-200/60'
                }`}>
                  {isPrivateChannel ? 'Private' : 'Public'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isPrivateChannel && (
              <button
                onClick={() => setIsAddChannelMemberOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 font-semibold text-xs border border-amber-200/60 transition-all cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Add Member
              </button>
            )}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-6 space-y-4 overflow-y-auto custom-scrollbar bg-slate-50/30">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-semibold text-gray-400">Loading messages...</p>
              </div>
            </div>
          ) : isError ? (
            <div className="text-center p-8 bg-red-50 rounded-2xl border border-red-100 max-w-md mx-auto my-12">
              <Lock className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <h3 className="font-bold text-gray-900 text-sm">Access Restricted</h3>
              <p className="text-xs text-gray-500 mt-1">
                {(error as any)?.response?.data?.message || 'You are not a member of this private channel.'}
              </p>
            </div>
          ) : !messages || messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-12 px-4 text-center">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg mb-4 ${
                isPrivateChannel 
                  ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-amber-500/20' 
                  : 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-indigo-500/20'
              }`}>
                {isPrivateChannel ? <Lock className="w-7 h-7" /> : <Hash className="w-7 h-7" />}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                Welcome to #{queryChannel}!
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mt-1.5 leading-relaxed">
                This is the start of the <strong className="text-gray-700 font-semibold">#{queryChannel}</strong> channel. Type a message or mention a teammate with @ to start collaborating.
              </p>

              {/* Starter Suggestions */}
              <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-md">
                <button
                  onClick={() => setNewMessage("Hi team! 👋 Glad to be collaborating here.")}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 border border-gray-200/80 transition-all cursor-pointer shadow-xs hover:border-indigo-200"
                >
                  👋 Send a friendly wave
                </button>
                <button
                  onClick={() => setNewMessage("Here is a quick update on my tasks for today: ")}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 border border-gray-200/80 transition-all cursor-pointer shadow-xs hover:border-indigo-200"
                >
                  📌 Share a status update
                </button>
              </div>
            </div>
          ) : (
            filteredMessages.map((msg: any) => {
              const sender = msg.sender || {}
              const senderName = sender.name || 'Unknown'
              const senderId = (sender._id || sender)?.toString()
              const isSender = senderId && senderId === currentUser?._id?.toString()
              const canDelete = isSender || isOwnerOrAdmin
              const isEditing = editingMessageId === msg._id

              return (
                <div key={msg._id} className="flex gap-3.5 p-3 rounded-2xl hover:bg-white hover:shadow-xs transition-all border border-transparent hover:border-gray-100 group relative">
                  <UserAvatar name={senderName} avatar={sender.avatar || sender.profileImage} size="w-9 h-9 text-[11px]" />
                  
                  <div className="min-w-0 flex-1">
                    <div className="flex gap-2 items-center justify-between mb-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[14px] text-gray-900">{senderName}</span>
                        <span className="text-gray-400 text-[11px] font-medium">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {msg.isEdited && <span className="text-[10px] text-gray-400 italic ml-1">(edited)</span>}
                        </span>
                      </div>

                      {/* Action buttons on hover */}
                      {!isEditing && (canDelete || isSender) && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white border border-gray-200/80 shadow-2xs rounded-lg px-1 py-0.5 shrink-0">
                          {isSender && (
                            <button
                              onClick={() => {
                                setEditingMessageId(msg._id)
                                setEditingContent(msg.content)
                              }}
                              className="p-1 text-gray-400 hover:text-indigo-600 rounded hover:bg-indigo-50 transition-colors cursor-pointer"
                              title="Edit message"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => {
                                if (confirm("Delete this message?")) {
                                  deleteMessageMutation.mutate(msg._id)
                                }
                              }}
                              className="p-1 text-gray-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors cursor-pointer"
                              title="Delete message"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {isEditing ? (
                      <form 
                        onSubmit={(e) => {
                          e.preventDefault()
                          if (editingContent.trim()) {
                            updateMessageMutation.mutate({ messageId: msg._id, content: editingContent.trim() })
                          }
                        }}
                        className="mt-1 space-y-2"
                      >
                        <input
                          type="text"
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          className="w-full text-xs border border-indigo-300 rounded-xl px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                          autoFocus
                        />
                        <div className="flex items-center gap-2">
                          <button
                            type="submit"
                            disabled={!editingContent.trim() || updateMessageMutation.isPending}
                            className="px-2.5 py-1 text-[11px] font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
                          >
                            {updateMessageMutation.isPending ? "Saving..." : "Save"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingMessageId(null)}
                            className="px-2.5 py-1 text-[11px] font-semibold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="text-gray-700 leading-relaxed text-[14px] font-medium whitespace-pre-wrap break-words break-all min-w-0">
                         {renderMessageContent(msg.content)}
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
        
        {/* Input Box with Autocomplete Mention Popup */}
        <form onSubmit={handleSend} className="p-4 sm:p-6 bg-white shrink-0 border-t border-gray-100 relative">
           
           {/* Autocomplete Popup */}
           {showMentionPopup && matchingMembers.length > 0 && (
             <div className="absolute bottom-full mb-2 left-6 right-6 bg-white border border-gray-200 rounded-2xl shadow-xl p-2 z-50 max-h-48 overflow-y-auto animate-in fade-in">
               <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-2 py-1 mb-1">
                 Mention Team Member
               </div>
               {matchingMembers.map((m: any, idx: number) => (
                 <div
                   key={idx}
                   onClick={() => insertMention(m.user?.name)}
                   className="flex items-center gap-2.5 px-3 py-2 hover:bg-indigo-50 rounded-xl cursor-pointer transition-colors"
                 >
                   <UserAvatar name={m.user?.name} avatar={m.user?.avatar} size="w-6 h-6 text-[9px]" />
                   <span className="text-xs font-bold text-gray-900">{m.user?.name}</span>
                   <span className="text-[10px] text-gray-400 font-medium">({m.user?.email})</span>
                 </div>
               ))}
             </div>
           )}

           <div className="border border-gray-200/90 focus-within:border-[#6366F1] focus-within:ring-2 focus-within:ring-indigo-100 rounded-2xl px-4 py-3 flex items-center gap-3 bg-white shadow-xs transition-all">
             <Plus className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors" />
             <input 
               type="text" 
               value={newMessage}
               onChange={handleInputChange}
               placeholder={`Message #${queryChannel}... (type @ to mention a teammate)`} 
               disabled={isError}
               className="flex-1 bg-transparent outline-none text-[14px] text-gray-900 placeholder:text-gray-400 placeholder:font-medium disabled:opacity-50" 
             />
             <button 
               type="submit" 
               disabled={!newMessage.trim() || sendMutation.isPending || isError} 
               className="w-8 h-8 rounded-xl bg-[#6366F1] text-white hover:bg-[#4F46E5] disabled:opacity-40 transition-all flex items-center justify-center shrink-0 cursor-pointer shadow-xs"
             >
                <Send className="w-4 h-4" />
             </button>
           </div>
        </form>
      </div>

      {/* Right Sidebar */}
      <div className="w-[280px] bg-white flex flex-col shrink-0 border-l border-gray-100">
        <div className="p-4 pb-2">
          <div className="bg-gray-50 border border-gray-200/60 rounded-xl p-2.5 flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              value={messageSearch}
              onChange={e => setMessageSearch(e.target.value)}
              placeholder="Search in chat..." 
              className="bg-transparent outline-none text-[13px] text-gray-900 w-full placeholder:text-gray-400 placeholder:font-medium"
            />
          </div>
        </div>
        
        <div className="px-4 py-3 overflow-y-auto custom-scrollbar flex-1 space-y-6">
           {/* If private channel, show channel members */}
           {isPrivateChannel && (
             <div className="bg-amber-50/40 p-3.5 rounded-2xl border border-amber-200/50">
               <div className="flex items-center justify-between mb-2.5">
                 <div className="text-[12px] font-bold text-gray-900 tracking-tight flex items-center gap-1.5">
                   <Lock className="w-3.5 h-3.5 text-amber-600" /> Channel Members
                 </div>
                 <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                   {channelMembers.length}
                 </span>
               </div>
               
               <div className="space-y-2">
                 {channelMembers.map((cm: any, i: number) => {
                   const user = typeof cm === 'object' ? cm : activeWorkspace?.members?.find((m: any) => (m.user?._id || m.user).toString() === cm.toString())?.user || {}
                   const uName = user.name || 'Member'
                   
                   return (
                     <div key={i} className="flex items-center gap-2.5">
                       <UserAvatar name={uName} avatar={user.avatar} size="w-7 h-7 text-[9px]" />
                       <span className="font-semibold text-gray-700 text-[12px] truncate">{uName}</span>
                     </div>
                   )
                 })}

                 {channelMembers.length === 0 && (
                   <p className="text-[11px] text-amber-700/80 font-medium italic pt-1">
                     No extra members added yet. Click "+ Add Member" above to grant access.
                   </p>
                 )}
               </div>
             </div>
           )}

           {/* Workspace Team */}
           <div>
             <div className="text-[12px] font-bold text-gray-900 mb-3 tracking-tight flex items-center justify-between">
               <span>Workspace Team</span>
               <span className="text-[10px] font-semibold text-gray-400">{activeWorkspace?.members?.length || 0}</span>
             </div>
             <div className="space-y-2.5">
               {(activeWorkspace?.members || []).map((member: any, i: number) => {
                 const u = member.user || {}
                 const name = u.name || 'Unknown'
                 const userIdStr = (u._id || u.id || u).toString()
                 
                 // Check if member is online via socket or current logged in user
                 const isOnline = onlineUserIds.includes(userIdStr) || (userProfile?._id && userIdStr === userProfile._id.toString())

                 return (
                   <div key={i} className="flex justify-between items-center cursor-pointer group hover:bg-gray-50 p-1.5 rounded-xl transition-colors">
                     <div className="flex items-center gap-2.5 min-w-0">
                       <UserAvatar name={name} avatar={u.avatar} size="w-7 h-7 text-[9px]" />
                       <div className="min-w-0">
                         <span className="font-semibold text-gray-700 text-[12px] group-hover:text-gray-900 transition-colors truncate block leading-tight">{name}</span>
                         <span className="text-[10px] text-gray-400 font-medium block">{isOnline ? 'Online' : 'Offline'}</span>
                       </div>
                     </div>
                     <div 
                       className={`w-2.5 h-2.5 rounded-full shrink-0 ${isOnline ? 'bg-emerald-500 shadow-xs ring-2 ring-white' : 'bg-gray-300'}`} 
                       title={isOnline ? 'Online' : 'Offline'}
                     ></div>
                   </div>
                 )
               })}
             </div>
           </div>
           
           {/* Workspace Links & Goals */}
            <div className="pt-3 border-t border-gray-100 space-y-5">
              
              {/* Pinned Links Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <Pin className="w-3 h-3 text-red-500" /> Pinned Links
                  </div>
                  <button
                    onClick={() => setIsAddLinkOpen(true)}
                    className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-1.5 py-0.5 rounded transition-all cursor-pointer"
                  >
                    + Add Link
                  </button>
                </div>
                
                {activeWorkspace?.pinnedLinks && activeWorkspace.pinnedLinks.length > 0 ? (
                  <div className="space-y-1.5">
                    {activeWorkspace.pinnedLinks.map((link: any, i: number) => {
                      const linkId = link._id || link.id || i
                      return (
                        <div key={linkId} className="flex items-center justify-between group/link p-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                          <a 
                            href={link.url.startsWith('http') ? link.url : `https://${link.url}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center gap-2 text-gray-700 truncate text-[12px] font-medium hover:text-[#6366F1] transition-colors min-w-0"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-indigo-500 shrink-0"/>
                            <span className="truncate">{link.title || link.url}</span>
                          </a>
                          <button
                            onClick={() => deletePinnedLinkMutation.mutate(linkId)}
                            className="opacity-0 group-hover/link:opacity-100 text-gray-400 hover:text-red-600 transition-opacity p-0.5 cursor-pointer"
                            title="Delete link"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-[12px] text-gray-400 font-medium italic px-1">No pinned links</div>
                )}
              </div>

              {/* Team Goals Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Team Goals
                  </div>
                  <button
                    onClick={() => setIsAddGoalOpen(true)}
                    className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-1.5 py-0.5 rounded transition-all cursor-pointer"
                  >
                    + Add Goal
                  </button>
                </div>
                
                {activeWorkspace?.teamGoals && activeWorkspace.teamGoals.length > 0 ? (
                  <div className="space-y-1.5">
                    {activeWorkspace.teamGoals.map((goal: any, i: number) => {
                      const goalId = goal._id || goal.id || i
                      const isDone = !!goal.isCompleted

                      return (
                        <div key={goalId} className="flex items-center justify-between group/goal p-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                          <button
                            onClick={() => toggleTeamGoalMutation.mutate(goalId)}
                            className="flex items-center gap-2 text-left min-w-0 flex-1 cursor-pointer"
                          >
                            {isDone ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            ) : (
                              <Circle className="w-3.5 h-3.5 text-gray-300 hover:text-indigo-500 shrink-0" />
                            )}
                            <span className={`text-[12px] font-medium truncate ${isDone ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                              {goal.title}
                            </span>
                          </button>
                          <button
                            onClick={() => deleteTeamGoalMutation.mutate(goalId)}
                            className="opacity-0 group-hover/goal:opacity-100 text-gray-400 hover:text-red-600 transition-opacity p-0.5 cursor-pointer ml-1"
                            title="Delete goal"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-[12px] text-gray-400 font-medium italic px-1">No team goals set</div>
                )}
              </div>

            </div>

         </div>
       </div>

      {/* Add Member Modal for Chat */}
      {isAddChannelMemberOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-amber-600" /> Add to #{queryChannel}
            </h2>
            <p className="text-xs text-gray-500 mb-4">Select a workspace member to grant access to this private channel.</p>
            
            <div className="space-y-4">
              <select
                value={memberToAdd}
                onChange={(e) => setMemberToAdd(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">Select a member...</option>
                {(activeWorkspace?.members || [])
                  .filter((m: any) => {
                    const uId = (m.user?._id || m.user).toString()
                    const existingChannelMembers = (channelMembers || []).map((cm: any) => (cm._id || cm).toString())
                    return !existingChannelMembers.includes(uId)
                  })
                  .map((m: any) => (
                    <option key={m.user?._id || m.user} value={m.user?._id || m.user}>
                      {m.user?.name || m.user?.email || 'Member'}
                    </option>
                  ))}
              </select>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setIsAddChannelMemberOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  disabled={!memberToAdd || addMemberToChannelMutation.isPending}
                  onClick={() => {
                    if (memberToAdd) {
                      addMemberToChannelMutation.mutate(memberToAdd)
                    }
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl disabled:opacity-50 cursor-pointer"
                >
                  {addMemberToChannelMutation.isPending ? "Adding..." : "Add to Channel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Pinned Link Modal */}
      {isAddLinkOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 border border-gray-100 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Pin className="w-5 h-5 text-red-500" /> Pin Resource Link
            </h2>
            <p className="text-xs text-gray-500">Add useful doc, Figma, or GitHub URLs for your team.</p>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold uppercase text-gray-500">Link Title</label>
                <input
                  type="text"
                  value={linkTitle}
                  onChange={(e) => setLinkTitle(e.target.value)}
                  placeholder="e.g. Project Specs Docs"
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-gray-500">Resource URL</label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsAddLinkOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={!linkTitle.trim() || !linkUrl.trim() || addPinnedLinkMutation.isPending}
                onClick={() => {
                  addPinnedLinkMutation.mutate({ title: linkTitle.trim(), url: linkUrl.trim() })
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl disabled:opacity-50 cursor-pointer"
              >
                {addPinnedLinkMutation.isPending ? "Pinning..." : "Pin Link"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Team Goal Modal */}
      {isAddGoalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 border border-gray-100 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" /> New Team Goal
            </h2>
            <p className="text-xs text-gray-500">Define a milestone or goal for this workspace.</p>
            
            <div>
              <label className="text-xs font-bold uppercase text-gray-500">Goal Description</label>
              <input
                type="text"
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                placeholder="e.g. Complete v1.0 Release"
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsAddGoalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={!goalTitle.trim() || addTeamGoalMutation.isPending}
                onClick={() => {
                  addTeamGoalMutation.mutate({ title: goalTitle.trim() })
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl disabled:opacity-50 cursor-pointer"
              >
                {addTeamGoalMutation.isPending ? "Adding..." : "Add Goal"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <MessagesContent />
    </Suspense>
  )
}
