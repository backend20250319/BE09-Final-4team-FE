"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { X, Clock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Box, Grid } from "@mui/material";
import SelectTime from "@/components/clock/SelectTime";

export default function VacationModal({ isOpen, onClose, onSubmit }) {
  const [vacationType, setVacationType] = useState("기본 연차");
  const [selectedDates, setSelectedDates] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");
  const [reason, setReason] = useState("");
  const [showStartTimeModal, setShowStartTimeModal] = useState(false);
  const [showEndTimeModal, setShowEndTimeModal] = useState(false);

  const vacationTypes = [
    { value: "기본 연차", label: "기본 연차" },
    { value: "보상 연차", label: "보상 연차" },
    { value: "특별 연차", label: "특별 연차" },
  ];

  // MUI 테마 설정
  const theme = createTheme({
    palette: {
      primary: {
        main: "#3b82f6", // blue-500
      },
    },
  });

  const handleStartDateChange = (newStartDate) => {
    setStartDate(newStartDate);
    updateSelectedDates(newStartDate, endDate);
  };

  const handleEndDateChange = (newEndDate) => {
    setEndDate(newEndDate);
    updateSelectedDates(startDate, newEndDate);
  };

  const updateSelectedDates = (start, end) => {
    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      const dates = [];
      const current = new Date(startDate);

      while (current <= endDate) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
      setSelectedDates(dates);
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
    setVacationType("기본 연차");
    setSelectedDates([]);
    setStartDate(null);
    setEndDate(null);
    setStartTime("09:00");
    setEndTime("18:00");
    setReason("");
    onClose();
  };

  const handleStartTimeSelect = (time) => {
    setStartTime(time);
    setShowStartTimeModal(false);
  };

  const handleEndTimeSelect = (time) => {
    setEndTime(time);
    setShowEndTimeModal(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <GlassCard className="w-full max-w-2xl mx-4 p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">휴가 신청</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Vacation Type Dropdown */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            휴가 종류
          </label>
          <Select value={vacationType} onValueChange={setVacationType}>
            <SelectTrigger className="w-full bg-white/60 backdrop-blur-sm border-gray-200/50 rounded-xl">
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
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            날짜 선택
          </label>
          <Card className="p-4 bg-white/60 backdrop-blur-sm border-gray-200/50">
            <ThemeProvider theme={theme}>
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={ko}
              >
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <DatePicker
                      label="시작일"
                      value={startDate}
                      onChange={handleStartDateChange}
                      slotProps={{
                        textField: {
                          size: "small",
                          fullWidth: true,
                          sx: {
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "12px",
                              backgroundColor: "rgba(255, 255, 255, 0.6)",
                              backdropFilter: "blur(8px)",
                              border: "1px solid rgba(229, 231, 235, 0.5)",
                            },
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <DatePicker
                      label="종료일"
                      value={endDate}
                      onChange={handleEndDateChange}
                      slotProps={{
                        textField: {
                          size: "small",
                          fullWidth: true,
                          sx: {
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "12px",
                              backgroundColor: "rgba(255, 255, 255, 0.6)",
                              backdropFilter: "blur(8px)",
                              border: "1px solid rgba(229, 231, 235, 0.5)",
                            },
                          },
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </LocalizationProvider>
            </ThemeProvider>
          </Card>
          {selectedDates.length > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              선택된 날짜: {selectedDates.length}일
              {startDate && endDate && (
                <span className="ml-2">
                  ({format(startDate, "yyyy-MM-dd")} ~{" "}
                  {format(endDate, "yyyy-MM-dd")})
                </span>
              )}
            </div>
          )}
        </div>

        {/* Time Inputs */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              휴가 시작 시간
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                value={startTime}
                readOnly
                onClick={() => setShowStartTimeModal(true)}
                className="pl-10 bg-white/60 backdrop-blur-sm border-gray-200/50 rounded-xl cursor-pointer"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              휴가 종료 시간
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                value={endTime}
                readOnly
                onClick={() => setShowEndTimeModal(true)}
                className="pl-10 bg-white/60 backdrop-blur-sm border-gray-200/50 rounded-xl cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Reason Textarea */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            연차 사유
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Textarea
              placeholder="연차 사유를 입력해주세요..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="pl-10 bg-white/60 backdrop-blur-sm border-gray-200/50 rounded-xl min-h-[100px] resize-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            className="flex-1 bg-white/60 backdrop-blur-sm border-gray-200/50 rounded-xl"
          >
            취소
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            className="flex-1 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
          >
            신청하기
          </Button>
        </div>
      </GlassCard>

      {/* SelectTime Modals */}
      {showStartTimeModal && (
        <SelectTime
          onTimeSelect={handleStartTimeSelect}
          onClose={() => setShowStartTimeModal(false)}
        />
      )}
      {showEndTimeModal && (
        <SelectTime
          onTimeSelect={handleEndTimeSelect}
          onClose={() => setShowEndTimeModal(false)}
        />
      )}
    </div>
  );
}
