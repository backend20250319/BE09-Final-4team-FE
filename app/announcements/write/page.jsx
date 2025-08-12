"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { Input } from "@/components/ui/input";
import { colors, typography } from "@/lib/design-tokens";
import dynamic from "next/dynamic";
import { X, UploadCloud, ArrowLeft } from "lucide-react";
import { AttachmentsManager, Attachment } from "@/components/ui/attachments-manager";

const Editor = dynamic(() => import("./components/Editor"), {
  ssr: false,
  loading: () =>
    <div className="flex items-center justify-center p-8 gap-2">
      <div className="w-5 h-5 border-2 border-gray-100 border-t-blue-500 rounded-full animate-spin"></div>
      <span>에디터 로딩 중...</span>
    </div>
});

export default function NoticeWritePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(prev => [...prev, ...files]);
  };

  const handleRemoveFile = (idx) => {
    setAttachments(prev => prev.filter((_, i) => i !== idx));
  };

  const handleBoxClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: API 연동
    console.log("제목:", title);
    console.log("작성자:", author);
    console.log("내용(JSON):", content);
    if (attachments.length > 0) {
      console.log("첨부파일:", attachments.map(f => f.name));
    }
    alert("공지사항이 게시되었습니다.");
    router.push("/announcements");
  };

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
            <h1 className={`${typography.h1} text-gray-800`}>공지사항 작성</h1>
            <p className="text-gray-600">새로운 공지사항을 작성하고 게시하세요.</p>
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
            <Editor json={null} onChange={setContent} />
          </div>

          {/* 파일 업로드 */}
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
              <UploadCloud className="w-4 h-4 mr-2" />
              게시하기
            </GradientButton>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
