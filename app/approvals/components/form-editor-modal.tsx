"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { colors, typography } from "@/lib/design-tokens"
import { FormTemplate, FormField, FieldType, ReferenceFile, categories, getIconComponent } from "@/lib/mock-data/form-templates"
import { AttachmentsManager, Attachment } from "@/components/ui/attachments-manager"
import {
  Plus,
  Trash2,
  Save,
  X,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Calendar,
  User,
  CreditCard,
  Car,
  Home,
  Briefcase,
  FileText,
  Settings,
  Clock,
  Mail,
  Phone,
  MapPin,
  Building,
  ShoppingCart,
  DollarSign,
  Award,
  Target,
  Zap,
  Heart,
  Star,
  Bookmark
} from "lucide-react"

// 사용 가능한 아이콘 목록
const availableIcons = [
  { name: "Calendar", icon: Calendar, value: "Calendar" },
  { name: "User", icon: User, value: "User" },
  { name: "CreditCard", icon: CreditCard, value: "CreditCard" },
  { name: "Car", icon: Car, value: "Car" },
  { name: "Home", icon: Home, value: "Home" },
  { name: "Briefcase", icon: Briefcase, value: "Briefcase" },
  { name: "FileText", icon: FileText, value: "FileText" },
  { name: "Settings", icon: Settings, value: "Settings" },
  { name: "Clock", icon: Clock, value: "Clock" },
  { name: "Mail", icon: Mail, value: "Mail" },
  { name: "Phone", icon: Phone, value: "Phone" },
  { name: "MapPin", icon: MapPin, value: "MapPin" },
  { name: "Building", icon: Building, value: "Building" },
  { name: "ShoppingCart", icon: ShoppingCart, value: "ShoppingCart" },
  { name: "DollarSign", icon: DollarSign, value: "DollarSign" },
  { name: "Award", icon: Award, value: "Award" },
  { name: "Target", icon: Target, value: "Target" },
  { name: "Zap", icon: Zap, value: "Zap" },
  { name: "Heart", icon: Heart, value: "Heart" },
  { name: "Star", icon: Star, value: "Star" },
  { name: "Bookmark", icon: Bookmark, value: "Bookmark" }
]

// 사용 가능한 색상 목록
const availableColors = [
  { name: "파란색", value: "#3b82f6" },
  { name: "초록색", value: "#10b981" },
  { name: "빨간색", value: "#ef4444" },
  { name: "노란색", value: "#f59e0b" },
  { name: "보라색", value: "#8b5cf6" },
  { name: "분홍색", value: "#ec4899" },
  { name: "청록색", value: "#06b6d4" },
  { name: "주황색", value: "#f97316" },
  { name: "회색", value: "#6b7280" },
  { name: "라임", value: "#84cc16" },
  { name: "인디고", value: "#6366f1" },
  { name: "에메랄드", value: "#059669" }
]

interface FormEditorModalProps {
  isOpen: boolean
  onClose: () => void
  formTemplate?: FormTemplate | null // null이면 새 양식, 있으면 수정
  onSave: (formTemplate: FormTemplate) => void
}

// 필드 타입별 기본 설정
const getFieldDefaults = (type: FieldType): Partial<FormField> => {
  switch (type) {
    case 'select':
    case 'multiselect':
      return { options: ["옵션 1", "옵션 2", "옵션 3"] }
    default:
      return {}
  }
}

