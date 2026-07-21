"use client"

import { Plus, Search, CheckCircle2, Pin, Calendar, Send } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getWorkspaces, getWorkspaceMessages, sendMessage, getWorkspaceById } from "@/lib/api"
import { useState, Suspense } from "react"

function MessagesContent() {
  const searchParams = useSearchParams()
  const queryWorkspaceId = searchParams.get('workspace')
  const queryChannel = searchParams.get('channel') || 'General'
  
  const queryClient = useQueryClient()
  const [newMessage, setNewMessage] = useState("")
  const [messageSearch, setMessageSearch] = useState("")

  const { data: workspaces } = useQuery({ queryKey: ['workspaces'], queryFn: getWorkspaces })
  const activeWorkspaceId = queryWorkspaceId || workspaces?.[0]?._id

  const { data: activeWorkspace } = useQuery({
    queryKey: ['workspace', activeWorkspaceId],
    queryFn: () => getWorkspaceById(activeWorkspaceId),
    enabled: !!activeWorkspaceId
  })

  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages', activeWorkspaceId, queryChannel],
    queryFn: () => getWorkspaceMessages(activeWorkspaceId, queryChannel),
    enabled: !!activeWorkspaceId,
    refetchInterval: 2000 // Poll for new messages every 2s
  })

  const sendMutation = useMutation({
    mutationFn: (content: string) => sendMessage(activeWorkspaceId, { content, channel: queryChannel }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', activeWorkspaceId, queryChannel] })
      setNewMessage("")
    }
  })

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !activeWorkspaceId) return
    sendMutation.mutate(newMessage)
  }

  const filteredMessages = messages?.filter((msg: any) => 
    !messageSearch.trim() || msg.content.toLowerCase().includes(messageSearch.toLowerCase())
  ) || []

  return (
    <div className="flex-1 flex overflow-hidden bg-white">
      
      {/* Center Chat Area */}
      <div className="flex-1 flex flex-col border-r border-gray-100">
        
        {/* Header */}
        <div className="h-14 border-b border-gray-100 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-2">
             <span className="font-bold text-[15px] text-gray-900 tracking-tight"># {queryChannel}</span>
             <span className="px-2 py-0.5 bg-gray-50 border border-gray-100 rounded-full text-gray-500 font-medium text-[11px] ml-1">Today</span>
          </div>
          <div className="flex -space-x-1.5">
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-6 space-y-8 overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="text-center text-gray-500 mt-10">Loading messages...</div>
          ) : filteredMessages.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              {messageSearch.trim() ? 'No matching messages found.' : 'No messages yet. Say hi!'}
            </div>
          ) : (
            filteredMessages.map((msg: any) => {
              const senderName = msg.sender?.name || 'Unknown'
              const avatarUrl = msg.sender?.avatar ? `http://localhost:5000${msg.sender.avatar}` : `https://api.dicebear.com/7.x/initials/svg?seed=${senderName.replace(/\s/g, '')}&backgroundColor=6366f1&textColor=ffffff`
              
              return (
                <div key={msg._id} className="flex gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0 shadow-sm border border-gray-100">
                     <img src={avatarUrl} className="w-full h-full object-cover"/>
                  </div>
                  <div>
                    <div className="flex gap-2 items-baseline mb-1">
                       <span className="font-bold text-[14px] text-gray-900">{senderName}</span>
                       <span className="text-gray-400 text-[11px] font-medium">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="text-gray-700 leading-relaxed text-[14px] font-medium max-w-xl whitespace-pre-wrap">
                       {msg.content}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
        
        {/* Input Box */}
        <form onSubmit={handleSend} className="p-6 bg-white shrink-0">
           <div className="border border-gray-200 focus-within:border-[#6366F1] focus-within:ring-1 focus-within:ring-[#6366F1] rounded-full px-4 py-3 flex items-center gap-3 bg-white shadow-sm transition-all">
             <Plus className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
             <input 
               type="text" 
               value={newMessage}
               onChange={e => setNewMessage(e.target.value)}
               placeholder="Message channel..." 
               className="flex-1 bg-transparent outline-none text-[14px] text-gray-900 placeholder:text-gray-400 placeholder:font-medium" 
             />
             <button type="submit" disabled={!newMessage.trim() || sendMutation.isPending} className="flex items-center gap-3 text-[#6366F1] disabled:opacity-50 hover:text-indigo-700 transition-colors">
                <Send className="w-5 h-5 cursor-pointer" />
             </button>
           </div>
        </form>
      </div>

      {/* Right Sidebar */}
      <div className="w-[280px] bg-white flex flex-col shrink-0">
        <div className="p-4 pb-2">
          <div className="bg-gray-50 border border-gray-100 rounded-md p-2 flex items-center gap-2">
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
        
        <div className="px-5 py-4 overflow-y-auto custom-scrollbar flex-1">
           <div className="text-[12px] font-bold text-gray-900 mb-4 tracking-tight">Online Team</div>
           <div className="space-y-3.5 mb-8">
             {(activeWorkspace?.members || []).map((member: any, i: number) => {
               const u = member.user || {}
               const name = u.name || 'Unknown'
               const userSeed = name.replace(/\s/g, '') || 'Oliver'
               const avatar = u.avatar ? `http://localhost:5000${u.avatar}` : `https://api.dicebear.com/7.x/initials/svg?seed=${userSeed}&backgroundColor=6366f1&textColor=ffffff`
               return (
                 <div key={i} className="flex justify-between items-center cursor-pointer group">
                   <div className="flex items-center gap-2.5">
                     <div className="w-7 h-7 rounded-full bg-gray-200 overflow-hidden shadow-sm border border-gray-100">
                       <img src={avatar} className="w-full h-full object-cover"/>
                     </div>
                     <span className="font-semibold text-gray-600 text-[13px] group-hover:text-gray-900 transition-colors">{name}</span>
                   </div>
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-200"></div>
                 </div>
               )
             })}
           </div>
           
           <div className="text-[12px] font-bold text-gray-900 mb-4 tracking-tight">Workspace Details</div>
           <div className="text-[11px] font-bold text-gray-500 mb-2 uppercase tracking-wider">Pinned Links</div>
           <div className="space-y-2 mb-6">
             {activeWorkspace?.pinnedLinks && activeWorkspace.pinnedLinks.length > 0 ? (
                activeWorkspace.pinnedLinks.map((link: any, i: number) => (
                  <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="flex gap-2 text-gray-500 truncate text-[12px] font-medium hover:text-[#6366F1] cursor-pointer transition-colors">
                    <Pin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5"/> {link.title || link.url}
                  </a>
                ))
              ) : (
                <div className="text-[12px] text-gray-400 font-medium">No pinned links</div>
              )}
           </div>
           
           <div className="text-[11px] font-bold text-gray-500 mb-2 uppercase tracking-wider">Key deadlines</div>
           <div className="space-y-2 mb-6">
             {activeWorkspace?.keyDeadlines && activeWorkspace.keyDeadlines.length > 0 ? (
                activeWorkspace.keyDeadlines.map((dl: any, i: number) => (
                  <div key={i} className="flex gap-2 text-gray-700 items-center text-[12px] font-medium">
                    <Calendar className="w-4 h-4 text-gray-400"/> {dl.title}: {new Date(dl.date).toLocaleDateString()}
                  </div>
                ))
              ) : (
                <div className="text-[12px] text-gray-400 font-medium">No deadlines scheduled</div>
              )}
           </div>
           
           <div className="text-[11px] font-bold text-gray-500 mb-2 uppercase tracking-wider">Team goals</div>
           <div className="space-y-2.5">
             {activeWorkspace?.teamGoals && activeWorkspace.teamGoals.length > 0 ? (
                activeWorkspace.teamGoals.map((goal: any, i: number) => (
                  <div key={i} className="flex gap-2 text-gray-700 items-center text-[12px] font-medium">
                    <CheckCircle2 className={`w-4 h-4 shrink-0 ${goal.isCompleted ? 'text-emerald-500' : 'text-gray-300'}`}/>
                    <span className={goal.isCompleted ? 'line-through text-gray-400' : ''}>{goal.title}</span>
                  </div>
                ))
              ) : (
                <div className="text-[12px] text-gray-400 font-medium">No team goals set</div>
              )}
           </div>
        </div>
      </div>

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
