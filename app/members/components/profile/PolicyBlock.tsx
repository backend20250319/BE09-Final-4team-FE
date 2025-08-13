import React from "react";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { WorkPolicy } from "./types";

interface PolicyBlockProps {
  workPolicies?: string[];
  isEditing: boolean;
  onChange?: (policies: string[]) => void;
  availablePolicies?: WorkPolicy[];
}

const defaultPolicies: WorkPolicy[] = [
  { id: 'fixed-9to6', label: '9-6 고정근무', description: '오전 9시 ~ 오후 6시 고정 근무', color: 'bg-blue-100 text-blue-800' },
  { id: 'flexible', label: '유연근무', description: '코어타임 내 자유로운 출퇴근', color: 'bg-green-100 text-green-800' },
  { id: 'autonomous', label: '자율근무', description: '업무 성과 기반 자율 근무', color: 'bg-purple-100 text-purple-800' },
  { id: 'remote', label: '재택근무', description: '원격 근무 가능', color: 'bg-orange-100 text-orange-800' },
  { id: 'hybrid', label: '하이브리드', description: '사무실 + 재택 혼합 근무', color: 'bg-indigo-100 text-indigo-800' }
];

export default function PolicyBlock({ 
  workPolicies = [], 
  isEditing, 
  onChange,
  availablePolicies = defaultPolicies
}: PolicyBlockProps) {
  const handleTogglePolicy = (policyId: string) => {
    if (!onChange) return;
    
    const isSelected = workPolicies.includes(policyId);
    const newPolicies = isSelected
      ? workPolicies.filter(id => id !== policyId)
      : [...workPolicies, policyId];
    
    onChange(newPolicies);
  };

  return (
    <div>

      {!isEditing ? (
        <div className="flex flex-wrap gap-2">
          {workPolicies.length > 0 ? (
            workPolicies.map((policyId) => {
              const policy = availablePolicies.find(p => p.id === policyId);
              return policy ? (
                <Badge 
                  key={policyId} 
                  className="bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 transition-all px-3 py-1"
                >
                  {policy.label}
                </Badge>
              ) : null;
            })
          ) : (
            <p className="text-gray-500 text-sm">설정된 근무 정책이 없습니다.</p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-gray-700 mb-3">적용할 근무 정책을 선택하세요:</p>
          <div className="grid grid-cols-1 gap-2">
            {availablePolicies.map((policy) => {
              const isSelected = workPolicies.includes(policy.id);
              return (
                <label
                  key={policy.id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                    isSelected 
                      ? "bg-blue-50 border border-blue-200" 
                      : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleTogglePolicy(policy.id)}
                    className="rounded bg-white border-gray-300"
                  />
                  <div className="flex-1">
                    <div className="text-gray-900 font-medium">{policy.label}</div>
                    <div className="text-gray-600 text-xs">{policy.description}</div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
