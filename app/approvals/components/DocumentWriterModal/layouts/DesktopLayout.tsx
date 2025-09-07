"use client"

import { memo } from "react"
import { GradientButton } from "@/components/ui/gradient-button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Loader2, Send, Save, Trash2 } from "lucide-react"
import { typography } from "@/lib/design-tokens"
import { AttachmentUsageType } from "@/lib/services/approval/types"
import { AttachmentsManager } from "@/components/ui/attachments-manager"

import { ApprovalStagesManager } from "../components/ApprovalStagesManager"
import { ReferencesManager } from "../components/ReferencesManager"
import { ReferenceFilesManager } from "../components/ReferenceFilesManager"
import { FormFieldRenderer } from "../components/FormFieldRenderer"
import { DocumentWriterLayoutProps } from "../types"

const DesktopLayoutComponent = ({
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
  setShowDeleteConfirm,
  isCreating,
  isUpdating,
  isSubmittingDocument,
  isDeletingDocument
}: DocumentWriterLayoutProps & {
  isCreating: boolean
  isUpdating: boolean
  isSubmittingDocument: boolean
  isDeletingDocument: boolean
}) => {

  return (
    <div className="hidden lg:flex flex-1 overflow-hidden gap-6 p-6 pt-4 min-h-0">
      {/* 왼쪽 컬럼 - 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col min-h-0 min-w-0">
        {/* 양식 필드 */}
        {formTemplate.fields && formTemplate.fields.length > 0 && (
          <div className="space-y-4 mb-4 p-4 bg-gray-50 rounded-lg flex-shrink-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {formTemplate.fields.map((field, index) => (
                <div key={field.id || `field-${index}-${field.name}`} className="space-y-2">
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

        {/* 임시저장 및 결재 요청 버튼 */}
        <div className="mt-4 flex-shrink-0">
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
              {currentDraftId ? "저장하기" : "임시저장"}
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
            <div className="mt-2">
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

// React.memo로 컴포넌트 최적화
export const DesktopLayout = memo(DesktopLayoutComponent)