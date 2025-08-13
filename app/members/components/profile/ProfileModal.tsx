"use client"

import React, { useEffect, useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  X,
  Calendar as CalendarIcon,
  Briefcase,
  User,
  Mail,
  Phone,
  Crown,
  Edit3,
  Shield,
  Users,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"
import { useOrganizationsList, useTitlesFromMembers } from "@/hooks/use-members-derived-data"

import modalStyles from "../members-modal.module.css"

import { MemberProfile, TeamInfo, WorkPolicy } from "./types"
import OrganizationBlock from "./OrganizationBlock"
import DetailBlock from "./DetailBlock"
import PolicyBlock from "./PolicyBlock"
import IntroBlock from "./IntroBlock"
import EditModal from "../EditModal"

interface Props {
  isOpen: boolean
  onClose: () => void
  employee: MemberProfile | null
  onUpdate?: (updatedEmployee: MemberProfile) => void
}

const workPolicies: WorkPolicy[] = [
  { id: "fixed-9to6", label: "9-6 고정근무", description: "오전 9시 ~ 오후 6시 고정 근무", color: "bg-blue-100 text-blue-800" },
  { id: "flexible", label: "유연근무", description: "코어타임 내 자유로운 출퇴근", color: "bg-green-100 text-green-800" },
  { id: "autonomous", label: "자율근무", description: "업무 성과 기반 자율 근무", color: "bg-purple-100 text-purple-800" },
  { id: "remote", label: "재택근무", description: "원격 근무 가능", color: "bg-orange-100 text-orange-800" },
  { id: "hybrid", label: "하이브리드", description: "사무실 + 재택 혼합 근무", color: "bg-indigo-100 text-indigo-800" },
]

export default function ProfileModal({ isOpen, onClose, employee, onUpdate }: Props) {
  const { user } = useAuth()
  const { organizations: orgOptions } = useOrganizationsList()
  const { ranks, positions, jobs, roles, loading: titleLoading } = useTitlesFromMembers()

  const [isEditing, setIsEditing] = useState(false)
  const [isEditingIntro, setIsEditingIntro] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [profileImage, setProfileImage] = useState<string>("")
  const [selfIntroduction, setSelfIntroduction] = useState<string>("")
  const [editedEmployee, setEditedEmployee] = useState<MemberProfile | null>(null)

  const [formState, setFormState] = useState<Partial<MemberProfile>>({})
  const [concurrentTeamIds, setConcurrentTeamIds] = useState<string[]>([])
  const [mainTeamId, setMainTeamId] = useState<string | null>(null)

  const isOwnProfile = user?.email === employee?.email
  const canEdit = true
  const canEditProfileImage = true

  useEffect(() => {
    if (!employee) return
    setEditedEmployee(employee)
    setFormState({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      joinDate: employee.joinDate,
      address: employee.address,
      workPolicies: employee.workPolicies || [],
      intro: employee.selfIntroduction || employee.intro,
    })
    setProfileImage(employee.profileImage || employee.avatarUrl || "")
    setSelfIntroduction(employee.selfIntroduction || "")

    const orgs = employee.organizations ?? (employee.organization ? [employee.organization] : [])
    setMainTeamId(orgs[0] || null)
    setConcurrentTeamIds(orgs.slice(1))
  }, [employee])

  const handleMainChange = (teamId: string | null) => {
    setMainTeamId(teamId)
    setConcurrentTeamIds((prev) => prev.filter((id) => id !== teamId))
  }

  const handleConcurrentChange = (teamIds: string[]) => {
    const filtered = teamIds.filter((id) => id !== mainTeamId)
    setConcurrentTeamIds(filtered)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !employee) return
    
    const reader = new FileReader()
    reader.onload = (ev) => {
             const img = new Image()
       img.onload = () => {
         const canvas = document.createElement('canvas')
         const ctx = canvas.getContext('2d')
         const size = 512
         
         canvas.width = size
         canvas.height = size
         
                                         if (ctx) {
                       ctx.fillStyle = '#ffffff'
                       ctx.fillRect(0, 0, size, size)
                       
                       const scale = Math.max(size / img.width, size / img.height)
                       const scaledWidth = img.width * scale
                       const scaledHeight = img.height * scale
                       const x = (size - scaledWidth) / 2
                       const y = (size - scaledHeight) / 2
                       
                       ctx.drawImage(img, x, y, scaledWidth, scaledHeight)
           
           const croppedImageUrl = canvas.toDataURL('image/jpeg', 0.8)
          setProfileImage(croppedImageUrl)
          const updatedEmployee = { ...employee, profileImage: croppedImageUrl }
          onUpdate?.(updatedEmployee)
          window.dispatchEvent(
            new CustomEvent("employeeUpdated", {
              detail: updatedEmployee,
            }) as Event
          )
          toast.success("프로필 이미지가 성공적으로 업데이트되었습니다.")
        }
      }
      img.src = ev.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    if (!editedEmployee) return
    setLoading(true)
    try {
      const updatedEmployee: MemberProfile = {
        ...editedEmployee,
        ...formState,
        profileImage,
        selfIntroduction,
        organizations: [mainTeamId, ...concurrentTeamIds].filter(Boolean) as string[],
      } as MemberProfile

      onUpdate?.(updatedEmployee)
      window.dispatchEvent(
        new CustomEvent("employeeUpdated", { detail: updatedEmployee }) as Event
      )
      setIsEditing(false)
      setIsEditingIntro(false)
      toast.success("프로필이 성공적으로 업데이트되었습니다.")
    } catch (e) {
      toast.error("프로필 업데이트 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (!employee) return
    setProfileImage(employee.profileImage || employee.avatarUrl || "")
    setSelfIntroduction(employee.selfIntroduction || "")
    const orgs = employee.organizations ?? (employee.organization ? [employee.organization] : [])
    setMainTeamId(orgs[0] || null)
    setConcurrentTeamIds(orgs.slice(1))
    setIsEditing(false)
    setIsEditingIntro(false)
  }

  const teamsOptions: TeamInfo[] = (orgOptions || []).map((org) => ({
    teamId: org,
    name: org,
  }))

  const selectedMainTeam = teamsOptions.find((t) => t.teamId === mainTeamId) || null
  const selectedConcurrentTeams = teamsOptions.filter((t) => concurrentTeamIds.includes(t.teamId))

  const handleFormChange = (values: Partial<MemberProfile>) => {
    setFormState((prev) => ({ ...prev, ...values }))
    if (editedEmployee) {
      setEditedEmployee((prev) => ({ ...prev!, ...values }))
    }
  }

  if (!employee) return null

  const currentUserData: MemberProfile = {
    ...employee,
    ...(editedEmployee || {}),
    ...formState,
    profileImage,
    avatarUrl: profileImage,
    selfIntroduction,
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        data-hide-default-close
        className={`max-w-6xl w-[96vw] max-h-screen bg-white text-gray-900 border border-gray-200 shadow-2xl ${modalStyles.membersModal} p-0 flex flex-col overflow-hidden`}
      >
        {/* Header */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition"
              onClick={onClose}
              aria-label="뒤로가기"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1 text-center">
              <h2 className="text-2xl font-bold text-gray-900">프로필</h2>
              <p className="text-sm text-gray-500 mt-1">구성원 정보를 확인하고 편집할 수 있습니다.</p>
            </div>
            <div className="flex items-center gap-2">
              {canEdit && (
                (isEditing || isEditingIntro) ? (
                  <>
                    <Button
                      onClick={handleSave}
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                    >
                      {loading ? "저장 중..." : "저장하기"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      disabled={loading}
                      className="bg-white hover:bg-gray-50 border-gray-300 text-gray-900 px-4 py-2 rounded-lg"
                    >
                      취소
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => setIsEditModalOpen(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                  >
                    편집하기
                  </Button>
                )
              )}
              <button
                type="button"
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition"
                onClick={onClose}
                aria-label="닫기"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content without internal scroll: 1→2→3 columns responsive */}
        <div className="flex-1 overflow-hidden">
          <div className="px-6 py-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-800 text-sm md:text-base">
                             {/* Left column */}
               <div className="flex flex-col gap-4">
                                   {/* Profile card */}
                  <div className="bg-white shadow p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="w-24 h-24">
                          <AvatarImage src={currentUserData.avatarUrl || currentUserData.profileImage} alt={currentUserData.name} />
                          <AvatarFallback className="bg-gray-100 text-gray-600 text-2xl">
                            <User className="w-12 h-12" />
                          </AvatarFallback>
                        </Avatar>
                        {canEditProfileImage && (
                          <div className="absolute -bottom-2 -right-2">
                            <label htmlFor="profile-image-input" className="cursor-pointer">
                              <div className="bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded-full shadow-lg transition-colors">
                                <Edit3 className="w-4 h-4" />
                              </div>
                              <input
                                id="profile-image-input"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                              />
                            </label>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-lg font-semibold mb-2">{currentUserData.name}</div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span className="break-all">{currentUserData.email}</span>
                          </div>
                          {currentUserData.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              <span>{currentUserData.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                 <div className="bg-white shadow p-4 rounded-lg border border-gray-200">
                   <div className="text-gray-700 font-semibold mb-3">상세 정보</div>
                   <DetailBlock joinDate={employee.joinDate} address={employee.address} isEditing={isEditing} formValues={{ joinDate: formState.joinDate, address: formState.address }} onChange={handleFormChange} />
                 </div>
                  <div className="bg-white shadow p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-gray-700 font-semibold">자기소개</div>
                      {canEdit && (
                        isEditingIntro ? (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={handleSave}
                              disabled={loading}
                              className="text-xs px-2 py-1 h-auto bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              {loading ? "저장 중..." : "저장"}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleCancel}
                              disabled={loading}
                              className="text-xs px-2 py-1 h-auto bg-white hover:bg-gray-50 border-gray-300 text-gray-700"
                            >
                              취소
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditingIntro(!isEditingIntro)}
                            className="text-xs px-2 py-1 h-auto bg-white hover:bg-gray-50 border-gray-300 text-gray-700"
                          >
                            <Edit3 className="w-3 h-3 mr-1" />
                            수정
                          </Button>
                        )
                      )}
                    </div>
                    <IntroBlock intro={selfIntroduction} isEditing={isEditingIntro} onChange={(intro) => setSelfIntroduction(intro)} />
                  </div>
               </div>

               <div className="flex flex-col gap-4">
                 {/* Schedule */}
                 <div className="bg-white shadow p-4 rounded-lg border border-gray-200">
                   <div className="text-gray-700 font-semibold mb-3">근무 일정</div>
                   <div className="flex items-end justify-between gap-2 h-20">
                     {(() => {
                       const today = new Date()
                       const currentDay = today.getDay()
                       const monday = new Date(today)
                       monday.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1))
                       const workHours = ["0h", "8h", "8h", "8h", "8h", "8h", "0h"]
                       return [...Array(7)].map((_, i) => {
                         const date = new Date(monday)
                         date.setDate(monday.getDate() + i)
                         const isToday = date.toDateString() === today.toDateString()
                         const isWeekend = date.getDay() === 0 || date.getDay() === 6
                         const height = isWeekend ? "25%" : "100%"
                         const dayIndex = date.getDay()
                         return (
                           <div key={i} className="flex-1 flex flex-col items-center">
                             <div className={`text-xs mb-1 ${isToday ? "text-blue-600 font-bold" : "text-gray-600"}`}>{workHours[dayIndex]}</div>
                             <div className={`w-full rounded-t-sm ${isToday ? "bg-blue-500" : isWeekend ? "bg-gray-300" : "bg-gray-500"}`} style={{ height }} />
                             <div className={`text-xs mt-1 ${isToday ? "text-blue-600 font-bold" : "text-gray-500"}`}>{["일", "월", "화", "수", "목", "금", "토"][date.getDay()]}</div>
                           </div>
                         )
                       })
                     })()}
                   </div>
                 </div>
                 <div className="bg-white shadow p-4 rounded-lg border border-gray-200">
                   <div className="text-gray-500 text-sm mb-1">남은 연차</div>
                   <div className="text-2xl font-bold">{employee.remainingLeave || employee.remainingLeaveDays || 12}일</div>
                 </div>
                                   {/* This week hours */}
                  <div className="bg-white shadow p-4 rounded-lg border border-gray-200">
                    <div className="text-gray-500 text-sm mb-1">이번 주 근무시간</div>
                    <div className="text-2xl font-bold">{employee.weeklyWorkHours || employee.thisWeekHours || 42}h</div>
                  </div>
                 
               </div>

                                                           {/* Right column */}
                <div className="flex flex-col gap-4">
                  <div className="bg-white shadow p-4 rounded-lg border border-gray-200">
                    <div className="text-gray-700 font-semibold mb-3">조직 정보</div>
                    <OrganizationBlock main={selectedMainTeam} concurrent={selectedConcurrentTeams} isEditing={isEditing} onMainChange={handleMainChange} onConcurrentChange={handleConcurrentChange} teamsOptions={teamsOptions} user={employee} />
                  </div>

                  <div className="bg-white shadow p-4 rounded-lg border border-gray-200">
                    <div className="text-gray-700 font-semibold mb-3">근무 정책</div>
                    <PolicyBlock workPolicies={formState.workPolicies ?? employee.workPolicies} isEditing={isEditing} onChange={(policies) => handleFormChange({ workPolicies: policies })} availablePolicies={workPolicies} />
                  </div>
                </div>
            </div>
          </div>
        </div>

        <EditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          employee={employee as any}
          onUpdate={(updated) => {
            onUpdate?.(updated as any)
            window.dispatchEvent(new CustomEvent('employeeUpdated', { detail: updated }) as Event)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}


