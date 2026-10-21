import { LegalNavbar } from "@/components/LegalNavbar"
import { LegalFooter } from "@/components/LegalFooter"
import { Scale, CheckCircle2, AlertTriangle, CreditCard, Shield, Gavel } from "lucide-react"

export const metadata = {
  title: "Terms of Service – CollabHub",
  description: "Terms and conditions governing your access and use of the CollabHub software platform."
}

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 dark:bg-slate-950 text-gray-900 dark:text-gray-100">
      <LegalNavbar />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 md:py-16 space-y-10">
        
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-slate-800 pb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
            <Scale className="w-3.5 h-3.5" />
            <span>USER AGREEMENT</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
            Terms of Service
          </h1>
          <p className="text-xs text-gray-500 dark:text-slate-400">
            Last Updated: October 2026 • Effective Date: October 2026
          </p>
          <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed pt-2">
            These Terms of Service (&quot;Terms&quot;) govern your access to and use of CollabHub (&quot;the Platform&quot;), including our web application, APIs, and subscription services. By registering, creating a workspace, or using CollabHub, you agree to be bound by these Terms.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-sm text-gray-700 dark:text-slate-300 leading-relaxed font-normal">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              1. Platform Services & Eligibility
            </h2>
            <p>
              CollabHub provides an online workspace productivity and team collaboration platform featuring task boards (Kanban), real-time messaging, private and public channels, file attachments, and activity logging.
            </p>
            <p>
              You must be at least 18 years of age or possess the legal authority to enter into these Terms on behalf of yourself or an entity you represent.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-indigo-600" />
              2. Subscriptions, Fees & Payment Terms
            </h2>
            <p>
              CollabHub offers both free Starter tier access and paid subscription tiers (&quot;Pro Team&quot; and &quot;Enterprise&quot;):
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-xs">
              <li><strong>Pricing & Billing:</strong> Pro Team is billed at <strong>₹49 per month</strong> or <strong>₹499 per year</strong> (inclusive of applicable taxes unless specified). Fees are billed in advance on a recurring monthly or yearly cycle.</li>
              <li><strong>Payment Gateway:</strong> All payments are processed securely through <strong>Razorpay</strong>. By submitting payment details, you authorize Razorpay and CollabHub to charge the selected amount via UPI, Credit/Debit Cards, or NetBanking.</li>
              <li><strong>Automatic Renewal & Expiration:</strong> Subscriptions remain active until the end of the paid billing period. If not renewed, the workspace gracefully reverts to the Free tier with standard quotas.</li>
              <li><strong>Price Changes:</strong> We reserve the right to revise subscription fees upon 30 days of advance notice to workspace administrators.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-600" />
              3. User Accounts & Responsibilities
            </h2>
            <p>
              You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. You agree to:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-xs">
              <li>Provide accurate, current, and complete registration information.</li>
              <li>Notify us immediately at <a href="mailto:support@collabhub.com" className="text-indigo-600 hover:underline">support@collabhub.com</a> of any unauthorized account access.</li>
              <li>Refrain from uploading malicious code, transmitting illegal material, or attempting to compromise platform security or rate limits.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-indigo-600" />
              4. Workspace Content & Intellectual Property
            </h2>
            <p>
              You retain all ownership rights to the content, tasks, links, and documents uploaded to your workspaces. By uploading content, you grant CollabHub a worldwide, non-exclusive license solely to host, store, and transmit your data to provide the service.
            </p>
            <p>
              All trademarks, platform code, logos, and UI designs of CollabHub remain the exclusive intellectual property of CollabHub Inc.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Gavel className="w-4 h-4 text-indigo-600" />
              5. Governing Law & Dispute Resolution
            </h2>
            <p>
              These Terms are governed by and construed in accordance with the laws of <strong>India</strong>. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of India.
            </p>
          </section>

        </div>
      </main>

      <LegalFooter />
    </div>
  )
}
