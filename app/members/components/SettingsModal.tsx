"use client"

import { useState } from 'react'
import { ChevronRight, UserPlus, Building2, Star, Shield, Briefcase, Award } from 'lucide-react'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  onAddMember: () => void
}

const SettingsModal = ({ isOpen, onClose, onAddMember }: SettingsModalProps) => {
  if (!isOpen) return null

  const menuItems = [
    {
      id: 1,
      title: "구성원 추가",
      description: "새로운 구성원을 조직에 등록합니다",
      icon: UserPlus
    },
    {
      id: 2,
      title: "조직 관리",
      description: "부서 및 팀 구조를 관리합니다",
      icon: Building2
    },
    {
      id: 3,
      title: "직급 관리",
      description: "직급 체계를 설정하고 관리합니다",
      icon: Star
    },
    {
      id: 4,
      title: "역할 권한",
      description: "사용자 역할과 권한을 설정합니다",
      icon: Shield
    },
    {
      id: 5,
      title: "업무 분류",
      description: "업무 카테고리를 관리합니다",
      icon: Briefcase
    },
    {
      id: 6,
      title: "등급 설정",
      description: "구성원 등급을 설정하고 관리합니다",
      icon: Award
    }
  ]

  const handleMenuItemClick = (itemId: number) => {
    if (itemId === 1) {
      onAddMember()
    } else {
      alert('준비 중인 기능입니다.')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-[90%] max-w-[500px] max-h-[80vh] overflow-hidden shadow-2xl animate-in slide-in-from-top-4 duration-300" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 pb-4 border-b border-gray-200 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-900 m-0">구성원 설정</h2>
            <p className="text-sm text-gray-500 mt-1 mb-0">구성원 관리 옵션을 선택하세요</p>
          </div>
          <button 
            className="bg-none border-none text-gray-500 cursor-pointer p-2 rounded-lg transition-all duration-200 text-2xl leading-none min-w-10 min-h-10 flex items-center justify-center flex-shrink-0 hover:bg-gray-100 hover:text-gray-700 hover:scale-105 active:scale-95 active:bg-gray-200"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        
        <div className="p-4 pt-4 pb-6 max-h-[calc(80vh-120px)] overflow-y-auto">
          <div className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="bg-gray-50 border border-gray-200 rounded-xl p-4 cursor-pointer transition-all duration-200 flex items-center gap-4 hover:bg-gray-100 hover:border-gray-300 hover:-translate-y-px"
                onClick={() => handleMenuItemClick(item.id)}
              >
                <div className="w-6 h-6 text-blue-600 flex-shrink-0">
                  <item.icon size={20} color="#3B82F6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900 m-0 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500 m-0 leading-relaxed">{item.description}</p>
                </div>
                <div className="w-4 h-4 text-gray-400 flex-shrink-0">
                  <ChevronRight size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsModal
