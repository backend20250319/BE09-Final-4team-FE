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
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
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
  CalendarDays,
  Download,
} from "lucide-react"
import { AttachmentsManager, Attachment } from "@/components/ui/attachments-manager"

// 로컬 타입 정의 (API 타입과 UI 적응을 위한 헬퍼 타입들)
interface LocalApprovalStage {
  id: string
  name: string
  approvers: UserResponseDto[]
}

interface LocalReference {
  id: string
  name: string
  avatar?: string
  position: string
}

import { 
  TemplateResponse, 
  TemplateFieldResponse, 
  FieldType, 
  AttachmentInfoResponse,
  AttachmentUsageType,
  ApprovalStageResponse,
  ApprovalStageRequest,
  ApprovalTargetRequest,
  TargetType,
  UserProfile,
  CreateDocumentRequest,
  DocumentFieldValueRequest
} from "@/lib/services/approval/types"
import { UserResponseDto } from "@/lib/services/user/types"
import { userApi } from "@/lib/services/user/api"
import { useCreateDocument } from "@/lib/hooks/useApproval"
import { TemplateIcon } from "@/components/ui/template-icon"

interface DocumentWriterModalProps {
  isOpen: boolean
  onClose: () => void
  onBack: () => void
  formTemplate: TemplateResponse | null
}

