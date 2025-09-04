"use client";

import { useState, useEffect, useRef } from "react";
import { Calendar, Users, Clock, TrendingUp } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { DateNavigation } from "@/components/ui/date-navigation";
import { GlassCard } from "@/components/ui/glass-card";
import { colors } from "@/lib/design-tokens";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { workScheduleApi } from "@/lib/services/attendance";
import { useAuth } from "@/hooks/use-auth";
import { ScheduleType } from "@/lib/services/attendance";

// Type definitions
interface WorkEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  allDay: boolean;
  status?: string;
  isNewEvent?: boolean;
  extendedProps: {
    originalTime?: string;
    originalStartTime?: string;
    originalEndTime?: string;
    originalTitle?: string;
    originalColor?: string;
    isAllDayRest?: boolean;
    type?: string;
    isNewEvent?: boolean;
  };
}

interface WorkTimeSummary {
  totalHours: number;
  averageHours: number;
  percentage: number;
}

interface WeekDates {
  [key: number]: string;
}

interface DropdownPosition {
  x: number;
  y: number;
}

interface ScheduleEvent {
  startTime?: string;
  endTime?: string;
  title: string;
  color: string;
  type: string;
  time?: string;
  isAllDayRest?: boolean;
}

interface ScheduleData {
  [key: number]: ScheduleEvent[];
}

interface TimeRange {
  start: string;
  end: string;
}

interface TimePattern {
  start: string;
  end: string;
  title: string;
  type: string;
}

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

// 유형 ↔ 색상 매핑 (Backend ScheduleType 기준)
const TYPE_COLORS: Record<ScheduleType, string> = {
  [ScheduleType.WORK]: "#4FC3F7",
  [ScheduleType.SICK_LEAVE]: "#F48FB1",
  [ScheduleType.VACATION]: "#F48FB1",
  [ScheduleType.BUSINESS_TRIP]: "#FFB74D",
  [ScheduleType.OUT_OF_OFFICE]: "#AED581",
  [ScheduleType.OVERTIME]: "#B39DDB",
  [ScheduleType.RESTTIME]: "#90CAF9",
};

// Backend ScheduleType(enum) → 한글 라벨 매핑
const SCHEDULE_TYPE_LABEL: Record<string, string> = {
  WORK: "근무",
  SICK_LEAVE: "병가",
  VACATION: "휴가",
  BUSINESS_TRIP: "출장",
  OUT_OF_OFFICE: "외근",
  OVERTIME: "초과근무",
  RESTTIME: "휴게시간",
};

// Backend ScheduleType(enum) → 색상 매핑 (TYPE_COLORS 재사용)
const SCHEDULE_TYPE_COLOR: Record<string, string> = {
  WORK: TYPE_COLORS[ScheduleType.WORK],
  SICK_LEAVE: TYPE_COLORS[ScheduleType.SICK_LEAVE],
  VACATION: TYPE_COLORS[ScheduleType.VACATION],
  BUSINESS_TRIP: TYPE_COLORS[ScheduleType.BUSINESS_TRIP],
  OUT_OF_OFFICE: TYPE_COLORS[ScheduleType.OUT_OF_OFFICE],
  OVERTIME: TYPE_COLORS[ScheduleType.OVERTIME],
  RESTTIME: TYPE_COLORS[ScheduleType.RESTTIME],
};

const toLabelFromEnum = (scheduleType?: string, fallback?: string): string => {
  if (!scheduleType) return fallback || "";
  return SCHEDULE_TYPE_LABEL[scheduleType] || fallback || scheduleType;
};

const toColorFromEnum = (scheduleType?: string, fallback?: string): string => {
  if (!scheduleType) return fallback || "#4FC3F7";
  return SCHEDULE_TYPE_COLOR[scheduleType] || fallback || "#4FC3F7";
};

