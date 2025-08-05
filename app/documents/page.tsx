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
  FileText,
  Folder,
  Download,
  Eye,
  Calendar,
  User,
  File,
  FolderOpen,
  Upload,
} from "lucide-react"

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = [
    { id: "all", name: "전체" },
    { id: "policy", name: "정책" },
    { id: "manual", name: "매뉴얼" },
    { id: "form", name: "양식" },
    { id: "report", name: "보고서" },
  ]

  const documents = [
    {
      id: 1,
      title: "인사규정",
      category: "policy",
      author: "인사팀",
      date: "2025.07.25",
      size: "2.5MB",
      downloads: 45,
      views: 128,
      icon: FileText,
      color: colors.status.info.gradient,
    },
    {
      id: 2,
      title: "업무 매뉴얼",
      category: "manual",
      author: "경영지원팀",
      date: "2025.07.24",
      size: "1.8MB",
      downloads: 32,
      views: 89,
      icon: FileText,
      color: colors.status.success.gradient,
    },
    {
      id: 3,
      title: "연차 신청서",
      category: "form",
      author: "인사팀",
      date: "2025.07.23",
      size: "0.5MB",
      downloads: 67,
      views: 156,
      icon: File,
      color: colors.status.warning.gradient,
    },
    {
      id: 4,
      title: "월말 보고서 양식",
      category: "form",
      author: "경영지원팀",
      date: "2025.07.22",
      size: "0.8MB",
      downloads: 23,
      views: 78,
      icon: File,
      color: colors.status.warning.gradient,
    },
    {
      id: 5,
      title: "7월 실적 보고서",
      category: "report",
      author: "마케팅팀",
      date: "2025.07.21",
      size: "3.2MB",
      downloads: 12,
      views: 45,
      icon: FileText,
      color: colors.status.error.gradient,
    },
  ]

  const filteredDocuments = documents.filter(document => {
    const matchesSearch = document.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         document.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || document.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const stats = [
    {
      title: "전체 문서",
      value: documents.length,
      unit: "개",
      icon: FileText,
      color: colors.primary.blue,
    },
    {
      title: "이번 주 업로드",
      value: documents.filter(d => {
        const date = new Date(d.date)
        const now = new Date()
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        return date >= weekAgo
      }).length,
      unit: "개",
      icon: Upload,
      color: colors.status.success.gradient,
    },
    {
      title: "총 다운로드",
      value: documents.reduce((sum, doc) => sum + doc.downloads, 0),
      unit: "회",
      icon: Download,
      color: colors.status.info.gradient,
    },
  ]

  return (
    <MainLayout>
      {/* Page Title */}
      <div className="mb-8">
        <h1 className={`${typography.h1} text-gray-800 mb-2`}>문서 관리</h1>
        <p className="text-gray-600">회사 문서를 확인하고 다운로드하세요</p>
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
            placeholder="문서명 또는 작성자로 검색"
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
          문서 업로드
        </GradientButton>
      </div>

      {/* Documents List */}
      <div className="space-y-4">
        {filteredDocuments.map((document) => (
          <GlassCard key={document.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 bg-gradient-to-r ${document.color} rounded-xl flex items-center justify-center shadow-lg`}
              >
                <document.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className={`${typography.h4} text-gray-800`}>{document.title}</h3>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                    {categories.find(c => c.id === document.category)?.name}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {document.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {document.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <File className="w-4 h-4" />
                      {document.size}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {document.views}
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      {document.downloads}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <GradientButton variant="secondary" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      미리보기
                    </GradientButton>
                    <GradientButton variant="primary" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      다운로드
                    </GradientButton>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </MainLayout>
  )
} 