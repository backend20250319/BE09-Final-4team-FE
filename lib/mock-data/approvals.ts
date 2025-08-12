import { colors } from "@/lib/design-tokens"

const approvals = [
    {
      id: 2,
      formTemplateId: "expense-report",
      requester: "이영희",
      department: "디자인팀",
      date: "2025.07.24",
      status: "approved",
      priority: "high",
      content: "지출 내역:\n- 일시: 2025년 7월 24일\n- 장소: 온라인 쇼핑몰\n- 세부 내역: 디자인 작업용 고성능 태블릿 및 스타일러스 펜\n\n영수증 첨부: 견적서_태블릿.pdf 첨부 완료\n\n구매 사유:\n디자인 팀의 작업 효율성 향상을 위해 고성능 태블릿이 필요합니다. 기존 장비로는 복잡한 디자인 작업에 한계가 있어 업무 생산성이 저하되고 있습니다.",
      isMyApproval: false,
      formFields: {
        "지출 항목": "장비비",
        "금액": "2,500,000",
        "사유": "디자인 작업 효율성 향상을 위한 태블릿 구매",
        "증빙서류": "견적서_태블릿.pdf"
      },
      approvalStages: [
        {
          id: 1,
          status: "completed",
          approvers: [
            {
              userId: "design-leader-1",
              name: "최디자인",
              position: "디자인팀장",
              status: "completed",
              date: "2025.07.25"
            }
          ]
        },
        {
          id: 2,
          status: "completed",
          approvers: [
            {
              userId: "current-user-id",
              name: "김철수",
              position: "개발팀장",
              status: "completed",
              date: "2025.07.25"
            }
          ]
        },
        {
          id: 3,
          status: "completed",
          approvers: [
            {
              userId: "support-manager-1",
              name: "정수민",
              position: "경영지원팀장",
              status: "completed",
              date: "2025.07.26"
            }
          ]
        }
      ],
      references: [
        {
          userId: "ref-3",
          name: "박민수",
          position: "마케팅팀장"
        }
      ],
      history: [
        {
          id: 1,
          action: "created",
          user: { name: "이영희", avatar: "/placeholder-user.jpg" },
          date: "2025.07.24 13:20"
        },
        {
          id: 2,
          action: "file_attached",
          user: { name: "이영희", avatar: "/placeholder-user.jpg" },
          date: "2025.07.24 13:25"
        },
        {
          id: 3,
          action: "approved",
          user: { name: "최디자인", avatar: "/placeholder-user.jpg" },
          date: "2025.07.25 10:30"
        },
        {
          id: 4,
          action: "approved",
          user: { name: "김철수", avatar: "/placeholder-user.jpg" },
          date: "2025.07.25 14:15"
        },
        {
          id: 5,
          action: "approved",
          user: { name: "정수민", avatar: "/placeholder-user.jpg" },
          date: "2025.07.26 09:00"
        }
      ],
      comments: [
        {
          id: 1,
          user: { name: "이영희", avatar: "/placeholder-user.jpg" },
          content: "태블릿 사양과 가격을 상세히 기재했습니다.",
          date: "2025.07.24 13:30"
        },
        {
          id: 2,
          user: { name: "최디자인", avatar: "/placeholder-user.jpg" },
          content: "디자인 작업에 매우 유용할 것 같습니다.",
          date: "2025.07.25 10:35"
        },
        {
          id: 3,
          user: { name: "정수민", avatar: "/placeholder-user.jpg" },
          content: "구매 후 자산 등록 부탁드립니다.",
          date: "2025.07.26 09:05"
        }
      ]
    },
    {
      id: 3,
      formTemplateId: "business-trip",
      requester: "박민수",
      department: "마케팅팀",
      date: "2025.07.23",
      status: "rejected",
      priority: "normal",
      content: "출장 일정:\n- 이동 경로: 서울 → 부산 (KTX)\n- 숙박 장소: 부산 롯데호텔\n- 주요 일정: 7/28(월) 고객사 미팅, 7/29(화) 계약 협상\n\n출장 성과 목표:\n- 신규 프로젝트 계약 체결\n- 기존 고객사와의 관계 강화\n- Q3 매출 목표 달성을 위한 기반 마련",
      isMyApproval: false,
      formFields: {
        "출장지": "부산",
        "출장일": "2025-07-28",
        "목적": "업무협의",
        "예상 비용": "800,000"
      },
      approvalStages: [
        {
          id: 1,
          status: "completed",
          approvers: [
            {
              userId: "marketing-leader-1",
              name: "김마케팅",
              position: "마케팅팀장",
              status: "completed",
              date: "2025.07.24"
            }
          ]
        },
        {
          id: 2,
          status: "rejected",
          approvers: [
            {
              userId: "current-user-id",
              name: "김철수",
              position: "개발팀장",
              status: "rejected",
              date: "2025.07.25"
            }
          ]
        }
      ],
      references: [
        {
          userId: "ref-4",
          name: "이영희",
          position: "디자인팀장"
        }
      ],
      history: [
        {
          id: 1,
          action: "created",
          user: { name: "박민수", avatar: "/placeholder-user.jpg" },
          date: "2025.07.23 16:45"
        },
        {
          id: 2,
          action: "updated",
          user: { name: "박민수", avatar: "/placeholder-user.jpg" },
          date: "2025.07.23 17:20",
          changes: [
            { field: "출장기간", oldValue: "1박 2일", newValue: "2박 3일" },
            { field: "목적", oldValue: "고객사 방문", newValue: "고객사 방문 및 계약 협상" }
          ]
        },
        {
          id: 3,
          action: "approved",
          user: { name: "김마케팅", avatar: "/placeholder-user.jpg" },
          date: "2025.07.24 11:30"
        },
        {
          id: 4,
          action: "rejected",
          user: { name: "김철수", avatar: "/placeholder-user.jpg" },
          date: "2025.07.25 15:45"
        }
      ],
      comments: [
        {
          id: 1,
          user: { name: "박민수", avatar: "/placeholder-user.jpg" },
          content: "고객사와의 중요한 미팅이 있어 출장이 필요합니다.",
          date: "2025.07.23 16:50"
        },
        {
          id: 2,
          user: { name: "김마케팅", avatar: "/placeholder-user.jpg" },
          content: "매우 중요한 고객사이므로 출장 승인합니다.",
          date: "2025.07.24 11:35"
        },
        {
          id: 3,
          user: { name: "김철수", avatar: "/placeholder-user.jpg" },
          content: "현재 예산 상황을 고려하여 반려합니다. 다음 분기에 재신청해주세요.",
          date: "2025.07.25 15:50"
        }
      ]
    },
    {
      id: 4,
      formTemplateId: "recruitment",
      requester: "최지영",
      department: "인사팀",
      date: "2025.07.22",
      status: "pending",
      priority: "normal",
      content: "채용 배경:\n- 마케팅팀 업무량 증가로 인한 인력 부족\n- 디지털 마케팅 전문가 필요\n- 신규 프로젝트 런칭을 위한 인력 확충\n\n주요 업무:\n- 디지털 마케팅 캠페인 기획 및 실행\n- SNS 마케팅 및 콘텐츠 제작\n- 마케팅 성과 분석 및 리포팅\n\n채용 일정:\n- 공고 게시: 2025년 7월 25일\n- 서류 심사: 2025년 8월 1일\n- 면접 일정: 2025년 8월 5일 ~ 8월 10일",
      isMyApproval: true,
      formFields: {
        "직무": "마케터",
        "인원": "2",
        "자격요건": ["대학 졸업", "관련 경력"],
        "급여 범위": "연봉 3500-4500만원"
      },
      approvalStages: [
        {
          id: 1,
          status: "completed",
          approvers: [
            {
              userId: "hr-leader-1",
              name: "김인사",
              position: "인사팀장",
              status: "completed",
              date: "2025.07.23"
            }
          ]
        },
        {
          id: 2,
          status: "current",
          approvers: [
            {
              userId: "current-user-id",
              name: "김인사",
              position: "인사팀장",
              status: "pending"
            },
            {
              userId: "executive-1",
              name: "박대표",
              position: "대표이사",
              status: "pending"
            }
          ]
        }
      ],
      references: [
        {
          userId: "ref-5",
          name: "정수민",
          position: "경영지원팀장"
        }
      ],
      history: [
        {
          id: 1,
          action: "created",
          user: { name: "최지영", avatar: "/placeholder-user.jpg" },
          date: "2025.07.22 10:30"
        },
        {
          id: 2,
          action: "file_attached",
          user: { name: "최지영", avatar: "/placeholder-user.jpg" },
          date: "2025.07.22 10:35"
        },
        {
          id: 3,
          action: "approved",
          user: { name: "김인사", avatar: "/placeholder-user.jpg" },
          date: "2025.07.23 14:20"
        }
      ],
      comments: [
        {
          id: 1,
          user: { name: "최지영", avatar: "/placeholder-user.jpg" },
          content: "마케팅팀 업무 증가로 인해 신규 인력 채용이 시급합니다.",
          date: "2025.07.22 10:40"
        },
        {
          id: 2,
          user: { name: "김인사", avatar: "/placeholder-user.jpg" },
          content: "디지털 마케팅 전문가 채용에 동의합니다. 적극 검토하겠습니다.",
          date: "2025.07.23 14:25"
        }
      ]
    },
    {
      id: 5,
      formTemplateId: "facility-request",
      requester: "정수민",
      department: "경영지원팀",
      date: "2025.07.21",
      status: "approved",
      priority: "low",
      content: "사용 세부 사항:\n- 사용 시간: 오전 10시 ~ 오후 12시\n- 준비 사항: 프로젝터, 화이트보드, 회의 자료\n- 필요 장비: 마이크, 스피커, 노트북 연결 케이블\n\n참고 사항:\n- 분기별 전체 회의로 전 직원 참석 예정\n- 회의 후 간단한 다과 제공 계획",
      isMyApproval: false,
      formFields: {
        "시설명": "대회의실",
        "사용일시": "2025-07-28",
        "목적": "분기별 전체 회의",
        "참석자": "15"
      },
      approvalStages: [
        {
          id: 1,
          status: "completed",
          approvers: [
            {
              userId: "support-leader-1",
              name: "정수민",
              position: "경영지원팀장",
              status: "completed",
              date: "2025.07.22"
            }
          ]
        }
      ],
      references: [
        {
          userId: "ref-6",
          name: "박민수",
          position: "마케팅팀장"
        }
      ],
      history: [
        {
          id: 1,
          action: "created",
          user: { name: "정수민", avatar: "/placeholder-user.jpg" },
          date: "2025.07.21 15:20"
        },
        {
          id: 2,
          action: "approved",
          user: { name: "정수민", avatar: "/placeholder-user.jpg" },
          date: "2025.07.22 09:15"
        }
      ],
      comments: [
        {
          id: 1,
          user: { name: "정수민", avatar: "/placeholder-user.jpg" },
          content: "다음 주 월요일 오전 10시부터 12시까지 대회의실 예약 신청합니다.",
          date: "2025.07.21 15:25"
        }
      ]
    },
    {
      id: 6,
      formTemplateId: "budget-request",
      requester: "김철수",
      department: "개발팀",
      date: "2025.07.20",
      status: "pending",
      priority: "high",
      content: "요청 배경:\n- 신규 AI 기반 프로젝트 개발 필요\n- 기존 인프라로는 성능 한계 도달\n- 고객 요구사항 충족을 위한 기술 업그레이드 필요\n\n세부 예산 계획:\n1. 고성능 서버 구축: 500만원\n2. 개발 도구 라이선스: 200만원\n3. 클라우드 서비스 비용: 100만원\n\n투자 대비 효과:\n- 개발 생산성 30% 향상\n- 프로젝트 완료 기간 2개월 단축\n\nROI 분석:\n- 예상 수익: 연간 2억원\n- 투자 회수 기간: 6개월",
      isMyApproval: false, // 내가 신청했지만 타인이 승인해야 함
      formFields: {
        "예산 항목": "장비비",
        "요청 금액": "8,000,000",
        "사용 계획": "신규 프로젝트 개발을 위한 서버 및 개발 도구 구매",
        "기대 효과": "개발 생산성 30% 향상 및 프로젝트 일정 단축"
      },
      attachments: [
        {
          id: "att-1",
          name: "프로젝트_예산_계획서.pdf",
          size: "2.5MB",
          url: "/documents/project-budget-plan.pdf"
        },
        {
          id: "att-2", 
          name: "개발_일정_표.xlsx",
          size: "1.2MB",
          url: "/documents/development-schedule.xlsx"
        },
        {
          id: "att-3",
          name: "기술_요구사항_문서.docx",
          size: "3.1MB",
          url: "/documents/technical-requirements.docx"
        }
      ],
      approvalStages: [
        {
          id: 1,
          status: "completed",
          approvers: [
            {
              userId: "dev-leader-1",
              name: "김철수",
              position: "개발팀장",
              status: "completed",
              date: "2025.07.21"
            }
          ]
        },
        {
          id: 2,
          status: "current",
          approvers: [
            {
              userId: "design-leader-1",
              name: "이영희",
              position: "디자인팀장",
              status: "pending"
            }
          ]
        },
        {
          id: 3,
          status: "pending",
          approvers: [
            {
              userId: "executive-1",
              name: "박대표",
              position: "대표이사",
              status: "pending"
            }
          ]
        }
      ],
      references: [
        {
          userId: "ref-7",
          name: "정수민",
          position: "경영지원팀장"
        },
        {
          userId: "ref-8",
          name: "최지영",
          position: "인사팀장"
        }
      ],
      history: [
        {
          id: 1,
          action: "created",
          user: { name: "김철수", avatar: "/placeholder-user.jpg" },
          date: "2025.07.20 11:00"
        },
        {
          id: 2,
          action: "updated",
          user: { name: "김철수", avatar: "/placeholder-user.jpg" },
          date: "2025.07.20 14:30",
          changes: [
            { field: "예산금액", oldValue: "500만원", newValue: "800만원" },
            { field: "개발기간", oldValue: "3개월", newValue: "4개월" }
          ]
        },
        {
          id: 3,
          action: "approved",
          user: { name: "김철수", avatar: "/placeholder-user.jpg" },
          date: "2025.07.21 16:45"
        }
      ],
      comments: [
        {
          id: 1,
          user: { name: "김철수", avatar: "/placeholder-user.jpg" },
          content: "신규 프로젝트 개발을 위한 예산 신청입니다. 상세 내역은 첨부파일을 참고해주세요.",
          date: "2025.07.20 11:15"
        },
        {
          id: 2,
          user: { name: "이영희", avatar: "/placeholder-user.jpg" },
          content: "예산이 많이 증가했네요. 상세한 근거 자료가 필요합니다.",
          date: "2025.07.22 10:30"
        }
      ]
    },
    {
      id: 7,
      formTemplateId: "salary-adjustment",
      requester: "김철수",
      department: "개발팀",
      date: "2025.07.19",
      status: "pending",
      priority: "normal",
      content: "주요 성과:\n- 3개 주요 프로젝트 성공적 완료\n- 팀 생산성 20% 향상 달성\n- 신입 개발자 멘토링 및 교육\n\n자기계발 노력:\n- React 고급 과정 수료\n- AWS 클라우드 자격증 취득\n- 기술 블로그 운영 및 지식 공유\n\n향후 계획:\n- 팀 기술 역량 강화 프로그램 도입\n- 신기술 도입을 통한 개발 효율성 개선",
      isMyApproval: false, // 내가 신청했지만 타인이 승인해야 함
      formFields: {
        "현재 급여": "5,000,000",
        "희망 급여": "6,500,000",
        "조정 사유": ["승진", "성과 우수"],
        "근무 실적": "프로젝트 리드 성공 및 팀 생산성 20% 향상"
      },
      approvalStages: [
        {
          id: 1,
          status: "completed",
          approvers: [
            {
              userId: "dev-leader-1",
              name: "김철수",
              position: "개발팀장",
              status: "completed",
              date: "2025.07.20"
            }
          ]
        },
        {
          id: 2,
          status: "current",
          approvers: [
            {
              userId: "hr-manager-1",
              name: "박민수",
              position: "인사팀원",
              status: "pending"
            }
          ]
        }
      ],
      references: [
        {
          userId: "ref-9",
          name: "최지영",
          position: "인사팀장"
        }
      ],
      history: [
        {
          id: 1,
          action: "created",
          user: { name: "김철수", avatar: "/placeholder-user.jpg" },
          date: "2025.07.19 09:15"
        },
        {
          id: 2,
          action: "file_attached",
          user: { name: "김철수", avatar: "/placeholder-user.jpg" },
          date: "2025.07.19 09:20"
        },
        {
          id: 3,
          action: "approved",
          user: { name: "김철수", avatar: "/placeholder-user.jpg" },
          date: "2025.07.20 17:30"
        }
      ],
      comments: [
        {
          id: 1,
          user: { name: "김철수", avatar: "/placeholder-user.jpg" },
          content: "최근 성과를 바탕으로 급여 조정을 신청합니다. 첨부 자료를 검토해주세요.",
          date: "2025.07.19 09:25"
        },
        {
          id: 2,
          user: { name: "박민수", avatar: "/placeholder-user.jpg" },
          content: "성과 평가서와 근무 실적을 검토 중입니다. 잠시만 기다려주세요.",
          date: "2025.07.21 14:20"
        }
      ]
    },
  ]

export default approvals
