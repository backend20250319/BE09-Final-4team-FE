import React from "react";
import { Textarea } from "@/components/ui/textarea";

interface IntroBlockProps {
  intro?: string;
  isEditing: boolean;
  onChange?: (val: string) => void;
}

export default function IntroBlock({ 
  intro, 
  isEditing, 
  onChange
}: IntroBlockProps) {
  return (
    <div>
      {!isEditing ? (
        <div className="text-gray-700 text-sm leading-relaxed min-h-[60px]">
          {intro || "자기소개가 없습니다."}
        </div>
      ) : (
        <Textarea
          value={intro ?? ""}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder="자기소개를 입력하세요..."
          className="min-h-[120px] bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      )}
    </div>
  );
}
