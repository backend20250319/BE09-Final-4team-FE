"use client"

import { Badge } from "@/components/ui/badge"
import { GlassCard } from "@/components/ui/glass-card"
import { typography } from "@/lib/design-tokens"
import { FormTemplate, getIconComponent } from "@/lib/mock-data/form-templates"
import { EyeOff } from "lucide-react"
import { ReactNode } from "react"

export interface FormTemplatesGridProps<T extends FormTemplate = FormTemplate> {
  forms: T[]
  onCardClick?: (form: T) => void
  getCategoryName?: (categoryId: string) => string
  renderOverlay?: (form: T) => ReactNode
}

export function FormTemplatesGrid<T extends FormTemplate = FormTemplate>({
  forms,
  onCardClick,
  getCategoryName,
  renderOverlay,
}: FormTemplatesGridProps<T>) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {forms.map((form) => {
        const IconComponent = typeof form.icon === 'string' ? getIconComponent(form.icon) : form.icon
        const hidden = (form as any).hidden as boolean | undefined
        return (
          <GlassCard
            key={form.id}
            className="relative p-4 hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-blue-200"
            onClick={() => onCardClick?.(form)}
          >
            {renderOverlay ? (
              <div className="absolute top-2 right-2 z-10" onClick={(e) => e.stopPropagation()}>
                {renderOverlay(form)}
              </div>
            ) : null}
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0"
                style={{ backgroundColor: form.color }}
              >
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className={`${typography.h4} text-gray-800 truncate`}>{form.title}</h3>
                  {getCategoryName && form.category && getCategoryName(form.category) ? (
                    <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600 hover:bg-gray-100">
                      {getCategoryName(form.category)}
                    </Badge>
                  ) : null}
                  {hidden ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : null}
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{form.description}</p>
              </div>
            </div>
          </GlassCard>
        )
      })}
    </div>
  )
}


