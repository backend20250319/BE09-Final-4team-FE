"use client"

import { GradientButton } from "@/components/ui/gradient-button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Send, Save, Trash2 } from "lucide-react"
import { AttachmentUsageType } from "@/lib/services/approval/types"
import { AttachmentsManager } from "@/components/ui/attachments-manager"

import { CollapsibleSection } from "../components/CollapsibleSection"
import { ApprovalStagesManager } from "../components/ApprovalStagesManager"
import { ReferencesManager } from "../components/ReferencesManager"
import { ReferenceFilesManager } from "../components/ReferenceFilesManager"
import { FormFieldRenderer } from "../components/FormFieldRenderer"
import { DocumentWriterLayoutProps } from "../types"

export function MobileLayout({
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
  onSaveDraft,
  onSubmit,
  onDelete,
  isDeleting,
  setShowDeleteConfirm
}: DocumentWriterLayoutProps & {
  isCreating: boolean
  isUpdating: boolean
  isSubmittingDocument: boolean
  isDeletingDocument: boolean
}) {
  const { isCreating, isUpdating, isSubmittingDocument, isDeletingDocument } = arguments[0] as any

  return (
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

        {/* 임시저장 및 결재 요청 버튼 - 모바일에서는 하단 고정 */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 pt-4 mt-4">
          <div className="flex gap-3">
            {/* 임시저장 버튼 */}
            <Button
              variant="outline"
              onClick={onSaveDraft}
              disabled={isSubmitting || isCreating || isUpdating}
              className="flex-1 flex items-center justify-center gap-2 h-12"
            >
              {(isSubmitting && !currentDraftId) || isUpdating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {currentDraftId ? "저장" : "임시저장"}
            </Button>
            
            {/* 결재 요청 버튼 */}
            <GradientButton
              variant="primary"
              onClick={onSubmit}
              disabled={isSubmitting || isCreating || isSubmittingDocument}
              className="flex-1 flex items-center justify-center gap-2 h-12"
            >
              {(isSubmitting && currentDraftId) || isCreating || isSubmittingDocument ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              결재 요청하기
            </GradientButton>
          </div>

          {/* 삭제 버튼 - DRAFT 문서일 때만 표시 */}
          {currentDraftId && (
            <div className="mt-3">
              <Button
                variant="ghost"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isDeleting || isDeletingDocument}
                className="w-full flex items-center justify-center gap-2 h-10 text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                {isDeleting || isDeletingDocument ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                임시저장 문서 삭제
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}