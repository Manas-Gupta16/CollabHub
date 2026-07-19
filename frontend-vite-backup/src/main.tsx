import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './app/router'
import QueryProvider from './app/providers/QueryProvider'
import { Toaster } from './components/ui/sonner'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </QueryProvider>
  </StrictMode>,
)