// 필드 구성 컴포넌트
function FieldConfigurationManager({
  fields,
  onFieldsChange
}: {
  fields: FormField[]
  onFieldsChange: (fields: FormField[]) => void
}) {
  const [expandedField, setExpandedField] = useState<number | null>(null)

  const addField = () => {
    const newField: FormField = {
      name: `새 필드 ${fields.length + 1}`,
      type: 'text',
      required: false,
      placeholder: ""
    }
    onFieldsChange([...fields, newField])
    setExpandedField(fields.length) // 새로 추가된 필드를 펼쳐서 보여줌
  }

  const removeField = (index: number) => {
    onFieldsChange(fields.filter((_, i) => i !== index))
    if (expandedField === index) {
      setExpandedField(null)
    }
  }

  const updateField = (index: number, updates: Partial<FormField>) => {
    onFieldsChange(fields.map((field, i) => 
      i === index ? { ...field, ...updates } : field
    ))
  }

  const moveField = (index: number, direction: 'up' | 'down') => {
    const newFields = [...fields]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    
    if (targetIndex >= 0 && targetIndex < fields.length) {
      [newFields[index], newFields[targetIndex]] = [newFields[targetIndex], newFields[index]]
      onFieldsChange(newFields)
    }
  }

  return (
    <div className="space-y-3">
      {fields.map((field, index) => (
        <div key={index} className="border border-gray-200 rounded-lg">
          {/* 필드 헤더 */}
          <div 
            className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
            onClick={() => setExpandedField(expandedField === index ? null : index)}
          >
            <div className="flex items-center gap-3">
              <div className="flex flex-col gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    moveField(index, 'up')
                  }}
                  disabled={index === 0}
                  className="h-4 w-4 p-0"
                >
                  <ChevronUp className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    moveField(index, 'down')
                  }}
                  disabled={index === fields.length - 1}
                  className="h-4 w-4 p-0"
                >
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </div>
              <GripVertical className="w-4 h-4 text-gray-400" />
              <div>
                <p className="font-medium text-sm">{field.name}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">{field.type}</Badge>
                  {field.required && <Badge variant="destructive" className="text-xs">필수</Badge>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  removeField(index)
                }}
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              {expandedField === index ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </div>
          </div>

          {/* 필드 설정 */}
          {expandedField === index && (
            <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 필드 이름 */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">필드 이름</Label>
                  <Input
                    value={field.name}
                    onChange={(e) => updateField(index, { name: e.target.value })}
                    placeholder="필드 이름을 입력하세요"
                  />
                </div>

                {/* 필드 타입 */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">필드 타입</Label>
                  <Select
                    value={field.type}
                    onValueChange={(value: FieldType) => {
                      const defaults = getFieldDefaults(value)
                      updateField(index, { type: value, ...defaults })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">텍스트</SelectItem>
                      <SelectItem value="number">숫자</SelectItem>
                      <SelectItem value="money">금액</SelectItem>
                      <SelectItem value="date">날짜</SelectItem>
                      <SelectItem value="select">단일 선택</SelectItem>
                      <SelectItem value="multiselect">다중 선택</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 플레이스홀더 */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">플레이스홀더</Label>
                <Input
                  value={field.placeholder || ''}
                  onChange={(e) => updateField(index, { placeholder: e.target.value })}
                  placeholder="사용자에게 보여줄 안내 문구"
                />
              </div>

              {/* 필수 여부 */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`required-${index}`}
                  checked={field.required || false}
                  onCheckedChange={(checked) => updateField(index, { required: !!checked })}
                />
                <Label htmlFor={`required-${index}`} className="text-sm font-medium">
                  필수 입력 항목
                </Label>
              </div>

              {/* 옵션 설정 (select, multiselect인 경우) */}
              {(field.type === 'select' || field.type === 'multiselect') && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">선택 옵션</Label>
                  <div className="space-y-2">
                    {field.options?.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center gap-2">
                        <Input
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...(field.options || [])]
                            newOptions[optionIndex] = e.target.value
                            updateField(index, { options: newOptions })
                          }}
                          placeholder={`옵션 ${optionIndex + 1}`}
                          className="flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newOptions = field.options?.filter((_, i) => i !== optionIndex) || []
                            updateField(index, { options: newOptions })
                          }}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newOptions = [...(field.options || []), ""]
                        updateField(index, { options: newOptions })
                      }}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      옵션 추가
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      <Button
        variant="outline"
        onClick={addField}
        className="w-full flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        필드 추가
      </Button>
    </div>
  )
}

