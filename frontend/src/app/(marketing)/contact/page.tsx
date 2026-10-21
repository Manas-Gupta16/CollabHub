"use client"

import { useState } from "react"
import { LegalNavbar } from "@/components/LegalNavbar"
import { LegalFooter } from "@/components/LegalFooter"
import { Button } from "@/components/ui/button"
import { Mail, Clock, MapPin, Send, CheckCircle2, MessageSquare } from "lucide-react"
import { toast } from "sonner"

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !message) {
      toast.error("Please fill in all required fields.")
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      toast.success("Thank you! Your message has been sent. Our team will get back to you shortly.")
    }, 700)
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 dark:bg-slate-950 text-gray-900 dark:text-gray-100">
      <LegalNavbar />

      <main className="flex-1 max-w-5xl mx-auto px-6 py-12 md:py-16 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WE&apos;RE HERE TO HELP</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
            Contact CollabHub Support
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">
            Have questions about your workspace, Pro subscription, or billing? Reach out to our dedicated support team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Contact Details Card */}
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-xs space-y-5">
              <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider text-[11px]">
                Support Information
              </h2>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-gray-400 dark:text-slate-500 block uppercase">Email Address</span>
                  <a href="mailto:support@collabhub.com" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                    support@collabhub.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-gray-400 dark:text-slate-500 block uppercase">Response Time</span>
                  <p className="text-xs font-semibold text-gray-700 dark:text-slate-300">
                    24 to 48 business hours
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-gray-400 dark:text-slate-500 block uppercase">Operating Location</span>
                  <p className="text-xs font-semibold text-gray-700 dark:text-slate-300">
                    CollabHub Operations, India
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-slate-800 text-xs text-indigo-900 dark:text-indigo-200 font-medium">
              💡 For billing or transaction issues, please provide your <strong>Razorpay Payment ID</strong> in the message for faster resolution.
            </div>
          </div>

          {/* Interactive Contact Form */}
          <div className="md:col-span-2">
            <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-xs">
              {isSubmitted ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Message Received!</h3>
                  <p className="text-xs text-gray-500 dark:text-slate-400 max-w-sm mx-auto font-medium">
                    Thank you, {name}. Our customer success team has received your ticket and will respond via {email} within 24 to 48 hours.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsSubmitted(false)
                      setName("")
                      setEmail("")
                      setSubject("")
                      setMessage("")
                    }}
                    className="text-xs mt-3 rounded-xl border-gray-200 dark:border-slate-800"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 dark:text-slate-300">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 dark:text-slate-300">Your Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. john@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 dark:text-slate-300">Subject</label>
                    <input
                      type="text"
                      placeholder="e.g. Question about Pro Team subscription"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 dark:text-slate-300">Message / Inquiry *</label>
                    <textarea
                      rows={5}
                      required
                      placeholder="How can we help your team?"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-xl p-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#5C55E6] hover:bg-[#4F46E5] text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? "Sending..." : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>

        </div>
      </main>

      <LegalFooter />
    </div>
  )
}
