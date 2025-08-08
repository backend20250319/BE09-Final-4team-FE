"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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

  useEffect(() => {
    if (organization) {
      setOrgName(organization.name)
      setParentOrg(organization.parentId || '')
      setSelectedLeader(organization.leader || null)
      setSelectedMembers(organization.members || [])
          } else {
        setOrgName('')
      setParentOrg('')
      setSelectedLeader(null)
      setSelectedMembers([])
    }
  }, [organization])

  const handleSave = () => {
    if (!orgName.trim()) {
      toast.error('조직 이름을 입력해주세요.')
      return
    }

    if (!selectedLeader) {
      toast.error('조직장을 선택해주세요.')
      return
    }

    if (selectedMembers.length === 0) {
      toast.error('최소 1명의 조직원을 선택해주세요.')
      return
    }

    const newOrg: Organization = {
      id: organization?.id || Date.now().toString(),
      name: orgName,
      parentId: parentOrg || undefined,
      members: selectedMembers,
      leader: selectedLeader
    }

    onSave(newOrg)
  }

  const handleDelete = () => {
    if (!organization) return

    if (organization.members.length > 0) {
      toast.error('조직원을 모두 이동시킨 후 삭제할 수 있습니다.')
      return
    }

    if (organization.children && organization.children.length > 0) {
      toast.error('하위 조직을 모두 삭제한 후 삭제할 수 있습니다.')
      return
    }

    if (confirm('정말로 이 조직을 삭제하시겠습니까?')) {
      toast.success('조직이 성공적으로 삭제되었습니다.')
      onClose()
    }
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

  const canSave = orgName.trim() && selectedLeader && selectedMembers.length > 0

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
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
              <Select value={parentOrg} onValueChange={setParentOrg}>
                <SelectTrigger>
                  <SelectValue placeholder="상위 조직 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">없음</SelectItem>
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
                className="w-full justify-start"
              >
                {selectedLeader ? `${selectedLeader.name} ${selectedLeader.role}` : '조직장 선택'}
              </Button>
              {selectedLeader && (
                <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {selectedLeader.name} {selectedLeader.role}
                  </Badge>
                  <button
                    onClick={removeLeader}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>조직원</Label>
              <Button
                variant="outline"
                onClick={() => setShowMemberModal(true)}
                className="w-full justify-start"
              >
                조직원 추가
              </Button>
              {selectedMembers.length > 0 && (
                <div className="space-y-2">
                  {selectedMembers.map(member => (
                    <div key={member.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {member.name} {member.role}
                      </Badge>
                      <button
                        onClick={() => removeMember(member.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between pt-6">
              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  뒤로가기
                </Button>
                {organization && canDelete && (
                  <Button variant="destructive" onClick={handleDelete}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    삭제
                  </Button>
                )}
              </div>
              <Button 
                onClick={handleSave} 
                disabled={!canSave}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                저장하기
              </Button>
            </div>
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