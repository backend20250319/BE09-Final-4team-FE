'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Download, Filter, Plus } from 'lucide-react';
import StyledPaging from '@/components/paging/styled-paging';
import { typography } from '@/lib/design-tokens';
import { GradientButton } from '@/components/ui/gradient-button';
import { FileIcon, defaultStyles } from 'react-file-icon';
import { useRouter } from 'next/navigation';

export default function DocumentsTable({ files }) {
  const [inputText, setInputText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 7;
  const router = useRouter();

  // 파일 메타데이터 생성
  const fileRows = files.map(filename => {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    return {
      filename,
      ext,
    };
  });

  // 검색/필터
  const filtered = fileRows.filter(
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
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={handleSearch}
                aria-label="검색"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
              </Button>
            </div>
            <Button type="button" size="icon" variant="secondary" className="bg-white/60 border border-gray-200/50 text-gray-400 hover:text-gray-600" aria-label="필터"><Filter /></Button>
            <GradientButton type="button" variant="primary" className="h-10 px-4" onClick={() => router.push('/documents-write')}><Plus className="w-4 h-4 mr-2" />업로드</GradientButton>
          </div>
        </div>
        {/* 테이블 */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden min-h-[400px]">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 h-12">
                <TableHead className="w-[70%] text-gray-700 font-semibold px-6 py-2">문서명</TableHead>
                <TableHead className="w-[30%] text-gray-700 font-semibold px-6 py-2 text-center">다운로드</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.length === 0 ? (
                <TableRow className="h-12">
                  <TableCell colSpan={2} className="text-center py-12 text-gray-400">문서가 없습니다.</TableCell>
                </TableRow>
              ) : (
                paged.map(file => (
                  <TableRow key={file.filename} className="h-12">
                    <TableCell className="flex items-center gap-2 font-medium px-6 py-2 h-12">
                      <div style={{ width: 32, height: 32, minWidth: 32, minHeight: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FileIcon
                          extension={file.ext}
                          color={defaultStyles[file.ext]?.color}
                          labelColor={defaultStyles[file.ext]?.labelColor}
                          glyphColor={defaultStyles[file.ext]?.glyphColor}
                          size={24}
                          fontSize={8}
                          style={{ width: 32, height: 32 }}
                        />
                      </div>
                      <span className="truncate">{file.filename}</span>
                    </TableCell>
                    <TableCell className="text-center px-6 py-2 h-12">
                      <a
                        href={`/files/${file.filename}`}
                        download
                        className="inline-flex items-center justify-center w-9 h-9 rounded-md hover:bg-blue-50 transition"
                        title="다운로드"
                      >
                        <Download className="w-5 h-5 text-blue-500" />
                      </a>
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
