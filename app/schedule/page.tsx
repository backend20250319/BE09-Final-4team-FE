"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientButton } from "@/components/ui/gradient-button"
import { colors, typography } from "@/lib/design-tokens"
import { useRouter } from "next/navigation"
import {
  Calendar,
  Users,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  ArrowRight,
} from "lucide-react"

export default function SchedulePage() {
  const router = useRouter()

  const scheduleOptions = [
    {
      id: "my",
      title: "내 근무 일정",
      description: "개인 근무 일정을 확인하고 관리하세요",
      icon: Calendar,
      color: colors.primary.blue,
      href: "/schedule/me",
      stats: {
        thisWeek: "40시간",
        thisMonth: "160시간",
        remaining: "8시간",
      },
    },
    {
      id: "team",
      title: "동료 근무 일정",
      description: "팀원들의 근무 현황을 한눈에 확인하세요",
      icon: Users,
      color: colors.status.info.gradient,
      href: "/schedule/coworker",
      stats: {
        totalMembers: "24명",
        workingToday: "22명",
        onVacation: "2명",
      },
    },
  ]

  const recentActivities = [
    {
      id: 1,
      type: "출근",
      time: "09:00",
      date: "오늘",
      status: "completed",
      icon: CheckCircle,
    },
    {
      id: 2,
      type: "점심시간",
      time: "12:00-13:00",
      date: "오늘",
      status: "completed",
      icon: CheckCircle,
    },
    {
      id: 3,
      type: "퇴근",
      time: "18:00",
      date: "오늘",
      status: "pending",
      icon: AlertCircle,
    },
    {
      id: 4,
      type: "연차 신청",
      time: "내일",
      date: "2025.07.26",
      status: "pending",
      icon: AlertCircle,
    },
  ]

  const workStats = [
    {
      title: "이번 주 근무시간",
      value: "32",
      unit: "시간",
      change: "+2",
      changeType: "increase",
      icon: Clock,
      color: colors.status.success.gradient,
    },
    {
      title: "이번 달 근무시간",
      value: "128",
      unit: "시간",
      change: "80%",
      changeType: "percentage",
      icon: TrendingUp,
      color: colors.primary.blue,
    },
    {
      title: "잔여 연차",
      value: "12",
      unit: "일",
      change: "-1",
      changeType: "decrease",
      icon: Calendar,
      color: colors.status.warning.gradient,
    },
  ]

  return (
    <MainLayout>
      {/* Page Title */}
      <div className="mb-8">
        <h1 className={`${typography.h1} text-gray-800 mb-2`}>근무 관리</h1>
        <p className="text-gray-600">근무 일정을 확인하고 관리하세요</p>
      </div>

      {/* Work Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {workStats.map((stat, index) => (
          <GlassCard key={index} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`text-sm font-medium ${
                stat.changeType === "increase" ? "text-green-600" :
                stat.changeType === "decrease" ? "text-red-600" :
                "text-blue-600"
              }`}>
                {stat.change}
              </div>
            </div>
            <div className="mb-2">
              <h3 className={`${typography.h4} text-gray-800 mb-1`}>{stat.title}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
                <span className="text-lg text-gray-600">{stat.unit}</span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Schedule Options */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {scheduleOptions.map((option) => (
          <GlassCard key={option.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push(option.href)}>
            <div className="flex items-start justify-between mb-6">
              <div
                className={`w-16 h-16 bg-gradient-to-r ${option.color} rounded-xl flex items-center justify-center shadow-lg`}
              >
                <option.icon className="w-8 h-8 text-white" />
              </div>
              <ArrowRight className="w-6 h-6 text-gray-400" />
            </div>
            <div className="mb-6">
              <h3 className={`${typography.h3} text-gray-800 mb-2`}>{option.title}</h3>
              <p className="text-gray-600 mb-4">{option.description}</p>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(option.stats).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="text-lg font-bold text-gray-800">{value}</div>
                    <div className="text-xs text-gray-500 capitalize">
                      {key === 'thisWeek' ? '이번 주' :
                       key === 'thisMonth' ? '이번 달' :
                       key === 'remaining' ? '잔여시간' :
                       key === 'totalMembers' ? '전체' :
                       key === 'workingToday' ? '출근' :
                       key === 'onVacation' ? '휴가' : key}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <GradientButton variant="primary" className="w-full">
              바로가기
            </GradientButton>
          </GlassCard>
        ))}
      </div>

      {/* Recent Activities */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className={`${typography.h3} text-gray-800`}>최근 활동</h3>
          <GradientButton variant="secondary" size="sm">
            전체보기
          </GradientButton>
        </div>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-4 p-4 rounded-lg bg-gray-50/50">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                activity.status === "completed" ? "bg-green-100" : "bg-yellow-100"
              }`}>
                <activity.icon className={`w-5 h-5 ${
                  activity.status === "completed" ? "text-green-600" : "text-yellow-600"
                }`} />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-800">{activity.type}</div>
                <div className="text-sm text-gray-600">{activity.time}</div>
              </div>
              <div className="text-sm text-gray-500">{activity.date}</div>
            </div>
          ))}
        </div>
      </GlassCard>
    </MainLayout>
  )
} 