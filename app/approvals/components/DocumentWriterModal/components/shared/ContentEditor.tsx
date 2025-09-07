"use client"

import { memo } from "react"
import { Textarea } from "@/components/ui/textarea"

interface ContentEditorProps {
  content: string
  setContent: (content: string) => void
  isMobile?: boolean
  placeholder?: string
}

const ContentEditorComponent = ({
  content,
  setContent,
  isMobile = false,
  placeholder = "내용을 입력하세요"
}: ContentEditorProps) => {
  return (
    <div className="space-y-2 flex-1 flex flex-col min-h-0">
      <Textarea
        placeholder={placeholder}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className={
          isMobile 
            ? "min-h-[200px] resize-none"
            : "flex-1 min-h-0 resize-none overflow-y-auto"
        }
      />
    </div>
  )
}

export const ContentEditor = memo(ContentEditorComponent)