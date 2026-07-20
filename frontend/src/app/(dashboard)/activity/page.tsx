"use client"

import { GitCommit, FilePlus, Users, MessageSquare, CheckCircle2, GitMerge } from "lucide-react"

export default function ActivityPage() {
  const activities = [
    {
      date: 'Today, Oct 24',
      items: [
        { id: 1, type: 'commit', user: 'Domo Hamo', action: 'pushed to', target: 'main', repo: 'collabhub-web', time: '2h ago', icon: <GitCommit className="w-4 h-4 text-gray-500" /> },
        { id: 2, type: 'task', user: 'Marfor Roather', action: 'completed task', target: 'Update Login UI', repo: 'Design Team Hub', time: '4h ago', icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" /> },
        { id: 3, type: 'file', user: 'Design Yeather', action: 'uploaded', target: 'Landing_Page_v2.pdf', repo: 'Project Delta', time: '5h ago', icon: <FilePlus className="w-4 h-4 text-orange-500" /> }
      ]
    },
    {
      date: 'Yesterday, Oct 23',
      items: [
        { id: 4, type: 'merge', user: 'Mike Ritare', action: 'merged pull request', target: '#42 Fix Navigation', repo: 'collabhub-web', time: '3:45 PM', icon: <GitMerge className="w-4 h-4 text-purple-500" /> },
        { id: 5, type: 'comment', user: 'Jason Reiber', action: 'commented on', target: 'Task: Implement WebSockets', repo: 'Engineering Sync', time: '1:20 PM', icon: <MessageSquare className="w-4 h-4 text-blue-500" /> },
        { id: 6, type: 'user', user: 'Sarah Jen', action: 'joined workspace', target: 'Project Delta', repo: 'System', time: '10:00 AM', icon: <Users className="w-4 h-4 text-indigo-500" /> }
      ]
    }
  ]

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-[#F5F8FF] to-[#E9F0FE] p-8 relative">

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Activity Feed</h1>
          <p className="text-gray-500 mt-1">Global timeline of workspace events.</p>
        </div>

        {/* Timeline */}
        <div className="space-y-12 pl-4 sm:pl-0">
          {activities.map((group) => (
            <div key={group.date} className="relative">
              {/* Group Date Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="text-sm font-bold text-gray-900 uppercase tracking-wider bg-gradient-to-r from-[#F5F8FF] to-transparent z-10 pr-4">{group.date}</div>
                <div className="h-px bg-gray-200/80 flex-1"></div>
              </div>

              <div className="space-y-8">
                {group.items.map((item, index) => (
                  <div key={item.id} className="flex gap-6 relative">
                    {/* Vertical Line Connection */}
                    {index !== group.items.length - 1 && (
                      <div className="absolute left-6 top-10 bottom-[-32px] w-px bg-gray-200/80"></div>
                    )}
                    
                    {/* Avatar & Icon */}
                    <div className="relative shrink-0 z-10">
                      <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden shadow-sm">
                        <img src={`https://api.dicebear.com/7.x/micah/svg?seed=${item.user.replace(/\s/g, '')}&backgroundColor=f3f4f6`} className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center">
                        {item.icon}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200/60 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="text-sm leading-relaxed">
                          <span className="font-bold text-gray-900">{item.user}</span>{' '}
                          <span className="text-gray-600">{item.action}</span>{' '}
                          <span className="font-bold text-gray-900">{item.target}</span>
                        </div>
                        <span className="text-xs font-medium text-gray-400 whitespace-nowrap ml-4">{item.time}</span>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {item.repo}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
