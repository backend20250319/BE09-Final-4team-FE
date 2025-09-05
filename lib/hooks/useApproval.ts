import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { approvalApi } from '@/lib/services/approval/api'
import { 
  GetDocumentsParams, 
  DocumentSummaryResponse,
  CreateDocumentRequest,
  UpdateDocumentRequest,
  ApprovalActionRequest,
  CreateCommentRequest
} from '@/lib/services/approval/types'
import { toast } from 'sonner'

// 문서 목록 조회
export const useDocuments = (params: GetDocumentsParams) => {
  return useQuery({
    queryKey: ['documents', params],
    queryFn: () => approvalApi.document.getDocuments(params),
    staleTime: 1000 * 60 * 2, // 2분
  })
}

// 문서 상세 조회
export const useDocument = (id: number | null) => {
  return useQuery({
    queryKey: ['document', id],
    queryFn: () => id ? approvalApi.document.getDocumentById(id) : Promise.reject('No ID'),
    enabled: !!id,
  })
}

// 문서 생성
export const useCreateDocument = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (request: CreateDocumentRequest) => 
      approvalApi.document.createDocument(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      toast.success('문서가 성공적으로 생성되었습니다.')
    },
    onError: () => {
      toast.error('문서 생성에 실패했습니다.')
    },
  })
}

// 문서 수정
export const useUpdateDocument = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: UpdateDocumentRequest }) =>
      approvalApi.document.updateDocument(id, request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['document', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      toast.success('문서가 성공적으로 수정되었습니다.')
    },
    onError: () => {
      toast.error('문서 수정에 실패했습니다.')
    },
  })
}

// 문서 제출
export const useSubmitDocument = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: number) => approvalApi.document.submitDocument(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['document', id] })
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      toast.success('문서가 성공적으로 제출되었습니다.')
    },
    onError: () => {
      toast.error('문서 제출에 실패했습니다.')
    },
  })
}

// 문서 승인
export const useApproveDocument = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, request }: { id: number; request?: ApprovalActionRequest }) =>
      approvalApi.document.approveDocument(id, request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['document', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      toast.success('문서가 승인되었습니다.')
    },
    onError: () => {
      toast.error('문서 승인에 실패했습니다.')
    },
  })
}

// 문서 반려
export const useRejectDocument = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, request }: { id: number; request?: ApprovalActionRequest }) =>
      approvalApi.document.rejectDocument(id, request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['document', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      toast.success('문서가 반려되었습니다.')
    },
    onError: () => {
      toast.error('문서 반려에 실패했습니다.')
    },
  })
}

// 댓글 생성
export const useCreateComment = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ documentId, request }: { documentId: number; request: CreateCommentRequest }) =>
      approvalApi.comment.createComment(documentId, request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['document', variables.documentId] })
      toast.success('댓글이 작성되었습니다.')
    },
    onError: () => {
      toast.error('댓글 작성에 실패했습니다.')
    },
  })
}

// 템플릿 목록 조회
export const useTemplates = (categoryId?: number) => {
  return useQuery({
    queryKey: ['templates', categoryId],
    queryFn: () => approvalApi.template.getTemplates({ categoryId }),
  })
}

// 카테고리별 템플릿 조회
export const useTemplatesByCategory = () => {
  return useQuery({
    queryKey: ['templates-by-category'],
    queryFn: () => approvalApi.template.getTemplatesByCategory(),
  })
}

// 카테고리 목록 조회
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => approvalApi.category.getCategories(),
  })
}