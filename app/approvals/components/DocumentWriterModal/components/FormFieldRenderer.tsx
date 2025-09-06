"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { CalendarDays } from "lucide-react"
import { TemplateFieldResponse, FieldType } from "@/lib/services/approval/types"

interface FormFieldRendererProps {
  field: TemplateFieldResponse
  value: any
  onChange: (value: any) => void
}

export function FormFieldRenderer({
  field,
  value,
  onChange
}: FormFieldRendererProps) {
  const handleMultiSelectChange = (optionValue: string, checked: boolean) => {
    const currentValues = Array.isArray(value) ? value : []
    if (checked) {
      onChange([...currentValues, optionValue])
    } else {
      onChange(currentValues.filter((v: string) => v !== optionValue))
    }
  }

  const formatMoney = (value: string) => {
    const number = value.replace(/[^\d]/g, '')
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  const handleMoneyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatMoney(e.target.value)
    onChange(formatted)
  }

  // 옵션 파싱 (API에서는 string으로 저장됨)
  const parseOptions = (optionsString?: string): string[] => {
    if (!optionsString) return []
    try {
      return JSON.parse(optionsString)
    } catch {
      return optionsString.split(',').map(opt => opt.trim()).filter(opt => opt.length > 0)
    }
  }

  const options = parseOptions(field.options)

  switch (field.fieldType) {
    case FieldType.TEXT:
      return (
        <Input
          type="text"
          placeholder={`${field.name}를 입력하세요`}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full"
        />
      )

    case FieldType.NUMBER:
      return (
        <Input
          type="number"
          placeholder={`${field.name}를 입력하세요`}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full"
        />
      )

    case FieldType.MONEY:
      return (
        <div className="relative">
          <Input
            type="text"
            placeholder={`${field.name}를 입력하세요`}
            value={value || ''}
            onChange={handleMoneyChange}
            className="w-full pr-10"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
            원
          </span>
        </div>
      )

    case FieldType.DATE:
      return (
        <div className="relative">
          <Input
            type="date"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full"
          />
          <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      )

    case FieldType.SELECT:
      return (
        <Select value={value || ''} onValueChange={onChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="옵션을 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )

    case FieldType.MULTISELECT:
      const selectedValues = Array.isArray(value) ? value : []
      return (
        <div className="space-y-2">
          {options.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={`${field.name}-${option}`}
                checked={selectedValues.includes(option)}
                onCheckedChange={(checked) => handleMultiSelectChange(option, !!checked)}
              />
              <Label
                htmlFor={`${field.name}-${option}`}
                className="text-sm font-normal"
              >
                {option}
              </Label>
            </div>
          ))}
        </div>
      )

    default:
      return null
  }
}