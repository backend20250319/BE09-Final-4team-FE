"use client"

import { useMemo, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { FormTemplatesGrid } from "./form-templates-grid"
import { colors, typography } from "@/lib/design-tokens"
import { FormTemplate, formTemplates as initialTemplates } from "@/lib/mock-data/form-templates"
import { MoreVertical, Search, FolderPlus, Edit, Copy, Trash2, Settings, FileText } from "lucide-react"

type Category = { id: string; name: string }

const defaultCategories: Category[] = [
  { id: "all", name: "전체" },
  { id: "hr", name: "인사" },
  { id: "finance", name: "재무" },
  { id: "admin", name: "행정" },
  { id: "business", name: "업무" },
  { id: "travel", name: "출장" },
  { id: "leave", name: "휴가" },
  { id: "facility", name: "시설" },
]

interface FormManagementModalProps {
  isOpen: boolean
  onClose: () => void
  onOpenFormEditor?: (form: FormTemplate | null) => void // null: 새 양식
}

export function FormManagementModal({ isOpen, onClose, onOpenFormEditor }: FormManagementModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [categories, setCategories] = useState<Category[]>(defaultCategories)
  const [templates, setTemplates] = useState<(FormTemplate & { hidden?: boolean })[]>(() => initialTemplates)
  const [showCategoryEditor, setShowCategoryEditor] = useState(false)
  const [editingForm, setEditingForm] = useState<FormTemplate | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)

  const filteredForms = useMemo(() => {
    return templates.filter((form) => {
      const matchesSearch = form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        form.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || form.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [templates, searchTerm, selectedCategory])

  const getCategoryName = (id: string) => categories.find((c) => c.id === id)?.name || id

  const handleNewForm = () => {
    if (onOpenFormEditor) return onOpenFormEditor(null)
    const draft: FormTemplate = {
      id: `new-${Math.random().toString(36).slice(2, 8)}`,
      title: "새 양식",
      description: "",
      category: selectedCategory === "all" ? (categories[1]?.id || "hr") : selectedCategory,
      icon: FileText,
      color: "#93c5fd",
      fields: [],
      defaultContent: "",
      attachments: "optional",
      content: "enabled",
    }
    setEditingForm(draft)
    setShowEditModal(true)
  }

  const handleEditForm = (form: FormTemplate) => {
    if (onOpenFormEditor) return onOpenFormEditor(form)
    setEditingForm(form)
    setShowEditModal(true)
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

            <Button variant="outline" onClick={() => setShowCategoryEditor(true)} className="flex items-center gap-2">
              <Settings className="w-4 h-4" /> 분류 수정
            </Button>

            <Button onClick={handleNewForm} className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
              <FolderPlus className="w-4 h-4" /> 새 양식 만들기
            </Button>
          </div>

          <div className="px-6 pb-4 flex-shrink-0">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center gap-2 whitespace-nowrap flex-shrink-0"
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-6 min-h-0">
            <FormTemplatesGrid
              forms={filteredForms}
              onCardClick={handleEditForm}
              getCategoryName={getCategoryName}
              renderOverlay={(form) => (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-[180px]">
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

      {/* 분류 추가/수정 모달 */}
      <Dialog open={showCategoryEditor} onOpenChange={setShowCategoryEditor}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className={`${typography.h3} text-gray-800`}>분류 추가/수정</DialogTitle>
          </DialogHeader>
          <CategoryEditor
            categories={categories}
            onChange={setCategories}
            onClose={() => setShowCategoryEditor(false)}
          />
        </DialogContent>
      </Dialog>

    {/* 양식 수정 모달 */}
    <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className={`${typography.h3} text-gray-800`}>{editingForm?.id?.startsWith("new-") ? "새 양식 만들기" : "양식 수정"}</DialogTitle>
        </DialogHeader>
        {editingForm ? (
          <EditForm
            value={editingForm}
            categories={categories}
            onCancel={() => setShowEditModal(false)}
            onSave={(next) => {
              setTemplates((prev) => {
                const exists = prev.some((t) => t.id === next.id)
                if (exists) return prev.map((t) => (t.id === next.id ? { ...t, ...next } : t))
                return [next, ...prev]
              })
              setShowEditModal(false)
            }}
          />
        ) : null}
      </DialogContent>
    </Dialog>
    </Dialog>
  )
}

function CategoryEditor({
  categories,
  onChange,
  onClose,
}: {
  categories: Category[]
  onChange: (next: Category[]) => void
  onClose: () => void
}) {
  const [local, setLocal] = useState<Category[]>(categories)
  const [adding, setAdding] = useState("")

  const handleAdd = () => {
    const name = adding.trim()
    if (!name) return
    const id = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
    if (!local.find((c) => c.id === id)) {
      setLocal((prev) => [...prev, { id, name }])
      setAdding("")
    }
  }

  const handleRename = (id: string, name: string) => {
    setLocal((prev) => prev.map((c) => (c.id === id ? { ...c, name } : c)))
  }

  const handleRemove = (id: string) => {
    if (id === "all") return
    setLocal((prev) => prev.filter((c) => c.id !== id))
  }

  const handleSave = () => {
    onChange(local)
    onClose()
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="새 분류 이름"
          value={adding}
          onChange={(e) => setAdding(e.target.value)}
        />
        <Button onClick={handleAdd}>추가</Button>
      </div>
      <div className="space-y-2 max-h-72 overflow-y-auto">
        {local.map((c) => (
          <div key={c.id} className="flex items-center gap-2">
            <Input
              className="flex-1"
              value={c.name}
              onChange={(e) => handleRename(c.id, e.target.value)}
              disabled={c.id === "all"}
            />
            <Button variant="outline" onClick={() => handleRemove(c.id)} disabled={c.id === "all"}>
              삭제
            </Button>
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>취소</Button>
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">저장</Button>
      </div>
    </div>
  )
}

function EditForm({
  value,
  categories,
  onCancel,
  onSave,
}: {
  value: FormTemplate
  categories: { id: string; name: string }[]
  onCancel: () => void
  onSave: (next: FormTemplate) => void
}) {
  const [local, setLocal] = useState<FormTemplate>(value)

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm text-gray-700">양식명</label>
        <Input value={local.title} onChange={(e) => setLocal({ ...local, title: e.target.value })} />
      </div>
      <div className="space-y-2">
        <label className="text-sm text-gray-700">설명</label>
        <Input value={local.description} onChange={(e) => setLocal({ ...local, description: e.target.value })} />
      </div>
      <div className="space-y-2">
        <label className="text-sm text-gray-700">분류</label>
        <select
          className="border rounded-md h-9 px-3"
          value={local.category}
          onChange={(e) => setLocal({ ...local, category: e.target.value })}
        >
          {categories.filter(c => c.id !== 'all').map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-sm text-gray-700">대표 색상</label>
        <Input type="color" value={local.color} onChange={(e) => setLocal({ ...local, color: e.target.value })} />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>취소</Button>
        <Button onClick={() => onSave(local)} className="bg-blue-600 hover:bg-blue-700">저장</Button>
      </div>
    </div>
  )
}


