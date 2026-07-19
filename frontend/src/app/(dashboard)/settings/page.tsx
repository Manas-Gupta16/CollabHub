"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { User, Bell, Lock, Layout, MonitorSmartphone, CreditCard, Settings } from "lucide-react"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4"/> },
    { id: 'account', label: 'Account', icon: <Layout className="w-4 h-4"/> },
    { id: 'security', label: 'Security', icon: <Lock className="w-4 h-4"/> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4"/> },
    { id: 'devices', label: 'Devices', icon: <MonitorSmartphone className="w-4 h-4"/> },
    { id: 'billing', label: 'Billing', icon: <CreditCard className="w-4 h-4"/> },
  ]

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAFAFA] p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
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
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
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
              <Card className="border-gray-200">
                <CardContent className="p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Settings</h2>
                  
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 rounded-full border border-gray-200 overflow-hidden bg-gray-100 shrink-0">
                      <img src="https://api.dicebear.com/7.x/micah/svg?seed=Design&backgroundColor=f3f4f6" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="flex gap-2">
                        <Button variant="outline" className="border-gray-200">Change Avatar</Button>
                        <Button variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50">Remove</Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Recommended: Square JPG, PNG, or GIF, at least 1,000 pixels per side.</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-900">First Name</label>
                        <Input defaultValue="Design" className="bg-gray-50" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-900">Last Name</label>
                        <Input defaultValue="Yeather" className="bg-gray-50" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-900">Email Address</label>
                      <Input defaultValue="design.y@collabhub.com" className="bg-gray-50" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-900">Bio</label>
                      <textarea 
                        className="w-full h-24 px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                        defaultValue="Passionate about creating intuitive, user-centric experiences. Leading the design system and overall aesthetic of CollabHub."
                      />
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                    <Button className="bg-[#6366F1] hover:bg-[#4F46E5] text-white px-6">
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab !== 'profile' && (
              <Card className="border-gray-200">
                <CardContent className="p-8 flex flex-col items-center justify-center text-center py-20">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <Settings className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Settings Section Placeholder</h3>
                  <p className="text-gray-500 max-w-sm">This section is part of the application template. More settings panels will be populated here.</p>
                </CardContent>
              </Card>
            )}
          </div>

        </div>

      </div>
    </div>
  )
}
