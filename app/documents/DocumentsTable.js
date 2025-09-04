"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Input } from "@/components/ui/input";
import StyledPaging from "@/components/paging/styled-paging";
import { typography } from "@/lib/design-tokens";
import { GradientButton } from "@/components/ui/gradient-button";
import {
  Plus,
  Trash2,
  Edit,
  ChevronDown,
  ChevronRight,
  FileText,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { communicationApi } from "@/lib/services/communication/api";
import { useAuth } from "@/hooks/use-auth";

export default function DocumentsTable() {
  const [inputText, setInputText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [expandedDocs, setExpandedDocs] = useState(new Set());
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 7;
  const router = useRouter();
  const { isAdmin } = useAuth();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const response = await communicationApi.archives.getAllArchives();
        setDocuments(response);
      } catch (err) {
        console.error("문서 목록을 불러오는데 실패했습니다:", err);
        setError("문서 목록을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const searchFiltered = documents.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const totalPages = Math.ceil(searchFiltered.length / itemsPerPage);
  const paged = searchFiltered.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleSearch = () => {
    setSearchTerm(inputText);
    setPage(1);
  };

  const handleInputChange = (e) => setInputText(e.target.value);

  const toggleExpanded = (docId) => {
    setExpandedDocs((prev) => {
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

  const handleDelete = async (doc) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await communicationApi.archives.deleteArchive(doc.id);
        setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
        alert("삭제가 완료되었습니다.");
      } catch (err) {
        console.error("삭제 실패:", err);
        alert("삭제 중 오류가 발생했습니다.");
      }
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
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
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
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>
        </div>
        {isAdmin && (
          <GradientButton
            variant="primary"
            onClick={() => router.push("/documents/upload")}
          >
            <Plus className="w-4 h-4 mr-2" />
            문서 업로드
          </GradientButton>
        )}
      </div>

      {/* Documents List */}
      <div className="space-y-4 min-h-[400px]">
        {loading ? (
          <div className="text-center text-gray-400 py-12">
            문서 목록을 불러오는 중...
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-12">
            {error}
          </div>
        ) : paged.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            등록된 문서가 없습니다.
          </div>
        ) : (
          paged.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
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
                      <h3 className={`${typography.h4} text-gray-800`}>
                        {doc.title}
                      </h3>
                    </div>
                    <p className="text-gray-500 text-sm">
                      {doc.fileIds && doc.fileIds.length > 0 
                        ? `${doc.fileIds.length}개의 첨부파일`
                        : '첨부파일 없음'
                      }
                    </p>
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
                  <div className="pt-8 flex items-start gap-4 px-4 py-8">
                    <div className="flex-1">
                      <p className="text-gray-600 leading-relaxed">
                        {doc.description || '설명이 없습니다.'}
                      </p>
                    </div>
                  </div>

                  {/* 첨부파일 정보 */}
                  <div className="pt-4 p-2 px-4">
                    <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
                      📎 {doc.fileIds && doc.fileIds.length > 0 
                        ? `${doc.fileIds.length}개의 파일이 첨부되었습니다.`
                        : '첨부된 파일이 없습니다.'
                      }
                    </div>
                  </div>

                  {isAdmin && (
                    <div className="flex flex-row gap-2 flex-shrink-0 justify-end items-center px-4 py-4">
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
                  )}
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
