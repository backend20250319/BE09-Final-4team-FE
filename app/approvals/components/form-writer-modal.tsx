"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { GradientButton } from "@/components/ui/gradient-button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { colors, typography } from "@/lib/design-tokens"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  X,
  Plus,
  Trash2,
  Users,
  UserPlus,
  UserMinus,
  Loader2,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Send,
} from "lucide-react"
import { AttachmentsManager, Attachment } from "@/components/ui/attachments-manager"

// 타입 정의
interface User {
  id: string
  name: string
  avatar?: string
  position?: string
  department?: string
}



interface ApprovalStage {
  id: string
  name: string
  approvers: User[]
}

interface Reference {
  id: string
  name: string
  avatar?: string
  position: string
}

import { FormTemplate } from "./form-selection-modal"

interface FormWriterModalProps {
  isOpen: boolean
  onClose: () => void
  onBack: () => void
  formTemplate: FormTemplate | null
  onSubmit: (data: {
    content: string
    attachments: Attachment[]
    approvalStages: ApprovalStage[]
    references: Reference[]
  }) => Promise<void>
}

// 모바일용 접을 수 있는 섹션 컴포넌트
function CollapsibleSection({
  title,
  children,
  defaultOpen = false
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <h3 className={`${typography.h4} text-gray-800`}>{title}</h3>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className="px-4 pb-4">
          {children}
        </div>
      )}
    </div>
  )
}

