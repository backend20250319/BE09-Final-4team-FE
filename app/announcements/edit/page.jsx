"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { Input } from "@/components/ui/input";
import { colors, typography } from "@/lib/design-tokens";
import dynamic from "next/dynamic";
import { ArrowLeft, Save, X } from "lucide-react";
import { AttachmentsManager, Attachment } from "@/components/ui/attachments-manager";
import { communicationApi } from "@/lib/services/communication";
import { attachmentService } from "@/lib/services/attachment/api";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogAction } from "@/components/ui/alert-dialog";

const Editor = dynamic(() => import("../write/components/Editor"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center p-8 gap-2">
      <div className="w-5 h-5 border-2 border-gray-100 border-t-blue-500 rounded-full animate-spin"></div>
      <span>에디터 로딩 중...</span>
    </div>
  ),
});

// 더미 데이터 (실제로는 API에서 받아올 데이터)
const DUMMY_ANNOUNCEMENT = {
  id: 1,
  title: "2025년 하반기 인사발령",
  contentSummary: "2025년 하반기 인사발령에 관한 공지사항입니다.",
  displayAuthor: "인사팀",
  createdAt: "2025-07-15",
  views: 45,
  commentCnt: 3,
  content: {
    root: {
      children: [
        {
          children: [
            {
              text: "2025년 하반기 인사발령이 발표되었습니다. 주요 인사 변동 사항은 다음과 같습니다.",
              type: "text"
            }
          ],
          type: "paragraph"
        }
      ],
      type: "root"
    }
  },
  attachment: {
    id: "file-1",
    name: "2025_하반기_인사발령.pdf",
    size: "2.1 MB",
    url: "/file-1.pdf"
  }
};

