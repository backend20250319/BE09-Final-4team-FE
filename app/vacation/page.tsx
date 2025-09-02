"use client";

import { useState, useEffect, useRef } from "react";
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
  X,
  CheckCircle,
  Clock,
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
import CalendarComponent from "./components/calendar";
import { format } from "date-fns";

// Type definitions
interface Period {
  value: string;
  label: string;
  months: number[];
}

interface VacationRecord {
  id: number;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: string;
  statusColor: string;
}

interface VacationType {
  value: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

export default function VacationPage(): JSX.Element {
  const [selectedPeriod, setSelectedPeriod] =
    useState<string>("2025.10~2025.12");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedVacationType, setSelectedVacationType] =
    useState<string>("기본 연차");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  // 1년을 3개월씩 나눈 기간들
  const periods: Period[] = [
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
  const vacationRecords: VacationRecord[] = [
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
      startDate: "2025.05.10",
      endDate: "2025.05.10",
      days: 1,
      reason: "[2025-05-10] 개인 사정",
      status: "승인됨",
      statusColor:
        colors.status.info.bg +
        " " +
        colors.status.info.text +
        " " +
        colors.status.info.border,
    },
  ];

  // 휴가 유형 데이터
  const vacationTypes: VacationType[] = [
    {
      value: "기본 연차",
      label: "기본 연차",
      icon: <CalendarDays className="w-5 h-5" />,
      description: "연간 15일 기본 연차",
    },
    {
      value: "반차",
      label: "반차",
      icon: <Clock className="w-5 h-5" />,
      description: "오전/오후 반차",
    },
    {
      value: "병가",
      label: "병가",
      icon: <User className="w-5 h-5" />,
      description: "질병으로 인한 휴가",
    },
    {
      value: "공가",
      label: "공가",
      icon: <FileText className="w-5 h-5" />,
      description: "공무로 인한 휴가",
    },
    {
      value: "특별 휴가",
      label: "특별 휴가",
      icon: <Gift className="w-5 h-5" />,
      description: "특별한 경우의 휴가",
    },
  ];

  // 페이지네이션 설정
  const itemsPerPage = 5;
  const totalPages = Math.ceil(vacationRecords.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRecords = vacationRecords.slice(startIndex, endIndex);

  // 통계 계산
  const totalVacationDays = vacationRecords.reduce(
    (sum, record) => sum + record.days,
    0
  );
  const approvedVacations = vacationRecords.filter(
    (record) => record.status === "승인됨"
  );
  const pendingVacations = vacationRecords.filter(
    (record) => record.status === "대기중"
  );
  const rejectedVacations = vacationRecords.filter(
    (record) => record.status === "반려됨"
  );

  const handlePeriodChange = (value: string): void => {
    setSelectedPeriod(value);
  };

  const handleVacationTypeChange = (value: string): void => {
    setSelectedVacationType(value);
  };

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
  };

  const handleOpenModal = (): void => {
    setIsModalOpen(true);
  };

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
  };

  const handleCalendarToggle = (): void => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  const handleDateSelect = (date: Date): void => {
    const formattedDate = format(date, "yyyy.MM.dd");
    if (!startDate) {
      setStartDate(formattedDate);
    } else if (!endDate) {
      setEndDate(formattedDate);
    } else {
      setStartDate(formattedDate);
      setEndDate("");
    }
  };

  return (
    <MainLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h1 className={`${typography.h1} text-gray-800`}>휴가 관리</h1>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-5 h-5" />
              <span className="text-sm">연간 휴가 현황 및 신청</span>
            </div>
          </div>
          <GradientButton onClick={handleOpenModal}>
            <Plus className="w-4 h-4 mr-2" />
            휴가 신청
          </GradientButton>
        </div>
        <p className="text-gray-600">
          연차 사용 현황을 확인하고 새로운 휴가를 신청할 수 있습니다.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <GlassCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <CalendarDays className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800">
                총 사용 일수
              </h3>
              <p className="text-2xl font-bold text-blue-600">
                {totalVacationDays}일
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800">
                승인된 휴가
              </h3>
              <p className="text-2xl font-bold text-green-600">
                {approvedVacations.length}건
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800">대기중</h3>
              <p className="text-2xl font-bold text-yellow-600">
                {pendingVacations.length}건
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <X className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800">
                반려된 휴가
              </h3>
              <p className="text-2xl font-bold text-red-600">
                {rejectedVacations.length}건
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">기간:</span>
          <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-48">
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
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">휴가 유형:</span>
          <Select
            value={selectedVacationType}
            onValueChange={handleVacationTypeChange}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {vacationTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex items-center gap-2">
                    {type.icon}
                    {type.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Vacation Records Table */}
      <GlassCard className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  유형
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  시작일
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  종료일
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  일수
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  사유
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  상태
                </th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((record) => (
                <tr
                  key={record.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-2">
                      {record.type === "연차" && (
                        <CalendarDays className="w-4 h-4 text-blue-500" />
                      )}
                      {record.type === "반차" && (
                        <Clock className="w-4 h-4 text-green-500" />
                      )}
                      {record.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    {record.startDate}
                  </td>
                  <td className="py-3 px-4 text-gray-700">{record.endDate}</td>
                  <td className="py-3 px-4 text-gray-700">{record.days}일</td>
                  <td className="py-3 px-4 text-gray-700 max-w-xs truncate">
                    {record.reason}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${record.statusColor}`}
                    >
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-center">
          <StyledPaging
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </GlassCard>

      {/* Vacation Modal */}
      {isModalOpen && (
        <VacationModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          vacationTypes={vacationTypes}
          onCalendarToggle={handleCalendarToggle}
          isCalendarOpen={isCalendarOpen}
          startDate={startDate}
          endDate={endDate}
          onDateSelect={handleDateSelect}
        />
      )}
    </MainLayout>
  );
}
