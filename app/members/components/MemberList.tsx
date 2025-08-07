"use client"

import { useState, useEffect, useRef } from 'react'
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone } from "lucide-react"

interface Employee {
  id: string
  name: string
  email: string
  phone?: string
  position: string
  department: string
  organization: string
  teams: string[]
  tags: string[]
  profileImage?: string
}

interface MemberListProps {
  employees: Employee[]
  searchTerm: string
  onSearchChange: (term: string) => void
  selectedOrg?: string
  placeholder?: string
}

export default function MemberList({
  employees,
  searchTerm,
  onSearchChange,
  selectedOrg,
  placeholder
}: MemberListProps) {
  const [displayedCount, setDisplayedCount] = useState(10)
  const [isLoading, setIsLoading] = useState(false)
  const observerRef = useRef<IntersectionObserver>()
  const loadingRef = useRef<HTMLDivElement>(null)

  // 무한 스크롤 설정
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && displayedCount < employees.length) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )

    if (loadingRef.current) {
      observer.observe(loadingRef.current)
    }

    observerRef.current = observer

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [displayedCount, employees.length, isLoading])

  // 검색어나 필터 변경 시 리셋
  useEffect(() => {
    setDisplayedCount(10)
  }, [searchTerm, selectedOrg])

  const loadMore = () => {
    if (isLoading || displayedCount >= employees.length) return
    
    setIsLoading(true)
    setTimeout(() => {
      setDisplayedCount(prev => Math.min(prev + 10, employees.length))
      setIsLoading(false)
    }, 300)
  }

  const displayedEmployees = employees.slice(0, displayedCount)

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          placeholder={placeholder || "직원명을 입력하여 검색"}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-white"
        />
      </div>

      {employees.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedEmployees.map(employee => (
            <div 
              key={employee.id} 
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={employee.profileImage} alt={employee.name} />
                  <AvatarFallback className="bg-gray-100">
                    {employee.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-gray-900">{employee.name}</span>
                    <span className="text-sm text-gray-500">{employee.position}</span>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{employee.email}</span>
                    </div>
                    {employee.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{employee.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <Search className="w-12 h-12 mb-4 text-gray-400" />
          <p className="text-lg font-medium mb-1">검색 결과가 없습니다.</p>
          {(selectedOrg || searchTerm) && (
            <p className="text-sm">
              다른 검색어나 필터 조건을 시도해보세요.
            </p>
          )}
        </div>
      )}

      {displayedCount < employees.length && (
        <div ref={loadingRef} className="flex justify-center py-4">
          {isLoading ? (
            <div className="flex items-center gap-2 text-gray-500">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-200 border-t-blue-600" />
              <span>로딩 중...</span>
            </div>
          ) : (
            <button 
              onClick={loadMore}
              className="text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-full hover:bg-gray-100"
            >
              더 보기 ({employees.length - displayedCount}명)
            </button>
          )}
        </div>
      )}
    </div>
  )
}