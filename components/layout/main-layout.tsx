"use client"

import { ReactNode, useState, useEffect } from "react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { AuthProvider } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

interface MainLayoutProps {
  children: ReactNode
  userName?: string
  showNotifications?: boolean
  showUserProfile?: boolean
  onMenuItemClick?: (index: number) => void
  requireAuth?: boolean
  requireAdmin?: boolean
}

export function MainLayout({
  children,
  userName,
  showNotifications,
  showUserProfile,
  onMenuItemClick,
  requireAuth = false,
  requireAdmin = false
}: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const router = useRouter()

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Sidebar onMenuItemClick={onMenuItemClick} isOpen={sidebarOpen} isMobile={false} />
        <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-0'}`}>
          <Header 
            userName={userName}
            showNotifications={showNotifications}
            showUserProfile={showUserProfile}
            onToggleSidebar={toggleSidebar}
            isMobile={false}
          />
          <div className="p-8">
            {children}
          </div>
        </div>
      </div>
    </AuthProvider>
  )
} 