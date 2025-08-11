"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { typography } from "@/lib/design-tokens";
import { AttachmentsManager, Attachment } from "@/components/ui/attachments-manager";

export default function DocumentsUploadPage() {
  const router = useRouter();
  const [attachments, setAttachments] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (attachments.length === 0) {
      alert("업로드할 파일을 선택하세요.");
      return;
    }
    // TODO: 실제 업로드 API 연동
    alert(`'${attachments.map(f => f.name).join(", ")}' 업로드 완료! (API 연동 필요)`);
    router.push("/documents");
  };

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className={`${typography.h1} text-gray-800`}>문서 업로드</h1>
        <p className="text-gray-600">회사 문서를 업로드하세요. (PDF, DOCX 등 지원)</p>
      </div>
      <GlassCard className="p-8 max-w-xl mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <label className="block mb-2 text-gray-700 font-semibold">문서 파일</label>
            <AttachmentsManager
              attachments={attachments}
              onAttachmentsChange={setAttachments}
              maxFiles={5}
              maxFileSize={20}
            />
          </div>
          <div className="flex justify-end">
            <GradientButton type="submit" variant="primary">
              업로드
            </GradientButton>
          </div>
        </form>
      </GlassCard>
    </MainLayout>
  );
}
