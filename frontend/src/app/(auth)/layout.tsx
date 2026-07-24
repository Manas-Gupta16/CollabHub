import Link from "next/link"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center items-center gap-2 font-bold text-3xl tracking-tight text-gray-900 mb-8 hover:opacity-85 transition-opacity cursor-pointer">
          <div className="w-8 h-8 rounded-md bg-transparent border-2 border-gray-900 flex items-center justify-center relative">
            <div className="w-3 h-3 bg-gray-900 rounded-sm absolute top-1 right-1"></div>
          </div>
          CollabHub
        </Link>
        <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-2xl sm:px-10 border border-gray-100">
          {children}
        </div>
      </div>
    </div>
  )
}
