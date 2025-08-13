'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Input } from '@/components/ui/input';
import StyledPaging from '@/components/paging/styled-paging';
import { typography } from '@/lib/design-tokens';
import { GradientButton } from '@/components/ui/gradient-button';
import { Filter, Plus, Trash2, Edit, MoreVertical, ChevronDown, ChevronRight, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AttachmentsSection } from '@/components/ui/attachments-section';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function DocumentsTable() {
  const [inputText, setInputText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [expandedDocs, setExpandedDocs] = useState(new Set());
  const itemsPerPage = 7;
  const router = useRouter();


  const documentRows = [
    {
      id: '1',
      title: '2025년 신입사원 온보딩 가이드',
      description:
        '신입사원이 회사 문화와 업무 프로세스를 빠르게 이해할 수 있도록 제작된 교육 자료입니다. 회사 소개, 조직 문화, 기본 업무 가이드라인, 필수 시스템 사용법 등을 포함하고 있습니다.',
      attachmentSummary: '2025_신입사원_온보딩_가이드.pdf 외 1건',
      ext: 'pdf',
      attachments: [
        { id: '1', name: '2025_신입사원_온보딩_가이드.pdf', size: '1.4 MB', url: '/2025_신입사원_온보딩_가이드.pdf' },
        { id: '2', name: '회사_조직도.pdf', size: '900 KB', url: '/회사_조직도.pdf' }
      ]
    },
    {
      id: '2',
      title: '2025년 하반기 인사발령 명단',
      description:
        '2025년 하반기 인사 발령 내역입니다. 발령 대상자와 부서 이동 내역을 포함하고 있으며, 인사팀에서 공식 발행한 자료입니다.',
      attachmentSummary: '2025_하반기_인사발령_명단.pdf',
      ext: 'pdf',
      attachments: [
        { id: '1', name: '2025_하반기_인사발령_명단.pdf', size: '1.2 MB', url: '/2025_하반기_인사발령_명단.pdf' }
      ]
    },
    {
      id: '3',
      title: '2025년 연간 휴가 계획표',
      description:
        '2025년도 전사 연간 휴가 계획표입니다. 부서별 휴가 일정을 한눈에 확인할 수 있으며, 부서 간 일정 조율에 참고하기 위해 작성되었습니다.',
      attachmentSummary: '2025_연간_휴가_계획표.xlsx',
      ext: 'xlsx',
      attachments: [
        { id: '1', name: '2025_연간_휴가_계획표.xlsx', size: '500 KB', url: '/2025_연간_휴가_계획표.xlsx' }
      ]
    },
    {
      id: '4',
      title: '2025년 상반기 경영 실적 보고서',
      description:
        '2025년 상반기 동안의 매출, 영업이익, 순이익 등 주요 경영 실적을 정리한 보고서입니다. 경영진 회의 자료로 사용됩니다.',
      attachmentSummary: '2025_상반기_경영_실적_보고서.pdf',
      ext: 'pdf',
      attachments: [
        { id: '1', name: '2025_상반기_경영_실적_보고서.pdf', size: '2.1 MB', url: '/2025_상반기_경영_실적_보고서.pdf' }
      ]
    },
    {
      id: '5',
      title: '사내 보안 정책 매뉴얼',
      description:
        '사내 정보 보안을 위해 모든 임직원이 준수해야 할 보안 정책과 절차를 담은 매뉴얼입니다. 비밀번호 관리, 기기 사용, 외부 자료 반출 등에 관한 규정을 포함합니다.',
      attachmentSummary: '사내_보안_정책_매뉴얼.docx',
      ext: 'docx',
      attachments: [
        { id: '1', name: '사내_보안_정책_매뉴얼.docx', size: '750 KB', url: '/사내_보안_정책_매뉴얼.docx' }
      ]
    },
    {
      id: '6',
      title: '2025년 하반기 교육 일정표',
      description:
        '2025년 하반기에 예정된 전사 및 부서별 교육 일정을 정리한 문서입니다. 교육명, 대상자, 일시, 장소 등의 정보가 포함되어 있습니다.',
      attachmentSummary: '2025_하반기_교육_일정표.xlsx',
      ext: 'xlsx',
      attachments: [
        { id: '1', name: '2025_하반기_교육_일정표.xlsx', size: '600 KB', url: '/2025_하반기_교육_일정표.xlsx' }
      ]
    }
  ];


  const [rows, setRows] = useState(documentRows);


  const searchFiltered = rows.filter(
    doc =>
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(searchFiltered.length / itemsPerPage);
  const paged = searchFiltered.slice((page - 1) * itemsPerPage, page * itemsPerPage);


  const handleSearch = () => {
    setSearchTerm(inputText);
    setPage(1);
  };

  const handleInputChange = e => setInputText(e.target.value);

  const toggleExpanded = (docId) => {
    setExpandedDocs(prev => {
      const newSet = new Set();
      // 다른 문서는 모두 닫고, 클릭한 문서만 토글
      if (!prev.has(docId)) {
        newSet.add(docId);
      }
      return newSet;
    });
  };

  const handleEdit = (doc) => {
    router.push(`/documents/edit`);
  };

  const handleDelete = (doc) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setRows(prev => prev.filter(r => r.id !== doc.id));
      alert('삭제가 완료되었습니다.');
    }
  };

  return (
    <MainLayout>
      {/* Page Title */}
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <h1 className={`${typography.h1} text-gray-800`}>문서함</h1>
        </div>
        <p className="text-gray-600">회사의 중요한 소식을 확인하세요</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 h-10">
          <Input
            placeholder="제목으로 검색"
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
            className="pr-10 bg-white/60 backdrop-blur-sm border-gray-200/50 rounded-xl h-10"
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
            onClick={handleSearch}
            tabIndex={0}
            aria-label="검색"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
          </button>
        </div>
        <GradientButton
          variant="primary"
          onClick={() => router.push('/documents/upload')}
        >
          <Plus className="w-4 h-4 mr-2" />
          문서 업로드
        </GradientButton>
      </div>

      {/* Documents List */}
      <div className="space-y-4 min-h-[400px]">
        {paged.length === 0 ? (
          <div className="text-center text-gray-400 py-12">등록된 문서가 없습니다.</div>
        ) : (
          paged.map(doc => (
            <div key={doc.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              {/* 문서 헤더 (항상 보임) */}
              <div
                className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleExpanded(doc.id)}
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className={`${typography.h4} text-gray-800`}>{doc.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2">{doc.attachmentSummary}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* 확장/축소 아이콘 - 방향 수정 */}
                  {expandedDocs.has(doc.id) ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>

              {/* 문서 내용 (펼쳐졌을 때만 보임) */}
              {expandedDocs.has(doc.id) && (
                <div className="px-6 pb-4 border-t border-gray-100">

                  {/* 문서 설명 */}
                  <div className="pt-8 flex items-start gap-4 px-4">
                    <div className="flex-1">
                      <p className="text-gray-600 leading-relaxed">{doc.description}</p>
                    </div>
                  </div>

                  <div className="flex flex-row gap-2 flex-shrink-0 justify-end items-end px-4">
                    <button
                      onClick={() => handleEdit(doc)}
                      className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(doc)}
                      className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      삭제
                    </button>
                  </div>

                  {/* 첨부파일 섹션 */}
                  <div className="pt-4 p-2">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 px-4">첨부문서</h4>
                    <AttachmentsSection className="px-4"
                      attachments={doc.attachments}
                    />
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8">
          <StyledPaging
            currentPage={page}
            totalItems={searchFiltered.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setPage}
          />
        </div>
      )}
    </MainLayout>
  );
}
