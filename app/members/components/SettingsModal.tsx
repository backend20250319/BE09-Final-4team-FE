"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  UserPlus, 
  Building2, 
  Crown, 
  Shield, 
  Briefcase, 
  Star,
  ChevronRight,
  X
} from "lucide-react";
import OrganizationSettingsModal from './OrganizationSettingsModal';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMember: () => void;
}

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
    icon: Crown
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
    icon: Star
  }
];

export default function SettingsModal({ isOpen, onClose, onAddMember }: SettingsModalProps) {
  const [showOrgSettings, setShowOrgSettings] = useState(false);

  const handleMenuItemClick = (itemId: number) => {
    if (itemId === 1) {
      onAddMember();
    } else if (itemId === 2) {
      setShowOrgSettings(true);
    } else {
      alert('준비 중인 기능입니다.');
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">구성원 설정</h2>
                <p className="text-sm text-gray-600 mt-1">구성원 관리 옵션을 선택하세요</p>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Card 
                  key={item.id} 
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleMenuItemClick(item.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{item.title}</h3>
                          <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      <OrganizationSettingsModal
        isOpen={showOrgSettings}
        onClose={() => setShowOrgSettings(false)}
      />
    </>
  );
} 