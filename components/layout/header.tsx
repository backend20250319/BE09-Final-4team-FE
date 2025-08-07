"use client"

import { Button } from "@/components/ui/button"
import { Bell, User, Menu } from "lucide-react"

interface HeaderProps {
  userName?: string
  showNotifications?: boolean
  showUserProfile?: boolean
  onToggleSidebar?: () => void
  isMobile?: boolean
}

export function Header({ 
  userName = "김인사",
  showNotifications = true,
  showUserProfile = true,
  onToggleSidebar,
  isMobile = false
}: HeaderProps) {
  return (
    <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-4 sm:px-6 lg:px-8 py-2 sticky top-0 z-10">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          {onToggleSidebar && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onToggleSidebar}
              className="hover:bg-gray-100/80 transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-500" />
            </Button>
          )}
        </div>
        <div className="flex items-center gap-3 sm:gap-6">
          {showNotifications && (
            <Button variant="ghost" size="sm" className="relative hover:bg-gray-100/80 transition-colors">
              <Bell className="w-5 h-5 text-gray-500" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </Button>
          )}
          {showUserProfile && (
            <div className="flex items-center gap-2 sm:gap-3 p-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200/50">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-sm">
                <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-700 hidden sm:block">{userName}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 