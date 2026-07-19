"use client"
import { Card, CardContent } from "@/components/ui/card"
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts"
import { CheckCircle2, Clock, Users, ArrowUpRight, MessageSquare, Plus, Activity } from "lucide-react"

const data = [
  { name: 'Mon', tasks: 4 },
  { name: 'Tue', tasks: 3 },
  { name: 'Wed', tasks: 7 },
  { name: 'Thu', tasks: 5 },
  { name: 'Fri', tasks: 8 },
  { name: 'Sat', tasks: 2 },
  { name: 'Sun', tasks: 1 },
]

export default function Dashboard() {
  return (
    <div className="flex-1 overflow-y-auto bg-white p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Clean Header */}
        <div className="flex justify-between items-end border-b border-gray-100 pb-4">
          <div>
            <h1 className="text-[20px] font-bold text-gray-900 tracking-tight">Overview</h1>
            <p className="text-[13px] text-gray-500 font-medium mt-1">
              You have 3 tasks due today and 2 unread messages.
            </p>
          </div>
          <div className="hidden md:flex gap-2">
            <button className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-md text-[13px] font-semibold text-gray-700 transition-colors flex items-center gap-1.5 shadow-sm">
              <Plus className="w-3.5 h-3.5" strokeWidth={2.5}/>
              New Task
            </button>
          </div>
        </div>

        {/* Minimal Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-gray-100 shadow-sm hover:border-gray-200 transition-colors">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Total Tasks</p>
                <h3 className="text-xl font-bold text-gray-900">42</h3>
              </div>
              <div className="w-8 h-8 rounded-md bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-600">
                <CheckCircle2 className="w-4 h-4" strokeWidth={2.5}/>
              </div>
            </CardContent>
          </Card>
          <Card className="border-gray-100 shadow-sm hover:border-gray-200 transition-colors">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">In Progress</p>
                <h3 className="text-xl font-bold text-gray-900">12</h3>
              </div>
              <div className="w-8 h-8 rounded-md bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500">
                <Clock className="w-4 h-4" strokeWidth={2.5}/>
              </div>
            </CardContent>
          </Card>
          <Card className="border-gray-100 shadow-sm hover:border-gray-200 transition-colors">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Active Members</p>
                <h3 className="text-xl font-bold text-gray-900">18</h3>
              </div>
              <div className="w-8 h-8 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500">
                <Users className="w-4 h-4" strokeWidth={2.5}/>
              </div>
            </CardContent>
          </Card>
          <Card className="border-gray-100 shadow-sm hover:border-gray-200 transition-colors">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Productivity</p>
                <h3 className="text-xl font-bold text-gray-900">+14%</h3>
              </div>
              <div className="w-8 h-8 rounded-md bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500">
                <ArrowUpRight className="w-4 h-4" strokeWidth={2.5}/>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Chart */}
            <Card className="border-gray-100 shadow-sm">
              <CardContent className="p-5">
                <div className="mb-4">
                  <h3 className="text-[14px] font-bold text-gray-900">Activity Overview</h3>
                  <p className="text-[12px] text-gray-500 font-medium">Tasks completed over the last 7 days</p>
                </div>
                <div className="h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 11, fontWeight: 500}} dy={10} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '6px', border: '1px solid #F3F4F6', boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)', fontSize: '12px', fontWeight: 600, color: '#111827' }}
                        itemStyle={{ color: '#6366F1' }}
                        cursor={{ stroke: '#F3F4F6', strokeWidth: 2 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="tasks" 
                        stroke="#6366F1" 
                        strokeWidth={2}
                        dot={{ r: 3, fill: '#fff', strokeWidth: 2, stroke: '#6366F1' }}
                        activeDot={{ r: 5, fill: '#6366F1', stroke: '#fff', strokeWidth: 2 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Active Workspaces */}
            <Card className="border-gray-100 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-[14px] font-bold text-gray-900">Recent Workspaces</h3>
                    <p className="text-[12px] text-gray-500 font-medium">Your recently accessed projects</p>
                  </div>
                  <button className="text-[12px] font-bold text-gray-400 hover:text-gray-900 transition-colors">View All</button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 hover:border-gray-200 transition-all cursor-pointer group">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-md bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500 font-bold text-[11px]">
                        PD
                      </div>
                      <div>
                        <h4 className="font-bold text-[13px] text-gray-900 group-hover:text-orange-500 transition-colors line-clamp-1">Project Delta</h4>
                        <p className="text-[11px] font-medium text-gray-500">8 active members</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex -space-x-1.5">
                        {[
                          "https://api.dicebear.com/7.x/micah/svg?seed=Felix&backgroundColor=f3f4f6",
                          "https://api.dicebear.com/7.x/micah/svg?seed=Aneka&backgroundColor=f3f4f6",
                          "https://api.dicebear.com/7.x/micah/svg?seed=Jocelyn&backgroundColor=f3f4f6"
                        ].map((url, i) => (
                          <div key={i} className="w-5 h-5 rounded-full border border-white overflow-hidden bg-gray-200 shadow-sm">
                            <img src={url} className="w-full h-full object-cover"/>
                          </div>
                        ))}
                      </div>
                      <span className="text-[11px] font-bold text-gray-400 group-hover:text-gray-600 transition-colors">Enter &rarr;</span>
                    </div>
                  </div>
                  
                  <div className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 hover:border-gray-200 transition-all cursor-pointer group">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500 font-bold text-[11px]">
                        DT
                      </div>
                      <div>
                        <h4 className="font-bold text-[13px] text-gray-900 group-hover:text-blue-500 transition-colors line-clamp-1">Design Team Hub</h4>
                        <p className="text-[11px] font-medium text-gray-500">12 active members</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex -space-x-1.5">
                        {[
                          "https://api.dicebear.com/7.x/micah/svg?seed=George&backgroundColor=f3f4f6",
                          "https://api.dicebear.com/7.x/micah/svg?seed=Jasper&backgroundColor=f3f4f6"
                        ].map((url, i) => (
                          <div key={i} className="w-5 h-5 rounded-full border border-white overflow-hidden bg-gray-200 shadow-sm">
                            <img src={url} className="w-full h-full object-cover"/>
                          </div>
                        ))}
                      </div>
                      <span className="text-[11px] font-bold text-gray-400 group-hover:text-gray-600 transition-colors">Enter &rarr;</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar Area (Recent Activity) */}
          <div className="space-y-6">
            <Card className="border-gray-100 shadow-sm h-full max-h-[500px] flex flex-col">
              <CardContent className="p-5 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-5">
                   <h3 className="text-[14px] font-bold text-gray-900">Recent Activity</h3>
                </div>
                
                <div className="space-y-5 overflow-y-auto custom-scrollbar flex-1 pr-2">
                  {[
                    { name: 'Sarah', seed: 'Sarah', text: 'Sarah commented on Homepage Redesign', time: '2m ago' },
                    { name: 'Alex', seed: 'Alex', text: 'Alex completed User Research', time: '1h ago' },
                    { name: 'Manager', seed: 'Manager', text: 'New workspace Marketing Q3 created', time: '3h ago' },
                    { name: 'Felix', seed: 'Felix', text: 'Deadline updated for API Integration', time: '5h ago' }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-3 relative before:absolute before:left-3.5 before:top-8 before:bottom-[-20px] before:w-px before:bg-gray-100 last:before:hidden">
                      <div className="w-7 h-7 rounded-full bg-gray-200 border border-gray-100 overflow-hidden flex items-center justify-center shrink-0 z-10 shadow-sm">
                        <img src={`https://api.dicebear.com/7.x/micah/svg?seed=${item.seed}&backgroundColor=f3f4f6`} className="w-full h-full object-cover"/>
                      </div>
                      <div>
                        <p className="text-[13px] text-gray-800 font-medium leading-tight">{item.text}</p>
                        <p className="text-[11px] text-gray-400 font-medium mt-1">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button className="w-full py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-md text-[12px] font-bold text-gray-600 transition-colors shadow-sm">
                    View All Activity
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
          
        </div>
      </div>
    </div>
  )
}
