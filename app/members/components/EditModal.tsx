"use client"

import { useState, useEffect, useRef } from 'react'
import styles from './date-input.module.css'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import SimpleDropdown from "./SimpleDropdown"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
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
  const joinDateRef = useRef<HTMLInputElement | null>(null)
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

  const jobs = [
    '프론트엔드 개발', '백엔드 개발', 'UI/UX 디자인', '디지털 마케팅',
    '제품 기획', '영업 관리', '인사 관리', '시스템 관리'
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
    const currentSelected = editedEmployee.workPolicies && editedEmployee.workPolicies[0] ? editedEmployee.workPolicies[0] : null
    const newPolicies: string[] = currentSelected === policyId ? [] : [policyId]

    setEditedEmployee({
      ...editedEmployee,
      workPolicies: newPolicies
    })
    setWorkPolicyDropdownOpen(false)
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
      <DialogContent className="max-w-[75vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            구성원 정보 수정
          </DialogTitle>
          <DialogDescription>
            구성원의 개인정보, 조직정보, 근무정책을 수정할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-5">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  기본 정보
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">이름 *</Label>
                    <Input
                      id="name"
                      value={editedEmployee?.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="이름을 입력하세요"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">이메일 *</Label>
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
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  조직 정보
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>조직 *</Label>
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
                    <Label htmlFor="rank">직급</Label>
                    <SimpleDropdown
                      options={["사원","대리","과장","차장","부장","팀장","이사","대표"]}
                      value={editedEmployee?.rank || ''}
                      onChange={(value) => handleInputChange('rank', value)}
                      placeholder="선택(선택사항)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position">직위</Label>
                    <SimpleDropdown
                      options={["CEO","COO","CTO","CPO","CMO","VP","Director","Head","Manager"]}
                      value={editedEmployee?.position || ''}
                      onChange={(value) => handleInputChange('position', value)}
                      placeholder="선택(선택사항)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="job">직책</Label>
                    <SimpleDropdown
                      options={jobs}
                      value={editedEmployee?.job || ''}
                      onChange={(value) => handleInputChange('job', value)}
                      placeholder="선택(선택사항)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">직무</Label>
                    <Input
                      id="role"
                      value={editedEmployee?.role || ''}
                      onChange={(e) => handleInputChange('role', e.target.value)}
                      placeholder="직무를 입력하세요"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  계정 정보
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="joinDate">입사일 *</Label>
                    <div
                      className="relative"
                      onPointerDown={() => {
                        const input = joinDateRef.current
                        if (!input) return
                        input.focus()
                        try {
                          input.showPicker?.()
                        } catch {}
                        input.click()
                      }}
                    >
                      <Input
                        id="joinDate"
                        ref={joinDateRef}
                        type="date"
                        placeholder="연도-월-일"
                        value={editedEmployee?.joinDate || ''}
                        onChange={(e) => handleInputChange('joinDate', e.target.value)}
                        className={`cursor-pointer ${styles.dateInput}`}
                      />
                      <button
                        type="button"
                        aria-label="달력 열기"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                        // wrapper handles opening
                      >
                        <Calendar className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>관리자 권한</Label>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={editedEmployee?.isAdmin}
                        onCheckedChange={(checked) => handleInputChange('isAdmin', checked)}
                        className="cursor-pointer"
                      />
                      <span className="text-sm text-gray-600">관리자 권한 부여</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>근무 정책</Label>
                    <div className="relative work-policy-dropdown">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full justify-between"
                        onClick={() => setWorkPolicyDropdownOpen(!workPolicyDropdownOpen)}
                      >
                        <div className="flex items-center gap-2">
                          {editedEmployee?.workPolicies && editedEmployee.workPolicies.length > 0
                            ? (workPolicies.find(p => p.id === (editedEmployee?.workPolicies?.[0] ?? ''))?.label ?? '근무 정책을 선택하세요')
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
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{policy.label}</div>
                            <div className="text-sm text-gray-500">{policy.description}</div>
                          </div>
                        </div>
                      ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {canResetPassword && (
                    <div className="space-y-2">
                      <Label>임시 비밀번호 재설정</Label>
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
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

            <div className="flex justify-between pt-6 border-t">
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
        </DialogContent>
      </Dialog>
  )
}