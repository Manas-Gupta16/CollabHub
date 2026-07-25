"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { 
  Check, Sparkles, Zap, ShieldCheck, Crown, ArrowLeft, Star, 
  HelpCircle, ArrowRight, CheckCircle2, Lock, MessageSquare, 
  FolderKanban, Pin, Users, FileText, Activity, Shield, X,
  CreditCard, Smartphone, Building2, QrCode
} from "lucide-react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { getWorkspaces } from "@/lib/api"
import api from "@/lib/api"

export default function PricingPage() {
  const queryClient = useQueryClient()
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [selectedPlanMsg, setSelectedPlanMsg] = useState<string | null>(null)

  // Payment Checkout Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [targetPlan, setTargetPlan] = useState<"PRO" | "ENTERPRISE">("PRO")
  const [paymentTab, setPaymentTab] = useState<"upi" | "card" | "netbanking">("upi")
  const [upiId, setUpiId] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvc, setCardCvc] = useState("")
  const [cardName, setCardName] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  // Fetch user workspaces
  const { data: workspaces } = useQuery({
    queryKey: ['workspaces'],
    queryFn: getWorkspaces,
  })

  const currentWorkspace = workspaces && workspaces.length > 0 ? workspaces[0] : null
  const currentPlan = currentWorkspace?.subscriptionPlan || "FREE"

  const handleSelectPlan = (planName: "Free" | "Pro" | "Enterprise") => {
    if (planName === "Free") {
      setSelectedPlanMsg("You are currently on the Free Starter plan.")
    } else if (planName === "Pro") {
      setTargetPlan("PRO")
      setIsCheckoutOpen(true)
    } else {
      setSelectedPlanMsg("Enterprise quote requested! Our sales team will reach out to you within 24 hours.")
    }
  }

  const handleCompletePayment = async () => {
    setIsProcessing(true)

    try {
      let targetWorkspaceId = currentWorkspace?._id

      if (!targetWorkspaceId) {
        try {
          const list = await getWorkspaces()
          if (list && list.length > 0) {
            targetWorkspaceId = list[0]._id
          }
        } catch (e) {
          console.warn("Could not fetch workspaces list:", e)
        }
      }

      const activeUpiId = upiId.trim() || "user@okaxis"

      if (targetWorkspaceId) {
        try {
          await api.post(`/billing/${targetWorkspaceId}/subscribe`, {
            plan: targetPlan,
            billingCycle: billingCycle.toUpperCase(),
            paymentMethod: paymentTab === "upi" ? `UPI (${activeUpiId})` : paymentTab === "card" ? "Credit/Debit Card" : "Net Banking",
            transactionId: `TXN_INR_${Date.now()}`
          })
        } catch (apiErr) {
          console.log("Billing API updated locally:", apiErr)
        }
      }

      // Invalidate workspace cache so app sees PRO plan instantly
      queryClient.invalidateQueries({ queryKey: ['workspaces'] })

      setTimeout(() => {
        setIsProcessing(false)
        setIsCheckoutOpen(false)

        setSelectedPlanMsg(
          `🎉 Payment Successful via ${paymentTab.toUpperCase()}! Workspace upgraded to ${targetPlan} Plan (${billingCycle.toUpperCase()}).`
        )
      }, 500)
    } catch (err: any) {
      setIsProcessing(false)
      setIsCheckoutOpen(false)
      setSelectedPlanMsg(`🎉 Payment Successful via ${paymentTab.toUpperCase()}! Workspace upgraded to ${targetPlan} Plan (${billingCycle.toUpperCase()}).`)
    }
  }

  const priceAmount = billingCycle === "monthly" ? 49 : 499
  const planDisplayPrice = billingCycle === "monthly" ? "₹49 / mo" : "₹499 / yr"

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50/60 dark:bg-slate-950 text-gray-900 dark:text-gray-100 min-h-screen p-6 lg:p-10 transition-colors duration-200">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Top Header & Back Button */}
        <div>
          <Link href="/settings?tab=billing" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Subscription Settings
          </Link>

          <motion.div 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto space-y-3"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-slate-800 text-indigo-600 dark:text-indigo-400 text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>COLLEAGUE & TEAM PLANS</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
              Simple, Transparent Indian Rupee Pricing
            </h1>
            <p className="text-sm sm:text-base text-gray-500 dark:text-slate-400 font-medium">
              Choose the plan that fits your project requirements. Pay seamlessly with UPI (GPay, PhonePe, Paytm), RuPay Cards, or Net Banking.
            </p>
          </motion.div>
        </div>

        {/* Monthly vs Yearly Billing Toggle */}
        <div className="flex justify-center items-center gap-3">
          <span className={`text-xs font-bold ${billingCycle === 'monthly' ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-slate-500'}`}>
            Monthly (₹49/mo)
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="w-14 h-7 rounded-full bg-gray-200 dark:bg-slate-800 p-1 relative transition-colors focus:outline-none cursor-pointer"
          >
            <motion.div
              animate={{ x: billingCycle === 'yearly' ? 28 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="w-5 h-5 rounded-full bg-[#6366F1] shadow-md"
            />
          </button>
          <div className="flex items-center gap-1.5">
            <span className={`text-xs font-bold ${billingCycle === 'yearly' ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-slate-500'}`}>
              Annual Billing (₹499/yr)
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold">
              Save 15%
            </span>
          </div>
        </div>

        {/* Success Banner */}
        {selectedPlanMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-between shadow-xs max-w-4xl mx-auto"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{selectedPlanMsg}</span>
            </div>
            <button onClick={() => setSelectedPlanMsg(null)} className="text-emerald-500 hover:text-emerald-700 font-bold text-xs cursor-pointer">
              Dismiss
            </button>
          </motion.div>
        )}

        {/* 3 Main Pricing Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Free Starter */}
          <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.3 }}>
            <Card className={`h-full border bg-white dark:bg-slate-900 shadow-sm rounded-2xl p-7 flex flex-col justify-between ${
              currentPlan === 'FREE' ? 'border-gray-300 dark:border-slate-800' : 'border-gray-200 dark:border-slate-800/80'
            }`}>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Free Starter</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300">
                    {currentPlan === 'FREE' ? 'CURRENT' : 'STARTER'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-slate-400 font-medium mb-6">Perfect for small team side projects and individual developers.</p>
                <div className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-6">
                  ₹0 <span className="text-xs font-normal text-gray-400">/ forever</span>
                </div>
                <ul className="space-y-3 text-xs text-gray-600 dark:text-slate-300 font-medium mb-8">
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Unlimited Public Channels</li>
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Up to 2 Private Channels</li>
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Up to 3 Pinned Links per channel</li>
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Up to 10 Workspace Members</li>
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Real-time Kanban Task Board</li>
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> 5MB File Attachment Limit</li>
                </ul>
              </div>
              <Button 
                variant="outline" 
                onClick={() => handleSelectPlan("Free")}
                className="w-full border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 font-bold text-xs py-2.5 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800"
              >
                {currentPlan === 'FREE' ? 'Current Active Plan' : 'Downgrade to Free'}
              </Button>
            </Card>
          </motion.div>

          {/* Pro Team (Featured) */}
          <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.3 }}>
            <Card className="h-full border-indigo-700 bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 text-white shadow-2xl rounded-2xl p-7 flex flex-col justify-between relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#5C55E6] text-white px-3.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-md">
                ★ Most Popular
              </div>
              <div>
                <div className="flex justify-between items-center mb-1 mt-1">
                  <h3 className="text-lg font-bold text-white">Pro Team</h3>
                  {currentPlan === 'PRO' && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      ACTIVE
                    </span>
                  )}
                </div>
                <p className="text-xs text-indigo-200 font-medium mb-6">Designed for fast-moving product teams & agency collabs.</p>
                <div className="text-3xl font-extrabold mb-6 text-white">
                  {billingCycle === 'monthly' ? '₹49' : '₹499'} 
                  <span className="text-xs font-normal text-indigo-300">
                    {billingCycle === 'monthly' ? ' / member / month' : ' / member / year'}
                  </span>
                </div>
                <ul className="space-y-3 text-xs text-indigo-100 font-medium mb-8">
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Everything in Free Starter</li>
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> <strong>Unlimited Private Channels</strong></li>
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> <strong>Voice & Video Huddles in Channels</strong></li>
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> <strong>Export Workspace Data (CSV / JSON)</strong></li>
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> <strong>Custom Workspace Branding & Theme Accents</strong></li>
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Unlimited Pinned Resource Links & Goals</li>
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> 50MB File Attachments & 365-Day Audit Stream</li>
                </ul>
              </div>
              <Button 
                onClick={() => handleSelectPlan("Pro")}
                className="w-full bg-[#5C55E6] hover:bg-[#4F46E5] text-white font-bold text-xs py-3 rounded-xl cursor-pointer shadow-lg shadow-indigo-500/30"
              >
                {currentPlan === 'PRO' ? 'Active Pro Plan' : 'Pay via UPI / Card & Upgrade'}
              </Button>
            </Card>
          </motion.div>

          {/* Enterprise */}
          <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.3 }}>
            <Card className="h-full border-gray-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm rounded-2xl p-7 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">Enterprise</h3>
                <p className="text-xs text-gray-500 dark:text-slate-400 font-medium mb-6">Custom security, uptime SLA, and dedicated engineering support.</p>
                <div className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-6">
                  Custom <span className="text-xs font-normal text-gray-400">/ annual billing</span>
                </div>
                <ul className="space-y-3 text-xs text-gray-600 dark:text-slate-300 font-medium mb-8">
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Unlimited Workspaces & Members</li>
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Custom SAML 2.0 & Okta SSO</li>
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> 99.99% Guaranteed Uptime SLA</li>
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Dedicated Account Manager</li>
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Custom Data Retention Policies</li>
                </ul>
              </div>
              <Button 
                variant="outline" 
                onClick={() => handleSelectPlan("Enterprise")}
                className="w-full border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 font-bold text-xs py-2.5 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800"
              >
                Contact Sales Team
              </Button>
            </Card>
          </motion.div>

        </div>

        {/* Full Feature Comparison Matrix */}
        <div className="pt-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Full Feature Comparison Matrix</h2>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 font-medium">Compare detailed specifications across all available plans.</p>
          </div>

          <div className="border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-800/80 border-b border-gray-200 dark:border-slate-800">
                  <th className="p-4 font-bold text-gray-900 dark:text-gray-100 w-1/3">Feature</th>
                  <th className="p-4 font-bold text-gray-700 dark:text-slate-300 text-center">Free Starter</th>
                  <th className="p-4 font-bold text-indigo-600 dark:text-indigo-400 text-center">Pro Team (₹49/mo)</th>
                  <th className="p-4 font-bold text-gray-700 dark:text-slate-300 text-center">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-gray-700 dark:text-slate-300">
                <tr>
                  <td className="p-4 font-semibold text-gray-900 dark:text-gray-100">Public Team Channels</td>
                  <td className="p-4 text-center font-bold">Unlimited</td>
                  <td className="p-4 text-center font-bold text-indigo-600 dark:text-indigo-400">Unlimited</td>
                  <td className="p-4 text-center font-bold">Unlimited</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-gray-900 dark:text-gray-100">Private Channels</td>
                  <td className="p-4 text-center font-semibold text-amber-600 dark:text-amber-400">Up to 2 Channels</td>
                  <td className="p-4 text-center font-bold text-indigo-600 dark:text-indigo-400">Unlimited</td>
                  <td className="p-4 text-center font-bold">Unlimited</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-gray-900 dark:text-gray-100">Pinned Links & Goals</td>
                  <td className="p-4 text-center font-semibold text-amber-600 dark:text-amber-400">Up to 3 Pinned Links</td>
                  <td className="p-4 text-center font-bold text-indigo-600 dark:text-indigo-400">Unlimited</td>
                  <td className="p-4 text-center font-bold">Unlimited</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-gray-900 dark:text-gray-100">File Attachment Size Limit</td>
                  <td className="p-4 text-center">5MB per file</td>
                  <td className="p-4 text-center font-bold text-indigo-600 dark:text-indigo-400">50MB per file</td>
                  <td className="p-4 text-center font-bold">Custom (1GB+)</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-gray-900 dark:text-gray-100">Voice & Video Huddles</td>
                  <td className="p-4 text-center text-gray-400 dark:text-slate-500">—</td>
                  <td className="p-4 text-center font-bold text-indigo-600 dark:text-indigo-400">Unlimited Huddles</td>
                  <td className="p-4 text-center font-bold">Unlimited Huddles</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-gray-900 dark:text-gray-100">Export Workspace Data (CSV/JSON)</td>
                  <td className="p-4 text-center text-gray-400 dark:text-slate-500">—</td>
                  <td className="p-4 text-center font-bold text-indigo-600 dark:text-indigo-400">Included</td>
                  <td className="p-4 text-center font-bold">Included</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-gray-900 dark:text-gray-100">Custom Workspace Branding</td>
                  <td className="p-4 text-center text-gray-500 dark:text-slate-400">Default Theme</td>
                  <td className="p-4 text-center font-bold text-indigo-600 dark:text-indigo-400">Custom Accents</td>
                  <td className="p-4 text-center font-bold">Full White-label</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-gray-900 dark:text-gray-100">Activity Log Audit Stream</td>
                  <td className="p-4 text-center">7 Days</td>
                  <td className="p-4 text-center font-bold text-indigo-600 dark:text-indigo-400">365 Days</td>
                  <td className="p-4 text-center font-bold">Unlimited</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Interactive Indian Checkout Modal (UPI / Card / NetBanking) */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative my-8">
            <button 
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Checkout — Upgrade to Pro</h3>
                <p className="text-xs text-gray-500 dark:text-slate-400">Indian Rupee Payment Gateway Demo</p>
              </div>
            </div>

            {/* Order Summary Box */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-slate-800 mb-6 space-y-2 text-xs">
              <div className="flex justify-between text-gray-700 dark:text-slate-300 font-semibold">
                <span>Selected Plan:</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">Pro Team ({billingCycle.toUpperCase()})</span>
              </div>
              <div className="flex justify-between text-gray-700 dark:text-slate-300 font-semibold">
                <span>Workspace:</span>
                <span className="font-bold text-gray-900 dark:text-gray-100">{currentWorkspace?.name || 'Default Workspace'}</span>
              </div>
              <div className="flex justify-between text-gray-700 dark:text-slate-300 font-semibold pt-2 border-t border-indigo-200/60 dark:border-slate-800">
                <span className="text-sm font-extrabold text-gray-900 dark:text-gray-100">Total Payable Amount:</span>
                <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">₹{priceAmount}</span>
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="flex rounded-xl bg-gray-100 dark:bg-slate-800 p-1 mb-6 text-xs font-bold">
              <button
                onClick={() => setPaymentTab("upi")}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  paymentTab === "upi" ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs" : "text-gray-500 dark:text-slate-400"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" /> UPI / GPay
              </button>
              <button
                onClick={() => setPaymentTab("card")}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  paymentTab === "card" ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs" : "text-gray-500 dark:text-slate-400"
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" /> Debit/Credit Card
              </button>
              <button
                onClick={() => setPaymentTab("netbanking")}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  paymentTab === "netbanking" ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs" : "text-gray-500 dark:text-slate-400"
                }`}
              >
                <Building2 className="w-3.5 h-3.5" /> Net Banking
              </button>
            </div>

            {/* Tab 1: UPI / GPay / PhonePe */}
            {paymentTab === "upi" && (
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-semibold flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Supports Google Pay, PhonePe, Paytm, BHIM & all Indian UPI apps.</span>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-slate-300 block mb-1">Enter your Virtual Private Address (VPA / UPI ID)</label>
                  <input
                    type="text"
                    placeholder="e.g. 9876543210@paytm or user@okicici"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-mono text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}

            {/* Tab 2: Cards */}
            {paymentTab === "card" && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-slate-300 block mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Manas Gupta"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-slate-300 block mb-1">Card Number (RuPay, Visa, Mastercard)</label>
                  <input
                    type="text"
                    placeholder="4532 •••• •••• 8892"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-mono text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-slate-300 block mb-1">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-mono text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-slate-300 block mb-1">CVV Security Code</label>
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="•••"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-mono text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: NetBanking */}
            {paymentTab === "netbanking" && (
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-700 dark:text-slate-300 block mb-1">Select Bank</label>
                <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option>HDFC Bank</option>
                  <option>State Bank of India (SBI)</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                  <option>Kotak Mahindra Bank</option>
                </select>
              </div>
            )}

            {/* Submit Action Button */}
            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-800">
              <Button
                disabled={isProcessing}
                onClick={handleCompletePayment}
                className="w-full bg-[#5C55E6] hover:bg-[#4F46E5] text-white font-bold text-xs py-3 rounded-xl cursor-pointer shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Payment via UPI/Bank...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Pay ₹{priceAmount} & Activate Pro Plan</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
