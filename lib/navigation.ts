// 네비게이션 관련 타입과 상수

// 메뉴 아이템 타입
export interface MenuItem {
  icon: string
  label: string
  active: boolean
  href?: string
}

// 기본 메뉴 아이템들
export const defaultMenuItems: MenuItem[] = [
  { icon: "Home", label: "대시보드", active: true, href: "/" },
  { icon: "Users", label: "구성원", active: false, href: "/members" },
  { icon: "Briefcase", label: "근무", active: false, href: "/schedule" },
  { icon: "Calendar", label: "휴가", active: false, href: "/vacation" },
  { icon: "Megaphone", label: "공지", active: false, href: "/announcements" },
  { icon: "ClipboardList", label: "결재", active: false, href: "/approvals" },
  { icon: "FileText", label: "문서", active: false, href: "/documents" },
  { icon: "Settings", label: "설정", active: false, href: "/settings" },
]

// 라우트 상수
export const ROUTES = {
  DASHBOARD: "/",
  MEMBERS: "/members",
  SCHEDULE: "/schedule",
  SCHEDULE_ME: "/schedule/me",
  SCHEDULE_COWORKER: "/schedule/coworker",
  VACATION: "/vacation",
  ANNOUNCEMENTS: "/announcements",
  APPROVALS: "/approvals",
  DOCUMENTS: "/documents",
  SETTINGS: "/settings",
} as const

// 메뉴 아이템별 권한 (필요시 확장)
export const MENU_PERMISSIONS = {
  DASHBOARD: ["all"],
  MEMBERS: ["admin", "hr"],
  SCHEDULE: ["all"],
  VACATION: ["all"],
  ANNOUNCEMENTS: ["admin", "hr"],
  APPROVALS: ["admin", "manager"],
  DOCUMENTS: ["all"],
  SETTINGS: ["admin"],
} as const 