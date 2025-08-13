import React from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Shield, Medal, Briefcase, ListChecks } from "lucide-react";
import { TeamInfo } from "./types";

interface OrgBlockProps {
  main?: TeamInfo | null;
  concurrent?: TeamInfo[];
  isEditing: boolean;
  onMainChange?: (teamId: string | null) => void;
  onConcurrentChange?: (teamIds: string[]) => void;
  teamsOptions?: TeamInfo[];
  user?: {
    rank?: string;
    position?: string;
    job?: string;
    role?: string;
  };
}

export default function OrganizationBlock({
  main,
  concurrent = [],
  isEditing,
  onMainChange,
  onConcurrentChange,
  teamsOptions = [],
  user
}: OrgBlockProps) {
  const metaItems = [
    { key: 'rank', label: '직급', value: user?.rank || '', icon: Medal },
    { key: 'position', label: '직위', value: user?.position || '', icon: Shield },
    { key: 'job', label: '직책', value: user?.job || '', icon: Briefcase },
    { key: 'role', label: '직무', value: user?.role || '', icon: ListChecks },
  ].filter((m) => Boolean(m.value));

  return (
    <div>

      {!isEditing ? (
        <Tabs defaultValue="main" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 border border-gray-200">
            <TabsTrigger 
              value="main" 
              className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-600"
            >
              메인 조직
            </TabsTrigger>
            <TabsTrigger 
              value="concurrent" 
              className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-600"
            >
              겸직 조직
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="main" className="mt-4">
            {main ? (
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs uppercase tracking-wide text-gray-600 font-semibold">
                    Main Team
                  </div>
                  <div className="inline-flex items-center gap-1 text-xs text-gray-500">
                    <Building2 className="w-3.5 h-3.5" />메인 조직
                  </div>
                </div>
                <div className="mb-3">
                  <span className="text-lg font-bold text-gray-900">{main.name}</span>
                </div>
                {metaItems.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {metaItems.map((m) => {
                      const Icon = m.icon;
                      return (
                        <span 
                          key={m.key} 
                          className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 border border-gray-200 px-3 py-1 text-xs text-gray-700"
                        >
                          <Icon className="w-3.5 h-3.5 text-gray-500" />
                          <span className="text-gray-600">{m.label}</span>
                          <span className="font-medium text-gray-900">{m.value}</span>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-gray-500 p-4 bg-gray-50 rounded-lg">
                메인 조직 정보가 없습니다.
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="concurrent" className="mt-4">
            {concurrent.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {concurrent.map((team) => (
                  <div 
                    key={team.teamId} 
                    className="bg-gray-50 rounded-lg border border-gray-200 p-3"
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-500" />
                      <div className="text-sm font-semibold text-gray-900 truncate">
                        {team.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 p-4 bg-gray-50 rounded-lg">
                겸직 조직이 없습니다.
              </div>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <div className="space-y-4">
          {/* Main Team Selection */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">메인 조직</label>
            <select
              value={main?.teamId ?? ""}
              onChange={(e) => onMainChange?.(e.target.value || null)}
              className="w-full rounded-md p-3 bg-white border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">-- 메인 조직 선택 --</option>
              {teamsOptions.map((t) => (
                <option key={t.teamId} value={t.teamId} className="bg-white">
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Concurrent Teams Selection */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">겸직 조직</label>
            <div className="max-h-40 overflow-y-auto bg-gray-50 rounded-md p-2 border border-gray-200">
              {teamsOptions.map((t) => {
                const checked = concurrent.some((c) => c.teamId === t.teamId);
                const disabled = main?.teamId === t.teamId;
                return (
                  <label 
                    key={t.teamId} 
                    className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${
                      disabled 
                        ? "opacity-40 pointer-events-none" 
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={disabled}
                      onChange={(e) => {
                        const currentIds = concurrent.map((c) => c.teamId);
                        const next = checked
                          ? currentIds.filter((id) => id !== t.teamId)
                          : [...currentIds, t.teamId];
                        onConcurrentChange?.(next);
                      }}
                      className="rounded bg-white border-gray-300"
                    />
                    <span className="text-gray-900 text-sm">{t.name}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
