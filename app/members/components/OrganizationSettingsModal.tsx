"use client"

import { useState, useEffect, useMemo } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  ChevronRight, 
  ChevronDown, 
  Plus,
  Building2
} from "lucide-react"
import { toast } from 'sonner'
import AddOrganizationModal from './AddOrganizationModal'

interface Member {
  id: string
  name: string
  role: string
  email: string
  phone: string
}

interface Organization {
  id: string
  name: string
  parentId?: string
  members: Member[]
  leader?: Member
  children?: Organization[]
}

interface OrganizationSettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function OrganizationSettingsModal({ isOpen, onClose }: OrganizationSettingsModalProps) {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [expandedOrgs, setExpandedOrgs] = useState<Set<string>>(new Set())
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null)

  useEffect(() => {
    const sampleOrgs: Organization[] = [
      {
        id: "1",
        name: "CEE",
        members: [
          { id: "1", name: "비니비니", role: "CEO", email: "binibini@hermesai.com", phone: "010-1234-5678" },
          { id: "2", name: "이혜빈", role: "CTO", email: "lee.hb@company.com", phone: "010-2345-6789" },
          { id: "3", name: "조석근", role: "Manager", email: "jo.sg@company.com", phone: "010-3456-7890" },
          { id: "4", name: "박준범", role: "Senior Engineer", email: "park.jb@company.com", phone: "010-4567-8901" }
        ],
        leader: { id: "1", name: "비니비니", role: "CEO", email: "binibini@hermesai.com", phone: "010-1234-5678" },
        children: [
          {
            id: "2",
            name: "Management",
            parentId: "1",
            members: [
              { id: "5", name: "김철수", role: "Manager", email: "kim.cs@company.com", phone: "010-5678-9012" },
              { id: "6", name: "이영희", role: "Senior Manager", email: "lee.yh@company.com", phone: "010-6789-0123" }
            ],
            leader: { id: "5", name: "김철수", role: "Manager", email: "kim.cs@company.com", phone: "010-5678-9012" },
            children: [
              {
                id: "3",
                name: "Application 2",
                parentId: "2",
                members: [
                  { id: "7", name: "박준범", role: "Senior Engineer", email: "park.jb@company.com", phone: "010-7890-1234" },
                  { id: "8", name: "이석진", role: "Senior Engineer", email: "lee.sj@company.com", phone: "010-8901-2345" }
                ],
                leader: { id: "7", name: "박준범", role: "Senior Engineer", email: "park.jb@company.com", phone: "010-7890-1234" },
                children: [
                  {
                    id: "4",
                    name: "Dev - Team 1",
                    parentId: "3",
                    members: [
                      { id: "9", name: "정수민", role: "Engineer", email: "jung.sm@company.com", phone: "010-9012-3456" },
                      { id: "10", name: "김미영", role: "Engineer", email: "kim.my@company.com", phone: "010-0123-4567" }
                    ],
                    leader: { id: "9", name: "정수민", role: "Engineer", email: "jung.sm@company.com", phone: "010-9012-3456" }
                  },
                  {
                    id: "5",
                    name: "Dev - Team 2",
                    parentId: "3",
                    members: [
                      { id: "11", name: "박지성", role: "Engineer", email: "park.js@company.com", phone: "010-1234-5678" },
                      { id: "12", name: "이동욱", role: "Engineer", email: "lee.dw@company.com", phone: "010-2345-6789" }
                    ],
                    leader: { id: "11", name: "박지성", role: "Engineer", email: "park.js@company.com", phone: "010-1234-5678" }
                  }
                ]
              }
            ]
          },
          {
            id: "6",
            name: "Application 1",
            parentId: "1",
            members: [
              { id: "13", name: "최민수", role: "Senior Engineer", email: "choi.ms@company.com", phone: "010-3456-7890" },
              { id: "14", name: "김태영", role: "Engineer", email: "kim.ty@company.com", phone: "010-4567-8901" }
            ],
            leader: { id: "13", name: "최민수", role: "Senior Engineer", email: "choi.ms@company.com", phone: "010-3456-7890" }
          }
        ]
      }
    ]
    setOrganizations(sampleOrgs)
  }, [])

  const toggleExpanded = (orgId: string) => {
    const newExpanded = new Set(expandedOrgs)
    if (newExpanded.has(orgId)) {
      newExpanded.delete(orgId)
    } else {
      newExpanded.add(orgId)
    }
    setExpandedOrgs(newExpanded)
  }

  const handleOrgClick = (org: Organization) => {
    setEditingOrg(org)
    setShowAddModal(true)
  }

  const handleAddOrg = () => {
    setEditingOrg(null)
    setShowAddModal(true)
  }

  const handleAddModalClose = () => {
    setShowAddModal(false)
    setEditingOrg(null)
  }

  const handleOrgSave = (org: Organization) => {
    if (editingOrg) {
      toast.success('조직이 성공적으로 수정되었습니다.')
    } else {
      toast.success('조직이 성공적으로 추가되었습니다.')
    }
    handleAddModalClose()
  }

  const renderOrgTree = (orgs: Organization[], level = 0) => {
    return orgs.map(org => {
      const isExpanded = expandedOrgs.has(org.id)
      const hasChildren = org.children && org.children.length > 0
      const memberCount = org.members.length

      return (
        <div key={org.id}>
          <div 
            className={`flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
              level > 0 ? 'ml-6' : ''
            }`}
            onClick={() => handleOrgClick(org)}
          >
            <div className="flex items-center gap-2">
              {hasChildren && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleExpanded(org.id)
                  }}
                  className="p-1 hover:bg-gray-200 rounded cursor-pointer"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              )}
              <Building2 className="w-4 h-4 text-gray-500" />
              <span className="font-medium">{org.name}</span>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {memberCount}
            </Badge>
          </div>
          {hasChildren && isExpanded && (
            <div className="border-l border-gray-200 ml-3">
              {renderOrgTree(org.children!, level + 1)}
            </div>
          )}
        </div>
      )
    })
  }

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 300)
    return () => clearTimeout(id)
  }, [searchTerm])

  const filteredOrgs = useMemo(() => {
    if (!debouncedSearch) return organizations
    const term = debouncedSearch.toLowerCase()
    return organizations.filter(org => org.name.toLowerCase().includes(term))
  }, [organizations, debouncedSearch])

  const allOrgIds = useMemo(() => {
    const all = new Set<string>()
    const collectIds = (orgs: Organization[]) => {
      orgs.forEach(o => {
        all.add(o.id)
        if (o.children && o.children.length > 0) collectIds(o.children)
      })
    }
    collectIds(organizations)
    return all
  }, [organizations])

  const expandAll = () => {
    const collectIds = (orgs: Organization[], acc: Set<string>) => {
      orgs.forEach(o => {
        acc.add(o.id)
        if (o.children && o.children.length > 0) collectIds(o.children, acc)
      })
    }
    const all = new Set<string>()
    collectIds(organizations, all)
    setExpandedOrgs(all)
  }

  const collapseAll = () => setExpandedOrgs(new Set())

  const isAllExpanded = allOrgIds.size > 0 && expandedOrgs.size >= allOrgIds.size

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              조직도 설정
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="조직명을 입력하여 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => (isAllExpanded ? collapseAll() : expandAll())}
                className="cursor-pointer"
              >
                {isAllExpanded ? '모두 접기' : '모두 펼치기'}
              </Button>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              {renderOrgTree(filteredOrgs)}
            </div>

            <div className="flex justify-center pt-4">
              <Button 
                onClick={handleAddOrg}
                className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-2" />
                조직 추가
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AddOrganizationModal
        isOpen={showAddModal}
        onClose={handleAddModalClose}
        organization={editingOrg}
        onSave={handleOrgSave}
      />
    </>
  )
} 