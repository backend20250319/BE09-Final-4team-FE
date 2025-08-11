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
import { Calendar } from "lucide-react";
import SelectTime from "@/components/clock/SelectTime";

export function SelectWorkForm({ formData, setFormData }) {
  const [showTimePicker, setShowTimePicker] = useState({
    coreTimeStart: false,
    coreTimeEnd: false,
    flexibleStart: false,
    flexibleEnd: false,
  });

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTimeSelect = (field, time) => {
    updateFormData(field, time);
    setShowTimePicker((prev) => ({ ...prev, [field]: false }));
  };

  const openTimePicker = (field) => {
    setShowTimePicker((prev) => ({ ...prev, [field]: true }));
  };

  const closeTimePicker = (field) => {
    setShowTimePicker((prev) => ({ ...prev, [field]: false }));
  };

  const workPatterns = [
    { value: "flexible", label: "유연 근무제" },
    { value: "core", label: "코어 타임제" },
    { value: "compressed", label: "압축 근무제" },
    { value: "custom", label: "사용자 정의" },
  ];

  const weekDays = [
    { id: "monday", name: "월", short: "월" },
    { id: "tuesday", name: "화", short: "화" },
    { id: "wednesday", name: "수", short: "수" },
    { id: "thursday", name: "목", short: "목" },
    { id: "friday", name: "금", short: "금" },
    { id: "saturday", name: "토", short: "토" },
    { id: "sunday", name: "일", short: "일" },
  ];

  const handleDayToggle = (dayId) => {
    const currentDays = formData.selectedDays || {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false,
    };

    updateFormData("selectedDays", {
      ...currentDays,
      [dayId]: !currentDays[dayId],
    });
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

      {/* 근무 패턴 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          근무 패턴
        </label>
        <Select
          value={formData.workPattern || "flexible"}
          onValueChange={(value) => updateFormData("workPattern", value)}
        >
          <SelectTrigger className="bg-white/60 backdrop-blur-sm border-gray-200/50 rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {workPatterns.map((pattern) => (
              <SelectItem key={pattern.value} value={pattern.value}>
                {pattern.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 주간 근무 시간 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          주간 근무 시간 (시간)
        </label>
        <Input
          type="number"
          min="20"
          max="60"
          step="0.5"
          value={formData.weeklyHours || "40"}
          onChange={(e) => updateFormData("weeklyHours", e.target.value)}
          className="bg-white/60 backdrop-blur-sm border-gray-200/50 rounded-xl"
          placeholder="40"
        />
      </div>

      {/* 근무 요일 선택 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          근무 요일 선택
        </label>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => {
            const selectedDays = formData.selectedDays || {
              monday: true,
              tuesday: true,
              wednesday: true,
              thursday: true,
              friday: true,
              saturday: false,
              sunday: false,
            };
            const isSelected = selectedDays[day.id];

            return (
              <button
                key={day.id}
                onClick={() => handleDayToggle(day.id)}
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

      {/* 코어 타임 (코어 타임제인 경우) */}
      {(formData.workPattern === "core" ||
        formData.workPattern === "flexible") && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            코어 타임
          </label>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <button
                type="button"
                onClick={() => openTimePicker("coreTimeStart")}
                className="w-full px-3 py-2 text-left bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl hover:bg-white/80 transition-colors"
              >
                {formData.coreTimeStart || "10:00"}
              </button>
            </div>
            <span className="text-gray-500">~</span>
            <div className="flex-1">
              <button
                type="button"
                onClick={() => openTimePicker("coreTimeEnd")}
                className="w-full px-3 py-2 text-left bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl hover:bg-white/80 transition-colors"
              >
                {formData.coreTimeEnd || "16:00"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 선택 근무 시간 범위 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          선택 근무 시간 범위
        </label>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <button
              type="button"
              onClick={() => openTimePicker("flexibleStart")}
              className="w-full px-3 py-2 text-left bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl hover:bg-white/80 transition-colors"
            >
              {formData.flexibleStart || "07:00"}
            </button>
          </div>
          <span className="text-gray-500">~</span>
          <div className="flex-1">
            <button
              type="button"
              onClick={() => openTimePicker("flexibleEnd")}
              className="w-full px-3 py-2 text-left bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl hover:bg-white/80 transition-colors"
            >
              {formData.flexibleEnd || "22:00"}
            </button>
          </div>
        </div>
      </div>

      {/* 일일 최소 근무 시간 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          일일 최소 근무 시간 (시간)
        </label>
        <Input
          type="number"
          min="1"
          max="12"
          step="0.5"
          value={formData.minDailyHours || "4"}
          onChange={(e) => updateFormData("minDailyHours", e.target.value)}
          className="bg-white/60 backdrop-blur-sm border-gray-200/50 rounded-xl"
          placeholder="4"
        />
      </div>

      {/* 일일 최대 근무 시간 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          일일 최대 근무 시간 (시간)
        </label>
        <Input
          type="number"
          min="4"
          max="12"
          step="0.5"
          value={formData.maxDailyHours || "10"}
          onChange={(e) => updateFormData("maxDailyHours", e.target.value)}
          className="bg-white/60 backdrop-blur-sm border-gray-200/50 rounded-xl"
          placeholder="10"
        />
      </div>

      {/* 휴게 시간 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          휴게 시간 (분)
        </label>
        <Input
          type="number"
          min="30"
          max="120"
          step="15"
          value={formData.breakTime || "60"}
          onChange={(e) => updateFormData("breakTime", e.target.value)}
          className="bg-white/60 backdrop-blur-sm border-gray-200/50 rounded-xl"
          placeholder="60"
        />
      </div>

      {/* Time Picker Modals */}
      {showTimePicker.coreTimeStart && (
        <SelectTime
          onTimeSelect={(time) => handleTimeSelect("coreTimeStart", time)}
          onClose={() => closeTimePicker("coreTimeStart")}
        />
      )}
      {showTimePicker.coreTimeEnd && (
        <SelectTime
          onTimeSelect={(time) => handleTimeSelect("coreTimeEnd", time)}
          onClose={() => closeTimePicker("coreTimeEnd")}
        />
      )}
      {showTimePicker.flexibleStart && (
        <SelectTime
          onTimeSelect={(time) => handleTimeSelect("flexibleStart", time)}
          onClose={() => closeTimePicker("flexibleStart")}
        />
      )}
      {showTimePicker.flexibleEnd && (
        <SelectTime
          onTimeSelect={(time) => handleTimeSelect("flexibleEnd", time)}
          onClose={() => closeTimePicker("flexibleEnd")}
        />
      )}
    </div>
  );
}
