import {
  Calendar,
  User,
  CreditCard,
  Car,
  Home,
  Briefcase,
} from "lucide-react"

// 문서 양식 타입 정의
export interface FormTemplate {
  id: string
  title: string
  description: string
  category: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  fields: string[]
  estimatedTime: string
}

// 문서 양식 데이터
export const formTemplates: FormTemplate[] = [
  {
    id: "business-trip",
    title: "출장 신청서",
    description: "업무 출장 신청을 위한 양식입니다.",
    category: "travel",
    icon: Car,
    color: "from-green-500 to-green-600",
    fields: ["출장지", "출장일", "목적", "예상 비용"],
    estimatedTime: "10분",
  },
  {
    id: "expense-report",
    title: "지출 결의서",
    description: "업무 관련 지출 비용 정산을 위한 양식입니다.",
    category: "finance",
    icon: CreditCard,
    color: "from-purple-500 to-purple-600",
    fields: ["지출 항목", "금액", "사유", "증빙서류"],
    estimatedTime: "15분",
  },
  {
    id: "recruitment",
    title: "채용 신청서",
    description: "신규 인력 채용을 위한 양식입니다.",
    category: "hr",
    icon: User,
    color: "from-orange-500 to-orange-600",
    fields: ["직무", "인원", "자격요건", "급여 범위"],
    estimatedTime: "20분",
  },
  {
    id: "facility-request",
    title: "시설 사용 신청서",
    description: "회의실, 장비 등 시설 사용 신청을 위한 양식입니다.",
    category: "facility",
    icon: Home,
    color: "from-teal-500 to-teal-600",
    fields: ["시설명", "사용일시", "목적", "참석자"],
    estimatedTime: "8분",
  },
  {
    id: "contract-approval",
    title: "계약 승인 요청서",
    description: "외부 업체와의 계약 승인을 위한 양식입니다.",
    category: "business",
    icon: Briefcase,
    color: "from-indigo-500 to-indigo-600",
    fields: ["계약 상대방", "계약 금액", "계약 기간", "계약 내용"],
    estimatedTime: "25분",
  },
  {
    id: "salary-adjustment",
    title: "급여 조정 신청서",
    description: "급여 인상 또는 조정을 위한 양식입니다.",
    category: "hr",
    icon: User,
    color: "from-pink-500 to-pink-600",
    fields: ["현재 급여", "희망 급여", "조정 사유", "근무 실적"],
    estimatedTime: "30분",
  },
  {
    id: "budget-request",
    title: "예산 요청서",
    description: "부서별 예산 요청을 위한 양식입니다.",
    category: "finance",
    icon: CreditCard,
    color: "from-red-500 to-red-600",
    fields: ["예산 항목", "요청 금액", "사용 계획", "기대 효과"],
    estimatedTime: "35분",
  },
]
