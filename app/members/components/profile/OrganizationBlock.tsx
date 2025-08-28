import React from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2 } from "lucide-react";
import { TeamInfo } from "./types";

interface OrgBlockProps {
  main?: TeamInfo | null;
  concurrent?: TeamInfo[];
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
  user,
}: OrgBlockProps) {
  return (
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
                <Building2 className="w-3.5 h-3.5" />
                메인 조직
              </div>
            </div>
            <div className="mb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-gray-500" />
                <span className="text-lg font-bold text-gray-900">경영진</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-500 p-4 bg-gray-50 rounded-lg">
            메인 조직 정보가 없습니다.
          </div>
        )}
      </TabsContent>

      <TabsContent value="concurrent" className="mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-gray-500" />
              <div className="text-sm font-semibold text-gray-900 truncate">
                경영팀
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-gray-500" />
              <div className="text-sm font-semibold text-gray-900 truncate">
                인사팀
              </div>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
