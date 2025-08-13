"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientButton } from "@/components/ui/gradient-button"
import { Input } from "@/components/ui/input"
import { colors, typography } from "@/lib/design-tokens"
import { Search, Plus, Megaphone, Calendar, User, Eye, MessageSquare } from "lucide-react"
import { useEffect } from "react"
import { useRouter } from 'next/navigation'
import StyledPaging from "@/components/paging/styled-paging"
import AnnouncementsDetailModal from "./components/AnnouncementsDetailModal"

// 더미 데이터 생성 함수
const DUMMY_DATA = Array.from({ length: 53 }).map((_, i) => ({
  id: i + 1,
  title: [
    "2025년 하반기 인사발령",
    "신입사원 온보딩 프로그램 안내",
    "연말정산 관련 서류 제출 안내",
    "사내 동호회 활동 지원 안내",
    "보안 정책 개정 사항",
    "건강검진 일정 안내",
    "연차 사용 가이드라인",
    "사내 식당 메뉴 개선 안내",
    "주차장 이용 규정 변경",
    "복리후생 제도 개선 안내"
  ][i % 10],
  contentSummary: [
    "2025년 하반기 인사발령이 발표되었습니다. 주요 인사 변동 사항과 조직 개편 내용을 확인하세요.",
    "신입사원 온보딩 프로그램이 시작됩니다. 회사 문화와 업무 프로세스를 빠르게 익힐 수 있습니다.",
    "연말정산 관련 서류 제출이 시작됩니다. 필요한 서류와 제출 방법을 확인하세요.",
    "사내 동호회 활동을 지원합니다. 다양한 동호회에 참여하여 동료들과 소통하세요.",
    "보안 정책이 개정되었습니다. 새로운 보안 가이드라인을 숙지하고 준수해주세요.",
    "건강검진 일정이 확정되었습니다. 지정된 병원에서 건강검진을 받으세요.",
    "연차 사용에 대한 가이드라인이 개정되었습니다. 연차 신청 방법과 사용 규정을 확인하세요.",
    "사내 식당 메뉴가 개선되었습니다. 더 다양한 메뉴와 영양 균형을 고려한 식단을 제공합니다.",
    "주차장 이용 규정이 변경되었습니다. 새로운 주차 규정을 확인하고 준수해주세요.",
    "복리후생 제도가 개선되었습니다. 다양한 혜택과 지원 내용을 확인하세요."
  ][i % 10],
  displayAuthor: ["인사팀", "IT팀", "경영지원팀", "보안팀", "총무팀"][i % 5],
  createdAt: `2025-07-${(i % 30 + 1).toString().padStart(2, "0")}`,
  views: Math.floor(Math.random() * 100) + 10,
  commentCnt: Math.floor(Math.random() * 10) + 1,
  // 상세보기용 데이터 추가
  content: {
    root: {
      children: [
        {
          children: [
            {
              text: [
                "2025년 하반기 인사발령이 발표되었습니다. 주요 인사 변동 사항은 다음과 같습니다.\n\n1. 부서장급 인사\n- IT개발팀장: 김철수 → 이영희\n- 마케팅팀장: 박민수 → 최지영\n\n2. 팀장급 인사\n- 개발1팀장: 정수호\n- 디자인팀장: 한미영\n\n3. 조직 개편\n- 신규 부서: AI연구팀 신설\n- 통합 부서: 영업1팀 + 영업2팀 → 영업팀\n\n자세한 내용은 첨부된 문서를 참고하시기 바랍니다.",
                "신입사원 온보딩 프로그램이 시작됩니다. 회사 문화와 업무 프로세스를 빠르게 익힐 수 있도록 체계적인 교육을 제공합니다.\n\n프로그램 구성:\n1. 회사 소개 및 조직 문화 (1주차)\n2. 업무 프로세스 및 시스템 교육 (2주차)\n3. 팀워크 및 소통 스킬 (3주차)\n4. 실무 프로젝트 참여 (4주차)\n\n교육 일정과 장소는 개별 안내드립니다.",
                "연말정산 관련 서류 제출이 시작됩니다. 필요한 서류와 제출 방법을 확인하시기 바랍니다.\n\n제출 기간: 2025년 12월 1일 ~ 12월 31일\n\n필수 제출 서류:\n1. 소득공제 신청서\n2. 의료비 증빙서류\n3. 교육비 증빙서류\n4. 주택자금 증빙서류\n\n제출 방법: 인사팀 방문 또는 온라인 시스템\n\n문의사항: 인사팀 (내선 1234)",
                "사내 동호회 활동을 지원합니다. 다양한 동호회에 참여하여 동료들과 소통하고 취미를 공유하세요.\n\n현재 운영 중인 동호회:\n1. 독서동호회 - 매주 금요일 저녁\n2. 축구동호회 - 매주 토요일 오전\n3. 등산동호회 - 월 1회\n4. 요리동호회 - 매주 수요일 저녁\n5. 음악동호회 - 매주 목요일 저녁\n\n신규 동호회 개설도 가능합니다. 관심 있는 분들은 총무팀에 문의하세요.",
                "보안 정책이 개정되었습니다. 새로운 보안 가이드라인을 숙지하고 준수해주세요.\n\n주요 변경사항:\n1. 비밀번호 정책 강화\n   - 최소 12자 이상\n   - 특수문자, 숫자, 영문 조합 필수\n   - 90일마다 변경\n\n2. 2단계 인증 의무화\n   - 모든 시스템 접속 시\n   - 휴대폰 인증 또는 보안키 사용\n\n3. 외부 메일 첨부파일 검사 강화\n   - 실행파일 첨부 금지\n   - 압축파일 검사 의무화\n\n보안 관련 문의: 보안팀 (내선 5678)"
              ][i % 10],
              type: "text"
            }
          ],
          type: "paragraph"
        }
      ],
      type: "root"
    }
  },
  attachment: i % 3 === 0 ? {
    id: `file-${i}`,
    name: [
      "2025_하반기_인사발령_명단.pdf",
      "신입사원_온보딩_가이드.pdf",
      "연말정산_서류_제출_가이드.pdf",
      "사내동호회_활동_지원_안내.pdf",
      "보안정책_개정_가이드라인.pdf"
    ][Math.floor(i / 3) % 5],
    size: `${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 9)} MB`,
    url: `/file-${i}.pdf`
  } : null
}))

