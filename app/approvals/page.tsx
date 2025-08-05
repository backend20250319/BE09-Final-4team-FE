"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientButton } from "@/components/ui/gradient-button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { colors, typography } from "@/lib/design-tokens"
import {
  Search,
  Plus,
  ClipboardList,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Calendar,
  FileText,
  ArrowRight,
} from "lucide-react"

export default function ApprovalsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const statuses = [
    { id: "all", name: "전체" },
    { id: "pending", name: "대기중" },
    { id: "approved", name: "승인됨" },
    { id: "rejected", name: "반려됨" },
  ]

  const approvals = [
    {
      id: 1,
      title: "연차 신청",
      type: "휴가",
      requester: "김철수",
      department: "개발팀",
      date: "2025.07.25",
      status: "pending",
      priority: "normal",
      content: "8월 1일 연차 사용 신청합니다.",
      icon: Calendar,
      color: colors.status.warning.gradient,
    },
    {
      id: 2,
      title: "업무용 장비 구매",
      type: "구매",
      requester: "이영희",
      department: "디자인팀",
      date: "2025.07.24",
      status: "approved",
      priority: "high",
      content: "디자인 작업용 태블릿 구매 신청",
      icon: FileText,
      color: colors.status.success.gradient,
    },
    {
      id: 3,
      title: "출장 신청",
      type: "출장",
      requester: "박민수",
      department: "마케팅팀",
      date: "2025.07.23",
      status: "rejected",
      priority: "normal",
      content: "고객사 방문을 위한 출장 신청",
      icon: ArrowRight,
      color: colors.status.error.gradient,
    },
    {
      id: 4,
      title: "교육 참석 신청",
      type: "교육",
      requester: "최지영",
      department: "인사팀",
      date: "2025.07.22",
      status: "pending",
      priority: "normal",
      content: "HR 전문가 과정 교육 참석 신청",
      icon: User,
      color: colors.status.info.gradient,
    },
    {
      id: 5,
      title: "회의실 예약",
      type: "시설",
      requester: "정수민",
      department: "경영지원팀",
      date: "2025.07.21",
      status: "approved",
      priority: "low",
      content: "다음 주 월요일 대회의실 예약 신청",
      icon: FileText,
      color: colors.status.success.gradient,
    },
  ]

  const filteredApprovals = approvals.filter(approval => {
    const matchesSearch = approval.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         approval.requester.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || approval.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const stats = [
    {
      title: "전체 결재",
      value: approvals.length,
      unit: "건",
      icon: ClipboardList,
      color: colors.primary.blue,
    },
    {
      title: "대기중",
      value: approvals.filter(a => a.status === "pending").length,
      unit: "건",
      icon: Clock,
      color: colors.status.warning.gradient,
    },
    {
      title: "승인됨",
      value: approvals.filter(a => a.status === "approved").length,
      unit: "건",
      icon: CheckCircle,
      color: colors.status.success.gradient,
    },
    {
      title: "반려됨",
      value: approvals.filter(a => a.status === "rejected").length,
      unit: "건",
      icon: XCircle,
      color: colors.status.error.gradient,
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return Clock
      case "approved":
        return CheckCircle
      case "rejected":
        return XCircle
      default:
        return AlertCircle
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return colors.status.warning.gradient
      case "approved":
        return colors.status.success.gradient
      case "rejected":
        return colors.status.error.gradient
      default:
        return colors.status.info.gradient
    }
  }

  return (
    <MainLayout>
      {/* Page Title */}
      <div className="mb-8">
        <h1 className={`${typography.h1} text-gray-800 mb-2`}>결재 관리</h1>
        <p className="text-gray-600">결재 요청을 확인하고 처리하세요</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <GlassCard key={index} className="p-6">
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className={`${typography.h4} text-gray-800 mb-1`}>{stat.title}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                  <span className="text-lg text-gray-600">{stat.unit}</span>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="제목 또는 신청자로 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/60 backdrop-blur-sm border-gray-200/50 rounded-xl"
          />
        </div>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-48 bg-white/60 backdrop-blur-sm border-gray-200/50 rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((status) => (
              <SelectItem key={status.id} value={status.id}>
                {status.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <GradientButton variant="primary">
          <Plus className="w-4 h-4 mr-2" />
          결재 신청
        </GradientButton>
      </div>

      {/* Approvals List */}
      <div className="space-y-4">
        {filteredApprovals.map((approval) => {
          const StatusIcon = getStatusIcon(approval.status)
          const statusColor = getStatusColor(approval.status)
          
          return (
            <GlassCard key={approval.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${approval.color} rounded-xl flex items-center justify-center shadow-lg`}
                >
                  <approval.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className={`${typography.h4} text-gray-800`}>{approval.title}</h3>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      {approval.type}
                    </span>
                    {approval.priority === "high" && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                        긴급
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-4">{approval.content}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {approval.requester} ({approval.department})
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {approval.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <StatusIcon className="w-4 h-4" style={{ color: statusColor.replace('from-', '').replace('-to-', ' ') }} />
                        {approval.status === "pending" ? "대기중" :
                         approval.status === "approved" ? "승인됨" :
                         approval.status === "rejected" ? "반려됨" : approval.status}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {approval.status === "pending" && (
                        <>
                          <GradientButton variant="success" size="sm">
                            승인
                          </GradientButton>
                          <GradientButton variant="error" size="sm">
                            반려
                          </GradientButton>
                        </>
                      )}
                      <GradientButton variant="secondary" size="sm">
                        상세보기
                      </GradientButton>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          )
        })}
      </div>
    </MainLayout>
  )
} 