"use client"

import { Plus, Search, CheckCircle2, Pin, Calendar } from "lucide-react"

export default function MessagesPage() {
  return (
    <div className="flex-1 flex overflow-hidden bg-white">
      
      {/* Center Chat Area */}
      <div className="flex-1 flex flex-col border-r border-gray-100">
        
        {/* Header */}
        <div className="h-14 border-b border-gray-100 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-2">
             <span className="font-bold text-[15px] text-gray-900 tracking-tight"># design-feedback</span>
             <span className="px-2 py-0.5 bg-gray-50 border border-gray-100 rounded-full text-gray-500 font-medium text-[11px] ml-1">Today</span>
          </div>
          <div className="flex -space-x-1.5">
            {[
              "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
              "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop"
            ].map((url, i)=>(
               <div key={i} className="w-7 h-7 rounded-full bg-gray-200 border-2 border-white overflow-hidden shadow-sm">
                 <img src={url} className="w-full h-full object-cover"/>
               </div>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-6 space-y-8 overflow-y-auto custom-scrollbar">
          
          {/* Message 1 */}
          <div className="flex gap-4 group">
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0 shadow-sm border border-gray-100">
               <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" className="w-full h-full object-cover"/>
            </div>
            <div>
              <div className="flex gap-2 items-baseline mb-1">
                 <span className="font-bold text-[14px] text-gray-900">Project Delta</span>
                 <span className="text-gray-400 text-[11px] font-medium">2:44 PM</span>
              </div>
              <div className="text-gray-700 leading-relaxed text-[14px] font-medium max-w-xl">
                 Hey! what are the past?🤔<br/>
                 We can many to use all themes and ours customization are created?
              </div>
              <div className="flex gap-2 mt-2">
                <div className="px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-full flex gap-1.5 items-center text-[12px] shadow-sm hover:bg-gray-100 cursor-pointer transition-colors">
                   👍 <span className="font-bold text-gray-600">1</span>
                </div>
              </div>
            </div>
          </div>

          {/* Message 2 */}
          <div className="flex gap-4 group">
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0 shadow-sm border border-gray-100">
               <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" className="w-full h-full object-cover"/>
            </div>
            <div>
              <div className="flex gap-2 items-baseline mb-1">
                 <span className="font-bold text-[14px] text-gray-900">Marfor Roather</span>
                 <span className="text-gray-400 text-[11px] font-medium">3:55 PM</span>
              </div>
              <div className="text-gray-700 leading-relaxed text-[14px] font-medium max-w-xl mb-3">
                 You smile on sharing card from your documentation or practices.
              </div>
              
              {/* PDF Card */}
              <div className="border border-gray-200 rounded-xl p-3.5 flex gap-3.5 items-center max-w-[340px] bg-white shadow-sm hover:border-gray-300 transition-colors cursor-pointer mb-3">
                <div className="w-10 h-12 bg-red-50 border border-red-100 flex items-center justify-center text-red-500 font-bold text-[10px] rounded-md shrink-0">
                   PDF
                </div>
                <div className="min-w-0">
                   <div className="font-bold text-gray-900 truncate text-[13px] mb-0.5">PDF Document</div>
                   <div className="text-gray-400 text-[11px] truncate font-medium">PDF document 2.12MB PDF</div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-2">
                <div className="px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-full flex gap-1.5 items-center text-[12px] shadow-sm hover:bg-gray-100 cursor-pointer transition-colors">
                   👍 <span className="font-bold text-gray-600">1</span>
                </div>
              </div>
            </div>
          </div>

          {/* Message 3 */}
          <div className="flex gap-4 group">
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0 shadow-sm border border-gray-100">
               <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop" className="w-full h-full object-cover"/>
            </div>
            <div className="flex-1 max-w-2xl">
              <div className="flex gap-2 items-baseline mb-1">
                 <span className="font-bold text-[14px] text-gray-900">Jason Reiber</span>
                 <span className="text-gray-400 text-[11px] font-medium">9:38 AM</span>
              </div>
              <div className="text-gray-700 leading-relaxed text-[14px] font-medium mb-3">
                 We're eating 1 cookies now at a project one dinner cron this project, and my parachute-attendant comes right!!
              </div>
              
              {/* Image Card */}
              <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:border-gray-300 transition-colors cursor-pointer">
                 <div className="h-[200px] w-full bg-gray-100">
                    <img src="https://images.unsplash.com/photo-1506744626753-eda8151a7474?w=800&h=400&fit=crop" className="w-full h-full object-cover"/>
                 </div>
                 <div className="p-3">
                    <div className="font-bold text-gray-900 text-[13px]">High resolution image explorer in...</div>
                    <div className="text-gray-400 text-[11px] font-medium mt-0.5">dribbble.com</div>
                 </div>
              </div>
            </div>
          </div>

        </div>
        
        {/* Input Box */}
        <div className="p-6 bg-white shrink-0">
           <div className="border border-gray-200 focus-within:border-[#6366F1] focus-within:ring-1 focus-within:ring-[#6366F1] rounded-full px-4 py-3 flex items-center gap-3 bg-white shadow-sm transition-all">
             <Plus className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
             <input 
               type="text" 
               placeholder="Message message" 
               className="flex-1 bg-transparent outline-none text-[14px] text-gray-900 placeholder:text-gray-400 placeholder:font-medium" 
             />
             <div className="flex items-center gap-3 text-gray-400">
                <svg className="w-4 h-4 cursor-pointer hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <svg className="w-4 h-4 cursor-pointer hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <svg className="w-4 h-4 cursor-pointer hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
             </div>
           </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-[280px] bg-white flex flex-col shrink-0">
        <div className="p-4 pb-2">
          <div className="bg-gray-50 border border-gray-100 rounded-md p-2 flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search" 
              className="bg-transparent outline-none text-[13px] text-gray-900 w-full placeholder:text-gray-400 placeholder:font-medium"
            />
          </div>
        </div>
        
        <div className="px-5 py-4 overflow-y-auto custom-scrollbar">
           <div className="text-[12px] font-bold text-gray-900 mb-4 tracking-tight">Online Team</div>
           <div className="space-y-3.5 mb-8">
             {[
               { n: 'Domo Hamo', p: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop' },
               { n: 'Design Yeather', p: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' },
               { n: 'Marfor Roather', p: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
               { n: 'Mike Ritare', p: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' },
               { n: 'Nabry Shana', p: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop' }
             ].map((user,i)=>(
               <div key={i} className="flex justify-between items-center cursor-pointer group">
                 <div className="flex items-center gap-2.5">
                   <div className="w-7 h-7 rounded-full bg-gray-200 overflow-hidden shadow-sm border border-gray-100"><img src={user.p} className="w-full h-full object-cover"/></div>
                   <span className="font-semibold text-gray-600 text-[13px] group-hover:text-gray-900 transition-colors">{user.n}</span>
                 </div>
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-200"></div>
               </div>
             ))}
           </div>
           
           <div className="text-[12px] font-bold text-gray-900 mb-4 tracking-tight">Workspace Details</div>
           <div className="text-[11px] font-bold text-gray-500 mb-2 uppercase tracking-wider">Pinned Links</div>
           <div className="space-y-2 mb-6">
             <div className="flex gap-2 text-gray-500 truncate text-[12px] font-medium hover:text-[#6366F1] cursor-pointer transition-colors"><Pin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5"/> https://link.com/CollabHub/1</div>
             <div className="flex gap-2 text-gray-500 truncate text-[12px] font-medium hover:text-[#6366F1] cursor-pointer transition-colors"><Pin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5"/> https://www.vekoonce.ee/v1/</div>
             <div className="flex gap-2 text-gray-500 truncate text-[12px] font-medium hover:text-[#6366F1] cursor-pointer transition-colors"><Pin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5"/> TeamBinz.com/workspace</div>
           </div>
           
           <div className="text-[11px] font-bold text-gray-500 mb-2 uppercase tracking-wider">Key deadlines</div>
           <div className="flex gap-2 text-gray-700 mb-6 items-center text-[12px] font-medium"><Calendar className="w-4 h-4 text-gray-400"/> May 28th, 2026, 20:00</div>
           
           <div className="text-[11px] font-bold text-gray-500 mb-2 uppercase tracking-wider">Team goals</div>
           <div className="space-y-2.5">
             <div className="flex gap-2 text-gray-700 truncate items-center text-[12px] font-medium"><CheckCircle2 className="w-4 h-4 text-gray-300"/> Team goals team...</div>
             <div className="flex gap-2 text-gray-700 truncate items-center text-[12px] font-medium"><CheckCircle2 className="w-4 h-4 text-gray-300"/> Team goals to s...</div>
             <div className="flex gap-2 text-gray-700 truncate items-center text-[12px] font-medium"><CheckCircle2 className="w-4 h-4 text-gray-300"/> Team goals for s...</div>
           </div>
        </div>
      </div>

    </div>
  )
}
