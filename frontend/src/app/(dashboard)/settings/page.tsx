"use client"

import { useState, useRef, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { User, Bell, Lock, Layout, MonitorSmartphone, CreditCard, Settings } from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { updateProfile } from "@/lib/api"
import api from "@/lib/api"
import { useSearchParams } from "next/navigation"
import { UserAvatar } from "@/components/UserAvatar"

function SettingsContent() {
  const queryClient = useQueryClient()
  const searchParams = useSearchParams()
  const queryTab = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState('profile')

  useEffect(() => {
    if (queryTab && ['profile', 'account', 'security', 'notifications', 'devices', 'billing'].includes(queryTab)) {
      setActiveTab(queryTab)
    }
  }, [queryTab])

  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data: user } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await api.get('/auth/profile')
      return res.data?.user
    },
  })

  const userName = user?.name || ''
  const userEmail = user?.email || ''
  const nameParts = userName.split(' ')
  
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      const parts = (user.name || '').split(' ')
      setFirstName(parts[0] || '')
      setLastName(parts.slice(1).join(' ') || '')
      setEmail(user.email || '')
      if (user.avatar) {
        setAvatarPreview(`http://localhost:5000${user.avatar}`)
      }
    }
  }, [user])

  const [removeAvatar, setRemoveAvatar] = useState(false)

  const userSeed = userName.replace(/\s/g, '') || 'Design'
  const fallbackAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${userSeed}&backgroundColor=6366f1&textColor=ffffff`
  const displayAvatar = avatarPreview || fallbackAvatar

  const updateMutation = useMutation({
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

  const handleSave = () => {
    const formData = new FormData()
    formData.append('name', `${firstName} ${lastName}`.trim())
    formData.append('email', email)
    if (avatarFile) {
      formData.append('avatar', avatarFile)
    }
    if (removeAvatar) {
      formData.append('removeAvatar', 'true')
    }
    updateMutation.mutate(formData)
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
  const [devices, setDevices] = useState([
    { browser: "Chrome", os: "Windows 11", lastActive: "Active now" },
    { browser: "Safari Mobile", os: "iOS 17.4", lastActive: "2 hours ago" }
  ])

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
    updateMutation.mutate(formData, {
      onSuccess: () => {
        setPassword("")
        setConfirmPassword("")
      }
    })
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4"/> },
    { id: 'account', label: 'Account', icon: <Layout className="w-4 h-4"/> },
    { id: 'security', label: 'Security', icon: <Lock className="w-4 h-4"/> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4"/> },
    { id: 'devices', label: 'Devices', icon: <MonitorSmartphone className="w-4 h-4"/> },
    { id: 'billing', label: 'Billing', icon: <CreditCard className="w-4 h-4"/> },
  ]

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-[#F5F8FF] to-[#E9F0FE] p-8 relative">

      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Settings</h1>
          <p className="text-gray-500 mt-1">Manage your account settings and preferences.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-indigo-50 text-[#6366F1]' 
                    : 'text-gray-600 hover:bg-white/80 hover:text-gray-900'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1">
            {activeTab === 'profile' && (
              <Card className="border-gray-200/60 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Settings</h2>
                  
                  <div className="flex items-center gap-6 mb-8">
                    <UserAvatar name={userName} avatar={avatarPreview || undefined} size="w-20 h-20 text-2xl" />
                    <div>
                      <div className="flex gap-2">
                        <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
                        <Button variant="outline" className="border-gray-200" onClick={() => fileInputRef.current?.click()}>
                          Change Avatar
                        </Button>
                        <Button variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => { setAvatarFile(null); setAvatarPreview(null); setRemoveAvatar(true); }}>Remove</Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Recommended: Square JPG, PNG, or GIF, at least 1,000 pixels per side.</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-900">First Name</label>
                        <Input value={firstName} onChange={e => setFirstName(e.target.value)} className="bg-gray-50" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-900">Last Name</label>
                        <Input value={lastName} onChange={e => setLastName(e.target.value)} className="bg-gray-50" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-900">Email Address</label>
                      <Input value={email} onChange={e => setEmail(e.target.value)} className="bg-gray-50" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-900">Bio</label>
                      <textarea 
                        className="w-full h-24 px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                        defaultValue="Passionate about creating intuitive, user-centric experiences. Building the future of collaboration at CollabHub."
                      />
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                    <Button 
                      className="bg-[#6366F1] hover:bg-[#4F46E5] text-white px-6"
                      onClick={handleSave}
                      disabled={updateMutation.isPending}
                    >
                      {updateMutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'account' && (
              <Card className="border-gray-200/60 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Account Settings</h2>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-900">Workspace URL</label>
                      <Input value="collabhub.com/manas" readOnly className="bg-gray-100 cursor-not-allowed" />
                    </div>
                    <div className="pt-6 border-t border-gray-100 space-y-2">
                      <label className="text-sm font-semibold text-red-600">Delete Account</label>
                      <p className="text-xs text-gray-500">Permanently delete your account and all associated data. This action is irreversible.</p>
                      <Button variant="destructive" className="mt-2" onClick={() => confirm("Are you sure you want to delete your account?") && alert("Account deletion requested")}>Delete Account</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'security' && (
              <Card className="border-gray-200/60 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Security Settings</h2>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-900">New Password</label>
                      <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimum 6 characters" className="bg-gray-50" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-900">Confirm New Password</label>
                      <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Repeat password" className="bg-gray-50" />
                    </div>
                    <Button className="bg-[#6366F1] hover:bg-[#4F46E5] text-white mt-4" onClick={handlePasswordSave} disabled={updateMutation.isPending}>
                      {updateMutation.isPending ? "Updating..." : "Change Password"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'notifications' && (
              <Card className="border-gray-200/60 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Preferences</h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <div>
                        <h4 className="font-bold text-sm text-gray-900">Email Notifications</h4>
                        <p className="text-xs text-gray-500">Receive summaries and updates via email.</p>
                      </div>
                      <input type="checkbox" checked={emailNotif} onChange={e => setEmailNotif(e.target.checked)} className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500" />
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <div>
                        <h4 className="font-bold text-sm text-gray-900">Push Notifications</h4>
                        <p className="text-xs text-gray-500">Get alerts for mentions and new tasks in real-time.</p>
                      </div>
                      <input type="checkbox" checked={pushNotif} onChange={e => setPushNotif(e.target.checked)} className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500" />
                    </div>
                    <Button className="bg-[#6366F1] hover:bg-[#4F46E5] text-white mt-4" onClick={() => alert("Notification settings saved!")}>Save Preferences</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'devices' && (
              <Card className="border-gray-200/60 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Active Sessions</h2>
                  <div className="space-y-4">
                    {devices.map((device, i) => (
                      <div key={i} className="flex justify-between items-center p-4 border border-gray-100 rounded-lg bg-gray-50/50">
                        <div>
                          <h4 className="font-bold text-sm text-gray-900">{device.browser} on {device.os}</h4>
                          <p className="text-xs text-gray-500 font-medium">Last active: {device.lastActive}</p>
                        </div>
                        <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => {
                          setDevices(devices.filter((_, idx) => idx !== i))
                          alert("Session revoked successfully!")
                        }}>Revoke</Button>
                      </div>
                    ))}
                    {devices.length === 0 && (
                      <p className="text-center py-6 text-sm text-gray-500 font-medium">No other active sessions.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'billing' && (
              <Card className="border-gray-200/60 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Billing & Subscription</h2>
                  <div className="space-y-6">
                    <div className="p-6 rounded-xl border border-indigo-100 bg-indigo-50/30 flex justify-between items-center">
                      <div>
                        <span className="text-xs font-bold text-[#6366F1] uppercase tracking-wider">Current Plan</span>
                        <h3 className="text-2xl font-black text-gray-900 mt-1">Free Sandbox</h3>
                        <p className="text-xs text-gray-500 mt-1 font-medium">Up to 3 workspaces and 10 members.</p>
                      </div>
                      <Button className="bg-[#6366F1] hover:bg-[#4F46E5] text-white">Upgrade to Pro</Button>
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
