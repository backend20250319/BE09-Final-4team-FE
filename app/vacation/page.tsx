"use client"

import { useState } from "react"
import {
  Bell,
  User,
  Calendar,
  Users,
  Settings,
  FileText,
  Megaphone,
  ClipboardList,
  Briefcase,
  Home,
  Plus,
  CalendarDays,
  Gift,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MainLayout } from "@/components/layout/main-layout"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientButton } from "@/components/ui/gradient-button"
import { colors, typography } from "@/lib/design-tokens"

export default function VacationPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("2025.07~2025.09")

  const vacationStats = [
    {
      title: "기본 연차",
      count: 12,
      unit: "일",
      description: "3일 사용됨",
      icon: CalendarDays,
      color: colors.primary.blue,
      bgColor: colors.primary.blueLight,
      textColor: colors.primary.blueText,
    },
    {
      title: "관리자 지급 연차",
      count: 4,
      unit: "일",
      description: "1일 사용됨",
      icon: Gift,
      color: colors.status.success.gradient,
      bgColor: colors.status.success.bg,
      textColor: colors.status.success.text,
    },
    {
      title: "특수 연차",
      count: 1,
      unit: "일",
      description: "0일 사용됨",
      icon: Star,
      color: colors.status.warning.gradient,
      bgColor: colors.status.warning.bg,
      textColor: colors.status.warning.text,
    },
  ]

  const vacationRecords = [
    {
      id: 1,
      type: "연차",
      startDate: "2025.08.01",
      endDate: "2025.08.01",
      days: 1,
      reason: "[2025-08-01] 연차 사용 신청합니다.",
      status: "승인됨",
      statusColor: colors.status.info.bg + " " + colors.status.info.text + " " + colors.status.info.border,
    },
    {
      id: 2,
      type: "연차",
      startDate: "2025.08.05",
      endDate: "2025.08.05",
      days: 1,
      reason: "[2025-08-05] 개인 사정으로 인한 연차 신청",
      status: "대기중",
      statusColor: colors.status.warning.bg + " " + colors.status.warning.text + " " + colors.status.warning.border,
    },
    {
      id: 3,
      type: "연차",
      startDate: "2025.07.28",
      endDate: "2025.07.28",
      days: 1,
      reason: "[2025-07-28] 병원 진료로 인한 연차 신청",
      status: "승인됨",
      statusColor: colors.status.info.bg + " " + colors.status.info.text + " " + colors.status.info.border,
    },
    {
      id: 4,
      type: "연차",
      startDate: "2025.07.15",
      endDate: "2025.07.16",
      days: 2,
      reason: "[2025-07-15] 여행 계획으로 인한 연차 신청",
      status: "반려됨",
      statusColor: colors.status.error.bg + " " + colors.status.error.text + " " + colors.status.error.border,
    },
    {
      id: 5,
      type: "반차",
      startDate: "2025.07.10",
      endDate: "오후",
      days: 0.5,
      reason: "[2025-07-10] 오후 개인 업무 처리",
      status: "승인됨",
      statusColor: colors.status.info.bg + " " + colors.status.info.text + " " + colors.status.info.border,
    },
    {
      id: 6,
      type: "연차",
      startDate: "2025.07.03",
      endDate: "2025.07.03",
      days: 1,
      reason: "[2025-07-03] 가족 행사 참석",
      status: "승인됨",
      statusColor: colors.status.info.bg + " " + colors.status.info.text + " " + colors.status.info.border,
    },
  ]

  return (
    <MainLayout>
      {/* Page Title */}
      <div className="mb-8">
        <h2 className={`${typography.h1} text-gray-800 mb-2`}>휴가 통계</h2>
        <p className="text-gray-600">나의 휴가 현황을 확인하고 관리하세요</p>
      </div>

      {/* Vacation Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {vacationStats.map((stat, index) => (
          <GlassCard key={index} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`px-3 py-1 bg-gradient-to-r ${stat.bgColor} rounded-full`}>
                <span className={`text-xs font-medium ${stat.textColor}`}>{stat.description}</span>
              </div>
            </div>
            <div className="mb-2">
              <h3 className={`${typography.h4} text-gray-800 mb-1`}>{stat.title}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-900">{stat.count}</span>
                <span className="text-lg text-gray-600">{stat.unit}</span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Vacation Records Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className={`${typography.h2} text-gray-800`}>휴가 기록</h3>
          <div className="flex items-center gap-4">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48 bg-white/60 backdrop-blur-sm border-gray-200/50 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025.07~2025.09">2025.07~2025.09</SelectItem>
                <SelectItem value="2025.04~2025.06">2025.04~2025.06</SelectItem>
                <SelectItem value="2025.01~2025.03">2025.01~2025.03</SelectItem>
              </SelectContent>
            </Select>
            <GradientButton variant="primary">
              <Plus className="w-4 h-4 mr-2" />
              휴가 신청
            </GradientButton>
          </div>
        </div>

        {/* Vacation Records Table */}
        <GlassCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-gray-100/50">
                  <th className="text-left p-4 font-semibold text-gray-700">구분</th>
                  <th className="text-left p-4 font-semibold text-gray-700">기간</th>
                  <th className="text-left p-4 font-semibold text-gray-700">일수</th>
                  <th className="text-left p-4 font-semibold text-gray-700">사유</th>
                  <th className="text-left p-4 font-semibold text-gray-700">상태</th>
                </tr>
              </thead>
              <tbody>
                {vacationRecords.map((record) => (
                  <tr key={record.id} className="border-b border-gray-200/30 hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <span className="px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-full text-sm font-medium">
                        {record.type}
                      </span>
                    </td>
                    <td className="p-4 text-gray-700">
                      <div className="flex items-center gap-2">
                        <span>{record.startDate}</span>
                        {record.endDate !== record.startDate && (
                          <>
                            <span>~</span>
                            <span>{record.endDate}</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-gray-700 font-medium">{record.days}일</td>
                    <td className="p-4 text-gray-600 max-w-xs truncate">{record.reason}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${record.statusColor}`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </MainLayout>
  )
}