// 모바일용 접을 수 있는 섹션 컴포넌트
function CollapsibleSection({
  title,
  children,
  defaultOpen = false
}: {
  title: string | React.ReactNode
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
  stages: LocalApprovalStage[]
  onStagesChange: (stages: LocalApprovalStage[]) => void
  availableUsers: UserResponseDto[]
}) {
  const [selectedApprover, setSelectedApprover] = useState<{ [stageId: string]: string }>({});
  const addStage = () => {
    if (stages.length >= 5) return
    const newStage: LocalApprovalStage = {
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

  const addApprover = (stageId: string, user: UserResponseDto) => {
    onStagesChange(stages.map(stage =>
      stage.id === stageId
        ? { ...stage, approvers: [...stage.approvers, user] }
        : stage
    ))
  }

  const removeApprover = (stageId: string, userId: number) => {
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
                    <AvatarImage src={approver.profileImageUrl} alt={approver.name} />
                    <AvatarFallback className="text-xs">
                      {approver.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{approver.name}</p>
                    <p className="text-xs text-gray-500">{approver.position?.name || ""}</p>
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
                  const user = availableUsers.find(u => u.id === Number(userId))
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
                    <SelectItem key={user.id} value={user.id.toString()}>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={user.profileImageUrl} alt={user.name} />
                          <AvatarFallback className="text-xs">
                            {user.name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.position?.name || ""}</p>
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
  references: LocalReference[]
  onReferencesChange: (references: LocalReference[]) => void
  availableUsers: UserResponseDto[]
}) {
  const [selectedReference, setSelectedReference] = useState("");
  const addReference = (user: UserResponseDto) => {
    const reference: LocalReference = {
      id: user.id.toString(),
      name: user.name,
      avatar: user.profileImageUrl,
      position: user.position?.name || ""
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
          !references.some(ref => ref.id === user.id.toString())
        );

        return availableReferences.length > 0 ? (
          <Select
            value={selectedReference}
            onValueChange={(userId) => {
              const user = availableUsers.find(u => u.id === Number(userId))
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
                <SelectItem key={user.id} value={user.id.toString()}>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={user.profileImageUrl} alt={user.name} />
                      <AvatarFallback className="text-xs">
                        {user.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.position?.name || ""}</p>
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

// 참고파일 다운로드 컴포넌트
function ReferenceFilesManager({
  referenceFiles
}: {
  referenceFiles: AttachmentInfoResponse[]
}) {
  const handleDownload = (file: AttachmentInfoResponse) => {
    // 실제로는 파일 다운로드 로직 구현
    console.log("다운로드:", file.fileName, file.fileId)
    // 파일 다운로드를 위한 API 호출이 필요 (예: /api/files/${file.fileId}/download)
    const downloadUrl = `/api/files/${file.fileId}/download`
    window.open(downloadUrl, '_blank')
  }

  if (!referenceFiles || referenceFiles.length === 0) {
    return null
  }

  return (
    <TooltipProvider>
      <div className="space-y-3">
        {referenceFiles.map((file) => (
          <div key={file.fileId} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-blue-900 truncate">{file.fileName}</p>
              <p className="text-xs text-blue-700 mt-1">{(file.fileSize / 1024).toFixed(1)}KB • {file.contentType}</p>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownload(file)}
                  className="ml-3 text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{file.fileName}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        ))}
      </div>
    </TooltipProvider>
  )
}

// 필드별 입력 컴포넌트 렌더러
function FormFieldRenderer({
  field,
  value,
  onChange
}: {
  field: TemplateFieldResponse
  value: any
  onChange: (value: any) => void
}) {
  const handleMultiSelectChange = (optionValue: string, checked: boolean) => {
    const currentValues = Array.isArray(value) ? value : []
    if (checked) {
      onChange([...currentValues, optionValue])
    } else {
      onChange(currentValues.filter((v: string) => v !== optionValue))
    }
  }

  const formatMoney = (value: string) => {
    const number = value.replace(/[^\d]/g, '')
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  const handleMoneyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatMoney(e.target.value)
    onChange(formatted)
  }

  // 옵션 파싱 (API에서는 string으로 저장됨)
  const parseOptions = (optionsString?: string): string[] => {
    if (!optionsString) return []
    try {
      return JSON.parse(optionsString)
    } catch {
      return optionsString.split(',').map(opt => opt.trim()).filter(opt => opt.length > 0)
    }
  }

  const options = parseOptions(field.options)

  switch (field.fieldType) {
    case FieldType.TEXT:
      return (
        <Input
          type="text"
          placeholder={`${field.name}를 입력하세요`}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full"
        />
      )

    case FieldType.NUMBER:
      return (
        <Input
          type="number"
          placeholder={`${field.name}를 입력하세요`}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full"
        />
      )

    case FieldType.MONEY:
      return (
        <div className="relative">
          <Input
            type="text"
            placeholder={`${field.name}를 입력하세요`}
            value={value || ''}
            onChange={handleMoneyChange}
            className="w-full pr-10"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
            원
          </span>
        </div>
      )

    case FieldType.DATE:
      return (
        <div className="relative">
          <Input
            type="date"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full"
          />
          <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      )

    case FieldType.SELECT:
      return (
        <Select value={value || ''} onValueChange={onChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="옵션을 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )

    case FieldType.MULTISELECT:
      const selectedValues = Array.isArray(value) ? value : []
      return (
        <div className="space-y-2">
          {options.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={`${field.name}-${option}`}
                checked={selectedValues.includes(option)}
                onCheckedChange={(checked) => handleMultiSelectChange(option, !!checked)}
              />
              <Label
                htmlFor={`${field.name}-${option}`}
                className="text-sm font-normal"
              >
                {option}
              </Label>
            </div>
          ))}
        </div>
      )


    default:
      return null
  }
}

export function DocumentWriterModal({
  isOpen,
  onClose,
  onBack,
  formTemplate
}: DocumentWriterModalProps) {
  const [content, setContent] = useState("")
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [approvalStages, setApprovalStages] = useState<LocalApprovalStage[]>([
    {
      id: "stage-1",
      name: "1단계",
      approvers: []
    }
  ])
  const [references, setReferences] = useState<LocalReference[]>([])
  const [formFieldValues, setFormFieldValues] = useState<Record<string, any>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [availableUsers, setAvailableUsers] = useState<UserResponseDto[]>([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // useCreateDocument 훅 사용
  const createDocument = useCreateDocument()

  // 모달이 열릴 때 기본 콘텐츠 설정, 닫힐 때 상태 초기화
  useEffect(() => {
    if (isOpen && formTemplate) {
      // 모달이 열릴 때 템플릿의 기본 콘텐츠로 초기화
      setContent(formTemplate.defaultContent || "")
      setAttachments([])
      setApprovalStages([
        {
          id: "stage-1",
          name: "1단계",
          approvers: []
        }
      ])
      setReferences([])
      setFormFieldValues({})
    } else if (!isOpen) {
      // 모달이 닫힐 때 상태 초기화
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
      setFormFieldValues({})
    }
  }, [isOpen, formTemplate])

  // 사용 가능한 사용자 목록 로드
  useEffect(() => {
    const loadUsers = async () => {
      setUsersLoading(true)
      setError(null)
      try {
        const users = await userApi.getAllUsers()
        setAvailableUsers(users)
      } catch (error) {
        console.error("사용자 목록 로드 실패:", error)
        setError("사용자 목록을 불러오는데 실패했습니다.")
        setAvailableUsers([])
      } finally {
        setUsersLoading(false)
      }
    }

    if (isOpen) {
      loadUsers()
    }
  }, [isOpen])

  const handleSubmit = async () => {
    if (!formTemplate) return

    if (formTemplate.useBody && !content.trim()) {
      alert("내용을 입력해주세요.")
      return
    }

    if (approvalStages.some(stage => stage.approvers.length === 0)) {
      alert("모든 승인 단계에 승인자를 지정해주세요.")
      return
    }

    // 필수 필드 검증
    if (formTemplate.fields) {
      const missingFields = formTemplate.fields
        .filter(field => field.required)
        .filter(field => !formFieldValues[field.name] ||
          (Array.isArray(formFieldValues[field.name]) && formFieldValues[field.name].length === 0)
        )

      if (missingFields.length > 0) {
        alert(`다음 필수 필드를 입력해주세요: ${missingFields.map(f => f.name).join(', ')}`)
        return
      }
    }

    // 첨부파일 필수 검증
    if (formTemplate.useAttachment === AttachmentUsageType.REQUIRED && attachments.length === 0) {
      alert("첨부파일을 업로드해주세요.")
      return
    }

    setIsSubmitting(true)
    setError(null)
    
    try {
      // CreateDocumentRequest 형식으로 데이터 변환
      const fieldValues: DocumentFieldValueRequest[] = Object.entries(formFieldValues).map(([fieldName, fieldValue]) => {
        const templateField = formTemplate.fields?.find(f => f.name === fieldName)
        return {
          fieldName,
          fieldValue: Array.isArray(fieldValue) ? JSON.stringify(fieldValue) : String(fieldValue),
          templateFieldId: templateField?.id
        }
      })

      const approvalStageRequests: ApprovalStageRequest[] = approvalStages.map((stage, index) => ({
        stageOrder: index + 1,
        stageName: stage.name,
        approvalTargets: stage.approvers.map(approver => ({
          targetType: TargetType.USER,
          userId: approver.id,
          isReference: false
        }))
      }))

      const referenceTargetRequests: ApprovalTargetRequest[] = references.map(reference => ({
        targetType: TargetType.USER,
        userId: Number(reference.id),
        isReference: true
      }))

      // 첨부파일 ID 배열 (실제로는 Attachment에서 fileId 추출 필요)
      const attachmentIds = attachments.map(attachment => attachment.id || '')

      const createDocumentRequest: CreateDocumentRequest = {
        templateId: formTemplate.id,
        content: formTemplate.useBody ? content : undefined,
        fieldValues,
        approvalStages: approvalStageRequests,
        referenceTargets: referenceTargetRequests,
        attachments: attachmentIds.length > 0 ? attachmentIds : undefined,
        submitImmediately: true
      }

      await createDocument.mutateAsync(createDocumentRequest)
      onClose()
    } catch (error) {
      console.error("문서 제출 중 오류:", error)
      const errorMessage = error instanceof Error ? error.message : "문서 제출 중 오류가 발생했습니다."
      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!formTemplate) return null


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
                <TemplateIcon
                  icon={typeof formTemplate.icon === 'string' ? formTemplate.icon : 'FileText'}
                  color={formTemplate.color}
                />
                <div className="min-w-0 flex-1">
                  <h2 className={`${typography.h3} text-gray-800 truncate`}>{formTemplate.title}</h2>
                  <p className="text-sm text-gray-600 truncate">{formTemplate.description}</p>
                </div>
              </div>
            </div>
          </DialogHeader>

          {/* 에러 메시지 */}
          {error && (
            <div className="mx-6 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* 데스크톱 레이아웃 */}
          <div className="hidden lg:flex flex-1 overflow-hidden gap-6 p-6 pt-4 min-h-0">
            {/* 왼쪽 컬럼 - 메인 콘텐츠 */}
            <div className="flex-1 flex flex-col min-h-0 min-w-0">

              {/* 양식 필드 */}
              {formTemplate.fields && formTemplate.fields.length > 0 && (
                <div className="space-y-4 mb-4 p-4 bg-gray-50 rounded-lg flex-shrink-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {formTemplate.fields.map((field) => (
                      <div key={field.name} className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          {field.name}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </Label>
                        <FormFieldRenderer
                          field={field}
                          value={formFieldValues[field.name]}
                          onChange={(value) =>
                            setFormFieldValues(prev => ({
                              ...prev,
                              [field.name]: value
                            }))
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 본문 작성 */}
              {formTemplate.useBody && (
                <div className="space-y-2 flex-1 flex flex-col min-h-0">
                  <Textarea
                    placeholder="내용을 입력하세요"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="flex-1 min-h-0 resize-none overflow-y-auto"
                  />
                </div>
              )}

              {/* 첨부파일 */}
              {formTemplate.useAttachment !== AttachmentUsageType.DISABLED && (
                <div className="space-y-2 flex-shrink-0 mt-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-gray-700">
                      첨부파일{attachments.length > 0 && ` (${attachments.length}개)`}
                    </h3>
                    {formTemplate.useAttachment === AttachmentUsageType.REQUIRED && (
                      <Badge variant="destructive" className="text-xs">필수</Badge>
                    )}
                  </div>
                  <AttachmentsManager
                    attachments={attachments}
                    onAttachmentsChange={setAttachments}
                  />
                </div>
              )}
            </div>

            {/* 오른쪽 컬럼 - 참고파일, 승인 단계 및 참조자 */}
            <div className="w-80 flex-shrink-0 flex flex-col min-h-0">
              <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50 rounded-lg p-4 min-h-0">
                {/* 참고파일 */}
                {formTemplate.referenceFiles && formTemplate.referenceFiles.length > 0 && (
                  <>
                    <div className="space-y-3">
                      <h3 className={`${typography.h4} text-gray-800`}>참고 파일</h3>
                      <ReferenceFilesManager referenceFiles={formTemplate.referenceFiles} />
                    </div>
                    <Separator />
                  </>
                )}

                {/* 승인 단계 */}
                <div className="space-y-3">
                  <h3 className={`${typography.h4} text-gray-800`}>승인 단계</h3>
                  {usersLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm text-gray-600">사용자 목록 로드 중...</span>
                      </div>
                    </div>
                  ) : (
                    <ApprovalStagesManager
                      stages={approvalStages}
                      onStagesChange={setApprovalStages}
                      availableUsers={availableUsers}
                    />
                  )}
                </div>

                <Separator />

                {/* 참조자 */}
                <div className="space-y-3">
                  <h3 className={`${typography.h4} text-gray-800`}>참조자</h3>
                  {usersLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm text-gray-600">로드 중...</span>
                      </div>
                    </div>
                  ) : (
                    <ReferencesManager
                      references={references}
                      onReferencesChange={setReferences}
                      availableUsers={availableUsers}
                    />
                  )}
                </div>
              </div>

              {/* 결재 요청 버튼 */}
              <div className="mt-4 flex-shrink-0">
                <GradientButton
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={isSubmitting || createDocument.isPending}
                  className="w-full flex items-center justify-center gap-2 h-12"
                >
                  {(isSubmitting || createDocument.isPending) ? (
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

              {/* 양식 필드 */}
              {formTemplate.fields && formTemplate.fields.length > 0 && (
                <CollapsibleSection title="양식 항목" defaultOpen={true}>
                  <div className="space-y-4">
                    {formTemplate.fields.map((field) => (
                      <div key={field.name} className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          {field.name}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </Label>
                        <FormFieldRenderer
                          field={field}
                          value={formFieldValues[field.name]}
                          onChange={(value) =>
                            setFormFieldValues(prev => ({
                              ...prev,
                              [field.name]: value
                            }))
                          }
                        />
                      </div>
                    ))}
                  </div>
                </CollapsibleSection>
              )}

              {/* 참고파일 */}
              {formTemplate.referenceFiles && formTemplate.referenceFiles.length > 0 && (
                <CollapsibleSection title="참고 파일">
                  <ReferenceFilesManager referenceFiles={formTemplate.referenceFiles} />
                </CollapsibleSection>
              )}

              {/* 본문 작성 */}
              {formTemplate.useBody && (
                <CollapsibleSection title="내용 작성" defaultOpen={true}>
                  <div className="space-y-2">
                    <Textarea
                      placeholder="내용을 입력하세요"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="min-h-[200px] resize-none"
                    />
                  </div>
                </CollapsibleSection>
              )}

              {/* 승인 단계 */}
              <CollapsibleSection title="승인 단계" defaultOpen={true}>
                {usersLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm text-gray-600">사용자 목록 로드 중...</span>
                    </div>
                  </div>
                ) : (
                  <ApprovalStagesManager
                    stages={approvalStages}
                    onStagesChange={setApprovalStages}
                    availableUsers={availableUsers}
                  />
                )}
              </CollapsibleSection>

              {/* 참조자 */}
              <CollapsibleSection title="참조자">
                {usersLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm text-gray-600">로드 중...</span>
                    </div>
                  </div>
                ) : (
                  <ReferencesManager
                    references={references}
                    onReferencesChange={setReferences}
                    availableUsers={availableUsers}
                  />
                )}
              </CollapsibleSection>

              {/* 첨부파일 */}
              {formTemplate.useAttachment !== AttachmentUsageType.DISABLED && (
                <CollapsibleSection
                  title={
                    <div className="flex items-center gap-2">
                      <span>첨부파일</span>
                      {formTemplate.useAttachment === AttachmentUsageType.REQUIRED && (
                        <Badge variant="destructive" className="text-xs">필수</Badge>
                      )}
                    </div>
                  }
                  defaultOpen={formTemplate.useAttachment === AttachmentUsageType.REQUIRED}
                >
                  <div className="max-h-64 overflow-y-auto">
                    <AttachmentsManager
                      attachments={attachments}
                      onAttachmentsChange={setAttachments}
                    />
                  </div>
                </CollapsibleSection>
              )}

              {/* 결재 요청 버튼 - 모바일에서는 하단 고정 */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 pt-4 mt-4">
                <GradientButton
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={isSubmitting || createDocument.isPending}
                  className="w-full flex items-center justify-center gap-2 h-12"
                >
                  {(isSubmitting || createDocument.isPending) ? (
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
