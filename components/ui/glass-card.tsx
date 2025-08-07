import { ReactNode, CSSProperties } from "react"
import { cn } from "@/lib/utils"
import { backgrounds, shadows, animations, borderRadius } from "@/lib/design-tokens"

interface GlassCardProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  hover?: boolean
  shadow?: keyof typeof shadows
  radius?: keyof typeof borderRadius
  onClick?: () => void
}

export function GlassCard({ 
  children, 
  className, 
  style,
  hover = true,
  shadow = "lg",
  radius = "md",
  onClick
}: GlassCardProps) {
  return (
    <div
      className={cn(
        backgrounds.glass,
        shadows[shadow],
        borderRadius[radius],
        "border-0",
        hover && onClick && animations.hoverUp,
        animations.transition,
        onClick && "cursor-pointer",
        className
      )}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  )
} 