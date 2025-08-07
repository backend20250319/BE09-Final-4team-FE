"use client"

import { useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MainLayout } from "@/components/layout/main-layout"
import { TabGroup } from "@/components/ui/tab-group"
import { DateNavigation } from "@/components/ui/date-navigation"
import { GlassCard } from "@/components/ui/glass-card"
import { colors } from "@/lib/design-tokens"

export default function ScheduleMePage() {
  const [currentWeek, setCurrentWeek] = useState("2025-07-25 ~ 2025-07-31")
  const [activeTab, setActiveTab] = useState("my")

  const weekDays = [
    { date: 25, day: "금", isWeekend: true },
    { date: 26, day: "토", isWeekend: true },
    { date: 27, day: "일", isWeekend: true },
    { date: 28, day: "월", isWeekend: false },
    { date: 29, day: "화", isWeekend: false },
    { date: 30, day: "수", isWeekend: false },
    { date: 31, day: "목", isWeekend: false },
  ]

  const scheduleData: Record<number, Array<{
    time?: string
    title: string
    color: string
  }>> = {
    25: [
      {
        time: "10:00",
        title: "팀 회의",
        color: colors.schedule.meeting,
      },
    ],
    26: [
      {
        time: "14:00",
        title: "프로젝트 검토",
        color: colors.schedule.project,
      },
    ],
    27: [
      {
        time: "09:00",
        title: "교육 참석",
        color: colors.schedule.education,
      },
      {
        time: "15:30",
        title: "고객 미팅",
        color: colors.schedule.customer,
      },
    ],
    28: [
      {
        time: "11:00",
        title: "월말 보고",
        color: colors.schedule.report,
      },
    ],
    29: [{ title: "휴가", color: colors.schedule.vacation }],
    30: [{ title: "휴가", color: colors.schedule.vacation }],
    31: [
      {
        title: "업무 복귀",
        color: colors.schedule.return,
      },
    ],
  }

  const tabs = [
    { id: "my", label: "내 근무 일정", icon: <Calendar className="w-4 h-4" /> },
    { id: "team", label: "동료 근무 일정", icon: <Users className="w-4 h-4" /> },
  ]

  const handlePreviousWeek = () => {
  }

  const handleNextWeek = () => {
  }

  return (
    <MainLayout>
      {/* Tabs */}
      <TabGroup 
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="mb-8"
      />

      {/* Date Navigation */}
      <DateNavigation
        currentPeriod={currentWeek}
        onPrevious={handlePreviousWeek}
        onNext={handleNextWeek}
        className="mb-8"
      />

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-6">
        {weekDays.map((day) => (
          <GlassCard
            key={day.date}
            className={`p-6 min-h-[280px] ${
              day.isWeekend ? "bg-gradient-to-br from-red-50/50 to-pink-50/50" : ""
            }`}
          >
            <div className="text-center mb-6">
              <div className={`text-3xl font-bold mb-1 ${day.isWeekend ? "text-red-600" : "text-gray-800"}`}>
                {day.date}
              </div>
              <div className={`text-sm font-medium ${day.isWeekend ? "text-red-500" : "text-gray-500"}`}>
                {day.day}요일
              </div>
            </div>

            <div className="space-y-3">
              {scheduleData[day.date]?.map((item, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-xl border text-xs font-medium transition-all duration-200 hover:scale-105 cursor-pointer ${item.color}`}
                >
                  {item.time && <div className="font-bold mb-1 text-xs opacity-80">{item.time}</div>}
                  <div className="font-semibold">{item.title}</div>
                </div>
              ))}
            </div>
          </GlassCard>
        ))}
      </div>
    </MainLayout>
  )
}
