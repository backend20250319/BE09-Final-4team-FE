"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { Input } from "@/components/ui/input";
import dynamic from "next/dynamic";
import dataJson from "../announcements-detail/announcements.json";
import { X } from "lucide-react";

const Editor = dynamic(() => import("../announcements-write/components/Editor"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center p-8 gap-2">
      <div className="w-5 h-5 border-2 border-gray-100 border-t-blue-500 rounded-full animate-spin"></div>
      <span>에디터 로딩 중...</span>
    </div>
  ),
});

export default function AnnouncementEditPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [attachment, setAttachment] = useState(null);

  useEffect(() => {
    if (dataJson && dataJson.data) {
      setTitle(dataJson.data.title || "");
      setAuthor(dataJson.data.displayAuthor || "");
      setContent(JSON.stringify(dataJson.data.content || ""));
      setAttachment(dataJson.data.attachment || null);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: API 연동
    console.log("제목:", title);
    console.log("작성자:", author);
    console.log("본문(JSON):", content);
    alert("공지사항이 수정되었습니다.");
    router.push("/announcements");
  };

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">공지사항 수정</h1>
        <p className="text-gray-600">공지사항 내용을 수정하고 저장하세요.</p>
      </div>
      <GlassCard className="p-8 max-w-4xl mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block mb-2 text-gray-700 font-semibold">제목</label>
              <Input
                placeholder="공지사항 제목을 입력하세요"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-gray-700 font-semibold">작성자</label>
              <Input
                placeholder="작성자를 입력하세요"
                value={author}
                onChange={e => setAuthor(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-8">
            <label className="block mb-2 text-gray-700 font-semibold">내용</label>
            <Editor jsonData={content} onChange={setContent} />
          </div>
          {attachment && (
            <div className="mb-8">
              <label className="block mb-2 text-gray-700 font-semibold">첨부파일</label>
              <div className="relative w-fit">
                <a
                  href={attachment.url}
                  download
                  className="flex items-center gap-2 p-4 border rounded bg-gray-50 hover:bg-blue-50 transition w-fit shadow-sm pr-10"
                >
                  <span className="font-medium">{attachment.name}</span>
                  <span className="text-xs text-gray-400 ml-2">{attachment.size}</span>
                </a>
                <button
                  type="button"
                  className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 transition text-gray-400 hover:text-red-500"
                  onClick={() => setAttachment(null)}
                  aria-label="첨부파일 삭제"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
          <div className="flex justify-between items-center mt-8">
            <button
              type="button"
              className="px-6 py-2 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
              onClick={() => router.back()}
            >
              취소
            </button>
            <div className="flex gap-2">
              <GradientButton type="submit" variant="primary">
                저장하기
              </GradientButton>
            </div>
          </div>
        </form>
      </GlassCard>
    </MainLayout>
  );
}
