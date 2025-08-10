'use client'

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { MainLayout } from "@/components/layout/main-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { User, Calendar, Eye } from "lucide-react";
import EditDeleteButtons from "./components/EditDeleteButtons";
import { useRouter } from "next/navigation";

// Lexical Editor Viewer (읽기 전용)
const Editor = dynamic(() => import("../announcements-write/components/Editor"), { ssr: false });

export default function AnnouncementDetailPage() {
  const router = useRouter();
  // const { id } = router.query; // /announcements-detail/[id] 라우팅 가정
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // if (!id) return;
    // setLoading(true);
    // setError("");
    // // 실제 API 주소로 변경 필요
    // fetch(`/api/announcements/${id}`)
    //   .then(res => {
    //     if (!res.ok) throw new Error("데이터를 불러오지 못했습니다.");
    //     return res.json();
    //   })
    //   .then(setData)
    //   .catch(e => setError(e.message))
    //   .finally(() => setLoading(false));
    //
    // 위 API 호출 대신 로컬 JSON 파일에서 데이터 불러오기
    setLoading(true);
    setError("");
    import("./announcements.json")
      .then((mod) => {
        if (!mod || !mod.data) throw new Error("데이터가 없습니다.");
        setData(mod.data);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleBack = () => {
    if (typeof window !== "undefined") window.history.back();
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh] text-gray-500 text-lg">불러오는 중...</div>
      </MainLayout>
    );
  }
  if (error || !data) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh] text-red-500 text-lg">{error || "데이터가 없습니다."}</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex justify-center items-start min-h-[80vh]">
        <GlassCard className="w-full max-w-6xl min-h-[70vh] mx-auto p-12 shadow-2xl bg-white/70 backdrop-blur-lg border border-blue-100">
          {/* 메타 정보 */}
          <div className="mb-8 pb-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900 mb-2">{data.title}</h1>
              <div className="flex flex-wrap gap-6 text-gray-500 text-base font-medium">
                <span className="flex items-center gap-1"><User className="w-4 h-4 mr-1" />{data.displayAuthor}</span>
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4 mr-1" />{data.createdAt}</span>
                <span className="flex items-center gap-1"><Eye className="w-4 h-4 mr-1" />{data.view}</span>
              </div>
            </div>
            <EditDeleteButtons
              onEdit={() => router.push(`/announcements-write`)}
              onDelete={() => alert('삭제가 완료되었습니다.')}
            />
          </div>
          {/* 본문 (lexical editor json 파싱) */}
          <div className="mb-10">
            <Editor jsonData={JSON.stringify(data.content)} onChange={() => {}} readOnly={true} showToolbar={false} />
          </div>
          {/* 첨부파일 다운로드 */}
          {data.attachment && (
            <div className="mt-8 border-t pt-6">
              <div className="font-semibold mb-2 text-gray-7ㄴ00">첨부파일</div>
              <a
                href={data.attachment.url}
                download
                className="flex items-center gap-2 p-4 border rounded bg-gray-50 hover:bg-blue-50 transition w-fit shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m0 0l-6-6m6 6l6-6" />
                </svg>
                <span className="font-medium">{data.attachment.name}</span>
                <span className="text-xs text-gray-400 ml-2">{data.attachment.size}</span>
              </a>
            </div>
          )}
          {/* 하단 버튼 */}
          <div className="flex justify-between mt-12">
            <button onClick={handleBack} className="px-6 py-2 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition font-semibold shadow">뒤로가기</button>
            <div className="flex gap-2">
              <button className="px-6 py-2 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition font-semibold shadow">이전글</button>
              <button className="px-6 py-2 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition font-semibold shadow">다음글</button>
            </div>
          </div>
        </GlassCard>
      </div>
    </MainLayout>
  );
}
