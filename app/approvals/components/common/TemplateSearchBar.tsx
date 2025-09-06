"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface TemplateSearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function TemplateSearchBar({ 
  value, 
  onChange, 
  placeholder = "양식명 또는 설명으로 검색",
  className = ""
}: TemplateSearchBarProps) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 bg-white/60 backdrop-blur-sm border-gray-200/50 rounded-xl"
      />
    </div>
  )
}