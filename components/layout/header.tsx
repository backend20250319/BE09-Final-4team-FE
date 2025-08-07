"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Bell, User, Menu, LogOut, Settings, User as UserIcon } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/use-auth"
import ProfileModal from '@/app/members/components/ProfileModal'

interface Employee {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  joinDate: string
  organization: string
  position: string
  role: string
  job: string
  rank?: string
  isAdmin: boolean
  teams: string[]
  profileImage?: string
  selfIntroduction?: string
  remainingLeave?: number
  weeklyWorkHours?: number
  weeklySchedule?: Array<{
    title: string
    date: string
    time?: string
  }>
}

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
  const { user, logout } = useAuth()
  const [employeeData, setEmployeeData] = useState<Employee | null>(null)
  const [showProfileModal, setShowProfileModal] = useState(false)

  useEffect(() => {
    if (user?.email) {
      fetch('/api/members')
        .then(response => response.json())
        .then(data => {
          if (data.success && data.members) {
            const employee = data.members.find((emp: Employee) => emp.email === user.email)
            setEmployeeData(employee || null)
          }
        })
        .catch(error => {
          console.error('직원 데이터 로드 오류:', error)
        })
    }
  }, [user])

  useEffect(() => {
    const handleEmployeeUpdate = (event: CustomEvent) => {
      const updatedEmployee = event.detail
      if (updatedEmployee.email === user?.email) {
        setEmployeeData(updatedEmployee)
      }
    }

    window.addEventListener('employeeUpdated', handleEmployeeUpdate as EventListener)
    
    return () => {
      window.removeEventListener('employeeUpdated', handleEmployeeUpdate as EventListener)
    }
  }, [user?.email])

  const displayName = employeeData?.name || user?.name || userName
  const displayEmail = user?.email || ''

  const handleMyProfileClick = () => {
    setShowProfileModal(true)
  }

  const handleProfileModalClose = () => {
    setShowProfileModal(false)
  }

  const handleProfileUpdate = (updatedEmployee: Employee) => {
    setEmployeeData(updatedEmployee)
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-4 sm:px-6 lg:px-8 py-2 sticky top-0 z-40">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
                     {onToggleSidebar && (
             <Button 
               variant="ghost" 
               size="sm" 
               onClick={onToggleSidebar}
               className="hover:bg-gray-100/80 transition-colors cursor-pointer"
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                                 <Button 
                   variant="ghost" 
                   className="flex items-center gap-3 p-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:bg-gray-200/80 transition-colors cursor-pointer"
                 >
                  <div className="w-9 h-9 rounded-full flex items-center justify-center shadow-sm overflow-hidden bg-transparent">
                    {employeeData?.profileImage ? (
                      <img 
                        src={employeeData.profileImage} 
                        alt={displayName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{displayName}</span>
                </Button>
              </DropdownMenuTrigger>
                             <DropdownMenuContent align="end" className="w-72 z-50 bg-white/95 backdrop-blur-xl border border-gray-100 shadow-2xl rounded-2xl p-4">
                 {/* 프로필 헤더 */}
                 <div className="flex items-center gap-4 p-4 mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                   <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden ring-2 ring-white shadow-lg">
                     {employeeData?.profileImage ? (
                       <img 
                         src={employeeData.profileImage} 
                         alt={displayName}
                         className="w-full h-full object-cover"
                       />
                     ) : (
                       <div className="w-full h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                         <User className="w-6 h-6 text-white" />
                       </div>
                     )}
                   </div>
                   <div className="flex flex-col">
                     <p className="text-sm font-semibold text-gray-900 leading-tight">{displayName}</p>
                     <p className="text-xs text-gray-500 leading-tight">{displayEmail}</p>
                     {employeeData && (
                       <div className="flex items-center gap-1 mt-1">
                         <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                         <p className="text-xs text-gray-600">{employeeData.position} • {employeeData.organization}</p>
                       </div>
                     )}
                   </div>
                 </div>

                 {/* 메뉴 아이템들 */}
                 <div className="space-y-2">
                   <DropdownMenuItem 
                     onClick={handleMyProfileClick} 
                     className="flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 cursor-pointer transition-all duration-200 group"
                   >
                     <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                       <UserIcon className="w-4 h-4 text-white" />
                     </div>
                     <div className="flex flex-col">
                       <span className="text-sm font-medium text-gray-900">내 프로필</span>
                       <span className="text-xs text-gray-500">프로필 정보 관리</span>
                     </div>
                   </DropdownMenuItem>
                   
                   <DropdownMenuItem 
                     onClick={logout} 
                     className="flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 cursor-pointer transition-all duration-200 group"
                   >
                     <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                       <LogOut className="w-4 h-4 text-white" />
                     </div>
                     <div className="flex flex-col">
                       <span className="text-sm font-medium text-gray-900">로그아웃</span>
                       <span className="text-xs text-gray-500">계정에서 로그아웃</span>
                     </div>
                   </DropdownMenuItem>
                 </div>
               </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* 프로필 모달 */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={handleProfileModalClose}
        employee={employeeData}
        onUpdate={handleProfileUpdate}
      />
    </div>
  )
} 