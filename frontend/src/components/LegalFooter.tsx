import Link from "next/link"

export function LegalFooter() {
  return (
    <footer className="bg-gray-950 text-gray-400 py-12 border-t border-gray-800 text-xs">
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-gray-800/80">
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-base text-white hover:opacity-85 transition-opacity">
              <div className="relative w-5 h-5 border-2 border-white rounded-[4px] flex items-center justify-center bg-transparent">
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-gray-950 border-2 border-white rounded-[2px]" />
              </div>
              CollabHub
            </Link>
            <p className="text-gray-400 text-xs mt-1.5 max-w-sm">
              Modern full-stack team collaboration platform with real-time messaging, Kanban task boards, and workspace organization.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 font-medium text-xs">
            <div className="space-y-2">
              <span className="font-bold text-white uppercase text-[10px] tracking-wider block">Product</span>
              <div><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></div>
              <div><Link href="/#features" className="hover:text-white transition-colors">Features</Link></div>
              <div><Link href="/dashboard" className="hover:text-white transition-colors">App Dashboard</Link></div>
            </div>
            <div className="space-y-2">
              <span className="font-bold text-white uppercase text-[10px] tracking-wider block">Legal</span>
              <div><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></div>
              <div><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></div>
              <div><Link href="/refund" className="hover:text-white transition-colors">Cancellation & Refund</Link></div>
            </div>
            <div className="space-y-2">
              <span className="font-bold text-white uppercase text-[10px] tracking-wider block">Support</span>
              <div><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></div>
              <div><a href="mailto:support@collabhub.com" className="hover:text-white transition-colors">Email Support</a></div>
              <div><Link href="/#support" className="hover:text-white transition-colors">FAQs</Link></div>
            </div>
            <div className="space-y-2">
              <span className="font-bold text-white uppercase text-[10px] tracking-wider block">Security</span>
              <div className="text-gray-400">256-Bit SSL</div>
              <div className="text-gray-400">Razorpay Verified</div>
              <div className="text-gray-400">PCI-DSS Level 1</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-gray-500 text-[11px]">
          <p>&copy; {new Date().getFullYear()} CollabHub Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-gray-400">Terms</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-gray-400">Privacy</Link>
            <span>•</span>
            <Link href="/refund" className="hover:text-gray-400">Refund Policy</Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-gray-400">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
