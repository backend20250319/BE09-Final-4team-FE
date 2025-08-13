import React from "react";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { WorkPolicy } from "./types";

interface PolicyBlockProps {
  workPolicies?: string[];
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
  availablePolicies = defaultPolicies
}: PolicyBlockProps) {

  return (
    <div className="flex flex-wrap gap-2">
      {workPolicies.length > 0 ? (
        (() => {
          const firstPolicyId = workPolicies[0];
          const policy = availablePolicies.find(p => p.id === firstPolicyId);
          return policy ? (
            <Badge 
              className="bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 transition-all px-3 py-1"
            >
              {policy.label}
            </Badge>
          ) : null;
        })()
      ) : (
        <p className="text-gray-500 text-sm">설정된 근무 정책이 없습니다.</p>
      )}
    </div>
  );
}
