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

// 정책 목록 컴포넌트
function PolicyList({ policies, onEditPolicy, onDeletePolicy }) {
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [editingData, setEditingData] = useState({});

  const getStatusColor = (status) => {
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

  const getStatusIcon = (status) => {
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

  const handleEditPolicy = (policyId) => {
    const policy = policies.find((p) => p.id === policyId);
    if (policy) {
      setEditingPolicy(policyId);
      setEditingData({ ...policy });
    }
  };

  const handleSavePolicy = () => {
    if (editingPolicy && editingData) {
      onEditPolicy(editingPolicy, editingData);
      setEditingPolicy(null);
      setEditingData({});
    }
  };

  const handleCancelEdit = () => {
    setEditingPolicy(null);
    setEditingData({});
  };

  const handleDeletePolicy = (policyId) => {
    if (window.confirm("정말로 이 정책을 삭제하시겠습니까?")) {
      onDeletePolicy(policyId);
    }
  };

  const handleInputChange = (field, value) => {
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

                {displayData.breakTime && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">휴게시간</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={displayData.breakTime || ""}
                        onChange={(e) =>
                          handleInputChange("breakTime", e.target.value)
                        }
                        className="w-24 text-right font-medium text-gray-800 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <span className="font-medium text-gray-800">
                        {displayData.breakTime}
                      </span>
                    )}
                  </div>
                )}

                {displayData.coreTime && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">코어타임</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={displayData.coreTime || ""}
                        onChange={(e) =>
                          handleInputChange("coreTime", e.target.value)
                        }
                        className="w-32 text-right font-medium text-gray-800 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <span className="font-medium text-gray-800">
                        {displayData.coreTime}
                      </span>
                    )}
                  </div>
                )}

                {displayData.approvalRequired && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">승인 필요</span>
                    {isEditing ? (
                      <select
                        value={displayData.approvalRequired || ""}
                        onChange={(e) =>
                          handleInputChange("approvalRequired", e.target.value)
                        }
                        className="w-16 text-right font-medium text-gray-800 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="예">예</option>
                        <option value="아니오">아니오</option>
                      </select>
                    ) : (
                      <span className="font-medium text-gray-800">
                        {displayData.approvalRequired}
                      </span>
                    )}
                  </div>
                )}

                {displayData.shiftCycle && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">교대 주기</span>
                    {isEditing ? (
                      <select
                        value={displayData.shiftCycle || ""}
                        onChange={(e) =>
                          handleInputChange("shiftCycle", e.target.value)
                        }
                        className="w-20 text-right font-medium text-gray-800 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="주간">주간</option>
                        <option value="월간">월간</option>
                        <option value="분기">분기</option>
                      </select>
                    ) : (
                      <span className="font-medium text-gray-800">
                        {displayData.shiftCycle}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Status Badge */}
              <div className="mt-4 flex justify-end">
                {isEditing ? (
                  <select
                    value={displayData.status || ""}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value)
                    }
                    className="px-3 py-1 rounded-full text-xs font-medium bg-white/60 backdrop-blur-sm border border-gray-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="active">활성</option>
                    <option value="pending">대기</option>
                    <option value="inactive">비활성</option>
                  </select>
                ) : (
                  <div
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      displayData.status
                    )}`}
                  >
                    {getStatusIcon(displayData.status)}
                    {displayData.statusText}
                  </div>
                )}
              </div>

              {/* Edit Mode Action Buttons */}
              {isEditing && (
                <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-200/50">
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100/80 rounded-lg transition-colors"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleSavePolicy}
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-green-500/25"
                  >
                    <Save className="w-4 h-4" />
                    저장
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

export default function WorkPoliciesPage() {
  const [policies, setPolicies] = useState([
    {
      id: 1,
      name: "고정 근무제",
      type: "fixed",
      icon: Calendar,
      color: colors.primary.blue,
      details: "08:30 - 17:30 (8시간)",
      appliedPersonnel: 124,
      breakTime: "1시간 30분",
      status: "active",
      statusText: "활성",
    },
    {
      id: 2,
      name: "교대 근무제",
      type: "shift",
      icon: RotateCcw,
      color: colors.status.info.gradient,
      details: "3교대 24시간",
      appliedPersonnel: 18,
      shiftCycle: "주간",
      status: "active",
      statusText: "활성",
    },
    {
      id: 3,
      name: "시차 근무제",
      type: "time",
      icon: Clock,
      color: colors.status.success.gradient,
      details: "09:00 - 11:00 출근 가능",
      appliedPersonnel: 56,
      workHours: "8시간",
      status: "active",
      statusText: "활성",
    },
    {
      id: 4,
      name: "선택 근무제",
      type: "choice",
      icon: Target,
      color: colors.status.warning.gradient,
      details: "주 40시간 자율근무",
      appliedPersonnel: 28,
      coreTime: "11:00-16:00",
      status: "active",
      statusText: "활성",
    },
    {
      id: 5,
      name: "2교대 근무제",
      type: "shift",
      icon: RotateCcw,
      color: colors.status.error.gradient,
      details: "2교대 16시간",
      appliedPersonnel: 25,
      shiftCycle: "일간",
      status: "active",
      statusText: "활성",
    },
    {
      id: 6,
      name: "선택 코어 근무제",
      type: "choice",
      icon: Target,
      color: colors.status.info.gradient,
      details: "주 35시간 자율근무",
      appliedPersonnel: 35,
      coreTime: "13:00-17:00",
      status: "pending",
      statusText: "대기",
    },
  ]);

  const handleEditPolicy = (policyId, updatedData) => {
    setPolicies((prev) =>
      prev.map((policy) =>
        policy.id === policyId ? { ...policy, ...updatedData } : policy
      )
    );
  };

  const handleDeletePolicy = (policyId) => {
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
