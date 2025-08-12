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

// 참고 파일 타입 정의
export interface ReferenceFile {
  name: string
  url: string
  description?: string
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
  defaultContent: string // 기본 콘텐츠 추가
  referenceFiles?: ReferenceFile[] // 참고 파일 (optional)
  attachments: 'disabled' | 'optional' | 'required' // 첨부파일 설정
  content: 'disabled' | 'enabled' // 내용 작성란 사용 여부
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
    defaultContent: "출장 일정:\n- 이동 경로: \n- 숙박 장소: \n- 주요 일정: \n\n출장 성과 목표:\n- ",
    referenceFiles: [
      { 
        name: "출장 신청 가이드", 
        url: "/files/business-trip-guide.pdf",
        description: "출장 신청 시 필요한 절차와 주의사항"
      }
    ],
    attachments: "required",
    content: "enabled"
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
    ],
    defaultContent: "지출 내역:\n- 일시: \n- 장소: \n- 세부 내역: \n\n영수증 첨부: ",
    attachments: "required",
    content: "enabled"
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
    ],
    defaultContent: "채용 배경:\n- \n- \n\n주요 업무:\n- \n- \n- \n\n채용 일정:\n- 공고 게시: \n- 서류 심사: \n- 면접 일정: ",
    referenceFiles: [
      { 
        name: "채용 규정", 
        url: "/files/recruitment-policy.pdf",
        description: "회사 채용 절차 및 규정 안내"
      },
      { 
        name: "직무 기술서 양식", 
        url: "/files/job-description-template.docx",
        description: "직무 기술서 작성 양식"
      }
    ],
    attachments: "optional",
    content: "enabled"
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
      { name: "참석자", type: "number", required: false, placeholder: "예상 참석자 수" },
    ],
    defaultContent: "사용 세부 사항:\n- 사용 시간: \n- 준비 사항: \n- 필요 장비: \n\n참고 사항:\n- ",
    attachments: "disabled",
    content: "disabled"
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
    ],
    defaultContent: "계약 개요:\n- 계약 필요성: \n- 예상 효과: \n- 리스크 분석: \n\n계약 조건:\n- 지불 조건: \n- 납기: \n- 품질 보증: \n\n첨부 서류:\n- \n- \n- ",
    referenceFiles: [
      { 
        name: "계약서 샘플", 
        url: "/files/contract-template.pdf",
        description: "기본 계약서 서식 및 양식"
      }
    ],
    attachments: "required",
    content: "enabled"
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
    ],
    defaultContent: "주요 성과:\n- \n- \n- \n\n자기계발 노력:\n- \n- \n- \n\n향후 계획:\n- \n- ",
    attachments: "optional",
    content: "enabled"
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
    ],
    defaultContent: "요청 배경:\n- \n- \n- \n\n세부 예산 계획:\n1. \n2. \n3. \n\n투자 대비 효과:\n- \n- \n\nROI 분석:\n- \n- ",
    referenceFiles: [
      { 
        name: "예산 기획서 예시", 
        url: "/files/budget-plan-sample.xlsx",
        description: "예산 요청서 작성 예시 및 템플릿"
      }
    ],
    attachments: "optional",
    content: "enabled"
  },
]
