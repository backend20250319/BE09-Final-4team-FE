'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { GradientButton } from '@/components/ui/gradient-button';
import { FileText, ArrowLeft, Upload, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AttachmentsManager } from '@/components/ui/attachments-manager';

export default function DocumentUploadPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState([]);

  const handleUpload = () => {
    if (!title.trim()) {
      alert('문서 제목을 입력해주세요.');
      return;
    }
    if (!description.trim()) {
      alert('문서 설명을 입력해주세요.');
      return;
    }
    if (attachments.length === 0) {
      alert('첨부문서를 하나 이상 업로드해주세요.');
      return;
    }

    // 업로드 로직 구현
    alert('문서가 업로드되었습니다.');
    router.push('/documents');
  };

  const handleCancel = () => {
    router.push('/documents');
  };

  return (
    <MainLayout>
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">문서 업로드</h1>
            <p className="text-gray-600">새로운 문서를 업로드하세요</p>
          </div>
        </div>

        {/* 업로드 폼 */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          {/* 제목 입력 */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              문서 제목
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="문서 제목을 입력하세요"
              className="h-12 text-lg"
            />
          </div>

          {/* 설명 입력 */}
          <div className="mb-6">
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                문서 설명
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="문서에 대한 상세한 설명을 입력하세요"
                className="min-h-32 text-base resize-none"
              />
            </div>
          </div>

          {/* 첨부파일 관리 */}
          <div className="mb-8">
            <AttachmentsManager
              attachments={attachments}
              onAttachmentsChange={setAttachments}
              maxFiles={10}
              maxFileSize={50}
            />
          </div>

          {/* 취소/업로드 버튼 */}
          <div className="flex gap-3 justify-end pt-6 border-t border-gray-200">
            <button
              onClick={handleCancel}
              className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              취소
            </button>
            <GradientButton
              onClick={handleUpload}
              variant="primary"
              className="px-6 py-3"
            >
              <Upload className="w-4 h-4 mr-2" />
              업로드
            </GradientButton>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
