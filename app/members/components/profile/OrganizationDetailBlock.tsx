import React from "react";
import { Badge } from "@/components/ui/badge";
import { Building2, Shield, Medal, Briefcase, ListChecks, Crown } from "lucide-react";

interface OrganizationDetailBlockProps {
  main?: {
    teamId: string;
    name: string;
  } | null;
  user?: {
    rank?: string;
    position?: string;
    job?: string;
    role?: string;
  };
}

export default function OrganizationDetailBlock({
  main,
  user
}: OrganizationDetailBlockProps) {
  const metaItems = [
    { key: 'rank', label: '직급', value: user?.rank || '', icon: Medal },
    { key: 'position', label: '직위', value: user?.position || '', icon: Shield },
    { key: 'job', label: '직책', value: user?.job || '', icon: Briefcase },
    { key: 'role', label: '직무', value: user?.role || '', icon: ListChecks },
  ].filter((m) => Boolean(m.value));

  return (
    <div className="space-y-4">
      {/* 조직 상세 정보 */}
      {main && (
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs uppercase tracking-wide text-gray-600 font-semibold">
              MAIN TEAM
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
              <Crown className="w-3 h-3 mr-1" />
              메인 조직
            </Badge>
          </div>
          
          <div className="mb-4">
            <span className="text-lg font-bold text-gray-900">{main.name}</span>
            <div className="text-sm text-gray-600 mt-1">개발본부</div>
          </div>

          {/* 직원 정보 배지들 */}
          {metaItems.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {metaItems.map((m) => {
                const Icon = m.icon;
                return (
                  <Badge 
                    key={m.key} 
                    variant="outline"
                    className="inline-flex items-center gap-1.5 bg-white border-gray-200 px-3 py-1 text-xs"
                  >
                    <Icon className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-gray-600">{m.label}</span>
                    <span className="font-medium text-gray-900">{m.value}</span>
                  </Badge>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 조직 정보가 없는 경우 */}
      {!main && (
        <div className="text-sm text-gray-500 p-4 bg-gray-50 rounded-lg border border-gray-200">
          조직 정보가 없습니다.
        </div>
      )}
    </div>
  );
}