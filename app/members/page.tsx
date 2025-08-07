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
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  Building,
  UserPlus,
} from "lucide-react"

export default function MembersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")

  const departments = [
    { id: "all", name: "전체 부서" },
    { id: "ceo", name: "CEO" },
    { id: "development", name: "개발팀" },
    { id: "design", name: "디자인팀" },
    { id: "marketing", name: "마케팅팀" },
    { id: "hr", name: "인사팀" },
  ]

  const members = [
    {
      id: 1,
      name: "비니비니",
      position: "CEO",
      department: "CEO",
      email: "binibini@binslab.com",
      phone: "010-1234-5678",
      location: "서울 강남구",
      joinDate: "2020.03.01",
      avatar: "🎯",
      color: colors.employee.ceo,
      status: "active",
    },
    {
      id: 2,
      name: "꾸니",
      position: "주니어 개발자",
      department: "개발팀",
      email: "gguni@binslab.com",
      phone: "010-1234-5678",
      location: "서울 서초구",
      joinDate: "2023.07.01",
      avatar: "👨‍💻",
      color: colors.employee.developer,
      status: "active",
    },
    {
      id: 3,
      name: "민수",
      position: "시니어 개발자",
      department: "개발팀",
      email: "minus@binslab.com",
      phone: "010-5678-9012",
      location: "서울 마포구",
      joinDate: "2021.09.15",
      avatar: "🚀",
      color: colors.employee.senior,
      status: "active",
    },
    {
      id: 4,
      name: "지영",
      position: "디자이너",
      department: "디자인팀",
      email: "jiyoung@binslab.com",
      phone: "010-3456-7890",
      location: "서울 성동구",
      joinDate: "2022.01.10",
      avatar: "🎨",
      color: colors.employee.designer,
      status: "active",
    },
    {
      id: 5,
      name: "김마케터",
      position: "마케팅 매니저",
      department: "마케팅팀",
      email: "marketing@binslab.com",
      phone: "010-9876-5432",
      location: "서울 종로구",
      joinDate: "2021.06.01",
      avatar: "📢",
      color: "from-purple-500 to-pink-500",
      status: "active",
    },
    {
      id: 6,
      name: "이인사",
      position: "인사 담당자",
      department: "인사팀",
      email: "hr@binslab.com",
      phone: "010-1111-2222",
      location: "서울 용산구",
      joinDate: "2020.12.01",
      avatar: "👥",
      color: "from-teal-500 to-cyan-500",
      status: "active",
    },
  ]

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === "all" || member.department === departments.find(d => d.id === selectedDepartment)?.name
    return matchesSearch && matchesDepartment
  })

  const stats = [
    {
      title: "전체 구성원",
      value: members.length,
      unit: "명",
      icon: Users,
      color: colors.primary.blue,
    },
    {
      title: "활성 구성원",
      value: members.filter(m => m.status === "active").length,
      unit: "명",
      icon: UserPlus,
      color: colors.status.success.gradient,
    },
    {
      title: "부서 수",
      value: departments.length - 1, // "전체 부서" 제외
      unit: "개",
      icon: Building,
      color: colors.status.info.gradient,
    },
  ]

    return (
    <MainLayout>
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <h1 className={`${typography.h1} text-gray-800 mb-2`}>구성원 관리</h1>
        <p className="text-gray-600">조직의 구성원 정보를 확인하고 관리하세요</p>
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
            placeholder="이름 또는 이메일로 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/60 backdrop-blur-sm border-gray-200/50 rounded-xl"
          />
        </div>
        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
          <SelectTrigger className="w-48 bg-white/60 backdrop-blur-sm border-gray-200/50 rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {departments.map((dept) => (
              <SelectItem key={dept.id} value={dept.id}>
                {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <GradientButton variant="primary">
          <Plus className="w-4 h-4 mr-2" />
          구성원 추가
        </GradientButton>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <GlassCard key={member.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-start gap-4 mb-4">
              <div
                className={`w-16 h-16 bg-gradient-to-r ${member.color} rounded-xl flex items-center justify-center text-white text-2xl shadow-lg`}
              >
                {member.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-gray-800">{member.name}</h3>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                    {member.position}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{member.department}</p>
                <div className="text-xs text-gray-500 space-y-1">
                  <div className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {member.email}
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {member.phone}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {member.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    입사일: {member.joinDate}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <GradientButton variant="secondary" size="sm" className="flex-1">
                상세보기
              </GradientButton>
              <GradientButton variant="secondary" size="sm">
                편집
              </GradientButton>
            </div>
          </GlassCard>
        ))}
      </div>
    </MainLayout>
  )
} 