"use client"

import { useState } from "react"
import { Plus, MoreHorizontal, MessageSquare, Paperclip, Calendar, CheckCircle2, Circle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

const initialTasks = {
  todo: [
    { id: '1', title: 'Design new landing page', priority: 'High', date: 'Oct 24', comments: 3, attachments: 2, assignee: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop', tag: 'Design' },
    { id: '2', title: 'Research competitor pricing', priority: 'Low', date: 'Oct 26', comments: 0, attachments: 0, assignee: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', tag: 'Marketing' }
  ],
  inProgress: [
    { id: '3', title: 'Implement Kanban Board Drag & Drop', priority: 'High', date: 'Oct 25', comments: 5, attachments: 1, assignee: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', tag: 'Engineering' },
    { id: '4', title: 'Fix notification socket issue', priority: 'Medium', date: 'Oct 25', comments: 1, attachments: 0, assignee: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', tag: 'Engineering' }
  ],
  done: [
    { id: '5', title: 'Setup Next.js App Router', priority: 'High', date: 'Oct 23', comments: 8, attachments: 0, assignee: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', tag: 'Engineering' }
  ]
}

const PriorityBadge = ({ priority }: { priority: string }) => {
  const colors = {
    High: 'bg-red-50 text-red-600 border-red-100',
    Medium: 'bg-orange-50 text-orange-600 border-orange-100',
    Low: 'bg-blue-50 text-blue-600 border-blue-100'
  }
  return (
    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border ${colors[priority as keyof typeof colors]}`}>
      {priority}
    </span>
  )
}

const TagBadge = ({ tag }: { tag: string }) => {
  return (
    <span className="px-2 py-0.5 text-[10px] font-medium text-gray-500 bg-gray-100 rounded">
      {tag}
    </span>
  )
}

export default function TaskBoard() {
  const [tasks] = useState(initialTasks)

  const renderColumn = (title: string, items: any[], icon: any, colorClass: string) => (
    <div className="flex flex-col w-full min-w-[300px] max-w-[350px] shrink-0">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="font-semibold text-gray-900">{title}</h2>
          <span className="text-xs font-medium bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{items.length}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400"><Plus className="w-4 h-4"/></Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400"><MoreHorizontal className="w-4 h-4"/></Button>
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
        {items.map(task => (
          <div key={task.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:border-[#6366F1]/50 hover:shadow-md transition-all cursor-pointer group">
            <div className="flex justify-between items-start mb-3">
              <div className="flex gap-2">
                <PriorityBadge priority={task.priority} />
                <TagBadge tag={task.tag} />
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 text-gray-400"><MoreHorizontal className="w-4 h-4"/></Button>
            </div>
            
            <h3 className="font-bold text-gray-900 mb-4 line-clamp-2 leading-tight">
              {task.title}
            </h3>
            
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-3 text-gray-400 text-xs font-medium">
                 {task.date && <div className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5"/>{task.date}</div>}
                 {task.comments > 0 && <div className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5"/>{task.comments}</div>}
                 {task.attachments > 0 && <div className="flex items-center gap-1"><Paperclip className="w-3.5 h-3.5"/>{task.attachments}</div>}
              </div>
              <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                 <img src={task.assignee} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        ))}
        
        <Button variant="ghost" className="w-full border border-dashed border-gray-300 text-gray-500 hover:text-gray-900 justify-start mt-2">
           <Plus className="w-4 h-4 mr-2" /> Add Task
        </Button>
      </div>
    </div>
  )

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#FAFAFA]">
      
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-100 bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Task Board</h1>
          <p className="text-gray-500 text-sm mt-1">Manage tasks for Project Delta.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2 mr-2">
             {['https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'].map((url, i) => (
               <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-gray-100">
                 <img src={url} className="w-full h-full object-cover"/>
               </div>
             ))}
          </div>
          <Button variant="outline" className="border-gray-200">Filters</Button>
          <Button className="bg-[#6366F1] hover:bg-[#4F46E5] text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex gap-6 p-8 h-full">
           {renderColumn('Todo', tasks.todo, <Circle className="w-4 h-4 text-gray-400" />, 'text-gray-500')}
           {renderColumn('In Progress', tasks.inProgress, <Clock className="w-4 h-4 text-[#6366F1]" />, 'text-[#6366F1]')}
           {renderColumn('Done', tasks.done, <CheckCircle2 className="w-4 h-4 text-emerald-500" />, 'text-emerald-500')}
        </div>
      </div>

    </div>
  )
}
