"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar, HelpCircle, Plus } from "lucide-react";
import SelectTime from "@/components/clock/SelectTime";

export function SelectWorkForm({ formData, setFormData }) {
  const [showTimePicker, setShowTimePicker] = useState({
    coreTimeStart: false,
    coreTimeEnd: false,
    breakTimeStart: false,
    breakTimeEnd: false,
  });

  const timePickerRefs = {
    coreTimeStart: useRef(null),
    coreTimeEnd: useRef(null),
    breakTimeStart: useRef(null),
    breakTimeEnd: useRef(null),
  };

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

  // 바깥 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(showTimePicker).forEach((field) => {
        if (showTimePicker[field] && timePickerRefs[field].current) {
          if (!timePickerRefs[field].current.contains(event.target)) {
            closeTimePicker(field);
          }
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTimePicker]);

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

  const addBreakTime = () => {
    const currentBreaks = formData.breakTimes || [];
    updateFormData("breakTimes", [
      ...currentBreaks,
      { start: "12:00", end: "13:00" },
    ]);
  };

  const removeBreakTime = (index) => {
    const currentBreaks = formData.breakTimes || [];
    updateFormData(
      "breakTimes",
      currentBreaks.filter((_, i) => i !== index)
    );
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
        <div>
          <h3 className="text-lg font-semibold text-gray-800">일하는 방식</h3>
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
          <div className="space-y-3">
            {/* StartCoreTime */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">시작 시간</span>
              <div
                className="flex-1 relative"
                ref={timePickerRefs.coreTimeStart}
              >
                <button
                  type="button"
                  onClick={() => openTimePicker("coreTimeStart")}
                  className="w-full px-3 py-2 text-left bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl hover:bg-white/80 transition-colors"
                >
                  {formData.coreTimeStart || "10:00"}
                </button>

                {/* 시작 시간 드롭다운 */}
                {showTimePicker.coreTimeStart && (
                  <div className="absolute top-full left-0 z-50 mt-1 w-full">
                    <SelectTime
                      onTimeSelect={(time) =>
                        handleTimeSelect("coreTimeStart", time)
                      }
                      onClose={() => closeTimePicker("coreTimeStart")}
                      isDropdown={true}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* EndCoreTime */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">종료 시간</span>
              <div className="flex-1 relative" ref={timePickerRefs.coreTimeEnd}>
                <button
                  type="button"
                  onClick={() => openTimePicker("coreTimeEnd")}
                  className="w-full px-3 py-2 text-left bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl hover:bg-white/80 transition-colors"
                >
                  {formData.coreTimeEnd || "16:00"}
                </button>

                {/* 종료 시간 드롭다운 */}
                {showTimePicker.coreTimeEnd && (
                  <div className="absolute top-full left-0 z-50 mt-1 w-full">
                    <SelectTime
                      onTimeSelect={(time) =>
                        handleTimeSelect("coreTimeEnd", time)
                      }
                      onClose={() => closeTimePicker("coreTimeEnd")}
                      isDropdown={true}
                    />
                  </div>
                )}
              </div>
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
          {(formData.breakTimes || [{ start: "12:00", end: "13:00" }]).map(
            (breakTime, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <div className="relative" ref={timePickerRefs.breakTimeStart}>
                  <button
                    type="button"
                    onClick={() => openTimePicker("breakTimeStart")}
                    className="w-40 px-3 py-2 text-sm bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-lg hover:bg-white/80 transition-colors text-center"
                  >
                    {breakTime.start}
                  </button>

                  {/* 휴게 시작 시간 드롭다운 */}
                  {showTimePicker.breakTimeStart && (
                    <div className="absolute top-full left-0 z-50 mt-1">
                      <SelectTime
                        onTimeSelect={(time) =>
                          handleTimeSelect("breakTimeStart", time)
                        }
                        onClose={() => closeTimePicker("breakTimeStart")}
                        isDropdown={true}
                      />
                    </div>
                  )}
                </div>
                <span className="text-gray-400">-</span>
                <div className="relative" ref={timePickerRefs.breakTimeEnd}>
                  <button
                    type="button"
                    onClick={() => openTimePicker("breakTimeEnd")}
                    className="w-40 px-3 py-2 text-sm bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-lg hover:bg-white/80 transition-colors text-center"
                  >
                    {breakTime.end}
                  </button>

                  {/* 휴게 종료 시간 드롭다운 */}
                  {showTimePicker.breakTimeEnd && (
                    <div className="absolute top-full left-0 z-50 mt-1">
                      <SelectTime
                        onTimeSelect={(time) =>
                          handleTimeSelect("breakTimeEnd", time)
                        }
                        onClose={() => closeTimePicker("breakTimeEnd")}
                        isDropdown={true}
                      />
                    </div>
                  )}
                </div>
                {(formData.breakTimes || []).length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeBreakTime(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    삭제
                  </Button>
                )}
              </div>
            )
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={addBreakTime}
            className="flex items-center gap-2 mt-2"
          >
            <Plus className="w-4 h-4" />
            추가하기
          </Button>
        </div>
      </div>
    </div>
  );
}
