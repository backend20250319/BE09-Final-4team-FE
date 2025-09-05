"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientButton } from "@/components/ui/gradient-button"
import { Input } from "@/components/ui/input"
import { ApprovalModal } from "@/app/approvals/components/approval-modal"
import { FormSelectionModal } from "@/app/approvals/components/form-selection-modal"
import { FormManagementModal } from "@/app/approvals/components/form-management-modal"
import { FormWriterModal } from "@/app/approvals/components/form-writer-modal"
import { colors, typography } from "@/lib/design-tokens"
import { useDocuments } from "@/lib/hooks/useApproval"
import { DocumentSummaryResponse, DocumentStatus, UserRole } from "@/lib/services/approval/types"
import { TemplateSummaryResponse } from "@/lib/services/approval/types"
import {
  Search,
  Plus,
  ClipboardList,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Calendar,
  FileText,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Settings,
} from "lucide-react"

// 타입 정의
/**
 * @deprecated 목 데이터 타입. 삭제 예정
 */
interface Approval {
  id: number
  formTemplateId: string
  requester: string
  department: string
  date: string
  status: string
  priority: string
  content: string
  isMyApproval: boolean
  approvalStages: any[]
  references: any[]
  history: any[]
  comments: any[]
  formFields?: Record<string, any>
}

