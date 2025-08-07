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
import Image from "next/image"
import { Separator } from "@/components/ui/separator"

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
  isOpen?: boolean
  isMobile?: boolean
  onClose?: () => void
}

export function Sidebar({ onMenuItemClick, isOpen = true, isMobile = false, onClose }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleMenuClick = (item: MenuItem, index: number) => {
    if (item.href) {
      router.push(item.href)
    }
    onMenuItemClick?.(index)
    // 모바일에서 메뉴 클릭 시 사이드바 닫기
    if (isMobile) {
      onClose?.()
    }
  }

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  return (
    <div className={`fixed left-0 top-0 h-full bg-white/80 backdrop-blur-xl shadow-xl border-r border-gray-200/50 transition-all duration-300 ${
      isMobile 
        ? `w-80 z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`
        : `w-72 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`
    }`}>
      <div className="p-4 sm:p-6">
        {/* Hermes Logo */}
        <div className="flex flex-col items-center mb-6">
          <span className="mt-2 text-xl sm:text-2xl font-extrabold text-gray-800 tracking-wide">Hermes</span>
        </div>
        {/* Company Info */}
        <div className="flex items-center gap-3 mb-6 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200/50">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">C</span>
          </div>
          <span className="text-sm font-medium text-gray-700">Company</span>
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
                className={`w-full justify-start h-12 text-sm font-medium transition-all duration-200 cursor-pointer ${
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
    </div>
  )
} 