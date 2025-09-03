import { apiClient } from '../common/api-client'
import { ApiResult } from '../common/types'
import {
  AnnouncementSummaryDto,
  AnnouncementResponseDto,
  AnnouncementCreateRequestDto,
  AnnouncementUpdateRequestDto,
  CommentResponseDto,
  CommentCreateDto,
  NotificationResponseDto,
  NotificationQueryParams,
  UserNotificationQueryParams
} from './types'

// 공지사항 API
export const announcementApi = {
  // 공지사항 목록 조회
  getAllAnnouncements: async (): Promise<AnnouncementSummaryDto[]> => {
    const response = await apiClient.get<AnnouncementSummaryDto[]>('/api/announcements')
    return response.data
  },

  // 공지사항 상세 조회
  getAnnouncement: async (id: number): Promise<ApiResult<AnnouncementResponseDto>> => {
    const response = await apiClient.get<ApiResult<AnnouncementResponseDto>>(`/api/announcements/${id}`)
    return response.data
  },

  // 공지사항 생성 (ADMIN 권한 필요)
  createAnnouncement: async (data: AnnouncementCreateRequestDto): Promise<ApiResult<AnnouncementResponseDto>> => {
    const response = await apiClient.post<ApiResult<AnnouncementResponseDto>>('/api/announcements', data)
    return response.data
  },

  // 공지사항 수정 (ADMIN 권한 필요)
  updateAnnouncement: async (id: number, data: AnnouncementUpdateRequestDto): Promise<ApiResult<AnnouncementResponseDto>> => {
    const response = await apiClient.patch<ApiResult<AnnouncementResponseDto>>(`/api/announcements/${id}`, data)
    return response.data
  },

  // 공지사항 삭제 (ADMIN 권한 필요)
  deleteAnnouncement: async (id: number): Promise<ApiResult<void>> => {
    const response = await apiClient.delete<ApiResult<void>>(`/api/announcements/${id}`)
    return response.data
  }
}

// 댓글 API
export const commentApi = {
  // 공지사항별 댓글 목록 조회
  getCommentsByAnnouncementId: async (announcementId: number): Promise<CommentResponseDto[]> => {
    const response = await apiClient.get<CommentResponseDto[]>(`/api/announcements/${announcementId}/comments`)
    return response.data
  },

  // 댓글 생성
  createComment: async (announcementId: number, data: CommentCreateDto): Promise<CommentResponseDto> => {
    const response = await apiClient.post<CommentResponseDto>(`/api/announcements/${announcementId}/comments`, data)
    return response.data
  },

  // 댓글 삭제
  deleteComment: async (commentId: number): Promise<void> => {
    await apiClient.delete(`/api/comments/${commentId}`)
  }
}

// 알림 API
export const notificationApi = {
  // 내 알림 목록 조회
  getMyNotifications: async (params?: NotificationQueryParams): Promise<ApiResult<NotificationResponseDto[]>> => {
    const response = await apiClient.get<ApiResult<NotificationResponseDto[]>>('/api/notifications', { params })
    return response.data
  },

  // 읽지 않은 알림 존재 확인
  hasUnreadNotifications: async (): Promise<ApiResult<boolean>> => {
    const response = await apiClient.get<ApiResult<boolean>>('/api/notifications/unread')
    return response.data
  },

  // 알림 읽음 처리
  markAsRead: async (id: number): Promise<ApiResult<boolean>> => {
    const response = await apiClient.patch<ApiResult<boolean>>(`/api/notifications/${id}/read`)
    return response.data
  },

  // 특정 사용자 알림 목록 조회 (ADMIN 권한 필요)
  getUserNotifications: async (params: UserNotificationQueryParams): Promise<ApiResult<NotificationResponseDto[]>> => {
    const { userId, ...queryParams } = params
    const response = await apiClient.get<ApiResult<NotificationResponseDto[]>>(
      `/api/notifications/admin/users/${userId}`,
      { params: queryParams }
    )
    return response.data
  },

  // 특정 사용자 읽지 않은 알림 존재 확인 (ADMIN 권한 필요)
  hasUserUnreadNotifications: async (userId: number): Promise<ApiResult<boolean>> => {
    const response = await apiClient.get<ApiResult<boolean>>(`/api/notifications/admin/users/${userId}/unread`)
    return response.data
  }
}

// 통합 Communication API 객체
export const communicationApi = {
  announcements: announcementApi,
  comments: commentApi,
  notifications: notificationApi
}