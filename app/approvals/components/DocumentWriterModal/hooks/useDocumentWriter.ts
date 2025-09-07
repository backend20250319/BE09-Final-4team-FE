import { useEffect, useReducer, useCallback, useMemo } from "react"
import { 
  TemplateResponse,
  DocumentFieldValueRequest,
  ApprovalStageRequest,
  ApprovalTargetRequest,
  TargetType,
  CreateDocumentRequest,
  UpdateDocumentRequest,
  DocumentStatus,
  AttachmentUsageType
} from "@/lib/services/approval/types"
import { UserResponseDto } from "@/lib/services/user/types"
import { userApi } from "@/lib/services/user/api"
import { useCreateDocument, useUpdateDocument, useSubmitDocument, useDocument, useDeleteDocument } from "../../../hooks/useApproval"
import { Attachment } from "@/components/ui/attachments-manager"
import { DocumentWriterState, DocumentWriterAction, LocalApprovalStage, LocalReference } from "../types"

// 초기 상태 정의
const initialState: DocumentWriterState = {
  content: "",
  attachments: [],
  approvalStages: [{
    id: "stage-1",
    name: "1단계",
    approvers: []
  }],
  references: [],
  formFieldValues: {},
  isSubmitting: false,
  availableUsers: [],
  usersLoading: false,
  error: null,
  currentDraftId: null,
  isDraft: false,
  isDeleting: false,
  showDeleteConfirm: false
}

// 리듀서 함수
function documentWriterReducer(state: DocumentWriterState, action: DocumentWriterAction): DocumentWriterState {
  switch (action.type) {
    case 'SET_CONTENT':
      if (state.content === action.payload) return state
      return { ...state, content: action.payload }
    case 'SET_ATTACHMENTS':
      if (state.attachments === action.payload) return state
      return { ...state, attachments: action.payload }
    case 'SET_APPROVAL_STAGES':
      if (state.approvalStages === action.payload) return state
      return { ...state, approvalStages: action.payload }
    case 'SET_REFERENCES':
      if (state.references === action.payload) return state
      return { ...state, references: action.payload }
    case 'SET_FORM_FIELD_VALUES':
      if (state.formFieldValues === action.payload) return state
      return { ...state, formFieldValues: action.payload }
    case 'SET_IS_SUBMITTING':
      if (state.isSubmitting === action.payload) return state
      return { ...state, isSubmitting: action.payload }
    case 'SET_AVAILABLE_USERS':
      if (state.availableUsers === action.payload) return state
      return { ...state, availableUsers: action.payload }
    case 'SET_USERS_LOADING':
      if (state.usersLoading === action.payload) return state
      return { ...state, usersLoading: action.payload }
    case 'SET_ERROR':
      if (state.error === action.payload) return state
      return { ...state, error: action.payload }
    case 'SET_CURRENT_DRAFT_ID':
      if (state.currentDraftId === action.payload) return state
      return { ...state, currentDraftId: action.payload }
    case 'SET_IS_DRAFT':
      if (state.isDraft === action.payload) return state
      return { ...state, isDraft: action.payload }
    case 'SET_IS_DELETING':
      if (state.isDeleting === action.payload) return state
      return { ...state, isDeleting: action.payload }
    case 'SET_SHOW_DELETE_CONFIRM':
      if (state.showDeleteConfirm === action.payload) return state
      return { ...state, showDeleteConfirm: action.payload }
    case 'RESET_STATE':
      return initialState
    case 'INITIALIZE_FROM_TEMPLATE':
      return {
        ...initialState,
        content: action.payload.template.bodyTemplate || "",
        currentDraftId: action.payload.draftDocumentId || null,
        isDraft: !!action.payload.draftDocumentId
      }
    default:
      return state
  }
}

