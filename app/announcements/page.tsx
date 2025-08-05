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
  Megaphone,
  Calendar,
  User,
  Eye,
  MessageSquare,
  Pin,
  AlertCircle,
  Info,
  CheckCircle,
} from "lucide-react"

export default function AnnouncementsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = [
    { id: "all", name: "전체" },
    { id: "important", name: "중요" },
    { id: "general", name: "일반" },
    { id: "event", name: "이벤트" },
    { id: "system", name: "시스템" },
  ]

  const announcements = [
    {
      id: 1,
      title: "8월 팀 워크샵 일정 안내",
      content: "8월 15일-16일 양일간 강원도에서 팀 워크샵이 진행됩니다. 자세한 일정은 첨부파일을 참고해주세요.",
      author: "인사팀",
      date: "2025.07.25",
      category: "event",
      priority: "important",
      views: 45,
      comments: 8,
      pinned: true,
      icon: Pin,
      color: colors.status.error.gradient,
    },
    {
      id: 2,
      title: "월말 보고서 제출 안내",
      content: "7월 월말 보고서를 31일까지 제출해주세요. 지연 제출 시 불이익이 있을 수 있습니다.",
      author: "경영지원팀",
      date: "2025.07.24",
      category: "important",
      priority: "important",
      views: 32,
      comments: 3,
      pinned: false,
      icon: AlertCircle,
      color: colors.status.warning.gradient,
    },
    {
      id: 3,
      title: "시스템 점검 안내",
      content: "오늘 밤 12시부터 2시간간 시스템 점검이 예정되어 있습니다. 점검 시간 동안 서비스 이용이 제한됩니다.",
      author: "IT팀",
      date: "2025.07.23",
      category: "system",
      priority: "general",
      views: 28,
      comments: 1,
      pinned: false,
      icon: Info,
      color: colors.status.info.gradient,
    },
    {
      id: 4,
      title: "새로운 복리후생 제도 도입",
      content: "8월부터 새로운 복리후생 제도가 도입됩니다. 자세한 내용은 인사팀으로 문의해주세요.",
      author: "인사팀",
      date: "2025.07.22",
      category: "general",
      priority: "general",
      views: 56,
      comments: 12,
      pinned: false,
      icon: CheckCircle,
      color: colors.status.success.gradient,
    },
    {
      id: 5,
      title: "사내 동호회 모집",
      content: "다양한 사내 동호회를 모집합니다. 관심 있는 분들은 지원해주세요.",
      author: "사내문화팀",
      date: "2025.07.21",
      category: "event",
      priority: "general",
      views: 23,
      comments: 5,
      pinned: false,
      icon: CheckCircle,
      color: colors.status.success.gradient,
    },
  ]

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || announcement.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const stats = [
    {
      title: "전체 공지",
      value: announcements.length,
      unit: "건",
      icon: Megaphone,
      color: colors.primary.blue,
    },
    {
      title: "중요 공지",
      value: announcements.filter(a => a.priority === "important").length,
      unit: "건",
      icon: AlertCircle,
      color: colors.status.error.gradient,
    },
    {
      title: "이번 주 공지",
      value: announcements.filter(a => {
        const date = new Date(a.date)
        const now = new Date()
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        return date >= weekAgo
      }).length,
      unit: "건",
      icon: Calendar,
      color: colors.status.info.gradient,
    },
  ]

  return (
    <MainLayout>
      {/* Page Title */}
      <div className="mb-8">
        <h1 className={`${typography.h1} text-gray-800 mb-2`}>공지사항</h1>
        <p className="text-gray-600">회사의 중요한 소식을 확인하세요</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
            placeholder="제목 또는 내용으로 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/60 backdrop-blur-sm border-gray-200/50 rounded-xl"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48 bg-white/60 backdrop-blur-sm border-gray-200/50 rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <GradientButton variant="primary">
          <Plus className="w-4 h-4 mr-2" />
          공지 작성
        </GradientButton>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.map((announcement) => (
          <GlassCard key={announcement.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 bg-gradient-to-r ${announcement.color} rounded-xl flex items-center justify-center shadow-lg`}
              >
                <announcement.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className={`${typography.h4} text-gray-800`}>{announcement.title}</h3>
                  {announcement.pinned && (
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  )}
                  {announcement.priority === "important" && (
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                      중요
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">{announcement.content}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {announcement.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {announcement.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {announcement.views}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      {announcement.comments}
                    </div>
                  </div>
                  <GradientButton variant="secondary" size="sm">
                    자세히 보기
                  </GradientButton>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </MainLayout>
  )
} 