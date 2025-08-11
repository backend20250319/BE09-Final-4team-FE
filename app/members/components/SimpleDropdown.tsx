"use client"

import React, { useEffect, useRef, useState } from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SimpleDropdownProps {
  options: string[]
  value?: string
  placeholder?: string
  onChange: (value: string) => void
  triggerClassName?: string
  menuClassName?: string
  disabled?: boolean
}

export default function SimpleDropdown({
  options,
  value,
  placeholder = "선택",
  onChange,
  triggerClassName,
  menuClassName,
  disabled = false,
}: SimpleDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function handleOutsideMouseDown(event: MouseEvent) {
      const target = event.target as Node
      if (containerRef.current && !containerRef.current.contains(target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideMouseDown)
      return () => document.removeEventListener("mousedown", handleOutsideMouseDown)
    }
  }, [isOpen])

  const selectedLabel = value ?? ""

  return (
    <div ref={containerRef} className="relative">
      <Button
        type="button"
        variant="outline"
        disabled={disabled}
        className={cn(
          "w-full justify-between",
          disabled && "opacity-60 cursor-not-allowed",
          triggerClassName,
        )}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
      >
        <span className={cn("truncate", !selectedLabel && "text-muted-foreground")}>
          {selectedLabel || placeholder}
        </span>
        <ChevronDown className="w-4 h-4" />
      </Button>

      {isOpen && !disabled && (
        <div
          className={cn(
            "absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto",
            menuClassName,
          )}
          role="listbox"
          aria-activedescendant={selectedLabel || undefined}
        >
          {options.map((opt) => {
            const isSelected = opt === value
            return (
              <button
                type="button"
                key={opt}
                className={cn(
                  "w-full flex items-center p-3 hover:bg-gray-50 text-left",
                  isSelected && "bg-gray-50",
                )}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(opt)
                  setIsOpen(false)
                }}
              >
                <span className="flex-1 text-gray-900">{opt}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}