// 참고 파일 관리 컴포넌트
function ReferenceFilesManager({
  referenceFiles,
  onReferenceFilesChange
}: {
  referenceFiles: ReferenceFile[]
  onReferenceFilesChange: (files: ReferenceFile[]) => void
}) {
  // ReferenceFile을 Attachment 형태로 변환
  const attachments: Attachment[] = referenceFiles.map(file => ({
    id: file.id,
    name: file.name,
    size: file.size,
    url: file.url
  }))

  // Attachment를 ReferenceFile 형태로 변환하여 저장
  const handleAttachmentsChange = (newAttachments: Attachment[]) => {
    const newReferenceFiles: ReferenceFile[] = newAttachments.map(attachment => {
      // 기존 참고파일에서 설명 찾기
      const existingFile = referenceFiles.find(f => f.id === attachment.id)
      return {
        id: attachment.id,
        name: attachment.name,
        url: attachment.url || '',
        size: attachment.size,
        description: existingFile?.description || ''
      }
    })
    onReferenceFilesChange(newReferenceFiles)
  }

  return (
    <div className="space-y-4">
      <AttachmentsManager
        attachments={attachments}
        onAttachmentsChange={handleAttachmentsChange}
        maxFiles={5}
        maxFileSize={50}
      />
      
      {/* 참고파일별 설명 입력 */}
      {referenceFiles.length > 0 && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">파일 설명</Label>
          {referenceFiles.map((file, index) => (
            <div key={file.id} className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700 truncate">{file.name}</span>
              </div>
              <Input
                placeholder="파일에 대한 설명을 입력하세요 (선택사항)"
                value={file.description || ''}
                onChange={(e) => {
                  const updatedFiles = referenceFiles.map((f, i) => 
                    i === index ? { ...f, description: e.target.value } : f
                  )
                  onReferenceFilesChange(updatedFiles)
                }}
                className="ml-6"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function FormEditorModal({ 
  isOpen, 
  onClose, 
  formTemplate = null, 
  onSave 
}: FormEditorModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [selectedIcon, setSelectedIcon] = useState("FileText")
  const [selectedColor, setSelectedColor] = useState("#3b82f6")
  const [fields, setFields] = useState<FormField[]>([])
  const [defaultContent, setDefaultContent] = useState("")
  const [referenceFiles, setReferenceFiles] = useState<ReferenceFile[]>([])
  const [attachments, setAttachments] = useState<FormTemplate['attachments']>('optional')
  const [content, setContent] = useState<FormTemplate['content']>('enabled')

  const isEditing = !!formTemplate

  // 모달이 열릴 때 기존 양식 데이터로 초기화 또는 기본값 설정
  useEffect(() => {
    if (isOpen) {
      if (formTemplate) {
        // 수정 모드: 기존 데이터로 초기화
        setTitle(formTemplate.title)
        setDescription(formTemplate.description)
        setCategory(formTemplate.category)
        setSelectedIcon(typeof formTemplate.icon === 'string' ? formTemplate.icon : "FileText")
        setSelectedColor(formTemplate.color)
        setFields(formTemplate.fields || [])
        setDefaultContent(formTemplate.defaultContent || "")
        setReferenceFiles(formTemplate.referenceFiles || [])
        setAttachments(formTemplate.attachments)
        setContent(formTemplate.content)
      } else {
        // 새 양식 모드: 기본값으로 초기화
        setTitle("")
        setDescription("")
        setCategory("business")
        setSelectedIcon("FileText")
        setSelectedColor("#3b82f6")
        setFields([])
        setDefaultContent("")
        setReferenceFiles([])
        setAttachments('optional')
        setContent('enabled')
      }
    }
  }, [isOpen, formTemplate])

  const handleSave = () => {
    if (!title.trim()) {
      alert("양식 제목을 입력해주세요.")
      return
    }
    if (!description.trim()) {
      alert("양식 설명을 입력해주세요.")
      return
    }

    const selectedIconData = availableIcons.find(icon => icon.value === selectedIcon)
    if (!selectedIconData) {
      alert("아이콘을 선택해주세요.")
      return
    }

    const newFormTemplate: FormTemplate = {
      id: formTemplate?.id || `form-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      category,
      icon: selectedIcon, // 문자열로 저장
      color: selectedColor,
      fields,
      defaultContent,
      referenceFiles: referenceFiles.filter(file => file.id && file.name && file.url),
      attachments,
      content
    }

    onSave(newFormTemplate)
    onClose()
  }

  const IconComponent = getIconComponent(selectedIcon)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-4xl !w-[95vw] h-[85vh] flex flex-col p-0">
        <DialogHeader className="pb-4 px-6 pt-6 flex-shrink-0">
          <DialogTitle className={`${typography.h2} text-gray-800`}>
            {isEditing ? "양식 수정" : "새 양식 만들기"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 pb-6 min-h-0">
          <div className="space-y-6">
            {/* 기본 정보 */}
            <div className="space-y-4">
              <h3 className={`${typography.h3} text-gray-800`}>기본 정보</h3>
              
              {/* 양식 미리보기 */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: selectedColor }}
                >
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">
                    {title || "양식 제목"}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    {description || "양식 설명"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">양식 제목</Label>
                  <Input
                    placeholder="양식 제목을 입력하세요"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">카테고리</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="카테고리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter(cat => cat.id !== "all").map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">아이콘</Label>
                  <Select value={selectedIcon} onValueChange={setSelectedIcon}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableIcons.map((iconData) => {
                        const Icon = iconData.icon
                        return (
                          <SelectItem key={iconData.value} value={iconData.value}>
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4" />
                              {iconData.name}
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">색상</Label>
                  <Select value={selectedColor} onValueChange={setSelectedColor}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableColors.map((colorData) => (
                        <SelectItem key={colorData.value} value={colorData.value}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-4 h-4 rounded border border-gray-300"
                              style={{ backgroundColor: colorData.value }}
                            />
                            {colorData.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">양식 설명</Label>
                <Textarea
                  placeholder="양식에 대한 설명을 입력하세요"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[60px]"
                />
              </div>
            </div>

            <Separator />

            {/* 양식 필드 구성 */}
            <div className="space-y-4">
              <h3 className={`${typography.h3} text-gray-800`}>양식 필드</h3>
              <FieldConfigurationManager
                fields={fields}
                onFieldsChange={setFields}
              />
            </div>

            <Separator />

            {/* 기본 콘텐츠 - 내용 작성란이 활성화된 경우에만 표시 */}
            {content === 'enabled' && (
              <div className="space-y-4">
                <h3 className={`${typography.h3} text-gray-800`}>내용</h3>
                <div className="space-y-2">
                  <Textarea
                    placeholder="양식 작성 시 기본으로 표시될 내용을 입력하세요"
                    value={defaultContent}
                    onChange={(e) => setDefaultContent(e.target.value)}
                    className="min-h-[120px]"
                  />
                  <p className="text-xs text-gray-500">
                    사용자가 양식을 작성할 때 본문에 미리 채워질 내용입니다.
                  </p>
                </div>
              </div>
            )}

            <Separator />

            {/* 설정 */}
            <div className="space-y-4">
              <h3 className={`${typography.h3} text-gray-800`}>설정</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-sm font-medium">첨부파일 설정</Label>
                  <Select value={attachments} onValueChange={(value: FormTemplate['attachments']) => setAttachments(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="disabled">사용 안함</SelectItem>
                      <SelectItem value="optional">사용</SelectItem>
                      <SelectItem value="required">필수</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">내용 작성란</Label>
                  <Select value={content} onValueChange={(value: FormTemplate['content']) => setContent(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="disabled">사용 안함</SelectItem>
                      <SelectItem value="enabled">사용</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* 참고 파일 */}
            <div className="space-y-4">
              <h3 className={`${typography.h3} text-gray-800`}>참고 파일</h3>
              <ReferenceFilesManager
                referenceFiles={referenceFiles}
                onReferenceFilesChange={setReferenceFiles}
              />
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="flex-shrink-0 flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
            <Save className="w-4 h-4" />
            {isEditing ? "수정" : "생성"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
