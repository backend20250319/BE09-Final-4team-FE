"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { Input } from "@/components/ui/input";
import { colors, typography } from "@/lib/design-tokens";
import dynamic from "next/dynamic";
import { ArrowLeft, Save, X } from "lucide-react";
import { AttachmentsManager, Attachment } from "@/components/ui/attachments-manager";

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

export default function AnnouncementEditPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // URL 파라미터에서 공지사항 ID를 받아와서 데이터 로드
    const announcementId = searchParams.get('id');

    // 실제로는 API 호출로 데이터를 가져와야 함
    // 지금은 더미 데이터 사용
    const loadAnnouncementData = async () => {
      try {
        // TODO: API 호출로 실제 데이터 가져오기
        // const response = await fetch(`/api/announcements/${announcementId}`);
        // const data = await response.json();

        // 더미 데이터 사용
        const data = DUMMY_ANNOUNCEMENT;

        setTitle(data.title || "");
        setAuthor(data.displayAuthor || "");
        setContent(JSON.stringify(data.content || ""));

        if (data.attachment) {
          setAttachments([
            {
              id: data.attachment.id || data.attachment.name,
              name: data.attachment.name,
              size: data.attachment.size,
              url: data.attachment.url,
            },
          ]);
        }

        setLoading(false);
      } catch (error) {
        console.error("공지사항 데이터 로드 실패:", error);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: API 연동
    console.log("제목:", title);
    console.log("작성자:", author);
    console.log("본문(JSON):", content);
    console.log("첨부파일:", attachments);
    alert("공지사항이 수정되었습니다.");
    router.push("/announcements");
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
            <Editor jsonData={content} onChange={setContent} />
          </div>

          <div className="mb-8">
            <AttachmentsManager
              attachments={attachments}
              onAttachmentsChange={setAttachments}
              maxFiles={10}
              maxFileSize={50}
            />
          </div>

          <div className="flex gap-3 justify-end pt-6 border-t border-gray-200">
            <button
              type="button"
              className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
              onClick={() => router.back()}
            >
              <X className="w-4 h-4" />
              취소
            </button>
            <GradientButton type="submit" variant="primary" className="px-6 py-3">
              <Save className="w-4 h-4 mr-2" />
              저장하기
            </GradientButton>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
