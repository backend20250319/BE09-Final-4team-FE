"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import modalStyles from './members-modal.module.css'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Search, 
  User,
  ArrowLeft,
  X
} from "lucide-react"

interface Member {
  id: string
  name: string
  role: string
  email: string
  phone: string
}

interface MemberSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (members: Member[]) => void
  selectedMembers: Member[]
}

export default function MemberSelectionModal({ 
  isOpen, 
  onClose, 
  onSelect, 
  selectedMembers 
}: MemberSelectionModalProps) {
  const [members, setMembers] = useState<Member[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedMemberIds, setSelectedMemberIds] = useState<Set<string>>(
    new Set(selectedMembers.map(member => member.id))
  )

  useEffect(() => {
    const sampleMembers: Member[] = [
      { id: "1", name: "비니비니", role: "CEO", email: "binibini@hermesai.com", phone: "010-1234-5678" },
      { id: "2", name: "이혜빈", role: "CTO", email: "lee.hb@company.com", phone: "010-2345-6789" },
      { id: "3", name: "조석근", role: "Manager", email: "jo.sg@company.com", phone: "010-3456-7890" },
      { id: "4", name: "박준범", role: "Senior Engineer", email: "park.jb@company.com", phone: "010-4567-8901" },
      { id: "5", name: "김철수", role: "Manager", email: "kim.cs@company.com", phone: "010-5678-9012" },
      { id: "6", name: "이영희", role: "Senior Manager", email: "lee.yh@company.com", phone: "010-6789-0123" },
      { id: "7", name: "박준범", role: "Senior Engineer", email: "park.jb@company.com", phone: "010-7890-1234" },
      { id: "8", name: "이석진", role: "Senior Engineer", email: "lee.sj@company.com", phone: "010-8901-2345" },
      { id: "9", name: "정수민", role: "Engineer", email: "jung.sm@company.com", phone: "010-9012-3456" },
      { id: "10", name: "김미영", role: "Engineer", email: "kim.my@company.com", phone: "010-0123-4567" },
      { id: "11", name: "박지성", role: "Engineer", email: "park.js@company.com", phone: "010-1234-5678" },
      { id: "12", name: "이동욱", role: "Engineer", email: "lee.dw@company.com", phone: "010-2345-6789" },
      { id: "13", name: "최민수", role: "Senior Engineer", email: "choi.ms@company.com", phone: "010-3456-7890" },
      { id: "14", name: "김태영", role: "Engineer", email: "kim.ty@company.com", phone: "010-4567-8901" }
    ]
    setMembers(sampleMembers)
  }, [])

  const handleMemberClick = (member: Member) => {
    const newSelectedIds = new Set(selectedMemberIds)
    if (newSelectedIds.has(member.id)) {
      newSelectedIds.delete(member.id)
    } else {
      newSelectedIds.add(member.id)
    }
    setSelectedMemberIds(newSelectedIds)
  }

  const handleSave = () => {
    const selectedMembersList = members.filter(member => selectedMemberIds.has(member.id))
    onSelect(selectedMembersList)
  }

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 300)
    return () => clearTimeout(id)
  }, [searchTerm])

  useEffect(() => {
    setSelectedMemberIds(new Set(selectedMembers.map(m => m.id)))
  }, [selectedMembers, isOpen])

  const filteredMembers = members.filter(member => {
    if (!debouncedSearch) return true
    const term = debouncedSearch.toLowerCase()
    return (
      member.name.toLowerCase().includes(term) ||
      member.role.toLowerCase().includes(term)
    )
  })

  const hasSelectedMembers = selectedMemberIds.size > 0

  return (
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
              조직원 선택
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
              placeholder="조직원명을 입력하여 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredMembers.map(member => (
              <div
                key={member.id}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-colors ${
                  selectedMemberIds.has(member.id)
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => handleMemberClick(member)}
              >
                <Avatar className={`w-10 h-10 ${
                  selectedMemberIds.has(member.id) ? 'bg-blue-500' : 'bg-gray-300'
                }`}>
                  <AvatarImage src="" alt={member.name} />
                  <AvatarFallback className={selectedMemberIds.has(member.id) ? 'bg-blue-500 text-white' : ''}>
                    <User className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium text-sm">{member.name}</div>
                  <div className="text-xs text-gray-500">{member.role}</div>
                </div>
                <div className="text-right text-xs text-gray-500">
                  <div>{member.email}</div>
                  <div>{member.phone}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onClose}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              뒤로가기
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!hasSelectedMembers}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300"
            >
              저장하기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 