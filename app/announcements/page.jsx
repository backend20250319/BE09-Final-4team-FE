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
import StyledPaging from "@/components/paging/styled-paging";


// 더미 데이터 생성 함수
const DUMMY_DATA = Array.from({ length: 53 }).map((_, i) => ({
  id: i + 1,
  title: `공지사항 제목 ${i + 1}`,
  contentSummary: `이것은 ${i + 1}번째 공지의 요약입니다.`,
  displayAuthor: ["인사팀", "IT팀", "경영지원팀"][i % 3],
  createdAt: `2025-07-${(i % 30 + 1).toString().padStart(2, "0")}`,
  views: Math.floor(Math.random() * 100),
  commentCnt: Math.floor(Math.random() * 10),
}))

// 더미 fetch 함수 (API 준비 전용)
async function fetchAnnouncements({ page, search }) {
  // 실제로는 fetch(`/api/announcements?page=${page}&search=${search}`) 등으로 구현
  // 아래는 예시용
  // const res = await fetch(`/api/announcements?page=${page}&search=${encodeURIComponent(search)}`)
  // if (!res.ok) throw new Error("데이터를 불러오지 못했습니다.")
  // return await res.json() 
  // 0.2초 지연 시뮬레이션

  // page면 다음 페이지 api 요청해서 {data, totalLength} return하기
  if (page) {
    
  } 
  // search면 search api 요청해서 {data, totalLength} return하기기
  else if (search) {
    
  }

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
  return { data, totalLength}
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
    // 현재 searchTerm 값을 기반으로 검색 처리
    // 예: 서버 호출, 상태 업데이트 등
    if (inputText == null || inputText.trim() === "") {
      console.log(inputText+" 빈검색");    
      setSearchTerm(inputText);
     setPage(1);
    }
    
    console.log(inputText+" 검색");    
    setSearchTerm(inputText);
    setPage(1);
  }
  
  // 입력값 변경 핸들러
  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  // 공지사항 클릭 핸들러
  const handleGlassCardClick = (id) => {
    router.push("/announcements/detail")
  }

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
            transition
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
            // 매개변수 있어서 화살표함수 써야함.
            onClick={() => handleGlassCardClick(announcement.id)}
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
                    <GradientButton variant="secondary" size="sm">
                      자세히 보기
                    </GradientButton>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))
        )}
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8">
          <StyledPaging
            currentPage={page}
            totalItems={total}
            itemsPerPage={itemsPerPage}
            onPageChange={(pageNumber) => setPage(pageNumber)}
          />
        </div>
      )}
    </MainLayout>
  )
} 