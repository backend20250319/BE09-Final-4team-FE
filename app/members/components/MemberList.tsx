"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search, Mail, Phone, Calendar, Building2, Crown } from "lucide-react";
import ProfileModal from './ProfileModal';

interface Employee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  joinDate: string;
  organization?: string;
  organizations?: string[];
  position: string;
  role: string;
  job: string;
  rank?: string;
  isAdmin: boolean;
  teams: string[];
  profileImage?: string;
  selfIntroduction?: string;
  remainingLeave?: number;
  weeklyWorkHours?: number;
  weeklySchedule?: Array<{
    title: string;
    date: string;
    time?: string;
  }>;
}

interface MemberListProps {
  employees: Employee[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedOrg: string | null;
  placeholder?: string;
  onEmployeeUpdate?: (updatedEmployee: Employee) => void;
}

const getTeamColor = (team: string) => {
  const teamColors: Record<string, string> = {
    '개발팀': '#10b981',
    '기획팀': '#3b82f6',
    '디자인팀': '#8b5cf6',
    'QA팀': '#f59e0b',
    '마케팅팀': '#ec4899',
    '프론트엔드팀': '#3b82f6',
    '백엔드팀': '#10b981',
    '모바일팀': '#f59e0b',
    'UI팀': '#8b5cf6',
    'UX팀': '#ec4899',
    '그래픽팀': '#ef4444',
    '브랜드팀': '#06b6d4',
    '콘텐츠팀': '#84cc16',
    '홍보팀': '#f97316',
    '경영팀': '#6366f1',
    '인사팀': '#ec4899'
  };
  return teamColors[team] || '#6b7280';
};

const getProfileImage = (name: string) => {
      const hash = name.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
      return `https://picsum.photos/96/96?random=${hash}`;
};

export default function MemberList({ 
  employees, 
  searchTerm, 
  onSearchChange, 
  selectedOrg, 
  placeholder,
  onEmployeeUpdate
}: MemberListProps) {
  const [displayedCount, setDisplayedCount] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && displayedCount < employees.length) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [displayedCount, employees.length, isLoading]);

  useEffect(() => {
    setDisplayedCount(10);
  }, [searchTerm, selectedOrg]);

  const loadMore = () => {
    if (isLoading || displayedCount >= employees.length) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      setDisplayedCount(prev => Math.min(prev + 10, employees.length));
      setIsLoading(false);
    }, 300);
  };

  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowProfileModal(true);
  };

  const handleProfileModalClose = () => {
    setShowProfileModal(false);
    setSelectedEmployee(null);
  };

  const handleProfileUpdate = (updatedEmployee: Employee) => {
    onEmployeeUpdate?.(updatedEmployee);
  };

  const displayedEmployees = employees.slice(0, displayedCount);

  const EmployeeCard = ({ employee }: { employee: Employee }) => {
    const teams = employee.teams || [employee.organization].filter(Boolean);
    
    const displayTeams = teams.slice(0, 3);

    console.log(`Employee ${employee.name}:`, {
      profileImage: employee.profileImage,
      hasProfileImage: !!employee.profileImage,
      fallbackImage: getProfileImage(employee.name)
    });

    return (
      <Card 
        className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
        onClick={() => handleEmployeeClick(employee)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12 bg-transparent">
                <AvatarImage 
                  src={employee.profileImage || getProfileImage(employee.name)}
                  className="bg-transparent"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=ec4899&color=fff&size=96&font-size=0.4&length=1`;
                  }}
                />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  {employee.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{employee.name}</h3>
                  {employee.isAdmin && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      <Crown className="w-3 h-3 mr-1" />
                      관리자
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600">{employee.position}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {displayTeams.map((team, index) => (
                <Badge 
                  key={index}
                  variant="secondary" 
                  className="text-xs"
                  style={{ backgroundColor: getTeamColor(team), color: 'white' }}
                >
                  {team}
                </Badge>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="w-4 h-4" />
              <span>{employee.email}</span>
            </div>
            {employee.phone && (
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{employee.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>입사일: {new Date(employee.joinDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Building2 className="w-4 h-4" />
              <span>{employee.job}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          placeholder={placeholder || "직원명을 입력하여 검색"}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedEmployees.map(employee => (
          <EmployeeCard key={employee.id} employee={employee} />
        ))}
      </div>
      
      {displayedCount < employees.length && (
        <div ref={loadingRef} className="flex justify-center py-4">
          {isLoading ? (
            <div className="flex items-center gap-2 text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              <span>로딩 중...</span>
            </div>
          ) : (
            <div className="text-center text-gray-500 text-sm">
              스크롤하여 더 많은 직원 보기 ({employees.length - displayedCount}명 남음)
            </div>
          )}
        </div>
      )}

      {employees.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>검색 결과가 없습니다.</p>
          {(selectedOrg || searchTerm) && (
            <p className="text-sm mt-2">
              필터 조건을 변경해보세요.
            </p>
          )}
        </div>
      )}

      <ProfileModal
        isOpen={showProfileModal}
        onClose={handleProfileModalClose}
        employee={selectedEmployee}
        onUpdate={handleProfileUpdate}
      />
    </div>
  );
} 