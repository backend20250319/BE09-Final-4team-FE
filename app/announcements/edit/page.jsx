"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { Input } from "@/components/ui/input";
import dynamic from "next/dynamic";
import dataJson from "../detail/announcements.json";
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

export default function AnnouncementEditPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (dataJson && dataJson.data) {
      setTitle(dataJson.data.title || "");
      setAuthor(dataJson.data.displayAuthor || "");
      setContent(JSON.stringify(dataJson.data.content || ""));
      if (dataJson.data.attachment) {
        setAttachments([
          {
            name: dataJson.data.attachment.name,
            size: parseFloat(dataJson.data.attachment.size) * 1024 || 0,
            url: dataJson.data.attachment.url,
          },
        ]);
      }
    }
  }, []);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(prev => [...prev, ...files]);
  };

  const handleRemoveFile = (idx) => {
    setAttachments(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: API 연동
    console.log("제목:", title);
    console.log("작성자:", author);
    console.log("본문(JSON):", content);
    alert("공지사항이 수정되었습니다.");
    router.push("/announcements/detail");
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
          <AttachmentsManager
            attachments={attachments}
            onAttachmentsChange={setAttachments}
          />
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
