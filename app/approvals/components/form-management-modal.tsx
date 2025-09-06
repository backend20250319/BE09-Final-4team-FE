"use client"

import { useMemo, useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { FormTemplatesGrid } from "./form-templates-grid"
import { FormEditorModal } from "./form-editor-modal"
import { colors, typography } from "@/lib/design-tokens"
import { 
  TemplateSummaryResponse, 
  CategoryResponse,
  CreateTemplateRequest,
  UpdateTemplateRequest,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  BulkCategoryRequest,
  BulkCategoryOperationType
} from "@/lib/services/approval/types"
import {
  useTemplatesByCategory,
  useCreateTemplate,
  useUpdateTemplate,
  useDeleteTemplate,
  useUpdateTemplateVisibility,
  useCategories,
  useBulkProcessCategories
} from "@/lib/hooks/useApproval"
import { MoreVertical, Search, FolderPlus, Edit, Copy, Trash2, Settings, FileText, Plus, X, GripVertical } from "lucide-react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'


interface FormManagementModalProps {
  isOpen: boolean
  onClose: () => void
  onOpenFormEditor?: (form: TemplateSummaryResponse | null) => void // null: 새 양식
}

// 드래그 가능한 카테고리 아이템 컴포넌트
interface SortableCategoryItemProps {
  category: CategoryResponse
  onRename: (categoryId: number, newName: string) => void
  onRemove: (categoryId: number) => void
}

function SortableCategoryItem({ category, onRename, onRemove }: SortableCategoryItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 999 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-1 bg-gray-50 rounded-lg p-2 transition-all duration-200 ${
        isDragging 
          ? 'shadow-2xl border border-blue-200 bg-white scale-105' 
          : 'hover:bg-gray-100 border border-transparent'
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab hover:cursor-grabbing p-1 rounded hover:bg-gray-200 transition-colors"
      >
        <GripVertical className="w-3 h-3 text-gray-400" />
      </div>
      <Input
        className="text-sm w-20 h-7 px-2 bg-white"
        value={category.name}
        onChange={(e) => onRename(category.id, e.target.value)}
      />
      <Button
        variant="ghost"
        size="icon"
        className="w-6 h-6 text-red-500 hover:text-red-700 hover:bg-red-50"
        onClick={() => onRemove(category.id)}
      >
        <X className="w-3 h-3" />
      </Button>
    </div>
  )
}

export function FormManagementModal({ isOpen, onClose, onOpenFormEditor }: FormManagementModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [isEditingCategories, setIsEditingCategories] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [isFormEditorOpen, setIsFormEditorOpen] = useState(false)
  const [editingForm, setEditingForm] = useState<TemplateSummaryResponse | null>(null)
  
  // API 데이터 가져오기
  const { data: templatesByCategory = [], isLoading: templatesLoading } = useTemplatesByCategory()
  const { data: categoriesData = [], isLoading: categoriesLoading } = useCategories()
  
  // 카테고리 편집 상태 관리
  const [localCategories, setLocalCategories] = useState<CategoryResponse[]>([])
  const [categoryOperations, setCategoryOperations] = useState<any[]>([])
  
  // 카테고리 벌크 작업 mutation
  const bulkProcessMutation = useBulkProcessCategories()
  
  // 템플릿 관련 mutations
  const createTemplateMutation = useCreateTemplate()
  const updateTemplateMutation = useUpdateTemplate()
  const deleteTemplateMutation = useDeleteTemplate()
  const updateVisibilityMutation = useUpdateTemplateVisibility()
  
  // 모든 템플릿을 평평한 배열로 변환
  const allTemplates: TemplateSummaryResponse[] = templatesByCategory.flatMap(category => 
    category.templates
  )
  
  // 카테고리 목록 (순수 API 데이터만)
  const categories = isEditingCategories ? localCategories : categoriesData
  
  // 로컬 카테고리 상태 초기화 (카테고리 편집 모드 진입 시)
  useEffect(() => {
    if (isEditingCategories && localCategories.length === 0) {
      setLocalCategories([...categoriesData])
    }
  }, [isEditingCategories, categoriesData, localCategories.length])

  // 드래그 앤 드롭 센서 설정
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // 드래그 중 실시간 순서 변경 핸들러
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event

    if (!over) return

    if (active.id !== over.id) {
      setLocalCategories((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  // 드래그 완료 핸들러
  const handleDragEnd = (event: DragEndEvent) => {
    // 드래그가 완료되면 sortOrder 업데이트
    setLocalCategories(prev => 
      prev.map((cat, index) => ({ ...cat, sortOrder: index + 1 }))
    )
  }

  const filteredForms = useMemo(() => {
    return allTemplates.filter((form) => {
      const matchesSearch = form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (form.description || '').toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = 
        selectedCategory === null ||  // null이면 전체 선택
        form.category?.id === selectedCategory ||
        (selectedCategory === -1 && !form.category)  // -1이면 분류 미지정
      
      return matchesSearch && matchesCategory && !form.isHidden
    })
  }, [allTemplates, searchTerm, selectedCategory])

  const handleNewForm = () => {
    setEditingForm(null)
    setIsFormEditorOpen(true)
  }

  const handleEditForm = (form: FormTemplate) => {
    setEditingForm(form)
    setIsFormEditorOpen(true)
  }

  // 임시로 FormEditorModal 지원을 위한 함수 (나중에 제거)
  const handleFormSave = (savedForm: any) => {
    // FormEditorModal이 API 연동될 때까지 임시로 빈 함수
    console.warn('FormEditorModal API 연동 필요')
    setIsFormEditorOpen(false)
    setEditingForm(null)
  }

  const handleDuplicate = async (form: TemplateSummaryResponse) => {
    try {
      const duplicateRequest: CreateTemplateRequest = {
        title: `${form.title} (복제)`,
        icon: form.icon,
        color: form.color,
        description: form.description,
        useBody: form.useBody,
        useAttachment: form.useAttachment,
        allowTargetChange: form.allowTargetChange,
        categoryId: form.category?.id
      }
      await createTemplateMutation.mutateAsync(duplicateRequest)
    } catch (error) {
      console.error('템플릿 복제 실패:', error)
    }
  }

  const handleDelete = async (form: TemplateSummaryResponse) => {
    try {
      await deleteTemplateMutation.mutateAsync(form.id)
    } catch (error) {
      console.error('템플릿 삭제 실패:', error)
    }
  }

  const handleToggleHidden = async (form: TemplateSummaryResponse, hidden: boolean) => {
    try {
      await updateVisibilityMutation.mutateAsync({ id: form.id, isHidden: hidden })
    } catch (error) {
      console.error('템플릿 공개 설정 실패:', error)
    }
  }

  const handleChangeCategory = async (form: TemplateSummaryResponse, categoryId: number) => {
    try {
      const updateRequest: UpdateTemplateRequest = {
        title: form.title,
        icon: form.icon,
        color: form.color,
        description: form.description,
        useBody: form.useBody,
        useAttachment: form.useAttachment,
        allowTargetChange: form.allowTargetChange,
        categoryId
      }
      await updateTemplateMutation.mutateAsync({ id: form.id, request: updateRequest })
    } catch (error) {
      console.error('템플릿 카테고리 변경 실패:', error)
    }
  }

  const handleAddCategory = () => {
    const name = newCategoryName.trim()
    if (!name) return
    
    // 임시 ID 생성 (음수로 새로운 카테고리 구분)
    const tempId = -(Date.now())
    const newCategory = {
      id: tempId,
      name,
      sortOrder: localCategories.length + 1
    }
    
    setLocalCategories(prev => [...prev, newCategory])
    setNewCategoryName("")
  }

  const handleRemoveCategory = (categoryId: number) => {
    setLocalCategories(prev => prev.filter(c => c.id !== categoryId))
    
    if (selectedCategory === categoryId) {
      setSelectedCategory(null)
    }
  }

  const handleRenameCategoryInline = (categoryId: number, newName: string) => {
    setLocalCategories(prev => 
      prev.map(c => c.id === categoryId ? { ...c, name: newName } : c)
    )
  }
  
  // 카테고리 편집 완료 처리
  const handleFinishCategoryEditing = async () => {
    const operations: any[] = []
    
    // 기존 카테고리와 비교하여 작업 생성
    localCategories.forEach((localCat, index) => {
      const originalCat = categoriesData.find(c => c.id === localCat.id)
      
      if (typeof localCat.id === 'number' && localCat.id < 0) {
        // 새로운 카테고리 (CREATE)
        operations.push({
          type: BulkCategoryOperationType.CREATE,
          createRequest: {
            name: localCat.name,
            sortOrder: index + 1
          }
        })
      } else if (originalCat) {
        // 기존 카테고리 (UPDATE)
        operations.push({
          type: BulkCategoryOperationType.UPDATE,
          id: originalCat.id,
          updateRequest: {
            name: localCat.name,
            sortOrder: index + 1
          }
        })
      }
    })
    
    // 삭제된 카테고리 처리 (DELETE)
    categoriesData.forEach(originalCat => {
      const exists = localCategories.find(c => c.id === originalCat.id)
      if (!exists) {
        operations.push({
          type: BulkCategoryOperationType.DELETE,
          id: originalCat.id
        })
      }
    })
    
    // 벌크 작업 실행
    if (operations.length > 0) {
      await bulkProcessMutation.mutateAsync({ operations })
    }
    
    // 편집 모드 종료
    setIsEditingCategories(false)
    setLocalCategories([])
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-5xl !w-[95vw] h-[85vh] flex flex-col p-0">
        <DialogHeader className="pb-4 px-6 pt-6 flex-shrink-0">
          <DialogTitle className={`${typography.h2} text-gray-800`}>문서 양식 관리</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          <div className="px-6 pb-4 flex-shrink-0 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="양식명 또는 설명으로 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/60 backdrop-blur-sm border-gray-200/50 rounded-xl"
              />
            </div>

            <Button 
              variant="outline" 
              onClick={isEditingCategories ? handleFinishCategoryEditing : () => setIsEditingCategories(true)} 
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" /> {isEditingCategories ? "편집 완료" : "분류 수정"}
            </Button>

            <Button onClick={handleNewForm} className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
              <FolderPlus className="w-4 h-4" /> 새 양식 만들기
            </Button>
          </div>

          <div className="px-6 pb-4 flex-shrink-0">
            {isEditingCategories ? (
              <div className="space-y-3">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragOver={handleDragOver}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext items={categories} strategy={verticalListSortingStrategy}>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <SortableCategoryItem
                          key={category.id}
                          category={category}
                          onRename={handleRenameCategoryInline}
                          onRemove={handleRemoveCategory}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
                <div className="flex items-center gap-2 mb-2">
                  <Input
                    placeholder="새 분류 이름"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="flex-1 h-8"
                    onKeyPress={(e) => e.key === "Enter" && handleAddCategory()}
                  />
                  <Button
                    onClick={handleAddCategory}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 h-8"
                    disabled={!newCategoryName.trim()}
                  >
                    <Plus className="w-4 h-4 mr-1" /> 추가
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 pb-2">
                {/* 전체 버튼 별도 렌더링 */}
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                  className="flex items-center gap-2 whitespace-nowrap"
                >
                  전체
                </Button>
                
                {/* 실제 카테고리 버튼들 */}
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="flex items-center gap-2 whitespace-nowrap"
                  >
                    {category.name}
                  </Button>
                ))}
                
                {/* 분류 미지정 양식이 있는 경우에만 표시 */}
                {allTemplates.some(t => !t.category) && (
                  <Button
                    variant={selectedCategory === -1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(-1)}
                    className="flex items-center gap-2 whitespace-nowrap text-gray-500"
                  >
                    분류 미지정
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-6 min-h-0">
            <FormTemplatesGrid
              forms={filteredForms}
              onCardClick={handleEditForm}
              getCategoryName={(id) => {
                const category = categoriesData.find(cat => cat.id === id)
                return category ? category.name : ""
              }}
              renderOverlay={(form) => (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-[180px]">
                    <DropdownMenuItem onClick={() => handleEditForm(form)}>
                      <Edit className="w-4 h-4" /> 양식 편집
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>양식 분류 변경</DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        {categoriesData.map((c) => (
                          <DropdownMenuItem key={c.id} onClick={() => handleChangeCategory(form, c.id)}>
                            {c.name}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      숨기기
                      <Switch
                        className="ml-auto"
                        checked={form.isHidden}
                        onCheckedChange={(v) => handleToggleHidden(form, v)}
                      />
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDuplicate(form)}>
                      <Copy className="w-4 h-4" /> 양식 복제
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" onClick={() => handleDelete(form)}>
                      <Trash2 className="w-4 h-4" /> 삭제
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            />
          </div>
        </div>
      </DialogContent>

      {/* 양식 편집기 모달 */}
      <FormEditorModal
        isOpen={isFormEditorOpen}
        onClose={() => setIsFormEditorOpen(false)}
        formTemplate={editingForm}
        onSave={handleFormSave}
      />
    </Dialog>
  )
}
