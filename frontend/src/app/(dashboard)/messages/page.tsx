"use client"

import { Plus, Search, CheckCircle2, Pin, Calendar, Send, Lock, Hash, Users, UserPlus, Sparkles, MessageSquare, ShieldCheck } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getWorkspaces, getWorkspaceMessages, sendMessage, getWorkspaceById, addMemberToChannel } from "@/lib/api"
import { useState, useMemo, Suspense } from "react"
import { UserAvatar } from "@/components/UserAvatar"

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
      if (!query.includes(' ')) {
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
      const name = m.user?.name?.toLowerCase() || ''
      return name.includes(mentionQuery)
    })
  }, [activeWorkspace, mentionQuery])

  const renderMessageContent = (content: string) => {
    if (!content) return null
    const parts = content.split(/(@[a-zA-Z0-9_\s]+?\b|@[a-zA-Z0-9_]+)/g)
    return parts.map((part, i) => {
      if (part.startsWith('@')) {
        return (
          <span key={i} className="font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md border border-indigo-100/60 inline-block my-0.5">
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
      <div className="flex-1 flex flex-col border-r border-gray-100">
        
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
              const senderName = msg.sender?.name || 'Unknown'
              
              return (
                <div key={msg._id} className="flex gap-3.5 p-3 rounded-2xl hover:bg-white hover:shadow-xs transition-all border border-transparent hover:border-gray-100 group">
                  <UserAvatar name={senderName} avatar={msg.sender?.avatar || msg.sender?.profileImage} size="w-9 h-9 text-[11px]" />
                  <div className="min-w-0 flex-1">
                    <div className="flex gap-2 items-baseline mb-0.5">
                       <span className="font-bold text-[14px] text-gray-900">{senderName}</span>
                       <span className="text-gray-400 text-[11px] font-medium">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="text-gray-700 leading-relaxed text-[14px] font-medium whitespace-pre-wrap break-words">
                       {renderMessageContent(msg.content)}
                    </div>
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
                 return (
                   <div key={i} className="flex justify-between items-center cursor-pointer group hover:bg-gray-50 p-1.5 rounded-xl transition-colors">
                     <div className="flex items-center gap-2.5 min-w-0">
                       <UserAvatar name={name} avatar={u.avatar} size="w-7 h-7 text-[9px]" />
                       <span className="font-semibold text-gray-700 text-[12px] group-hover:text-gray-900 transition-colors truncate">{name}</span>
                     </div>
                     <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-xs shrink-0"></div>
                   </div>
                 )
               })}
             </div>
           </div>

           {/* Workspace Links & Goals */}
           <div className="pt-3 border-t border-gray-100 space-y-4">
             <div>
               <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Pinned Links</div>
               {activeWorkspace?.pinnedLinks && activeWorkspace.pinnedLinks.length > 0 ? (
                 <div className="space-y-1.5">
                   {activeWorkspace.pinnedLinks.map((link: any, i: number) => (
                     <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-600 truncate text-[12px] font-medium hover:text-[#6366F1] transition-colors p-1.5 rounded-lg hover:bg-gray-50">
                       <Pin className="w-3.5 h-3.5 text-red-500 shrink-0"/>
                       <span className="truncate">{link.title || link.url}</span>
                     </a>
                   ))}
                 </div>
               ) : (
                 <div className="text-[12px] text-gray-400 font-medium italic px-1">No pinned links</div>
               )}
             </div>

             <div>
               <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Team Goals</div>
               {activeWorkspace?.teamGoals && activeWorkspace.teamGoals.length > 0 ? (
                 <div className="space-y-2">
                   {activeWorkspace.teamGoals.map((goal: any, i: number) => (
                     <div key={i} className="flex gap-2 text-gray-700 items-center text-[12px] font-medium">
                       <CheckCircle2 className={`w-4 h-4 shrink-0 ${goal.isCompleted ? 'text-emerald-500' : 'text-gray-300'}`}/>
                       <span className={goal.isCompleted ? 'line-through text-gray-400' : ''}>{goal.title}</span>
                     </div>
                   ))}
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
