"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Edit3, 
  Clock, 
  Calendar as CalendarIcon,
  Building2,
  Crown,
  Shield
} from "lucide-react"
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import EditModal from './EditModal'

const workPolicies = [
  { id: 'fixed-9to6', label: '9-6 고정근무', description: '오전 9시 ~ 오후 6시 고정 근무', color: 'bg-blue-100 text-blue-800' },
  { id: 'flexible', label: '유연근무', description: '코어타임 내 자유로운 출퇴근', color: 'bg-green-100 text-green-800' },
  { id: 'autonomous', label: '자율근무', description: '업무 성과 기반 자율 근무', color: 'bg-purple-100 text-purple-800' },
  { id: 'remote', label: '재택근무', description: '원격 근무 가능', color: 'bg-orange-100 text-orange-800' },
  { id: 'hybrid', label: '하이브리드', description: '사무실 + 재택 혼합 근무', color: 'bg-indigo-100 text-indigo-800' }
];

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
  selfIntroduction?: string
  remainingLeave?: number
  weeklyWorkHours?: number
  workPolicies?: string[]
  weeklySchedule?: Array<{
    title: string
    date: string
    time?: string
  }>
}

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  employee: Employee | null
  onUpdate?: (updatedEmployee: Employee) => void
}

export default function ProfileModal({ isOpen, onClose, employee, onUpdate }: ProfileModalProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [editedEmployee, setEditedEmployee] = useState<Employee | null>(null)
  const [profileImage, setProfileImage] = useState<string>('')
  const [selfIntroduction, setSelfIntroduction] = useState<string>('')
  const [showEditModal, setShowEditModal] = useState(false)

  const isOwnProfile = user?.email === employee?.email
  const canEdit = isOwnProfile || user?.isAdmin
  const canEditProfileImage = isOwnProfile
  const canEditSelfIntroduction = isOwnProfile

  useEffect(() => {
    if (employee) {
      setEditedEmployee(employee)
      setProfileImage(employee.profileImage || '')
      setSelfIntroduction(employee.selfIntroduction || '')
    }
  }, [employee])

  useEffect(() => {
    const handleEmployeeUpdateEvent = (event: CustomEvent) => {
      const updatedEmployee = event.detail
      if (updatedEmployee.id === employee?.id) {
        setEditedEmployee(updatedEmployee)
        setProfileImage(updatedEmployee.profileImage || '')
        setSelfIntroduction(updatedEmployee.selfIntroduction || '')
      }
    }

    window.addEventListener('employeeUpdated', handleEmployeeUpdateEvent as EventListener)
    
    return () => {
      window.removeEventListener('employeeUpdated', handleEmployeeUpdateEvent as EventListener)
    }
  }, [employee?.id])

  const handleSave = async () => {
    if (!editedEmployee) return

    try {
      const updatedEmployee = {
        ...editedEmployee,
        profileImage,
        selfIntroduction
      }

      const response = await fetch(`/api/members`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEmployee),
      })

      const result = await response.json()

      if (result.success) {
        onUpdate?.(updatedEmployee)
        window.dispatchEvent(new CustomEvent('employeeUpdated', { 
          detail: updatedEmployee 
        }))
        setIsEditing(false)
        toast.success('프로필이 성공적으로 업데이트되었습니다.')
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      console.error('프로필 업데이트 오류:', error)
      toast.error('프로필 업데이트 중 오류가 발생했습니다.')
    }
  }

  const handleCancel = () => {
    if (employee) {
      setProfileImage(employee.profileImage || '')
      setSelfIntroduction(employee.selfIntroduction || '')
    }
    setIsEditing(false)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const newImageUrl = e.target?.result as string
        setProfileImage(newImageUrl)
        
        if (employee) {
          const updatedEmployee = {
            ...employee,
            profileImage: newImageUrl
          }
          
          console.log('이미지 업데이트 시작:', updatedEmployee.id)
          
          fetch(`/api/members`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedEmployee),
          })
          .then(response => {
            console.log('API 응답 상태:', response.status)
            return response.json()
          })
          .then(result => {
            console.log('API 응답 결과:', result)
            if (result.success) {
              onUpdate?.(updatedEmployee)
              window.dispatchEvent(new CustomEvent('employeeUpdated', { 
                detail: updatedEmployee 
              }))
              toast.success('프로필 이미지가 성공적으로 업데이트되었습니다.')
            } else {
              throw new Error(result.message || '저장에 실패했습니다.')
            }
          })
          .catch(error => {
            console.error('프로필 이미지 업데이트 오류:', error)
            toast.error(`프로필 이미지 업데이트 중 오류가 발생했습니다: ${error.message}`)
          })
        } else {
          console.error('employee가 없습니다.')
          toast.error('직원 정보를 찾을 수 없습니다.')
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEditClick = () => {
    setShowEditModal(true)
  }

  const handleEditModalClose = () => {
    setShowEditModal(false)
  }

  const handleEditUpdate = (updatedEmployee: Employee) => {
    onUpdate?.(updatedEmployee)
    setShowEditModal(false)
  }

  const handleEditDelete = (employeeId: string) => {
    onClose()
  }

  if (!employee) return null


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            프로필
          </DialogTitle>
          <DialogDescription>
            사용자의 프로필 정보를 확인하고 수정할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-start gap-6">
              <div className="relative">
                <Avatar className="w-24 h-24 bg-transparent">
                  <AvatarImage src={profileImage} alt={employee.name} className="bg-transparent" />
                  <AvatarFallback className="bg-transparent">
                    <User className="w-12 h-12" />
                  </AvatarFallback>
                </Avatar>
                {canEditProfileImage && (
                  <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                    <Edit3 className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">{editedEmployee?.name || employee.name}</h2>
                  {(editedEmployee?.isAdmin || employee.isAdmin) && (
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      <Crown className="w-3 h-3 mr-1" />
                      관리자
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-1 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{editedEmployee?.email || employee.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{editedEmployee?.phone || employee.phone || '전화번호 없음'}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {(
                    editedEmployee?.organizations 
                      ?? employee.organizations 
                      ?? (editedEmployee?.organization 
                          ? [editedEmployee.organization] 
                          : (employee.organization ? [employee.organization] : []))
                  ).map((org, idx) => (
                    <Badge key={`${org}-${idx}`} variant="secondary" className="bg-blue-100 text-blue-800">
                      {org}
                    </Badge>
                  ))}
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {editedEmployee?.position || employee.position}
                  </Badge>
                  {(editedEmployee?.teams || employee.teams).map((team, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {team}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">상세정보</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start gap-2 md:col-span-1">
                  <Calendar className="w-4 h-4 text-gray-500 mt-0.5" />
                  <span className="text-sm text-gray-600">입사일:</span>
                  <span className="text-sm font-medium">{editedEmployee?.joinDate || employee.joinDate}</span>
                </div>
                                 <div className="flex items-start gap-2 md:col-span-2">
                   <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                   <div className="flex-1">
                     <div className="flex items-start gap-2">
                       <span className="text-sm text-gray-600 whitespace-nowrap">주소:</span>
                       <div className="text-sm font-medium break-words flex-1">{editedEmployee?.address || employee.address || '주소 없음'}</div>
                     </div>
                   </div>
                 </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                근무 정책
              </h3>
              <div className="flex flex-wrap gap-2">
                {employee.workPolicies && employee.workPolicies.length > 0 ? (
                  employee.workPolicies.map((policyId) => {
                    const policy = workPolicies.find(p => p.id === policyId);
                    return policy ? (
                      <Badge 
                        key={policyId} 
                        className={`${policy.color} border-0 px-3 py-1`}
                      >
                        {policy.label}
                      </Badge>
                    ) : null;
                  })
                ) : (
                  <p className="text-gray-500 text-sm">설정된 근무 정책이 없습니다.</p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">자기소개</h3>
                {canEditSelfIntroduction && !isEditing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="p-1 h-auto cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              {isEditing && canEditSelfIntroduction ? (
                <Textarea
                  value={selfIntroduction}
                  onChange={(e) => setSelfIntroduction(e.target.value)}
                  placeholder="자기소개를 입력하세요..."
                  className="min-h-[100px]"
                />
              ) : (
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                  {employee.selfIntroduction || '자기소개가 없습니다.'}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                <div className="text-3xl font-bold">
                  {employee.remainingLeave || 12}일
                </div>
                <div className="text-sm opacity-90">남은 연차</div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
                <div className="text-3xl font-bold">
                  {employee.weeklyWorkHours || 42}h
                </div>
                <div className="text-sm opacity-90">이번 주 근무시간</div>
              </div>
            </div>

            <div 
              onClick={() => router.push('/work')} 
              className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg cursor-pointer hover:from-blue-100 hover:to-blue-200 transition-colors"
            >
              {(() => {
                // 현재 날짜 기준으로 이번 주의 날짜들 계산
                const today = new Date();
                const currentDay = today.getDay(); // 0: 일요일, 1: 월요일, ..., 6: 토요일
                const monday = new Date(today);
                monday.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1)); // 이번 주 월요일

                const weekDates = [...Array(7)].map((_, i) => {
                  const date = new Date(monday);
                  date.setDate(monday.getDate() + i);
                  return date;
                });

                const month = weekDates[0].getMonth() + 1; // 주의 시작일 기준 월

                return (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-900">근무 일정</h3>
                      </div>
                      <div className="text-sm font-medium text-gray-600">{month}월</div>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-2">
                      {weekDates.map((date, i) => {
                        const isToday = date.toDateString() === today.toDateString();
                        const workHours = date.getDay() === 0 || date.getDay() === 6 ? 0 : 8; // 주말은 0시간, 평일은 8시간

                        return (
                          <div key={i} className="text-center">
                            <div className={`text-xs mb-1 ${isToday ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>
                              {date.getDate()}
                            </div>
                            <div className="h-32 w-3 mx-auto bg-blue-50 rounded-full relative overflow-hidden">
                              {workHours > 0 && (
                                <div 
                                  className="absolute w-full bg-blue-500"
                                  style={{
                                    top: '0',
                                    height: '100%',
                                    opacity: 0.15
                                  }}
                                />
                              )}
                              {workHours > 0 && (
                                <div 
                                  className="absolute w-full bg-blue-500"
                                  style={{
                                    top: `${(24 - workHours) * (100/24)}%`,
                                    height: `${workHours * (100/24)}%`
                                  }}
                                />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>

        {canEdit && (
          <div className="flex justify-center mt-8">
            {isEditing ? (
              <div className="flex gap-2">
                <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
                  저장하기
                </Button>
                <Button variant="outline" onClick={handleCancel} className="cursor-pointer">
                  취소
                </Button>
              </div>
            ) : (
              <Button 
                onClick={handleEditClick}
                className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                수정하기
              </Button>
            )}
          </div>
        )}
      </DialogContent>

      <EditModal
        isOpen={showEditModal}
        onClose={handleEditModalClose}
        employee={{
          ...employee,
          organizations:
            employee.organizations ?? (employee.organization ? [employee.organization] : []),
        }}
        onUpdate={handleEditUpdate}
        onDelete={handleEditDelete}
      />
    </Dialog>
  )
} 