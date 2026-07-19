import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { CheckCircle2, Clock, Users, ArrowUpRight, MessageSquare, Briefcase, Plus } from "lucide-react"

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
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-indigo-600 rounded-2xl p-8 text-white flex justify-between items-center relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Good afternoon, Manas! 👋</h1>
          <p className="text-indigo-100 max-w-lg">
            You have 3 tasks due today and 2 unread messages in the Product Team workspace.
            Let's get things done.
          </p>
        </div>
        <div className="relative z-10 hidden md:block">
          <Button variant="secondary" className="bg-white text-indigo-600 hover:bg-gray-100">
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
        </div>
        {/* Decorative circle */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-10"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Tasks</p>
              <h3 className="text-3xl font-bold text-gray-900">42</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">In Progress</p>
              <h3 className="text-3xl font-bold text-gray-900">12</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
              <Clock className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Team Members</p>
              <h3 className="text-3xl font-bold text-gray-900">18</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Users className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Productivity</p>
              <h3 className="text-3xl font-bold text-gray-900">+14%</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
              <ArrowUpRight className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Productivity Overview</CardTitle>
              <CardDescription>Tasks completed over the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="tasks" 
                      stroke="#4F46E5" 
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#4F46E5', strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 6 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Active Workspaces */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Active Workspaces</CardTitle>
                <CardDescription>Your recently accessed workspaces</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-indigo-600">View All</Button>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                    PD
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">Project Delta</h4>
                    <p className="text-xs text-gray-500">8 active members</p>
                  </div>
                </div>
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className={`w-6 h-6 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[10px] font-medium text-gray-600 z-${10-i}`}>
                      {String.fromCharCode(64+i)}
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    DT
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">Design Team Hub</h4>
                    <p className="text-xs text-gray-500">12 active members</p>
                  </div>
                </div>
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className={`w-6 h-6 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[10px] font-medium text-gray-600 z-${10-i}`}>
                      {String.fromCharCode(70+i)}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Area */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  { icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-50', text: 'Sarah commented on Homepage Redesign', time: '2m ago' },
                  { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50', text: 'Alex completed User Research', time: '1h ago' },
                  { icon: Briefcase, color: 'text-purple-500', bg: 'bg-purple-50', text: 'New workspace Marketing Q3 created', time: '3h ago' },
                  { icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50', text: 'Deadline updated for API Integration', time: '5h ago' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className={`w-8 h-8 rounded-full ${item.bg} ${item.color} flex items-center justify-center shrink-0`}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-800 font-medium leading-snug">{item.text}</p>
                      <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-6">View All Activity</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
