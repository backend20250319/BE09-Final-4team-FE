import React, { useRef } from "react";
import { X, UploadCloud } from "lucide-react";

export default function FileUploadBox({ attachments = [], onFileChange, onRemoveFile }) {
  const fileInputRef = useRef(null);

  const handleBoxClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  return (
    <div className="mb-8">
      <label className="block mb-2 text-gray-700 font-semibold">첨부파일</label>
      <div
        className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition relative min-w-[260px]"
        onClick={handleBoxClick}
      >
        <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
        <span className="text-gray-500">클릭하여 파일을 업로드하세요</span>
        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileChange}
          className="hidden"
          multiple
        />
      </div>
      {/* 파일 리스트 */}
      {attachments.length > 0 && (
        <div className="mt-4 space-y-2 w-full">
          {attachments.map((file, idx) => (
            <div key={file.name + file.size + idx} className="relative w-fit">
              <div className="flex items-center gap-2 p-4 border rounded bg-gray-50 w-fit pr-10">
                <span className="font-medium">{file.name}</span>
                <span className="text-xs text-gray-400 ml-2">{(file.size / 1024).toFixed(1)}KB</span>
              </div>
              <button
                type="button"
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 transition text-gray-400 hover:text-red-500"
                onClick={e => { e.stopPropagation(); onRemoveFile(idx); }}
                aria-label="첨부파일 삭제"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
