import { useState } from "react"
import { 
  Plus, 
  MoreHorizontal, 
  Calendar, 
  MessageSquare, 
  Paperclip,
  AlignLeft,
  Signal,
  SignalHigh,
  SignalMedium,
  SignalLow,
  CheckCircle2,
  Circle,
  Clock
} from "lucide-react"

// Mock Data
const initialTasks = {
  TODO: [
    { id: 'T-1', title: 'Design System Implementation', priority: 'High', assignee: 'Alex', comments: 3, attachments: 1, dueDate: 'Tomorrow' },
    { id: 'T-2', title: 'User Authentication Flow', priority: 'Medium', assignee: 'Sarah', comments: 0, attachments: 0, dueDate: 'Next week' },
    { id: 'T-3', title: 'API Endpoints for Tasks', priority: 'Urgent', assignee: 'Mike', comments: 5, attachments: 2, dueDate: 'Today' },
  ],
  IN_PROGRESS: [
    { id: 'T-4', title: 'Frontend Architecture Setup', priority: 'High', assignee: 'Manas', comments: 12, attachments: 0, dueDate: 'Today' },
    { id: 'T-5', title: 'WebSocket Integration', priority: 'High', assignee: 'Alex', comments: 1, attachments: 0, dueDate: 'In 2 days' },
  ],
  DONE: [
    { id: 'T-6', title: 'Project Scoping', priority: 'Low', assignee: 'Sarah', comments: 8, attachments: 3, dueDate: 'Past' },
    { id: 'T-7', title: 'Database Schema', priority: 'High', assignee: 'Mike', comments: 2, attachments: 1, dueDate: 'Past' },
  ]
}

const PriorityIcon = ({ priority }: { priority: string }) => {
  switch (priority) {
    case 'Urgent': return <Signal className="w-3.5 h-3.5 text-red-500" />
    case 'High': return <SignalHigh className="w-3.5 h-3.5 text-orange-500" />
    case 'Medium': return <SignalMedium className="w-3.5 h-3.5 text-yellow-500" />
    case 'Low': return <SignalLow className="w-3.5 h-3.5 text-blue-500" />
    default: return <SignalLow className="w-3.5 h-3.5 text-gray-400" />
  }
}

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'TODO': return <Circle className="w-4 h-4 text-gray-400" />
    case 'IN_PROGRESS': return <Clock className="w-4 h-4 text-orange-500" />
    case 'DONE': return <CheckCircle2 className="w-4 h-4 text-indigo-600" />
    default: return <Circle className="w-4 h-4 text-gray-400" />
  }
}

export default function TaskBoard() {
  const [tasks] = useState(initialTasks)

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Board Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <AlignLeft className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Product Roadmap</h1>
            <p className="text-sm text-gray-500 font-medium mt-0.5">Sprint 42 • 12 active tasks</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2 mr-2">
            {['Alex', 'Sarah', 'Mike'].map((seed, i) => (
              <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-gray-200 overflow-hidden shadow-sm">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`} alt={seed} className="w-full h-full" />
              </div>
            ))}
          </div>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm">
            <Plus className="w-4 h-4" />
            New Task
          </button>
        </div>
      </div>

      {/* Board Canvas */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 custom-scrollbar bg-[#FBFBFC]">
        <div className="flex gap-6 h-full items-start min-w-max">
          
          {Object.entries(tasks).map(([columnId, columnTasks]) => (
            <div key={columnId} className="w-[320px] flex flex-col h-full">
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3 px-1 group">
                <div className="flex items-center gap-2">
                  <StatusIcon status={columnId} />
                  <h3 className="font-semibold text-gray-800 text-[14px]">
                    {columnId.replace('_', ' ')}
                  </h3>
                  <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    {columnTasks.length}
                  </span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded">
                    <MoreHorizontal className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Task List */}
              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pb-4">
                {columnTasks.map((task) => (
                  <div 
                    key={task.id} 
                    className="bg-white rounded-lg border border-gray-200 p-3.5 shadow-sm hover:shadow hover:border-gray-300 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                        <span>{task.id}</span>
                        <div className="flex items-center gap-1">
                          <PriorityIcon priority={task.priority} />
                        </div>
                      </div>
                      <div className="w-5 h-5 rounded-full overflow-hidden bg-gray-100 ring-2 ring-white opacity-60 group-hover:opacity-100 transition-opacity">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${task.assignee}`} alt={task.assignee} className="w-full h-full" />
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-900 text-[14px] leading-snug mb-3">
                      {task.title}
                    </h4>

                    <div className="flex items-center justify-between text-gray-400">
                      <div className="flex items-center gap-3">
                        {task.dueDate && (
                          <div className={`flex items-center gap-1.5 text-[11px] font-semibold px-1.5 py-0.5 rounded ${task.dueDate === 'Today' || task.dueDate === 'Past' ? 'text-red-600 bg-red-50' : ''}`}>
                            <Calendar className="w-3 h-3" />
                            {task.dueDate}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2.5 text-[12px] font-medium opacity-60 group-hover:opacity-100 transition-opacity">
                        {task.comments > 0 && (
                          <div className="flex items-center gap-1 hover:text-gray-700">
                            <MessageSquare className="w-3.5 h-3.5" />
                            {task.comments}
                          </div>
                        )}
                        {task.attachments > 0 && (
                          <div className="flex items-center gap-1 hover:text-gray-700">
                            <Paperclip className="w-3.5 h-3.5" />
                            {task.attachments}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Task Button (Linear style) */}
                <button className="w-full flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm font-medium p-2 rounded-md hover:bg-gray-200/50 transition-colors">
                  <Plus className="w-4 h-4" />
                  New task...
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
