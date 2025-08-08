"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { GradientButton } from "@/components/ui/gradient-button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { colors, typography } from "@/lib/design-tokens"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  User,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
  MessageSquare,
  Download,
  Eye,
  Check,
  X,
  Users,
  Edit,
  Plus,
  Send,
  History,
  FileEdit,
  UserPlus,
  UserMinus,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

// 타입 정의
interface User {
  id: string
  name: string
  avatar?: string
  position?: string
}

interface Attachment {
  id: string
  name: string
  size?: string
  url?: string
}

interface TimelineItem {
  id: string
  date: string
  user: User
  action: string
  content?: string
  changes?: Array<{
    field: string
    oldValue: string
    newValue: string
  }>
  type?: 'history' | 'comment'
  uniqueId?: string
}

interface Approver {
  userId: string
  name: string
  avatar?: string
  position: string
  status: 'pending' | 'completed' | 'rejected'
}

interface ApprovalStage {
  id: string
  status: 'pending' | 'current' | 'completed' | 'rejected'
  approvers: Approver[]
}

interface Reference {
  id: string
  name: string
  avatar?: string
  position: string
}

interface Approval {
  id: number
  title: string
  content: string
  type: string
  department: string
  requester: string
  date: string
  status: 'pending' | 'approved' | 'rejected'
  priority?: 'low' | 'medium' | 'high'
  isMyApproval?: boolean
  color: string
  icon: React.ComponentType<{ className?: string }>
  attachments?: Attachment[]
  history?: TimelineItem[]
  comments?: TimelineItem[]
  approvalStages?: ApprovalStage[]
  references?: Reference[]
}

interface ApprovalModalProps {
  isOpen: boolean
  onClose: () => void
  approval: Approval | null
  onApprove?: (approvalId: number, comment?: string) => Promise<void>
  onReject?: (approvalId: number, comment?: string) => Promise<void>
  onAddComment?: (approvalId: number, comment: string) => Promise<void>
}

