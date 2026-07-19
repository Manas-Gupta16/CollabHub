import { Outlet } from "react-router-dom"

export default function AuthLayout() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </div>
      <div className="hidden lg:flex flex-col items-center justify-center bg-indigo-50 p-12 relative overflow-hidden">
        <div className="absolute top-12 left-12">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-2xl">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
            </div>
            CollabHub
          </div>
        </div>
        <div className="max-w-md text-center mt-20 z-10">
          <h2 className="text-3xl font-bold text-indigo-950 mb-4">
            Collaboration that's effortless & powerful
          </h2>
          <p className="text-indigo-800/80">
            Streamline your workflows, share ideas, and keep everyone on the same page.
          </p>
        </div>
        {/* Placeholder for illustration */}
        <div className="w-full max-w-md aspect-video bg-white/50 rounded-xl mt-12 shadow-xl border border-white/20 backdrop-blur-sm"></div>
      </div>
    </div>
  )
}
