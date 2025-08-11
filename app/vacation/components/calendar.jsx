"use client";

import { useState, useEffect } from "react";
import { format, isSameDay, addDays, startOfDay } from "date-fns";
import { ko } from "date-fns/locale";
import { DayPicker, useNavigation } from "react-day-picker"; // ← useNavigation 추가
import { Card } from "@/components/ui/card";
import "react-day-picker/dist/style.css";

/** ✅ 타이틀/네비를 하나로 묶은 커스텀 캡션 */
function CaptionBar({ displayMonth }) {
  const { previousMonth, nextMonth, goToMonth } = useNavigation();

  return (
    <div className="flex items-center justify-between px-3 pt-3 pb-2">
      <button
        type="button"
        aria-label="이전 달"
        disabled={!previousMonth}
        onClick={() => previousMonth && goToMonth(previousMonth)}
        className="h-7 w-7 rounded-md text-blue-600 hover:bg-blue-50 disabled:opacity-40 disabled:hover:bg-transparent"
      >
        {/* ← 아이콘 */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M15 18l-6-6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className="text-base font-semibold">
        {format(displayMonth, "M월 yyyy", { locale: ko })}
      </div>

      <button
        type="button"
        aria-label="다음 달"
        disabled={!nextMonth}
        onClick={() => nextMonth && goToMonth(nextMonth)}
        className="h-7 w-7 rounded-md text-blue-600 hover:bg-blue-50 disabled:opacity-40 disabled:hover:bg-transparent"
      >
        {/* → 아이콘 */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M9 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}

export default function Calendar({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  selectedDates,
  isFilterMode = false,
}) {
  const [range, setRange] = useState({
    from: startDate ? new Date(startDate) : null,
    to: endDate ? new Date(endDate) : null,
  });

  // 부모 컴포넌트의 날짜가 변경될 때 로컬 상태 업데이트
  useEffect(() => {
    setRange({
      from: startDate ? new Date(startDate) : null,
      to: endDate ? new Date(endDate) : null,
    });
  }, [startDate, endDate]);

  // 날짜 범위가 변경될 때 부모 컴포넌트에 알림
  const handleRangeSelect = (selectedRange) => {
    setRange(selectedRange);

    if (selectedRange?.from) {
      onStartDateChange(selectedRange.from);
    }

    if (selectedRange?.to) {
      onEndDateChange(selectedRange.to);
    }
  };

  return (
    <div className={isFilterMode ? "mb-0" : "mb-4"}>
      {!isFilterMode && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          날짜 선택
        </label>
      )}
      <Card
        className={`${
          isFilterMode ? "p-2" : "p-3"
        } bg-white/60 backdrop-blur-sm border-gray-200/50`}
      >
        <DayPicker
          mode="range"
          defaultMonth={new Date()} // 오늘 날짜를 초기 표시
          selected={range}
          onSelect={handleRangeSelect}
          locale={ko}
          /** 커스텀 캡션 사용: 타이틀/네비 묶음 */
          components={{ Caption: CaptionBar }}
          className="custom-day-picker"
          classNames={{
            months:
              "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            /** 캡션을 따로 절대배치하지 않고, 기본 흐름에서 위쪽에 배치 */
            month: "space-y-3", // 필요하면 "pt-1" 등으로 미세 조정

            // caption/nav 관련 기존 절대배치/좌표는 제거 (커스텀 캡션이 대체)
            // caption: "flex justify-between items-center pt-1 relative w-full",
            // caption_label: "font-semibold text-sm",
            // nav: "flex items-center gap-1",
            // nav_button_previous: "absolute left-0",
            // nav_button_next: "absolute right-0",

            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell: `text-gray-500 rounded-md w-7 font-normal ${
              isFilterMode ? "text-[0.6rem]" : "text-[0.8rem]"
            }`,
            row: "flex w-full mt-1",
            cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
            day: `p-0 font-normal aria-selected:opacity-100 hover:bg-gray-100 rounded-md ${
              isFilterMode ? "h-5 w-5 text-xs" : "h-8 w-8 text-sm"
            }`,
            day_selected:
              "bg-blue-500 text-white hover:bg-blue-600 focus:bg-blue-500",
            day_today: "bg-gray-100 text-gray-900",
            day_outside: "text-gray-400 opacity-50",
            day_disabled: "text-gray-400 opacity-50",
            day_range_middle:
              "aria-selected:bg-blue-100 aria-selected:text-blue-900",
            day_hidden: "invisible",
          }}
          styles={{
            day: { margin: 0 },
          }}
        />
      </Card>
    </div>
  );
}