export function useDocumentWriter(
  isOpen: boolean,
  formTemplate: TemplateResponse | null,
  draftDocumentId?: number
) {
  const [state, dispatch] = useReducer(documentWriterReducer, initialState)
  
  // Approval 훅들
  const createDocument = useCreateDocument()
  const updateDocument = useUpdateDocument()
  const submitDocument = useSubmitDocument()
  const deleteDocument = useDeleteDocument()
  const { data: draftDocument, isLoading: draftLoading } = useDocument(state.currentDraftId)

  // 모달이 열릴 때/닫힐 때 상태 관리
  useEffect(() => {
    if (isOpen && formTemplate && !draftDocument) {
      dispatch({
        type: 'INITIALIZE_FROM_TEMPLATE',
        payload: { template: formTemplate, draftDocumentId }
      })
    } else if (!isOpen) {
      dispatch({ type: 'RESET_STATE' })
    }
  }, [isOpen, formTemplate, draftDocument, draftDocumentId])

  // DRAFT 문서 로드 시 필드 초기화
  useEffect(() => {
    if (draftDocument && draftDocument.status === DocumentStatus.DRAFT) {
      dispatch({ type: 'SET_CONTENT', payload: draftDocument.content || "" })
      
      // 양식 필드 값 설정
      const fieldValues: Record<string, any> = {}
      draftDocument.fieldValues.forEach(fieldValue => {
        try {
          const value = fieldValue.fieldValue
          if (!value) {
            fieldValues[fieldValue.fieldName] = ""
            return
          }
          
          const parsedValue = value.startsWith('[') && value.endsWith(']') 
            ? JSON.parse(value)
            : value
          fieldValues[fieldValue.fieldName] = parsedValue
        } catch {
          fieldValues[fieldValue.fieldName] = fieldValue.fieldValue || ""
        }
      })
      dispatch({ type: 'SET_FORM_FIELD_VALUES', payload: fieldValues })
      
      // 승인 단계 설정
      const stages: LocalApprovalStage[] = draftDocument.approvalStages.map((stage, index) => ({
        id: `stage-${stage.stageOrder}`,
        name: stage.stageName,
        approvers: stage.approvalTargets.filter(target => !target.isReference).map((target, targetIndex) => ({
          id: target.user?.id || (Date.now() + index * 1000 + targetIndex),
          name: target.user?.name || '',
          profileImageUrl: target.user?.profileImageUrl,
          position: (target.user as any)?.position || undefined
        } as UserResponseDto))
      }))
      
      if (stages.length === 0) {
        stages.push({
          id: "stage-1",
          name: "1단계",
          approvers: []
        })
      }
      dispatch({ type: 'SET_APPROVAL_STAGES', payload: stages })
      
      // 참조자 설정
      const referenceTargets = draftDocument.referenceTargets.map((target, index) => ({
        id: target.user?.id || Date.now() + index,
        name: target.user?.name || '',
        avatar: target.user?.profileImageUrl,
        position: (target.user as any)?.position?.name || ''
      }))
      
      const uniqueReferences = referenceTargets.filter((reference, index, self) => 
        self.findIndex(r => r.id === reference.id) === index
      )
      dispatch({ type: 'SET_REFERENCES', payload: uniqueReferences })
      
      // 첨부파일 설정
      const attachmentList: Attachment[] = draftDocument.attachments.map(attachment => ({
        id: attachment.fileId,
        name: attachment.fileName,
        size: (attachment.fileSize / 1024).toFixed(1) + 'KB',
        url: `/api/files/${attachment.fileId}/download`
      }))
      dispatch({ type: 'SET_ATTACHMENTS', payload: attachmentList })
    }
  }, [draftDocument])

  // 사용자 목록 로드
  useEffect(() => {
    const loadUsers = async () => {
      dispatch({ type: 'SET_USERS_LOADING', payload: true })
      dispatch({ type: 'SET_ERROR', payload: null })
      try {
        const users = await userApi.getAllUsers()
        dispatch({ type: 'SET_AVAILABLE_USERS', payload: users })
      } catch (error) {
        console.error("사용자 목록 로드 실패:", error)
        dispatch({ type: 'SET_ERROR', payload: "사용자 목록을 불러오는데 실패했습니다." })
      } finally {
        dispatch({ type: 'SET_USERS_LOADING', payload: false })
      }
    }

    if (isOpen) {
      loadUsers()
    }
  }, [isOpen])

  // 임시저장 처리
  const handleSaveDraft = useCallback(async () => {
    if (!formTemplate) {
      dispatch({ type: 'SET_ERROR', payload: "템플릿 정보를 불러오는 중입니다. 잠시만 기다려주세요." })
      return
    }

    dispatch({ type: 'SET_IS_SUBMITTING', payload: true })
    dispatch({ type: 'SET_ERROR', payload: null })
    
    try {
      const fieldValues: DocumentFieldValueRequest[] = Object.entries(state.formFieldValues)
        .map(([fieldName, fieldValue]) => {
          const templateField = formTemplate.fields?.find(f => f.name === fieldName)
          if (!templateField?.id) return null // templateFieldId가 없으면 제외
          return {
            templateFieldId: templateField.id,
            fieldValue: Array.isArray(fieldValue) ? JSON.stringify(fieldValue) : String(fieldValue)
          }
        })
        .filter(Boolean) as DocumentFieldValueRequest[]

      const approvalStageRequests: ApprovalStageRequest[] = state.approvalStages.map((stage, index) => ({
        stageOrder: index + 1,
        stageName: stage.name,
        approvalTargets: stage.approvers.map(approver => ({
          targetType: TargetType.USER,
          userId: approver.id,
          isReference: false
        }))
      }))

      const referenceTargetRequests: ApprovalTargetRequest[] = state.references.map(reference => ({
        targetType: TargetType.USER,
        userId: reference.id,
        isReference: true
      }))

      const attachmentIds = state.attachments.map(attachment => attachment.id || '')

      if (state.currentDraftId) {
        // 기존 DRAFT 수정
        const updateRequest: UpdateDocumentRequest = {
          content: formTemplate.useBody ? state.content : undefined,
          fieldValues,
          approvalStages: approvalStageRequests,
          referenceTargets: referenceTargetRequests,
          attachments: attachmentIds.length > 0 ? attachmentIds : undefined,
        }

        await updateDocument.mutateAsync({ id: state.currentDraftId, request: updateRequest })
      } else {
        // 새 DRAFT 생성
        const createRequest: CreateDocumentRequest = {
          templateId: formTemplate.id,
          content: formTemplate.useBody ? state.content : undefined,
          fieldValues,
          approvalStages: approvalStageRequests,
          referenceTargets: referenceTargetRequests,
          attachments: attachmentIds.length > 0 ? attachmentIds : undefined,
          submitImmediately: false
        }

        const result = await createDocument.mutateAsync(createRequest)
        dispatch({ type: 'SET_CURRENT_DRAFT_ID', payload: result.id })
        dispatch({ type: 'SET_IS_DRAFT', payload: true })
      }
    } catch (error) {
      console.error("문서 임시저장 중 오류:", error)
      const errorMessage = error instanceof Error ? error.message : "문서 임시저장 중 오류가 발생했습니다."
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
    } finally {
      dispatch({ type: 'SET_IS_SUBMITTING', payload: false })
    }
  }, [formTemplate, state.formFieldValues, state.approvalStages, state.references, state.attachments, state.currentDraftId, state.content, updateDocument, createDocument])

  // 문서 삭제
  const handleDelete = useCallback(async () => {
    if (!state.currentDraftId) return

    dispatch({ type: 'SET_IS_DELETING', payload: true })
    dispatch({ type: 'SET_ERROR', payload: null })
    
    try {
      await deleteDocument.mutateAsync(state.currentDraftId)
      return true // 성공 시 true 반환
    } catch (error) {
      console.error("문서 삭제 중 오류:", error)
      const errorMessage = error instanceof Error ? error.message : "문서 삭제 중 오류가 발생했습니다."
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
      return false
    } finally {
      dispatch({ type: 'SET_IS_DELETING', payload: false })
      dispatch({ type: 'SET_SHOW_DELETE_CONFIRM', payload: false })
    }
  }, [state.currentDraftId, deleteDocument])

  // 제출 처리
  const handleSubmit = useCallback(async () => {
    if (!formTemplate) {
      dispatch({ type: 'SET_ERROR', payload: "템플릿 정보를 불러오는 중입니다. 잠시만 기다려주세요." })
      return
    }

    // 유효성 검증
    if (formTemplate.useBody && !state.content.trim()) {
      alert("내용을 입력해주세요.")
      return
    }

    if (state.approvalStages.some(stage => stage.approvers.length === 0)) {
      alert("모든 승인 단계에 승인자를 지정해주세요.")
      return
    }

    if (formTemplate.fields) {
      const missingFields = formTemplate.fields
        .filter(field => field.required)
        .filter(field => !state.formFieldValues[field.name] ||
          (Array.isArray(state.formFieldValues[field.name]) && state.formFieldValues[field.name].length === 0)
        )

      if (missingFields.length > 0) {
        alert(`다음 필수 필드를 입력해주세요: ${missingFields.map(f => f.name).join(', ')}`)
        return
      }
    }

    if (formTemplate.useAttachment === AttachmentUsageType.REQUIRED && state.attachments.length === 0) {
      alert("첨부파일을 업로드해주세요.")
      return
    }

    dispatch({ type: 'SET_IS_SUBMITTING', payload: true })
    dispatch({ type: 'SET_ERROR', payload: null })
    
    try {
      if (state.currentDraftId) {
        // DRAFT 문서 제출
        await submitDocument.mutateAsync(state.currentDraftId)
        return true
      } else {
        // 새 문서 생성 후 바로 제출
        const fieldValues: DocumentFieldValueRequest[] = Object.entries(state.formFieldValues)
          .map(([fieldName, fieldValue]) => {
            const templateField = formTemplate.fields?.find(f => f.name === fieldName)
            if (!templateField?.id) return null // templateFieldId가 없으면 제외
            return {
              templateFieldId: templateField.id,
              fieldValue: Array.isArray(fieldValue) ? JSON.stringify(fieldValue) : String(fieldValue)
            }
          })
          .filter(Boolean) as DocumentFieldValueRequest[]

        const approvalStageRequests: ApprovalStageRequest[] = state.approvalStages.map((stage, index) => ({
          stageOrder: index + 1,
          stageName: stage.name,
          approvalTargets: stage.approvers.map(approver => ({
            targetType: TargetType.USER,
            userId: approver.id,
            isReference: false
          }))
        }))

        const referenceTargetRequests: ApprovalTargetRequest[] = state.references.map(reference => ({
          targetType: TargetType.USER,
          userId: reference.id,
          isReference: true
        }))

        const attachmentIds = state.attachments.map(attachment => attachment.id || '')

        const createDocumentRequest: CreateDocumentRequest = {
          templateId: formTemplate.id,
          content: formTemplate.useBody ? state.content : undefined,
          fieldValues,
          approvalStages: approvalStageRequests,
          referenceTargets: referenceTargetRequests,
          attachments: attachmentIds.length > 0 ? attachmentIds : undefined,
          submitImmediately: true
        }

        await createDocument.mutateAsync(createDocumentRequest)
        return true
      }
    } catch (error) {
      console.error("문서 제출 중 오류:", error)
      const errorMessage = error instanceof Error ? error.message : "문서 제출 중 오류가 발생했습니다."
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
      return false
    } finally {
      dispatch({ type: 'SET_IS_SUBMITTING', payload: false })
    }
  }, [formTemplate, state.content, state.approvalStages, state.formFieldValues, state.attachments, state.currentDraftId, submitDocument, createDocument])

  const setters = useMemo(() => ({
    setContent: (content: string) => dispatch({ type: 'SET_CONTENT', payload: content }),
    setAttachments: (attachments: Attachment[]) => dispatch({ type: 'SET_ATTACHMENTS', payload: attachments }),
    setApprovalStages: (stages: LocalApprovalStage[]) => dispatch({ type: 'SET_APPROVAL_STAGES', payload: stages }),
    setReferences: (references: LocalReference[]) => dispatch({ type: 'SET_REFERENCES', payload: references }),
    setFormFieldValues: (values: Record<string, any> | ((prev: Record<string, any>) => Record<string, any>)) => {
      if (typeof values === 'function') {
        dispatch({ type: 'SET_FORM_FIELD_VALUES', payload: values(state.formFieldValues) })
      } else {
        dispatch({ type: 'SET_FORM_FIELD_VALUES', payload: values })
      }
    },
    setShowDeleteConfirm: (show: boolean) => dispatch({ type: 'SET_SHOW_DELETE_CONFIRM', payload: show })
  }), [state.formFieldValues])

  return {
    // 상태
    ...state,
    
    // 액션
    ...setters,
    
    // 핸들러
    handleSaveDraft,
    handleDelete,
    handleSubmit,

    // 훅들의 로딩 상태
    isCreating: createDocument.isPending,
    isUpdating: updateDocument.isPending,
    isSubmittingDocument: submitDocument.isPending,
    isDeletingDocument: deleteDocument.isPending,
    isDraftLoading: draftLoading
  }
}