export default function ApprovalsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<"inProgress" | "completed">("inProgress")
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    myPending: false,
    inProgress: false,
    approved: false,
    rejected: false,
  })
  const [selectedDocumentSummary, setSelectedDocumentSummary] = useState<DocumentSummaryResponse | null>(null)
  const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 결재 신청 관련 상태
  const [isFormSelectionOpen, setIsFormSelectionOpen] = useState(false)
  const [isFormWriterOpen, setIsFormWriterOpen] = useState(false)
  const [selectedFormTemplate, setSelectedFormTemplate] = useState<TemplateSummaryResponse | null>(null)
  const [isFormManagementOpen, setIsFormManagementOpen] = useState(false)

  // 현재 사용자 정보 (실제로는 인증 시스템에서 가져옴)
  const currentUser = "김철수"

  // API에서 문서 데이터 가져오기
  const statusFilter = activeTab === "inProgress" 
    ? [DocumentStatus.DRAFT, DocumentStatus.IN_PROGRESS]
    : [DocumentStatus.APPROVED, DocumentStatus.REJECTED]

  const { data: documentsData, isLoading, error } = useDocuments({
    status: statusFilter,
    search: searchTerm,
    pageable: {
      page: 0,
      size: 100, // 임시로 큰 수로 설정 (페이지네이션 추후 구현)
    },
  })

  const documents = documentsData?.content || []

  // 문서를 상태와 사용자 역할에 따라 분류
  const draftDocuments = documents.filter((doc: DocumentSummaryResponse) =>
    doc.status === DocumentStatus.DRAFT
  )
  const myPendingDocuments = documents.filter((doc: DocumentSummaryResponse) =>
    doc.status === DocumentStatus.IN_PROGRESS && 
    doc.userRole === UserRole.APPROVER
  )
  const inProgressDocuments = documents.filter((doc: DocumentSummaryResponse) =>
    doc.status === DocumentStatus.IN_PROGRESS && 
    doc.userRole !== UserRole.APPROVER
  )
  // 진행중 및 완료된 문서
  const inProgressData = [...draftDocuments, ...myPendingDocuments, ...inProgressDocuments]
  const completedData = documents.filter((doc: DocumentSummaryResponse) => 
    doc.status === DocumentStatus.APPROVED || doc.status === DocumentStatus.REJECTED
  )

  const getStatusIcon = (status: DocumentStatus, userRole?: UserRole) => {
    switch (status) {
      case DocumentStatus.DRAFT:
        return FileText
      case DocumentStatus.IN_PROGRESS:
        // 내 승인이 필요한 경우 AlertCircle, 그렇지 않으면 Clock
        return userRole === UserRole.APPROVER ? AlertCircle : Clock
      case DocumentStatus.APPROVED:
        return CheckCircle
      case DocumentStatus.REJECTED:
        return XCircle
      default:
        return AlertCircle
    }
  }

  const getStatusBgColor = (status: DocumentStatus, userRole?: UserRole) => {
    switch (status) {
      case DocumentStatus.DRAFT:
        return colors.status.info.bg
      case DocumentStatus.IN_PROGRESS:
        // 내 승인이 필요한 경우 warning, 그렇지 않으면 info
        return userRole === UserRole.APPROVER ? colors.status.warning.bg : colors.status.info.bg
      case DocumentStatus.APPROVED:
        return colors.status.success.bg
      case DocumentStatus.REJECTED:
        return colors.status.error.bg
      default:
        return colors.status.info.bg
    }
  }

  const getStatusTextColor = (status: DocumentStatus, userRole?: UserRole) => {
    switch (status) {
      case DocumentStatus.DRAFT:
        return colors.status.info.text
      case DocumentStatus.IN_PROGRESS:
        // 내 승인이 필요한 경우 warning, 그렇지 않으면 info
        return userRole === UserRole.APPROVER ? colors.status.warning.text : colors.status.info.text
      case DocumentStatus.APPROVED:
        return colors.status.success.text
      case DocumentStatus.REJECTED:
        return colors.status.error.text
      default:
        return colors.status.info.text
    }
  }

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleDocumentClick = (document: DocumentSummaryResponse) => {
    setSelectedDocumentSummary(document)
    setSelectedDocumentId(document.id)
    setIsModalOpen(true)
  }

  const handleApprove = async (approvalId: number, comment?: string) => {
    // 실제로는 API 호출을 통해 승인 처리
    console.log("승인 처리:", { approvalId, comment })
    // 여기서 상태 업데이트 로직 추가
  }

  const handleReject = async (approvalId: number, comment?: string) => {
    // 실제로는 API 호출을 통해 반려 처리
    console.log("반려 처리:", { approvalId, comment })
    // 여기서 상태 업데이트 로직 추가
  }

  const handleAddComment = async (approvalId: number, comment: string) => {
    // 실제로는 API 호출을 통해 댓글 추가
    console.log("댓글 추가:", { approvalId, comment })
    // 여기서 상태 업데이트 로직 추가
  }

  // 결재 신청 관련 핸들러
  const handleNewApprovalClick = () => {
    setIsFormSelectionOpen(true)
  }

  const handleFormTemplateManagement = () => {
    setIsFormManagementOpen(true)
  }

  const handleFormSelect = (form: TemplateSummaryResponse) => {
    setSelectedFormTemplate(form)
    setIsFormWriterOpen(true)
  }

  const handleFormSubmit = async (data: {
    content: string
    attachments: any[]
    approvalStages: any[]
    references: any[]
    formFields: Record<string, any>
  }) => {
    // 실제로는 API 호출을 통해 결재 신청
    console.log("결재 신청:", {
      title: selectedFormTemplate?.title || "문서",
      ...data
    })
    // 여기서 상태 업데이트 로직 추가
    alert("결재가 성공적으로 요청되었습니다.")
  }


  const renderDocumentCard = (document: DocumentSummaryResponse) => {
    const StatusIcon = getStatusIcon(document.status, document.userRole)
    const statusBgColor = getStatusBgColor(document.status, document.userRole)
    const statusTextColor = getStatusTextColor(document.status, document.userRole)

    // 날짜 포맷팅
    const formatDate = (dateString: string) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).replace(/\. /g, '.').replace(/\.$/, '')
    }

    // 상태 표시 텍스트
    const getStatusText = (status: DocumentStatus, userRole: UserRole) => {
      switch (status) {
        case DocumentStatus.DRAFT:
          return "작성중"
        case DocumentStatus.IN_PROGRESS:
          return userRole === UserRole.APPROVER ? "승인 필요" : "진행중"
        case DocumentStatus.APPROVED:
          return "승인됨"
        case DocumentStatus.REJECTED:
          return "반려됨"
        default:
          return status
      }
    }

    return (
      <GlassCard
        key={document.id}
        className="px-6 py-4 hover:shadow-lg transition-shadow cursor-pointer h-full overflow-hidden relative"
        onClick={() => handleDocumentClick(document)}
      >
        <div className="flex items-center gap-4 h-full">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
            style={{ backgroundColor: '#6b7280' }} // 임시 색상 (템플릿 정보 없음)
          >
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 flex flex-col justify-center h-full">
            <div className="flex items-center gap-3 mb-1 min-w-0">
              <h3 className={`${typography.h3} text-gray-800 truncate flex-shrink-0`}>{document.author.name}</h3>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Calendar className="w-4 h-4" />
                <span className="text-sm text-gray-500">
                  {formatDate(document.submittedAt || document.createdAt)}
                </span>
              </div>
              <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full bg-gradient-to-r ${statusBgColor} ${statusTextColor} font-medium text-xs border ${statusTextColor.replace('text-', 'border-')} border-opacity-30 flex-shrink-0`}>
                <StatusIcon className="w-3 h-3" />
                {getStatusText(document.status, document.userRole)}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <h4 className="text-lg font-semibold text-gray-800 min-w-fit truncate">{document.templateTitle}</h4>
              <p className="text-gray-600 flex-1 truncate">{document.content}</p>
              {/* 승인 진행률 표시 */}
              {document.totalStages > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-500 flex-shrink-0">
                  <span>{document.currentStage || 0}/{document.totalStages}</span>
                  <span className="text-xs">단계</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </GlassCard>
    )
  }

  return (
    <MainLayout>
      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="제목 또는 신청자로 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/60 backdrop-blur-sm border-gray-200/50 rounded-xl"
          />
        </div>
        <div className="flex gap-3">
          <GradientButton variant="secondary" onClick={handleFormTemplateManagement}>
            <Settings className="w-4 h-4 mr-2" />
            문서 양식 관리
          </GradientButton>
          <GradientButton variant="primary" onClick={handleNewApprovalClick}>
            <Plus className="w-4 h-4 mr-2" />
            문서 작성
          </GradientButton>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("inProgress")}
          className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === "inProgress"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
            }`}
        >
          진행중
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === "completed"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
            }`}
        >
          완료
        </button>
      </div>

      {/* Tab Content */}
      {isLoading && (
        <div className="text-center py-12">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-spin" />
          <p className="text-gray-500">문서를 불러오고 있습니다...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-500">문서를 불러오는 중 오류가 발생했습니다.</p>
        </div>
      )}

      {!isLoading && !error && activeTab === "inProgress" && (
        <div className="space-y-6">
          {/* 작성중 섹션 */}
          {draftDocuments.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <h2 className="text-lg font-semibold text-gray-700">작성중</h2>
                </div>
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm font-medium">
                  {draftDocuments.length}건
                </span>
              </div>
              <div className="space-y-4">
                {draftDocuments.map(renderDocumentCard)}
              </div>
            </div>
          )}

          {/* 내 승인 필요 섹션 */}
          {myPendingDocuments.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-2 border-b border-red-200">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <h2 className="text-lg font-semibold text-red-700">내 승인 필요</h2>
                </div>
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-sm font-medium">
                  {myPendingDocuments.length}건
                </span>
              </div>
              <div className="space-y-4">
                {myPendingDocuments.map(renderDocumentCard)}
              </div>
            </div>
          )}

          {/* 진행중 섹션 */}
          {inProgressDocuments.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-2 border-b border-blue-200">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-blue-700">진행중</h2>
                </div>
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm font-medium">
                  {inProgressDocuments.length}건
                </span>
              </div>
              <div className="space-y-4">
                {inProgressDocuments.map(renderDocumentCard)}
              </div>
            </div>
          )}

          {/* 검색 결과가 없을 때 */}
          {inProgressData.length === 0 && (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">진행중인 결재가 없습니다.</p>
            </div>
          )}
        </div>
      )}

      {!isLoading && !error && activeTab === "completed" && (
        <div className="space-y-6">
          {/* 완료된 결재들 */}
          {completedData.length > 0 && (
            <div className="space-y-4">
              {completedData.map(renderDocumentCard)}
            </div>
          )}

          {/* 검색 결과가 없을 때 */}
          {completedData.length === 0 && (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">완료된 결재가 없습니다.</p>
            </div>
          )}
        </div>
      )}

      {/* 결재 문서 모달 */}
      <ApprovalModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedDocumentSummary(null)
          setSelectedDocumentId(null)
        }}
        documentSummary={selectedDocumentSummary}
        documentId={selectedDocumentId}
        onApprove={handleApprove}
        onReject={handleReject}
        onAddComment={handleAddComment}
      />

      {/* 문서 양식 선택 모달 */}
      <FormSelectionModal
        isOpen={isFormSelectionOpen}
        onClose={() => setIsFormSelectionOpen(false)}
        onSelectForm={handleFormSelect}
      />

      {/* 문서 양식 관리 모달 */}
      <FormManagementModal
        isOpen={isFormManagementOpen}
        onClose={() => setIsFormManagementOpen(false)}
      />

      {/* 문서 작성 모달 */}
      <FormWriterModal
        isOpen={isFormWriterOpen}
        onClose={() => setIsFormWriterOpen(false)}
        onBack={() => {
          setIsFormWriterOpen(false)
          setIsFormSelectionOpen(true)
        }}
        formTemplate={selectedFormTemplate}
        onSubmit={handleFormSubmit}
      />
    </MainLayout>
  )
} 