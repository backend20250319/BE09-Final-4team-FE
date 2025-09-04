import React from "react";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { WorkPolicy } from "./types";
import { WorkPolicyResponseDto } from "@/lib/services/attendance/types";

interface PolicyBlockProps {
  workPolicies?: string[];
  availablePolicies?: WorkPolicyResponseDto[];
}

export default function PolicyBlock({ 
  workPolicies = [], 
  availablePolicies = []
}: PolicyBlockProps) {

  return (
    <div className="flex flex-wrap gap-2">
      {workPolicies.length > 0 ? (
        (() => {
          const firstPolicyId = workPolicies[0];
          const policy = availablePolicies.find(p => p.id.toString() === firstPolicyId);
          return policy ? (
            <Badge 
              className="bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 transition-all px-3 py-1"
            >
              {policy.name}
            </Badge>
          ) : null;
        })()
      ) : (
        <p className="text-gray-500 text-sm">설정된 근무 정책이 없습니다.</p>
      )}
    </div>
  );
}
