"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar, HelpCircle } from "lucide-react";

export function SelectWorkForm({ formData, setFormData }) {
  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const weekDays = [
    { id: "monday", name: "월", short: "월" },
    { id: "tuesday", name: "화", short: "화" },
    { id: "wednesday", name: "수", short: "수" },
    { id: "thursday", name: "목", short: "목" },
    { id: "friday", name: "금", short: "금" },
    { id: "saturday", name: "토", short: "토" },
    { id: "sunday", name: "일", short: "일" },
  ];

  const workCycleOptions = [
    { value: "1week", label: "1주" },
    { value: "2week", label: "2주" },
    { value: "3week", label: "3주" },
    { value: "4week", label: "4주" },
    { value: "1month", label: "1개월" },
  ];

  const startDayOptions = [
    { value: "1", label: "1일" },
    { value: "2", label: "2일" },
    { value: "3", label: "3일" },
    { value: "4", label: "4일" },
    { value: "5", label: "5일" },
    { value: "6", label: "6일" },
    { value: "7", label: "7일" },
    { value: "8", label: "8일" },
    { value: "9", label: "9일" },
    { value: "10", label: "10일" },
    { value: "11", label: "11일" },
    { value: "12", label: "12일" },
    { value: "13", label: "13일" },
    { value: "14", label: "14일" },
    { value: "15", label: "15일" },
    { value: "16", label: "16일" },
    { value: "17", label: "17일" },
    { value: "18", label: "18일" },
    { value: "19", label: "19일" },
    { value: "20", label: "20일" },
    { value: "21", label: "21일" },
    { value: "22", label: "22일" },
    { value: "23", label: "23일" },
    { value: "24", label: "24일" },
    { value: "25", label: "25일" },
    { value: "26", label: "26일" },
    { value: "27", label: "27일" },
    { value: "28", label: "28일" },
    { value: "29", label: "29일" },
    { value: "30", label: "30일" },
    { value: "31", label: "31일" },
  ];

  const handleDayToggle = (field, dayId) => {
    const currentDays = formData[field] || {
      monday: field === "workingDays" ? true : false,
      tuesday: field === "workingDays" ? true : false,
      wednesday: field === "workingDays" ? true : false,
      thursday: field === "workingDays" ? true : false,
      friday: field === "workingDays" ? true : false,
      saturday: false,
      sunday: field === "weeklyHoliday" ? true : false,
    };

    updateFormData(field, {
      ...currentDays,
      [dayId]: !currentDays[dayId],
    });
  };

  const handleBreakTimeAdd = () => {
    const currentBreakTimes = formData.breakTimes || ["12:00-13:00"];
    updateFormData("breakTimes", [...currentBreakTimes, "12:00-13:00"]);
  };

  return (
    <div className="space-y-6">
      {/* 근무유형 이름 */}
      <div>
        <p className="text-sm text-gray-500 mb-2">근무 유형 이름</p>
        <Input
          value={formData.workName || ""}
          onChange={(e) => updateFormData("workName", e.target.value)}
          className="bg-white/60 backdrop-blur-sm border-gray-200/50 rounded-xl"
          placeholder="선택 근무"
        />
      </div>

      {/* 일하는 방식 */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">일하는 방식</h3>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-xs"
          >
            <Calendar className="w-3 h-3" />
            요일별 설정
          </Button>
        </div>
      </div>

      {/* 근무 주기 */}
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-700">근무 주기</p>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <Select
              value={formData.workCycle || "1month"}
              onValueChange={(value) => updateFormData("workCycle", value)}
            >
              <SelectTrigger className="bg-white/60 backdrop-blur-sm border-gray-200/50 rounded-xl border-green-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {workCycleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* 근무 요일 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          근무 요일
        </label>
        <p className="text-xs text-gray-500 mb-3">구성원이 근무해야하는 요일</p>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => {
            const workingDays = formData.workingDays || {
              monday: true,
              tuesday: true,
              wednesday: true,
              thursday: true,
              friday: true,
              saturday: false,
              sunday: false,
            };
            const isSelected = workingDays[day.id];

            return (
              <button
                key={day.id}
                onClick={() => handleDayToggle("workingDays", day.id)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                  isSelected
                    ? `border-blue-500 bg-blue-500 text-white`
                    : `border-gray-200 bg-white/60 text-gray-600 hover:border-gray-300`
                }`}
              >
                <span className="text-sm font-medium">{day.short}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 주휴일 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          주휴일
        </label>
        <p className="text-xs text-gray-500 mb-3">
          1주마다 부여하는 유급 휴일의 요일
        </p>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => {
            const weeklyHoliday = formData.weeklyHoliday || {
              monday: false,
              tuesday: false,
              wednesday: false,
              thursday: false,
              friday: false,
              saturday: false,
              sunday: true,
            };
            const isSelected = weeklyHoliday[day.id];

            return (
              <button
                key={day.id}
                onClick={() => handleDayToggle("weeklyHoliday", day.id)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                  isSelected
                    ? `border-blue-500 bg-blue-500 text-white`
                    : `border-gray-200 bg-white/60 text-gray-600 hover:border-gray-300`
                }`}
              >
                <span className="text-sm font-medium">{day.short}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 근무 시간 */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-gray-700">근무 시간</p>
          <HelpCircle className="w-4 h-4 text-gray-400" />
        </div>
        <p className="text-xs text-gray-500">
          평균 근무 시간 및 코어 타임 시간대
        </p>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">평균 근무</span>
            <div className="w-20">
              <Input
                type="number"
                min="0"
                max="24"
                value={formData.workHours || "8"}
                onChange={(e) => updateFormData("workHours", e.target.value)}
                className="bg-white/60 backdrop-blur-sm border-gray-200/50 rounded-xl text-center"
                placeholder="8"
              />
            </div>
            <span className="text-sm text-gray-600">시간</span>
            <div className="w-20">
              <Input
                type="number"
                min="0"
                max="59"
                value={formData.workMinutes || "0"}
                onChange={(e) => updateFormData("workMinutes", e.target.value)}
                className="bg-white/60 backdrop-blur-sm border-gray-200/50 rounded-xl text-center"
                placeholder="0"
              />
            </div>
            <span className="text-sm text-gray-600">분</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">코어 타임</span>
            <div className="flex-1">
              <Input
                value={formData.coreTime || ""}
                onChange={(e) => updateFormData("coreTime", e.target.value)}
                className="bg-white/60 backdrop-blur-sm border-gray-200/50 rounded-xl"
                placeholder="코어 타임 선택"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 추천 휴게 시간 */}
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-700">추천 휴게 시간</p>
          <p className="text-xs text-gray-500 mt-1">
            휴게로 자동 기록되는 시간대
          </p>
        </div>
        <div className="space-y-2">
          {(formData.breakTimes || ["12:00-13:00"]).map((breakTime, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={breakTime}
                onChange={(e) => {
                  const newBreakTimes = [
                    ...(formData.breakTimes || ["12:00-13:00"]),
                  ];
                  newBreakTimes[index] = e.target.value;
                  updateFormData("breakTimes", newBreakTimes);
                }}
                className="bg-white/60 backdrop-blur-sm border-gray-200/50 rounded-xl"
                placeholder="오후 12:00 - 오후 1:00"
              />
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={handleBreakTimeAdd}
            className="text-xs"
          >
            + 추가하기
          </Button>
        </div>
      </div>
    </div>
  );
}