// 서브 컴포넌트들
function ApprovalHeader({ approval }: { approval: Approval }) {
  const StatusIcon = getStatusIcon(approval.status, approval.isMyApproval)
  const statusBgColor = getStatusColor(approval.status, approval.isMyApproval)
  const statusTextColor = getStatusTextColor(approval.status, approval.isMyApproval)

  return (
    <div className="flex items-center gap-5">
      <div className={`w-12 h-12 bg-gradient-to-r ${approval.color} rounded-lg flex items-center justify-center shadow-sm flex-shrink-0`}>
        <approval.icon className="w-6 h-6 text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-4 flex-wrap">
          <h2 className={`${typography.h3} text-gray-800 truncate`}>{approval.title}</h2>
          {approval.priority === "high" && (
            <Badge variant="destructive" className="flex items-center gap-1 text-xs">
              <AlertCircle className="w-3 h-3" />
              긴급
            </Badge>
          )}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r ${statusBgColor} ${statusTextColor} font-medium text-sm border ${statusTextColor.replace('text-', 'border-')} border-opacity-30 flex-shrink-0`}>
            <StatusIcon className="w-4 h-4" />
            <span className="hidden sm:inline">{getStatusText(approval.status, approval.isMyApproval)}</span>
            <span className="sm:hidden">{getStatusText(approval.status, approval.isMyApproval).replace('승인 필요', '승인').replace('진행중', '진행')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function ApprovalInfo({ approval }: { approval: Approval }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-blue-600" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-gray-500 font-medium">신청자</p>
          <p className="text-sm font-semibold text-gray-800 truncate">{approval.requester}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <Calendar className="w-5 h-5 text-green-600" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-gray-500 font-medium">신청일</p>
          <p className="text-sm font-semibold text-gray-800">{approval.date}</p>
        </div>
      </div>
    </div>
  )
}

function AttachmentsSection({ attachments }: { attachments: Attachment[] }) {
  return (
    <div className="space-y-2">
      <div className="space-y-1">
        {attachments.map((file, index) => (
                      <div key={file.id || `attachment-${index}`} className="flex items-center justify-between p-2 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                {file.size && <p className="text-xs text-gray-500">{file.size}</p>}
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Eye className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TimelineSection({
  timeline,
  newComment,
  setNewComment,
  onAddComment,
  isSubmitting,
  canComment
}: {
  timeline: TimelineItem[]
  newComment: string
  setNewComment: (comment: string) => void
  onAddComment: () => Promise<void>
  isSubmitting: boolean
  canComment: boolean
}) {
  const formatSimpleDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getMonth() + 1}월 ${date.getDate()}일`
  }

  const getHistoryText = (action: string) => {
    switch (action) {
      case "created": return "문서를 생성"
      case "updated": return "문서를 수정"
      case "approved": return "승인"
      case "rejected": return "반려"
      case "comment": return "댓글을 작성"
      case "approver_added": return "승인권자를 추가"
      case "approver_removed": return "승인권자를 제거"
      case "file_attached": return "첨부파일을 추가"
      default: return action
    }
  }

  return (
    <div className="space-y-3">
      {/* 타임라인 목록 */}
      <div className="space-y-0">
        {timeline.map((item) => (
          <div key={item.uniqueId || item.id} className="flex items-start gap-3 p-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center mb-1">
                <span className="font-medium text-sm text-gray-900 truncate">{item.user.name}</span>
                {item.action !== "comment" && (
                  <span className="text-sm text-gray-800">
                    님이 {getHistoryText(item.action)}했어요.
                  </span>
                )}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-xs text-gray-500 cursor-help ml-2">{formatSimpleDate(item.date)}</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{item.date}</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              {item.changes && (
                <div className="mt-2 mb-1 text-xs text-gray-600 space-y-1">
                  {item.changes.map((change, index) => (
                    <div key={`${item.id}-change-${index}`} className="flex items-center gap-1 flex-wrap">
                      <span className="font-medium">{change.field}:</span>
                      <span className="line-through">{change.oldValue}</span>
                      <ArrowRight className="w-2 h-2 text-gray-400" />
                      {change.newValue}
                    </div>
                  ))}
                </div>
              )}

              {item.action === "comment" && (
                <p className="text-sm text-gray-800 break-words bg-gray-50 rounded px-3 py-2 mb-1">{item.content}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 댓글 작성 섹션 */}
      {canComment && (
        <div className="p-3">
          <div className="flex gap-2">
            <Textarea
              placeholder="댓글을 입력하세요..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 text-sm py-2 min-h-[36px] h-auto resize-none overflow-hidden"
              rows={1}
              style={{ height: "auto" }}
              onInput={e => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = target.scrollHeight + "px";
              }}
            />
            <Button
              onClick={onAddComment}
              disabled={isSubmitting || !newComment.trim()}
              className="flex items-center gap-1 px-3"
              size="sm"
            >
              {isSubmitting ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Send className="w-3 h-3" />
              )}
              작성
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function ApprovalStagesSection({ stages, references }: { stages: ApprovalStage[], references?: Reference[] }) {
  return (
    <div className="space-y-3">
      <div className="space-y-3">
        {stages.map((stage, stageIndex) => (
          <div key={stage.id || `stage-${stageIndex}`} className="p-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${stage.status === "completed" ? "bg-green-100" :
                    stage.status === "current" ? "bg-blue-100" :
                      stage.status === "pending" ? "bg-yellow-100" : "bg-red-100"
                  }`}>
                  {stage.status === "completed" ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : stage.status === "current" ? (
                    <Clock className="w-4 h-4 text-blue-600" />
                  ) : stage.status === "pending" ? (
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                  ) : (
                    <X className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-800">
                    {stageIndex + 1}단계 승인
                    <span className={`text-sm ml-2 ${stage.status === "completed" ? "text-green-600" :
                        stage.status === "current" ? "text-blue-600" :
                          stage.status === "pending" ? "text-yellow-600" : "text-red-600"
                      }`}>
                      {stage.status === "completed" ? "완료" :
                        stage.status === "current" ? "진행중" :
                          stage.status === "pending" ? "대기중" : "반려됨"}
                    </span>
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-500 flex-shrink-0">
                {stage.approvers.filter(a => a.status === "completed").length}/{stage.approvers.length} 승인
              </div>
            </div>

            <div className="space-y-1">
              {stage.approvers.map((approver, approverIndex) => (
                <div key={approver.userId || `approver-${stageIndex}-${approverIndex}`} className="flex items-center justify-between p-2">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarImage src={approver.avatar} alt={approver.name} />
                      <AvatarFallback className="text-xs">
                        {approver.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-800 truncate">{approver.name}</p>
                      <p className="text-xs text-gray-500 truncate">{approver.position}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1 justify-end mb-1">
                      {approver.status === "completed" ? (
                        <CheckCircle className="w-3 h-3 text-green-600" />
                      ) : approver.status === "pending" ? (
                        <Clock className="w-3 h-3 text-yellow-600" />
                      ) : (
                        <XCircle className="w-3 h-3 text-red-600" />
                      )}
                      <p className="text-xs text-gray-500">
                        {approver.status === "completed" ? "승인됨" :
                          approver.status === "pending" ? "대기중" : "반려됨"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* 참조자 섹션을 승인 단계 아래에 통합 */}
        {references && references.length > 0 && (
          <div className="p-3">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Eye className="w-4 h-4 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-800">
                  참조자 <span className="text-gray-400 ml-1">{references.length}</span>
                </p>
              </div>
            </div>

            <div className="space-y-1">
                      {references.map((reference, index) => (
          <div key={reference.id || `reference-${index}`} className="flex items-center gap-3 p-2">
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarImage src={reference.avatar} alt={reference.name} />
                    <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
                      {reference.name?.charAt(0) || "R"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-800 truncate">{reference.name}</p>
                    <p className="text-xs text-gray-500 truncate">{reference.position}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-600 border-blue-200">
                      참조
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
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

// 유틸리티 함수들
function getStatusIcon(status: string, isMyApproval?: boolean) {
  switch (status) {
    case "pending":
      return isMyApproval ? AlertCircle : Clock
    case "approved":
      return CheckCircle
    case "rejected":
      return XCircle
    default:
      return AlertCircle
  }
}

function getStatusColor(status: string, isMyApproval?: boolean) {
  switch (status) {
    case "pending":
      return isMyApproval ? colors.status.warning.bg : colors.status.info.bg
    case "approved":
      return colors.status.success.bg
    case "rejected":
      return colors.status.error.bg
    default:
      return colors.status.info.bg
  }
}

function getStatusTextColor(status: string, isMyApproval?: boolean) {
  switch (status) {
    case "pending":
      return isMyApproval ? colors.status.warning.text : colors.status.info.text
    case "approved":
      return colors.status.success.text
    case "rejected":
      return colors.status.error.text
    default:
      return colors.status.info.text
  }
}

function getStatusText(status: string, isMyApproval?: boolean) {
  switch (status) {
    case "pending":
      return isMyApproval ? "승인 필요" : "진행중"
    case "approved":
      return "승인됨"
    case "rejected":
      return "반려됨"
    default:
      return status
  }
}

export function ApprovalModal({
  isOpen,
  onClose,
  approval,
  onApprove,
  onReject,
  onAddComment
}: ApprovalModalProps) {
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!approval) return null

  const getCurrentStage = () => {
    if (!approval.approvalStages) return null
    return approval.approvalStages.find((stage) =>
      stage.status === "pending" || stage.status === "current"
    )
  }

  const canApprove = () => {
    const currentStage = getCurrentStage()
    if (!currentStage) return false

    return currentStage.approvers.some((approver) =>
      approver.userId === "current-user-id" && approver.status === "pending"
    )
  }

  const canComment = () => {
    return true // 실제로는 권한 체크 로직 필요
  }

  const handleApprove = async () => {
    if (!onApprove) return
    setIsSubmitting(true)
    try {
      await onApprove(approval.id)
      onClose()
    } catch (error) {
      console.error("승인 처리 중 오류:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReject = async () => {
    if (!onReject) return
    setIsSubmitting(true)
    try {
      await onReject(approval.id)
      onClose()
    } catch (error) {
      console.error("반려 처리 중 오류:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddComment = async () => {
    if (!onAddComment || !newComment.trim()) return
    setIsSubmitting(true)
    try {
      await onAddComment(approval.id, newComment)
      setNewComment("")
    } catch (error) {
      console.error("댓글 작성 중 오류:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // 히스토리와 댓글을 합친 타임라인 생성
  const timeline = [
    ...(approval.history || []).map((item, index) => ({
      ...item,
      uniqueId: `history-${item.id || index}`
    })),
    ...(approval.comments || []).map((comment, index) => ({
      ...comment,
      action: "comment",
      type: "comment" as const,
      uniqueId: `comment-${comment.id || index}`
    }))
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <TooltipProvider>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="!max-w-5xl !w-[95vw] max-h-[90vh] flex flex-col p-0 sm:p-6">
          <DialogHeader className="pb-4 px-4 sm:px-0">
            <DialogTitle>
              <ApprovalHeader approval={approval} />
            </DialogTitle>
          </DialogHeader>

          {/* 데스크톱 레이아웃 */}
          <div className="hidden lg:flex flex-1 overflow-hidden gap-4">
            {/* 왼쪽 컬럼 - 메인 콘텐츠 */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 pl-2">
              <ApprovalInfo approval={approval} />

              <Separator />

              {/* 상세 내용 */}
              <div className="space-y-2">
                <div className="p-3">
                  <div className="text-base leading-relaxed whitespace-pre-wrap break-words">
                    {approval.content}
                  </div>
                </div>
              </div>

              {/* 첨부 파일 */}
              {approval.attachments && approval.attachments.length > 0 && (
                <>
                  <Separator />
                  <AttachmentsSection attachments={approval.attachments} />
                </>
              )}

              {/* 타임라인 및 댓글 */}
              {timeline.length > 0 && (
                <>
                  <Separator />
                  <TimelineSection
                    timeline={timeline}
                    newComment={newComment}
                    setNewComment={setNewComment}
                    onAddComment={handleAddComment}
                    isSubmitting={isSubmitting}
                    canComment={canComment()}
                  />
                </>
              )}
            </div>

            {/* 오른쪽 컬럼 - 승인 단계 및 참조자 */}
            <div className="w-80 flex-shrink-0 flex flex-col p-0">
              <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50 rounded-lg p-2">
                {/* 승인 단계 정보 (참조자 포함) */}
                {(approval.approvalStages && approval.approvalStages.length > 0) || (approval.references && approval.references.length > 0) ? (
                  <ApprovalStagesSection stages={approval.approvalStages || []} references={approval.references} />
                ) : null}
              </div>

              {/* 승인/반려 버튼 */}
              {approval.status === "pending" && canApprove() && (
                <div className="mt-4">
                  <div className="flex gap-3">
                    <GradientButton
                      variant="success"
                      onClick={handleApprove}
                      disabled={isSubmitting}
                      className="flex-1 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                      승인
                    </GradientButton>
                    <GradientButton
                      variant="error"
                      onClick={handleReject}
                      disabled={isSubmitting}
                      className="flex-1 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                      반려
                    </GradientButton>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 모바일 레이아웃 */}
          <div className="lg:hidden flex-1 overflow-y-auto">
            <div className="space-y-3 p-3">
              <ApprovalInfo approval={approval} />

              {/* 상세 내용 */}
              <div className="space-y-2">
                <div className="p-3">
                  <div className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                    {approval.content}
                  </div>
                </div>
              </div>

              {/* 승인 단계 정보 (참조자 포함) */}
              {(approval.approvalStages && approval.approvalStages.length > 0) || (approval.references && approval.references.length > 0) ? (
                <CollapsibleSection title="승인 단계" defaultOpen={true}>
                  <ApprovalStagesSection stages={approval.approvalStages || []} references={approval.references} />
                </CollapsibleSection>
              ) : null}

              {/* 첨부 파일 */}
              {approval.attachments && approval.attachments.length > 0 && (
                <CollapsibleSection title="첨부파일">
                  <AttachmentsSection attachments={approval.attachments} />
                </CollapsibleSection>
              )}

              {/* 타임라인 및 댓글 */}
              {timeline.length > 0 && (
                <CollapsibleSection title="활동 내역 및 댓글">
                  <TimelineSection
                    timeline={timeline}
                    newComment={newComment}
                    setNewComment={setNewComment}
                    onAddComment={handleAddComment}
                    isSubmitting={isSubmitting}
                    canComment={canComment()}
                  />
                </CollapsibleSection>
              )}

              {/* 승인/반려 버튼 - 모바일에서는 하단 고정 */}
              {approval.status === "pending" && canApprove() && (
                <div className="sticky bottom-0 bg-white border-t border-gray-200 pt-3 mt-4">
                  <div className="flex gap-3">
                    <GradientButton
                      variant="success"
                      onClick={handleApprove}
                      disabled={isSubmitting}
                      className="flex-1 flex items-center justify-center gap-2 h-12"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                      승인
                    </GradientButton>
                    <GradientButton
                      variant="error"
                      onClick={handleReject}
                      disabled={isSubmitting}
                      className="flex-1 flex items-center justify-center gap-2 h-12"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                      반려
                    </GradientButton>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
} 