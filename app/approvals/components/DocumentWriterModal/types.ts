import { 
  TemplateResponse, 
  TemplateSummaryResponse,
  AttachmentInfoResponse
} from "@/lib/services/approval/types"
import { UserResponseDto } from "@/lib/services/user/types"
import { Attachment } from "@/components/ui/attachments-manager"

// 로컬 타입 정의 (API 타입과 UI 적응을 위한 헬퍼 타입들)
export interface LocalApprovalStage {
  id: string
  name: string
  approvers: UserResponseDto[]
}

export interface LocalReference {
  id: number
  name: string
  avatar?: string
  position: string
}

// DocumentWriterModal Props
export interface DocumentWriterModalProps {
  isOpen: boolean
  onClose: () => void
  onBack: () => void
  templateId: number | null
  templateSummary?: TemplateSummaryResponse | null
  draftDocumentId?: number
}

// 컴포넌트별 Props 정의
export interface CollapsibleSectionProps {
  title: string | React.ReactNode
  children: React.ReactNode
  defaultOpen?: boolean
}

export interface ApprovalStagesManagerProps {
  stages: LocalApprovalStage[]
  onStagesChange: (stages: LocalApprovalStage[]) => void
  availableUsers: UserResponseDto[]
}

export interface ReferencesManagerProps {
  references: LocalReference[]
  onReferencesChange: (references: LocalReference[]) => void
  availableUsers: UserResponseDto[]
}

export interface ReferenceFilesManagerProps {
  referenceFiles: AttachmentInfoResponse[]
}

export interface FormFieldRendererProps {
  field: any // TemplateFieldResponse 타입
  value: any
  onChange: (value: any) => void
}

// Layout Props
export interface DocumentWriterLayoutProps {
  templateSummary: TemplateSummaryResponse | null
  formTemplate: TemplateResponse | null
  templateLoading: boolean
  content: string
  setContent: (content: string) => void
  attachments: Attachment[]
  setAttachments: (attachments: Attachment[]) => void
  approvalStages: LocalApprovalStage[]
  setApprovalStages: (stages: LocalApprovalStage[]) => void
  references: LocalReference[]
  setReferences: (references: LocalReference[]) => void
  formFieldValues: Record<string, any>
  setFormFieldValues: (values: Record<string, any> | ((prev: Record<string, any>) => Record<string, any>)) => void
  availableUsers: UserResponseDto[]
  usersLoading: boolean
  isSubmitting: boolean
  currentDraftId: number | null
  error: string | null
  onSaveDraft: () => void
  onSubmit: () => void
  onDelete: () => void
  isDeleting: boolean
  setShowDeleteConfirm: (show: boolean) => void
}

// 상태 관리를 위한 타입
export interface DocumentWriterState {
  content: string
  attachments: Attachment[]
  approvalStages: LocalApprovalStage[]
  references: LocalReference[]
  formFieldValues: Record<string, any>
  isSubmitting: boolean
  availableUsers: UserResponseDto[]
  usersLoading: boolean
  error: string | null
  currentDraftId: number | null
  isDraft: boolean
  isDeleting: boolean
  showDeleteConfirm: boolean
}

export type DocumentWriterAction = 
  | { type: 'SET_CONTENT'; payload: string }
  | { type: 'SET_ATTACHMENTS'; payload: Attachment[] }
  | { type: 'SET_APPROVAL_STAGES'; payload: LocalApprovalStage[] }
  | { type: 'SET_REFERENCES'; payload: LocalReference[] }
  | { type: 'SET_FORM_FIELD_VALUES'; payload: Record<string, any> }
  | { type: 'SET_IS_SUBMITTING'; payload: boolean }
  | { type: 'SET_AVAILABLE_USERS'; payload: UserResponseDto[] }
  | { type: 'SET_USERS_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CURRENT_DRAFT_ID'; payload: number | null }
  | { type: 'SET_IS_DRAFT'; payload: boolean }
  | { type: 'SET_IS_DELETING'; payload: boolean }
  | { type: 'SET_SHOW_DELETE_CONFIRM'; payload: boolean }
  | { type: 'RESET_STATE' }
  | { type: 'INITIALIZE_FROM_TEMPLATE'; payload: { template: TemplateResponse, draftDocumentId?: number } }