import { Search, Plus, Smile, Image as ImageIcon, Send, Paperclip, Pin, Calendar, CheckCircle2 } from "lucide-react"

export default function Messages() {
  return (
    <div className="flex-1 flex h-full overflow-hidden bg-white">
      {/* Center Chat Column */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-gray-200">
        
        {/* Chat Header */}
        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-1">
              # design-feedback
            </h2>
            <div className="px-2 py-0.5 rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
              Today
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {['Domo', 'Marfor', 'Jason'].map((seed, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`} alt={seed} className="w-full h-full" />
                </div>
              ))}
            </div>
            <div className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 ml-1 cursor-pointer hover:border-gray-400">
              <Plus className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-white">
          
          {/* Message 1 */}
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0 overflow-hidden">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Project" alt="Avatar" className="w-full h-full" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-bold text-gray-900 text-[15px]">Project Delta</span>
                <span className="text-xs text-gray-400 font-medium">2:44 PM</span>
              </div>
              <div className="text-gray-700 text-[15px] leading-relaxed mb-2">
                <p>Hey! what are the past?🤔</p>
                <p>We can many to use all themes and ours customization are created?</p>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-50 border border-gray-100 text-xs">
                  <span>👍</span> <span className="font-semibold text-gray-600">1</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-50 border border-gray-100 text-xs">
                  <span>🎉</span> <span className="font-semibold text-gray-600">1</span>
                </div>
              </div>
            </div>
          </div>

          {/* Message 2 */}
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0 overflow-hidden">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Marfor" alt="Avatar" className="w-full h-full" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-bold text-gray-900 text-[15px]">Marfor Roather</span>
                <span className="text-xs text-gray-400 font-medium">3:55 PM</span>
              </div>
              <div className="text-gray-700 text-[15px] leading-relaxed mb-3">
                <p>You smile on sharing card from your documentation or practices.</p>
              </div>
              
              {/* Attachment Card */}
              <div className="max-w-sm rounded-xl border border-gray-200 p-4 mb-3 flex gap-4 items-center bg-white shadow-sm">
                <div className="w-12 h-14 rounded bg-red-50 flex items-center justify-center shrink-0 border border-red-100 relative">
                  <div className="absolute top-0 right-0 w-4 h-4 bg-white rounded-bl border-b border-l border-red-100"></div>
                  <span className="text-red-500 font-bold text-sm">PDF</span>
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-gray-900 text-[15px] truncate">PDF Document</h4>
                  <p className="text-xs text-gray-500 truncate">PDF document 2.12MB PDF</p>
                  <p className="text-[11px] text-gray-400 truncate mt-1">https://www.doc.kimswwrite.pdf</p>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 border border-green-100 text-xs">
                  <span>👍</span> <span className="font-semibold text-green-700">2</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-50 border border-gray-100 text-xs">
                  <span>✅</span> <span className="font-semibold text-gray-600">1</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-50 border border-gray-100 text-xs">
                  <span>🔥</span> <span className="font-semibold text-gray-600">1</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-50 border border-gray-100 text-xs">
                  <span>😄</span> <span className="font-semibold text-gray-600">1</span>
                </div>
              </div>
            </div>
          </div>

          {/* Message 3 */}
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0 overflow-hidden">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jason" alt="Avatar" className="w-full h-full" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-bold text-gray-900 text-[15px]">Jason Reitor</span>
                <span className="text-xs text-gray-400 font-medium">9:36 AM</span>
              </div>
              <div className="text-gray-700 text-[15px] leading-relaxed mb-3">
                <p>We're eating 1 cookies now at a project one dinner crons this project, and my parachute-attendant comes right!!</p>
              </div>
              
              {/* Image Attachment Card */}
              <div className="max-w-sm rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm">
                <div className="h-32 w-full bg-gray-200">
                  <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800" alt="Mountain landscape" className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <h4 className="font-bold text-gray-900 text-[14px] truncate">High resolution image explorer in...</h4>
                  <p className="text-[11px] text-gray-400 truncate mt-0.5">uiuxhub.com</p>
                </div>
              </div>
            </div>
          </div>
          
        </div>

        {/* Message Input */}
        <div className="p-4 bg-white shrink-0">
          <div className="relative flex items-center bg-white border border-gray-300 rounded-full shadow-sm px-4 py-2.5 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-400 transition-all">
            <Plus className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600 shrink-0" />
            <input 
              type="text" 
              placeholder="Message message" 
              className="flex-1 bg-transparent border-none focus:outline-none px-3 text-sm text-gray-900 placeholder-gray-400 min-w-0"
            />
            <div className="flex items-center gap-3 shrink-0 text-gray-400">
              <Smile className="w-5 h-5 cursor-pointer hover:text-gray-600" />
              <ImageIcon className="w-5 h-5 cursor-pointer hover:text-gray-600" />
              <Paperclip className="w-5 h-5 cursor-pointer hover:text-gray-600" />
              <div className="w-6 h-6 flex items-center justify-center cursor-pointer hover:text-indigo-600">
                <Send className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Right Sidebar - Exact match */}
      <div className="w-[300px] bg-white flex flex-col shrink-0">
        
        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center border border-gray-300 rounded-sm text-[10px] text-gray-400 font-medium cursor-pointer">
              +
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-2 custom-scrollbar">
          
          {/* Online Team */}
          <div className="mb-8">
            <h3 className="text-[13px] font-bold text-gray-900 mb-4">Online Team</h3>
            <div className="space-y-3">
              {[
                { name: 'Domo Hamo', seed: 'Domo' },
                { name: 'Design Yeaher', seed: 'Design' },
                { name: 'Marfor Roather', seed: 'Marfor' },
                { name: 'Mike Ritare', seed: 'Mike' },
                { name: 'Nairy Shina', seed: 'Nairy' }
              ].map((user, i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-gray-200 overflow-hidden relative">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.seed}`} alt={user.name} className="w-full h-full" />
                    </div>
                    <span className="text-[13px] font-medium text-gray-700 group-hover:text-gray-900">{user.name}</span>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-emerald-400 border border-white"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Workspace Details */}
          <div className="mb-8">
            <h3 className="text-[13px] font-bold text-gray-900 mb-4">Workspace Details</h3>
            
            <div className="mb-4">
              <h4 className="text-[12px] font-bold text-gray-700 mb-2">Pinned Links</h4>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Pin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                  <a href="#" className="text-[12px] text-gray-500 hover:text-indigo-600 truncate underline decoration-gray-300 underline-offset-2">https://link.com/CollabHub/1</a>
                </div>
                <div className="flex items-start gap-2">
                  <Pin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                  <a href="#" className="text-[12px] text-gray-500 hover:text-indigo-600 truncate underline decoration-gray-300 underline-offset-2">https://www.vekoonce.ee/v1/</a>
                </div>
                <div className="flex items-start gap-2">
                  <Pin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                  <a href="#" className="text-[12px] text-gray-500 hover:text-indigo-600 truncate underline decoration-gray-300 underline-offset-2">TeamBinz.com/workspace</a>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-[12px] font-bold text-gray-700 mb-2">Key deadlines</h4>
              <div className="flex items-center gap-2 text-[12px] text-gray-600">
                <Calendar className="w-4 h-4 text-gray-400" />
                May 28th, 2026, 20:00
              </div>
            </div>

            <div>
              <h4 className="text-[12px] font-bold text-gray-700 mb-2">Team goals</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[12px] text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-gray-400" />
                  <span className="truncate">Team goals team o...</span>
                </div>
                <div className="flex items-center gap-2 text-[12px] text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-gray-400" />
                  <span className="truncate">Team goals to shos...</span>
                </div>
                <div className="flex items-center gap-2 text-[12px] text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-gray-400" />
                  <span className="truncate">Team goals for sec...</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
