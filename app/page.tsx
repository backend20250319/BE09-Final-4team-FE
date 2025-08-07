"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientButton } from "@/components/ui/gradient-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { colors, typography } from "@/lib/design-tokens"
import {
  Users,
  Calendar,
  Clock,
  TrendingUp,
  Bell,
  FileText,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Globe,
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  Crown,
  Shield,
  Timer,
  CheckCircle2,
  XCircle,
  ExternalLink,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from 'sonner'

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
}

interface AttendanceState {
  checkInTime: string | null
  checkOutTime: string | null
  isCheckedIn: boolean
  isCheckedOut: boolean
  lastCheckInDate: string | null
}

export default function DashboardPage() {
  const router = useRouter()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [totalEmployees, setTotalEmployees] = useState(0)
  const [todayAttendance, setTodayAttendance] = useState(0)
  const [thisWeekVacation, setThisWeekVacation] = useState(0)
  const [pendingApprovals, setPendingApprovals] = useState(0)
  const [isAdmin, setIsAdmin] = useState(true) // 관리자 모드로 설정
  const [currentTime, setCurrentTime] = useState('')
  const [currentIP, setCurrentIP] = useState('')
  const [attendanceState, setAttendanceState] = useState<AttendanceState>({
    checkInTime: null,
    checkOutTime: null,
    isCheckedIn: false,
    isCheckedOut: false,
    lastCheckInDate: null
  })

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }))
    }
    
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const getIP = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json')
        const data = await response.json()
        setCurrentIP(data.ip)
      } catch (error) {
        setCurrentIP('123.456.789.123')
      }
    }
    
    getIP()
  }, [])

  useEffect(() => {
    const today = new Date().toDateString()
    if (attendanceState.lastCheckInDate && attendanceState.lastCheckInDate !== today) {
      setAttendanceState({
        checkInTime: null,
        checkOutTime: null,
        isCheckedIn: false,
        isCheckedOut: false,
        lastCheckInDate: null
      })
    }
  }, [attendanceState.lastCheckInDate])

  useEffect(() => {
    const savedEmployees = localStorage.getItem('employees')
    if (savedEmployees) {
      const parsedEmployees = JSON.parse(savedEmployees)
      setEmployees(parsedEmployees)
      setTotalEmployees(parsedEmployees.length)
      
      setTodayAttendance(Math.round(parsedEmployees.length * 0.9))
      
      setThisWeekVacation(3)
      
      setPendingApprovals(2)
    }
  }, [])

     const [showNotification, setShowNotification] = useState(false)
   const [notificationMessage, setNotificationMessage] = useState('')

   const handleCheckIn = () => {
     const now = new Date()
     const checkInTime = now.toLocaleTimeString('ko-KR', { 
       hour: '2-digit', 
       minute: '2-digit',
       hour12: false 
     })
     
     setAttendanceState({
       ...attendanceState,
       checkInTime,
       isCheckedIn: true,
       lastCheckInDate: now.toDateString()
     })
     
     setNotificationMessage('출근이 기록되었습니다!')
     setShowNotification(true)
     setTimeout(() => setShowNotification(false), 3000)
   }

   const handleCheckOut = () => {
     const now = new Date()
     const checkOutTime = now.toLocaleTimeString('ko-KR', { 
       hour: '2-digit', 
       minute: '2-digit',
       hour12: false 
     })
     
     setAttendanceState({
       ...attendanceState,
       checkOutTime,
       isCheckedOut: true
     })
     
     setNotificationMessage('퇴근이 기록되었습니다!')
     setShowNotification(true)
     setTimeout(() => setShowNotification(false), 3000)
   }

  const employeeData = {
    approvalStats: [
      { title: '내가 결재해야 할 문서', count: 3, status: 'pending', bgColor: '#FFF5CC', textColor: '#EA580C' },
      { title: '내가 신청한 문서', count: 2, status: 'submitted', bgColor: '#E3F0FF', textColor: '#007BFF' },
      { title: '결재 완료된 문서', count: 5, status: 'completed', bgColor: '#E8FFF2', textColor: '#00C56B' },
      { title: '반려된 문서', count: 1, status: 'rejected', bgColor: '#FFE8E8', textColor: '#FF4D4F' }
    ],

    leaveData: {
      remaining: 12,
      total: 15,
      used: 3
    },

    workHoursData: {
      weekly: 42,
      dailyAverage: 8.4,
      overtime: 2
    },

    notices: [
      { title: '2025년 하반기 인사발령', date: '2025.08.01', borderColor: '#007BFF', bgColor: '#EEF6FC' },
      { title: '여름 휴가 신청 안내', date: '2025.07.30', borderColor: '#00C56B', bgColor: '#E8FFF2' },
      { title: '사무실 이전 공지', date: '2025.07.28', borderColor: '#8F8F8F', bgColor: '#F9FAFB' }
    ]
  }

  const adminData = {
    attendanceStats: [
      {
        title: '출근',
        value: '1,004',
        total: '1056',
        unit: 'people',
        icon: Users,
        backgroundColor: '#E8FFF2',
        iconColor: '#00C56B'
      },
      {
        title: '지각',
        value: '4',
        unit: 'people',
        icon: Clock,
        backgroundColor: '#FFF5CC',
        iconColor: '#FF4D4F'
      },
      {
        title: '휴가',
        value: '21',
        unit: 'people',
        icon: Calendar,
        backgroundColor: '#E3F0FF',
        iconColor: '#00A8F7'
      }
    ],

    approvalStats: [
      { title: '결재 대기 문서', count: 8, status: 'pending', bgColor: '#FFF5CC', textColor: '#EA580C' },
      { title: '결재 진행 문서', count: 12, status: 'in-progress', bgColor: '#E3F0FF', textColor: '#007BFF' },
      { title: '결재 완료 문서', count: 25, status: 'completed', bgColor: '#E8FFF2', textColor: '#00C56B' },
      { title: '반려된 문서', count: 3, status: 'rejected', bgColor: '#FFE8E8', textColor: '#FF4D4F' }
    ],

    notices: [
      { title: '2025년 하반기 인사발령', date: '2025.08.01', borderColor: '#007BFF', bgColor: '#EEF6FC' },
      { title: '여름 휴가 신청 안내', date: '2025.07.30', borderColor: '#00C56B', bgColor: '#E8FFF2' },
      { title: '사무실 이전 공지', date: '2025.07.28', borderColor: '#8F8F8F', bgColor: '#F9FAFB' }
    ],

    news: [
      { title: '2025년 최저임금 인상률 확정', source: '경제신문', time: '1시간 전', url: 'https://news.example.com/1' },
      { title: '원격근무 확대 정책 발표', source: 'IT뉴스', time: '3시간 전', url: 'https://news.example.com/2' },
      { title: '직장 내 괴롭힘 방지법 개정', source: '법률신문', time: '5시간 전', url: 'https://news.example.com/3' }
    ]
  }

  const recentActivities = [
    {
      id: 1,
      type: "출근",
      user: "김철수",
      time: "09:00",
      status: "success",
      icon: CheckCircle,
    },
    {
      id: 2,
      type: "휴가 신청",
      user: "이영희",
      time: "08:45",
      status: "pending",
      icon: AlertCircle,
    },
    {
      id: 3,
      type: "퇴근",
      user: "박민수",
      time: "18:30",
      status: "success",
      icon: CheckCircle,
    },
    {
      id: 4,
      type: "결재 승인",
      user: "최지영",
      time: "17:15",
      status: "success",
      icon: CheckCircle,
    },
  ]

  const notifications = [
    {
      id: 1,
      title: "월말 보고서 제출 안내",
      content: "7월 월말 보고서를 31일까지 제출해주세요.",
      time: "2시간 전",
      unread: true,
    },
    {
      id: 2,
      title: "새로운 공지사항",
      content: "8월 팀 워크샵 일정이 확정되었습니다.",
      time: "4시간 전",
      unread: true,
    },
    {
      id: 3,
      title: "시스템 점검 안내",
      content: "오늘 밤 12시부터 2시간간 시스템 점검이 예정되어 있습니다.",
      time: "1일 전",
      unread: false,
    },
  ]

  const currentDate = new Date()
  const dayString = currentDate.toLocaleDateString('ko-KR', { weekday: 'short' })
  const monthString = currentDate.toLocaleDateString('ko-KR', { month: 'long' })
  const yearString = currentDate.getFullYear()
  const dayNumber = currentDate.getDate()

     return (
     <MainLayout requireAuth={false}>
       {/* 상단 중앙 알림 */}
       {showNotification && (
         <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
           <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fadeInDown">
             <CheckCircle2 className="w-5 h-5" />
             <span className="font-medium">{notificationMessage}</span>
           </div>
         </div>
       )}
       
       {/* Header with date */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h1 className={`${typography.h1} text-gray-800`}>대시보드</h1>
            <div className="flex items-center gap-2 text-gray-600">
              <span className="text-lg font-semibold">{monthString}</span>
              <span className="text-lg font-semibold">{dayNumber}일</span>
              <span className="text-lg font-semibold">{dayString}요일</span>
              <span className="text-lg font-semibold">{yearString}년</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">
              {isAdmin ? '관리자' : '일반 직원'}
            </span>
          </div>
        </div>
        <p className="text-gray-600">오늘의 업무 현황을 한눈에 확인하세요</p>
      </div>

      {/* 관리자 전용 통계 카드 */}
      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {adminData.attendanceStats.map((metric, index) => (
            <GlassCard key={index} className="p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 animate-fadeInUp" style={{ animationDelay: `${0.1 + index * 0.1}s` }}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: metric.iconColor }}>
                  <metric.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">{metric.title}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold" style={{ color: metric.iconColor }}>
                      {metric.total ? `${metric.value} / ${metric.total}` : metric.value}
                    </span>
                    <span className="text-sm text-gray-600">{metric.unit}</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* 공통 카드들 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 출퇴근 Card */}
        <GlassCard className="p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-gray-900">출퇴근</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">{currentTime}</div>
              <div className="text-sm text-gray-500">IP: {currentIP}</div>
            </div>
                         <div className="flex gap-2">
               <Button 
                 className="flex-1 bg-green-600 hover:bg-green-700 cursor-pointer"
                 onClick={handleCheckIn}
                 disabled={attendanceState.isCheckedIn}
               >
                 {attendanceState.isCheckedIn ? (
                   <CheckCircle2 className="w-4 h-4 mr-2" />
                 ) : (
                   <Timer className="w-4 h-4 mr-2" />
                 )}
                 출근 {attendanceState.checkInTime || currentTime}
               </Button>
               <Button 
                 className="flex-1 bg-red-600 hover:bg-red-700 cursor-pointer"
                 onClick={handleCheckOut}
                 disabled={!attendanceState.isCheckedIn || attendanceState.isCheckedOut}
               >
                 {attendanceState.isCheckedOut ? (
                   <CheckCircle2 className="w-4 h-4 mr-2" />
                 ) : (
                   <XCircle className="w-4 h-4 mr-2" />
                 )}
                 퇴근 {attendanceState.checkOutTime || (attendanceState.isCheckedIn ? currentTime : '')}
               </Button>
             </div>
          </CardContent>
        </GlassCard>

        {/* 이번 주 근로시간 Card */}
        <GlassCard className="p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-gray-900">이번 주 근로시간</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
              <div className="text-3xl font-bold mb-2">{employeeData.workHoursData.weekly}h</div>
              <div className="text-sm opacity-90">이번 주 근무시간</div>
            </div>
            <div className="flex justify-center gap-6 text-sm text-gray-600">
              <span>일 평균 {employeeData.workHoursData.dailyAverage}h</span>
              <span className="text-red-600 font-medium">초과근무 {employeeData.workHoursData.overtime}h</span>
            </div>
          </CardContent>
        </GlassCard>

        {/* 나의 연차 Card */}
        <GlassCard className="p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-gray-900">나의 연차</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <div className="text-3xl font-bold mb-2">{employeeData.leaveData.remaining}일</div>
              <div className="text-sm opacity-90">남은 연차</div>
            </div>
            <div className="flex justify-center gap-6 text-sm text-gray-600">
              <span>총 연차 {employeeData.leaveData.total}일</span>
              <span>사용 연차 {employeeData.leaveData.used}일</span>
            </div>
          </CardContent>
        </GlassCard>

                                                                       {/* 결재 Card */}
           <GlassCard className="p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
             <CardHeader className="pb-4">
               <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                 <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                 결재
               </CardTitle>
             </CardHeader>
             <CardContent className="space-y-2">
               {(isAdmin ? adminData.approvalStats : employeeData.approvalStats).map((item, index) => (
                 <div key={index} className="group relative overflow-hidden rounded-xl p-4 transition-all duration-300 hover:shadow-md" style={{ backgroundColor: item.bgColor }}>
                   <div className="flex items-center justify-between">
                     <div className="flex-1">
                       <h4 className="font-medium text-gray-800 text-sm leading-tight group-hover:text-gray-900 transition-colors">
                         {item.title}
                       </h4>
                     </div>
                     <div className="flex items-center gap-1">
                       <span className="text-xl font-bold" style={{ color: item.textColor }}>
                         {item.count}
                       </span>
                       <span className="text-xs text-gray-500 font-medium">건</span>
                     </div>
                   </div>
                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                 </div>
               ))}
             </CardContent>
           </GlassCard>

                                     {/* 뉴스 Card */}
            <GlassCard className="p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  뉴스
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {adminData.news.map((item, index) => (
                  <a
                    key={index}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block overflow-hidden rounded-xl p-4 transition-all duration-300 hover:shadow-md hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-800 text-sm leading-tight group-hover:text-blue-700 transition-colors line-clamp-2 mb-2">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-medium text-gray-500 bg-white/80 px-2 py-1 rounded-full">
                            {item.source}
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">{item.time}</span>
                        </div>
                      </div>
                                             <div className="flex-shrink-0 ml-3">
                         <ExternalLink className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                       </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </a>
                ))}
              </CardContent>
            </GlassCard>

                     {/* 공지 Card */}
           <GlassCard className="p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
             <CardHeader className="pb-4">
               <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                 <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                 공지
               </CardTitle>
             </CardHeader>
             <CardContent className="space-y-2">
               {(isAdmin ? adminData.notices : employeeData.notices).map((item, index) => (
                 <div key={index} className="group relative block overflow-hidden rounded-xl p-4 transition-all duration-300 hover:shadow-md hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-indigo-50/50">
                   <div className="flex items-start justify-between">
                     <div className="flex-1 min-w-0">
                       <h4 className="font-medium text-gray-800 text-sm leading-tight group-hover:text-purple-700 transition-colors line-clamp-2 mb-2">
                         {item.title}
                       </h4>
                       <div className="flex items-center gap-3">
                         <span className="text-xs font-medium text-gray-500 bg-white/80 px-2 py-1 rounded-full">
                           {item.date}
                         </span>
                       </div>
                     </div>
                   </div>
                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                 </div>
               ))}
             </CardContent>
           </GlassCard>
      </div>

             {/* 최근 활동 및 알림 - 모든 사용자에게 표시 */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
         {/* Recent Activities */}
         <GlassCard className="p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 animate-fadeInUp" style={{ animationDelay: '0.7s' }}>
           <div className="mb-6">
             <h3 className={`${typography.h3} text-gray-800`}>최근 활동</h3>
           </div>
           <div className="space-y-4">
             {recentActivities.map((activity) => (
               <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50/50">
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                   activity.status === "success" ? "bg-green-100" : "bg-yellow-100"
                 }`}>
                   <activity.icon className={`w-5 h-5 ${
                     activity.status === "success" ? "text-green-600" : "text-yellow-600"
                   }`} />
                 </div>
                 <div className="flex-1">
                   <div className="font-medium text-gray-800">{activity.type}</div>
                   <div className="text-sm text-gray-600">{activity.user}</div>
                 </div>
                 <div className="text-sm text-gray-500">{activity.time}</div>
               </div>
             ))}
           </div>
         </GlassCard>

         {/* Notifications */}
         <GlassCard className="p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 animate-fadeInUp" style={{ animationDelay: '0.8s' }}>
           <div className="mb-6">
             <h3 className={`${typography.h3} text-gray-800`}>알림</h3>
           </div>
           <div className="space-y-4">
             {notifications.map((notification) => (
               <div key={notification.id} className={`p-4 rounded-lg border ${
                 notification.unread ? "bg-blue-50/50 border-blue-200" : "bg-gray-50/50 border-gray-200"
               }`}>
                 <div className="flex items-start justify-between mb-2">
                   <h4 className={`font-medium ${notification.unread ? "text-blue-800" : "text-gray-800"}`}>
                     {notification.title}
                   </h4>
                   {notification.unread && (
                     <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                   )}
                 </div>
                 <p className="text-sm text-gray-600 mb-2">{notification.content}</p>
                 <div className="text-xs text-gray-500">{notification.time}</div>
               </div>
             ))}
           </div>
         </GlassCard>
       </div>
    </MainLayout>
  )
} 