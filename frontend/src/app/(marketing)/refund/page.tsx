import { LegalNavbar } from "@/components/LegalNavbar"
import { LegalFooter } from "@/components/LegalFooter"
import { RotateCcw, CheckCircle, Clock, ShieldCheck, HelpCircle } from "lucide-react"

export const metadata = {
  title: "Cancellation & Refund Policy – CollabHub",
  description: "Learn about CollabHub's subscription cancellation procedures, renewal terms, and refund guidelines."
}

export default function RefundPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 dark:bg-slate-950 text-gray-900 dark:text-gray-100">
      <LegalNavbar />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 md:py-16 space-y-10">
        
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-slate-800 pb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>TRANSPARENT BILLING</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
            Cancellation & Refund Policy
          </h1>
          <p className="text-xs text-gray-500 dark:text-slate-400">
            Last Updated: October 2026 • Compliant with Razorpay & RBI Merchant Guidelines
          </p>
          <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed pt-2">
            At CollabHub, we believe in honest and transparent billing. We want you to feel confident in choosing our platform to empower your team. Please review our policies regarding subscription cancellations and refund requests below.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-sm text-gray-700 dark:text-slate-300 leading-relaxed font-normal">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              1. Subscription Cancellation
            </h2>
            <p>
              You can cancel your CollabHub Pro subscription renewal at any time. We make cancellation completely self-serve with no hidden lock-ins or mandatory phone calls:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-xs">
              <li>Navigate to your workspace <strong>Settings</strong> ➔ <strong>Billing</strong> tab.</li>
              <li>Click the <strong>&quot;Cancel Renewal&quot;</strong> button.</li>
              <li>Your cancellation will take effect immediately for future billing cycles.</li>
              <li><strong>Grace Period Retention:</strong> When you cancel, your team will continue to enjoy uninterrupted access to all Pro features (unlimited private channels, extra team members, and file limits) until the end of your current paid billing period.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              2. Refund Policy
            </h2>
            <p>
              CollabHub is a digital Software-as-a-Service (SaaS) product that grants immediate access to platform infrastructure, compute, and team storage upon payment. As such:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-xs">
              <li><strong>Standard Subscriptions:</strong> Monthly (₹49) and Yearly (₹499) subscription payments are generally non-refundable once the billing period has commenced, as services are provisioned instantaneously.</li>
              <li><strong>Duplicate or Erroneous Charges:</strong> If you were charged more than once due to a network glitch or gateway timeout, please notify us within 7 days. We will gladly reverse the duplicate transaction in full.</li>
              <li><strong>Service Outage Exception:</strong> If our platform experiences significant technical failure preventing your team from utilizing the service for more than 48 consecutive hours, you may request a pro-rated credit or refund.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              3. Refund Processing Timeline
            </h2>
            <p>
              Once a refund request is reviewed and approved by our support team:
            </p>
            <div className="p-4 rounded-xl bg-gray-100 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-xs space-y-2">
              <p>• <strong>Method:</strong> The refund will be credited directly to the original payment method used (UPI ID, NetBanking account, or Credit/Debit Card) via Razorpay.</p>
              <p>• <strong>Timeline:</strong> Funds typically reflect in your bank account within <strong>5 to 7 business days</strong>, subject to standard banking clearing times in India.</p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              4. How to Request Assistance
            </h2>
            <p>
              For any billing questions, duplicate charge resolutions, or refund inquiries, please email us with your <strong>Workspace ID</strong> and <strong>Razorpay Payment ID</strong> (found in your Invoice history):
            </p>
            <p className="font-semibold text-xs text-indigo-600 dark:text-indigo-400">
              Billing Support: <a href="mailto:support@collabhub.com" className="hover:underline">support@collabhub.com</a>
            </p>
          </section>

        </div>
      </main>

      <LegalFooter />
    </div>
  )
}
