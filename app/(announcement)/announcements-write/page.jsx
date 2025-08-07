"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { Input } from "@/components/ui/input";
import { colors, typography } from "@/lib/design-tokens";
import dynamic from "next/dynamic";

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: API 연동
    alert("게시 완료 (API 연동 필요)");
    // router.push("/announcements");
  };


  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className={`${typography.h1} text-gray-800`}>공지사항 작성</h1>
        <p className="text-gray-600">새로운 공지사항을 작성하고 게시하세요.</p>
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
            <label className="block mb-2 text-gray-700 font-semibold props">내용</label>
            <Editor json={null}/>
          </div>
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
                게시하기
              </GradientButton>
            </div>
          </div>
        </form>
      </GlassCard>
    </MainLayout>
  );
}
