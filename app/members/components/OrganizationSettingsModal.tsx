"use client"

import { useState, useEffect, useMemo } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import modalStyles from './members-modal.module.css'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Search, 
  ChevronRight, 
  ChevronDown, 
  Plus,
  Building2,
  ArrowLeft,
  X
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
    const load = async () => {
      try {
        const res = await fetch('/organizations.json')
        const data = await res.json()
        setOrganizations(data as Organization[])
      } catch (e) {
        setOrganizations([])
      }
    }
    load()
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

    const removeById = (orgs: Organization[], targetId: string): { tree: Organization[]; removed?: Organization } => {
      let removed: Organization | undefined
      const tree = orgs
        .map(o => {
          if (o.id === targetId) {
            removed = { ...o }
            return null
          }
          if (o.children && o.children.length > 0) {
            const res = removeById(o.children, targetId)
            if (res.removed) removed = res.removed
            return { ...o, children: res.tree }
          }
          return o
        })
        .filter(Boolean) as Organization[]
      return { tree, removed }
    }


    const insertUnderParent = (orgs: Organization[], parentId: string, node: Organization): Organization[] => {
      return orgs.map(o => {
        if (o.id === parentId) {
          const children = o.children ? [...o.children, node] : [node]
          return { ...o, children }
        }
        if (o.children && o.children.length > 0) {
          return { ...o, children: insertUnderParent(o.children, parentId, node) }
        }
        return o
      })
    }

    if (editingOrg) {
      const parentChanged = (editingOrg.parentId || '') !== (org.parentId || '')
      if (parentChanged) {
        setOrganizations(prev => {
          const { tree, removed } = removeById(prev, org.id)
          const node: Organization = {
            ...(removed || org),
            name: org.name,
            parentId: org.parentId,
            leader: org.leader,
            members: org.members,
            children: removed?.children || org.children || []
          }
          if (org.parentId) {
            return insertUnderParent(tree, org.parentId, node)
          }
          return [...tree, node]
        })
      } else {
        const update = (orgs: Organization[]): Organization[] =>
          orgs.map(o => o.id === org.id
            ? { ...o, name: org.name, parentId: org.parentId, leader: org.leader, members: org.members }
            : { ...o, children: o.children ? update(o.children) : o.children }
          )
        setOrganizations(prev => update(prev))
      }
      toast.success('조직이 성공적으로 수정되었습니다.')
    } else {
      setOrganizations(prev => {
        const node: Organization = { ...org, children: org.children || [] }
        if (org.parentId) {
          return insertUnderParent(prev, org.parentId, node)
        }
        return [...prev, node]
      })
      toast.success('조직이 성공적으로 추가되었습니다.')
    }
    handleAddModalClose()
  }

  const handleOrgDelete = (id: string) => {
    const remove = (orgs: Organization[]): Organization[] =>
      orgs
        .filter(o => o.id !== id)
        .map(o => ({ ...o, children: o.children ? remove(o.children) : o.children }))
    setOrganizations(prev => remove(prev))
    toast.success('조직이 삭제되었습니다.')
  }

  const renderOrgTree = (orgs: Organization[], level = 0) => {
    return orgs.map(org => {
      const isExpanded = expandedOrgs.has(org.id)
      const hasChildren = org.children && org.children.length > 0
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
        <DialogContent data-hide-default-close className={`max-w-2xl max-h-[80vh] overflow-y-auto ${modalStyles.membersModal}`}>
          <DialogHeader>
            <div className="flex items-center justify-between">
              <button
                type="button"
                className="p-2 -ml-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded cursor-pointer"
                onClick={onClose}
                aria-label="뒤로가기"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                조직도 설정
              </DialogTitle>
              <button
                type="button"
                className="p-2 -mr-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded cursor-pointer"
                onClick={onClose}
                aria-label="닫기"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
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
        onDelete={handleOrgDelete}
        organizations={organizations}
      />
    </>
  )
} 