"use client";

import { useState, useEffect } from "react";
import React from "react";
import {
  Bell,
  User,
  Calendar,
  Users,
  Settings,
  FileText,
  Megaphone,
  ClipboardList,
  Briefcase,
  Home,
  Plus,
  CalendarDays,
  Gift,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MainLayout } from "@/components/layout/main-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { colors, typography } from "@/lib/design-tokens";
import VacationModal from "./vacationmodal";
import StyledPaging from "@/components/paging/styled-paging";

export default function VacationPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("2025.10~2025.12");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // 1년을 3개월씩 나눈 기간들
  const periods = [
    {
      value: "2025.10~2025.12",
      label: "2025.10~2025.12",
      months: [10, 11, 12],
    },
    { value: "2025.07~2025.09", label: "2025.07~2025.09", months: [7, 8, 9] },
    { value: "2025.04~2025.06", label: "2025.04~2025.06", months: [4, 5, 6] },
    { value: "2025.01~2025.03", label: "2025.01~2025.03", months: [1, 2, 3] },
  ];

  // 더미 데이터 - 실제로는 props나 API에서 받아올 데이터
  const vacationRecords = [
    {
      id: 1,
      type: "연차",
      startDate: "2025.08.01",
      endDate: "2025.08.01",
      days: 1,
      reason: "[2025-08-01] 연차 사용 신청합니다.",
      status: "승인됨",
      statusColor:
        colors.status.info.bg +
        " " +
        colors.status.info.text +
        " " +
        colors.status.info.border,
    },
    {
      id: 2,
      type: "연차",
      startDate: "2025.08.05",
      endDate: "2025.08.05",
      days: 1,
      reason: "[2025-08-05] 개인 사정으로 인한 연차 신청",
      status: "대기중",
      statusColor:
        colors.status.warning.bg +
        " " +
        colors.status.warning.text +
        " " +
        colors.status.warning.border,
    },
    {
      id: 3,
      type: "연차",
      startDate: "2025.07.28",
      endDate: "2025.07.28",
      days: 1,
      reason: "[2025-07-28] 병원 진료로 인한 연차 신청",
      status: "승인됨",
      statusColor:
        colors.status.info.bg +
        " " +
        colors.status.info.text +
        " " +
        colors.status.info.border,
    },
    {
      id: 4,
      type: "연차",
      startDate: "2025.07.15",
      endDate: "2025.07.16",
      days: 2,
      reason: "[2025-07-15] 여행 계획으로 인한 연차 신청",
      status: "반려됨",
      statusColor:
        colors.status.error.bg +
        " " +
        colors.status.error.text +
        " " +
        colors.status.error.border,
    },
    {
      id: 5,
      type: "반차",
      startDate: "2025.07.10",
      endDate: "오후",
      days: 0.5,
      reason: "[2025-07-10] 오후 개인 업무 처리",
      status: "승인됨",
      statusColor:
        colors.status.info.bg +
        " " +
        colors.status.info.text +
        " " +
        colors.status.info.border,
    },
    {
      id: 6,
      type: "연차",
      startDate: "2025.07.03",
      endDate: "2025.07.03",
      days: 1,
      reason: "[2025-07-03] 가족 행사 참석",
      status: "승인됨",
      statusColor:
        colors.status.info.bg +
        " " +
        colors.status.info.text +
        " " +
        colors.status.info.border,
    },
    {
      id: 7,
      type: "연차",
      startDate: "2025.06.15",
      endDate: "2025.06.16",
      days: 2,
      reason: "[2025-06-15] 가족 여행",
      status: "승인됨",
      statusColor:
        colors.status.info.bg +
        " " +
        colors.status.info.text +
        " " +
        colors.status.info.border,
    },
    {
      id: 8,
      type: "반차",
      startDate: "2025.06.10",
      endDate: "오전",
      days: 0.5,
      reason: "[2025-06-10] 오전 개인 업무",
      status: "승인됨",
      statusColor:
        colors.status.info.bg +
        " " +
        colors.status.info.text +
        " " +
        colors.status.info.border,
    },
    {
      id: 9,
      type: "연차",
      startDate: "2025.05.20",
      endDate: "2025.05.20",
      days: 1,
      reason: "[2025-05-20] 병원 진료",
      status: "승인됨",
      statusColor:
        colors.status.info.bg +
        " " +
        colors.status.info.text +
        " " +
        colors.status.info.border,
    },
    {
      id: 10,
      type: "연차",
      startDate: "2025.04.15",
      endDate: "2025.04.15",
      days: 1,
      reason: "[2025-04-15] 개인 사정",
      status: "승인됨",
      statusColor:
        colors.status.info.bg +
        " " +
        colors.status.info.text +
        " " +
        colors.status.info.border,
    },
    {
      id: 11,
      type: "연차",
      startDate: "2025.03.25",
      endDate: "2025.03.25",
      days: 1,
      reason: "[2025-03-25] 가족 행사",
      status: "승인됨",
      statusColor:
        colors.status.info.bg +
        " " +
        colors.status.info.text +
        " " +
        colors.status.info.border,
    },
    {
      id: 12,
      type: "연차",
      startDate: "2025.02.10",
      endDate: "2025.02.10",
      days: 1,
      reason: "[2025-02-10] 개인 업무",
      status: "승인됨",
      statusColor:
        colors.status.info.bg +
        " " +
        colors.status.info.text +
        " " +
        colors.status.info.border,
    },
    {
      id: 13,
      type: "연차",
      startDate: "2025.01.05",
      endDate: "2025.01.05",
      days: 1,
      reason: "[2025-01-05] 신년 연차",
      status: "승인됨",
      statusColor:
        colors.status.info.bg +
        " " +
        colors.status.info.text +
        " " +
        colors.status.info.border,
    },
    {
      id: 14,
      type: "연차",
      startDate: "2025.12.20",
      endDate: "2025.12.20",
      days: 1,
      reason: "[2025-12-20] 연말 정리",
      status: "대기중",
      statusColor:
        colors.status.warning.bg +
        " " +
        colors.status.warning.text +
        " " +
        colors.status.warning.border,
    },
    {
      id: 15,
      type: "연차",
      startDate: "2025.11.15",
      endDate: "2025.11.15",
      days: 1,
      reason: "[2025-11-15] 개인 사정",
      status: "승인됨",
      statusColor:
        colors.status.info.bg +
        " " +
        colors.status.info.text +
        " " +
        colors.status.info.border,
    },
  ];

  // 날짜 필터링 함수
  const filterVacationRecords = () => {
    if (!startDate || !endDate) {
      return vacationRecords;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    return vacationRecords.filter((record) => {
      const recordStartDate = new Date(record.startDate.replace(/\./g, "-"));
      const recordEndDate = new Date(record.endDate.replace(/\./g, "-"));

      // 휴가 기간이 선택된 날짜 범위와 겹치는지 확인
      return recordStartDate <= end && recordEndDate >= start;
    });
  };

  // 필터링된 연차 기록
  const filteredVacationRecords = filterVacationRecords();

  // 페이징을 위한 설정
  const itemsPerPage = 10;
  const totalItems = filteredVacationRecords.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // 현재 페이지의 아이템들 계산
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageItems = filteredVacationRecords.slice(startIndex, endIndex);

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 필터링이 변경될 때 페이지를 1로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [startDate, endDate, selectedPeriod]);

  const vacationStats = [
    {
      title: "기본 연차",
      count: 12,
      unit: "일",
      description: "3일 사용됨",
      icon: CalendarDays,
      color: colors.primary.blue,
      bgColor: colors.primary.blueLight,
      textColor: colors.primary.blueText,
    },
    {
      title: "보상 연차",
      count: 4,
      unit: "일",
      description: "1일 사용됨",
      icon: Gift,
      color: colors.status.success.gradient,
      bgColor: colors.status.success.bg,
      textColor: colors.status.success.text,
    },
    {
      title: "특별 연차",
      count: 1,
      unit: "일",
      description: "0일 사용됨",
      icon: Star,
      color: colors.status.warning.gradient,
      bgColor: colors.status.warning.bg,
      textColor: colors.status.warning.text,
    },
  ];

  return (
    <MainLayout>
      {/* Page Title */}
      <div className="mb-8">
        <h2 className={`${typography.h1} text-gray-800 mb-2`}>휴가 통계</h2>
        <p className="text-gray-600">나의 휴가 현황을 확인하고 관리하세요</p>
      </div>

      {/* Vacation Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {vacationStats.map((stat, index) => (
          <GlassCard key={index} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div
                className={`px-3 py-1 bg-gradient-to-r ${stat.bgColor} rounded-full`}
              >
                <span className={`text-xs font-medium ${stat.textColor}`}>
                  {stat.description}
                </span>
              </div>
            </div>
            <div className="mb-2">
              <h3 className={`${typography.h4} text-gray-800 mb-1`}>
                {stat.title}
              </h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-900">
                  {stat.count}
                </span>
                <span className="text-lg text-gray-600">{stat.unit}</span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Vacation Records Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className={`${typography.h2} text-gray-800`}>휴가 기록</h3>
          <div className="flex items-center gap-4">
            {/* 날짜 필터링 입력 */}
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl text-sm"
                placeholder="시작일"
              />
              <span className="text-gray-500">~</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl text-sm"
                placeholder="종료일"
              />
            </div>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48 bg-white/60 backdrop-blur-sm border-gray-200/50 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {periods.map((period) => (
                  <SelectItem key={period.value} value={period.value}>
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <GradientButton
              variant="primary"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              휴가 신청
            </GradientButton>
          </div>
        </div>

        {/* Vacation Records Table */}
        <GlassCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-gray-100/50">
                  <th className="text-left p-4 font-semibold text-gray-700">
                    구분
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    기간
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    일수
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    사유
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    상태
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentPageItems.map((record) => (
                  <tr
                    key={record.id}
                    className="border-b border-gray-200/30 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="p-4">
                      <span className="px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-full text-sm font-medium">
                        {record.type}
                      </span>
                    </td>
                    <td className="p-4 text-gray-700">
                      <div className="flex items-center gap-2">
                        <span>{record.startDate}</span>
                        {record.endDate !== record.startDate && (
                          <>
                            <span>~</span>
                            <span>{record.endDate}</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-gray-700 font-medium">
                      {record.days}일
                    </td>
                    <td className="p-4 text-gray-600 max-w-xs truncate">
                      {record.reason}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium border ${record.statusColor}`}
                      >
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        {/* 페이징 컴포넌트 */}
        {totalPages > 1 && (
          <div className="mt-6">
            <StyledPaging
              currentPage={currentPage}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {/* Vacation Modal */}
      <VacationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(vacationData) => {
          console.log("휴가 신청 데이터:", vacationData);
          // TODO: API 호출 또는 상태 업데이트 로직 추가
          setIsModalOpen(false);
        }}
      />
    </MainLayout>
  );
}
