'use client'

import { useState } from 'react'
import { Upload, FileText, Eye, Download, Trash2 } from 'lucide-react'
import { Button } from './button'

export interface Attachment {
  id: string
  name: string
  size?: string
  url?: string
}

interface AttachmentsManagerProps {
  attachments: Attachment[]
  onAttachmentsChange: (attachments: Attachment[]) => void
  maxFiles?: number
  maxFileSize?: number // MB 단위
  className?: string
}

export function AttachmentsManager({
  attachments,
  onAttachmentsChange,
  maxFiles = 10,
  maxFileSize = 10,
  className = ''
}: AttachmentsManagerProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    // 파일 개수 제한 확인
    if (attachments.length + files.length > maxFiles) {
      alert(`최대 ${maxFiles}개의 파일만 업로드할 수 있습니다.`)
      return
    }

    // 파일 크기 제한 확인
    const oversizedFiles = Array.from(files).filter(file => file.size > maxFileSize * 1024 * 1024)
    if (oversizedFiles.length > 0) {
      alert(`파일 크기는 ${maxFileSize}MB를 초과할 수 없습니다.`)
      return
    }

    const newAttachments: Attachment[] = Array.from(files).map((file, index) => ({
      id: `file-${Date.now()}-${index}`,
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      url: URL.createObjectURL(file)
    }))

    onAttachmentsChange([...attachments, ...newAttachments])
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(false)
    
    const files = event.dataTransfer.files
    if (!files) return

    // 파일 개수 제한 확인
    if (attachments.length + files.length > maxFiles) {
      alert(`최대 ${maxFiles}개의 파일만 업로드할 수 있습니다.`)
      return
    }

    // 파일 크기 제한 확인
    const oversizedFiles = Array.from(files).filter(file => file.size > maxFileSize * 1024 * 1024)
    if (oversizedFiles.length > 0) {
      alert(`파일 크기는 ${maxFileSize}MB를 초과할 수 없습니다.`)
      return
    }

    const newAttachments: Attachment[] = Array.from(files).map((file, index) => ({
      id: `file-${Date.now()}-${index}`,
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      url: URL.createObjectURL(file)
    }))

    onAttachmentsChange([...attachments, ...newAttachments])
  }

  const removeAttachment = (attachmentId: string) => {
    onAttachmentsChange(attachments.filter(attachment => attachment.id !== attachmentId))
  }

  const handlePreview = (attachment: Attachment) => {
    if (attachment.url) {
      window.open(attachment.url, '_blank')
    }
  }

  const handleDownload = (attachment: Attachment) => {
    if (attachment.url) {
      const link = document.createElement('a')
      link.href = attachment.url
      link.download = attachment.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <input
        type="file"
        multiple
        onChange={handleFileUpload}
        className="hidden"
        id="file-upload"
      />
      
      {attachments.length === 0 ? (
        /* 파일이 없을 때: 드래그 앤 드롭 영역 */
        <div 
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragOver 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-blue-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className={`w-8 h-8 mx-auto mb-2 ${
              isDragOver ? 'text-blue-500' : 'text-gray-400'
            }`} />
            <p className={`text-sm ${
              isDragOver ? 'text-blue-600' : 'text-gray-600'
            }`}>
              {isDragOver ? '파일을 여기에 놓으세요' : '파일을 선택하거나 여기로 드래그하세요'}
            </p>
            <p className="text-xs text-gray-500 mt-1">최대 {maxFiles}개 파일, 각 파일 최대 {maxFileSize}MB</p>
          </label>
        </div>
      ) : (
        /* 파일이 있을 때: 컴팩트한 파일 목록과 드래그 앤 드롭 영역 */
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">첨부파일 ({attachments.length}개)</h4>
          </div>
          
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {attachments.map((attachment) => (
              <div key={attachment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-800 truncate">{attachment.name}</p>
                    {attachment.size && <p className="text-xs text-gray-500">{attachment.size}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => handlePreview(attachment)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => handleDownload(attachment)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAttachment(attachment.id)}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {/* 추가 파일을 위한 드래그 앤 드롭 영역 */}
          {attachments.length < maxFiles && (
            <div 
              className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                isDragOver 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-blue-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className={`w-6 h-6 mx-auto mb-1 ${
                  isDragOver ? 'text-blue-500' : 'text-gray-400'
                }`} />
                <p className={`text-xs ${
                  isDragOver ? 'text-blue-600' : 'text-gray-600'
                }`}>
                  {isDragOver ? '파일을 여기에 놓으세요' : '추가 파일을 드래그하거나 클릭하세요'}
                </p>
              </label>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
