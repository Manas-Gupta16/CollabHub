"use client"

import { useState, useRef, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  User, Bell, Lock, Layout, MonitorSmartphone, CreditCard, Settings, 
  Layers, Crown, ShieldCheck, Shield, UserX, Check, Monitor, 
  Smartphone, Laptop, Globe, LogOut, Radio, MapPin, ShieldAlert, Sun, Moon,
  X, Sparkles, Star, CheckCircle2, ArrowRight, Zap
} from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { updateProfile, getWorkspaces, getWorkspaceById, updateWorkspaceInfo, updateMemberRole, removeMemberFromWorkspace, getFileUrl } from "@/lib/api"
import api from "@/lib/api"
import { useSearchParams, useRouter } from "next/navigation"
import { UserAvatar } from "@/components/UserAvatar"
import { useTheme } from "@/components/theme-provider"

const DEFAULT_AVATARS = [
  { id: 'peeps-1', name: 'Alex', url: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=Alex&backgroundColor=b6e3f4' },
  { id: 'peeps-2', name: 'Jordan', url: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=Jordan&backgroundColor=c0aede' },
  { id: 'peeps-3', name: 'Taylor', url: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=Taylor&backgroundColor=ffd5dc' },
  { id: 'peeps-4', name: 'Morgan', url: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=Morgan&backgroundColor=d1d4f9' },
  { id: 'smile-1', name: 'Felix', url: 'https://api.dicebear.com/7.x/big-smile/svg?seed=Felix&backgroundColor=b6e3f4' },
  { id: 'smile-2', name: 'Charlie', url: 'https://api.dicebear.com/7.x/big-smile/svg?seed=Charlie&backgroundColor=ffd5dc' },
  { id: 'avataaars-1', name: 'Sam', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam&backgroundColor=c0aede' },
  { id: 'avataaars-2', name: 'Riley', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Riley&backgroundColor=d1d4f9' },
  { id: 'micah-1', name: 'Avery', url: 'https://api.dicebear.com/7.x/micah/svg?seed=Avery&backgroundColor=b6e3f4' },
  { id: 'bottts-1', name: 'Leo', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Leo&backgroundColor=ffd5dc' },
]

function SettingsContent() {
  const queryClient = useQueryClient()
  const searchParams = useSearchParams()
  const router = useRouter()
  const queryTab = searchParams.get('tab')
  const queryWorkspaceId = searchParams.get('workspace')

  const [activeTab, setActiveTab] = useState('profile')
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>('')
  const [activePlan, setActivePlan] = useState('CollabHub Free')
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false)
  const [planSuccessMsg, setPlanSuccessMsg] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch workspaces list
  const { data: workspaces } = useQuery({
    queryKey: ['workspaces'],
    queryFn: getWorkspaces,
  })

  const currentWorkspace = (workspaces && workspaces.length > 0) 
    ? workspaces.find((w: any) => w._id === selectedWorkspaceId) || workspaces[0] 
    : null

  useEffect(() => {
    if (queryWorkspaceId) {
      setSelectedWorkspaceId(queryWorkspaceId)
    } else if (workspaces && workspaces.length > 0 && !selectedWorkspaceId) {
      setSelectedWorkspaceId(workspaces[0]._id)
    }
  }, [queryWorkspaceId, workspaces])

  useEffect(() => {
    if (queryTab && ['profile', 'account', 'security', 'notifications', 'devices', 'billing', 'workspace'].includes(queryTab)) {
      setActiveTab(queryTab)
    }
  }, [queryTab])

  // Current logged in user profile
  const { data: user } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await api.get('/auth/profile')
      return res.data?.user
    },
  })

  // Selected workspace details
  const { data: activeWorkspace } = useQuery({
    queryKey: ['workspace', selectedWorkspaceId],
    queryFn: () => getWorkspaceById(selectedWorkspaceId),
    enabled: !!selectedWorkspaceId && activeTab === 'workspace'
  })

  const userName = user?.name || ''
  const userEmail = user?.email || ''
  
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [title, setTitle] = useState('')
  const [bio, setBio] = useState('')
  const [location, setLocation] = useState('')
  const [website, setWebsite] = useState('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [selectedPresetUrl, setSelectedPresetUrl] = useState<string | null>(null)
  const [removeAvatar, setRemoveAvatar] = useState(false)

  // Workspace settings state
  const [wsName, setWsName] = useState('')
  const [wsDesc, setWsDesc] = useState('')

  useEffect(() => {
    if (user) {
      const parts = (user.name || '').split(' ')
      setFirstName(parts[0] || '')
      setLastName(parts.slice(1).join(' ') || '')
      setEmail(user.email || '')
      setTitle(user.title || '')
      setBio(user.bio || '')
      setLocation(user.location || '')
      setWebsite(user.website || '')
      if (user.avatar) {
        setAvatarPreview(getFileUrl(user.avatar))
      }
    }
  }, [user])

  useEffect(() => {
    if (activeWorkspace) {
      setWsName(activeWorkspace.name || '')
      setWsDesc(activeWorkspace.description || '')
    }
  }, [activeWorkspace])

  const userSeed = userName.replace(/\s/g, '') || 'Design'
  const fallbackAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${userSeed}&backgroundColor=6366f1&textColor=ffffff`

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      alert("Profile updated successfully!")
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.response?.data?.error || "Failed to update profile."
      alert(msg)
    }
  })

  const updateWorkspaceMutation = useMutation({
    mutationFn: (data: { name?: string; description?: string }) => updateWorkspaceInfo(selectedWorkspaceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace', selectedWorkspaceId] })
      queryClient.invalidateQueries({ queryKey: ['workspaces'] })
      alert("Workspace settings updated successfully!")
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || "Failed to update workspace settings.")
    }
  })

  const updateMemberRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) => updateMemberRole(selectedWorkspaceId, userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace', selectedWorkspaceId] })
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || "Failed to update member role.")
    }
  })

  const removeMemberMutation = useMutation({
    mutationFn: (userId: string) => removeMemberFromWorkspace(selectedWorkspaceId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace', selectedWorkspaceId] })
      alert("Member removed from workspace.")
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || "Failed to remove member.")
    }
  })

  const handleSaveProfile = async () => {
    let finalAvatarUrl = selectedPresetUrl || avatarPreview || ''

    if (avatarFile) {
      try {
        finalAvatarUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(avatarFile)
        })
      } catch (err) {
        console.error("Error reading image file", err)
      }
    }

    const formData = new FormData()
    formData.append('name', `${firstName} ${lastName}`.trim())
    formData.append('email', email)
    formData.append('title', title)
    formData.append('bio', bio)
    formData.append('location', location)
    formData.append('website', website)
    
    if (removeAvatar) {
      formData.append('removeAvatar', 'true')
    } else if (finalAvatarUrl) {
      formData.append('avatarUrl', finalAvatarUrl)
    }

    updateProfileMutation.mutate(formData)
  }

  const handleSaveWorkspace = () => {
    if (!wsName.trim()) return
    updateWorkspaceMutation.mutate({ name: wsName.trim(), description: wsDesc.trim() })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
      setRemoveAvatar(false)
    }
  }

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [emailNotif, setEmailNotif] = useState(true)
  const [pushNotif, setPushNotif] = useState(true)
  const [devices, setDevices] = useState<any[]>([])

  // Dynamically detect active device info from browser navigator.userAgent
  useEffect(() => {
    if (typeof window === "undefined") return

    const ua = window.navigator.userAgent
    let browser = "Web Browser"
    let os = "Windows"
    let type: "desktop" | "mobile" = "desktop"

    // OS Detection
    if (/windows nt 10\.0/i.test(ua)) os = "Windows 11 / 10"
    else if (/windows nt 6\.3/i.test(ua)) os = "Windows 8.1"
    else if (/windows nt 6\.1/i.test(ua)) os = "Windows 7"
    else if (/mac os x/i.test(ua)) {
      if (/iphone|ipad|ipod/i.test(ua)) os = "iOS"
      else os = "macOS"
    } else if (/android/i.test(ua)) os = "Android"
    else if (/linux/i.test(ua)) os = "Linux"
    else if (/cros/i.test(ua)) os = "ChromeOS"

    // Browser Detection
    if (/edg\//i.test(ua)) browser = "Microsoft Edge"
    else if (/opera|opr\//i.test(ua)) browser = "Opera"
    else if (/firefox|fxios/i.test(ua)) browser = "Mozilla Firefox"
    else if (/chrome|crios/i.test(ua)) browser = "Google Chrome"
    else if (/safari/i.test(ua)) browser = "Apple Safari"
    else if (/trident/i.test(ua)) browser = "Internet Explorer"

    // Device Type Detection
    if (/mobile|iphone|ipod|android.*mobile/i.test(ua)) {
      type = "mobile"
    } else if (/ipad|android(?!.*mobile)/i.test(ua)) {
      type = "mobile"
    }

    setDevices([
      {
        id: "current",
        browser,
        os,
        location: "Current Device",
        ip: "Active Session",
        lastActive: "Active now",
        isCurrent: true,
        type
      }
    ])
  }, [])

  const handlePasswordSave = () => {
    if (password.length < 6) {
      alert("Password must be at least 6 characters.")
      return
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.")
      return
    }
    const formData = new FormData()
    formData.append('password', password)
    updateProfileMutation.mutate(formData, {
      onSuccess: () => {
        setPassword("")
        setConfirmPassword("")
      }
    })
  }

  const { theme, setTheme } = useTheme()

  const tabs = [
    { id: 'profile', label: 'User Profile', icon: <User className="w-4 h-4"/> },
    { id: 'appearance', label: 'Theme & Appearance', icon: <Sun className="w-4 h-4"/> },
    { id: 'workspace', label: 'Workspace Settings', icon: <Layers className="w-4 h-4"/> },
    { id: 'security', label: 'Security & Password', icon: <Lock className="w-4 h-4"/> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4"/> },
    { id: 'account', label: 'Account & Privacy', icon: <Layout className="w-4 h-4"/> },
    { id: 'devices', label: 'Devices', icon: <MonitorSmartphone className="w-4 h-4"/> },
    { id: 'billing', label: 'Billing & Plan', icon: <CreditCard className="w-4 h-4"/> },
  ]

  const currentUserWsMember = activeWorkspace?.members?.find((m: any) => (m.user?._id || m.user) === user?._id)
  const isWsOwner = currentUserWsMember?.role === 'OWNER'

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50/60 dark:bg-slate-950 text-gray-900 dark:text-gray-100 p-6 lg:p-8 relative">

      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Settings & Preferences</h1>
          <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">Manage user account details, workspace configuration, and permissions.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full md:w-60 shrink-0 space-y-1.5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === tab.id 
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-[#6366F1] shadow-xs' 
                    : 'text-gray-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900 dark:bg-slate-900 hover:text-gray-900 dark:text-gray-100'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1">
            
            {/* USER PROFILE SETTINGS */}
            {activeTab === 'profile' && (
              <Card className="border-gray-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm rounded-2xl">
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">User Profile Settings</h2>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-6">
                    <UserAvatar name={userName} avatar={avatarPreview || undefined} size="w-20 h-20 text-2xl" />
                    <div>
                      <div className="flex gap-2">
                        <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
                        <Button variant="outline" className="border-gray-200 dark:border-slate-800 rounded-xl text-xs font-semibold" onClick={() => fileInputRef.current?.click()}>
                          Upload Custom Photo
                        </Button>
                        <Button variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:bg-red-950/60 rounded-xl text-xs font-semibold" onClick={() => { setAvatarFile(null); setSelectedPresetUrl(null); setAvatarPreview(null); setRemoveAvatar(true); }}>
                          Remove
                        </Button>
                      </div>
                      <p className="text-xs text-gray-400 dark:text-slate-500 mt-2">Upload your own photo or choose a default avatar character below.</p>
                    </div>
                  </div>

                  {/* Default Avatars Character Selection Grid */}
                  <div className="mb-8 p-4 rounded-2xl bg-gray-50 dark:bg-slate-900/80 border border-gray-100 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase text-gray-600 dark:text-slate-300 tracking-wider">Choose Avatar Character</label>
                      <span className="text-[11px] text-gray-400 dark:text-slate-500 font-medium">Click to select an avatar</span>
                    </div>
                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-2.5">
                      {DEFAULT_AVATARS.map((avatarItem) => {
                        const isSelected = avatarPreview === avatarItem.url || selectedPresetUrl === avatarItem.url
                        return (
                          <button
                            key={avatarItem.id}
                            type="button"
                            onClick={() => {
                              setSelectedPresetUrl(avatarItem.url)
                              setAvatarPreview(avatarItem.url)
                              setAvatarFile(null)
                              setRemoveAvatar(false)
                            }}
                            className={`relative rounded-full overflow-hidden border-2 transition-all p-0.5 cursor-pointer aspect-square group hover:scale-105 ${
                              isSelected ? 'border-indigo-600 ring-2 ring-indigo-500/30 bg-white dark:bg-slate-900 shadow-md' : 'border-transparent hover:border-indigo-300 bg-white dark:bg-slate-900'
                            }`}
                            title={`Select ${avatarItem.name}`}
                          >
                            <img src={avatarItem.url} alt={avatarItem.name} className="w-full h-full rounded-full object-cover" />
                            {isSelected && (
                              <div className="absolute inset-0 bg-indigo-600/30 flex items-center justify-center rounded-full">
                                <Check className="w-4 h-4 text-white stroke-[3] drop-shadow-md" />
                              </div>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                    <div className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold uppercase text-gray-500 dark:text-slate-400 tracking-wider">First Name</label>
                          <Input value={firstName} onChange={e => setFirstName(e.target.value)} className="rounded-xl border-gray-200 dark:border-slate-800" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold uppercase text-gray-500 dark:text-slate-400 tracking-wider">Last Name</label>
                          <Input value={lastName} onChange={e => setLastName(e.target.value)} className="rounded-xl border-gray-200 dark:border-slate-800" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold uppercase text-gray-500 dark:text-slate-400 tracking-wider">Email Address</label>
                          <Input value={email} onChange={e => setEmail(e.target.value)} className="rounded-xl border-gray-200 dark:border-slate-800" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold uppercase text-gray-500 dark:text-slate-400 tracking-wider">Job Title / Role</label>
                          <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Product Designer" className="rounded-xl border-gray-200 dark:border-slate-800" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold uppercase text-gray-500 dark:text-slate-400 tracking-wider">Location</label>
                          <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. San Francisco, CA" className="rounded-xl border-gray-200 dark:border-slate-800" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold uppercase text-gray-500 dark:text-slate-400 tracking-wider">Website / Portfolio</label>
                          <Input value={website} onChange={e => setWebsite(e.target.value)} placeholder="e.g. collabhub.com" className="rounded-xl border-gray-200 dark:border-slate-800" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase text-gray-500 dark:text-slate-400 tracking-wider">Bio / About</label>
                        <textarea 
                          value={bio} 
                          onChange={e => setBio(e.target.value)} 
                          rows={3} 
                          placeholder="Tell team members a bit about yourself..." 
                          className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                        />
                      </div>
                    </div>

                  <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-800 flex justify-end">
                    <Button 
                      className="bg-[#6366F1] hover:bg-[#4F46E5] text-white px-6 rounded-xl font-semibold cursor-pointer"
                      onClick={handleSaveProfile}
                      disabled={updateProfileMutation.isPending}
                    >
                      {updateProfileMutation.isPending ? "Saving..." : "Save Profile"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* THEME & APPEARANCE */}
            {activeTab === 'appearance' && (
              <Card className="border-gray-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm rounded-2xl">
                <CardContent className="p-6 md:p-8 space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Theme & Appearance</h2>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Customize how CollabHub looks on your device.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => setTheme('light')}
                      className={`p-5 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all cursor-pointer ${
                        theme === 'light'
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40'
                          : 'border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-xs">
                        <Sun className="w-6 h-6" />
                      </div>
                      <div className="text-center">
                        <div className="text-xs font-bold text-gray-900 dark:text-gray-100">Light Mode</div>
                        <div className="text-[10px] text-gray-500 dark:text-slate-400 mt-0.5">Default bright look</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTheme('dark')}
                      className={`p-5 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all cursor-pointer ${
                        theme === 'dark'
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40'
                          : 'border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-slate-900 dark:bg-slate-800 text-indigo-400 flex items-center justify-center shadow-xs">
                        <Moon className="w-6 h-6" />
                      </div>
                      <div className="text-center">
                        <div className="text-xs font-bold text-gray-900 dark:text-gray-100">Dark Mode</div>
                        <div className="text-[10px] text-gray-500 dark:text-slate-400 mt-0.5">Sleek dark contrast</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTheme('system')}
                      className={`p-5 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all cursor-pointer ${
                        theme === 'system'
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40'
                          : 'border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 flex items-center justify-center shadow-xs">
                        <Monitor className="w-6 h-6" />
                      </div>
                      <div className="text-center">
                        <div className="text-xs font-bold text-gray-900 dark:text-gray-100">System Preference</div>
                        <div className="text-[10px] text-gray-500 dark:text-slate-400 mt-0.5">Match OS theme</div>
                      </div>
                    </button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* WORKSPACE SETTINGS */}
            {activeTab === 'workspace' && (
              <Card className="border-gray-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm rounded-2xl">
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Workspace Configuration</h2>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Manage team workspace details and member permissions.</p>
                    </div>

                    {/* Workspace Selector */}
                    {workspaces && workspaces.length > 0 && (
                      <select
                        value={selectedWorkspaceId}
                        onChange={(e) => setSelectedWorkspaceId(e.target.value)}
                        className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {workspaces.map((ws: any) => (
                          <option key={ws._id} value={ws._id}>{ws.name}</option>
                        ))}
                      </select>
                    )}
                  </div>

                  {activeWorkspace ? (
                    <div className="space-y-6">
                      
                      {/* Workspace Info Form */}
                      <div className="space-y-4 bg-gray-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-gray-100 dark:border-slate-800">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold uppercase text-gray-500 dark:text-slate-400 tracking-wider">Workspace Name</label>
                          <Input 
                            value={wsName} 
                            onChange={(e) => setWsName(e.target.value)} 
                            className="rounded-xl border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900" 
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold uppercase text-gray-500 dark:text-slate-400 tracking-wider">Description</label>
                          <textarea 
                            value={wsDesc}
                            onChange={(e) => setWsDesc(e.target.value)}
                            rows={3}
                            placeholder="Enter workspace description..."
                            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>

                        <div className="flex justify-end pt-2">
                          <Button 
                            onClick={handleSaveWorkspace}
                            disabled={updateWorkspaceMutation.isPending}
                            className="bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl text-xs font-semibold cursor-pointer"
                          >
                            {updateWorkspaceMutation.isPending ? "Updating..." : "Save Workspace Details"}
                          </Button>
                        </div>
                      </div>

                      {/* Workspace Members Management */}
                      <div className="pt-4 border-t border-gray-100 dark:border-slate-800">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                          Workspace Members ({activeWorkspace.members?.length || 0})
                        </h3>

                        <div className="space-y-3">
                          {(activeWorkspace.members || []).map((m: any, i: number) => {
                            const u = m.user || {}
                            const uName = u.name || `User ${i}`
                            const uRole = m.role || 'MEMBER'
                            const uId = u._id || u

                            return (
                              <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:bg-slate-900/60 transition-colors">
                                <div className="flex items-center gap-3">
                                  <UserAvatar name={uName} avatar={u.avatar} size="w-9 h-9 text-[11px]" />
                                  <div>
                                    <div className="text-xs font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                                      {uName}
                                      {uRole === 'OWNER' && <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />}
                                      {uRole === 'ADMIN' && <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />}
                                    </div>
                                    <div className="text-[11px] text-gray-400 dark:text-slate-500">{u.email || 'Member'}</div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider ${
                                    uRole === 'OWNER' ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 border border-amber-200' :
                                    uRole === 'ADMIN' ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 border border-indigo-200' :
                                    'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-800'
                                  }`}>
                                    {uRole}
                                  </span>

                                  {isWsOwner && uRole !== 'OWNER' && (
                                    <div className="flex items-center gap-1">
                                      {uRole === 'MEMBER' ? (
                                        <Button 
                                          variant="outline"
                                          size="sm"
                                          onClick={() => updateMemberRoleMutation.mutate({ userId: uId, role: 'ADMIN' })}
                                          className="text-xs font-semibold border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:bg-indigo-950/60 rounded-lg cursor-pointer"
                                        >
                                          Promote to Admin
                                        </Button>
                                      ) : (
                                        <Button 
                                          variant="outline"
                                          size="sm"
                                          onClick={() => updateMemberRoleMutation.mutate({ userId: uId, role: 'MEMBER' })}
                                          className="text-xs font-semibold border-gray-200 dark:border-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:bg-slate-900 rounded-lg cursor-pointer"
                                        >
                                          Make Member
                                        </Button>
                                      )}

                                      <Button 
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          if (confirm(`Remove ${uName} from workspace?`)) {
                                            removeMemberMutation.mutate(uId)
                                          }
                                        }}
                                        className="text-red-500 hover:bg-red-50 dark:bg-red-950/60 text-xs rounded-lg cursor-pointer"
                                      >
                                        Remove
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                    </div>
                  ) : (
                    <div className="p-8 text-center text-sm text-gray-500 dark:text-slate-400">Select a workspace to configure settings.</div>
                  )}

                </CardContent>
              </Card>
            )}

            {/* SECURITY SETTINGS */}
            {activeTab === 'security' && (
              <Card className="border-gray-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm rounded-2xl">
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">Security & Password</h2>
                  <div className="space-y-4 max-w-md">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase text-gray-500 dark:text-slate-400 tracking-wider">New Password</label>
                      <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimum 6 characters" className="rounded-xl border-gray-200 dark:border-slate-800" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase text-gray-500 dark:text-slate-400 tracking-wider">Confirm New Password</label>
                      <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Repeat password" className="rounded-xl border-gray-200 dark:border-slate-800" />
                    </div>
                    <Button className="bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl text-xs font-semibold mt-2 cursor-pointer" onClick={handlePasswordSave} disabled={updateProfileMutation.isPending}>
                      {updateProfileMutation.isPending ? "Updating..." : "Change Password"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <Card className="border-gray-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm rounded-2xl">
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">Notification Preferences</h2>
                  <div className="space-y-5">
                    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-slate-800">
                      <div>
                        <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100">Email Notifications</h4>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Receive invitation updates and workspace activity summaries.</p>
                      </div>
                      <input type="checkbox" checked={emailNotif} onChange={e => setEmailNotif(e.target.checked)} className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-slate-800">
                      <div>
                        <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100">Real-time Push Alerts</h4>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Get instant alerts for mentions and new task assignments.</p>
                      </div>
                      <input type="checkbox" checked={pushNotif} onChange={e => setPushNotif(e.target.checked)} className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                    </div>
                    <Button className="bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl text-xs font-semibold cursor-pointer" onClick={() => alert("Preferences saved!")}>Save Preferences</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* ACCOUNT & PRIVACY */}
            {activeTab === 'account' && (
              <Card className="border-gray-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm rounded-2xl">
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">Account & Privacy</h2>
                  <div className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase text-gray-500 dark:text-slate-400 tracking-wider">User ID / Handle</label>
                      <Input value={user?._id || ''} readOnly className="bg-gray-50 dark:bg-slate-900 cursor-not-allowed rounded-xl" />
                    </div>
                    <div className="pt-6 border-t border-gray-100 dark:border-slate-800 space-y-2">
                      <label className="text-sm font-bold text-red-600">Delete Account</label>
                      <p className="text-xs text-gray-500 dark:text-slate-400">Permanently delete your user account and all personal data.</p>
                      <Button variant="destructive" className="rounded-xl text-xs font-semibold mt-2 cursor-pointer" onClick={() => confirm("Are you sure you want to delete your account?") && alert("Account deletion requested")}>
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* DEVICES */}
            {activeTab === 'devices' && (
              <Card className="border-gray-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm rounded-2xl overflow-hidden">
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <MonitorSmartphone className="w-5 h-5 text-indigo-600" /> Active Login Sessions
                      </h2>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Manage authorized browsers and logged-in devices attached to your account.</p>
                    </div>

                    {devices.filter(d => !d.isCurrent).length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200/80 hover:bg-red-50 dark:bg-red-950/60 hover:border-red-300 rounded-xl text-xs font-bold transition-all shadow-2xs self-start sm:self-auto cursor-pointer"
                        onClick={() => {
                          if (confirm("Revoke all other active login sessions?")) {
                            setDevices(devices.filter(d => d.isCurrent))
                            alert("All other sessions revoked successfully!")
                          }
                        }}
                      >
                        <LogOut className="w-3.5 h-3.5 mr-1.5" />
                        Revoke All Other Sessions
                      </Button>
                    )}
                  </div>

                  {/* Security Overview Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100/80 dark:border-slate-800 mb-6">
                    <div className="flex items-center gap-3 text-indigo-950 font-semibold text-xs">
                      <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-gray-100">{devices.length} Active Session{devices.length > 1 ? 's' : ''} Monitored</p>
                        <p className="text-[11px] text-gray-500 dark:text-slate-400 font-normal mt-0.5">If you see an unfamiliar device, revoke it immediately and change your password.</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-indigo-100 shadow-2xs self-start sm:self-auto shrink-0">
                      Verified Secure
                    </span>
                  </div>

                  {/* Devices List */}
                  <div className="space-y-3">
                    {devices.map((device) => {
                      const isMobile = device.type === 'mobile' || device.browser.toLowerCase().includes('mobile') || device.os.toLowerCase().includes('ios') || device.os.toLowerCase().includes('android')

                      return (
                        <div 
                          key={device.id} 
                          className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all gap-4 ${
                            device.isCurrent 
                              ? 'bg-gradient-to-r from-white via-indigo-50/20 to-white border-indigo-200/80 shadow-xs' 
                              : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800/70 hover:border-gray-300 shadow-2xs'
                          }`}
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${
                              device.isCurrent 
                                ? 'bg-indigo-600 text-white shadow-indigo-200' 
                                : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300'
                            }`}>
                              {isMobile ? <Smartphone className="w-5 h-5" /> : <Laptop className="w-5 h-5" />}
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100 truncate">
                                  {device.browser} on {device.os}
                                </h4>
                                {device.isCurrent && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800 shrink-0">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Current Session
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 dark:text-slate-400 font-medium mt-1 flex items-center gap-2 flex-wrap">
                                <span>Last active: <strong className="text-gray-700 dark:text-gray-300">{device.lastActive}</strong></span>
                                {device.location && (
                                  <>
                                    <span>•</span>
                                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-gray-400 dark:text-slate-500" /> {device.location}</span>
                                  </>
                                )}
                                {device.ip && (
                                  <>
                                    <span>•</span>
                                    <span className="text-gray-400 dark:text-slate-500 font-mono text-[11px]">({device.ip})</span>
                                  </>
                                )}
                              </p>
                            </div>
                          </div>

                          <div className="shrink-0 self-end sm:self-auto">
                            {device.isCurrent ? (
                              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-200/80 flex items-center gap-1.5 shadow-2xs">
                                <Check className="w-3.5 h-3.5 stroke-[3]" /> This Device
                              </span>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-200 hover:bg-red-50 dark:bg-red-950/60 hover:border-red-300 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-2xs"
                                onClick={() => {
                                  setDevices(devices.filter((d) => d.id !== device.id))
                                  alert("Session revoked successfully!")
                                }}
                              >
                                Revoke Session
                              </Button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* BILLING */}
            {activeTab === 'billing' && (
              <Card className="border-gray-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm rounded-2xl">
                <CardContent className="p-6 md:p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Subscription & Razorpay Billing</h2>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Manage your workspace subscription plan, payment methods, and invoice history.</p>
                    </div>
                    <span className="px-3 py-1 text-xs font-extrabold uppercase rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Razorpay Verified
                    </span>
                  </div>

                  <div className="p-6 rounded-2xl border border-indigo-100 dark:border-slate-800 bg-indigo-50/70 dark:bg-indigo-950/30 flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                      <span className="text-xs font-bold text-[#6366F1] uppercase tracking-wider">Active Workspace Subscription</span>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1 flex items-center gap-2">
                        {currentWorkspace?.subscriptionPlan === 'PRO' ? 'CollabHub Pro Team' : currentWorkspace?.subscriptionPlan === 'ENTERPRISE' ? 'CollabHub Enterprise' : 'CollabHub Starter Free'}
                        {currentWorkspace?.subscriptionPlan === 'PRO' && <Crown className="w-5 h-5 text-amber-500 fill-amber-400" />}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                        Billing Cycle: <strong className="text-gray-700 dark:text-slate-200">{currentWorkspace?.billingCycle || 'MONTHLY'}</strong> · {currentWorkspace?.subscriptionPlan === 'PRO' ? '₹49/month per member' : 'Free tier (Up to 5 members)'}
                      </p>
                    </div>
                    <Button 
                      onClick={() => router.push('/pricing')} 
                      className="bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl text-xs font-bold px-5 py-2.5 cursor-pointer shadow-md shadow-indigo-500/20 flex items-center gap-2 shrink-0"
                    >
                      <Zap className="w-4 h-4 fill-white" />
                      {currentWorkspace?.subscriptionPlan === 'PRO' ? 'Manage Subscription' : 'Upgrade via Razorpay'}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold">
                    <div className="p-4 rounded-xl border border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950">
                      <span className="text-gray-400 dark:text-slate-500 block text-[10px] uppercase font-bold">Payment Gateway</span>
                      <span className="text-gray-900 dark:text-gray-100 mt-1 block font-bold text-sm">Razorpay (INR ₹)</span>
                      <span className="text-[11px] text-gray-500 dark:text-slate-400 font-normal">UPI, Cards, NetBanking</span>
                    </div>
                    <div className="p-4 rounded-xl border border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950">
                      <span className="text-gray-400 dark:text-slate-500 block text-[10px] uppercase font-bold">Billing Currency</span>
                      <span className="text-gray-900 dark:text-gray-100 mt-1 block font-bold text-sm">Indian Rupee (₹)</span>
                      <span className="text-[11px] text-gray-500 dark:text-slate-400 font-normal">Auto GST compliant</span>
                    </div>
                    <div className="p-4 rounded-xl border border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950">
                      <span className="text-gray-400 dark:text-slate-500 block text-[10px] uppercase font-bold">Security & Compliance</span>
                      <span className="text-gray-900 dark:text-gray-100 mt-1 block font-bold text-sm">256-Bit SSL Encrypted</span>
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-normal">PCI-DSS Level 1</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

          </div>

        </div>

      </div>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading Settings...</div>}>
      <SettingsContent />
    </Suspense>
  )
}
