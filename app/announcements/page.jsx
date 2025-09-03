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
import { communicationApi } from "@/lib/services/communication"
import { useAuth } from "@/hooks/use-auth"
import { formatDateTime } from "@/lib/utils/date-format"

// 공지사항 목록 조회 함수
async function fetchAnnouncements({ page, search }) {
  try {
    // 실제 API 호출
    const announcements = await communicationApi.announcements.getAllAnnouncements()
    
    // 검색 필터링 (프론트엔드에서 처리)
    let filtered = announcements
    if (search) {
      const s = search.toLowerCase()
      filtered = announcements.filter(
        (item) => item.title.toLowerCase().includes(s) || (item.displayAuthor && item.displayAuthor.toLowerCase().includes(s))
      )
    }
    
    // 페이지네이션 처리 (프론트엔드에서 처리)
    const totalLength = filtered.length
    const itemsPerPage = 10
    const start = (page - 1) * itemsPerPage
    const data = filtered.slice(start, start + itemsPerPage)
    
    return { data, totalLength }
  } catch (error) {
    console.error('공지사항 조회 실패:', error)
    throw new Error(error.message || '공지사항을 불러오는데 실패했습니다.')
  }
}

export default function AnnouncementsPage() {
  const router = useRouter();
  const { isLoggedIn, loading: authLoading } = useAuth();
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

  // 인증 상태 체크 및 데이터 로드
  useEffect(() => {
    if (authLoading) return; // 인증 상태 로딩 중이면 대기
    
    if (!isLoggedIn) {
      router.push('/login'); // 로그인되지 않으면 로그인 페이지로 이동
      return;
    }
    
    // 로그인된 상태에서만 데이터 요청
    loadData(page, searchTerm)
  }, [page, searchTerm, isLoggedIn, authLoading, router])

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

  // 수정 핸들러 - 공지사항 ID를 URL 파라미터로 전달
  const handleEdit = () => {
    if (selectedAnnouncement) {
      handleCloseModal(); // 모달 닫기
      router.push(`/announcements/edit?id=${selectedAnnouncement.id}`);
    }
  };

  // 삭제 핸들러
  const handleDelete = async () => {
    if (!selectedAnnouncement) return;
    
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        // 삭제 API 호출
        await communicationApi.announcements.deleteAnnouncement(selectedAnnouncement.id);
        
        alert('삭제가 완료되었습니다.');
        handleCloseModal();
        
        // 목록 새로고침
        loadData(page, searchTerm);
      } catch (error) {
        console.error('공지사항 삭제 실패:', error);
        alert('삭제에 실패했습니다.');
      }
    }
  };

  // 글쓰기 클릭 핸들러
  const handleWriteAnnouncement = () => {
    router.push("/announcements/write")
  }

  // 인증 로딩 중이면 로딩 화면 표시
  if (authLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">로딩 중...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // 로그인되지 않은 상태면 null 반환 (리다이렉트 처리됨)
  if (!isLoggedIn) {
    return null;
  }

  return (
    <MainLayout requireAuth={true}>
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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {announcement.displayAuthor}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDateTime(announcement.createdAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {announcement.views}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        {announcement.commentCount}
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