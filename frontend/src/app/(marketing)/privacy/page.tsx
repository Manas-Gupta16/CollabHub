import { LegalNavbar } from "@/components/LegalNavbar"
import { LegalFooter } from "@/components/LegalFooter"
import { ShieldCheck, Lock, Eye, FileText, Database, Mail } from "lucide-react"

export const metadata = {
  title: "Privacy Policy – CollabHub",
  description: "Learn how CollabHub collects, uses, and safeguards your personal data and project workspaces."
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 dark:bg-slate-950 text-gray-900 dark:text-gray-100">
      <LegalNavbar />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 md:py-16 space-y-10">
        
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-slate-800 pb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>COLOUR & PRIVACY ASSURANCE</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
            Privacy Policy
          </h1>
          <p className="text-xs text-gray-500 dark:text-slate-400">
            Last Updated: October 2026 • Effective Date: October 2026
          </p>
          <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed pt-2">
            At CollabHub, your privacy and data security are our highest priorities. This Privacy Policy details the types of information we collect, how it is processed and protected, and the choices you have regarding your personal data.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8 text-sm text-gray-700 dark:text-slate-300 leading-relaxed font-normal">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-600" />
              1. Information We Collect
            </h2>
            <p>We collect information you provide directly to us when creating an account, establishing a workspace, communicating with team members, or subscribing to paid services:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-xs">
              <li><strong>Account Credentials:</strong> Full name, email address, password (stored as one-way cryptographic bcrypt hashes), and avatar.</li>
              <li><strong>Third-Party SSO:</strong> When registering via Google OAuth 2.0, we securely receive your verified name, email address, and profile photo.</li>
              <li><strong>Workspace Content:</strong> Projects, tasks, kanban statuses, team messages, file attachments, pinned links, and team goals that you and your workspace members create.</li>
              <li><strong>Payment Information:</strong> When you purchase a Pro plan, payments are securely processed through <strong>Razorpay Software Private Limited</strong>. We store only transactional metadata (such as order ID, payment ID, billing cycle, and invoice timestamps). We do not store credit/debit card numbers or CVVs on our servers.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-600" />
              2. How We Use Your Information
            </h2>
            <p>We use the data we collect solely for legitimate product operations, including:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-xs">
              <li>Providing, maintaining, and enhancing the CollabHub workspace platform and real-time Socket.IO messaging.</li>
              <li>Processing subscription upgrades, invoice generation, and billing management via Razorpay.</li>
              <li>Transmitting transactional notifications, invitation emails, password reset links, and system updates.</li>
              <li>Preventing fraudulent access, rate limiting abusive traffic, and enforcing our Terms of Service.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-600" />
              3. Data Security & Encryption
            </h2>
            <p>
              We implement industry-standard administrative, physical, and technical safeguards. All network communications are encrypted in transit via Transport Layer Security (TLS 1.3 / SSL 256-bit). Database storage is guarded behind strict firewall policies, and payment transactions are processed through PCI-DSS Level 1 compliant payment gateways.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              4. Data Sharing & Third Parties
            </h2>
            <p>
              CollabHub never sells, rents, or monetizes your personal information to third parties or advertising networks. We share minimal required data solely with verified infrastructure providers:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-xs">
              <li><strong>Razorpay:</strong> Payment processing and subscription invoicing.</li>
              <li><strong>Cloud Infrastructure:</strong> Cloud hosting, database clusters, and media storage.</li>
              <li><strong>Legal Compliance:</strong> When required by applicable Indian or international law, court order, or governmental regulation.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Mail className="w-4 h-4 text-indigo-600" />
              5. Your Rights & Grievance Contact
            </h2>
            <p>
              You have the right to access, edit, or delete your account and workspace data at any time through your Profile Settings. To request complete account deletion or for privacy-related queries, please contact our designated Grievance Officer:
            </p>
            <div className="p-4 rounded-xl bg-gray-100 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-xs space-y-1">
              <p><strong>Grievance Officer:</strong> CollabHub Privacy & Compliance Team</p>
              <p><strong>Email:</strong> <a href="mailto:support@collabhub.com" className="text-indigo-600 hover:underline">support@collabhub.com</a></p>
              <p><strong>Location:</strong> India</p>
              <p><strong>Response Time:</strong> Within 48 business hours</p>
            </div>
          </section>

        </div>
      </main>

      <LegalFooter />
    </div>
  )
}
