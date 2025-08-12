"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GlassCard } from "@/components/ui/glass-card"
import { colors, typography } from "@/lib/design-tokens"
import {
  Search,
  FileText,
} from "lucide-react"
import { FormTemplate, formTemplates, categories } from "@/lib/mock-data/form-templates"
import { FormTemplatesGrid } from "./form-templates-grid"

interface FormSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectForm: (form: FormTemplate) => void
}

export function FormSelectionModal({
  isOpen,
  onClose,
  onSelectForm,
}: FormSelectionModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // 필터링된 양식 목록
  const filteredForms = formTemplates.filter((form) => {
    const matchesSearch = form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         form.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || form.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleFormSelect = (form: FormTemplate) => {
    onSelectForm(form)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-4xl !w-[95vw] h-[80vh] flex flex-col p-0">
        <DialogHeader className="pb-4 px-6 pt-6 flex-shrink-0">
          <DialogTitle className={`${typography.h2} text-gray-800`}>
            문서 양식 선택
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          {/* 검색 및 필터 */}
          <div className="px-6 pb-4 flex-shrink-0">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="양식명 또는 설명으로 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/60 backdrop-blur-sm border-gray-200/50 rounded-xl"
              />
            </div>

            {/* 카테고리 필터 */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="whitespace-nowrap flex-shrink-0"
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          {/* 양식 목록 */}
          <div className="flex-1 overflow-y-auto px-6 pb-6 min-h-0">
            {filteredForms.length > 0 ? (
              <FormTemplatesGrid
                forms={filteredForms}
                onCardClick={handleFormSelect}
                getCategoryName={(id) => categories.find(cat => cat.id === id)?.name}
              />
            ) : (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {searchTerm || selectedCategory !== "all" 
                    ? "검색 조건에 맞는 양식이 없습니다." 
                    : "사용 가능한 양식이 없습니다."}
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
