import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Rocket, Calendar, MessageSquare, Cloud, FileText, GitPullRequest, Search, Hash, Plus, Settings, CheckCircle2, Pin } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F8FF] to-[#E9F0FE] font-sans overflow-hidden">
      
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-[22px] tracking-tight text-gray-900">
          <div className="relative w-6 h-6 border-2 border-gray-900 rounded-[5px] flex items-center justify-center bg-transparent">
             <div className="absolute -top-1 -right-1 w-3 h-3 bg-white border-2 border-gray-900 rounded-[3px]"></div>
          </div>
          CollabHub
        </div>
        
        <div className="hidden md:flex items-center gap-8 font-medium text-[15px] text-gray-600">
          <Link href="#features" className="hover:text-gray-900 transition-colors">Features</Link>
          <Link href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</Link>
          <Link href="#integration" className="hover:text-gray-900 transition-colors">Integration</Link>
          <Link href="#enterprise" className="hover:text-gray-900 transition-colors">Enterprise</Link>
          <Link href="#support" className="hover:text-gray-900 transition-colors">Support</Link>
        </div>

        <Link href="/signup">
          <Button className="bg-[#5C55E6] hover:bg-[#4F46E5] text-white px-5 py-5 rounded-[8px] font-semibold text-[15px] shadow-sm transition-all">
            Get CollabHub Free
          </Button>
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-8 lg:pt-16 pb-24 flex flex-col lg:flex-row items-center relative">
        
        {/* Left Content */}
        <div className="lg:w-[42%] z-10 relative pr-4">
          <h1 className="text-[3rem] lg:text-[4rem] font-bold text-gray-900 leading-[1.02] tracking-tighter mb-5">
            COLLABORATION<br/>
            THAT'S<br/>
            EFFORTLESS &<br/>
            POWERFUL
          </h1>
          <p className="text-[17px] text-gray-700 mb-12 max-w-[400px] leading-relaxed font-normal">
            CollabHub is the ultimate platform for team communication and project coordination. Streamline your workflows, share ideas, and keep everyone on the same page.
          </p>
          
          {/* Animated Team Illustration */}
          <div className="relative w-80 h-48 mt-12 hidden lg:block -ml-4">
            <div className="w-36 h-36 absolute left-0 bottom-0 z-10 transition-transform hover:-translate-y-2 duration-300">
               <img src="https://api.dicebear.com/7.x/micah/svg?seed=Felix&backgroundColor=transparent&mouth=laughing" alt="Team Member 1" className="w-full h-full drop-shadow-xl" />
            </div>
            <div className="w-44 h-44 absolute left-20 bottom-2 z-20 transition-transform hover:-translate-y-2 duration-300">
               <img src="https://api.dicebear.com/7.x/micah/svg?seed=Caleb&backgroundColor=transparent&mouth=smile" alt="Team Member 2" className="w-full h-full drop-shadow-2xl" />
            </div>
            <div className="w-36 h-36 absolute left-48 bottom-0 z-10 transition-transform hover:-translate-y-2 duration-300">
               <img src="https://api.dicebear.com/7.x/micah/svg?seed=Oliver&backgroundColor=transparent&mouth=laughing" alt="Team Member 3" className="w-full h-full drop-shadow-xl" />
            </div>
          </div>
        </div>

        {/* Right Content - Monitor Mockup */}
        <div className="lg:w-[58%] mt-12 lg:mt-0 relative z-0 flex justify-end">
          
          {/* Floating Icons Background (Static & Outline) */}
          <div className="absolute top-4 left-4 w-12 h-12 bg-transparent flex items-center justify-center transform -rotate-12">
            <GitPullRequest className="w-8 h-8 text-gray-800" strokeWidth={1} />
          </div>
          <div className="absolute -top-8 left-1/3 w-14 h-14 bg-transparent flex items-center justify-center transform rotate-12">
            <Rocket className="w-10 h-10 text-gray-800" strokeWidth={1} />
          </div>
          <div className="absolute top-16 right-16 w-10 h-10 bg-transparent flex items-center justify-center transform rotate-6">
            <FileText className="w-8 h-8 text-gray-800" strokeWidth={1} />
          </div>
          <div className="absolute top-1/3 -right-6 w-16 h-16 bg-transparent flex items-center justify-center transform -rotate-6">
            <Calendar className="w-12 h-12 text-gray-800" strokeWidth={1} />
          </div>
          <div className="absolute bottom-40 -left-6 w-14 h-14 bg-transparent flex items-center justify-center transform -rotate-12">
            <MessageSquare className="w-10 h-10 text-gray-800" strokeWidth={1} />
          </div>
          <div className="absolute bottom-16 right-2 w-16 h-16 bg-transparent flex items-center justify-center transform rotate-12">
            <Cloud className="w-12 h-12 text-gray-800" strokeWidth={1} />
          </div>

          {/* Desktop Monitor Frame - Perfectly Static and Straight */}
          <div className="relative w-full max-w-[850px] aspect-[16/10] bg-[#1a1a1a] rounded-[1.2rem] sm:rounded-[1.8rem] p-1.5 sm:p-2.5 shadow-2xl z-10 border-b-4 border-b-gray-900 border-r-4 border-r-gray-900">
            
            {/* Camera dot */}
            <div className="absolute top-1 sm:top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-gray-700 rounded-full"></div>

            {/* Inner Screen - Actual UI Replica */}
            <div className="w-full h-full bg-white rounded-[0.5rem] sm:rounded-[1.2rem] overflow-hidden flex relative text-[8px] sm:text-[10px]">
              
              {/* Sidebar Replica */}
              <div className="w-[20%] h-full border-r border-gray-100 bg-white flex flex-col">
                <div className="h-8 sm:h-12 flex items-center px-3 sm:px-4 mb-1">
                  <div className="flex items-center gap-1.5 font-bold tracking-tight text-gray-900 text-[10px] sm:text-[12px]">
                    <div className="relative w-3 h-3 sm:w-4 sm:h-4 border-[1.5px] border-gray-900 rounded-[2px] sm:rounded-[3px] bg-transparent">
                      <div className="absolute -top-[2px] -right-[2px] w-[6px] h-[6px] sm:w-[8px] sm:h-[8px] bg-white border-[1.5px] border-gray-900 rounded-[1px] sm:rounded-[2px]"></div>
                    </div>
                    CollabHub
                  </div>
                </div>
                <div className="px-2 sm:px-3 mb-3">
                  <div className="text-[6px] sm:text-[7.5px] font-semibold text-gray-400 uppercase mb-1.5 px-1 sm:px-2">Workspaces</div>
                  <div className="space-y-0.5">
                    {[{n:'Project Delta', c:'bg-blue-500'}, {n:'Design Team Hub', c:'bg-orange-500'}, {n:'Project Team', c:'bg-purple-500'}].map((w,i)=>(
                      <div key={i} className="flex items-center gap-1.5 sm:gap-2 px-1 sm:px-2 py-1 rounded text-gray-700 font-medium text-[7px] sm:text-[9px]">
                        <div className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-[2px] ${w.c}`}></div>
                        <span className="truncate">{w.n}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="px-2 sm:px-3">
                  <div className="flex justify-between items-center text-[6px] sm:text-[7.5px] font-semibold text-gray-400 uppercase mb-1.5 px-1 sm:px-2">Channels <Plus className="w-2 h-2 sm:w-2.5 sm:h-2.5"/></div>
                  <div className="space-y-0.5">
                    {[{n:'design-feedback', a:true}, {n:'engineering-log', a:false}, {n:'client-sync', a:false}].map((c,i)=>(
                      <div key={i} className={`flex items-center gap-1.5 sm:gap-2 px-1 sm:px-2 py-1 rounded font-medium text-[7px] sm:text-[9px] ${c.a?'bg-gray-100 text-gray-900 font-bold':'text-gray-500'}`}>
                        <Hash className={`w-2 h-2 sm:w-2.5 sm:h-2.5 ${c.a?'text-gray-900':'text-gray-400'}`} strokeWidth={c.a?2.5:2} />
                        <span className="truncate">{c.n}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-auto p-2 sm:p-3 border-t border-gray-100 flex justify-between items-center">
                   <div className="flex items-center gap-1.5">
                     <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full overflow-hidden bg-gray-100">
                        <img src="https://api.dicebear.com/7.x/micah/svg?seed=User1&backgroundColor=f3f4f6&mouth=smile" alt="avatar" className="w-full h-full object-cover"/>
                     </div>
                     <div className="hidden sm:block"><div className="font-semibold text-gray-900 text-[8px] sm:text-[10px]">Destriee</div></div>
                   </div>
                   <Settings className="w-2 h-2 sm:w-3 sm:h-3 text-gray-400" />
                </div>
              </div>

              {/* Center Replica */}
              <div className="w-[55%] flex flex-col border-r border-gray-100">
                <div className="h-8 sm:h-12 border-b border-gray-100 flex items-center justify-between px-3 sm:px-5">
                  <div className="flex items-center gap-2"><span className="font-bold text-[9px] sm:text-[13px] text-gray-900"># design-feedback</span><span className="px-1.5 sm:px-2 py-0.5 bg-gray-50 border border-gray-100 rounded-full text-gray-500 font-medium text-[6px] sm:text-[8px]">Today</span></div>
                  <div className="flex -space-x-1 sm:-space-x-1.5">
                    {[
                      "https://api.dicebear.com/7.x/micah/svg?seed=User2&backgroundColor=f3f4f6&mouth=smile",
                      "https://api.dicebear.com/7.x/micah/svg?seed=User3&backgroundColor=f3f4f6&mouth=smile",
                      "https://api.dicebear.com/7.x/micah/svg?seed=User4&backgroundColor=f3f4f6&mouth=smile"
                    ].map((url, i)=><div key={i} className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gray-200 border-2 border-white overflow-hidden"><img src={url} className="w-full h-full object-cover"/></div>)}
                  </div>
                </div>
                <div className="flex-1 p-3 sm:p-5 space-y-4 sm:space-y-6 bg-white overflow-hidden">
                  <div className="flex gap-2 sm:gap-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-200 overflow-hidden shrink-0">
                       <img src="https://api.dicebear.com/7.x/micah/svg?seed=User5&backgroundColor=f3f4f6&mouth=smile" className="w-full h-full object-cover"/>
                    </div>
                    <div>
                      <div className="flex gap-2 items-baseline mb-0.5 sm:mb-1"><span className="font-bold text-gray-900 text-[8px] sm:text-[11px]">Project Delta</span><span className="text-gray-400 text-[6px] sm:text-[8px]">2:44 PM</span></div>
                      <div className="text-gray-700 leading-relaxed text-[7.5px] sm:text-[10.5px]">Hey! what are the past?🤔<br/>We can many to use all themes and ours customization are created?</div>
                      <div className="flex gap-1 sm:gap-2 mt-1 sm:mt-2">
                        <div className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-50 border border-gray-100 rounded-full flex gap-1 items-center text-[6px] sm:text-[9px]">👍 <span className="font-semibold text-gray-600">1</span></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 sm:gap-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-200 overflow-hidden shrink-0">
                       <img src="https://api.dicebear.com/7.x/micah/svg?seed=User6&backgroundColor=f3f4f6&mouth=smile" className="w-full h-full object-cover"/>
                    </div>
                    <div>
                      <div className="flex gap-2 items-baseline mb-0.5 sm:mb-1"><span className="font-bold text-gray-900 text-[8px] sm:text-[11px]">Marfor Roather</span><span className="text-gray-400 text-[6px] sm:text-[8px]">3:55 PM</span></div>
                      <div className="text-gray-700 leading-relaxed mb-2 text-[7.5px] sm:text-[10.5px]">You smile on sharing card from your documentation or practices.</div>
                      <div className="border border-gray-200 rounded-lg p-2 sm:p-2.5 flex gap-2 sm:gap-3 items-center max-w-[220px]">
                        <div className="w-6 h-8 sm:w-8 sm:h-10 bg-red-50 border border-red-100 flex items-center justify-center text-red-500 font-bold text-[6px] sm:text-[9px] rounded">PDF</div>
                        <div className="min-w-0"><div className="font-bold text-gray-900 truncate text-[7.5px] sm:text-[10px]">PDF Document</div><div className="text-gray-400 text-[6px] sm:text-[8px] truncate">PDF document 2.12MB PDF</div></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-2 sm:p-3 bg-white mt-auto border-t border-gray-50">
                   <div className="border border-gray-200 rounded-full px-3 py-1.5 sm:py-2 flex items-center gap-2">
                     <Plus className="w-3 h-3 text-gray-400" />
                     <span className="text-gray-400 flex-1 text-[7.5px] sm:text-[10px]">Message message</span>
                   </div>
                </div>
              </div>

              {/* Right Replica */}
              <div className="w-[25%] bg-white flex flex-col pt-1">
                <div className="p-2 sm:p-3 pb-1">
                  <div className="bg-gray-50 border border-gray-100 rounded-md p-1 sm:p-1.5 flex items-center gap-1.5">
                    <Search className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-400" />
                    <span className="text-gray-400 text-[6px] sm:text-[9px]">Search</span>
                  </div>
                </div>
                <div className="px-3 sm:px-4 py-2">
                   <div className="text-[7px] sm:text-[10px] font-bold text-gray-900 mb-2 sm:mb-3">Online Team</div>
                   <div className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
                     {[
                       { n: 'Domo Hamo', p: 'https://api.dicebear.com/7.x/micah/svg?seed=User7&backgroundColor=f3f4f6&mouth=smile' },
                       { n: 'Design Yeather', p: 'https://api.dicebear.com/7.x/micah/svg?seed=User8&backgroundColor=f3f4f6&mouth=smile' },
                       { n: 'Marfor Roather', p: 'https://api.dicebear.com/7.x/micah/svg?seed=User9&backgroundColor=f3f4f6&mouth=smile' },
                       { n: 'Mike Ritare', p: 'https://api.dicebear.com/7.x/micah/svg?seed=User10&backgroundColor=f3f4f6&mouth=smile' }
                     ].map((user,i)=>(
                       <div key={i} className="flex justify-between items-center">
                         <div className="flex items-center gap-1.5 sm:gap-2">
                           <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gray-200 overflow-hidden"><img src={user.p} className="w-full h-full object-cover"/></div>
                           <span className="font-medium text-gray-700 truncate text-[7px] sm:text-[9px]">{user.n}</span>
                         </div>
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                       </div>
                     ))}
                   </div>
                   
                   <div className="text-[7px] sm:text-[10px] font-bold text-gray-900 mb-2 sm:mb-3">Workspace Details</div>
                   <div className="text-[6px] sm:text-[8px] font-bold text-gray-500 mb-1.5">Pinned Links</div>
                   <div className="space-y-1 mb-3">
                     <div className="flex gap-1 text-gray-500 truncate text-[6.5px] sm:text-[8.5px]"><Pin className="w-2 h-2 text-red-500 shrink-0"/> https://link.com/Collab</div>
                     <div className="flex gap-1 text-gray-500 truncate text-[6.5px] sm:text-[8.5px]"><Pin className="w-2 h-2 text-red-500 shrink-0"/> https://www.vekoon.ee</div>
                   </div>
                   
                   <div className="text-[6px] sm:text-[8px] font-bold text-gray-500 mb-1.5">Key deadlines</div>
                   <div className="flex gap-1 text-gray-500 mb-3 items-center text-[6.5px] sm:text-[8.5px]"><Calendar className="w-2.5 h-2.5"/> May 28th, 2026, 20:00</div>
                   
                   <div className="text-[6px] sm:text-[8px] font-bold text-gray-500 mb-1.5">Team goals</div>
                   <div className="space-y-1">
                     <div className="flex gap-1 text-gray-500 truncate items-center text-[6.5px] sm:text-[8.5px]"><CheckCircle2 className="w-2.5 h-2.5 text-gray-400"/> Team goals team...</div>
                     <div className="flex gap-1 text-gray-500 truncate items-center text-[6.5px] sm:text-[8.5px]"><CheckCircle2 className="w-2.5 h-2.5 text-gray-400"/> Team goals to s...</div>
                   </div>
                </div>
              </div>

            </div>
            
            {/* Monitor Stand - Flat, static style */}
            <div className="absolute -bottom-[20px] sm:-bottom-[30px] left-1/2 -translate-x-1/2 w-16 sm:w-24 h-[20px] sm:h-[30px] bg-gradient-to-b from-gray-200 to-gray-300" style={{ clipPath: 'polygon(20% 0, 80% 0, 100% 100%, 0% 100%)' }}></div>
            <div className="absolute -bottom-[25px] sm:-bottom-[38px] left-1/2 -translate-x-1/2 w-32 sm:w-48 h-[6px] sm:h-[8px] bg-gray-200 rounded-full shadow-lg"></div>
          </div>

          {/* Mobile Phone Mockup Overlay - Perfectly Static and Straight */}
          <div className="absolute -bottom-6 sm:-bottom-8 -right-4 sm:-right-8 w-[110px] sm:w-[150px] aspect-[1/2] bg-[#1a1a1a] rounded-[1.5rem] sm:rounded-[2rem] p-1.5 sm:p-2 shadow-2xl z-20 border-b-4 border-b-gray-900 border-r-4 border-r-gray-900">
            <div className="w-full h-full bg-white rounded-[1rem] sm:rounded-[1.4rem] overflow-hidden flex flex-col relative text-[8px] sm:text-[10px]">
              {/* Dynamic Island */}
              <div className="absolute top-1.5 sm:top-2 left-1/2 -translate-x-1/2 w-1/3 h-2.5 sm:h-3.5 bg-[#1a1a1a] rounded-full z-10"></div>
              
              <div className="pt-5 sm:pt-7 px-3 sm:px-4 flex items-center justify-between border-b border-gray-50 pb-2">
                <div className="font-bold flex items-center gap-1 text-[7px] sm:text-[10px]">
                  <div className="relative w-2.5 h-2.5 border-[1px] border-gray-900 rounded-[2px] bg-transparent">
                     <div className="absolute -top-[1px] -right-[1px] w-[4px] h-[4px] bg-white border-[1px] border-gray-900 rounded-[1px]"></div>
                  </div>
                  CollabHub
                </div>
                <Search className="w-2.5 h-2.5 text-gray-900" />
              </div>
              
              <div className="flex-1 p-2 sm:p-3 overflow-hidden bg-white">
                 {/* Mini chat bubbles or video call grid */}
                 <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mb-3">
                   <div className="aspect-square bg-blue-50 rounded-lg overflow-hidden"><img src="https://api.dicebear.com/7.x/micah/svg?seed=User11&backgroundColor=f3f4f6&mouth=smile" className="w-full h-full object-cover"/></div>
                   <div className="aspect-square bg-purple-50 rounded-lg overflow-hidden"><img src="https://api.dicebear.com/7.x/micah/svg?seed=User12&backgroundColor=f3f4f6&mouth=smile" className="w-full h-full object-cover"/></div>
                   <div className="aspect-square bg-orange-50 rounded-lg overflow-hidden"><img src="https://api.dicebear.com/7.x/micah/svg?seed=User13&backgroundColor=f3f4f6&mouth=smile" className="w-full h-full object-cover"/></div>
                   <div className="aspect-square bg-emerald-50 rounded-lg overflow-hidden"><img src="https://api.dicebear.com/7.x/micah/svg?seed=User14&backgroundColor=f3f4f6&mouth=smile" className="w-full h-full object-cover"/></div>
                 </div>
                 <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                   <div className="font-bold text-gray-900 mb-1 text-[7px] sm:text-[9px]">Channels</div>
                   <div className="space-y-1 text-[6.5px] sm:text-[8.5px]">
                     <div className="flex items-center gap-1 text-gray-900 font-semibold bg-gray-50 rounded px-1 py-0.5"><Hash className="w-2 h-2"/> design-feedback</div>
                     <div className="flex items-center gap-1 text-gray-500 px-1 py-0.5"><Hash className="w-2 h-2"/> engineering</div>
                     <div className="flex items-center gap-1 text-gray-500 px-1 py-0.5"><Hash className="w-2 h-2"/> client-sync</div>
                   </div>
                 </div>
              </div>
              <div className="h-10 sm:h-12 bg-white border-t border-gray-100 flex justify-around items-center px-2">
                 <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center"><Hash className="w-2.5 h-2.5 text-gray-600"/></div>
                 <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center"><MessageSquare className="w-2.5 h-2.5 text-gray-600"/></div>
                 <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-sm shadow-red-200 text-white font-bold text-[5px] sm:text-[6px]">End</div>
              </div>
            </div>
          </div>

        </div>

      </main>
    </div>
  )
}
