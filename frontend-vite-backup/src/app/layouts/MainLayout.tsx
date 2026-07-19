import { Outlet, NavLink, useLocation } from "react-router-dom"
import { 
  LayoutDashboard, 
  CheckSquare, 
  Briefcase, 
  BarChart2, 
  Activity, 
  Bell, 
  MessageSquare,
  Search,
  Settings,
  Plus,
  ChevronDown
} from "lucide-react"

export default function MainLayout() {
  const location = useLocation()

  const mainNav = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Workspaces', href: '/workspaces', icon: Briefcase },
    { name: 'Analytics', href: '/analytics', icon: BarChart2 },
    { name: 'Activity Feed', href: '/activity', icon: Activity },
    { name: 'Notifications', href: '/notifications', icon: Bell },
  ]

  return (
    <div className="flex h-screen bg-[#FBFBFC] text-gray-900 font-sans overflow-hidden">
      {/* Sidebar */}
      <div className="w-[260px] border-r border-gray-200 flex flex-col bg-[#F6F6F8] shrink-0">
        
        {/* Workspace Switcher */}
        <div className="h-14 flex items-center px-4 mb-4 hover:bg-gray-200/50 cursor-pointer transition-colors border-b border-gray-200/50">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 font-bold text-[15px] tracking-tight">
              <div className="w-6 h-6 rounded bg-indigo-600 text-white flex items-center justify-center relative shadow-sm">
                <span className="text-xs font-black">C</span>
              </div>
              CollabHub Inc.
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 custom-scrollbar">
          
          {/* Main Navigation */}
          <div className="space-y-0.5 mb-6">
            {mainNav.map((item) => (
              <NavLink 
                key={item.name}
                to={item.href} 
                className={({ isActive }) => `flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[14px] font-medium transition-colors ${
                  isActive && location.pathname === item.href 
                    ? 'bg-white text-indigo-700 shadow-sm border border-gray-200/50' 
                    : 'text-gray-600 hover:bg-gray-200/50'
                }`}
              >
                <item.icon className="w-4 h-4" /> 
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* Messaging Section (De-emphasized) */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 px-2.5">
              Messages
              <Plus className="w-3.5 h-3.5 cursor-pointer hover:text-gray-800" />
            </div>
            <div className="space-y-0.5">
              <NavLink 
                to="/messages"
                className={({ isActive }) => `flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[14px] font-medium ${
                  isActive ? 'bg-white text-indigo-700 shadow-sm border border-gray-200/50' : 'text-gray-600 hover:bg-gray-200/50'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                All Messages
              </NavLink>
              <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[14px] font-medium text-gray-500 hover:bg-gray-200/50 cursor-pointer pl-7">
                <span className="text-gray-400">#</span> design-feedback
              </div>
              <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[14px] font-medium text-gray-500 hover:bg-gray-200/50 cursor-pointer pl-7">
                <span className="text-gray-400">#</span> engineering-log
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Profile / Settings */}
        <div className="mt-auto p-3 border-t border-gray-200/50">
          <div className="flex items-center justify-between px-2 py-1.5 hover:bg-gray-200/50 rounded-md cursor-pointer transition-colors">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border border-gray-200">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Destriee" alt="Avatar" className="w-full h-full" />
              </div>
              <div className="text-[14px] font-medium text-gray-700">Destriee</div>
            </div>
            <Settings className="w-4 h-4 text-gray-400 hover:text-gray-600" />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white shadow-sm border-l border-gray-200/50 rounded-tl-xl overflow-hidden relative">
        
        {/* Top bar (Search/Command Palette access) */}
        <div className="h-14 border-b border-gray-100 flex items-center px-6 shrink-0 bg-white">
           <div className="flex-1 flex items-center text-gray-400 text-sm">
              <Search className="w-4 h-4 mr-2" />
              <span>Search or jump to...</span>
              <div className="ml-3 px-1.5 py-0.5 rounded border border-gray-200 text-[10px] font-medium bg-gray-50">CMD K</div>
           </div>
           <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-semibold text-xs cursor-pointer border border-indigo-100">
                MG
              </div>
           </div>
        </div>
        
        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
