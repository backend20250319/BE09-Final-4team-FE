"use client"

import { ReactNode } from "react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"

interface MainLayoutProps {
  children: ReactNode
  title?: string
  userName?: string
  showNotifications?: boolean
  showUserProfile?: boolean
  onMenuItemClick?: (index: number) => void
}

export function MainLayout({
  children,
  title,
  userName,
  showNotifications,
  showUserProfile,
  onMenuItemClick
}: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Sidebar onMenuItemClick={onMenuItemClick} />
      <div className="ml-72">
        <Header 
          title={title}
          userName={userName}
          showNotifications={showNotifications}
          showUserProfile={showUserProfile}
        />
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  )
} 