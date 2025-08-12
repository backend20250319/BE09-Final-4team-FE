'use client';

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { User, Calendar, Eye, Edit, Trash2, MessageSquare, Send } from "lucide-react";
import { AttachmentsSection } from "@/components/ui/attachments-section";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

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
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);

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

    // 더미 댓글 데이터
    const mockComments = [
      {
        id: 1,
        author: "김철수",
        content: "인사발령 내용 잘 확인했습니다. 감사합니다.",
        createdAt: "2025-07-15 14:30",
        avatar: "/placeholder-user.jpg"
      },
      {
        id: 2,
        author: "이영희",
        content: "새로운 조직도 함께 공유해주시면 더 좋겠습니다.",
        createdAt: "2025-07-15 15:45",
        avatar: "/placeholder-user.jpg"
      },
      {
        id: 3,
        author: "박민수",
        content: "인사팀 담당자께서 상세 설명 부탁드립니다.",
        createdAt: "2025-07-15 16:20",
        avatar: "/placeholder-user.jpg"
      }
    ];

    setData(mockData);
    setComments(mockComments);
    setLoading(false);
  }, [announcement]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const newCommentObj = {
      id: comments.length + 1,
      author: "현재 사용자",
      content: newComment,
      createdAt: new Date().toLocaleString('ko-KR'),
      avatar: "/placeholder-user.jpg"
    };

    setComments(prev => [newCommentObj, ...prev]);
    setNewComment("");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  if (!isOpen) return null;

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
            <span className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              {comments.length}
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
          <div className="pt-4 border-t border-gray-200 mb-6">
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

        {/* 댓글 섹션 */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="font-semibold mb-4 text-gray-700 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            댓글 ({comments.length})
          </h3>

          {/* 댓글 작성 */}
          <div className="mb-6">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
              <div className="flex-1">
                <Input
                  placeholder="댓글을 입력하세요..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="mb-2"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    댓글 작성
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 댓글 목록 */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-800">{comment.author}</span>
                    <span className="text-sm text-gray-500">{comment.createdAt}</span>
                  </div>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

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