// 승인 단계 관리 컴포넌트
function ApprovalStagesManager({
  stages,
  onStagesChange,
  availableUsers
}: {
  stages: ApprovalStage[]
  onStagesChange: (stages: ApprovalStage[]) => void
  availableUsers: User[]
}) {
  const [selectedApprover, setSelectedApprover] = useState<{[stageId: string]: string}>({});
  const addStage = () => {
    if (stages.length >= 5) return
    const newStage: ApprovalStage = {
      id: `stage-${Date.now()}`,
      name: `${stages.length + 1}단계`,
      approvers: []
    }
    onStagesChange([...stages, newStage])
  }

  const removeStage = (stageId: string) => {
    const filteredStages = stages.filter(stage => stage.id !== stageId)
    // 삭제 후 남은 단계들의 이름을 순서대로 재정렬
    const reorderedStages = filteredStages.map((stage, index) => ({
      ...stage,
      name: `${index + 1}단계`
    }))
    onStagesChange(reorderedStages)
  }

  const addApprover = (stageId: string, user: User) => {
    onStagesChange(stages.map(stage =>
      stage.id === stageId
        ? { ...stage, approvers: [...stage.approvers, user] }
        : stage
    ))
  }

  const removeApprover = (stageId: string, userId: string) => {
    onStagesChange(stages.map(stage =>
      stage.id === stageId
        ? { ...stage, approvers: stage.approvers.filter(approver => approver.id !== userId) }
        : stage
    ))
  }

  return (
    <div className="space-y-4">
      {stages.map((stage, index) => (
        <div key={stage.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-800">{stage.name}</h4>
            {stages.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeStage(stage.id)}
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* 승인자 목록 */}
          <div className="space-y-2 mb-3">
            {stage.approvers.map((approver) => (
              <div key={approver.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={approver.avatar} alt={approver.name} />
                    <AvatarFallback className="text-xs">
                      {approver.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{approver.name}</p>
                    <p className="text-xs text-gray-500">{approver.position}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeApprover(stage.id, approver.id)}
                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>

          {/* 승인자 추가 */}
          {(() => {
            const availableApprovers = availableUsers.filter(user => 
              !stage.approvers.some(approver => approver.id === user.id)
            );
            
            return availableApprovers.length > 0 ? (
              <Select 
                value={selectedApprover[stage.id] || ""} 
                onValueChange={(userId) => {
                  const user = availableUsers.find(u => u.id === userId)
                  if (user) {
                    addApprover(stage.id, user)
                    setSelectedApprover(prev => ({ ...prev, [stage.id]: "" }))
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="승인자 추가" />
                </SelectTrigger>
                <SelectContent>
                  {availableApprovers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="text-xs">
                            {user.name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.position}</p>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="w-full p-3 text-center text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-md">
                추가할 수 있는 승인자가 없습니다
              </div>
            )
          })()}
        </div>
      ))}

      {stages.length < 5 && (
        <Button
          variant="outline"
          onClick={addStage}
          className="w-full flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          승인 단계 추가
        </Button>
      )}
    </div>
  )
}

// 참조자 관리 컴포넌트
function ReferencesManager({
  references,
  onReferencesChange,
  availableUsers
}: {
  references: Reference[]
  onReferencesChange: (references: Reference[]) => void
  availableUsers: User[]
}) {
  const [selectedReference, setSelectedReference] = useState("");
  const addReference = (user: User) => {
    const reference: Reference = {
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      position: user.position || ""
    }
    onReferencesChange([...references, reference])
  }

  const removeReference = (referenceId: string) => {
    onReferencesChange(references.filter(ref => ref.id !== referenceId))
  }

  return (
    <div className="space-y-4">
      {/* 참조자 목록 */}
      <div className="space-y-2">
        {references.map((reference) => (
          <div key={reference.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={reference.avatar} alt={reference.name} />
                <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
                  {reference.name?.charAt(0) || "R"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-gray-800">{reference.name}</p>
                <p className="text-xs text-gray-500">{reference.position}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeReference(reference.id)}
              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        ))}
      </div>

      {/* 참조자 추가 */}
      {(() => {
        const availableReferences = availableUsers.filter(user => 
          !references.some(ref => ref.id === user.id)
        );
        
        return availableReferences.length > 0 ? (
          <Select 
            value={selectedReference} 
            onValueChange={(userId) => {
              const user = availableUsers.find(u => u.id === userId)
              if (user) {
                addReference(user)
                setSelectedReference("")
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="참조자 추가" />
            </SelectTrigger>
            <SelectContent>
              {availableReferences.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="text-xs">
                        {user.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.position}</p>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div className="w-full p-3 text-center text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-md">
            추가할 수 있는 참조자가 없습니다
          </div>
        )
      })()}
    </div>
  )
}



export function FormWriterModal({
  isOpen,
  onClose,
  onBack,
  formTemplate,
  onSubmit
}: FormWriterModalProps) {
  const [content, setContent] = useState("")
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [approvalStages, setApprovalStages] = useState<ApprovalStage[]>([
    {
      id: "stage-1",
      name: "1단계",
      approvers: []
    }
  ])
  const [references, setReferences] = useState<Reference[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 모달이 닫힐 때 상태 초기화
  useEffect(() => {
    if (!isOpen) {
      setContent("")
      setAttachments([])
      setApprovalStages([
        {
          id: "stage-1",
          name: "1단계",
          approvers: []
        }
      ])
      setReferences([])
    }
  }, [isOpen])

  // 사용 가능한 사용자 목록 (실제로는 API에서 가져옴)
  const availableUsers: User[] = [
    { id: "1", name: "김철수", position: "팀장", department: "개발팀" },
    { id: "2", name: "이영희", position: "과장", department: "마케팅팀" },
    { id: "3", name: "박민수", position: "대리", department: "영업팀" },
    { id: "4", name: "정수진", position: "사원", department: "인사팀" },
    { id: "5", name: "최동욱", position: "부장", department: "기획팀" },
  ]

  const handleSubmit = async () => {
    if (!content.trim()) {
      alert("내용을 입력해주세요.")
      return
    }

    if (approvalStages.some(stage => stage.approvers.length === 0)) {
      alert("모든 승인 단계에 승인자를 지정해주세요.")
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit({
        content,
        attachments,
        approvalStages,
        references
      })
      onClose()
    } catch (error) {
      console.error("문서 제출 중 오류:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!formTemplate) return null

  const IconComponent = formTemplate.icon

  return (
    <TooltipProvider>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="!max-w-6xl !w-[95vw] h-[85vh] flex flex-col p-0">
          <DialogHeader className="pb-0 px-6 pt-6 flex-shrink-0">
            <DialogTitle className="sr-only">{formTemplate.title}</DialogTitle>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="h-8 w-8 p-0"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-4 flex-1">
                <div className={`w-12 h-12 bg-gradient-to-r ${formTemplate.color} rounded-lg flex items-center justify-center shadow-sm flex-shrink-0`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className={`${typography.h3} text-gray-800 truncate`}>{formTemplate.title}</h2>
                  <p className="text-sm text-gray-600 truncate">{formTemplate.description}</p>
                </div>
              </div>
            </div>
          </DialogHeader>

          {/* 데스크톱 레이아웃 */}
          <div className="hidden lg:flex flex-1 overflow-hidden gap-6 p-6 pt-4 min-h-0">
            {/* 왼쪽 컬럼 - 메인 콘텐츠 */}
            <div className="flex-1 flex flex-col min-h-0 min-w-0">

              {/* 본문 작성 */}
              <div className="space-y-2 flex-1 flex flex-col min-h-0">
                <Textarea
                  placeholder="문서 내용을 작성하세요..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="flex-1 min-h-0 resize-none overflow-y-auto"
                />
              </div>

              {/* 첨부파일 */}
              <div className="space-y-2 flex-shrink-0 mt-4">
                <AttachmentsManager
                  attachments={attachments}
                  onAttachmentsChange={setAttachments}
                />
              </div>
            </div>

            {/* 오른쪽 컬럼 - 승인 단계 및 참조자 */}
            <div className="w-80 flex-shrink-0 flex flex-col min-h-0">
              <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50 rounded-lg p-4 min-h-0">
                {/* 승인 단계 */}
                <div className="space-y-3">
                  <h3 className={`${typography.h4} text-gray-800`}>승인 단계</h3>
                  <ApprovalStagesManager
                    stages={approvalStages}
                    onStagesChange={setApprovalStages}
                    availableUsers={availableUsers}
                  />
                </div>

                <Separator />

                {/* 참조자 */}
                <div className="space-y-3">
                  <h3 className={`${typography.h4} text-gray-800`}>참조자</h3>
                  <ReferencesManager
                    references={references}
                    onReferencesChange={setReferences}
                    availableUsers={availableUsers}
                  />
                </div>
              </div>

              {/* 결재 요청 버튼 */}
              <div className="mt-4 flex-shrink-0">
                <GradientButton
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 h-12"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  결재 요청하기
                </GradientButton>
              </div>
            </div>
          </div>

          {/* 모바일 레이아웃 */}
          <div className="lg:hidden flex-1 overflow-y-auto min-h-0">
            <div className="space-y-6 px-6 py-4">
              {/* 본문 작성 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">내용</label>
                <Textarea
                  placeholder="문서 내용을 작성하세요..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[200px] resize-none"
                />
              </div>

              {/* 승인 단계 */}
              <CollapsibleSection title="승인 단계" defaultOpen={true}>
                <ApprovalStagesManager
                  stages={approvalStages}
                  onStagesChange={setApprovalStages}
                  availableUsers={availableUsers}
                />
              </CollapsibleSection>

              {/* 참조자 */}
              <CollapsibleSection title="참조자">
                <ReferencesManager
                  references={references}
                  onReferencesChange={setReferences}
                  availableUsers={availableUsers}
                />
              </CollapsibleSection>

              {/* 첨부파일 */}
              <CollapsibleSection title="첨부파일">
                <div className="max-h-64 overflow-y-auto">
                  <AttachmentsManager
                    attachments={attachments}
                    onAttachmentsChange={setAttachments}
                  />
                </div>
              </CollapsibleSection>

              {/* 결재 요청 버튼 - 모바일에서는 하단 고정 */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 pt-4 mt-4">
                <GradientButton
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 h-12"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  결재 요청하기
                </GradientButton>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}
