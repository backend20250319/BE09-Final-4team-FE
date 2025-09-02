"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";

import { colors, typography } from "@/lib/design-tokens";
import {
  Edit,
  Trash2,
  Briefcase,
  Home,
  RotateCcw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Calendar,
  Target,
  ArrowRight,
  Save,
  Clock,
} from "lucide-react";
import Link from "next/link";

// Type definitions
interface WorkPolicy {
  id: string;
  name: string;
  details: string;
  type: string;
  status: "active" | "pending" | "inactive";
  appliedPersonnel: number;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  workHours?: number;
  breakTime?: number;
  overtimeAllowed?: boolean;
  remoteWorkAllowed?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PolicyListProps {
  policies: WorkPolicy[];
  onEditPolicy: (policyId: string, data: Partial<WorkPolicy>) => void;
  onDeletePolicy: (policyId: string) => void;
}

// 정책 목록 컴포넌트
function PolicyList({
  policies,
  onEditPolicy,
  onDeletePolicy,
}: PolicyListProps): JSX.Element {
  const [editingPolicy, setEditingPolicy] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<Partial<WorkPolicy>>({});

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string): JSX.Element => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <AlertCircle className="w-4 h-4" />;
      case "inactive":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleEditPolicy = (policyId: string): void => {
    const policy = policies.find((p) => p.id === policyId);
    if (policy) {
      setEditingPolicy(policyId);
      setEditingData({ ...policy });
    }
  };

  const handleSavePolicy = (): void => {
    if (editingPolicy && editingData) {
      onEditPolicy(editingPolicy, editingData);
      setEditingPolicy(null);
      setEditingData({});
    }
  };

  const handleCancelEdit = (): void => {
    setEditingPolicy(null);
    setEditingData({});
  };

  const handleDeletePolicy = (policyId: string): void => {
    if (window.confirm("정말로 이 정책을 삭제하시겠습니까?")) {
      onDeletePolicy(policyId);
    }
  };

  const handleInputChange = (field: keyof WorkPolicy, value: any): void => {
    setEditingData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`${typography.h1} text-gray-800 mb-2`}>
              근무 정책 관리
            </h1>
          </div>
          <Link href="/settings/workpolicies/create">
            <GradientButton variant="primary" className="px-6">
              정책 생성 <ArrowRight className="w-4 h-4 ml-2" />
            </GradientButton>
          </Link>
        </div>
      </div>

      {/* Policy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {policies.map((policy) => {
          const IconComponent = policy.icon;
          const isEditing = editingPolicy === policy.id;
          const displayData = isEditing ? editingData : policy;

          return (
            <GlassCard key={policy.id} className="p-6 relative">
              {/* Edit/Delete Buttons */}
              <div className="absolute top-4 right-4 flex gap-2">
                {!isEditing && (
                  <>
                    <button
                      onClick={() => handleEditPolicy(policy.id)}
                      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                      title="편집"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePolicy(policy.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Policy Header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-10 h-10 bg-gradient-to-r ${displayData.color} rounded-lg flex items-center justify-center`}
                >
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  {isEditing ? (
                    <input
                      type="text"
                      value={displayData.name || ""}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="w-full text-lg font-semibold text-gray-800 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <h3 className={`${typography.h3} text-gray-800`}>
                      {displayData.name}
                    </h3>
                  )}
                  {isEditing ? (
                    <input
                      type="text"
                      value={displayData.details || ""}
                      onChange={(e) =>
                        handleInputChange("details", e.target.value)
                      }
                      className="w-full text-sm text-gray-600 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl px-3 py-1 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-sm text-gray-600">
                      {displayData.details}
                    </p>
                  )}
                </div>
              </div>

              {/* Policy Details */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">적용 인원</span>
                  {isEditing ? (
                    <input
                      type="number"
                      value={displayData.appliedPersonnel || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "appliedPersonnel",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-20 text-right font-medium text-gray-800 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <span className="font-medium text-gray-800">
                      {displayData.appliedPersonnel}명
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">근무 시간</span>
                  {isEditing ? (
                    <input
                      type="number"
                      value={displayData.workHours || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "workHours",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-20 text-right font-medium text-gray-800 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <span className="font-medium text-gray-800">
                      {displayData.workHours}시간
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">휴식 시간</span>
                  {isEditing ? (
                    <input
                      type="number"
                      value={displayData.breakTime || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "breakTime",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-20 text-right font-medium text-gray-800 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <span className="font-medium text-gray-800">
                      {displayData.breakTime}분
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">상태</span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      displayData.status || "inactive"
                    )}`}
                  >
                    {getStatusIcon(displayData.status || "inactive")}
                    {displayData.status === "active" && "활성"}
                    {displayData.status === "pending" && "대기"}
                    {displayData.status === "inactive" && "비활성"}
                  </span>
                </div>
              </div>

              {/* Edit Actions */}
              {isEditing && (
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleSavePolicy}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    저장
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    취소
                  </button>
                </div>
              )}
            </GlassCard>
          );
        })}
      </div>
    </>
  );
}

export default function WorkPoliciesPage(): JSX.Element {
  // 샘플 데이터
  const [policies, setPolicies] = useState<WorkPolicy[]>([
    {
      id: "1",
      name: "기본 근무 정책",
      details: "9시 출근, 6시 퇴근의 기본 근무 정책",
      type: "fixed",
      status: "active",
      appliedPersonnel: 45,
      color: "from-blue-500 to-blue-600",
      icon: Briefcase,
      workHours: 8,
      breakTime: 60,
      overtimeAllowed: true,
      remoteWorkAllowed: false,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-15",
    },
    {
      id: "2",
      name: "유연 근무 정책",
      details: "코어 타임을 제외한 유연한 근무 시간",
      type: "flexible",
      status: "active",
      appliedPersonnel: 23,
      color: "from-green-500 to-green-600",
      icon: Home,
      workHours: 8,
      breakTime: 60,
      overtimeAllowed: true,
      remoteWorkAllowed: true,
      createdAt: "2024-01-10",
      updatedAt: "2024-01-20",
    },
    {
      id: "3",
      name: "교대 근무 정책",
      details: "3교대 근무 시스템",
      type: "shift",
      status: "pending",
      appliedPersonnel: 12,
      color: "from-purple-500 to-purple-600",
      icon: RotateCcw,
      workHours: 8,
      breakTime: 30,
      overtimeAllowed: false,
      remoteWorkAllowed: false,
      createdAt: "2024-01-15",
      updatedAt: "2024-01-25",
    },
    {
      id: "4",
      name: "시차 출근 정책",
      details: "개인별 시차 출근 허용",
      type: "staggered",
      status: "inactive",
      appliedPersonnel: 8,
      color: "from-orange-500 to-orange-600",
      icon: Clock,
      workHours: 8,
      breakTime: 60,
      overtimeAllowed: true,
      remoteWorkAllowed: true,
      createdAt: "2024-01-20",
      updatedAt: "2024-01-30",
    },
  ]);

  const handleEditPolicy = (
    policyId: string,
    data: Partial<WorkPolicy>
  ): void => {
    setPolicies((prev) =>
      prev.map((policy) =>
        policy.id === policyId
          ? { ...policy, ...data, updatedAt: new Date().toISOString() }
          : policy
      )
    );
  };

  const handleDeletePolicy = (policyId: string): void => {
    setPolicies((prev) => prev.filter((policy) => policy.id !== policyId));
  };

  return (
    <MainLayout>
      <PolicyList
        policies={policies}
        onEditPolicy={handleEditPolicy}
        onDeletePolicy={handleDeletePolicy}
      />
    </MainLayout>
  );
}
