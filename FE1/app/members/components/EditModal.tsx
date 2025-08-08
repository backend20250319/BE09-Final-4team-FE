"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Building2,
  Crown,
  Shield,
  Copy,
  RefreshCw,
  Trash2,
  ArrowLeft
} from "lucide-react"
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'

interface Employee {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  joinDate: string
  organization: string
  position: string
  role: string
  job: string
  rank?: string
  isAdmin: boolean
  teams: string[]
  profileImage?: string
  selfIntroduction?: string
  remainingLeave?: number
  weeklyWorkHours?: number
  weeklySchedule?: Array<{
    title: string
    date: string
    time?: string
  }>
}

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  employee: Employee | null
  onUpdate?: (updatedEmployee: Employee) => void
  onDelete?: (employeeId: string) => void
}

export default function EditModal({ isOpen, onClose, employee, onUpdate, onDelete }: EditModalProps) {
  const { user } = useAuth()
  const [editedEmployee, setEditedEmployee] = useState<Employee | null>(null)
  const [tempPassword, setTempPassword] = useState<string>('')
  const [isGeneratingPassword, setIsGeneratingPassword] = useState(false)

  // 권한 체크
  const isOwnProfile = user?.email === employee?.email
  const canEdit = isOwnProfile || user?.isAdmin
  const canDelete = user?.isAdmin
  const canResetPassword = user?.isAdmin

  useEffect(() => {
    if (employee) {
      setEditedEmployee(employee)
      setTempPassword('')
    }
  }, [employee])

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
    let result = ''
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const handleGeneratePassword = () => {
    setIsGeneratingPassword(true)
    setTimeout(() => {
      const newPassword = generateRandomPassword()
      setTempPassword(newPassword)
      setIsGeneratingPassword(false)
      toast.success('임시 비밀번호가 생성되었습니다.')
    }, 500)
  }

  const handleCopyPassword = async () => {
    try {
      await navigator.clipboard.writeText(tempPassword)
      toast.success('비밀번호가 클립보드에 복사되었습니다.')
    } catch (error) {
      toast.error('클립보드 복사에 실패했습니다.')
    }
  }

  const handleSave = async () => {
    if (!editedEmployee) return

    try {
      // API 호출하여 업데이트
      const response = await fetch(`/api/members`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedEmployee),
      })

      const result = await response.json()

      if (result.success) {
        onUpdate?.(editedEmployee)
        onClose()
        toast.success('구성원 정보가 성공적으로 업데이트되었습니다.')
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      console.error('구성원 업데이트 오류:', error)
      toast.error('구성원 업데이트 중 오류가 발생했습니다.')
    }
  }

  const handleDelete = async () => {
    if (!employee || !canDelete) return

    if (!confirm('정말로 이 구성원을 삭제하시겠습니까?')) return

    try {
      const response = await fetch(`/api/members?id=${employee.id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        onDelete?.(employee.id)
        onClose()
        toast.success('구성원이 성공적으로 삭제되었습니다.')
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      console.error('구성원 삭제 오류:', error)
      toast.error('구성원 삭제 중 오류가 발생했습니다.')
    }
  }

  const handleInputChange = (field: keyof Employee, value: string | boolean | string[]) => {
    if (!editedEmployee) return
    setEditedEmployee({
      ...editedEmployee,
      [field]: value
    })
  }

  if (!employee || !canEdit) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            구성원 정보 수정
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 기본 정보 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">기본 정보</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  value={editedEmployee?.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="이름을 입력하세요"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  value={editedEmployee?.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="이메일을 입력하세요"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">전화번호</Label>
                <Input
                  id="phone"
                  value={editedEmployee?.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="전화번호를 입력하세요"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">주소</Label>
                <Input
                  id="address"
                  value={editedEmployee?.address || ''}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="주소를 입력하세요"
                />
              </div>
            </div>
          </div>

          {/* 회사 정보 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">회사 정보</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="joinDate">입사일</Label>
                <Input
                  id="joinDate"
                  type="date"
                  value={editedEmployee?.joinDate || ''}
                  onChange={(e) => handleInputChange('joinDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="organization">조직</Label>
                <Select
                  value={editedEmployee?.organization || ''}
                  onValueChange={(value) => handleInputChange('organization', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="조직을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="경영진">경영진</SelectItem>
                    <SelectItem value="개발본부">개발본부</SelectItem>
                    <SelectItem value="마케팅팀">마케팅팀</SelectItem>
                    <SelectItem value="영업팀">영업팀</SelectItem>
                    <SelectItem value="인사팀">인사팀</SelectItem>
                    <SelectItem value="경영팀">경영팀</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">직위</Label>
                <Select
                  value={editedEmployee?.position || ''}
                  onValueChange={(value) => handleInputChange('position', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="직위를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CEO">CEO</SelectItem>
                    <SelectItem value="CTO">CTO</SelectItem>
                    <SelectItem value="CFO">CFO</SelectItem>
                    <SelectItem value="팀장">팀장</SelectItem>
                    <SelectItem value="과장">과장</SelectItem>
                    <SelectItem value="대리">대리</SelectItem>
                    <SelectItem value="사원">사원</SelectItem>
                    <SelectItem value="인턴">인턴</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="job">직책</Label>
                <Input
                  id="job"
                  value={editedEmployee?.job || ''}
                  onChange={(e) => handleInputChange('job', e.target.value)}
                  placeholder="직책을 입력하세요"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rank">직급</Label>
                <Select
                  value={editedEmployee?.rank || ''}
                  onValueChange={(value) => handleInputChange('rank', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="직급을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="사장">사장</SelectItem>
                    <SelectItem value="부사장">부사장</SelectItem>
                    <SelectItem value="이사">이사</SelectItem>
                    <SelectItem value="부장">부장</SelectItem>
                    <SelectItem value="차장">차장</SelectItem>
                    <SelectItem value="과장">과장</SelectItem>
                    <SelectItem value="대리">대리</SelectItem>
                    <SelectItem value="주임">주임</SelectItem>
                    <SelectItem value="사원">사원</SelectItem>
                    <SelectItem value="인턴">인턴</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* 임시 비밀번호 재설정 (관리자만) */}
          {canResetPassword && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">임시 비밀번호 재설정</h3>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={tempPassword}
                    placeholder="임시 비밀번호가 여기에 표시됩니다"
                    readOnly
                  />
                  <Button
                    onClick={handleGeneratePassword}
                    disabled={isGeneratingPassword}
                    variant="outline"
                    size="sm"
                  >
                    {isGeneratingPassword ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    onClick={handleCopyPassword}
                    disabled={!tempPassword}
                    variant="outline"
                    size="sm"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  생성된 임시 비밀번호는 구성원에게 전달해주세요.
                </p>
              </div>
            </div>
          )}

          {/* 버튼들 */}
          <div className="flex justify-between pt-6">
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                뒤로가기
              </Button>
              {canDelete && (
                <Button variant="destructive" onClick={handleDelete}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  삭제
                </Button>
              )}
            </div>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              저장하기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 