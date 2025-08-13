"use client";

import { useState, useEffect, useRef } from "react";
import { Calendar, Users, Clock, TrendingUp } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { DateNavigation } from "@/components/ui/date-navigation";
import { GlassCard } from "@/components/ui/glass-card";
import { colors } from "@/lib/design-tokens";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// ScheduleCalendar를 클라이언트에서만 로드
const ScheduleCalendar = dynamic(
  () => import("@/components/calendar/schedule-calendar"),
  {
    ssr: false,
    loading: () => (
      <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">스케줄 로딩 중...</p>
        </div>
      </div>
    ),
  }
);

// 유형 ↔ 색상 매핑 (요청 팔레트)
const TYPE_COLORS = {
  근무: "#4FC3F7",
  재택: "#B39DDB",
  외근: "#AED581",
  출장: "#FFB74D",
  휴가: "#F48FB1",
  휴게: "#B2DFDB",
};

export default function MyWorkComponent() {
  const [currentWeek, setCurrentWeek] = useState("");
  const [events, setEvents] = useState([]);
  const [originalEvents, setOriginalEvents] = useState([]);
  const [weekDates, setWeekDates] = useState({});
  const [isClient, setIsClient] = useState(false);
  const [baseDate, setBaseDate] = useState(new Date());
  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  const [workTimeSummary, setWorkTimeSummary] = useState({
    totalHours: 0,
    averageHours: 40,
    percentage: 0,
  });

  // 드롭다운 상태
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownEventId, setDropdownEventId] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });

  const router = useRouter();

  // 정해진 시간 범위에서 시간 생성 (예시)
  const timeRanges = [
    { start: "09:00", end: "11:00" },
    { start: "13:00", end: "15:00" },
    { start: "15:30", end: "17:00" },
    { start: "10:00", end: "12:00" },
    { start: "14:00", end: "16:00" },
    { start: "16:30", end: "18:00" },
  ];

  // 요일별 시간 패턴 설정
  const getTimePatternForDay = (dayOfWeek) => {
    switch (dayOfWeek) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        return [
          { start: "08:00", end: "12:00", title: "근무", type: "work" },
          { start: "12:00", end: "13:30", title: "휴게", type: "break" },
          { start: "13:30", end: "18:00", title: "근무", type: "work" },
        ];
      default:
        return [];
    }
  };

  // 클라이언트 사이드에서만 실행
  useEffect(() => {
    setIsClient(true);
  }, []);

  // baseDate를 기준으로 주차 계산
  useEffect(() => {
    if (!isClient) return;

    const currentDay = baseDate.getDay(); // 0: 일요일 ~ 6: 토요일
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(baseDate);
    monday.setDate(baseDate.getDate() + mondayOffset);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const mondayStr = formatDate(monday);
    const sundayStr = formatDate(sunday);
    setCurrentWeek(`${mondayStr} ~ ${sundayStr}`);

    const weekMapping = {};
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(monday);
      currentDate.setDate(monday.getDate() + i);
      const dayKey = currentDate.getDate();
      weekMapping[dayKey] = formatDate(currentDate);
    }
    setWeekDates(weekMapping);
  }, [isClient, baseDate]);

  // 현재 주 기준으로 scheduleData 생성
  const generateScheduleData = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);

    const scheduleData = {};

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(monday);
      currentDate.setDate(monday.getDate() + i);
      const dayKey = currentDate.getDate();
      const dayOfWeek = currentDate.getDay();

      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        // 평일: 다양한 근무 유형으로 구성
        const workTypes = ["근무", "재택", "외근", "출장"];
        const randomType =
          workTypes[Math.floor(Math.random() * workTypes.length)];

        scheduleData[dayKey] = [
          {
            startTime: "09:00",
            endTime: "12:00",
            title: randomType,
            color: TYPE_COLORS[randomType],
            type: "work",
          },
          {
            startTime: "12:00",
            endTime: "13:00",
            title: "휴게",
            color: TYPE_COLORS.휴게,
            type: "break",
          },
          {
            startTime: "13:00",
            endTime: "18:00",
            title: randomType,
            color: TYPE_COLORS[randomType],
            type: "work",
          },
        ];
      } else if (dayOfWeek === 0) {
        // 일요일: 휴가
        scheduleData[dayKey] = [
          {
            title: "휴가",
            color: TYPE_COLORS.휴가,
            type: "vacation",
          },
        ];
      } else if (dayOfWeek === 6) {
        // 토요일: 휴가
        scheduleData[dayKey] = [
          {
            title: "휴가",
            color: TYPE_COLORS.휴가,
            type: "vacation",
          },
        ];
      }
    }
    return scheduleData;
  };

  // scheduleData → FullCalendar events 변환
  useEffect(() => {
    if (!isClient || !currentWeek || Object.keys(weekDates).length === 0)
      return;

    const scheduleData = generateScheduleData();
    const convertedEvents = [];

    Object.entries(scheduleData).forEach(([day, events]) => {
      const dateString = weekDates[parseInt(day)];

      events.forEach((event, index) => {
        let startTime, endTime, allDay;

        if (event.startTime && event.endTime) {
          startTime = `${dateString}T${event.startTime}:00`;
          endTime = `${dateString}T${event.endTime}:00`;
          allDay = false;
        } else if (event.time) {
          startTime = `${dateString}T${event.time}:00`;
          const endDate = new Date(`${dateString}T${event.time}:00`);
          endDate.setMinutes(endDate.getMinutes() + 30);
          endTime = endDate.toISOString();
          allDay = false;
        } else {
          startTime = `${dateString}T09:00:00`;
          endTime = `${dateString}T18:00:00`;
          allDay = true;
        }

        const eventObj = {
          id: `${day}-${index}`,
          title: event.title,
          start: startTime,
          end: endTime,
          backgroundColor: event.color,
          borderColor: event.color,
          textColor: "#ffffff",
          allDay: allDay,
          extendedProps: {
            originalTime: event.time,
            originalStartTime: event.startTime,
            originalEndTime: event.endTime,
            originalTitle: event.title,
            originalColor: event.color,
            isAllDayRest: event.isAllDayRest || false,
            type: event.type || "unknown",
          },
        };
        convertedEvents.push(eventObj);
      });
    });

    setEvents(convertedEvents);
    setOriginalEvents(convertedEvents);
  }, [isClient, currentWeek, weekDates]);

  // 근무 시간 계산 (근무, 외근, 출장, 재택 모두 포함, 휴가 제외)
  const calculateWorkTime = (events) => {
    let totalMinutes = 0;
    const workTypes = ["근무", "외근", "출장", "재택"];

    events.forEach((event) => {
      if (workTypes.includes(event.title) && event.start && event.end) {
        const start = new Date(event.start);
        const end = new Date(event.end);
        const diffMinutes = (end - start) / (1000 * 60);
        totalMinutes += diffMinutes;
      }
    });

    const totalHours = Math.round((totalMinutes / 60) * 10) / 10;
    const averageHours = 40;
    const percentage = Math.min((totalHours / averageHours) * 100, 100);
    return { totalHours, averageHours, percentage };
  };

  useEffect(() => {
    if (events.length > 0) {
      const summary = calculateWorkTime(events);
      setWorkTimeSummary(summary);
    }
  }, [events]);

  const handlePreviousWeek = () => {
    const newBaseDate = new Date(baseDate);
    newBaseDate.setDate(baseDate.getDate() - 7);
    setBaseDate(newBaseDate);
  };
  const handleNextWeek = () => {
    const newBaseDate = new Date(baseDate);
    newBaseDate.setDate(baseDate.getDate() + 7);
    setBaseDate(newBaseDate);
  };

  const handleEventDrop = (info) => {
    if (info.event.start.getDay() === 0) {
      alert("일요일에는 일정을 이동할 수 없습니다.");
      return;
    }
    const updated = events.map((event) =>
      event.id === info.event.id
        ? {
            ...event,
            start: info.event.start.toISOString(),
            end: info.event.end ? info.event.end.toISOString() : event.end,
            status: "pending",
          }
        : event
    );
    setEvents(updated);
    setHasPendingChanges(true);
  };

  const handleEventResize = (info) => {
    if (info.event.start.getDay() === 0) {
      alert("일요일에는 일정을 수정할 수 없습니다.");
      return;
    }
    const updated = events.map((event) =>
      event.id === info.event.id
        ? {
            ...event,
            start: info.event.start.toISOString(),
            end: info.event.end.toISOString(),
            status: "pending",
          }
        : event
    );
    setEvents(updated);
    setHasPendingChanges(true);
  };

  const handleSelect = (selectInfo) => {
    if (selectInfo.start.getDay() === 0) {
      alert("일요일에는 일정을 추가할 수 없습니다.");
      return;
    }

    const calendarApi = selectInfo.view.calendar;
    const newEvent = {
      id: new Date().getTime().toString(),
      title: "근무",
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      allDay: selectInfo.allDay,
      backgroundColor: "#3b82f6", // 임시 기본색 (선택 후 바뀜)
      borderColor: "#3b82f6",
      textColor: "#ffffff",
      status: "pending",
      isNewEvent: true, // 새 이벤트 식별자 (extendedProps로 들어감)
    };

    calendarApi.addEvent(newEvent);
    setEvents((prev) => [...prev, newEvent]);
    setHasPendingChanges(true);
    calendarApi.unselect();
  };

  const handleEventClick = (clickInfo) => {
    if (clickInfo.event.start.getDay() === 0) {
      alert("일요일에는 일정을 삭제할 수 없습니다.");
      return;
    }
    if (confirm("이 일정을 삭제하시겠습니까?")) {
      clickInfo.event.remove();
      setEvents((prev) => prev.filter((e) => e.id !== clickInfo.event.id));
      setHasPendingChanges(true);
    }
  };

  const dayCellDidMountHandler = (arg) => {
    if (arg.date.getDay() === 0) {
      arg.el.style.backgroundColor = "#ffe5e5";
    }
  };

  const handleCancelChanges = () => {
    setEvents(originalEvents);
    setHasPendingChanges(false);
  };

  const handleSubmitChanges = () => {
    const pendingEvents = events.filter((e) => e.status === "pending");
    console.log("변경 신청된 일정들:", pendingEvents);
    setHasPendingChanges(false);
  };

  const handleEventTitleEdit = (eventId, newTitle) => {
    const updated = events.map((event) =>
      event.id === eventId
        ? { ...event, title: newTitle, status: "pending" }
        : event
    );
    setEvents(updated);
    setHasPendingChanges(true);
  };

  // 드롭다운에서 유형 선택 시 호출: 색상은 매핑에서 조회
  const handleTitleSelect = (eventId, selectedType) => {
    const selectedColor = TYPE_COLORS[selectedType];
    const updated = events.map((event) => {
      if (event.id === eventId) {
        return {
          ...event,
          title: selectedType,
          backgroundColor: selectedColor,
          borderColor: selectedColor,
          status: "pending",
          isNewEvent: false, // 이후 변경 불가
        };
      }
      return event;
    });
    setEvents(updated);
    setShowDropdown(false);
    setDropdownEventId(null);
    setHasPendingChanges(true);
  };

  // 드롭다운 메뉴 컴포넌트 (텍스트만, fixed 포지셔닝, 내부 클릭 보호)
  const TitleDropdown = ({ eventId, position, onSelect, onClose }) => {
    const options = ["근무", "재택", "외근", "출장", "휴가", "휴게"];
    const ref = useRef(null);

    useEffect(() => {
      const handleDocMouseDown = (e) => {
        if (ref.current && !ref.current.contains(e.target)) {
          onClose();
        }
      };
      document.addEventListener("mousedown", handleDocMouseDown);
      return () =>
        document.removeEventListener("mousedown", handleDocMouseDown);
    }, [onClose]);

    // 화면 끝 보정
    const padding = 8;
    const left = Math.min(position.x, window.innerWidth - padding);
    const top = Math.min(position.y, window.innerHeight - padding);

    return (
      <div
        ref={ref}
        style={{
          position: "fixed",
          left,
          top,
          zIndex: 1000,
          backgroundColor: "white",
          border: "1px solid #d1d5db",
          borderRadius: "6px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          overflow: "hidden",
          whiteSpace: "nowrap", // 텍스트 줄바꿈 방지
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {options.map((label) => (
          <button
            key={label}
            onClick={() => onSelect(eventId, label)}
            style={{
              cursor: "pointer",
              background: "white",
              display: "block",
              width: "100%",
              textAlign: "left",
              padding: "4px 8px", // 패딩 줄임
              fontSize: "13px", // 글씨 크기 약간 줄임
              borderBottom: "1px solid #f3f4f6",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#f9fafb")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "white")
            }
          >
            {label}
          </button>
        ))}
      </div>
    );
  };

  // SimpleEvent: 제목 클릭 → 드롭다운을 제목 바로 아래에 표시
  const SimpleEvent = ({ event }) => {
    const handleTitleClick = (e) => {
      if (event.extendedProps?.isNewEvent) {
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        setDropdownPosition({ x: rect.left, y: rect.bottom + 5 }); // 텍스트 바로 아래
        setDropdownEventId(event.id);
        setShowDropdown(true);
      }
    };

    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          padding: "4px",
          position: "relative",
        }}
      >
        {/* 시간 표시 */}
        <div
          style={{
            fontSize: "10px",
            color: "rgba(255, 255, 255, 0.9)",
            marginBottom: "2px",
            fontWeight: "normal",
            lineHeight: "1",
          }}
        >
          {new Date(event.start).toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}{" "}
          -{" "}
          {new Date(event.end).toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </div>

        {/* 제목 (클릭 시 드롭다운) */}
        <div
          onClick={handleTitleClick}
          style={{
            fontSize: "inherit",
            fontWeight: "inherit",
            color: "white",
            width: "100%",
            lineHeight: "1.1",
            cursor: event.extendedProps?.isNewEvent ? "pointer" : "default",
            textDecoration: event.extendedProps?.isNewEvent
              ? "underline"
              : "none",
          }}
          title={event.extendedProps?.isNewEvent ? "유형 선택" : undefined}
        >
          {event.title}
        </div>
      </div>
    );
  };

  const eventContent = (arg) => <SimpleEvent event={arg.event} />;

  // 게이지 컴포넌트
  const WorkTimeGauge = ({ percentage, totalHours, averageHours }) => {
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const getGaugeColor = (p) => {
      if (p >= 80) return "#10b981";
      if (p >= 60) return "#f59e0b";
      return "#ef4444";
    };

    return (
      <div className="flex items-center space-x-4">
        <div className="relative">
          <svg width="80" height="80" className="transform -rotate-90">
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke="#e5e7eb"
              strokeWidth="6"
              fill="none"
            />
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke={getGaugeColor(percentage)}
              strokeWidth="6"
              fill="none"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-semibold text-gray-700">
              {Math.round(percentage)}%
            </span>
          </div>
        </div>
        <div className="flex-1">
          <div className="text-sm text-gray-600 mb-1">이번주 근무 시간</div>
          <div className="text-2xl font-bold text-gray-800 mb-1">
            {totalHours}시간
          </div>
          <div className="text-xs text-gray-500">
            평균 {averageHours}시간 대비
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="-mt-16">
      {/* Date Navigation and Work Time Summary Row */}
      <div className="flex items-start justify-between mb-2">
        <div className="w-80 flex-shrink-0"></div>
        <div className="flex-1 flex justify-center mt-2">
          <DateNavigation
            currentPeriod={currentWeek}
            onPrevious={handlePreviousWeek}
            onNext={handleNextWeek}
          />
        </div>
        <div className="w-80 flex-shrink-0 -mt-6">
          <GlassCard className="p-4 border-2 border-gray-300 shadow-none">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800">
                  이번주 근무 현황
                </h3>
                <p className="text-xs text-gray-600">
                  근무 시간 및 목표 달성률
                </p>
              </div>
            </div>
            <WorkTimeGauge
              percentage={workTimeSummary.percentage}
              totalHours={workTimeSummary.totalHours}
              averageHours={workTimeSummary.averageHours}
            />
          </GlassCard>
        </div>
      </div>

      {/* FullCalendar Schedule */}
      <GlassCard className="p-6">
        <div className="calendar-container">
          {isClient && (
            <ScheduleCalendar
              events={events}
              onEventDrop={handleEventDrop}
              onEventResize={handleEventResize}
              onSelect={handleSelect}
              onEventClick={handleEventClick}
              dayCellDidMount={dayCellDidMountHandler}
              eventContent={eventContent}
              editable={true}
            />
          )}
        </div>
      </GlassCard>

      {/* 드롭다운 메뉴 */}
      {showDropdown && (
        <TitleDropdown
          eventId={dropdownEventId}
          position={dropdownPosition}
          onSelect={handleTitleSelect} // (eventId, selectedType)
          onClose={() => setShowDropdown(false)}
        />
      )}

      {/* 변경 사항 배너 */}
      {hasPendingChanges && (
        <div className="fixed bottom-0 left-0 right-0 bg-yellow-100 border-t border-yellow-200 p-4 z-50">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="text-gray-800 font-medium">
              변경 사항이 있습니다. 근무 변경을 신청하시겠습니까?
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCancelChanges}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleSubmitChanges}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                변경 신청
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
