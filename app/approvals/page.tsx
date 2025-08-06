"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientButton } from "@/components/ui/gradient-button"
import { Input } from "@/components/ui/input"
import { ApprovalModal } from "@/components/ui/approval-modal"
import { colors, typography } from "@/lib/design-tokens"
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
} from "lucide-react"

export default function ApprovalsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<"inProgress" | "completed">("inProgress")
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    myPending: false,
    inProgress: false,
    approved: false,
    rejected: false,
  })
  const [selectedApproval, setSelectedApproval] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 현재 사용자 정보 (실제로는 인증 시스템에서 가져옴)
  const currentUser = "김철수"

  const approvals = [
    {
      id: 1,
      title: "연차 신청",
      type: "휴가",
      requester: "김철수",
      department: "개발팀",
      date: "2025.07.25",
      status: "pending",
      priority: "normal",
      content: "8월 1일 연차 사용 신청합니다.",
      icon: Calendar,
      color: colors.status.warning.gradient,
      approver: "김인사", // 기존 호환성을 위한 필드
      isMyApproval: true, // 내가 승인해야 하는지
              approvalStages: [
          {
            id: 1,
            status: "completed",
            approvers: [
              {
                userId: "team-leader-1",
                name: "박팀장",
                position: "개발팀장",
                status: "completed",
                comment: "승인합니다.",
                date: "2025.07.26"
              }
            ]
          },
          {
            id: 2,
            status: "current",
          approvers: [
            {
              userId: "current-user-id", // 현재 사용자
              name: "김인사",
              position: "인사팀장",
              status: "pending"
            },
            {
              userId: "hr-manager-1",
              name: "이인사",
              position: "인사팀원",
              status: "pending"
            }
          ]
        }
      ],
      references: [
        {
          userId: "ref-1",
          name: "정수민",
          position: "경영지원팀장"
        },
        {
          userId: "ref-2", 
          name: "최지영",
          position: "인사팀원"
        }
      ]
    },
    {
      id: 2,
      title: "업무용 장비 구매",
      type: "구매",
      requester: "이영희",
      department: "디자인팀",
      date: "2025.07.24",
      status: "approved",
      priority: "high",
      content: "디자인 작업용 태블릿 구매 신청",
      icon: FileText,
      color: colors.status.success.gradient,
      approver: "김철수",
      isMyApproval: false,
      approvalStages: [
        {
          id: 1,
          status: "completed",
          approvers: [
            {
              userId: "design-leader-1",
              name: "최디자인",
              position: "디자인팀장",
              status: "completed",
              comment: "승인합니다.",
              date: "2025.07.25"
            }
          ]
        },
        {
          id: 2,
          status: "completed",
          approvers: [
            {
              userId: "current-user-id",
              name: "김철수",
              position: "개발팀장",
              status: "completed",
              comment: "승인합니다.",
              date: "2025.07.25"
            }
          ]
        },
        {
          id: 3,
          status: "completed",
          approvers: [
            {
              userId: "support-manager-1",
              name: "정수민",
              position: "경영지원팀장",
              status: "completed",
              comment: "승인합니다.",
              date: "2025.07.26"
            }
          ]
        }
      ],
      references: [
        {
          userId: "ref-3",
          name: "박민수",
          position: "마케팅팀장"
        }
      ]
    },
    {
      id: 3,
      title: "출장 신청",
      type: "출장",
      requester: "박민수",
      department: "마케팅팀",
      date: "2025.07.23",
      status: "rejected",
      priority: "normal",
      content: "고객사 방문을 위한 출장 신청",
      icon: ArrowRight,
      color: colors.status.error.gradient,
      approver: "김철수",
      isMyApproval: false,
      approvalStages: [
        {
          id: 1,
          status: "completed",
          approvers: [
            {
              userId: "marketing-leader-1",
              name: "김마케팅",
              position: "마케팅팀장",
              status: "completed",
              comment: "승인합니다.",
              date: "2025.07.24"
            }
          ]
        },
        {
          id: 2,
          status: "rejected",
          approvers: [
            {
              userId: "current-user-id",
              name: "김철수",
              position: "개발팀장",
              status: "rejected",
              comment: "예산 부족으로 반려합니다.",
              date: "2025.07.25"
            }
          ]
        }
      ],
      references: [
        {
          userId: "ref-4",
          name: "이영희",
          position: "디자인팀장"
        }
      ]
    },
    {
      id: 4,
      title: "교육 참석 신청",
      type: "교육",
      requester: "최지영",
      department: "인사팀",
      date: "2025.07.22",
      status: "pending",
      priority: "normal",
      content: "HR 전문가 과정 교육 참석 신청",
      icon: User,
      color: colors.status.info.gradient,
      approver: "김인사",
      isMyApproval: true,
      approvalStages: [
        {
          id: 1,
          status: "completed",
          approvers: [
            {
              userId: "hr-leader-1",
              name: "김인사",
              position: "인사팀장",
              status: "completed",
              comment: "승인합니다.",
              date: "2025.07.23"
            }
          ]
        },
        {
          id: 2,
          status: "current",
          approvers: [
            {
              userId: "current-user-id",
              name: "김인사",
              position: "인사팀장",
              status: "pending"
            },
            {
              userId: "executive-1",
              name: "박대표",
              position: "대표이사",
              status: "pending"
            }
          ]
        }
      ],
      references: [
        {
          userId: "ref-5",
          name: "정수민",
          position: "경영지원팀장"
        }
      ]
    },
    {
      id: 5,
      title: "회의실 예약",
      type: "시설",
      requester: "정수민",
      department: "경영지원팀",
      date: "2025.07.21",
      status: "approved",
      priority: "low",
      content: "다음 주 월요일 대회의실 예약 신청",
      icon: FileText,
      color: colors.status.success.gradient,
      approver: "박민수",
      isMyApproval: false,
      approvalStages: [
        {
          id: 1,
          status: "completed",
          approvers: [
            {
              userId: "support-leader-1",
              name: "정수민",
              position: "경영지원팀장",
              status: "completed",
              comment: "승인합니다.",
              date: "2025.07.22"
            }
          ]
        }
      ],
      references: [
        {
          userId: "ref-6",
          name: "박민수",
          position: "마케팅팀장"
        }
      ]
    },
    {
      id: 6,
      title: "프로젝트 예산 신청",
      type: "예산",
      requester: "김철수",
      department: "개발팀",
      date: "2025.07.20",
      status: "pending",
      priority: "high",
      content: "신규 프로젝트 개발 예산 신청",
      icon: FileText,
      color: colors.status.info.gradient,
      approver: "이영희",
      isMyApproval: false, // 내가 신청했지만 타인이 승인해야 함
      approvalStages: [
        {
          id: 1,
          status: "completed",
          approvers: [
            {
              userId: "dev-leader-1",
              name: "김철수",
              position: "개발팀장",
              status: "completed",
              comment: "승인합니다.",
              date: "2025.07.21"
            }
          ]
        },
        {
          id: 2,
          status: "current",
          approvers: [
            {
              userId: "design-leader-1",
              name: "이영희",
              position: "디자인팀장",
              status: "pending"
            }
          ]
        },
        {
          id: 3,
          status: "pending",
          approvers: [
            {
              userId: "executive-1",
              name: "박대표",
              position: "대표이사",
              status: "pending"
            }
          ]
        }
      ],
      references: [
        {
          userId: "ref-7",
          name: "정수민",
          position: "경영지원팀장"
        },
        {
          userId: "ref-8",
          name: "최지영",
          position: "인사팀장"
        }
      ]
    },
    {
      id: 7,
      title: "외부 교육 신청",
      type: "교육",
      requester: "김철수",
      department: "개발팀",
      date: "2025.07.19",
      status: "pending",
      priority: "normal",
      content: "React 고급 과정 교육 신청",
      icon: User,
      color: colors.status.info.gradient,
      approver: "박민수",
      isMyApproval: false, // 내가 신청했지만 타인이 승인해야 함
      approvalStages: [
        {
          id: 1,
          status: "completed",
          approvers: [
            {
              userId: "dev-leader-1",
              name: "김철수",
              position: "개발팀장",
              status: "completed",
              comment: "승인합니다.",
              date: "2025.07.20"
            }
          ]
        },
        {
          id: 2,
          status: "current",
          approvers: [
            {
              userId: "hr-manager-1",
              name: "박민수",
              position: "인사팀원",
              status: "pending"
            }
          ]
        }
      ],
      references: [
        {
          userId: "ref-9",
          name: "최지영",
          position: "인사팀장"
        }
      ]
    },
  ]

  const filteredApprovals = approvals.filter(approval => {
    const matchesSearch = approval.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         approval.requester.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  // 섹션별로 결재 분류
  const myPendingApprovals = filteredApprovals.filter(a => 
    a.status === "pending" && a.isMyApproval === true
  )
  const inProgressApprovals = filteredApprovals.filter(a => 
    a.status === "pending" && a.isMyApproval === false
  )
  // approved와 rejected를 구분하지 않고, 기존 approvals 배열의 순서를 유지하여 완료된 결재를 필터링
  const inProgressData = [...myPendingApprovals, ...inProgressApprovals]
  const completedData = filteredApprovals.filter(a => a.status === "approved" || a.status === "rejected")

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

  const handleApprovalClick = (approval: any) => {
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

  const renderApprovalCard = (approval: any) => {
    const StatusIcon = getStatusIcon(approval.status, approval.isMyApproval)
    const statusBgColor = getStatusBgColor(approval.status, approval.isMyApproval)
    const statusTextColor = getStatusTextColor(approval.status, approval.isMyApproval)
    
    return (
      <GlassCard 
        key={approval.id} 
        className="px-6 py-4 hover:shadow-lg transition-shadow cursor-pointer h-full overflow-hidden"
        onClick={() => handleApprovalClick(approval)}
      >
        <div className="flex items-center gap-4 h-full">
          <div
            className={`w-12 h-12 bg-gradient-to-r ${approval.color} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}
          >
            <approval.icon className="w-6 h-6 text-white" />
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
              {approval.status === "pending" && (
                <div className="flex items-center gap-1 ml-auto flex-shrink-0">
                  <User className="w-4 h-4" />
                  <span className="text-sm text-gray-500 truncate">승인자: {approval.approver}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <h4 className="text-lg font-semibold text-gray-800 min-w-fit truncate">{approval.title}</h4>
              <p className="text-gray-600 flex-1 truncate">{approval.content}</p>
              <div className="flex gap-2 flex-shrink-0">
                {approval.status === "pending" && approval.isMyApproval && (
                  <>
                    <GradientButton 
                      variant="success" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleApprovalClick(approval)
                      }}
                    >
                      승인
                    </GradientButton>
                    <GradientButton 
                      variant="error" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleApprovalClick(approval)
                      }}
                    >
                      반려
                    </GradientButton>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    )
  }

  const renderSection = (title: string, approvals: any[], status: string, IconComponent: any, color: string) => {
    if (approvals.length === 0) return null

    return (
      <div className="space-y-4">
        <div 
          className="flex items-center gap-3 p-4 bg-white/40 backdrop-blur-sm rounded-xl cursor-pointer hover:bg-white/60 transition-colors"
          onClick={() => toggleSection(status)}
        >
          <div className={`w-8 h-8 bg-gradient-to-r ${color} rounded-lg flex items-center justify-center`}>
            <IconComponent className="w-4 h-4 text-white" />
          </div>
          <h2 className={`${typography.h3} text-gray-800 flex-1`}>
            {title} ({approvals.length}건)
          </h2>
          {collapsedSections[status] ? (
            <ChevronRight className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </div>
        
        {!collapsedSections[status] && (
          <div className="space-y-4 pl-4">
            {approvals.map(renderApprovalCard)}
          </div>
        )}
      </div>
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
        <GradientButton variant="primary">
          <Plus className="w-4 h-4 mr-2" />
          결재 신청
        </GradientButton>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("inProgress")}
          className={`px-6 py-3 text-sm font-medium transition-colors ${
            activeTab === "inProgress"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          진행중
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={`px-6 py-3 text-sm font-medium transition-colors ${
            activeTab === "completed"
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
          {/* 승인 필요 - 가장 우선적으로 표시 */}
          {renderSection("승인 필요", myPendingApprovals, "myPending", AlertCircle, colors.status.warning.gradient)}
          
          {/* 진행중 - 타인의 승인을 기다리는 결재 */}
          {renderSection("진행중", inProgressApprovals, "inProgress", Clock, colors.status.info.gradient)}
          
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
        approval={selectedApproval}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </MainLayout>
  )
} 