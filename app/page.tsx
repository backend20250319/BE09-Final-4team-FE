"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientButton } from "@/components/ui/gradient-button"
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
} from "lucide-react"

export default function DashboardPage() {
  const stats = [
    {
      title: "전체 구성원",
      value: "24",
      unit: "명",
      change: "+2",
      changeType: "increase",
      icon: Users,
      color: colors.primary.blue,
    },
    {
      title: "오늘 출근",
      value: "22",
      unit: "명",
      change: "91.7%",
      changeType: "percentage",
      icon: Clock,
      color: colors.status.success.gradient,
    },
    {
      title: "이번 주 휴가",
      value: "8",
      unit: "건",
      change: "-3",
      changeType: "decrease",
      icon: Calendar,
      color: colors.status.warning.gradient,
    },
    {
      title: "대기 결재",
      value: "5",
      unit: "건",
      change: "+1",
      changeType: "increase",
      icon: FileText,
      color: colors.status.info.gradient,
    },
  ]

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

  return (
    <MainLayout>
      {/* Page Title */}
      <div className="mb-8">
        <h1 className={`${typography.h1} text-gray-800 mb-2`}>대시보드</h1>
        <p className="text-gray-600">오늘의 업무 현황을 한눈에 확인하세요</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className={`${typography.h3} text-gray-800`}>알림</h3>
            <GradientButton variant="secondary" size="sm">
              전체보기
            </GradientButton>
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