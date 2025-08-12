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
import approvals from "@/lib/mock-data/approvals"
import { FormTemplate, formTemplates } from "@/lib/mock-data/form-templates"
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
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 결재 신청 관련 상태
  const [isFormSelectionOpen, setIsFormSelectionOpen] = useState(false)
  const [isFormWriterOpen, setIsFormWriterOpen] = useState(false)
  const [selectedFormTemplate, setSelectedFormTemplate] = useState<FormTemplate | null>(null)
  const [isFormManagementOpen, setIsFormManagementOpen] = useState(false)

  // 현재 사용자 정보 (실제로는 인증 시스템에서 가져옴)
  const currentUser = "김철수"

  const filteredApprovals = approvals.filter((approval: Approval) => {
    const formTemplate = formTemplates.find(template => template.id === approval.formTemplateId)
    const matchesSearch = (formTemplate?.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      approval.requester.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  // 섹션별로 결재 분류
  const myPendingApprovals = filteredApprovals.filter((a: Approval) =>
    a.status === "pending" && a.isMyApproval === true
  )
  const inProgressApprovals = filteredApprovals.filter((a: Approval) =>
    a.status === "pending" && a.isMyApproval === false
  )
  // approved와 rejected를 구분하지 않고, 기존 approvals 배열의 순서를 유지하여 완료된 결재를 필터링
  const inProgressData = [...myPendingApprovals, ...inProgressApprovals]
  const completedData = filteredApprovals.filter((a: Approval) => a.status === "approved" || a.status === "rejected")

  const getStatusIcon = (status: string, isMyApproval?: boolean) => {
    switch (status) {
      case "pending":
        // 내 승인이 필요한 경우 AlertCircle, 그렇지 않으면 Clock
        return isMyApproval ? AlertCircle : Clock
      case "approved":
        return CheckCircle
      case "rejected":
        return XCircle
      default:
        return AlertCircle
    }
  }

  const getStatusBgColor = (status: string, isMyApproval?: boolean) => {
    switch (status) {
      case "pending":
        // 내 승인이 필요한 경우 warning, 그렇지 않으면 info
        return isMyApproval ? colors.status.warning.bg : colors.status.info.bg
      case "approved":
        return colors.status.success.bg
      case "rejected":
        return colors.status.error.bg
      default:
        return colors.status.info.bg
    }
  }

  const getStatusTextColor = (status: string, isMyApproval?: boolean) => {
    switch (status) {
      case "pending":
        // 내 승인이 필요한 경우 warning, 그렇지 않으면 info
        return isMyApproval ? colors.status.warning.text : colors.status.info.text
      case "approved":
        return colors.status.success.text
      case "rejected":
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

  const handleApprovalClick = (approval: Approval) => {
    setSelectedApproval(approval)
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

  const handleFormSelect = (form: FormTemplate) => {
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

  // 승인자 아바타 스택 컴포넌트
  const ApproverAvatars = ({ approvers, maxVisible = 4 }: { approvers: any[], maxVisible?: number }) => {
    const visibleApprovers = approvers.slice(0, maxVisible)
    const remainingCount = approvers.length - maxVisible

    return (
      <div className="flex items-center gap-2">
        <div className="flex -space-x-3">
          {visibleApprovers.map((approver: any, index: number) => (
            <div
              key={approver.userId}
              className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-sm font-medium shadow-sm ${approver.status === 'completed'
                  ? 'bg-green-500 text-white'
                  : approver.status === 'rejected'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              title={`${approver.name} (${approver.position})`}
            >
              {approver.name.charAt(0)}
            </div>
          ))}
        </div>
        {remainingCount > 0 && (
          <span className="text-sm text-gray-500 ml-1 font-medium">
            +{remainingCount}
          </span>
        )}
      </div>
    )
  }

  const renderApprovalCard = (approval: Approval) => {
    const StatusIcon = getStatusIcon(approval.status, approval.isMyApproval)
    const statusBgColor = getStatusBgColor(approval.status, approval.isMyApproval)
    const statusTextColor = getStatusTextColor(approval.status, approval.isMyApproval)

    // formTemplate 찾기
    const formTemplate = formTemplates.find(template => template.id === approval.formTemplateId)
    if (!formTemplate) return null

    // 모든 승인자 정보 수집
    const allApprovers = approval.approvalStages.flatMap((stage: any) => stage.approvers)

    return (
      <GlassCard
        key={approval.id}
        className="px-6 py-4 hover:shadow-lg transition-shadow cursor-pointer h-full overflow-hidden relative"
        onClick={() => handleApprovalClick(approval)}
      >
        <div className="flex items-center gap-4 h-full">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
            style={{ backgroundColor: formTemplate.color }}
          >
            <formTemplate.icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 flex flex-col justify-center h-full">
            <div className="flex items-center gap-3 mb-1 min-w-0">
              <h3 className={`${typography.h3} text-gray-800 truncate flex-shrink-0`}>{approval.requester}</h3>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Calendar className="w-4 h-4" />
                <span className="text-sm text-gray-500">{approval.date}</span>
              </div>
              <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full bg-gradient-to-r ${statusBgColor} ${statusTextColor} font-medium text-xs border ${statusTextColor.replace('text-', 'border-')} border-opacity-30 flex-shrink-0`}>
                <StatusIcon className="w-3 h-3" />
                {approval.status === "pending" ?
                  (approval.isMyApproval ? "승인 필요" : "진행중") :
                  approval.status === "approved" ? "승인됨" :
                    approval.status === "rejected" ? "반려됨" : approval.status}
              </div>
              {approval.priority === "high" && (
                <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium flex-shrink-0">
                  긴급
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <h4 className="text-lg font-semibold text-gray-800 min-w-fit truncate">{formTemplate.title}</h4>
              <p className="text-gray-600 flex-1 truncate">{approval.content}</p>
              <div className="flex-shrink-0">
                <ApproverAvatars approvers={allApprovers} />
              </div>
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
      {activeTab === "inProgress" && (
        <div className="space-y-6">
          {/* 내 승인 필요 섹션 */}
          {myPendingApprovals.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-2 border-b border-red-200">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <h2 className="text-lg font-semibold text-red-700">내 승인 필요</h2>
                </div>
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-sm font-medium">
                  {myPendingApprovals.length}건
                </span>
              </div>
              <div className="space-y-4">
                {myPendingApprovals.map(renderApprovalCard)}
              </div>
            </div>
          )}

          {/* 진행중 섹션 */}
          {inProgressApprovals.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-2 border-b border-blue-200">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-blue-700">진행중</h2>
                </div>
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm font-medium">
                  {inProgressApprovals.length}건
                </span>
              </div>
              <div className="space-y-4">
                {inProgressApprovals.map(renderApprovalCard)}
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

      {activeTab === "completed" && (
        <div className="space-y-6">
          {/* 완료된 결재들 */}
          {completedData.length > 0 && (
            <div className="space-y-4">
              {completedData.map(renderApprovalCard)}
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
        onClose={() => setIsModalOpen(false)}
        approval={selectedApproval as any}
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