"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2, Trash2 } from "lucide-react"
import { typography } from "@/lib/design-tokens"
import { TemplateIcon } from "../common/TemplateIcon"
import { TooltipProvider } from "@/components/ui/tooltip"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { useDocumentWriter } from "../../hooks/useDocumentWriter"
import { DesktopLayout } from "./layouts/DesktopLayout"
import { MobileLayout } from "./layouts/MobileLayout"
import { DocumentWriterModalProps } from "./types"

export function DocumentWriterModal({
  isOpen,
  onClose,
  onBack,
  formTemplate,
  draftDocumentId
}: DocumentWriterModalProps) {
  const {
    // 상태
    content,
    attachments,
    approvalStages,
    references,
    formFieldValues,
    isSubmitting,
    availableUsers,
    usersLoading,
    error,
    currentDraftId,
    isDraft,
    isDeleting,
    showDeleteConfirm,
    
    // 액션
    setContent,
    setAttachments,
    setApprovalStages,
    setReferences,
    setFormFieldValues,
    setShowDeleteConfirm,
    
    // 핸들러
    handleSaveDraft,
    handleDelete,
    handleSubmit,
    
    // 훅들의 로딩 상태
    isCreating,
    isUpdating,
    isSubmittingDocument,
    isDeletingDocument
  } = useDocumentWriter(isOpen, formTemplate, draftDocumentId)

  // 삭제 처리 (성공시 모달 닫기)
  const onDelete = async () => {
    const success = await handleDelete()
    if (success) {
      onClose()
    }
  }

  // 제출 처리 (성공시 모달 닫기)
  const onSubmit = async () => {
    const success = await handleSubmit()
    if (success) {
      onClose()
    }
  }

  if (!formTemplate) return null

  return (
    <TooltipProvider>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="!max-w-6xl !w-[95vw] h-[85vh] flex flex-col p-0">
          {/* 헤더 */}
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

          {/* 공통 props */}
          {(() => {
            const commonProps = {
              formTemplate,
              content,
              setContent,
              attachments,
              setAttachments,
              approvalStages,
              setApprovalStages,
              references,
              setReferences,
              formFieldValues,
              setFormFieldValues,
              availableUsers,
              usersLoading,
              isSubmitting,
              currentDraftId,
              error,
              onSaveDraft: handleSaveDraft,
              onSubmit,
              onDelete,
              isDeleting,
              setShowDeleteConfirm,
              // 추가 props
              isCreating,
              isUpdating,
              isSubmittingDocument,
              isDeletingDocument
            }

            return (
              <>
                {/* 데스크탑 레이아웃 */}
                <DesktopLayout {...commonProps} />
                
                {/* 모바일 레이아웃 */}
                <MobileLayout {...commonProps} />
              </>
            )
          })()}
        </DialogContent>

        {/* 삭제 확인 다이얼로그 */}
        <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>문서 삭제 확인</AlertDialogTitle>
              <AlertDialogDescription>
                이 임시저장된 문서를 완전히 삭제하시겠습니까?
                <br />
                삭제된 문서는 복구할 수 없습니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting || isDeletingDocument}>
                취소
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={onDelete}
                disabled={isDeleting || isDeletingDocument}
                className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              >
                {isDeleting || isDeletingDocument ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    삭제 중...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    삭제하기
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Dialog>
    </TooltipProvider>
  )
}