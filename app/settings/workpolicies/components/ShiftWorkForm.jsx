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

export function ShiftWorkForm({ formData, setFormData }) {
  const [showTimePicker, setShowTimePicker] = useState({
    shift1Start: false,
    shift1End: false,
    shift2Start: false,
    shift2End: false,
    shift3Start: false,
    shift3End: false,
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

  const shiftTypes = [
    { value: "2shift", label: "2교대" },
    { value: "3shift", label: "3교대" },
    { value: "4shift", label: "4교대" },
  ];

  const shiftPatterns = [
    { value: "day_night", label: "주간/야간" },
    { value: "morning_afternoon", label: "오전/오후" },
    { value: "custom", label: "사용자 정의" },
  ];

  return (
    <div className="space-y-6">
      {/* 근무유형 이름 */}
      <div>
        <p className="text-sm text-gray-500 mb-2">근무 유형 이름</p>
        <Input
          value={formData.workName || ""}
          onChange={(e) => updateFormData("workName", e.target.value)}
          className="bg-white/60 backdrop-blur-sm border-gray-200/50 rounded-xl"
          placeholder="교대 근무"
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

      {/* 교대 주기 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          교대 주기 (일)
        </label>
        <Input
          type="number"
          min="1"
          max="30"
          value={formData.shiftCycle || "7"}
          onChange={(e) => updateFormData("shiftCycle", e.target.value)}
          className="bg-white/60 backdrop-blur-sm border-gray-200/50 rounded-xl"
          placeholder="7"
        />
      </div>

      {/* 1교대 시간 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          1교대 시간
        </label>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <button
              type="button"
              onClick={() => openTimePicker("shift1Start")}
              className="w-full px-3 py-2 text-left bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl hover:bg-white/80 transition-colors"
            >
              {formData.shift1Start || "06:00"}
            </button>
          </div>
          <span className="text-gray-500">~</span>
          <div className="flex-1">
            <button
              type="button"
              onClick={() => openTimePicker("shift1End")}
              className="w-full px-3 py-2 text-left bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl hover:bg-white/80 transition-colors"
            >
              {formData.shift1End || "14:00"}
            </button>
          </div>
        </div>
      </div>

      {/* 2교대 시간 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          2교대 시간
        </label>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <button
              type="button"
              onClick={() => openTimePicker("shift2Start")}
              className="w-full px-3 py-2 text-left bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl hover:bg-white/80 transition-colors"
            >
              {formData.shift2Start || "14:00"}
            </button>
          </div>
          <span className="text-gray-500">~</span>
          <div className="flex-1">
            <button
              type="button"
              onClick={() => openTimePicker("shift2End")}
              className="w-full px-3 py-2 text-left bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl hover:bg-white/80 transition-colors"
            >
              {formData.shift2End || "22:00"}
            </button>
          </div>
        </div>
      </div>

      {/* 3교대 시간 (3교대 이상인 경우) */}
      {(formData.shiftType === "3shift" || formData.shiftType === "4shift") && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            3교대 시간
          </label>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <button
                type="button"
                onClick={() => openTimePicker("shift3Start")}
                className="w-full px-3 py-2 text-left bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl hover:bg-white/80 transition-colors"
              >
                {formData.shift3Start || "22:00"}
              </button>
            </div>
            <span className="text-gray-500">~</span>
            <div className="flex-1">
              <button
                type="button"
                onClick={() => openTimePicker("shift3End")}
                className="w-full px-3 py-2 text-left bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl hover:bg-white/80 transition-colors"
              >
                {formData.shift3End || "06:00"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 휴게 시간 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          휴게 시간 (분)
        </label>
        <Input
          type="number"
          min="0"
          max="120"
          value={formData.breakTime || "60"}
          onChange={(e) => updateFormData("breakTime", e.target.value)}
          className="bg-white/60 backdrop-blur-sm border-gray-200/50 rounded-xl"
          placeholder="60"
        />
      </div>

      {/* Time Picker Modals */}
      {showTimePicker.shift1Start && (
        <SelectTime
          onTimeSelect={(time) => handleTimeSelect("shift1Start", time)}
          onClose={() => closeTimePicker("shift1Start")}
        />
      )}
      {showTimePicker.shift1End && (
        <SelectTime
          onTimeSelect={(time) => handleTimeSelect("shift1End", time)}
          onClose={() => closeTimePicker("shift1End")}
        />
      )}
      {showTimePicker.shift2Start && (
        <SelectTime
          onTimeSelect={(time) => handleTimeSelect("shift2Start", time)}
          onClose={() => closeTimePicker("shift2Start")}
        />
      )}
      {showTimePicker.shift2End && (
        <SelectTime
          onTimeSelect={(time) => handleTimeSelect("shift2End", time)}
          onClose={() => closeTimePicker("shift2End")}
        />
      )}
      {showTimePicker.shift3Start && (
        <SelectTime
          onTimeSelect={(time) => handleTimeSelect("shift3Start", time)}
          onClose={() => closeTimePicker("shift3Start")}
        />
      )}
      {showTimePicker.shift3End && (
        <SelectTime
          onTimeSelect={(time) => handleTimeSelect("shift3End", time)}
          onClose={() => closeTimePicker("shift3End")}
        />
      )}
    </div>
  );
}
