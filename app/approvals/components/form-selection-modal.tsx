"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { colors, typography } from "@/lib/design-tokens"
import { FileText } from "lucide-react"
import { TemplateSummaryResponse } from "@/lib/services/approval/types"
import { FormTemplatesGrid } from "./form-templates-grid"
import { TemplateSearchBar } from "./common/TemplateSearchBar"
import { CategoryFilterButtons } from "./common/CategoryFilterButtons"
import { useTemplateFiltering } from "@/lib/hooks/useTemplateFiltering"

interface FormSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectForm: (form: TemplateSummaryResponse) => void
}

export function FormSelectionModal({
  isOpen,
  onClose,
  onSelectForm,
}: FormSelectionModalProps) {
  // 커스텀 훅 사용
  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    allTemplates,
    filteredTemplates: filteredForms,
    categoriesData,
    isLoading,
    error
  } = useTemplateFiltering()

  const handleFormSelect = (form: TemplateSummaryResponse) => {
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
          {/* 로딩 및 에러 처리 */}
          {isLoading && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-gray-500">템플릿을 불러오고 있습니다...</div>
            </div>
          )}
          
          {error && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-red-500">템플릿을 불러오는 중 오류가 발생했습니다.</div>
            </div>
          )}

          {!isLoading && !error && (
            <>
              {/* 검색 및 필터 */}
              <div className="px-6 pb-4 flex-shrink-0">
                {/* 검색바 */}
                <TemplateSearchBar
                  value={searchTerm}
                  onChange={setSearchTerm}
                  className="mb-4"
                />

                {/* 카테고리 필터 버튼 */}
                <CategoryFilterButtons
                  categories={categoriesData}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  className="overflow-x-auto pb-2"
                />
              </div>

              {/* 양식 목록 */}
              <div className="flex-1 overflow-y-auto px-6 pb-6 min-h-0">
                {filteredForms.length > 0 ? (
                  <FormTemplatesGrid
                    forms={filteredForms}
                    onCardClick={handleFormSelect}
                  />
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      {searchTerm || selectedCategory !== null 
                        ? "검색 조건에 맞는 양식이 없습니다." 
                        : "사용 가능한 양식이 없습니다."}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
