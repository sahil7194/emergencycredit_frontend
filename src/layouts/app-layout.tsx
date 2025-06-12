// src/layouts/app-layout.tsx
import { ReactNode } from 'react'

interface AppLayoutProps {
  children: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen">
      {/* You can add a Navbar here */}
      <main className="p-4">
        {children}
      </main>
      {/* You can add a Footer here */}
    </div>
  )
}
