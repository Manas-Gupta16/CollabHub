"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  Rocket, Calendar, MessageSquare, Cloud, FileText, GitPullRequest, Search, 
  Hash, Plus, Settings, CheckCircle2, Pin, Check, Sparkles, ShieldCheck, 
  Zap, Users, Lock, ArrowRight, ChevronDown, Activity, Globe, Cpu, Star, HelpCircle
} from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F8FF] via-[#F8FAFC] to-[#E9F0FE] font-sans text-gray-900 overflow-hidden">
      
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between sticky top-0 z-50 bg-[#F5F8FF]/85 backdrop-blur-md border-b border-gray-100/60"
      >
        <Link href="/" className="flex items-center gap-2 font-bold text-[22px] tracking-tight text-gray-900 hover:opacity-85 transition-opacity">
          <div className="relative w-6 h-6 border-2 border-gray-900 rounded-[5px] flex items-center justify-center bg-transparent">
             <div className="absolute -top-1 -right-1 w-3 h-3 bg-white border-2 border-gray-900 rounded-[3px]"></div>
          </div>
          CollabHub
        </Link>
        
        <div className="hidden md:flex items-center gap-8 font-semibold text-[14px] text-gray-600">
          <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
          <a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a>
          <a href="#integration" className="hover:text-indigo-600 transition-colors">Integration</a>
          <a href="#enterprise" className="hover:text-indigo-600 transition-colors">Enterprise</a>
          <a href="#support" className="hover:text-indigo-600 transition-colors">Support</a>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden sm:inline-flex text-xs font-bold text-gray-700 hover:text-indigo-600 px-3 py-2">
            Sign In
          </Link>
          <Link href="/signup">
            <Button className="bg-[#5C55E6] hover:bg-[#4F46E5] text-white px-5 py-2.5 rounded-[10px] font-semibold text-[14px] shadow-sm transition-all cursor-pointer hover:shadow-indigo-500/25">
              Get CollabHub Free
            </Button>
          </Link>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-8 lg:pt-16 pb-20 flex flex-col lg:flex-row items-center relative">
        
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:w-[42%] z-10 relative pr-4"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100/80 text-indigo-600 text-xs font-bold mb-6 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
            <span>Next-Gen Workspace Collaboration</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-[3rem] lg:text-[4rem] font-bold text-gray-900 leading-[1.02] tracking-tighter mb-5"
          >
            COLLABORATION<br/>
            THAT&apos;S<br/>
            EFFORTLESS &<br/>
            POWERFUL
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-[16px] text-gray-600 mb-8 max-w-[420px] leading-relaxed font-normal"
          >
            CollabHub unites channel messaging, task tracking, resource pinning, and team goal alignment into one streamlined workspace platform.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center gap-4 mb-10"
          >
            <Link href="/signup">
              <Button className="bg-[#5C55E6] hover:bg-[#4F46E5] text-white px-7 py-6 rounded-xl font-bold text-[15px] shadow-lg shadow-indigo-500/20 transition-all cursor-pointer flex items-center gap-2 hover:scale-[1.02]">
                Start Collaborating Free <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <a href="#features" className="px-5 py-3.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-xs hover:bg-white transition-all hover:border-gray-300">
              Explore Features
            </a>
          </motion.div>
          
          {/* Animated Team Illustration */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative w-80 h-44 mt-4 hidden lg:block -ml-4"
          >
            <motion.div 
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-36 h-36 absolute left-0 bottom-0 z-10"
            >
               <img src="https://api.dicebear.com/7.x/micah/svg?seed=Felix&backgroundColor=transparent&mouth=laughing" alt="Team Member 1" className="w-full h-full drop-shadow-xl" />
            </motion.div>
            <motion.div 
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="w-44 h-44 absolute left-20 bottom-2 z-20"
            >
               <img src="https://api.dicebear.com/7.x/micah/svg?seed=Caleb&backgroundColor=transparent&mouth=smile" alt="Team Member 2" className="w-full h-full drop-shadow-2xl" />
            </motion.div>
            <motion.div 
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="w-36 h-36 absolute left-48 bottom-0 z-10"
            >
               <img src="https://api.dicebear.com/7.x/micah/svg?seed=Oliver&backgroundColor=transparent&mouth=laughing" alt="Team Member 3" className="w-full h-full drop-shadow-xl" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right Content - Monitor Mockup with Floating Animation */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="lg:w-[58%] mt-12 lg:mt-0 relative z-0 flex justify-end"
        >
          
          {/* Floating Background Icons */}
          <motion.div 
            animate={{ y: [0, -12, 0], rotate: [-12, -8, -12] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-4 left-4 w-12 h-12 bg-transparent flex items-center justify-center"
          >
            <GitPullRequest className="w-8 h-8 text-gray-800" strokeWidth={1} />
          </motion.div>
          
          <motion.div 
            animate={{ y: [0, -15, 0], rotate: [12, 16, 12] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute -top-8 left-1/3 w-14 h-14 bg-transparent flex items-center justify-center"
          >
            <Rocket className="w-10 h-10 text-gray-800" strokeWidth={1} />
          </motion.div>

          <motion.div 
            animate={{ y: [0, -10, 0], rotate: [6, 2, 6] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-16 right-16 w-10 h-10 bg-transparent flex items-center justify-center"
          >
            <FileText className="w-8 h-8 text-gray-800" strokeWidth={1} />
          </motion.div>

          <motion.div 
            animate={{ y: [0, -14, 0], rotate: [-6, -2, -6] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            className="absolute top-1/3 -right-6 w-16 h-16 bg-transparent flex items-center justify-center"
          >
            <Calendar className="w-12 h-12 text-gray-800" strokeWidth={1} />
          </motion.div>

          <motion.div 
            animate={{ y: [0, -11, 0], rotate: [-12, -16, -12] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
            className="absolute bottom-40 -left-6 w-14 h-14 bg-transparent flex items-center justify-center"
          >
            <MessageSquare className="w-10 h-10 text-gray-800" strokeWidth={1} />
          </motion.div>

          <motion.div 
            animate={{ y: [0, -13, 0], rotate: [12, 8, 12] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
            className="absolute bottom-16 right-2 w-16 h-16 bg-transparent flex items-center justify-center"
          >
            <Cloud className="w-12 h-12 text-gray-800" strokeWidth={1} />
          </motion.div>

          {/* Glowing Backlight Pulse */}
          <motion.div 
            animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.95, 1.03, 0.95] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -inset-4 bg-indigo-500/15 rounded-3xl blur-2xl -z-10" 
          />

          {/* Desktop Monitor Frame */}
          <motion.div 
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-full max-w-[850px] aspect-[16/10] bg-[#1a1a1a] rounded-[1.2rem] sm:rounded-[1.8rem] p-1.5 sm:p-2.5 shadow-2xl z-10 border-b-4 border-b-gray-900 border-r-4 border-r-gray-900"
          >
            {/* Camera dot */}
            <div className="absolute top-1 sm:top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-gray-700 rounded-full"></div>

            {/* Inner Screen */}
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
                      ].map((url, i)=><div key={i} className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gray-200 border-2 border-white overflow-hidden"><img src={url} alt="User" className="w-full h-full object-cover"/></div>)}
                  </div>
                </div>
                <div className="flex-1 p-3 sm:p-5 space-y-4 sm:space-y-6 bg-white overflow-hidden">
                  <div className="flex gap-2 sm:gap-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-200 overflow-hidden shrink-0">
                       <img src="https://api.dicebear.com/7.x/micah/svg?seed=User5&backgroundColor=f3f4f6&mouth=smile" alt="User 5" className="w-full h-full object-cover"/>
                    </div>
                    <div>
                      <div className="flex gap-2 items-baseline mb-0.5 sm:mb-1"><span className="font-bold text-gray-900 text-[8px] sm:text-[11px]">Project Delta</span><span className="text-gray-400 text-[6px] sm:text-[8px]">2:44 PM</span></div>
                      <div className="text-gray-700 leading-relaxed text-[7.5px] sm:text-[10.5px]">Hey! Have you seen the updated design system docs? @Alex Morgan</div>
                      <div className="flex gap-1 sm:gap-2 mt-1 sm:mt-2">
                        <div className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-indigo-50 border border-indigo-100 rounded-full flex gap-1 items-center text-[6px] sm:text-[9px]">👍 <span className="font-semibold text-indigo-600">2</span></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 sm:gap-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-200 overflow-hidden shrink-0">
                       <img src="https://api.dicebear.com/7.x/micah/svg?seed=User6&backgroundColor=f3f4f6&mouth=smile" alt="User 6" className="w-full h-full object-cover"/>
                    </div>
                    <div>
                      <div className="flex gap-2 items-baseline mb-0.5 sm:mb-1"><span className="font-bold text-gray-900 text-[8px] sm:text-[11px]">Marfor Roather</span><span className="text-gray-400 text-[6px] sm:text-[8px]">3:55 PM</span></div>
                      <div className="text-gray-700 leading-relaxed mb-2 text-[7.5px] sm:text-[10.5px]">Yes! Pinned the latest Figma prototype link in the right panel.</div>
                      <div className="border border-gray-200 rounded-lg p-2 sm:p-2.5 flex gap-2 sm:gap-3 items-center max-w-[220px]">
                        <div className="w-6 h-8 sm:w-8 sm:h-10 bg-red-50 border border-red-100 flex items-center justify-center text-red-500 font-bold text-[6px] sm:text-[9px] rounded">PDF</div>
                        <div className="min-w-0"><div className="font-bold text-gray-900 truncate text-[7.5px] sm:text-[10px]">Figma Specs.pdf</div><div className="text-gray-400 text-[6px] sm:text-[8px] truncate">Document 2.1MB PDF</div></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-2 sm:p-3 bg-white mt-auto border-t border-gray-50">
                   <div className="border border-gray-200 rounded-full px-3 py-1.5 sm:py-2 flex items-center gap-2">
                     <Plus className="w-3 h-3 text-gray-400" />
                     <span className="text-gray-400 flex-1 text-[7.5px] sm:text-[10px]">Send a message in #design-feedback...</span>
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
                           <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gray-200 overflow-hidden"><img src={user.p} alt={user.n} className="w-full h-full object-cover"/></div>
                           <span className="font-medium text-gray-700 truncate text-[7px] sm:text-[9px]">{user.n}</span>
                         </div>
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                       </div>
                     ))}
                   </div>
                   
                   <div className="text-[7px] sm:text-[10px] font-bold text-gray-900 mb-2 sm:mb-3">Workspace Details</div>
                   <div className="text-[6px] sm:text-[8px] font-bold text-gray-500 mb-1.5">Pinned Links</div>
                   <div className="space-y-1 mb-3">
                     <div className="flex gap-1 text-gray-500 truncate text-[6.5px] sm:text-[8.5px]"><Pin className="w-2 h-2 text-red-500 shrink-0"/> https://figma.com/file/123</div>
                     <div className="flex gap-1 text-gray-500 truncate text-[6.5px] sm:text-[8.5px]"><Pin className="w-2 h-2 text-red-500 shrink-0"/> https://github.com/CollabHub</div>
                   </div>
                   
                   <div className="text-[6px] sm:text-[8px] font-bold text-gray-500 mb-1.5">Key deadlines</div>
                   <div className="flex gap-1 text-gray-500 mb-3 items-center text-[6.5px] sm:text-[8.5px]"><Calendar className="w-2.5 h-2.5"/> May 28th, 2026</div>
                   
                   <div className="text-[6px] sm:text-[8px] font-bold text-gray-500 mb-1.5">Team goals</div>
                   <div className="space-y-1">
                     <div className="flex gap-1 text-gray-500 truncate items-center text-[6.5px] sm:text-[8.5px]"><CheckCircle2 className="w-2.5 h-2.5 text-emerald-500"/> Complete design system</div>
                     <div className="flex gap-1 text-gray-500 truncate items-center text-[6.5px] sm:text-[8.5px]"><CheckCircle2 className="w-2.5 h-2.5 text-gray-400"/> Release v1.0 API</div>
                   </div>
                </div>
              </div>

            </div>
            
            {/* Monitor Stand */}
            <div className="absolute -bottom-[20px] sm:-bottom-[30px] left-1/2 -translate-x-1/2 w-16 sm:w-24 h-[20px] sm:h-[30px] bg-gradient-to-b from-gray-200 to-gray-300" style={{ clipPath: 'polygon(20% 0, 80% 0, 100% 100%, 0% 100%)' }}></div>
            <div className="absolute -bottom-[25px] sm:-bottom-[38px] left-1/2 -translate-x-1/2 w-32 sm:w-48 h-[6px] sm:h-[8px] bg-gray-200 rounded-full shadow-lg"></div>
          </motion.div>

          {/* Mobile Phone Mockup Overlay */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute -bottom-6 sm:-bottom-8 -right-4 sm:-right-8 w-[110px] sm:w-[150px] aspect-[1/2] bg-[#1a1a1a] rounded-[1.5rem] sm:rounded-[2rem] p-1.5 sm:p-2 shadow-2xl z-20 border-b-4 border-b-gray-900 border-r-4 border-r-gray-900"
          >
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
                 <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mb-3">
                   <div className="aspect-square bg-blue-50 rounded-lg overflow-hidden"><img src="https://api.dicebear.com/7.x/micah/svg?seed=User11&backgroundColor=f3f4f6&mouth=smile" alt="User 11" className="w-full h-full object-cover"/></div>
                   <div className="aspect-square bg-purple-50 rounded-lg overflow-hidden"><img src="https://api.dicebear.com/7.x/micah/svg?seed=User12&backgroundColor=f3f4f6&mouth=smile" alt="User 12" className="w-full h-full object-cover"/></div>
                   <div className="aspect-square bg-orange-50 rounded-lg overflow-hidden"><img src="https://api.dicebear.com/7.x/micah/svg?seed=User13&backgroundColor=f3f4f6&mouth=smile" alt="User 13" className="w-full h-full object-cover"/></div>
                   <div className="aspect-square bg-emerald-50 rounded-lg overflow-hidden"><img src="https://api.dicebear.com/7.x/micah/svg?seed=User14&backgroundColor=f3f4f6&mouth=smile" alt="User 14" className="w-full h-full object-cover"/></div>
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
          </motion.div>

        </motion.div>

      </main>

      {/* SECTION 1: Features Section */}
      <section id="features" className="py-24 bg-white border-t border-gray-100 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold mb-4">
              <Zap className="w-3.5 h-3.5" />
              <span>CORE FEATURES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 mb-4">
              Built for speed, team clarity, and total project control.
            </h2>
            <p className="text-base text-gray-600 leading-relaxed font-medium">
              Every tool in CollabHub is designed to eliminate context switching and bring communication right next to your work.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {[
              {
                icon: <MessageSquare className="w-6 h-6" />,
                bg: "bg-indigo-50 text-indigo-600",
                title: "Real-Time Channel Messaging",
                desc: "Organize discussions by public or private channels. Mention teammates with @fullnames, auto-link URLs, and edit or delete messages in real-time."
              },
              {
                icon: <CheckCircle2 className="w-6 h-6" />,
                bg: "bg-emerald-50 text-emerald-600",
                title: "Kanban Task Management",
                desc: "Track tasks visually across TODO, IN PROGRESS, and DONE. Assign team members, set due dates, and attach files."
              },
              {
                icon: <Pin className="w-6 h-6" />,
                bg: "bg-red-50 text-red-600",
                title: "Resource Pinning & Team Goals",
                desc: "Never lose critical links. Pin Figma designs, GitHub repos, or documentation directly in channel sidebars alongside interactive team milestones."
              },
              {
                icon: <Users className="w-6 h-6" />,
                bg: "bg-amber-50 text-amber-600",
                title: "Workspace & Role Controls",
                desc: "Create multiple workspaces for different teams. Manage member access with granular roles (OWNER, ADMIN, MEMBER)."
              },
              {
                icon: <ShieldCheck className="w-6 h-6" />,
                bg: "bg-purple-50 text-purple-600",
                title: "Google SSO & Password Reset",
                desc: "Instant 1-click Google OAuth 2.0 Single Sign-On and secure cryptographic password reset token delivery right to user email inboxes."
              },
              {
                icon: <Activity className="w-6 h-6" />,
                bg: "bg-blue-50 text-blue-600",
                title: "Activity Stream & Audit Logs",
                desc: "Complete visibility into workspace activity. Track task status changes, channel creations, member additions, and project updates in real time."
              }
            ].map((feat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="p-7 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-xl hover:border-indigo-100 transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl ${feat.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  {feat.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feat.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  {feat.desc}
                </p>
              </motion.div>
            ))}

          </div>
        </div>
      </section>

      {/* SECTION 2: Integrations Section */}
      <section id="integration" className="py-20 bg-[#F8FAFC] border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold mb-4">
              <Cpu className="w-3.5 h-3.5" />
              <span>DEV & DESIGN ECOSYSTEM</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">
              Connects seamlessly with your workflow
            </h2>
            <p className="text-sm text-gray-600 max-w-xl mx-auto mb-12 font-medium">
              CollabHub integrates natively with popular developer platforms, cloud storage, and design suites.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { name: "Google SSO", tag: "Native OAuth", color: "text-red-500 bg-red-50 border-red-100" },
              { name: "GitHub Repos", tag: "Code Sync", color: "text-gray-900 bg-gray-100 border-gray-200" },
              { name: "Figma Prototypes", tag: "Live Embeds", color: "text-purple-600 bg-purple-50 border-purple-100" },
              { name: "VS Code", tag: "Developer Ready", color: "text-blue-600 bg-blue-50 border-blue-100" },
              { name: "Docker", tag: "Containerized", color: "text-sky-600 bg-sky-50 border-sky-100" },
              { name: "REST APIs", tag: "Open Specs", color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
              { name: "WebSockets", tag: "Real-Time", color: "text-amber-600 bg-amber-50 border-amber-100" },
              { name: "Swagger Docs", tag: "Full Schema", color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
            ].map((item, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="p-5 rounded-xl bg-white border border-gray-100 shadow-xs flex flex-col items-center hover:border-gray-300 transition-all"
              >
                <div className={`px-2.5 py-1 rounded-md text-[10px] font-bold border mb-2 ${item.color}`}>
                  {item.tag}
                </div>
                <div className="font-bold text-sm text-gray-800">{item.name}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: Pricing Section */}
      <section id="pricing" className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold mb-4">
              <Star className="w-3.5 h-3.5" />
              <span>TRANSPARENT PRICING</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 mb-4">
              Simple plans for teams of any scale.
            </h2>
            <p className="text-base text-gray-600 font-medium">
              Start completely free with zero credit card required. Upgrade as your team grows.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            
            {/* Free Tier */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -6 }}
              className="p-8 rounded-2xl bg-white border border-gray-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Free Starter</h3>
                <p className="text-xs text-gray-500 font-medium mb-6">Perfect for small teams and side projects.</p>
                <div className="text-3xl font-extrabold text-gray-900 mb-6">$0 <span className="text-xs font-normal text-gray-500">/ forever</span></div>
                <ul className="space-y-3 text-xs text-gray-600 font-medium mb-8">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Unlimited Public Channels</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Up to 10 Team Members</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Real-time Kanban Task Board</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Google SSO Authentication</li>
                </ul>
              </div>
              <Link href="/signup">
                <Button variant="outline" className="w-full border-gray-300 font-bold text-xs py-2.5 rounded-xl cursor-pointer hover:bg-gray-50">
                  Get Started Free
                </Button>
              </Link>
            </motion.div>

            {/* Pro Tier (Featured) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              whileHover={{ y: -8 }}
              className="p-8 rounded-2xl bg-gradient-to-b from-indigo-900 to-slate-900 text-white shadow-xl flex flex-col justify-between relative border border-indigo-700"
            >
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#5C55E6] text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-md">
                Most Popular
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">Pro Team</h3>
                <p className="text-xs text-indigo-200 font-medium mb-6">Designed for fast-growing product teams.</p>
                <div className="text-3xl font-extrabold mb-6">$12 <span className="text-xs font-normal text-indigo-300">/ member / month</span></div>
                <ul className="space-y-3 text-xs text-indigo-100 font-medium mb-8">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Everything in Free</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Unlimited Private Channels</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Pinned Resource Links & Team Goals</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Full Activity Log & Audit Stream</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> File Attachments up to 50MB</li>
                </ul>
              </div>
              <Link href="/signup">
                <Button className="w-full bg-[#5C55E6] hover:bg-[#4F46E5] text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer shadow-md">
                  Start 14-Day Free Trial
                </Button>
              </Link>
            </motion.div>

            {/* Enterprise Tier */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -6 }}
              className="p-8 rounded-2xl bg-white border border-gray-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Enterprise</h3>
                <p className="text-xs text-gray-500 font-medium mb-6">Custom security, SLA, and dedicated support.</p>
                <div className="text-3xl font-extrabold text-gray-900 mb-6">Custom</div>
                <ul className="space-y-3 text-xs text-gray-600 font-medium mb-8">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Unlimited Workspaces</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Custom SAML / SSO Integration</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> 99.99% Guaranteed Uptime SLA</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Dedicated Account Manager</li>
                </ul>
              </div>
              <Link href="/signup">
                <Button variant="outline" className="w-full border-gray-300 font-bold text-xs py-2.5 rounded-xl cursor-pointer hover:bg-gray-50">
                  Contact Sales
                </Button>
              </Link>
            </motion.div>

          </div>
        </div>
      </section>

      {/* SECTION 4: Enterprise & Security Section */}
      <section id="enterprise" className="py-20 bg-[#F8FAFC] border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-gray-900 via-indigo-950 to-gray-900 text-white rounded-3xl p-10 lg:p-14 shadow-2xl relative overflow-hidden"
          >
            <div className="max-w-2xl relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold mb-4">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ENTERPRISE SECURITY</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Security and data privacy built into every layer.
              </h2>
              <p className="text-sm text-indigo-100 leading-relaxed font-medium mb-8">
                We protect your team's code, conversations, and task data with industry-leading encryption, JWT authorization headers, and strict access controls.
              </p>

              <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-indigo-200">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> End-to-End JWT Auth Tokens</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Role-Based Access Control (RBAC)</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Granular Channel Privacy Controls</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Encrypted In-Transit & At-Rest</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 5: Support & FAQ Section with AnimatePresence */}
      <section id="support" className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-100 text-amber-600 text-xs font-bold mb-4">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-3">
              Got questions? We've got answers.
            </h2>
            <p className="text-sm text-gray-500 font-medium">
              Everything you need to know about CollabHub and how it powers team productivity.
            </p>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                q: "Is Google Single Sign-On (SSO) completely free on CollabHub?",
                a: "Yes! Google OAuth 2.0 authentication is 100% free for all users with no hidden fees or user caps."
              },
              {
                q: "How do private channels work in CollabHub?",
                a: "Private channels are restricted to workspace members who have been explicitly granted access by a channel admin or workspace owner."
              },
              {
                q: "Can I manage tasks directly inside my team workspace?",
                a: "Yes! CollabHub features built-in Kanban task boards with status progression (TODO, IN_PROGRESS, DONE), priority levels, due dates, and task comment threads."
              },
              {
                q: "What happens if a user forgets their account password?",
                a: "Users can click 'Forgot your password?' on the sign-in page to receive a secure, 15-minute cryptographic reset link sent directly to their email inbox."
              },
              {
                q: "Can I pin external links and resource documentation?",
                a: "Yes! Workspace members can pin Figma links, GitHub repositories, and project specification URLs directly into the channel right sidebar."
              }
            ].map((faq, i) => (
              <div 
                key={i} 
                className="border border-gray-200 rounded-2xl overflow-hidden transition-all bg-white"
              >
                <button 
                  onClick={() => toggleFaq(i)}
                  className="w-full p-5 text-left flex justify-between items-center font-bold text-sm text-gray-900 cursor-pointer hover:bg-gray-50/50"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${openFaq === i ? 'rotate-180 text-indigo-600' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 text-xs text-gray-600 leading-relaxed font-medium border-t border-gray-100 pt-3">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800 text-xs">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-base text-white hover:opacity-85 transition-opacity">
            <div className="relative w-5 h-5 border-2 border-white rounded-[4px] flex items-center justify-center bg-transparent">
               <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-gray-900 border-2 border-white rounded-[2px]"></div>
            </div>
            CollabHub
          </Link>
          <p className="text-gray-500 font-medium">
            &copy; {new Date().getFullYear()} CollabHub Inc. Collaboration that's effortless & powerful.
          </p>
          <div className="flex items-center gap-6 font-semibold">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#integration" className="hover:text-white transition-colors">Integrations</a>
            <a href="#support" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>

    </div>
  )
}
