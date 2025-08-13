"use client"

import { useMemo, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { FormTemplatesGrid } from "./form-templates-grid"
import { FormEditorModal } from "./form-editor-modal"
import { colors, typography } from "@/lib/design-tokens"
import { FormTemplate, formTemplates as initialTemplates, categories as defaultCategories } from "@/lib/mock-data/form-templates"
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

type Category = { id: string; name: string }

interface FormManagementModalProps {
  isOpen: boolean
  onClose: () => void
  onOpenFormEditor?: (form: FormTemplate | null) => void // null: 새 양식
}

// 드래그 가능한 카테고리 아이템 컴포넌트
interface SortableCategoryItemProps {
  category: Category
  onRename: (categoryId: string, newName: string) => void
  onRemove: (categoryId: string) => void
}

function SortableCategoryItem({ category, onRename, onRemove }: SortableCategoryItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id, disabled: category.id === "all" })

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
      {category.id === "all" ? (
        <span className="text-sm text-gray-600 px-2">{category.name}</span>
      ) : (
        <>
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
        </>
      )}
    </div>
  )
}

export function FormManagementModal({ isOpen, onClose, onOpenFormEditor }: FormManagementModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [categories, setCategories] = useState<Category[]>(defaultCategories)
  const [templates, setTemplates] = useState<(FormTemplate & { hidden?: boolean })[]>(() => initialTemplates)
  const [isEditingCategories, setIsEditingCategories] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [isFormEditorOpen, setIsFormEditorOpen] = useState(false)
  const [editingForm, setEditingForm] = useState<FormTemplate | null>(null)

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

    // '전체' 카테고리는 재정렬 대상에서 제외
    if (!over) return
    if (active.id === "all" || over.id === "all") return

    if (active.id !== over.id) {
      setCategories((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  // 드래그 완료 핸들러 (실제로는 handleDragOver에서 이미 처리되므로 빈 함수)
  const handleDragEnd = (event: DragEndEvent) => {
    // 실시간 업데이트는 handleDragOver에서 처리되므로 여기서는 별도 작업 없음
    // 필요하다면 최종 상태 저장 등의 로직을 추가할 수 있음
  }

  const filteredForms = useMemo(() => {
    return templates.filter((form) => {
      const matchesSearch = form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        form.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || 
        form.category === selectedCategory ||
        (selectedCategory === "" && !form.category)
      return matchesSearch && matchesCategory
    })
  }, [templates, searchTerm, selectedCategory])

  const handleNewForm = () => {
    setEditingForm(null)
    setIsFormEditorOpen(true)
  }

  const handleEditForm = (form: FormTemplate) => {
    setEditingForm(form)
    setIsFormEditorOpen(true)
  }

  const handleFormSave = (savedForm: FormTemplate) => {
    if (editingForm) {
      // 기존 양식 수정
      setTemplates((prev) => prev.map((t) => 
        t.id === editingForm.id ? { ...savedForm, hidden: (t as any).hidden } : t
      ))
    } else {
      // 새 양식 추가
      setTemplates((prev) => [savedForm, ...prev])
    }
    setIsFormEditorOpen(false)
    setEditingForm(null)
  }

  const handleDuplicate = (form: FormTemplate) => {
    const copy: FormTemplate = {
      ...form,
      id: `${form.id}-copy-${Math.random().toString(36).slice(2, 6)}`,
      title: `${form.title} (복제)`
    }
    setTemplates((prev) => [copy, ...prev])
  }

  const handleDelete = (form: FormTemplate) => {
    setTemplates((prev) => prev.filter((t) => t.id !== form.id))
  }

  const handleToggleHidden = (form: FormTemplate & { hidden?: boolean }, hidden: boolean) => {
    setTemplates((prev) => prev.map((t) => (t.id === form.id ? { ...t, hidden } : t)))
  }

  const handleChangeCategory = (form: FormTemplate, categoryId: string) => {
    setTemplates((prev) => prev.map((t) => (t.id === form.id ? { ...t, category: categoryId } : t)))
  }

  const handleAddCategory = () => {
    const name = newCategoryName.trim()
    if (!name) return
    const id = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
    if (!categories.find((c) => c.id === id)) {
      setCategories((prev) => [...prev, { id, name }])
      setNewCategoryName("")
    }
  }

  const handleRemoveCategory = (categoryId: string) => {
    if (categoryId === "all") return
    // 해당 카테고리를 사용하는 양식들은 분류 미지정 상태로 변경
    setTemplates((prev) => prev.map((t) => 
      t.category === categoryId ? { ...t, category: "" } : t
    ))
    setCategories((prev) => prev.filter((c) => c.id !== categoryId))
    if (selectedCategory === categoryId) {
      setSelectedCategory("all")
    }
  }

  const handleRenameCategoryInline = (categoryId: string, newName: string) => {
    setCategories((prev) => prev.map((c) => (c.id === categoryId ? { ...c, name: newName } : c)))
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

            <Button variant="outline" onClick={() => setIsEditingCategories(!isEditingCategories)} className="flex items-center gap-2">
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
                {templates.some(t => !t.category) && (
                  <Button
                    variant={selectedCategory === "" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory("")}
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
              getCategoryName={(id) => categories.find(cat => cat.id === id)?.name || ""}
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
                        {categories.filter(c => c.id !== "all").map((c) => (
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
                        checked={(form as any).hidden === true}
                        onCheckedChange={(v) => handleToggleHidden(form as any, !!v)}
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
