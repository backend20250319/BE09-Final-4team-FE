"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { typography } from "@/lib/design-tokens";

export default function DocumentsUploadPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      alert("업로드할 파일을 선택하세요.");
      return;
    }
    // TODO: 실제 업로드 API 연동
    alert(`'${file.name}' 업로드 완료! (API 연동 필요)`);
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
            <input
              type="file"
              ref={fileInputRef}
              className="block w-full border border-gray-300 rounded-lg p-2 bg-white/80"
              accept=".pdf,.doc,.docx,.hwp,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
              required
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
