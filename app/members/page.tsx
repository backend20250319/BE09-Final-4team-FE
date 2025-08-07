"use client"

import { useState, useEffect } from 'react'
import { MainLayout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Plus, Settings } from "lucide-react"
import MemberList from './components/MemberList'
import OrgTree from './components/OrgTree'

interface Employee {
  id: string
  name: string
  email: string
  phone?: string
  position: string
  department: string
  organization: string
  teams: string[]
  tags: string[]
  profileImage?: string
}

interface OrgNode {
  name: string
  count: number
  children?: OrgNode[]
  isExpanded?: boolean
}

const mockEmployees: Employee[] = [
  {
    id: "1",
    name: "김철수",
    email: "kim.cs@company.com",
    phone: "010-1234-5678",
    position: "팀장",
    department: "개발팀",
    organization: "개발본부",
    teams: ["개발팀", "기획팀"],
    tags: ["개발팀", "기획팀"],
    profileImage: "/placeholder-user.jpg"
  },
  {
    id: "2",
    name: "이영희",
    email: "lee.yh@company.com",
    phone: "010-2345-6789",
    position: "선임",
    department: "디자인팀",
    organization: "디자인본부",
    teams: ["디자인팀"],
    tags: ["디자인팀"],
    profileImage: "/placeholder-user.jpg"
  }
]

const mockOrgStructure: OrgNode[] = [
  {
    name: "CEO",
    count: 1,
    isExpanded: false
  },
  {
    name: "개발본부",
    count: 89,
    isExpanded: true,
    children: [
      { name: "프론트엔드팀", count: 12 },
      { name: "백엔드팀", count: 15 },
      { name: "모바일팀", count: 8 }
    ]
  },
  {
    name: "디자인본부",
    count: 24,
    isExpanded: false,
    children: [
      { name: "UI팀", count: 8 },
      { name: "UX팀", count: 6 },
      { name: "그래픽팀", count: 10 }
    ]
  }
]

export default function MembersPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOrg, setSelectedOrg] = useState<string>()

  // 초기 데이터 로드
  useEffect(() => {
    setEmployees(mockEmployees)
    setFilteredEmployees(mockEmployees)
  }, [])

  // 검색어와 선택된 조직에 따른 필터링
  useEffect(() => {
    let filtered = employees

    // 검색어 필터링
    if (searchTerm) {
      filtered = filtered.filter(emp => {
        const searchLower = searchTerm.toLowerCase()
        return (
          emp.name.toLowerCase().includes(searchLower) ||
          emp.organization.toLowerCase().includes(searchLower) ||
          emp.teams.some(team => team.toLowerCase().includes(searchLower))
        )
      })
    }

    // 선택된 조직 필터링
    if (selectedOrg) {
      filtered = filtered.filter(emp => {
        const orgMatch = emp.organization === selectedOrg
        const teamMatch = emp.teams.includes(selectedOrg)
        return orgMatch || teamMatch
      })
    }

    setFilteredEmployees(filtered)
  }, [employees, searchTerm, selectedOrg])

  // 조직 선택 핸들러
  const handleOrgSelect = (orgName: string) => {
    setSelectedOrg(orgName === selectedOrg ? undefined : orgName)
  }

  // 검색어 변경 핸들러
  const handleSearchChange = (term: string) => {
    setSearchTerm(term)
  }

  return (
    <MainLayout
      requireAuth={false}
      showUserProfile={true}
      userName="데모 사용자"
      showNotifications={true}
    >
      <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">구성원</h1>
            <p className="text-sm text-gray-500 mt-1">
              직원 수: {filteredEmployees.length}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="bg-white">
              <Plus className="w-4 h-4 mr-1" />
              구성원 추가
            </Button>
            <Button variant="outline" className="bg-white p-2">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6">
          <MemberList
            employees={filteredEmployees}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            selectedOrg={selectedOrg}
            placeholder="직원명, 조직명으로 검색"
          />
        </div>
      </div>
    </MainLayout>
  )
}