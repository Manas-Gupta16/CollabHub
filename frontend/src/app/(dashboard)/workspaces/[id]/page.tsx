"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Settings, Hash, MoreHorizontal, Activity, ArrowUpRight, MessageSquare, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function WorkspaceOverview({ params }: { params: { id: string } }) {
  return (
    <div className="flex-1 overflow-y-auto bg-[#FAFAFA] p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Breadcrumb & Header */}
        <div>
          <div className="flex items-center text-sm text-gray-500 mb-4 gap-2 font-medium">
            <Link href="/workspaces" className="hover:text-gray-900 transition-colors">Workspaces</Link>
            <span>/</span>
            <span className="text-gray-900">Project Delta</span>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold text-2xl">
                PD
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Project Delta</h1>
                <p className="text-gray-500 text-sm mt-1">Product design and engineering syncs.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-gray-200">
                <Users className="w-4 h-4 mr-2" />
                Invite
              </Button>
              <Button variant="outline" className="border-gray-200">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button className="bg-[#6366F1] hover:bg-[#4F46E5] text-white">
                Open Workspace
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
               <Card>
                 <CardContent className="p-4 flex items-center gap-4">
                   <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-[#6366F1]"><Users className="w-5 h-5"/></div>
                   <div><div className="text-2xl font-bold text-gray-900">12</div><div className="text-xs font-medium text-gray-500 uppercase">Members</div></div>
                 </CardContent>
               </Card>
               <Card>
                 <CardContent className="p-4 flex items-center gap-4">
                   <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500"><CheckCircle2 className="w-5 h-5"/></div>
                   <div><div className="text-2xl font-bold text-gray-900">48</div><div className="text-xs font-medium text-gray-500 uppercase">Tasks Done</div></div>
                 </CardContent>
               </Card>
               <Card>
                 <CardContent className="p-4 flex items-center gap-4">
                   <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500"><Activity className="w-5 h-5"/></div>
                   <div><div className="text-2xl font-bold text-gray-900">92%</div><div className="text-xs font-medium text-gray-500 uppercase">Activity</div></div>
                 </CardContent>
               </Card>
            </div>

            {/* Channels List */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between py-4">
                <CardTitle className="text-lg">Channels</CardTitle>
                <Button variant="ghost" size="sm" className="text-[#6366F1]">View all</Button>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <div className="divide-y divide-gray-100">
                  {['design-feedback', 'engineering-log', 'client-sync'].map((channel, i) => (
                    <div key={i} className="px-6 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                          <Hash className="w-4 h-4 text-gray-500" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{channel}</div>
                          <div className="text-xs text-gray-500">Last active 2h ago</div>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100"><ArrowUpRight className="w-4 h-4 text-gray-400"/></Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex gap-4 relative before:absolute before:left-4 before:top-8 before:bottom-[-24px] before:w-px before:bg-gray-200 last:before:hidden">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 z-10 shrink-0"><MessageSquare className="w-4 h-4"/></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Domo Hamo commented in <span className="text-[#6366F1]">#design-feedback</span></p>
                      <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex gap-4 relative before:absolute before:left-4 before:top-8 before:bottom-[-24px] before:w-px before:bg-gray-200 last:before:hidden">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 z-10 shrink-0"><CheckCircle2 className="w-4 h-4"/></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Marfor completed task "Update Login UI"</p>
                      <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Right Column */}
          <div className="space-y-6">
             {/* Team Members */}
             <Card>
               <CardHeader className="py-4">
                 <CardTitle className="text-lg">Team Members</CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="space-y-4">
                   {[
                     { name: 'Domo Hamo', role: 'Admin' },
                     { name: 'Design Yeather', role: 'Designer' },
                     { name: 'Marfor Roather', role: 'Engineer' },
                   ].map((user, i) => (
                     <div key={i} className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                           <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                         </div>
                         <div>
                           <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                           <div className="text-xs text-gray-500">{user.role}</div>
                         </div>
                       </div>
                       <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="w-4 h-4 text-gray-400"/></Button>
                     </div>
                   ))}
                 </div>
                 <Button variant="outline" className="w-full mt-6">View all 12 members</Button>
               </CardContent>
             </Card>
          </div>

        </div>

      </div>
    </div>
  )
}
