'use client'

import { useState } from 'react'
import { Bell } from 'lucide-react'
import { Button } from './button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from './dropdown-menu'

interface Notification {
  id: string
  title: string
  content: string
  createdAt: string // ISO 8601 문자열
  type: string
  isRead: boolean
}

interface NotificationsDropdownProps {
  hasNewNotifications?: boolean
  notifications?: Notification[]
  onNotificationClick?: (notification: Notification) => void
}

// 상대 시간 계산 함수
function timeAgo(dateString: string): string {
  const now = new Date()
  const past = new Date(dateString)
  const diffMs = now.getTime() - past.getTime()

  const seconds = Math.floor(diffMs / 1000)
  if (seconds < 60) return '방금 전'

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}분 전`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}시간 전`

  const days = Math.floor(hours / 24)
  return `${days}일 전`
}

export function NotificationsDropdown({
  hasNewNotifications = true,
  notifications = [],
  onNotificationClick,
}: NotificationsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(5)
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(hasNewNotifications)
  const [notificationsList, setNotificationsList] = useState<Notification[]>([
    {
      id: '1',
      title: '새로운 공지사항이 등록되었습니다',
      content: '2025년 하반기 인사발령에 대한 공지사항이 등록되었습니다.',
      createdAt: '2025-08-11T14:35:00Z', // 오늘 오후 2시 35분
      type: 'NOTICE',
      isRead: false,
    },
    {
      id: '2',
      title: '휴가 신청이 승인되었습니다',
      content: '8월 15일 휴가 신청이 승인되었습니다.',
      createdAt: '2025-08-11T13:10:00Z', // 오늘 오후 1시 10분
      type: 'APPROVAL_APPROVED',
      isRead: false,
    },
    {
      id: '3',
      title: '결재 대기 문서가 있습니다',
      content: '인사규정 변경안에 대한 결재가 대기 중입니다.',
      createdAt: '2025-08-11T09:50:00Z', // 오늘 오전 9시 50분
      type: 'APPROVAL_REQUESTED',
      isRead: true,
    },
    {
      id: '4',
      title: '보안 점검 안내',
      content: '내일 오전 9시 서버 점검이 예정되어 있습니다.',
      createdAt: '2025-08-11T06:25:00Z', // 오늘 오전 6시 25분
      type: 'NOTICE',
      isRead: true,
    },
    {
      id: '5',
      title: '회의 일정 변경',
      content: '주간 회의 시간이 오후 3시로 변경되었습니다.',
      createdAt: '2025-08-10T22:40:00Z', // 어제 오후 10시 40분
      type: 'APPROVAL_REQUESTED',
      isRead: false,
    },
    {
      id: '6',
      title: '회의 일정 변경',
      content: '주간 회의 시간이 오후 2시로 변경되었습니다.',
      createdAt: '2025-08-10T08:15:00Z', // 어제 오전 8시 15분
      type: 'APPROVAL_REQUESTED',
      isRead: false,
    },
  ])

  const displayNotifications = notifications.length > 0 ? notifications : notificationsList

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'NOTICE':
        return 'bg-blue-500'
      case 'APPROVAL_REQUESTED':
        return 'bg-yellow-400'
      case 'APPROVAL_REJECTED':
        return 'bg-red-600'
      case 'APPROVAL_APPROVED':
        return 'bg-green-500'
      case 'NEW_COMMENT':
        return 'bg-purple-500'
      case 'INFO_UPDATED':
        return 'bg-gray-500'
      default:
        return 'bg-gray-400'
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    alert(`"${notification.title}" 알림으로 이동합니다.`)

    // 알림 클릭 시 isRead를 true로 변경
    setNotificationsList(prev =>
      prev.map(n =>
        n.id === notification.id ? { ...n, isRead: true } : n
      )
    )

    onNotificationClick?.(notification)
  }

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 5)
  }

  const handleDropdownOpen = (open: boolean) => {
    setIsOpen(open)
    // 알림창을 열면 읽지 않은 알림 표시를 false로 변경
    if (open && hasUnreadNotifications) {
      setHasUnreadNotifications(false)
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative hover:bg-gray-100/80 transition-colors cursor-pointer">
          <Bell className="w-5 h-5 text-gray-500" />
          {hasUnreadNotifications && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-3 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">알림</h3>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {displayNotifications.slice(0, visibleCount).map((notification) => (
            <div
              key={notification.id}
              className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${getTypeColor(notification.type)}`}></div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${notification.isRead ? 'text-gray-600' : 'text-gray-900'}`}>
                    {notification.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{notification.content}</p>
                  <p className="text-xs text-gray-400 mt-1">{timeAgo(notification.createdAt)}</p>
                </div>
                {!notification.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>}
              </div>
            </div>
          ))}
        </div>
        {visibleCount < displayNotifications.length && (
          <div className="p-3 border-t border-gray-200">
            <button
              onClick={handleLoadMore}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium w-full text-center cursor-pointer"
            >
              알림 더보기
            </button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
