"use client"

import { useState, useEffect, useMemo } from 'react'
import { MainLayout } from "@/components/layout/main-layout"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientButton } from "@/components/ui/gradient-button"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Users, 
  Search,
  Settings, 
  Plus,
  Building2, 
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Crown,
  Shield,
  ChevronDown,
  ChevronRight,
  Expand,
  Minimize
} from "lucide-react"
import { toast } from 'sonner'
import AddMemberModal from './components/AddMemberModal'
import SettingsModal from './components/SettingsModal'
import MemberList from './components/MemberList'

interface Employee {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  joinDate: string
  organization?: string
  organizations?: string[]
  position: string
  role: string
  job: string
  rank?: string
  isAdmin: boolean
  teams: string[]
  profileImage?: string
}

interface OrgStructure {
  name: string
  children?: OrgStructure[]
  employeeCount: number
  isExpanded?: boolean
}

const mockEmployees: Employee[] = [
  {
    id: "1",
      name: "비니비니",
    email: "bini@hermesai.com",
    phone: "010-0000-0000",
    address: "서울특별시 강남구",
    joinDate: "2020-01-01",
    organization: "CEO",
      position: "CEO",
    role: "본부장",
    job: "사업 기획",
    rank: "1급",
    isAdmin: true,
    teams: ["CEO", "인사팀", "경영팀"],
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "2",
    name: "김철수",
    email: "kim.cs@company.com",
      phone: "010-1234-5678",
    address: "서울특별시 서초구",
    joinDate: "2021-03-15",
    organization: "개발팀",
    position: "팀장",
    role: "팀장",
    job: "백엔드 개발",
    rank: "2급",
    isAdmin: false,
    teams: ["프론트엔드팀", "백엔드팀", "모바일팀"]
  },
  {
    id: "3",
    name: "이영희",
    email: "lee.yh@company.com",
    phone: "010-2345-6789",
    address: "서울특별시 마포구",
    joinDate: "2021-06-01",
    organization: "개발팀",
    position: "선임",
    role: "팀원",
    job: "프론트엔드 개발",
    rank: "3급",
    isAdmin: false,
    teams: ["UI팀", "UX팀", "그래픽팀"]
  },
  {
    id: "4",
    name: "박민수",
    email: "park.ms@company.com",
    phone: "010-3456-7890",
    address: "경기도 성남시",
    joinDate: "2022-01-10",
    organization: "개발팀",
    position: "주임",
    role: "팀원",
    job: "백엔드 개발",
    rank: "4급",
    isAdmin: false,
    teams: ["백엔드팀", "프론트엔드팀"]
  },
  {
    id: "5",
    name: "최지은",
    email: "choi.je@company.com",
    phone: "010-4567-8901",
    address: "서울특별시 송파구",
    joinDate: "2022-04-01",
    organization: "마케팅팀",
    position: "대리",
    role: "팀원",
    job: "마케팅",
    rank: "3급",
    isAdmin: false,
    teams: ["브랜드팀", "콘텐츠팀", "홍보팀"]
  },
  {
    id: "6",
    name: "정수민",
    email: "jung.sm@company.com",
      phone: "010-5678-9012",
    address: "서울특별시 강남구",
    joinDate: "2022-07-15",
    organization: "개발본부",
    position: "사원",
    role: "팀원",
    job: "프론트엔드 개발",
    rank: "5급",
    isAdmin: false,
    teams: ["프론트엔드팀", "백엔드팀", "모바일팀"]
  },
  {
    id: "7",
    name: "한지훈",
    email: "han.jh@company.com",
    phone: "010-6789-0123",
    address: "서울특별시 서초구",
    joinDate: "2021-09-01",
    organization: "경영진",
    position: "팀장",
    role: "팀장",
    job: "사업 기획",
    rank: "2급",
    isAdmin: false,
    teams: ["경영팀"]
  },
  {
    id: "8",
    name: "송미영",
    email: "song.my@company.com",
    phone: "010-7890-1234",
    address: "서울특별시 마포구",
    joinDate: "2022-03-20",
    organization: "개발본부",
    position: "선임",
    role: "팀원",
    job: "백엔드 개발",
    rank: "3급",
    isAdmin: false,
    teams: ["백엔드팀", "모바일팀", "프론트엔드팀"]
  },
  {
    id: "9",
    name: "강동현",
    email: "kang.dh@company.com",
    phone: "010-8901-2345",
    address: "경기도 성남시",
    joinDate: "2022-06-10",
    organization: "디자인본부",
    position: "주임",
    role: "팀원",
    job: "UI/UX 디자인",
    rank: "4급",
    isAdmin: false,
    teams: ["UX팀", "그래픽팀", "UI팀"]
  },
  {
    id: "10",
    name: "윤서연",
    email: "yoon.sy@company.com",
    phone: "010-9012-3456",
    address: "서울특별시 송파구",
    joinDate: "2022-08-01",
    organization: "개발본부",
    position: "대리",
    role: "팀원",
    job: "모바일 개발",
    rank: "3급",
    isAdmin: false,
    teams: ["모바일팀", "프론트엔드팀"]
  },
  {
    id: "11",
    name: "임태호",
    email: "lim.th@company.com",
    phone: "010-0123-4567",
    address: "서울특별시 강남구",
    joinDate: "2022-09-15",
    organization: "마케팅본부",
    position: "사원",
    role: "팀원",
    job: "콘텐츠 마케팅",
    rank: "5급",
    isAdmin: false,
    teams: ["콘텐츠팀", "홍보팀", "브랜드팀"]
  },
  {
    id: "12",
    name: "김미영",
    email: "kim.my@company.com",
      phone: "010-1111-2222",
    address: "서울특별시 서초구",
    joinDate: "2021-12-01",
    organization: "디자인본부",
    position: "팀장",
    role: "팀장",
    job: "UI/UX 디자인",
    rank: "2급",
    isAdmin: false,
    teams: ["UI팀", "UX팀"]
  },
  {
    id: "13",
    name: "이준호",
    email: "lee.jh@company.com",
    phone: "010-2222-3333",
    address: "서울특별시 마포구",
    joinDate: "2022-01-15",
    organization: "개발본부",
    position: "선임",
    role: "팀원",
    job: "프론트엔드 개발",
    rank: "3급",
    isAdmin: false,
    teams: ["프론트엔드팀", "백엔드팀", "모바일팀"]
  },
  {
    id: "14",
    name: "박수진",
    email: "park.sj@company.com",
    phone: "010-3333-4444",
    address: "경기도 성남시",
    joinDate: "2022-04-20",
    organization: "마케팅본부",
    position: "주임",
    role: "팀원",
    job: "브랜드 마케팅",
    rank: "4급",
    isAdmin: false,
    teams: ["브랜드팀", "콘텐츠팀"]
  },
  {
    id: "15",
    name: "최동현",
    email: "choi.dh@company.com",
    phone: "010-4444-5555",
    address: "서울특별시 송파구",
    joinDate: "2022-06-01",
    organization: "개발본부",
    position: "대리",
    role: "팀원",
    job: "백엔드 개발",
    rank: "3급",
    isAdmin: false,
    teams: ["백엔드팀", "프론트엔드팀", "모바일팀"]
  },
  {
    id: "16",
    name: "정민지",
    email: "jung.mj@company.com",
    phone: "010-5555-6666",
    address: "서울특별시 강남구",
    joinDate: "2022-08-15",
    organization: "디자인본부",
    position: "사원",
    role: "팀원",
    job: "그래픽 디자인",
    rank: "5급",
    isAdmin: false,
    teams: ["UX팀", "UI팀", "그래픽팀"]
  },
  {
    id: "17",
    name: "한승우",
    email: "han.sw@company.com",
    phone: "010-6666-7777",
    address: "서울특별시 서초구",
    joinDate: "2021-11-01",
    organization: "마케팅본부",
    position: "팀장",
    role: "팀장",
    job: "홍보 마케팅",
    rank: "2급",
    isAdmin: false,
    teams: ["홍보팀", "콘텐츠팀", "브랜드팀"]
  },
  {
    id: "18",
    name: "송지현",
    email: "song.jh@company.com",
    phone: "010-7777-8888",
    address: "서울특별시 마포구",
    joinDate: "2022-02-10",
    organization: "개발본부",
    position: "선임",
    role: "팀원",
    job: "프론트엔드 개발",
    rank: "3급",
    isAdmin: false,
    teams: ["프론트엔드팀", "백엔드팀"]
  },
  {
    id: "19",
    name: "강현우",
    email: "kang.hw@company.com",
    phone: "010-8888-9999",
    address: "경기도 성남시",
    joinDate: "2022-05-01",
    organization: "디자인본부",
    position: "주임",
    role: "팀원",
    job: "UI 디자인",
    rank: "4급",
    isAdmin: false,
    teams: ["그래픽팀", "UI팀", "UX팀"]
  },
  {
    id: "20",
    name: "윤서진",
    email: "yoon.sj@company.com",
    phone: "010-9999-0000",
    address: "서울특별시 송파구",
    joinDate: "2022-07-20",
    organization: "마케팅본부",
    position: "대리",
    role: "팀원",
    job: "브랜드 마케팅",
    rank: "3급",
    isAdmin: false,
    teams: ["브랜드팀", "홍보팀", "콘텐츠팀"]
  },
  {
    id: "21",
    name: "임준호",
    email: "lim.jh@company.com",
    phone: "010-0000-1111",
    address: "서울특별시 강남구",
    joinDate: "2022-09-01",
    organization: "개발본부",
    position: "사원",
    role: "팀원",
    job: "모바일 개발",
    rank: "5급",
    isAdmin: false,
    teams: ["모바일팀", "프론트엔드팀", "백엔드팀"]
  },
  {
    id: "22",
    name: "김영수",
    email: "kim.ys@company.com",
    phone: "010-1111-3333",
    address: "서울특별시 서초구",
    joinDate: "2022-10-15",
    organization: "디자인본부",
    position: "사원",
    role: "팀원",
    job: "UX 디자인",
    rank: "5급",
    isAdmin: false,
    teams: ["UX팀", "그래픽팀"]
  },
  {
    id: "23",
    name: "이미라",
    email: "lee.mr@company.com",
    phone: "010-2222-4444",
    address: "서울특별시 마포구",
    joinDate: "2022-11-01",
    organization: "마케팅본부",
    position: "대리",
    role: "팀원",
    job: "콘텐츠 마케팅",
    rank: "3급",
    isAdmin: false,
    teams: ["콘텐츠팀", "홍보팀"]
  },
  {
    id: "24",
    name: "박성훈",
    email: "park.sh@company.com",
    phone: "010-3333-5555",
    address: "경기도 성남시",
    joinDate: "2022-12-01",
    organization: "개발본부",
    position: "선임",
    role: "팀원",
    job: "프론트엔드 개발",
    rank: "3급",
    isAdmin: false,
    teams: ["프론트엔드팀", "백엔드팀", "모바일팀"]
  },
  {
    id: "25",
    name: "최유진",
    email: "choi.yj@company.com",
    phone: "010-4444-6666",
    address: "서울특별시 송파구",
    joinDate: "2023-01-15",
    organization: "디자인본부",
    position: "사원",
    role: "팀원",
    job: "그래픽 디자인",
    rank: "5급",
    isAdmin: false,
    teams: ["그래픽팀", "UI팀", "UX팀"]
  },
  {
    id: "26",
    name: "정태우",
    email: "jung.tw@company.com",
    phone: "010-5555-7777",
    address: "서울특별시 강남구",
    joinDate: "2021-08-01",
    organization: "경영진",
    position: "팀장",
    role: "팀장",
    job: "경영 기획",
    rank: "2급",
    isAdmin: false,
    teams: ["경영팀"]
  },
  ...Array.from({ length: 116 }, (_, i) => {
    const allTeams = ['프론트엔드팀', '백엔드팀', '모바일팀', 'UI팀', 'UX팀', '그래픽팀', '브랜드팀', '콘텐츠팀', '홍보팀', '경영팀', '인사팀'];
    const organizations = ['개발본부', '디자인본부', '마케팅본부', '경영진'];
    const selectedOrg = organizations[Math.floor(Math.random() * organizations.length)];
    
    let availableTeams: string[] = [];
    if (selectedOrg === '개발본부') {
      availableTeams = ['프론트엔드팀', '백엔드팀', '모바일팀'];
    } else if (selectedOrg === '디자인본부') {
      availableTeams = ['UI팀', 'UX팀', '그래픽팀'];
    } else if (selectedOrg === '마케팅본부') {
      availableTeams = ['브랜드팀', '콘텐츠팀', '홍보팀'];
    } else if (selectedOrg === '경영진') {
      availableTeams = ['인사팀', '경영팀'];
    }
    
    const maxTeamCount = Math.min(5, availableTeams.length);
    const teamCount = Math.floor(Math.random() * maxTeamCount) + 1;
    const selectedTeams: string[] = [];
    const shuffledTeams = [...availableTeams].sort(() => 0.5 - Math.random());
    
    for (let j = 0; j < teamCount && j < shuffledTeams.length; j++) {
      selectedTeams.push(shuffledTeams[j]);
    }
    
    const positions = ['팀장', '선임', '주임', '대리', '사원'];
    const roles = ['본부장', '팀장', '팀원', '인턴'];
    const jobs = ['사업 기획', '프론트엔드 개발', '백엔드 개발', '인사 관리', '마케팅', '영업', '디자인'];
    const ranks = ['1급', '2급', '3급', '4급', '5급'];
    const addresses = ['서울특별시 강남구', '서울특별시 서초구', '서울특별시 마포구', '경기도 성남시', '서울특별시 송파구'];
    
    const startDate = new Date('2020-01-01');
    const endDate = new Date('2024-12-31');
    const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
    const joinDate = new Date(randomTime).toISOString().split('T')[0];

    return {
      id: (i + 27).toString(),
      name: `직원${i + 26}`,
      position: positions[Math.floor(Math.random() * positions.length)],
      email: `employee${i + 26}@company.com`,
      phone: `010-${String(Math.floor(Math.random() * 9000) + 1000)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      address: addresses[Math.floor(Math.random() * addresses.length)],
      joinDate: joinDate,
      organization: selectedOrg,
      role: roles[Math.floor(Math.random() * roles.length)],
      job: jobs[Math.floor(Math.random() * jobs.length)],
      rank: ranks[Math.floor(Math.random() * ranks.length)],
      isAdmin: false,
      teams: selectedTeams
    };
  })
];

const mockOrgStructure: OrgStructure[] = [
  {
    name: "CEO",
    employeeCount: 1,
    isExpanded: false
  },
  {
    name: "경영진",
    employeeCount: 5,
    isExpanded: false,
    children: [
      { name: "경영팀", employeeCount: 3, isExpanded: false },
      { name: "인사팀", employeeCount: 2, isExpanded: false }
    ]
  },
  {
    name: "개발본부",
    employeeCount: 89,
    isExpanded: false,
    children: [
      { name: "프론트엔드팀", employeeCount: 12, isExpanded: false },
      { name: "백엔드팀", employeeCount: 15, isExpanded: false },
      { name: "모바일팀", employeeCount: 8, isExpanded: false }
    ]
  },
  {
    name: "디자인본부",
    employeeCount: 24,
    isExpanded: false,
    children: [
      { name: "UI팀", employeeCount: 8, isExpanded: false },
      { name: "UX팀", employeeCount: 6, isExpanded: false },
      { name: "그래픽팀", employeeCount: 10, isExpanded: false }
    ]
  },
  {
    name: "마케팅본부",
    employeeCount: 18,
    isExpanded: false,
    children: [
      { name: "브랜드팀", employeeCount: 6, isExpanded: false },
      { name: "콘텐츠팀", employeeCount: 8, isExpanded: false },
      { name: "홍보팀", employeeCount: 4, isExpanded: false }
    ]
  }
]

export default function MembersPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([])
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddMemberModal, setShowAddMemberModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  
  const [orgStructure, setOrgStructure] = useState<OrgStructure[]>(mockOrgStructure)
  const [orgSearchTerm, setOrgSearchTerm] = useState('')
  const [isAllExpanded, setIsAllExpanded] = useState(false)

  const calculateEmployeeCounts = (employees: Employee[]) => {
    const orgCounts: Record<string, number> = {}
    const teamCounts: Record<string, number> = {}
    
    employees.forEach(emp => {
      const orgList = Array.isArray(emp.organizations) && emp.organizations.length > 0
        ? emp.organizations
        : (emp.organization ? [emp.organization] : [])
      orgList.forEach(orgName => {
        orgCounts[orgName] = (orgCounts[orgName] || 0) + 1
      })
      
      if (emp.teams) {
        emp.teams.forEach(team => {
          teamCounts[team] = (teamCounts[team] || 0) + 1
        })
      }
    })
    
    return { orgCounts, teamCounts }
  }

  const updateOrgStructureWithRealCounts = (employees: Employee[], orgStructure: OrgStructure[]) => {
    const { orgCounts, teamCounts } = calculateEmployeeCounts(employees)
    
    const updateOrg = (orgs: OrgStructure[]): OrgStructure[] => {
      return orgs.map(org => {
        let employeeCount = 0
        
        if (orgCounts[org.name]) {
          employeeCount = orgCounts[org.name]
        }
        
        if (org.children) {
          const updatedChildren = org.children.map(child => {
            const childCount = teamCounts[child.name] || 0
            return { ...child, employeeCount: childCount }
          })
          return { ...org, employeeCount, children: updatedChildren }
        }
        
        return { ...org, employeeCount }
      })
    }
    
    return updateOrg(orgStructure)
  }

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        console.log('API 호출 시작...')
        const response = await fetch('/api/members')
        const data = await response.json()
        console.log('API 응답:', data)
        
                 if (data.success && data.members && data.members.length > 0) {
           const employees = data.members || []
           console.log('API에서 로드된 직원 수:', employees.length)
           setEmployees(employees)
           setFilteredEmployees(employees)
           
           const updatedOrgStructure = updateOrgStructureWithRealCounts(employees, mockOrgStructure)
           setOrgStructure(updatedOrgStructure)
         } else {
          console.log('API에 데이터 없음, 기본 데이터 사용')
          const sortedEmployees = [...mockEmployees].sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime())
          console.log('기본 데이터 직원 수:', sortedEmployees.length)
          setEmployees(sortedEmployees)
          setFilteredEmployees(sortedEmployees)
          
           console.log('기본 데이터를 API에 저장 중...')
           try {
             const response = await fetch('/api/members/bulk', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ members: sortedEmployees })
             })
             const result = await response.json()
             console.log('데이터 저장 결과:', result)
           } catch (error) {
             console.error('데이터 저장 오류:', error)
           }
          
          const updatedOrgStructure = updateOrgStructureWithRealCounts(sortedEmployees, mockOrgStructure)
          setOrgStructure(updatedOrgStructure)
        }
      } catch (error) {
        console.error('직원 데이터 로드 오류:', error)
        console.log('오류 발생, 기본 데이터 사용')
        const sortedEmployees = [...mockEmployees].sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime())
        console.log('기본 데이터 직원 수:', sortedEmployees.length)
        setEmployees(sortedEmployees)
        setFilteredEmployees(sortedEmployees)
        
        const updatedOrgStructure = updateOrgStructureWithRealCounts(sortedEmployees, mockOrgStructure)
        setOrgStructure(updatedOrgStructure)
      }
    }
    
    loadEmployees()
  }, [])

  useEffect(() => {
    if (employees.length > 0) {
      const updatedOrgStructure = updateOrgStructureWithRealCounts(employees, mockOrgStructure)
      setOrgStructure(updatedOrgStructure)
    }
  }, [employees])

  useEffect(() => {
    let filtered = employees
    
    if (searchTerm) {
      filtered = filtered.filter(emp => {
        const searchLower = searchTerm.toLowerCase()
        const nameMatch = emp.name.toLowerCase().includes(searchLower)
        const orgMatch = (
          (emp.organization && emp.organization.toLowerCase().includes(searchLower)) ||
          (Array.isArray(emp.organizations) && emp.organizations.some(o => o.toLowerCase().includes(searchLower)))
        )
        const teamMatch = emp.teams && emp.teams.some(team => 
          team.toLowerCase().includes(searchLower)
        )
        return nameMatch || orgMatch || teamMatch
      })
    }
    
    if (selectedOrg) {
      filtered = filtered.filter(emp => {
        const orgMatch = (
          emp.organization === selectedOrg ||
          (Array.isArray(emp.organizations) && emp.organizations.includes(selectedOrg))
        )
        const teamMatch = emp.teams && emp.teams.includes(selectedOrg)
        return orgMatch || teamMatch
      })
    }
    
    setFilteredEmployees(filtered)
  }, [employees, searchTerm, selectedOrg])

  const handleOrgSelect = (orgName: string) => {
    if (orgName === selectedOrg) {
      setSelectedOrg(null)
    } else {
      setSelectedOrg(orgName)
    }
  }

  const handleOrgToggle = (orgName: string) => {
    setOrgStructure(prev => {
      const updateOrg = (orgs: OrgStructure[]): OrgStructure[] => {
        return orgs.map(org => {
          if (org.name === orgName) {
            return { ...org, isExpanded: !org.isExpanded }
          }
          if (org.children) {
            return { ...org, children: updateOrg(org.children) }
          }
          return org
        })
      }
      return updateOrg(prev)
    })
  }

  const handleExpandAllToggle = () => {
    const newExpandedState = !isAllExpanded
    setIsAllExpanded(newExpandedState)
    
    setOrgStructure(prev => {
      const updateOrg = (orgs: OrgStructure[]): OrgStructure[] => {
        return orgs.map(org => ({
          ...org,
          isExpanded: newExpandedState,
          children: org.children ? updateOrg(org.children) : undefined
        }))
      }
      return updateOrg(prev)
    })
  }

  const filteredOrgStructure = useMemo(() => {
    if (!orgSearchTerm) return orgStructure
    const term = orgSearchTerm.toLowerCase()

    const collectExactMatches = (orgs: OrgStructure[], matches: OrgStructure[] = []): OrgStructure[] => {
      for (const org of orgs) {
        if (org.name.toLowerCase() === term) matches.push(org)
        if (org.children) collectExactMatches(org.children, matches)
      }
      return matches
    }
    
    const filterTree = (orgs: OrgStructure[]): OrgStructure[] => {
      const result: OrgStructure[] = []
      for (const org of orgs) {
        const selfMatch = org.name.toLowerCase().includes(term)
        const filteredChildren = org.children ? filterTree(org.children) : undefined

        if (selfMatch) {
          if (filteredChildren && filteredChildren.length > 0) {
            result.push({ ...org, isExpanded: true, children: filteredChildren })
          } else {
            result.push({ ...org, isExpanded: false, children: undefined })
          }
          continue
        }

        if (filteredChildren && filteredChildren.length > 0) {
          result.push({ ...org, isExpanded: true, children: filteredChildren })
        }
      }
      return result
    }

    const exactMatches = collectExactMatches(orgStructure)
    if (exactMatches.length === 1) {
      const m = exactMatches[0]
      return [{ ...m, isExpanded: false, children: undefined }]
    }

    return filterTree(orgStructure)
  }, [orgStructure, orgSearchTerm])

  useEffect(() => {
    if (orgSearchTerm) {
      setOrgStructure(prev => {
        const updateOrg = (orgs: OrgStructure[]): OrgStructure[] => {
          return orgs.map(org => {
            const orgNameMatch = org.name.toLowerCase().includes(orgSearchTerm.toLowerCase())
            const childMatch = org.children?.some(child => 
              child.name.toLowerCase().includes(orgSearchTerm.toLowerCase())
            )
            
            if (orgNameMatch || childMatch) {
              return {
                ...org,
                isExpanded: true,
                children: org.children ? updateOrg(org.children) : undefined
              }
            }
            
            if (org.children) {
              return {
                ...org,
                children: updateOrg(org.children)
              }
            }
            
            return org
          })
        }
        return updateOrg(prev)
      })
    } else {
      setOrgStructure(mockOrgStructure)
    }
  }, [orgSearchTerm])

  const handleSettingsClick = () => {
    setShowSettingsModal(true)
  }

  const handleSettingsClose = () => {
    setShowSettingsModal(false)
  }

  const handleAddMember = () => {
    setShowSettingsModal(false)
    setShowAddMemberModal(true)
  }

  const handleAddMemberClose = () => {
    setShowAddMemberModal(false)
  }

  const handleAddMemberBack = () => {
    setShowAddMemberModal(false)
    setShowSettingsModal(true)
  }

  const handleEmployeeUpdate = (updatedEmployee: Employee) => {
    setEmployees(prev => 
      prev.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp)
    )
    setFilteredEmployees(prev => 
      prev.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp)
    )
  }

  useEffect(() => {
    const handleEmployeeUpdateEvent = (event: CustomEvent) => {
      const updatedEmployee = event.detail
      handleEmployeeUpdate(updatedEmployee)
    }

    window.addEventListener('employeeUpdated', handleEmployeeUpdateEvent as EventListener)
    
    return () => {
      window.removeEventListener('employeeUpdated', handleEmployeeUpdateEvent as EventListener)
    }
  }, [])

  const handleAddMemberSave = async (memberData: any) => {
    try {
      const response = await fetch('/api/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memberData),
      });

      const result = await response.json();

      if (result.success) {
        const primaryOrg = Array.isArray(memberData.organizations) && memberData.organizations.length > 0
          ? memberData.organizations[0]
          : memberData.organization
        const newMember: Employee = {
          id: result.member.id,
          name: memberData.name,
          email: memberData.email,
          phone: memberData.phone || '',
          address: memberData.address || '',
          joinDate: memberData.joinDate,
          organization: primaryOrg,
          organizations: Array.isArray(memberData.organizations) ? memberData.organizations : undefined,
          position: memberData.position,
          role: memberData.role,
          job: memberData.job,
          rank: memberData.rank || '',
          isAdmin: Boolean(memberData.isAdmin),
          teams: primaryOrg ? [primaryOrg] : []
        };

        const updatedEmployees = [...employees, newMember].sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime());
        setEmployees(updatedEmployees);

        const updatedOrgStructure = updateOrgStructureWithRealCounts(updatedEmployees, orgStructure);
        setOrgStructure(updatedOrgStructure);

        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const newUser = {
          email: memberData.email,
          password: memberData.tempPassword,
          name: memberData.name,
          isAdmin: Boolean(memberData.isAdmin),
          needsPasswordReset: true
        };
        existingUsers.push(newUser);
        localStorage.setItem('users', JSON.stringify(existingUsers));

        setShowAddMemberModal(false);
        toast.success('구성원이 성공적으로 추가되었습니다.');
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('구성원 추가 오류:', error);
      toast.error('구성원 추가 중 오류가 발생했습니다: ' + (error as Error).message);
    }
  };

  const getTitle = () => {
    if (selectedOrg) {
      return `구성원 - ${selectedOrg}`
    }
    return '구성원'
  }

  const getSubtitle = () => {
    let subtitle = `직원 수: ${filteredEmployees.length}`
    
    if (selectedOrg) {
      subtitle += ` (${selectedOrg} 필터링됨)`
    }
    
    if (searchTerm) {
      subtitle += ` (검색어: "${searchTerm}")`
    }
    
    return subtitle
  }

  const OrgTreeItem = ({ org, level = 0 }: { org: OrgStructure; level?: number }) => (
    <div className="ml-4">
      <button
        onClick={() => handleOrgSelect(org.name)}
        className={`group w-full text-left p-2 rounded-lg transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 ${
          selectedOrg === org.name
            ? 'bg-blue-50 text-blue-800 ring-1 ring-blue-200 hover:ring-blue-300'
            : 'bg-white hover:bg-gray-50 ring-1 ring-transparent hover:ring-gray-200 hover:shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {org.children && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleOrgToggle(org.name);
                }}
                className="p-1 hover:bg-gray-200 rounded cursor-pointer"
              >
                {org.isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </div>
            )}
            <Building2 className="w-4 h-4" />
            <span className="font-medium">{org.name}</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {org.employeeCount}명
          </Badge>
        </div>
      </button>
      {org.children && org.isExpanded && (
        <div className="mt-1">
          {org.children.map((child, index) => (
            <OrgTreeItem key={index} org={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )

  return (
    <MainLayout requireAuth={false}>
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-gray-900">{getTitle()}</h1>
          <div className="flex items-center gap-2">
            <GradientButton variant="primary" onClick={handleSettingsClick}>
              <Settings className="w-4 h-4 mr-2" />
              설정
            </GradientButton>
                </div>
              </div>
        <p className="text-gray-600">{getSubtitle()}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 구성원 리스트 */}
        <div className="lg:col-span-2">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">구성원 목록</h3>
            </div>
            <MemberList
              employees={filteredEmployees}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedOrg={selectedOrg}
              placeholder="직원명, 조직명, 팀명으로 검색"
              onEmployeeUpdate={handleEmployeeUpdate}
            />
          </GlassCard>
      </div>

        {/* 조직도 */}
        <div>
          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">조직도</h3>
            
            {/* 조직도 검색 */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
                  placeholder="조직명을 입력하여 검색"
                  value={orgSearchTerm}
                  onChange={(e) => setOrgSearchTerm(e.target.value)}
                  className="pl-10"
          />
        </div>
      </div>

            

            {/* 모두 펼치기/접기 버튼 */}
            <div className="flex gap-2 mb-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExpandAllToggle}
                className="flex items-center gap-1"
              >
                {isAllExpanded ? (
                  <Minimize className="w-4 h-4" />
                ) : (
                  <Expand className="w-4 h-4" />
                )}
                모두 {isAllExpanded ? '접기' : '펼치기'}
              </Button>
            </div>

            {/* 조직도 트리 */}
            <div className="space-y-1">
              {filteredOrgStructure.map((org, index) => (
                <OrgTreeItem key={index} org={org} />
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* 구성원 추가 모달 */}
      <AddMemberModal
        isOpen={showAddMemberModal}
        onClose={handleAddMemberClose}
        onSave={handleAddMemberSave}
        onBack={handleAddMemberBack}
      />

      {/* 설정 모달 */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={handleSettingsClose}
        onAddMember={handleAddMember}
      />
    </MainLayout>
  )
} 