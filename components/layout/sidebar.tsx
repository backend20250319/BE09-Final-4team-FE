"use client"

import { Button } from "@/components/ui/button"
import { LucideIcon } from "lucide-react"
import { defaultMenuItems, MenuItem } from "@/lib/navigation"
import { useRouter, usePathname } from "next/navigation"
import {
  Home,
  Users,
  Briefcase,
  Calendar,
  Megaphone,
  ClipboardList,
  FileText,
  Settings,
} from "lucide-react"

// 아이콘 매핑
const iconMap: Record<string, LucideIcon> = {
  Home,
  Users,
  Briefcase,
  Calendar,
  Megaphone,
  ClipboardList,
  FileText,
  Settings,
}

interface SidebarProps {
  onMenuItemClick?: (index: number) => void
}

export function Sidebar({ onMenuItemClick }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleMenuClick = (item: MenuItem, index: number) => {
    if (item.href) {
      router.push(item.href)
    }
    onMenuItemClick?.(index)
  }

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="fixed left-0 top-0 h-full w-72 bg-white/80 backdrop-blur-xl shadow-xl border-r border-gray-200/50">
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white text-sm font-bold">HR</span>
          </div>
          <span className="font-bold text-xl text-gray-800">HR System</span>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {defaultMenuItems.map((item, index) => {
            const IconComponent = iconMap[item.icon]
            const active = isActive(item.href || "")
            
            return (
              <Button
                key={index}
                variant={active ? "default" : "ghost"}
                className={`w-full justify-start h-12 text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
                }`}
                onClick={() => handleMenuClick(item, index)}
              >
                <IconComponent className="w-5 h-5 mr-3" />
                {item.label}
              </Button>
            )
          })}
        </nav>
      </div>

      {/* Company Info */}
      <div className="absolute bottom-6 left-6">
        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200/50">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">C</span>
          </div>
          <span className="text-sm font-medium text-gray-700">Company</span>
        </div>
      </div>
    </div>
  )
} 