// useSearchParams를 사용하는 컴포넌트를 별도로 분리
function AnnouncementEditContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const editorRef = useRef(null);
  const [attachments, setAttachments] = useState([]);
  const [originalFileIds, setOriginalFileIds] = useState([]); // 원본 파일 ID 목록
  const [uploadedFileIds, setUploadedFileIds] = useState([]); // 새로 업로드된 파일 ID 목록
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorDialogMessage, setErrorDialogMessage] = useState("");

  useEffect(() => {
    // URL 파라미터에서 공지사항 ID를 받아와서 데이터 로드
    const announcementId = searchParams.get('id');

    // 실제 API로 공지사항 데이터 로드
    const loadAnnouncementData = async () => {
      try {
        setLoading(true);
        setError("");

        // 공지사항 상세 정보 조회
        const detailResponse = await communicationApi.announcements.getAnnouncement(parseInt(announcementId));
        const data = detailResponse.data;

        setTitle(data.title || "");
        setAuthor(data.displayAuthor || "");
        
        // content가 문자열인지 객체인지 확인하고 적절히 처리
        let contentData = data.content || "";
        if (typeof contentData === 'string') {
          try {
            // JSON 문자열인 경우 그대로 사용
            JSON.parse(contentData);
            setContent(contentData);
          } catch (e) {
            // 일반 텍스트인 경우 Lexical 형태로 변환
            const lexicalContent = {
              root: {
                children: [{
                  children: [{
                    text: contentData,
                    type: "text"
                  }],
                  type: "paragraph"
                }],
                type: "root"
              }
            };
            setContent(JSON.stringify(lexicalContent));
          }
        } else {
          // 객체인 경우 JSON 문자열로 변환
          setContent(JSON.stringify(contentData));
        }
        
        console.log('로드된 content:', data.content);
        console.log('설정할 content:', contentData);
        console.log('content 타입:', typeof contentData);
        
        // 원본 파일 ID 목록 저장
        if (data.fileIds && data.fileIds.length > 0) {
          setOriginalFileIds(data.fileIds);
          
          // 첨부파일 정보 조회
          const attachmentPromises = data.fileIds.map(async (fileId) => {
            try {
              const fileInfo = await attachmentService.getFileInfo(fileId);
              return {
                id: fileId,
                name: fileInfo.fileName,
                size: `${(fileInfo.fileSize / 1024 / 1024).toFixed(2)} MB`,
                isOriginal: true // 원본 파일 표시
              };
            } catch (error) {
              console.error(`파일 정보 조회 실패: ${fileId}`, error);
              return null;
            }
          });
          
          const attachmentResults = await Promise.all(attachmentPromises);
          setAttachments(attachmentResults.filter(att => att !== null));
        }

        setLoading(false);
      } catch (error) {
        console.error("공지사항 데이터 로드 실패:", error);
        setError(error.message || "공지사항을 불러오는데 실패했습니다.");
        setLoading(false);
      }
    };

    if (announcementId) {
      loadAnnouncementData();
    } else {
      // ID가 없으면 기본값으로 설정
      setTitle(DUMMY_ANNOUNCEMENT.title);
      setAuthor(DUMMY_ANNOUNCEMENT.displayAuthor);
      setContent(JSON.stringify(DUMMY_ANNOUNCEMENT.content));
      if (DUMMY_ANNOUNCEMENT.attachment) {
        setAttachments([
          {
            id: DUMMY_ANNOUNCEMENT.attachment.id,
            name: DUMMY_ANNOUNCEMENT.attachment.name,
            size: DUMMY_ANNOUNCEMENT.attachment.size,
            url: DUMMY_ANNOUNCEMENT.attachment.url,
          },
        ]);
      }
      setLoading(false);
    }
  }, [searchParams]);

  // 파일이 추가될 때 실제 업로드 수행
  const handleAttachmentsChange = async (newAttachments) => {
    const addedAttachments = newAttachments.filter(newAttachment => 
      !attachments.some(existing => existing.id === newAttachment.id)
    );
    
    if (addedAttachments.length === 0) {
      setAttachments(newAttachments);
      return;
    }

    setAttachments(newAttachments);
    
    // 새로 추가된 파일들을 업로드
    for (const attachment of addedAttachments) {
      await uploadFile(attachment);
    }
  };

  // 개별 파일 업로드 함수
  const uploadFile = async (attachment) => {
    try {
      setIsUploading(true);
      
      // File 객체 가져오기 (blob URL에서 복원)
      const response = await fetch(attachment.url);
      const blob = await response.blob();
      const file = new File([blob], attachment.name, { type: blob.type });
      
      const uploadResponse = await attachmentService.uploadFiles([file]);
      
      if (uploadResponse && uploadResponse.length > 0) {
        const uploadedFile = uploadResponse[0];
        setUploadedFileIds(prev => [...prev, uploadedFile.fileId]);
        
        // attachment 상태 업데이트 (업로드 완료 표시)
        setAttachments(prev => prev.map(att => 
          att.id === attachment.id 
            ? { ...att, uploaded: true, fileId: uploadedFile.fileId }
            : att
        ));
      }
    } catch (error) {
      console.error('파일 업로드 실패:', error);
      setErrorDialogMessage(`파일 업로드에 실패했습니다: ${attachment.name}`);
      setShowErrorDialog(true);
      
      // 업로드 실패한 파일은 목록에서 제거
      setAttachments(prev => prev.filter(att => att.id !== attachment.id));
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 업로드가 진행 중인지 확인
      if (isUploading) {
        setError('파일 업로드가 진행 중입니다. 잠시만 기다려주세요.');
        return;
      }

      const announcementId = searchParams.get('id');
      if (!announcementId) {
        setError('공지사항 ID가 없습니다.');
        return;
      }

      // 에디터에서 현재 content 가져오기
      let currentContent = "";
      if (editorRef.current) {
        try {
          currentContent = editorRef.current.getEditorState();
        } catch (error) {
          console.error('에디터 상태 가져오기 실패:', error);
          currentContent = content; // 기존 content 사용
        }
      }

      // 최종 파일 ID 목록 계산
      const remainingOriginalFileIds = originalFileIds.filter(fileId => 
        attachments.some(att => att.id === fileId && att.isOriginal)
      );
      const finalFileIds = [...remainingOriginalFileIds, ...uploadedFileIds];

      const updateData = {
        title: title.trim(),
        displayAuthor: author.trim(),
        content: currentContent || "",
        fileIds: finalFileIds
      };

      // API 호출
      await communicationApi.announcements.updateAnnouncement(parseInt(announcementId), updateData);
      
      console.log("공지사항 수정 성공");
      router.push("/announcements");
      
    } catch (error) {
      console.error("공지사항 수정 실패:", error);
      setError(error.message || "공지사항 수정에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Spinner size="xl" className="mx-auto mb-4" />
            <p className="text-gray-600">공지사항을 불러오는 중...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className={`${typography.h1} text-gray-800`}>공지사항 수정</h1>
            <p className="text-gray-600">공지사항 내용을 수정하고 저장하세요.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block mb-2 text-gray-700 font-semibold">제목</label>
              <Input
                placeholder="공지사항 제목을 입력하세요"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                className="h-12 text-lg"
              />
            </div>
            <div>
              <label className="block mb-2 text-gray-700 font-semibold">작성자</label>
              <Input
                placeholder="작성자를 입력하세요"
                value={author}
                onChange={e => setAuthor(e.target.value)}
                required
                className="h-12 text-lg"
              />
            </div>
          </div>

          <div className="mb-8">
            <label className="block mb-2 text-gray-700 font-semibold">내용</label>
            <Editor 
              ref={editorRef}
              jsonData={content} 
              onChange={() => {}} // 빈 함수로 설정
              readOnly={false} 
              showToolbar={true}
              key={`editor-${searchParams.get('id') || 'new'}`} // ID 기반으로 key 설정
            />
            {/* 디버깅용: 현재 content 상태 표시 */}
            <div className="text-xs text-gray-500 mt-2">
              현재 content: {content ? '있음' : '없음'}
            </div>
          </div>

          <div className="mb-8">
            <label className="block mb-2 text-gray-700 font-semibold">첨부파일</label>
            {isUploading && (
              <Alert className="mb-2 bg-blue-50 border-blue-200">
                <Spinner size="sm" className="text-blue-600" />
                <AlertDescription className="text-blue-700">
                  파일을 업로드하는 중입니다...
                </AlertDescription>
              </Alert>
            )}
            <AttachmentsManager
              attachments={attachments}
              onAttachmentsChange={handleAttachmentsChange}
              maxFiles={10}
              maxFileSize={50}
            />
          </div>

          <div className="flex gap-3 justify-end pt-6 border-t border-gray-200">
            <button
              type="button"
              className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
              onClick={() => router.back()}
              disabled={isLoading || isUploading}
            >
              <X className="w-4 h-4" />
              취소
            </button>
            <GradientButton 
              type="submit" 
              variant="primary" 
              className="px-6 py-3"
              disabled={isLoading || isUploading || !title.trim() || !author.trim()}
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" className="text-white mr-2" />
                  저장 중...
                </>
              ) : isUploading ? (
                <>
                  <Spinner size="sm" className="text-white mr-2" />
                  파일 업로드 중...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  저장하기
                </>
              )}
            </GradientButton>
          </div>
        </form>
      </div>
      
      {/* 파일 업로드 실패 다이얼로그 */}
      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>업로드 실패</AlertDialogTitle>
            <AlertDialogDescription>
              {errorDialogMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogAction onClick={() => setShowErrorDialog(false)}>
            확인
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}

// 로딩 컴포넌트
function LoadingFallback() {
  return (
    <MainLayout>
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">페이지를 불러오는 중...</p>
        </div>
      </div>
    </MainLayout>
  );
}

// 메인 컴포넌트 - Suspense로 감싸기
export default function AnnouncementEditPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AnnouncementEditContent />
    </Suspense>
  );
}
