'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import StyledPaging from '@/components/paging/styled-paging';
import { typography } from '@/lib/design-tokens';
import { GradientButton } from '@/components/ui/gradient-button';
import { Filter, Plus, Trash2 } from 'lucide-react';
import { FileIcon, defaultStyles } from 'react-file-icon';
import { useRouter } from 'next/navigation';
import { AttachmentsSection } from '@/components/ui/attachments-section';

export default function DocumentsTable() {
  const [inputText, setInputText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 7;
  const router = useRouter();

  // 파일 메타데이터 생성
  // const fileRows = files.map(filename => {
  //   const ext = filename.split('.').pop()?.toLowerCase() || '';
  //   return {
  //     filename,
  //     ext,
  //   };
  // });
  const fileRows = [
    { filename: '인사규정.pdf', ext: 'pdf' },
    { filename: '2025_사업계획서.docx', ext: 'docx' },
    { filename: '근로계약서.hwp', ext: 'hwp' },
    { filename: '연차휴가신청서.xlsx', ext: 'xlsx' },
    { filename: '거래처_연락처.csv', ext: 'csv' },
    { filename: '프로젝트_보고서.pptx', ext: 'pptx' },
    { filename: '직원_명단.txt', ext: 'txt' },
    { filename: '회의록_2025-08-10.docx', ext: 'docx' },
    { filename: '월간매출통계_7월.xlsx', ext: 'xlsx' },
    { filename: '홍보자료_브로슈어.pdf', ext: 'pdf' },
    { filename: '고객불만_처리현황.xlsx', ext: 'xlsx' },
    { filename: '신규직원_교육자료.pptx', ext: 'pptx' },
    { filename: '개인정보취급방침.hwp', ext: 'hwp' },
    { filename: '사내안전규정.pdf', ext: 'pdf' },
    { filename: '연말정산_안내문.docx', ext: 'docx' },
    { filename: '제품_가격표_2025.xlsx', ext: 'xlsx' },
    { filename: '연구개발_성과보고서.pdf', ext: 'pdf' },
    { filename: '프로젝트A_기획안.pptx', ext: 'pptx' },
    { filename: '재무제표_상반기.xlsx', ext: 'xlsx' },
    { filename: '외부감사_자료.hwp', ext: 'hwp' },
    { filename: '브랜드_가이드라인.pdf', ext: 'pdf' },
    { filename: '사내_공지사항_2025-08-01.txt', ext: 'txt' },
    { filename: '채용공고_개발팀.docx', ext: 'docx' },
    { filename: '품질검수_기록.xlsx', ext: 'xlsx' },
    { filename: '마케팅전략_발표자료.pptx', ext: 'pptx' },
  ];

  const [rows, setRows] = useState(fileRows);

  // 검색/필터
  const filtered = rows.filter(
    f =>
      f.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paged = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // 핸들러
  const handleSearch = () => {
    setSearchTerm(inputText);
    setPage(1);
  };
  const handleInputChange = e => setInputText(e.target.value);

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* 상단 타이틀/검색/필터/업로드 */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className={`${typography.h1} text-gray-800 mb-2`}>문서 관리</h1>
            <p className="text-gray-600 text-base">회사 문서를 확인하고 다운로드하세요</p>
          </div>
          <div className="flex gap-2 items-center w-full md:w-auto">
            <div className="relative flex-1 max-w-xs">
              <Input
                placeholder="문서 이름으로 검색..."
                value={inputText}
                onChange={handleInputChange}
                onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
                className="pr-10 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl h-10"
              />
              <button
                type="button"
                className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 w-9 h-9 flex items-center justify-center rounded-md"
                onClick={handleSearch}
                aria-label="검색"
                style={{ background: 'none', border: 'none', padding: 0 }}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
              </button>
            </div>
            <button type="button" className="bg-white/60 border border-gray-200/50 text-gray-400 hover:text-gray-600 w-9 h-9 flex items-center justify-center rounded-md" aria-label="필터" style={{ background: 'none', border: '1px solid #e5e7eb', padding: 0, marginLeft: '8px' }}><Filter /></button>
            <GradientButton type="button" variant="primary" className="h-10 px-4" onClick={() => router.push('/documents-upload')}><Plus className="w-4 h-4 mr-2" />업로드</GradientButton>
          </div>
        </div>
        {/* 테이블 */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden min-h-[400px]">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 h-12">
                <TableHead className="w-full text-gray-700 font-semibold px-6 py-2 text-center">문서 목록</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.length === 0 ? (
                <TableRow className="h-12">
                  <TableCell colSpan={2} className="text-center py-12 text-gray-400">등록된 문서가 없습니다.</TableCell>
                </TableRow>
              ) : (
                paged.map(file => (
                  <TableRow key={file.filename} className="h-12">
                    <TableCell className="pl-6 pr-0 py-2 h-12">
                      <AttachmentsSection
                        attachments={[{
                          id: file.filename,
                          name: file.filename,
                          url: '', // 실제 파일 URL이 있다면 여기에 입력
                          size: '1.0 MB' // 실제 파일 크기 정보로 대체
                        }]}
                      />
                    </TableCell>
                    <TableCell className="text-center pl-0 pr-2 py-1 h-12">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            if (window.confirm('정말 삭제하시겠습니까?')) {
                              setRows(prev => prev.filter(r => r.filename !== file.filename));
                              alert('삭제가 완료되었습니다.');
                            }
                          }}
                          className="text-red-500 hover:bg-red-50 w-9 h-9 flex items-center justify-center rounded-md"
                          title="삭제"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8">
            <StyledPaging
              currentPage={page}
              totalItems={filtered.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </MainLayout>
  );
}
