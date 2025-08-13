import React from "react";
import { Textarea } from "@/components/ui/textarea";

interface IntroBlockProps {
  intro?: string;
}

export default function IntroBlock({ 
  intro
}: IntroBlockProps) {
  return (
    <div className="text-gray-700 text-sm leading-relaxed min-h-[60px]">
      {intro || "자기소개가 없습니다."}
    </div>
  );
}
