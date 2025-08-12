import {
  Calendar,
  User,
  CreditCard,
  Car,
  Home,
  Briefcase,
} from "lucide-react"

// 필드 타입 정의
export type FieldType = 'text' | 'number' | 'money' | 'date' | 'select' | 'multiselect'

export interface FormField {
  name: string
  type: FieldType
  required?: boolean
  placeholder?: string
  options?: string[] // select, multiselect용
}

// 문서 양식 타입 정의
export interface FormTemplate {
  id: string
  title: string
  description: string
  category: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  fields: FormField[]
}

// 문서 양식 데이터
export const formTemplates: FormTemplate[] = [
  {
    id: "business-trip",
    title: "출장 신청서",
    description: "업무 출장 신청을 위한 양식입니다.",
    category: "travel",
    icon: Car,
    color: "#86efac",
    fields: [
      { name: "출장지", type: "text", required: true, placeholder: "출장지를 입력하세요" },
      { name: "출장일", type: "date", required: true },
      { name: "목적", type: "select", required: true, options: ["회의", "교육", "업무협의", "기타"] },
      { name: "예상 비용", type: "money", required: true, placeholder: "예상 금액을 입력하세요" },
    ],
  },
  {
    id: "expense-report",
    title: "지출 결의서",
    description: "업무 관련 지출 비용 정산을 위한 양식입니다.",
    category: "finance",
    icon: CreditCard,
    color: "#d8b4fe",
    fields: [
      { name: "지출 항목", type: "select", required: true, options: ["교통비", "숙박비", "식비", "회의비", "기타"] },
      { name: "금액", type: "money", required: true, placeholder: "지출 금액을 입력하세요" },
      { name: "사유", type: "text", required: true, placeholder: "지출 사유를 상세히 입력하세요" },
    ],
  },
  {
    id: "recruitment",
    title: "채용 신청서",
    description: "신규 인력 채용을 위한 양식입니다.",
    category: "hr",
    icon: User,
    color: "#fdba74",
    fields: [
      { name: "직무", type: "select", required: true, options: ["개발자", "디자이너", "마케터", "기획자", "기타"] },
      { name: "인원", type: "number", required: true, placeholder: "채용 인원 수를 입력하세요" },
      { name: "자격요건", type: "multiselect", required: true, options: ["대학 졸업", "관련 경력", "자격증", "외국어 능력"] },
      { name: "급여 범위", type: "text", required: true, placeholder: "예: 연봉 4000-5000만원" },
    ],
  },
  {
    id: "facility-request",
    title: "시설 사용 신청서",
    description: "회의실, 장비 등 시설 사용 신청을 위한 양식입니다.",
    category: "facility",
    icon: Home,
    color: "#5eead4",
    fields: [
      { name: "시설명", type: "select", required: true, options: ["대회의실", "소회의실", "교육실", "프로젝터", "차량"] },
      { name: "사용일시", type: "date", required: true },
      { name: "목적", type: "text", required: true, placeholder: "사용 목적을 입력하세요" },
      { name: "참석자", type: "number", required: false, placeholder: "예상 참석자 수" },
    ],
  },
  {
    id: "contract-approval",
    title: "계약 승인 요청서",
    description: "외부 업체와의 계약 승인을 위한 양식입니다.",
    category: "business",
    icon: Briefcase,
    color: "#a5b4fc",
    fields: [
      { name: "계약 상대방", type: "text", required: true, placeholder: "업체명을 입력하세요" },
      { name: "계약 금액", type: "money", required: true, placeholder: "계약 금액을 입력하세요" },
      { name: "계약 기간", type: "text", required: true, placeholder: "예: 2024년 1월 ~ 12월" },
      { name: "계약 내용", type: "text", required: true, placeholder: "계약 내용을 상세히 기술하세요" },
    ],
  },
  {
    id: "salary-adjustment",
    title: "급여 조정 신청서",
    description: "급여 인상 또는 조정을 위한 양식입니다.",
    category: "hr",
    icon: User,
    color: "#f9a8d4",
    fields: [
      { name: "현재 급여", type: "money", required: true, placeholder: "현재 연봉을 입력하세요" },
      { name: "희망 급여", type: "money", required: true, placeholder: "희망 연봉을 입력하세요" },
      { name: "조정 사유", type: "multiselect", required: true, options: ["성과 우수", "승진", "업무량 증가", "자격증 취득", "기타"] },
      { name: "근무 실적", type: "text", required: true, placeholder: "주요 성과와 실적을 기술하세요" },
    ],
  },
  {
    id: "budget-request",
    title: "예산 요청서",
    description: "부서별 예산 요청을 위한 양식입니다.",
    category: "finance",
    icon: CreditCard,
    color: "#fca5a5",
    fields: [
      { name: "예산 항목", type: "select", required: true, options: ["인건비", "운영비", "장비비", "마케팅비", "기타"] },
      { name: "요청 금액", type: "money", required: true, placeholder: "요청 예산 금액을 입력하세요" },
      { name: "사용 계획", type: "text", required: true, placeholder: "예산 사용 계획을 상세히 기술하세요" },
      { name: "기대 효과", type: "text", required: true, placeholder: "기대하는 효과를 구체적으로 작성하세요" },
    ],
  },
]
