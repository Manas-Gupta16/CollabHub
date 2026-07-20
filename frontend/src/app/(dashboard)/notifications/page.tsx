"use client"

import { Button } from "@/components/ui/button"
import { Check, Settings, Bell, MessageSquare, AtSign, FileText, CheckCircle2 } from "lucide-react"

export default function NotificationsPage() {
  const notifications = [
    {
      group: 'Today',
      items: [
        { id: 1, type: 'mention', user: 'Domo Hamo', action: 'mentioned you in', target: '#design-feedback', content: 'What do you think about the new typography scale?', time: '2h ago', read: false, icon: <AtSign className="w-4 h-4 text-[#6366F1]" />, bg: 'bg-indigo-50' },
        { id: 2, type: 'task', user: 'Marfor Roather', action: 'assigned you to', target: 'Update Login UI', time: '4h ago', read: false, icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />, bg: 'bg-emerald-50' },
        { id: 3, type: 'file', user: 'Design Yeather', action: 'uploaded a new file', target: 'Landing_Page_v2.pdf', time: '5h ago', read: true, icon: <FileText className="w-4 h-4 text-orange-500" />, bg: 'bg-orange-50' }
      ]
    },
    {
      group: 'Yesterday',
      items: [
        { id: 4, type: 'message', user: 'Mike Ritare', action: 'replied to your thread in', target: '#engineering-log', content: 'I deployed the fix to staging. Should be good to test.', time: 'Yesterday at 3:45 PM', read: true, icon: <MessageSquare className="w-4 h-4 text-blue-500" />, bg: 'bg-blue-50' }
      ]
    },
    {
      group: 'Earlier',
      items: [
        { id: 5, type: 'mention', user: 'Jason Reiber', action: 'mentioned you in', target: 'Project Delta', content: 'Can we schedule a sync for next week?', time: 'Oct 20', read: true, icon: <AtSign className="w-4 h-4 text-[#6366F1]" />, bg: 'bg-indigo-50' }
      ]
    }
  ]

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-[#F5F8FF] to-[#E9F0FE] p-8 relative">

      <div className="max-w-3xl mx-auto space-y-8 relative z-10">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/60 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 text-[#6366F1] rounded-xl flex items-center justify-center">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Notifications</h1>
              <p className="text-gray-500 text-sm mt-1">You have 2 unread notifications.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-gray-200">
              <Check className="w-4 h-4 mr-2" />
              Mark all as read
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-500">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* List */}
        <div className="space-y-8">
          {notifications.map((group) => (
            <div key={group.group}>
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 px-2">{group.group}</h2>
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl overflow-hidden shadow-sm">
                <div className="divide-y divide-gray-100">
                  {group.items.map((item) => (
                    <div key={item.id} className={`p-5 flex gap-4 transition-colors hover:bg-gray-50/50 ${item.read ? 'opacity-70' : 'bg-blue-50/20'}`}>
                       <div className="relative shrink-0">
                         <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                           <img src={`https://api.dicebear.com/7.x/micah/svg?seed=${item.user.replace(/\s/g, '')}&backgroundColor=f3f4f6`} className="w-full h-full object-cover" />
                         </div>
                         <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${item.bg} border-2 border-white flex items-center justify-center`}>
                            {item.icon}
                         </div>
                       </div>
                       <div className="flex-1 min-w-0">
                         <div className="text-sm">
                           <span className="font-bold text-gray-900">{item.user}</span>{' '}
                           <span className="text-gray-600">{item.action}</span>{' '}
                           <span className="font-bold text-gray-900">{item.target}</span>
                         </div>
                         {item.content && (
                           <div className="mt-1 text-sm text-gray-600 border-l-2 border-gray-200 pl-3 py-0.5 my-2 italic">
                             &quot;{item.content}&quot;
                           </div>
                         )}
                         <div className="text-xs text-gray-400 mt-1">{item.time}</div>
                       </div>
                       {!item.read && (
                         <div className="w-2.5 h-2.5 rounded-full bg-[#6366F1] mt-2 shrink-0 shadow-sm"></div>
                       )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