// 더미 fetch 함수 (API 준비 전용)
async function fetchAnnouncements({ page, search }) {
  await new Promise((res) => setTimeout(res, 200))
  let filtered = DUMMY_DATA
  if (search) {
    const s = search.toLowerCase()
    filtered = filtered.filter(
      (item) => item.title.toLowerCase().includes(s) || item.contentSummary.toLowerCase().includes(s)
    )
  }
  const totalLength = filtered.length
  const start = (page - 1) * 10
  const data = filtered.slice(start, start + 10)
  return { data, totalLength }
}

export default function AnnouncementsPage() {
  const router = useRouter();
  const [inputText, setInputText] = useState("");
  const [searchTerm, setSearchTerm] = useState("")
  const itemsPerPage = 10;
  const [page, setPage] = useState(1);
  const [announcements, setAnnouncements] = useState([])
  const [total, setTotal] = useState(0)
  const totalPages = Math.ceil(total / itemsPerPage)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // 모달 상태 추가
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 데이터 요청 함수
  const loadData = async (page, search) => {
    setLoading(true)
    setError("")
    try {
      const result = await fetchAnnouncements({ page, search })
      setAnnouncements(result.data)
      setTotal(result.totalLength)
    } catch (e) {
      setError(e.message || "에러 발생")
    } finally {
      setLoading(false)
    }
  }

  // 페이지 변경/검색 시 데이터 요청
  useEffect(() => {
    loadData(page, searchTerm)
  }, [page, searchTerm])

  // 검색 아이콘 클릭 핸들러
  const handleSearchClick = () => {
    if (inputText == null || inputText.trim() === "") {
      console.log(inputText + " 빈검색");
      setSearchTerm(inputText);
      setPage(1);
    } else {
      console.log(inputText + " 검색");
      setSearchTerm(inputText);
      setPage(1);
    }
  }

  // 입력값 변경 핸들러
  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  // 공지사항 클릭 핸들러 - 모달 열기로 변경
  const handleGlassCardClick = (announcement) => {
    console.log('공지사항 클릭됨:', announcement);
    setSelectedAnnouncement(announcement);
    setIsModalOpen(true);
    console.log('모달 상태 변경됨:', true);
  };

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    console.log('모달 닫기');
    setIsModalOpen(false);
    setSelectedAnnouncement(null);
  };

  // 수정 핸들러
  const handleEdit = (announcement) => {
    router.push("/announcements/edit");
  };

  // 삭제 핸들러
  const handleDelete = (announcement) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      alert('삭제가 완료되었습니다.');
      handleCloseModal();
    }
  };

  // 글쓰기 클릭 핸들러
  const handleWriteAnnouncement = () => {
    router.push("/announcements/write")
  }

  return (
    <MainLayout>
      {/* Page Title */}
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <h1 className={`${typography.h1} text-gray-800`}>공지사항</h1>
        </div>
        <p className="text-gray-600">회사의 중요한 소식을 확인하세요</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 h-10">
          <Input
            placeholder="제목으로 검색"
            value={inputText}
            className="pr-10 bg-white/60 backdrop-blur-sm border-gray-200/50 rounded-xl h-10"
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearchClick();
              }
            }}
          />
          {/* 검색버튼 */}
          <button
            type="button"
            className="
            absolute right-3 top-1/2 transform -translate-y-1/2
            h-10 w-10 flex items-center justify-center
            text-gray-400 hover:text-gray-600
            bg-transparent rounded-full
            active:bg-gray-100 active:ring-2 
            transition cursor-pointer
          "
            onClick={handleSearchClick}
            tabIndex={0}
            aria-label="검색"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
        <GradientButton
          variant="primary"
          onClick={handleWriteAnnouncement}
        >
          <Plus className="w-4 h-4 mr-2" />
          공지 작성
        </GradientButton>
      </div>

      {/* Announcements List */}
      <div className="space-y-4 min-h-[400px]">
        {loading ? (
          <div className="text-center text-gray-500 py-12">불러오는 중...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-12">{error}</div>
        ) : announcements.length === 0 ? (
          <div className="text-center text-gray-400 py-12">공지사항이 없습니다.</div>
        ) : (
          announcements.map((announcement) => (
            <GlassCard
              key={announcement.id}
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-white"
              onClick={() => handleGlassCardClick(announcement)}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${colors.primary.blue} rounded-xl flex items-center justify-center shadow-lg`}
                >
                  <Megaphone className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className={`${typography.h4} text-gray-800`}>{announcement.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">{announcement.contentSummary}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {announcement.displayAuthor}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {announcement.createdAt}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {announcement.views}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        {announcement.commentCnt}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8">
          <StyledPaging
            currentPage={page}
            totalItems={total}
            itemsPerPage={itemsPerPage}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* 공지사항 상세보기 모달 */}
      <AnnouncementsDetailModal
        isOpen={isModalOpen}
        announcement={selectedAnnouncement}
        onClose={handleCloseModal}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </MainLayout>
  );
} 