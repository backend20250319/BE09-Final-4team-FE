"use client"

import { ReactNode, useState } from "react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"

interface MainLayoutProps {
  children: ReactNode
  userName?: string
  showNotifications?: boolean
  showUserProfile?: boolean
  onMenuItemClick?: (index: number) => void
}

export function MainLayout({
  children,
  userName,
  showNotifications,
  showUserProfile,
  onMenuItemClick
}: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Sidebar onMenuItemClick={onMenuItemClick} isOpen={sidebarOpen} />
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-0'}`}>
        <Header 
          userName={userName}
          showNotifications={showNotifications}
          showUserProfile={showUserProfile}
          onToggleSidebar={toggleSidebar}
        />
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  )
} 