export default function MyWorkComponent(): JSX.Element {
  const { user } = useAuth();
  const [currentWeek, setCurrentWeek] = useState<string>("");
  const [events, setEvents] = useState<WorkEvent[]>([]);
  const [originalEvents, setOriginalEvents] = useState<WorkEvent[]>([]);
  const [weekDates, setWeekDates] = useState<WeekDates>({});
  const [isClient, setIsClient] = useState<boolean>(false);
  const [baseDate, setBaseDate] = useState<Date>(new Date());
  const [hasPendingChanges, setHasPendingChanges] = useState<boolean>(false);
  const [workTimeSummary, setWorkTimeSummary] = useState<WorkTimeSummary>({
    totalHours: 0,
    averageHours: 40,
    percentage: 0,
  });

  // 드롭다운 상태
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [dropdownEventId, setDropdownEventId] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition>({
    x: 0,
    y: 0,
  });

  const router = useRouter();

  // 정해진 시간 범위에서 시간 생성 (예시)
  const timeRanges: TimeRange[] = [
    { start: "09:00", end: "11:00" },
    { start: "13:00", end: "15:00" },
    { start: "15:30", end: "17:00" },
    { start: "10:00", end: "12:00" },
    { start: "14:00", end: "16:00" },
    { start: "16:30", end: "18:00" },
  ];

  // 요일별 시간 패턴 설정
  const getTimePatternForDay = (dayOfWeek: number): TimePattern[] => {
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

    const formatDate = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const mondayStr = formatDate(monday);
    const sundayStr = formatDate(sunday);
    setCurrentWeek(`${mondayStr} ~ ${sundayStr}`);

    const weekMapping: WeekDates = {};
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(monday);
      currentDate.setDate(monday.getDate() + i);
      const dayKey = currentDate.getDate();
      weekMapping[dayKey] = formatDate(currentDate);
    }
    setWeekDates(weekMapping);
  }, [isClient, baseDate]);

  // 정책을 반영하여 해당 주의 고정 스케줄을 생성하고, 스케줄 불러오기
  useEffect(() => {
    const syncSchedulesWithPolicy = async () => {
      try {
        if (!user?.id || !isClient) return;

        // 주의 월요일~일요일 계산
        const d = new Date(baseDate);
        const currentDay = d.getDay();
        const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
        const monday = new Date(d);
        monday.setDate(d.getDate() + mondayOffset);
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);

        const toStr = (date: Date) => {
          const y = date.getFullYear();
          const m = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          return `${y}-${m}-${day}`;
        };

        const startDate = toStr(monday);
        const endDate = toStr(sunday);

        // Work Policy를 스케줄에 반영 (근무/휴게/코어/시차 등 전체 반영)
        await workScheduleApi.applyWorkPolicyToSchedule(
          Number(user.id),
          startDate,
          endDate
        );

        // 기간 스케줄 조회
        const schedules = await workScheduleApi.getUserSchedulesByDateRange(
          Number(user.id),
          startDate,
          endDate
        );

        // LocalTime(string/object) → HH:mm 변환
        const timeToHHmm = (t: any): string | undefined => {
          if (!t) return undefined;
          if (typeof t === "string") {
            // "HH:mm:ss" 또는 "HH:mm" → 앞 5자리
            return t.slice(0, 5);
          }
          if (typeof t.hour === "number" && typeof t.minute === "number") {
            return `${String(t.hour).padStart(2, "0")}:${String(
              t.minute
            ).padStart(2, "0")}`;
          }
          return undefined;
        };

        // 스케줄 → 캘린더 이벤트 매핑
        const mapped: WorkEvent[] = schedules.map((s) => {
          const startHHmm = timeToHHmm(s.startTime) || "09:00";
          const endHHmm = timeToHHmm(s.endTime) || "18:00";
          const start = `${s.startDate}T${startHHmm}:00`;
          const end = `${s.endDate}T${endHHmm}:00`;
          const title = toLabelFromEnum(
            s.scheduleType,
            s.title || s.scheduleType
          );
          const color = s.color || toColorFromEnum(s.scheduleType, "#4FC3F7");
          return {
            id: String(s.id),
            title,
            start,
            end,
            backgroundColor: color,
            borderColor: color,
            textColor: "#1f2937",
            allDay: s.isAllDay || false,
            extendedProps: {
              originalTitle: s.title,
              type: s.scheduleType, // keep enum for logic
            },
          } as WorkEvent;
        });
        setEvents(mapped);
        setOriginalEvents(mapped);
      } catch (e) {
        // 실패해도 화면은 유지
        console.error("Failed to sync schedules with policy:", e);
      }
    };

    syncSchedulesWithPolicy();
  }, [user?.id, isClient, baseDate]);

  // 현재 주 기준으로 scheduleData 생성
  const generateScheduleData = (): ScheduleData => {
    const today = new Date();
    const currentDay = today.getDay();
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);

    const scheduleData: ScheduleData = {};
    for (let i = 0; i < 7; i++) {
      const dateKey = new Date(monday);
      dateKey.setDate(monday.getDate() + i);
      const key = dateKey.getDate();
      scheduleData[key] = [];
    }

    return scheduleData;
  };

  // scheduleData → FullCalendar events 변환
  useEffect(() => {
    if (!isClient || !currentWeek || Object.keys(weekDates).length === 0)
      return;

    const scheduleData = generateScheduleData();
    const convertedEvents: WorkEvent[] = [];

    Object.entries(scheduleData).forEach(([day, events]) => {
      const dateString = weekDates[parseInt(day)];

      events.forEach((event: ScheduleEvent, index: number) => {
        let startTime: string, endTime: string, allDay: boolean;

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

        const eventObj: WorkEvent = {
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
  const calculateWorkTime = (events: WorkEvent[]): WorkTimeSummary => {
    let totalMinutes = 0;
    const workTypes = ["근무", "외근", "출장", "재택"];

    events.forEach((event) => {
      if (workTypes.includes(event.title) && event.start && event.end) {
        const start = new Date(event.start);
        const end = new Date(event.end);
        const diffMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
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

  const handlePreviousWeek = (): void => {
    const newBaseDate = new Date(baseDate);
    newBaseDate.setDate(baseDate.getDate() - 7);
    setBaseDate(newBaseDate);
  };

  const handleNextWeek = (): void => {
    const newBaseDate = new Date(baseDate);
    newBaseDate.setDate(baseDate.getDate() + 7);
    setBaseDate(newBaseDate);
  };

  const handleEventDrop = (info: any): void => {
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

  const handleEventResize = (info: any): void => {
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

  const handleSelect = (selectInfo: any): void => {
    if (selectInfo.start.getDay() === 0) {
      alert("일요일에는 일정을 추가할 수 없습니다.");
      return;
    }

    // Client-side overlap check
    const selStart = selectInfo.start as Date;
    const selEnd = selectInfo.end as Date;
    const conflicts = events.some((e) => {
      const es = new Date(e.start);
      const ee = new Date(e.end);
      return es < selEnd && selStart < ee; // overlap if existing.start < selEnd && selStart < existing.end
    });
    if (conflicts) {
      alert(
        "선택한 시간이 기존 스케줄과 겹칩니다. 다른 시간대를 선택해 주세요."
      );
      return;
    }

    const calendarApi = selectInfo.view.calendar;
    const tempId = new Date().getTime().toString();
    const newEvent: WorkEvent = {
      id: tempId,
      title: "근무",
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      allDay: selectInfo.allDay,
      backgroundColor: "#3b82f6",
      borderColor: "#3b82f6",
      textColor: "#ffffff",
      status: "pending",
      isNewEvent: true,
      extendedProps: {
        isNewEvent: true,
      },
    };

    // Optimistic add
    calendarApi.addEvent(newEvent);
    setEvents((prev) => [...prev, newEvent]);
    setHasPendingChanges(true);
    calendarApi.unselect();

    // Persist to backend
    (async () => {
      try {
        if (!user?.id) return;
        const startDate = newEvent.start.slice(0, 10);
        const endDate = newEvent.end.slice(0, 10);
        const toHHmmss = (iso: string) => {
          const d = new Date(iso);
          const hh = String(d.getHours()).padStart(2, "0");
          const mm = String(d.getMinutes()).padStart(2, "0");
          return `${hh}:${mm}:00`;
        };

        // 임시 디버그: 전송 userId와 로그인 user.id 일치 여부 확인
        console.debug(
          "[work] create payload userId=",
          Number(user.id),
          "startDate=",
          startDate,
          "endDate=",
          endDate
        );

        const created = await workScheduleApi.createSchedule({
          userId: Number(user.id),
          title: newEvent.title,
          description: undefined,
          startDate,
          endDate,
          startTime: toHHmmss(newEvent.start),
          endTime: toHHmmss(newEvent.end),
          scheduleType: ScheduleType.WORK,
          color: newEvent.backgroundColor,
          isAllDay: !!newEvent.allDay,
          isRecurring: false,
        });

        // Map server response to event and replace temp
        const start = `${created.startDate}${
          created.startTime
            ? "T" +
              String(created.startTime.hour).padStart(2, "0") +
              ":" +
              String(created.startTime.minute).padStart(2, "0") +
              ":00"
            : "T09:00:00"
        }`;
        const end = `${created.endDate}${
          created.endTime
            ? "T" +
              String(created.endTime.hour).padStart(2, "0") +
              ":" +
              String(created.endTime.minute).padStart(2, "0") +
              ":00"
            : "T18:00:00"
        }`;
        const title = toLabelFromEnum(
          created.scheduleType,
          created.title || created.scheduleType
        );
        const color =
          created.color || toColorFromEnum(created.scheduleType, "#4FC3F7");

        const savedEvent: WorkEvent = {
          id: String(created.id),
          title,
          start,
          end,
          backgroundColor: color,
          borderColor: color,
          textColor: "#1f2937",
          allDay: created.isAllDay,
          extendedProps: {
            originalTitle: created.title,
            type: created.scheduleType,
          },
        } as WorkEvent;

        // Replace temp event
        setEvents((prev) =>
          prev.filter((e) => e.id !== tempId).concat(savedEvent)
        );
        // Update calendar instance
        const temp = calendarApi.getEventById(tempId);
        if (temp) temp.remove();
        calendarApi.addEvent(savedEvent as any);
        setHasPendingChanges(false);
      } catch (err: any) {
        console.error(
          "Failed to create schedule:",
          err,
          err?.data,
          err?.response
        );
        // Revert optimistic event
        setEvents((prev) => prev.filter((e) => e.id !== tempId));
        const temp = calendarApi.getEventById(tempId);
        if (temp) temp.remove();
        const msg =
          err?.message || err?.data?.message || "근무 생성에 실패했습니다.";
        alert(msg);
      }
    })();
  };

  const handleEventClick = (clickInfo: any): void => {
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

  const dayCellDidMountHandler = (arg: any): void => {
    if (arg.date.getDay() === 0) {
      arg.el.style.backgroundColor = "#ffe5e5";
    }
  };

  const handleCancelChanges = (): void => {
    setEvents(originalEvents);
    setHasPendingChanges(false);
  };

  const handleSubmitChanges = (): void => {
    const pendingEvents = events.filter((e) => e.status === "pending");
    console.log("변경 신청된 일정들:", pendingEvents);
    setHasPendingChanges(false);
  };

  const handleEventTitleEdit = (eventId: string, newTitle: string): void => {
    const updated = events.map((event) =>
      event.id === eventId
        ? { ...event, title: newTitle, status: "pending" }
        : event
    );
    setEvents(updated);
    setHasPendingChanges(true);
  };

  // 드롭다운에서 유형 선택 시 호출: 색상은 매핑에서 조회
  const handleTitleSelect = (eventId: string, selectedType: string): void => {
    const target = events.find((e) => e.id === eventId);
    if (!target) return;

    const label = toLabelFromEnum(selectedType, selectedType);
    const selectedColor =
      TYPE_COLORS[selectedType as unknown as ScheduleType] || "#4FC3F7";

    // Optimistic update
    const prev = target;
    const optimistic: WorkEvent = {
      ...target,
      title: label,
      backgroundColor: selectedColor,
      borderColor: selectedColor,
      status: "pending",
      isNewEvent: false,
      extendedProps: {
        ...target.extendedProps,
        type: selectedType,
      },
    };
    setEvents((list) => list.map((e) => (e.id === eventId ? optimistic : e)));
    setShowDropdown(false);
    setDropdownEventId(null);

    // Persist to backend if event has a numeric id (saved on server)
    const isPersisted = !isNaN(Number(eventId));
    if (!user?.id || !isPersisted) {
      return;
    }

    const toHHmmss = (iso: string) => {
      const d = new Date(iso);
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      return `${hh}:${mm}:00`;
    };

    (async () => {
      try {
        const startDate = optimistic.start.slice(0, 10);
        const endDate = optimistic.end.slice(0, 10);
        await workScheduleApi.updateSchedule(Number(user.id), Number(eventId), {
          title: label,
          description: undefined,
          startDate,
          endDate,
          startTime: toHHmmss(optimistic.start),
          endTime: toHHmmss(optimistic.end),
          scheduleType: selectedType as unknown as ScheduleType,
          color: selectedColor,
          isAllDay: !!optimistic.allDay,
          isRecurring: false,
        });
      } catch (err) {
        console.error("Failed to update schedule type:", err);
        // Revert
        setEvents((list) => list.map((e) => (e.id === eventId ? prev : e)));
        alert("근무 유형 변경에 실패했습니다.");
      }
    })();
  };

  // 드롭다운 메뉴 컴포넌트 (텍스트만, fixed 포지셔닝, 내부 클릭 보호)
  const TitleDropdown = ({
    eventId,
    position,
    onSelect,
    onClose,
  }: {
    eventId: string;
    position: DropdownPosition;
    onSelect: (eventId: string, selectedType: string) => void;
    onClose: () => void;
  }): JSX.Element => {
    const options = [
      { key: "WORK", label: SCHEDULE_TYPE_LABEL.WORK },
      { key: "OUT_OF_OFFICE", label: SCHEDULE_TYPE_LABEL.OUT_OF_OFFICE },
      { key: "BUSINESS_TRIP", label: SCHEDULE_TYPE_LABEL.BUSINESS_TRIP },
      { key: "VACATION", label: SCHEDULE_TYPE_LABEL.VACATION },
      { key: "SICK_LEAVE", label: SCHEDULE_TYPE_LABEL.SICK_LEAVE },
      { key: "OVERTIME", label: SCHEDULE_TYPE_LABEL.OVERTIME },
      { key: "RESTTIME", label: SCHEDULE_TYPE_LABEL.RESTTIME },
    ];
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleDocMouseDown = (e: MouseEvent) => {
        if (ref.current && !ref.current.contains(e.target as Node)) {
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
        {options.map((opt) => (
          <button
            key={opt.key}
            onClick={() => onSelect(eventId, opt.key)}
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
            {opt.label}
          </button>
        ))}
      </div>
    );
  };

  // SimpleEvent: 제목 클릭 → 드롭다운을 제목 바로 아래에 표시
  const SimpleEvent = ({ event }: { event: WorkEvent }): JSX.Element => {
    const handleTitleClick = (e: React.MouseEvent): void => {
      e.stopPropagation();
      const rect = e.currentTarget.getBoundingClientRect();
      setDropdownPosition({ x: rect.left, y: rect.bottom + 5 }); // 텍스트 바로 아래
      setDropdownEventId(event.id);
      setShowDropdown(true);
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

  const eventContent = (arg: any): JSX.Element => (
    <SimpleEvent event={arg.event} />
  );

  // 게이지 컴포넌트
  const WorkTimeGauge = ({
    percentage,
    totalHours,
    averageHours,
  }: {
    percentage: number;
    totalHours: number;
    averageHours: number;
  }): JSX.Element => {
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const getGaugeColor = (p: number): string => {
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
          eventId={dropdownEventId!}
          position={dropdownPosition}
          onSelect={handleTitleSelect}
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
