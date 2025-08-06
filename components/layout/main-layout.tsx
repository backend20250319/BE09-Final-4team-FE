"use client"

import { ReactNode, useState, useEffect } from "react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { useIsMobile } from "@/hooks/use-mobile"

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
  const isMobile = useIsMobile()
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)

  // 모바일 상태가 변경될 때 사이드바 상태 조정
  useEffect(() => {
    setSidebarOpen(!isMobile)
  }, [isMobile])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* 모바일 오버레이 */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}
      
      <Sidebar 
        onMenuItemClick={onMenuItemClick} 
        isOpen={sidebarOpen} 
        isMobile={isMobile}
        onClose={closeSidebar}
      />
      
      <div className={`transition-all duration-300 ${
        isMobile 
          ? 'ml-0' 
          : sidebarOpen ? 'ml-72' : 'ml-0'
      }`}>
        <Header 
          userName={userName}
          showNotifications={showNotifications}
          showUserProfile={showUserProfile}
          onToggleSidebar={toggleSidebar}
          isMobile={isMobile}
        />
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  )
} 