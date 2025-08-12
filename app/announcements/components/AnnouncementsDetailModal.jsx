'use client';

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { User, Calendar, Eye, Edit, Trash2 } from "lucide-react";
import { AttachmentsSection } from "@/components/ui/attachments-section";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// Lexical Editor Viewer (읽기 전용)
const Editor = dynamic(() => import("../write/components/Editor"), { ssr: false });

export default function AnnouncementsDetailModal({
  isOpen,
  announcement,
  onClose,
  onEdit,
  onDelete
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!announcement) return;

    setLoading(true);
    setError("");

    // 더미 데이터 사용 (실제로는 API 호출)
    const mockData = {
      title: announcement.title,
      displayAuthor: announcement.displayAuthor,
      createdAt: announcement.createdAt,
      view: announcement.views,
      content: announcement.content,
      attachment: announcement.attachment
    };

    setData(mockData);
    setLoading(false);
  }, [announcement]);

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto">
          <div className="text-center text-gray-500 text-lg py-8">불러오는 중...</div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error || !data) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto">
          <div className="text-center text-red-500 text-lg py-8">{error || "데이터가 없습니다."}</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-left text-2xl font-bold text-gray-800 mb-3">
            {data.title}
          </DialogTitle>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {data.displayAuthor}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {data.createdAt}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {data.view}
            </span>
          </div>
        </DialogHeader>

        {/* 본문 내용 */}
        <div className="mb-6">
          <Editor
            jsonData={JSON.stringify(data.content)}
            onChange={() => { }}
            readOnly={true}
            showToolbar={false}
          />
        </div>

        {/* 첨부파일 */}
        {data.attachment && (
          <div className="pt-4 border-t border-gray-200">
            <h3 className="font-semibold mb-3 text-gray-700">첨부파일</h3>
            <AttachmentsSection
              attachments={[{
                id: data.attachment.id || data.attachment.name,
                name: data.attachment.name,
                size: data.attachment.size ? `${data.attachment.size}` : "",
                url: data.attachment.url
              }]}
            />
          </div>
        )}

        {/* 하단 버튼 */}
        <DialogFooter className="flex justify-between mt-8 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition font-semibold shadow cursor-pointer"
          >
            닫기
          </button>
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="px-6 py-2 rounded bg-blue-100 text-blue-600 hover:bg-blue-200 transition font-semibold shadow cursor-pointer flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              수정
            </button>
            <button
              onClick={onDelete}
              className="px-6 py-2 rounded bg-red-100 text-red-600 hover:bg-red-200 transition font-semibold shadow cursor-pointer flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              삭제
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}