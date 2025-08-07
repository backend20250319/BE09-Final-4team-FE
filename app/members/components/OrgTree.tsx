"use client"

import { useState } from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Search,
  ChevronDown,
  ChevronRight,
  Users,
  Building2
} from "lucide-react"

interface OrgNode {
  name: string
  count: number
  children?: OrgNode[]
  isExpanded?: boolean
}

interface Employee {
  id: string
  organization: string
  teams?: string[]
}

interface OrgTreeProps {
  orgStructure: OrgNode[]
  employees: Employee[]
  selectedOrg?: string
  onOrgSelect: (orgName: string) => void
}

export default function OrgTree({
  orgStructure,
  employees,
  selectedOrg,
  onOrgSelect
}: OrgTreeProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [showSubMembers, setShowSubMembers] = useState(true)

  const OrgTreeNode = ({ node }: { node: OrgNode }) => {
    const [isExpanded, setIsExpanded] = useState(node.isExpanded || false)
    const hasChildren = node.children && node.children.length > 0
    const isSelected = node.name === selectedOrg

    const handleClick = () => {
      if (hasChildren) {
        setIsExpanded(!isExpanded)
      }
      onOrgSelect(node.name)
    }

    const matchesSearch = searchTerm
      ? node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.children?.some(child => 
          child.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : true

    if (!matchesSearch) return null

    return (
      <div>
        <button
          className={`
            w-full text-left px-3 py-2 rounded-lg transition-colors
            ${isSelected ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}
          `}
          onClick={handleClick}
        >
          <div className="flex items-center gap-2">
            {hasChildren ? (
              <div className={`
                p-1 rounded-md transition-colors
                ${isSelected ? 'hover:bg-blue-100' : 'hover:bg-gray-100'}
              `}>
                {isExpanded ? (
                  <ChevronDown className={`w-4 h-4 ${isSelected ? 'text-blue-500' : 'text-gray-400'}`} />
                ) : (
                  <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-blue-500' : 'text-gray-400'}`} />
                )}
              </div>
            ) : (
              <div className="w-6" />
            )}
            <span className="flex-1 text-sm">
              {node.name}
            </span>
            <Badge variant="secondary" className={`
              text-xs px-2 py-0.5
              ${isSelected 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-600'
              }
            `}>
              {node.count}명
            </Badge>
          </div>
        </button>

        {hasChildren && isExpanded && (
          <div className={`
            mt-1 ml-3 pl-3 border-l
            ${isSelected ? 'border-blue-200' : 'border-gray-200'}
          `}>
            {node.children.map((child, index) => (
              <OrgTreeNode key={index} node={child} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="조직명으로 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 text-sm"
        />
      </div>

      <div className="space-y-2">
        {orgStructure.map((node, index) => (
          <OrgTreeNode key={index} node={node} />
        ))}
      </div>
    </div>
  )
}
