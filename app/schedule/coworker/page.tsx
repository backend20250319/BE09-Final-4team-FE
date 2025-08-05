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
  Search,
  Mail,
  Phone,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MainLayout } from "@/components/layout/main-layout"
import { TabGroup } from "@/components/ui/tab-group"
import { DateNavigation } from "@/components/ui/date-navigation"
import { GlassCard } from "@/components/ui/glass-card"
import { colors } from "@/lib/design-tokens"

export default function CoworkerSchedulePage() {
  const [currentWeek, setCurrentWeek] = useState("2025-07-25 ~ 2025-07-31")
  const [activeTab, setActiveTab] = useState("team")
  const [selectedEmployee, setSelectedEmployee] = useState("all")

  const employees = [
    {
      id: "ceo",
      name: "비니비니",
      position: "CEO",
      email: "binibini@binslab.com",
      phone: "010-1234-5678",
      team: "CEO",
      avatar: "🎯",
      color: colors.employee.ceo,
    },
    {
      id: "gguni",
      name: "꾸니",
      position: "주니어 개발자",
      email: "gguni@binslab.com",
      phone: "010-1234-5678",
      team: "Application Team",
      avatar: "👨‍💻",
      color: colors.employee.developer,
    },
    {
      id: "minus",
      name: "민수",
      position: "시니어 개발자",
      email: "minus@binslab.com",
      phone: "010-5678-9012",
      team: "Backend Team",
      avatar: "🚀",
      color: colors.employee.senior,
    },
    {
      id: "jiyoung",
      name: "지영",
      position: "디자이너",
      email: "jiyoung@binslab.com",
      phone: "010-3456-7890",
      team: "Design Team",
      avatar: "🎨",
      color: colors.employee.designer,
    },
  ]

  const timeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"]

  const weekDays = [
    { date: 25, day: "금", isWeekend: true },
    { date: 26, day: "토", isWeekend: true },
    { date: 27, day: "일", isWeekend: true },
    { date: 28, day: "월", isWeekend: false },
    { date: 29, day: "화", isWeekend: false },
    { date: 30, day: "수", isWeekend: false },
  ]

  // 직원별 스케줄 데이터
  const scheduleData: Record<number, Record<string, Array<{
    employee: string
    type: string
    color: string
  }>>> = {
    25: {
      "09:00": [
        { employee: "gguni", type: "출근", color: colors.status.success.gradient },
        { employee: "minus", type: "출근", color: colors.status.success.gradient },
        { employee: "jiyoung", type: "출근", color: colors.status.success.gradient },
      ],
      "13:00": [{ employee: "ceo", type: "점심", color: colors.status.error.gradient }],
      "18:00": [
        { employee: "gguni", type: "퇴근", color: colors.status.error.gradient },
        { employee: "minus", type: "퇴근", color: colors.status.error.gradient },
      ],
    },
    28: {
      "11:00": [{ employee: "minus", type: "회의", color: colors.status.info.gradient }],
      "13:00": [
        { employee: "gguni", type: "중무", color: colors.status.success.gradient },
        { employee: "jiyoung", type: "중무", color: colors.status.success.gradient },
      ],
      "14:00": [{ employee: "ceo", type: "점심", color: colors.status.error.gradient }],
    },
    29: {
      "13:00": [
        { employee: "gguni", type: "중무", color: colors.status.success.gradient },
        { employee: "jiyoung", type: "중무", color: colors.status.success.gradient },
      ],
      "14:00": [{ employee: "ceo", type: "점심", color: colors.status.error.gradient }],
      "17:00": [{ employee: "minus", type: "연차", color: "from-pink-400 to-pink-500" }],
    },
    30: {
      "09:00": [
        { employee: "gguni", type: "출근", color: colors.status.success.gradient },
        { employee: "jiyoung", type: "출근", color: colors.status.success.gradient },
      ],
      "14:00": [{ employee: "ceo", type: "점심", color: colors.status.error.gradient }],
      "17:00": [{ employee: "jiyoung", type: "점심", color: colors.status.error.gradient }],
    },
  }

  const tabs = [
    { id: "my", label: "내 근무 일정", icon: <Calendar className="w-4 h-4" /> },
    { id: "team", label: "동료 근무 일정", icon: <Users className="w-4 h-4" /> },
  ]

  const handlePreviousWeek = () => {
    // 이전 주 로직
  }

  const handleNextWeek = () => {
    // 다음 주 로직
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

      <div className="grid grid-cols-12 gap-8">
        {/* Employee List */}
        <div className="col-span-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="직원명 검색하기 검색"
              className="pl-10 bg-white/60 backdrop-blur-sm border-gray-200/50 rounded-xl"
            />
          </div>

          <div className="relative">
            <Input placeholder="조직 검색" className="bg-white/60 backdrop-blur-sm border-gray-200/50 rounded-xl" />
          </div>

          {/* Employee Cards */}
          <div className="space-y-4">
            {employees.map((employee) => (
              <GlassCard
                key={employee.id}
                className="p-4 cursor-pointer"
                onClick={() => setSelectedEmployee(employee.id)}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${employee.color} rounded-xl flex items-center justify-center text-white text-lg shadow-lg`}
                  >
                    {employee.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-800">{employee.name}</span>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                        {employee.position}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {employee.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {employee.phone}
                      </div>
                      <div className="text-blue-600 font-medium">{employee.team}</div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="col-span-8">
          {/* Date Navigation */}
          <DateNavigation
            currentPeriod={currentWeek}
            onPrevious={handlePreviousWeek}
            onNext={handleNextWeek}
            className="mb-6"
          />

          {/* Schedule Table */}
          <GlassCard className="overflow-hidden">
            <div className="grid grid-cols-7 border-b border-gray-200/50">
              <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 font-semibold text-gray-700 text-center">
                시간
              </div>
              {weekDays.map((day) => (
                <div
                  key={day.date}
                  className={`p-4 text-center font-semibold ${
                    day.isWeekend
                      ? "bg-gradient-to-r from-red-50 to-pink-50 text-red-600"
                      : "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700"
                  }`}
                >
                  <div className="text-lg">{day.date}</div>
                  <div className="text-xs">{day.day}</div>
                </div>
              ))}
            </div>

            {timeSlots.map((time) => (
              <div key={time} className="grid grid-cols-7 border-b border-gray-200/30 last:border-b-0">
                <div className="p-3 bg-gradient-to-r from-gray-50/50 to-gray-100/50 text-sm font-medium text-gray-600 text-center">
                  {time}
                </div>
                {weekDays.map((day) => (
                  <div key={`${day.date}-${time}`} className="p-2 min-h-[60px] border-l border-gray-200/30">
                    <div className="space-y-1">
                      {scheduleData[day.date]?.[time]?.map((schedule, index) => (
                        <div
                          key={index}
                          className={`px-2 py-1 rounded-lg text-xs font-medium text-white shadow-sm ${schedule.color}`}
                        >
                          {schedule.type}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </GlassCard>
        </div>
      </div>
    </MainLayout>
  )
}
