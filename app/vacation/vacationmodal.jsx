"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { X, Clock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import SelectTime from "@/components/clock/SelectTime";
import Calendar from "./components/calendar";

export default function VacationModal({
  isOpen,
  onClose,
  onSubmit,
  defaultVacationType = "기본 연차",
}) {
  const [vacationType, setVacationType] = useState(defaultVacationType);
  const [selectedDates, setSelectedDates] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");
  const [reason, setReason] = useState("");
  const [showStartTimeDropdown, setShowStartTimeDropdown] = useState(false);
  const [showEndTimeDropdown, setShowEndTimeDropdown] = useState(false);

  // defaultVacationType이 변경될 때 vacationType 상태 업데이트
  useEffect(() => {
    setVacationType(defaultVacationType);
  }, [defaultVacationType]);

  const vacationTypes = [
    { value: "기본 연차", label: "기본 연차" },
    { value: "보상 연차", label: "보상 연차" },
    { value: "특별 연차", label: "특별 연차" },
  ];

  const handleStartDateChange = (newStartDate) => {
    setStartDate(newStartDate);

    // 시작일만 선택된 경우에도 해당 날짜를 selectedDates에 추가
    if (newStartDate && !endDate) {
      setSelectedDates([newStartDate]);
    } else if (newStartDate && endDate) {
      updateSelectedDates(newStartDate, endDate);
    } else {
      setSelectedDates([]);
    }
  };

  const handleEndDateChange = (newEndDate) => {
    setEndDate(newEndDate);

    // 종료일만 선택된 경우에도 해당 날짜를 selectedDates에 추가
    if (newEndDate && !startDate) {
      setSelectedDates([newEndDate]);
    } else if (newEndDate && startDate) {
      updateSelectedDates(startDate, newEndDate);
    } else {
      setSelectedDates([]);
    }
  };

  const updateSelectedDates = (start, end) => {
    if (start && end) {
      const startDate = start instanceof Date ? start : new Date(start);
      const endDate = end instanceof Date ? end : new Date(end);
      const dates = [];
      const current = new Date(startDate);

      // 시작일과 종료일이 같은 경우
      if (startDate.getTime() === endDate.getTime()) {
        dates.push(startDate);
      } else {
        // 시작일부터 종료일까지 모든 날짜 추가
        while (current <= endDate) {
          dates.push(new Date(current));
          current.setDate(current.getDate() + 1);
        }
      }
      setSelectedDates(dates);
    } else if (start) {
      // 시작일만 있는 경우
      setSelectedDates([start instanceof Date ? start : new Date(start)]);
    } else if (end) {
      // 종료일만 있는 경우
      setSelectedDates([end instanceof Date ? end : new Date(end)]);
    } else {
      setSelectedDates([]);
    }
  };

  const handleSubmit = () => {
    if (selectedDates.length === 0) {
      alert("날짜를 선택해주세요.");
      return;
    }
    if (!reason.trim()) {
      alert("연차 사유를 입력해주세요.");
      return;
    }

    const vacationData = {
      type: vacationType,
      dates: selectedDates.map((date) => format(date, "yyyy-MM-dd")),
      startTime,
      endTime,
      reason: reason.trim(),
      days: selectedDates.length,
    };

    onSubmit(vacationData);
    handleClose();
  };

  const handleClose = () => {
    setVacationType(defaultVacationType);
    setSelectedDates([]);
    setStartDate(null);
    setEndDate(null);
    setStartTime("09:00");
    setEndTime("18:00");
    setReason("");
    setShowStartTimeDropdown(false);
    setShowEndTimeDropdown(false);
    onClose();
  };

  const handleStartTimeSelect = (time) => {
    setStartTime(time);
    setShowStartTimeDropdown(false);
  };

  const handleEndTimeSelect = (time) => {
    setEndTime(time);
    setShowEndTimeDropdown(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="w-full max-w-lg mx-4 p-4 bg-white/80 backdrop-blur-md border-gray-200/50 rounded-2xl max-h-[80vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-bold text-gray-800">
              휴가 신청
            </DialogTitle>
          </DialogHeader>

          {/* Vacation Type Dropdown */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              휴가 종류
            </label>
            <Select value={vacationType} onValueChange={setVacationType}>
              <SelectTrigger className="w-full bg-white/60 backdrop-blur-sm border-gray-200/50 rounded-xl cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {vacationTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Calendar */}
          <Calendar
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={handleStartDateChange}
            onEndDateChange={handleEndDateChange}
            selectedDates={selectedDates}
          />

          {/* Date Range Info - 범위 선택 시에만 표시 */}
          {startDate &&
            endDate &&
            startDate.getTime() !== endDate.getTime() && (
              <div className="mb-4 p-3 bg-blue-50/50 border border-blue-200/50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-blue-700">
                    <span className="font-medium">선택된 기간:</span>{" "}
                    {format(new Date(startDate), "yyyy년 M월 d일", {
                      locale: ko,
                    })}{" "}
                    ~{" "}
                    {format(new Date(endDate), "yyyy년 M월 d일", {
                      locale: ko,
                    })}
                  </div>
                  <div className="text-sm font-medium text-blue-700">
                    {selectedDates.length}일
                  </div>
                </div>
              </div>
            )}

          {/* Time Inputs - 단일 날짜 선택 시에만 표시 */}
          {((startDate && !endDate) ||
            (startDate &&
              endDate &&
              startDate.getTime() === endDate.getTime())) && (
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  휴가 시작 시간
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    value={startTime}
                    readOnly
                    onClick={() => {
                      setShowStartTimeDropdown(!showStartTimeDropdown);
                      setShowEndTimeDropdown(false);
                    }}
                    className="pl-10 bg-white/60 backdrop-blur-sm border-gray-200/50 rounded-xl cursor-pointer"
                  />
                  {showStartTimeDropdown && (
                    <SelectTime
                      onTimeSelect={handleStartTimeSelect}
                      onClose={() => setShowStartTimeDropdown(false)}
                      isDropdown={true}
                    />
                  )}
                </div>
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  휴가 종료 시간
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    value={endTime}
                    readOnly
                    onClick={() => {
                      setShowEndTimeDropdown(!showEndTimeDropdown);
                      setShowStartTimeDropdown(false);
                    }}
                    className="pl-10 bg-white/60 backdrop-blur-sm border-gray-200/50 rounded-xl cursor-pointer"
                  />
                  {showEndTimeDropdown && (
                    <SelectTime
                      onTimeSelect={handleEndTimeSelect}
                      onClose={() => setShowEndTimeDropdown(false)}
                      isDropdown={true}
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Reason Textarea */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              연차 사유
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Textarea
                placeholder="연차 사유를 입력해주세요..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="pl-10 bg-white/60 backdrop-blur-sm border-gray-200/50 rounded-xl min-h-[80px] resize-none"
              />
            </div>
          </div>

          <DialogFooter className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1 bg-white/60 backdrop-blur-sm border-gray-200/50 rounded-xl cursor-pointer"
            >
              취소
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              className="flex-1 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors cursor-pointer"
            >
              신청하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
