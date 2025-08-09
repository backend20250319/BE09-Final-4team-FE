"use client"

import { useState, useEffect, useMemo } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  X,
  Trash2,
  ArrowLeft
} from "lucide-react"
import { toast } from 'sonner'
import LeaderSelectionModal from './LeaderSelectionModal'
import MemberSelectionModal from './MemberSelectionModal'

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

interface AddOrganizationModalProps {
  isOpen: boolean
  onClose: () => void
  organization?: Organization | null
  onSave: (org: Organization) => void
}

export default function AddOrganizationModal({ 
  isOpen, 
  onClose, 
  organization, 
  onSave 
}: AddOrganizationModalProps) {
  const [orgName, setOrgName] = useState('')
  const [parentOrg, setParentOrg] = useState('')
  const [selectedLeader, setSelectedLeader] = useState<Member | null>(null)
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([])
  const [showLeaderModal, setShowLeaderModal] = useState(false)
  const [showMemberModal, setShowMemberModal] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [showCloseConfirm, setShowCloseConfirm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showDeleteWarn, setShowDeleteWarn] = useState(false)
  const [deleteWarnMessage, setDeleteWarnMessage] = useState('')

  useEffect(() => {
    if (organization) {
      setOrgName(organization.name)
      setParentOrg(organization.parentId || '')
      setSelectedLeader(organization.leader || null)
      setSelectedMembers(organization.members || [])
      setIsDirty(false)
    } else {
        setOrgName('')
      setParentOrg('')
      setSelectedLeader(null)
      setSelectedMembers([])
      setIsDirty(false)
    }
  }, [organization])

  const handleSave = () => {
    if (!orgName.trim()) {
      toast.error('조직 이름을 입력해주세요.')
      return
    }



    const newOrg: Organization = {
      id: organization?.id || Date.now().toString(),
      name: orgName,
      parentId: parentOrg || undefined,
      members: selectedMembers,
      leader: selectedLeader || undefined
    }

    onSave(newOrg)
  }

  const handleDeleteClick = () => {
    if (!organization) return
    if (organization.members.length > 0) {
      setDeleteWarnMessage('조직원을 모두 제거해야 삭제할 수 있습니다.')
      setShowDeleteWarn(true)
      return
    }
    if (organization.children && organization.children.length > 0) {
      setDeleteWarnMessage('하위 조직을 모두 삭제한 후 삭제할 수 있습니다.')
      setShowDeleteWarn(true)
      return
    }
    setShowDeleteConfirm(true)
  }

  const performDelete = () => {
    if (!organization) return
    toast.success('조직이 성공적으로 삭제되었습니다.')
    setShowDeleteConfirm(false)
    onClose()
  }

  const handleLeaderSelect = (leader: Member) => {
    setSelectedLeader(leader)
    setShowLeaderModal(false)
  }

  const handleMemberSelect = (members: Member[]) => {
    setSelectedMembers(members)
    setShowMemberModal(false)
  }

  const removeLeader = () => {
    setSelectedLeader(null)
  }

  const removeMember = (memberId: string) => {
    setSelectedMembers(prev => prev.filter(member => member.id !== memberId))
  }

  const canDelete = organization && organization.members.length === 0 && 
    (!organization.children || organization.children.length === 0)

  const canSave = Boolean(orgName.trim()) && isDirty

  useEffect(() => {
    const initial = organization
      ? {
          orgName: organization.name,
          parent: organization.parentId || '',
          leaderId: organization.leader?.id || null,
          memberIds: (organization.members || []).map(m => m.id).join(',')
        }
      : { orgName: '', parent: '', leaderId: null, memberIds: '' }

    const current = {
      orgName,
      parent: parentOrg,
      leaderId: selectedLeader?.id || null,
      memberIds: selectedMembers.map(m => m.id).join(',')
    }
    setIsDirty(JSON.stringify(initial) !== JSON.stringify(current))
  }, [organization, orgName, parentOrg, selectedLeader, selectedMembers])

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      if (isDirty) {
        setShowCloseConfirm(true)
        return
      }
      onClose()
      return
    }
  }

  const requestClose = () => {
    if (isDirty) {
      setShowCloseConfirm(true)
    } else {
      onClose()
    }
  }

  const confirmDiscardAndClose = () => {
    setShowCloseConfirm(false)
    onClose()
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {organization ? '조직 수정' : '조직 추가'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="orgName">조직 이름</Label>
              <Input
                id="orgName"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="조직 이름을 입력하세요"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentOrg">상위 조직</Label>
              <Select value={parentOrg || 'none'} onValueChange={(v) => setParentOrg(v === 'none' ? '' : v)}>
                <SelectTrigger>
                  <SelectValue placeholder="상위 조직 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">없음</SelectItem>
                  <SelectItem value="1">CEE</SelectItem>
                  <SelectItem value="2">Management</SelectItem>
                  <SelectItem value="3">Application 2</SelectItem>
                  <SelectItem value="6">Application 1</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>조직장 선택</Label>
              <Button
                variant="outline"
                onClick={() => setShowLeaderModal(true)}
                className="w-full justify-start cursor-pointer"
              >
                {selectedLeader ? `${selectedLeader.name} ${selectedLeader.role}` : '조직장 선택'}
              </Button>
              {selectedLeader && (
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800 cursor-pointer hover:bg-red-100"
                    onClick={removeLeader}
                  >
                    {selectedLeader.name} {selectedLeader.role}
                    <X
                      className="w-3 h-3 ml-1 cursor-pointer hover:text-red-500"
                      aria-label="조직장 제거"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeLeader()
                      }}
                    />
                  </Badge>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>조직원</Label>
              <Button
                variant="outline"
                onClick={() => setShowMemberModal(true)}
                className="w-full justify-start cursor-pointer"
              >
                조직원 추가
              </Button>
              {selectedMembers.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedMembers.map(member => (
                    <Badge
                      key={member.id}
                      variant="secondary"
                      className="bg-blue-100 text-blue-800 cursor-pointer hover:bg-red-100"
                      onClick={() => removeMember(member.id)}
                    >
                      {member.name} {member.role}
                      <X
                        className="w-3 h-3 ml-1 cursor-pointer hover:text-red-500"
                        aria-label={`${member.name} 제거`}
                        onClick={(e) => {
                          e.stopPropagation()
                          removeMember(member.id)
                        }}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between pt-6">
              <div className="flex gap-2">
                <Button variant="outline" onClick={requestClose} className="cursor-pointer">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  뒤로가기
                </Button>
                {organization && (
                  <Button variant="destructive" onClick={handleDeleteClick} className="cursor-pointer">
                    <Trash2 className="w-4 h-4 mr-2" />
                    삭제
                  </Button>
                )}
              </div>
              <Button 
                onClick={handleSave}
                disabled={!canSave}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
              >
                저장하기
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showCloseConfirm} onOpenChange={setShowCloseConfirm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">변경 사항이 저장되지 않았습니다</DialogTitle>
            <DialogDescription>
              저장하지 않은 변경 사항이 있습니다. 닫으시겠습니까?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setShowCloseConfirm(false)} className="cursor-pointer">취소</Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white cursor-pointer" onClick={confirmDiscardAndClose}>변경사항 저장하지 않고 닫기</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteWarn} onOpenChange={setShowDeleteWarn}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">삭제할 수 없습니다</DialogTitle>
            <DialogDescription>
              {deleteWarnMessage}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end pt-2">
            <Button variant="outline" onClick={() => setShowDeleteWarn(false)} className="cursor-pointer">확인</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">조직 삭제</DialogTitle>
            <DialogDescription>
              정말로 이 조직을 삭제하시겠습니까?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} className="cursor-pointer">취소</Button>
            <Button variant="destructive" onClick={performDelete} className="cursor-pointer">삭제</Button>
          </div>
        </DialogContent>
      </Dialog>

      <LeaderSelectionModal
        isOpen={showLeaderModal}
        onClose={() => setShowLeaderModal(false)}
        onSelect={handleLeaderSelect}
        selectedLeader={selectedLeader}
      />

      <MemberSelectionModal
        isOpen={showMemberModal}
        onClose={() => setShowMemberModal(false)}
        onSelect={handleMemberSelect}
        selectedMembers={selectedMembers}
      />
    </>
  )
} 