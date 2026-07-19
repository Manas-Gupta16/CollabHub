"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, MapPin, Link as LinkIcon, Calendar, CheckCircle2, MessageSquare, GitCommit } from "lucide-react"

export default function ProfilePage() {
  return (
    <div className="flex-1 overflow-y-auto bg-[#FAFAFA] p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Profile Header Card */}
        <Card className="overflow-hidden border-gray-200">
          <div className="h-32 bg-gradient-to-r from-[#6366F1] to-purple-500 w-full relative">
            <Button variant="outline" className="absolute top-4 right-4 bg-white/20 text-white border-white/40 hover:bg-white/30 hover:text-white">
              Edit Cover
            </Button>
          </div>
          <CardContent className="p-8 pt-0 relative">
             <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-12 mb-6">
               <div className="w-24 h-24 rounded-full border-4 border-white bg-white shadow-md overflow-hidden shrink-0">
                  <img src="https://api.dicebear.com/7.x/micah/svg?seed=Design&backgroundColor=f3f4f6" className="w-full h-full object-cover" />
               </div>
               <div className="flex-1">
                 <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Design Yeather</h1>
                 <p className="text-gray-500 font-medium">Senior Product Designer at CollabHub</p>
               </div>
               <div className="flex gap-2 w-full sm:w-auto">
                 <Button variant="outline" className="flex-1 sm:flex-none border-gray-200">Share</Button>
                 <Button className="flex-1 sm:flex-none bg-[#6366F1] hover:bg-[#4F46E5] text-white">Edit Profile</Button>
               </div>
             </div>

             <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-gray-600">
               <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gray-400"/> San Francisco, CA</div>
               <div className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-gray-400"/> design.y@collabhub.com</div>
               <div className="flex items-center gap-1.5"><LinkIcon className="w-4 h-4 text-gray-400"/> dribbble.com/yeather</div>
               <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-gray-400"/> Joined March 2026</div>
             </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-gray-200">
              <CardContent className="p-6">
                 <h2 className="text-lg font-bold text-gray-900 mb-4">About</h2>
                 <p className="text-sm text-gray-600 leading-relaxed mb-6">
                   Passionate about creating intuitive, user-centric experiences. Leading the design system and overall aesthetic of CollabHub.
                 </p>
                 <h2 className="text-lg font-bold text-gray-900 mb-4">Stats</h2>
                 <div className="space-y-4">
                   <div className="flex justify-between items-center">
                     <div className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Tasks Done</div>
                     <span className="font-bold text-gray-900">142</span>
                   </div>
                   <div className="flex justify-between items-center">
                     <div className="flex items-center gap-2 text-sm text-gray-600"><MessageSquare className="w-4 h-4 text-blue-500"/> Messages</div>
                     <span className="font-bold text-gray-900">2.4k</span>
                   </div>
                   <div className="flex justify-between items-center">
                     <div className="flex items-center gap-2 text-sm text-gray-600"><GitCommit className="w-4 h-4 text-purple-500"/> Commits</div>
                     <span className="font-bold text-gray-900">45</span>
                   </div>
                 </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-gray-200">
              <CardContent className="p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Activity</h2>
                <div className="space-y-6">
                  {[
                    { title: 'Uploaded a new asset', target: 'Landing_Page_v2.pdf', time: '2 hours ago', icon: <CheckCircle2 className="text-emerald-500 w-4 h-4"/>, bg: 'bg-emerald-50' },
                    { title: 'Commented on', target: 'Design System Typography', time: '4 hours ago', icon: <MessageSquare className="text-blue-500 w-4 h-4"/>, bg: 'bg-blue-50' },
                    { title: 'Completed task', target: 'Update Dashboard Layout', time: 'Yesterday', icon: <CheckCircle2 className="text-emerald-500 w-4 h-4"/>, bg: 'bg-emerald-50' }
                  ].map((activity, i) => (
                    <div key={i} className="flex gap-4 relative before:absolute before:left-4 before:top-8 before:bottom-[-24px] before:w-px before:bg-gray-200 last:before:hidden">
                      <div className={`w-8 h-8 rounded-full ${activity.bg} flex items-center justify-center z-10 shrink-0`}>
                         {activity.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{activity.title} <span className="font-bold">{activity.target}</span></p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

        </div>

      </div>
    </div>
  )
}
