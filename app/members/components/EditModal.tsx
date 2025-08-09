"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
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
  ArrowLeft,
  Clock,
  ChevronDown,
  Check,
  X
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
  organizations: string[]
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
  workPolicies?: string[]
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
  const [workPolicyDropdownOpen, setWorkPolicyDropdownOpen] = useState(false)
  const [organizationDropdownOpen, setOrganizationDropdownOpen] = useState(false)

  const isOwnProfile = user?.email === employee?.email
  const canEdit = isOwnProfile || user?.isAdmin
  const canDelete = user?.isAdmin
  const canResetPassword = user?.isAdmin

  const workPolicies = [
    { id: 'fixed-9to6', label: '9-6 고정근무', description: '오전 9시 ~ 오후 6시 고정 근무', color: 'bg-blue-100 text-blue-800' },
    { id: 'flexible', label: '유연근무', description: '코어타임 내 자유로운 출퇴근', color: 'bg-green-100 text-green-800' },
    { id: 'autonomous', label: '자율근무', description: '업무 성과 기반 자율 근무', color: 'bg-purple-100 text-purple-800' },
    { id: 'remote', label: '재택근무', description: '원격 근무 가능', color: 'bg-orange-100 text-orange-800' },
    { id: 'hybrid', label: '하이브리드', description: '사무실 + 재택 혼합 근무', color: 'bg-indigo-100 text-indigo-800' }
  ]

  const organizations = [
    '개발팀', '디자인팀', '마케팅팀', '인사팀', '기획팀', '영업팀'
  ]

  useEffect(() => {
    if (employee) {
      setEditedEmployee({
        ...employee,
        workPolicies: employee.workPolicies || []
      })
      setTempPassword('')
    }
  }, [employee])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      
      if (workPolicyDropdownOpen && !target.closest('.work-policy-dropdown')) {
        setWorkPolicyDropdownOpen(false)
      }
      
      if (organizationDropdownOpen && !target.closest('.organization-dropdown')) {
        setOrganizationDropdownOpen(false)
      }
    }

    if (workPolicyDropdownOpen || organizationDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [workPolicyDropdownOpen, organizationDropdownOpen])

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
        window.dispatchEvent(new CustomEvent('employeeUpdated', { 
          detail: editedEmployee 
        }))
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

  const handleWorkPolicyToggle = (policyId: string) => {
    if (!editedEmployee) return
    const currentPolicies = editedEmployee.workPolicies || []
    const isSelected = currentPolicies.includes(policyId)
    let newPolicies: string[]
    
    if (isSelected) {
      newPolicies = currentPolicies.filter(id => id !== policyId)
    } else {
      newPolicies = [...currentPolicies, policyId]
    }
    
    setEditedEmployee({
      ...editedEmployee,
      workPolicies: newPolicies
    })
  }

  const handleOrganizationToggle = (orgName: string) => {
    if (!editedEmployee) return
    const currentOrgs = editedEmployee.organizations || []
    const isSelected = currentOrgs.includes(orgName)
    let newOrgs: string[]
    
    if (isSelected) {
      newOrgs = currentOrgs.filter(org => org !== orgName)
    } else {
      newOrgs = [...currentOrgs, orgName]
    }
    
    setEditedEmployee({
      ...editedEmployee,
      organizations: newOrgs
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
          <DialogDescription>
            구성원의 개인정보, 회사정보, 근무정책을 수정할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
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
                <Label>조직</Label>
                <div className="relative organization-dropdown">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() => setOrganizationDropdownOpen(!organizationDropdownOpen)}
                  >
                    <div className="flex items-center gap-2">
                      {editedEmployee?.organizations?.length && editedEmployee.organizations.length > 0 
                        ? `${editedEmployee.organizations?.length ?? 0}개 조직 선택됨`
                        : '조직을 선택하세요'
                      }
                    </div>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                  
                  {organizationDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                      {organizations.map((org) => (
                        <div
                          key={org}
                          className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleOrganizationToggle(org)}
                        >
                          <div className="w-4 h-4 border border-gray-300 rounded flex items-center justify-center">
                            {editedEmployee?.organizations?.includes(org) && (
                              <Check className="w-3 h-3 text-blue-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{org}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {editedEmployee?.organizations && editedEmployee.organizations.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {editedEmployee.organizations.map((org) => (
                      <Badge 
                        key={org} 
                        variant="secondary" 
                        className="flex items-center gap-1 cursor-pointer hover:bg-red-100"
                        onClick={() => handleOrganizationToggle(org)}
                      >
                        {org}
                        <X 
                          className="w-3 h-3 cursor-pointer hover:text-red-500" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOrganizationToggle(org);
                          }}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
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

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              근무 정책
            </h3>
            <div className="space-y-2">
              <Label>근무 정책 선택</Label>
              <div className="relative work-policy-dropdown">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-between"
                  onClick={() => setWorkPolicyDropdownOpen(!workPolicyDropdownOpen)}
                >
                  <div className="flex items-center gap-2">
                    {editedEmployee?.workPolicies && editedEmployee.workPolicies.length > 0
                      ? `${editedEmployee.workPolicies.length}개 정책 선택됨`
                      : '근무 정책을 선택하세요'
                    }
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </Button>
                {workPolicyDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                    {workPolicies.map((policy) => (
                      <div
                        key={policy.id}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleWorkPolicyToggle(policy.id)}
                      >
                        <div className="w-4 h-4 border border-gray-300 rounded flex items-center justify-center">
                          {editedEmployee?.workPolicies?.includes(policy.id) && (
                            <Check className="w-3 h-3 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{policy.label}</div>
                          <div className="text-sm text-gray-500">{policy.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {editedEmployee?.workPolicies && editedEmployee.workPolicies.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {editedEmployee.workPolicies.map((policyId) => {
                    const policy = workPolicies.find(p => p.id === policyId);
                    return policy ? (
                      <Badge
                        key={policyId}
                        variant="secondary"
                        className="flex items-center gap-1 cursor-pointer hover:bg-red-100"
                        onClick={() => {
                          setWorkPolicyDropdownOpen(false)
                          handleWorkPolicyToggle(policyId)
                        }}
                        role="button"
                        aria-label={`${policy.label} 정책 제거`}
                      >
                        {policy.label}
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-red-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            setWorkPolicyDropdownOpen(false)
                            handleWorkPolicyToggle(policyId)
                          }}
                        />
                      </Badge>
                    ) : null;
                  })}
                </div>
              )}
            </div>
          </div>

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