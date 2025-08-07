"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientButton } from "@/components/ui/gradient-button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { colors, typography } from "@/lib/design-tokens"
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
} from "lucide-react"

interface ApprovalModalProps {
  isOpen: boolean
  onClose: () => void
  approval: any
  onApprove?: (approvalId: number, comment?: string) => void
  onReject?: (approvalId: number, comment?: string) => void
  onAddComment?: (approvalId: number, comment: string) => void
}

export function ApprovalModal({ 
  isOpen, 
  onClose, 
  approval, 
  onApprove, 
  onReject,
  onAddComment
}: ApprovalModalProps) {
  const [comment, setComment] = useState("")
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState<"history" | "comments">("history")

  if (!approval) return null

  const getStatusIcon = (status: string, isMyApproval?: boolean) => {
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

  const getStatusColor = (status: string, isMyApproval?: boolean) => {
    switch (status) {
      case "pending":
        return isMyApproval ? colors.status.warning.gradient : colors.status.info.gradient
      case "approved":
        return colors.status.success.gradient
      case "rejected":
        return colors.status.error.gradient
      default:
        return colors.status.info.gradient
    }
  }

  const getStatusText = (status: string, isMyApproval?: boolean) => {
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

  const getHistoryIcon = (action: string) => {
    switch (action) {
      case "created":
        return Plus
      case "updated":
        return Edit
      case "approved":
        return CheckCircle
      case "rejected":
        return XCircle
      case "comment":
        return MessageSquare
      case "approver_added":
        return UserPlus
      case "approver_removed":
        return UserMinus
      case "file_attached":
        return Download
      default:
        return History
    }
  }

  const getHistoryColor = (action: string) => {
    switch (action) {
      case "created":
        return "bg-blue-100 text-blue-600"
      case "updated":
        return "bg-yellow-100 text-yellow-600"
      case "approved":
        return "bg-green-100 text-green-600"
      case "rejected":
        return "bg-red-100 text-red-600"
      case "comment":
        return "bg-purple-100 text-purple-600"
      case "approver_added":
        return "bg-indigo-100 text-indigo-600"
      case "approver_removed":
        return "bg-gray-100 text-gray-600"
      case "file_attached":
        return "bg-orange-100 text-orange-600"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  const getHistoryText = (action: string) => {
    switch (action) {
      case "created":
        return "문서 생성"
      case "updated":
        return "문서 수정"
      case "approved":
        return "승인"
      case "rejected":
        return "반려"
      case "comment":
        return "댓글 작성"
      case "approver_added":
        return "승인권자 추가"
      case "approver_removed":
        return "승인권자 제거"
      case "file_attached":
        return "첨부파일 추가"
      default:
        return action
    }
  }

  const handleApprove = async () => {
    if (!onApprove) return
    setIsSubmitting(true)
    try {
      await onApprove(approval.id, comment)
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
      await onReject(approval.id, comment)
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

  const getCurrentStage = () => {
    if (!approval.approvalStages) return null
    return approval.approvalStages.find((stage: any) => 
      stage.status === "pending" || stage.status === "current"
    )
  }

  const canApprove = () => {
    const currentStage = getCurrentStage()
    if (!currentStage) return false
    
    return currentStage.approvers.some((approver: any) => 
      approver.userId === "current-user-id" && approver.status === "pending"
    )
  }

  const canComment = () => {
    // 문서를 볼 수 있는 권한이 있는 사용자는 댓글을 달 수 있음
    return true // 실제로는 권한 체크 로직 필요
  }

  const StatusIcon = getStatusIcon(approval.status, approval.isMyApproval)
  const statusColor = getStatusColor(approval.status, approval.isMyApproval)

  // 히스토리와 댓글을 합친 타임라인 생성
  const timeline = [
    ...(approval.history || []),
    ...(approval.comments || []).map((comment: any) => ({
      ...comment,
      action: "comment",
      type: "comment"
    }))
  ].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-6xl !w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={`w-10 h-10 bg-gradient-to-r ${statusColor} rounded-lg flex items-center justify-center`}>
              <approval.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className={`${typography.h2} text-gray-800`}>{approval.title}</h2>
              <p className="text-sm text-gray-500">{approval.type} • {approval.department}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽 컬럼 - 메인 콘텐츠 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 상태 및 기본 정보 */}
            <GlassCard className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 bg-gradient-to-r ${statusColor} rounded-lg flex items-center justify-center`}>
                      <StatusIcon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">상태</p>
                      <p className={`${typography.h4} font-semibold`}>
                        {getStatusText(approval.status, approval.isMyApproval)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">신청자</p>
                      <p className={`${typography.h4} font-semibold`}>{approval.requester}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">신청일</p>
                      <p className={`${typography.h4} font-semibold`}>{approval.date}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {approval.status === "pending" && (
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">현재 단계</p>
                        <p className={`${typography.h4} font-semibold`}>
                          {getCurrentStage() ? `${approval.approvalStages.indexOf(getCurrentStage()) + 1}단계 승인` : "승인 대기"}
                        </p>
                      </div>
                    </div>
                  )}

                  {approval.priority === "high" && (
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-red-400" />
                      <div>
                        <p className="text-sm text-gray-500">우선순위</p>
                        <p className={`${typography.h4} font-semibold text-red-600`}>긴급</p>
                      </div>
                    </div>
                  )}

                  {approval.status !== "pending" && (
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">처리일</p>
                        <p className={`${typography.h4} font-semibold`}>{approval.date}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>

            {/* 상세 내용 */}
            <GlassCard className="p-6">
              <h3 className={`${typography.h3} text-gray-800 mb-4 flex items-center gap-2`}>
                <FileText className="w-5 h-5" />
                상세 내용
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed">{approval.content}</p>
              </div>
            </GlassCard>

            {/* 첨부 파일 (예시) */}
            {approval.attachments && approval.attachments.length > 0 && (
              <GlassCard className="p-6">
                <h3 className={`${typography.h3} text-gray-800 mb-4 flex items-center gap-2`}>
                  <Download className="w-5 h-5" />
                  첨부 파일
                </h3>
                <div className="space-y-2">
                  {approval.attachments.map((file: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{file.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <Eye className="w-4 h-4 text-gray-500" />
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <Download className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}

            {/* 승인/반려 액션 */}
            {approval.status === "pending" && canApprove() && (
              <GlassCard className="p-6">
                <h3 className={`${typography.h3} text-gray-800 mb-4`}>처리 의견</h3>
                <Textarea
                  placeholder="처리 의견을 입력하세요 (선택사항)"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="mb-4"
                  rows={3}
                />
                <div className="flex gap-3 justify-end">
                  <GradientButton
                    variant="error"
                    onClick={handleReject}
                    disabled={isSubmitting}
                    className="flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    반려
                  </GradientButton>
                  <GradientButton
                    variant="success"
                    onClick={handleApprove}
                    disabled={isSubmitting}
                    className="flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    승인
                  </GradientButton>
                </div>
              </GlassCard>
            )}

            {/* 댓글 작성 */}
            {canComment() && (
              <GlassCard className="p-6">
                <h3 className={`${typography.h3} text-gray-800 mb-4 flex items-center gap-2`}>
                  <MessageSquare className="w-5 h-5" />
                  댓글 작성
                </h3>
                <div className="flex gap-3">
                  <Textarea
                    placeholder="댓글을 입력하세요..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1"
                    rows={2}
                  />
                  <Button
                    onClick={handleAddComment}
                    disabled={isSubmitting || !newComment.trim()}
                    className="flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    작성
                  </Button>
                </div>
              </GlassCard>
            )}

            {/* 히스토리 및 댓글 타임라인 */}
            {timeline.length > 0 && (
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`${typography.h3} text-gray-800 flex items-center gap-2`}>
                    <History className="w-5 h-5" />
                    타임라인
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      variant={activeTab === "history" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveTab("history")}
                    >
                      전체
                    </Button>
                    <Button
                      variant={activeTab === "comments" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveTab("comments")}
                    >
                      댓글만
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {timeline
                    .filter((item: any) => 
                      activeTab === "history" || 
                      (activeTab === "comments" && item.action === "comment")
                    )
                    .map((item: any, index: number) => {
                      const HistoryIcon = getHistoryIcon(item.action)
                      const historyColor = getHistoryColor(item.action)
                      
                      return (
                        <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${historyColor}`}>
                            <HistoryIcon className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={item.user?.avatar} alt={item.user?.name} />
                                <AvatarFallback className="text-xs">
                                  {item.user?.name?.charAt(0) || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium text-gray-800">{item.user?.name || item.user}</span>
                              <span className="text-sm text-gray-500">{item.date}</span>
                              {item.action !== "comment" && (
                                <span className="text-sm text-gray-600">
                                  {getHistoryText(item.action)}
                                </span>
                              )}
                            </div>
                            

                            
                            {item.changes && (
                              <div className="bg-white rounded-lg p-3 border border-gray-200">
                                <p className="text-sm text-gray-600 mb-2">변경 사항:</p>
                                <ul className="text-sm text-gray-700 space-y-1">
                                  {item.changes.map((change: any, changeIndex: number) => (
                                    <li key={changeIndex} className="flex items-center gap-2">
                                      <span className="text-gray-500">•</span>
                                      <span>{change.field}: </span>
                                      <span className="text-red-500 line-through">{change.oldValue}</span>
                                      <ArrowRight className="w-3 h-3 text-gray-400" />
                                      <span className="text-green-600">{change.newValue}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {item.action === "comment" && (
                              <div className="bg-white rounded-lg p-3 border border-gray-200">
                                <p className="text-sm text-gray-700">{item.content}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                </div>
              </GlassCard>
            )}
          </div>

          {/* 오른쪽 컬럼 - 승인 단계 및 참조자 */}
          <div className="space-y-6">
            {/* 승인 단계 정보 */}
            {approval.approvalStages && approval.approvalStages.length > 0 && (
              <GlassCard className="p-6">
                <h3 className={`${typography.h3} text-gray-800 mb-4 flex items-center gap-2`}>
                  <Users className="w-5 h-5" />
                  승인 단계
                </h3>
                <div className="space-y-3">
                  {approval.approvalStages.map((stage: any, stageIndex: number) => (
                    <div key={stageIndex} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            stage.status === "completed" ? "bg-green-100" :
                            stage.status === "current" ? "bg-blue-100" :
                            stage.status === "pending" ? "bg-yellow-100" :
                            "bg-red-100"
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
                          <div>
                            <p className="font-medium text-gray-800">
                              {stageIndex + 1}단계 승인
                              <span className={`text-sm ml-2 ${
                                stage.status === "completed" ? "text-green-600" :
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
                        <div className="text-sm text-gray-500">
                          {stage.approvers.filter((a: any) => a.status === "completed").length}/{stage.approvers.length} 승인
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {stage.approvers.map((approver: any, approverIndex: number) => (
                          <div key={approverIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
                            <div className="text-right">
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
                </div>
              </GlassCard>
            )}

            {/* 참조자 정보 */}
            {approval.references && approval.references.length > 0 && (
              <GlassCard className="p-6">
                <h3 className={`${typography.h3} text-gray-800 mb-4 flex items-center gap-2`}>
                  <Eye className="w-5 h-5" />
                  참조자
                </h3>
                <div className="space-y-3">
                  {approval.references.map((reference: any, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
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
                  ))}
                </div>
              </GlassCard>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 