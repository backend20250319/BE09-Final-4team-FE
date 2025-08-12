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
  Calendar,
  User,
  Building,
  CreditCard,
  Car,
  Home,
  Briefcase,
} from "lucide-react"
import { FormTemplate, formTemplates } from "@/lib/mock-data/form-templates"

// 카테고리 정의
const categories = [
  { id: "all", name: "전체", icon: FileText },
  { id: "hr", name: "인사", icon: User },
  { id: "finance", name: "재무", icon: CreditCard },
  { id: "admin", name: "행정", icon: Building },
  { id: "business", name: "업무", icon: Briefcase },
  { id: "travel", name: "출장", icon: Car },
  { id: "leave", name: "휴가", icon: Calendar },
  { id: "facility", name: "시설", icon: Home },
]

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
              {categories.map((category) => {
                const IconComponent = category.icon
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="flex items-center gap-2 whitespace-nowrap flex-shrink-0"
                  >
                    <IconComponent className="w-4 h-4" />
                    {category.name}
                  </Button>
                )
              })}
            </div>
          </div>

          {/* 양식 목록 */}
          <div className="flex-1 overflow-y-auto px-6 pb-6 min-h-0">
            {filteredForms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredForms.map((form) => {
                  const IconComponent = form.icon
                  return (
                    <GlassCard
                      key={form.id}
                      className="p-4 hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-blue-200"
                      onClick={() => handleFormSelect(form)}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${form.color} rounded-lg flex items-center justify-center shadow-sm flex-shrink-0`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className={`${typography.h4} text-gray-800 truncate`}>
                              {form.title}
                            </h3>
                            <Badge variant="secondary" className="text-xs">
                              {form.estimatedTime}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {form.description}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {form.fields.slice(0, 3).map((field, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {field}
                              </Badge>
                            ))}
                            {form.fields.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{form.fields.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  )
                })}
              </div>
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
