"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { colors, typography } from "@/lib/design-tokens";
import { Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function WorkPoliciesPage() {
  return (
    <MainLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className={`${typography.h1} text-gray-800 mb-2`}>
          근무 정책 설정
        </h1>
        <p className="text-gray-600">근무 관련 정책을 관리하세요</p>
      </div>

      <div className="space-y-6">
        {/* Placeholder for future content */}
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
          <div className="text-center">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              근무 정책 설정
            </h3>
            <p className="text-gray-500">
              근무 정책 설정 기능이 준비 중입니다.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
