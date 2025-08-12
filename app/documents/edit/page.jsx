'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { GradientButton } from '@/components/ui/gradient-button';
import { FileText, ArrowLeft, Save, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AttachmentsManager } from '@/components/ui/attachments-manager';

export default function DocumentEditPage() {
  const router = useRouter();
  const [title, setTitle] = useState('2025년 신입사원 온보딩 가이드');
  const [description, setDescription] = useState('신입사원이 회사 문화와 업무 프로세스를 빠르게 이해할 수 있도록 제작된 교육 자료입니다. 회사 소개, 조직 문화, 기본 업무 가이드라인, 필수 시스템 사용법 등을 포함하고 있습니다. 신입사원 온보딩 필수 문서이며, 교육 기간 동안의 강의 자료와 실습 가이드를 담고 있습니다.');
  const [attachments, setAttachments] = useState([
    { id: '1', name: '2025_하반기_인사발령_명단.pdf', size: '1.2 MB', url: '/2025_하반기_인사발령_명단.pdf' },
    { id: '2', name: '2025_신입사원_온보딩_가이드.pdf', size: '1.4 MB', url: '/2025_신입사원_온보딩_가이드.pdf' }
  ]);

  const handleSave = () => {
    // 저장 로직 구현
    alert('문서가 수정되었습니다.');
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
            <h1 className="text-3xl font-bold text-gray-800">문서 수정</h1>
            <p className="text-gray-600">문서 정보를 수정하고 저장하세요</p>
          </div>
        </div>

        {/* 수정 폼 */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          {/* 제목 입력 */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              제목
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

          {/* 취소/저장 버튼 */}
          <div className="flex gap-3 justify-end pt-6 border-t border-gray-200">
            <button
              onClick={handleCancel}
              className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              취소
            </button>
            <GradientButton
              onClick={handleSave}
              variant="primary"
              className="px-6 py-3"
            >
              <Save className="w-4 h-4 mr-2" />
              저장
            </GradientButton>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
