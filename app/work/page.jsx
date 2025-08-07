"use client";

import { useState, useEffect, useRef } from "react";
import { Calendar, Users } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { TabGroup } from "@/components/ui/tab-group";
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

export default function SchedulePage() {
  const [currentWeek, setCurrentWeek] = useState("");
  const [activeTab, setActiveTab] = useState("my");
  const [events, setEvents] = useState([]);
  const [originalEvents, setOriginalEvents] = useState([]);
  const [weekDates, setWeekDates] = useState({});
  const [isClient, setIsClient] = useState(false);
  const [baseDate, setBaseDate] = useState(new Date());
  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  const router = useRouter();

  const tabs = [
    {
      id: "my",
      label: "내 근무 일정",
      icon: <Calendar className="w-4 h-4" />,
      onClick: () => router.push("/work"), // 클릭 시 /work 이동
    },
    {
      id: "team",
      label: "동료 근무 일정",
      icon: <Users className="w-4 h-4" />,
      onClick: () => router.push("/work/coworker"), // 클릭 시 /work/coworker 이동
    },
  ];

  // 정해진 시간 범위에서 시간 생성
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
      case 1: // 월요일
        return [
          { start: "09:00", end: "11:00" },
          { start: "13:00", end: "15:00" },
        ];
      case 2: // 화요일
        return [
          { start: "10:00", end: "12:00" },
          { start: "15:30", end: "17:00" },
        ];
      case 3: // 수요일
        return [{ start: "14:00", end: "16:00" }];
      case 4: // 목요일
        return [
          { start: "09:00", end: "11:00" },
          { start: "16:30", end: "18:00" },
        ];
      case 5: // 금요일
        return [
          { start: "13:00", end: "15:00" },
          { start: "15:30", end: "17:00" },
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

    const currentDay = baseDate.getDay(); // 0: 일요일, 1: 월요일, ..., 6: 토요일

    // 해당 주의 월요일 계산 (월요일이 1이므로)
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(baseDate);
    monday.setDate(baseDate.getDate() + mondayOffset);

    // 해당 주의 일요일 계산
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    // 날짜 형식 변환 (YYYY-MM-DD)
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const mondayStr = formatDate(monday);
    const sundayStr = formatDate(sunday);

    // currentWeek 설정
    setCurrentWeek(`${mondayStr} ~ ${sundayStr}`);

    // 주간 날짜 매핑 생성
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

    // 각 요일별 일정 생성
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(monday);
      currentDate.setDate(monday.getDate() + i);
      const dayKey = currentDate.getDate();
      const dayOfWeek = currentDate.getDay(); // 0: 일요일, 1: 월요일, ...

      // 요일별 일정 패턴 설정
      if (dayOfWeek === 1) {
        // 월요일
        const timePattern = getTimePatternForDay(1);
        scheduleData[dayKey] = [
          {
            startTime: timePattern[0].start,
            endTime: timePattern[0].end,
            title: "주간 회의",
            color: colors.schedule.meeting,
          },
          {
            startTime: timePattern[1].start,
            endTime: timePattern[1].end,
            title: "프로젝트 기획",
            color: colors.schedule.project,
          },
        ];
      } else if (dayOfWeek === 2) {
        // 화요일
        const timePattern = getTimePatternForDay(2);
        scheduleData[dayKey] = [
          {
            startTime: timePattern[0].start,
            endTime: timePattern[0].end,
            title: "팀 미팅",
            color: colors.schedule.meeting,
          },
          {
            startTime: timePattern[1].start,
            endTime: timePattern[1].end,
            title: "코드 리뷰",
            color: colors.schedule.education,
          },
        ];
      } else if (dayOfWeek === 3) {
        // 수요일
        const timePattern = getTimePatternForDay(3);
        scheduleData[dayKey] = [
          {
            startTime: timePattern[0].start,
            endTime: timePattern[0].end,
            title: "고객 미팅",
            color: colors.schedule.customer,
          },
        ];
      } else if (dayOfWeek === 4) {
        // 목요일
        const timePattern = getTimePatternForDay(4);
        scheduleData[dayKey] = [
          {
            startTime: timePattern[0].start,
            endTime: timePattern[0].end,
            title: "프로젝트 발표",
            color: colors.schedule.project,
          },
          {
            startTime: timePattern[1].start,
            endTime: timePattern[1].end,
            title: "팀 워크샵",
            color: colors.schedule.education,
          },
        ];
      } else if (dayOfWeek === 5) {
        // 금요일
        const timePattern = getTimePatternForDay(5);
        scheduleData[dayKey] = [
          {
            startTime: timePattern[0].start,
            endTime: timePattern[0].end,
            title: "주간 정리",
            color: colors.schedule.report,
          },
          {
            startTime: timePattern[1].start,
            endTime: timePattern[1].end,
            title: "다음 주 계획",
            color: colors.schedule.project,
          },
        ];
      } else if (dayOfWeek === 0) {
        // 일요일
        scheduleData[dayKey] = [
          { title: "휴식", color: colors.schedule.vacation },
        ];
      } else if (dayOfWeek === 6) {
        // 토요일
        scheduleData[dayKey] = [
          { title: "휴식", color: colors.schedule.vacation },
        ];
      }
    }

    return scheduleData;
  };

  // Convert scheduleData to FullCalendar events format
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
          // startTime과 endTime이 있는 경우: 시간 기반 이벤트
          startTime = `${dateString}T${event.startTime}:00`;
          endTime = `${dateString}T${event.endTime}:00`;
          allDay = false;
        } else if (event.time) {
          // event.time이 있는 경우: start는 지정된 시간, end는 30분 뒤
          startTime = `${dateString}T${event.time}:00`;

          // 시간을 30분 뒤로 설정
          const endDate = new Date(`${dateString}T${event.time}:00`);
          endDate.setMinutes(endDate.getMinutes() + 30);
          endTime = endDate.toISOString();
          allDay = false;
        } else {
          // event.time, startTime 둘 다 없는 경우: 하루 종일 이벤트
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
          },
        };
        convertedEvents.push(eventObj);
      });
    });

    setEvents(convertedEvents);
    setOriginalEvents(convertedEvents);
  }, [isClient, currentWeek, weekDates]);

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
    // 일요일 체크
    if (info.event.start.getDay() === 0) {
      alert("일요일에는 일정을 이동할 수 없습니다.");
      return;
    }

    const updatedEvents = events.map((event) => {
      if (event.id === info.event.id) {
        return {
          ...event,
          start: info.event.start.toISOString(),
          end: info.event.end ? info.event.end.toISOString() : event.end,
          status: "pending",
        };
      }
      return event;
    });
    setEvents(updatedEvents);
    setHasPendingChanges(true);
  };

  const handleEventResize = (info) => {
    // 일요일 체크
    if (info.event.start.getDay() === 0) {
      alert("일요일에는 일정을 수정할 수 없습니다.");
      return;
    }

    const updatedEvents = events.map((event) => {
      if (event.id === info.event.id) {
        return {
          ...event,
          start: info.event.start.toISOString(),
          end: info.event.end.toISOString(),
          status: "pending",
        };
      }
      return event;
    });
    setEvents(updatedEvents);
    setHasPendingChanges(true);
  };

  const handleSelect = (selectInfo) => {
    // 일요일 체크
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
      backgroundColor: "#3b82f6", // 기본 파란색
      borderColor: "#3b82f6",
      textColor: "#ffffff",
      status: "pending",
    };

    // FullCalendar에 이벤트 추가
    calendarApi.addEvent(newEvent);

    // events state에도 추가
    setEvents((prevEvents) => [...prevEvents, newEvent]);
    setHasPendingChanges(true);

    // 선택 영역 해제
    calendarApi.unselect();
  };

  const handleEventClick = (clickInfo) => {
    // 일요일 체크
    if (clickInfo.event.start.getDay() === 0) {
      alert("일요일에는 일정을 삭제할 수 없습니다.");
      return;
    }

    if (confirm("이 일정을 삭제하시겠습니까?")) {
      clickInfo.event.remove();
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== clickInfo.event.id)
      );
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
    const pendingEvents = events.filter((event) => event.status === "pending");
    console.log("변경 신청된 일정들:", pendingEvents);
    setHasPendingChanges(false);
  };

  const handleEventTitleEdit = (eventId, newTitle) => {
    const updatedEvents = events.map((event) => {
      if (event.id === eventId) {
        return {
          ...event,
          title: newTitle,
          status: "pending",
        };
      }
      return event;
    });
    setEvents(updatedEvents);
    setHasPendingChanges(true);
  };

  // EditableEvent 컴포넌트
  const EditableEvent = ({ event, onTitleChange }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(event.title);
    const inputRef = useRef(null);

    const handleDoubleClick = () => {
      setIsEditing(true);
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 0);
    };

    const handleSave = () => {
      if (editValue.trim()) {
        onTitleChange(event.id, editValue.trim());
      }
      setIsEditing(false);
    };

    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        handleSave();
      } else if (e.key === "Escape") {
        setEditValue(event.title);
        setIsEditing(false);
      }
    };

    const handleBlur = () => {
      handleSave();
    };

    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* 시간 표시 */}
        <div
          style={{
            fontSize: "10px",
            color: "rgba(255, 255, 255, 0.8)",
            marginBottom: "2px",
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

        {/* 제목 (인라인 수정 가능) */}
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            style={{
              background: "transparent",
              border: "none",
              color: "white",
              fontSize: "inherit",
              fontWeight: "inherit",
              width: "100%",
              outline: "none",
              padding: "0",
              margin: "0",
            }}
          />
        ) : (
          <div
            onDoubleClick={handleDoubleClick}
            style={{
              cursor: "pointer",
              fontSize: "inherit",
              fontWeight: "inherit",
              color: "white",
            }}
          >
            {event.title}
          </div>
        )}
      </div>
    );
  };

  const eventContent = (arg) => {
    return (
      <EditableEvent event={arg.event} onTitleChange={handleEventTitleEdit} />
    );
  };

  return (
    <MainLayout>
      {/* Tabs */}
      <TabGroup
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(tabId) => {
          setActiveTab(tabId);
          const clickedTab = tabs.find((t) => t.id === tabId);
          if (clickedTab?.onClick) clickedTab.onClick(); // 해당 탭의 라우팅 실행
        }}
        className="mb-8"
      />

      {/* Date Navigation */}
      <DateNavigation
        currentPeriod={currentWeek}
        onPrevious={handlePreviousWeek}
        onNext={handleNextWeek}
        className="mb-8"
      />

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
    </MainLayout>
  );
}
