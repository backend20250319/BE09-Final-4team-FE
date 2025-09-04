"use client";

import { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Bell,
  User,
  Calendar,
  Users,
  Settings,
  FileText,
  Megaphone,
  ClipboardList,
  Briefcase,
  Home,
  Search,
  Mail,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MainLayout } from "@/components/layout/main-layout";
import { DateNavigation } from "@/components/ui/date-navigation";
import { GlassCard } from "@/components/ui/glass-card";
import { colors } from "@/lib/design-tokens";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Type definitions
interface CoworkerEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  allDay: boolean;
  extendedProps: {
    employeeId?: string;
    employeeName?: string;
    type?: string;
  };
}

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone?: string;
  avatar?: string;
  status: "online" | "offline" | "away";
  workType?: string;
}

interface WeekDates {
  [key: number]: string;
}

interface ScheduleEvent {
  startTime?: string;
  endTime?: string;
  title: string;
  color: string;
  type: string;
  employeeId?: string;
}

interface ScheduleData {
  [key: number]: ScheduleEvent[];
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

// EditableEvent 컴포넌트
const EditableEvent = ({
  event,
  onTitleChange,
}: {
  event: CoworkerEvent;
  onTitleChange: (eventId: string, newTitle: string) => void;
}): JSX.Element => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<string>(event.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDoubleClick = (): void => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  };

  const handleSave = (): void => {
    if (editValue.trim()) {
      onTitleChange(event.id, editValue.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setEditValue(event.title);
      setIsEditing(false);
    }
  };

  const handleBlur = (): void => {
    handleSave();
  };

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        padding: "4px",
      }}
    >
      {/* 시간 표시 */}
      <div
        style={{
          fontSize: "10px",
          color: "rgba(255, 255, 255, 0.8)",
          marginBottom: "1px", // 간격을 최소화
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

      {/* 제목 (편집 가능) */}
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          style={{
            fontSize: "inherit",
            fontWeight: "inherit",
            color: "white",
            background: "transparent",
            border: "none",
            outline: "none",
            width: "100%",
            lineHeight: "1.1",
          }}
        />
      ) : (
        <div
          onDoubleClick={handleDoubleClick}
          style={{
            fontSize: "inherit",
            fontWeight: "inherit",
            color: "white",
            width: "100%",
            lineHeight: "1.1",
            cursor: "pointer",
          }}
          title="더블클릭하여 편집"
        >
          {event.title}
        </div>
      )}
    </div>
  );
};

// 유형 ↔ 색상 매핑
const TYPE_COLORS: { [key: string]: string } = {
  근무: "#4FC3F7",
  재택: "#B39DDB",
  외근: "#AED581",
  출장: "#FFB74D",
  휴가: "#F48FB1",
  휴게: "#B2DFDB",
};

export default function CoworkerComponent(): JSX.Element {
  const [currentWeek, setCurrentWeek] = useState<string>("");
  const [events, setEvents] = useState<CoworkerEvent[]>([]);
  const [weekDates, setWeekDates] = useState<WeekDates>({});
  const [isClient, setIsClient] = useState<boolean>(false);
  const [baseDate, setBaseDate] = useState<Date>(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);

  const router = useRouter();

  // 샘플 직원 데이터
  const sampleEmployees: Employee[] = [
    {
      id: "1",
      name: "김철수",
      position: "개발자",
      department: "개발팀",
      email: "kim@company.com",
      phone: "010-1234-5678",
      status: "online",
      workType: "근무",
    },
    {
      id: "2",
      name: "이영희",
      position: "디자이너",
      department: "디자인팀",
      email: "lee@company.com",
      phone: "010-2345-6789",
      status: "away",
      workType: "재택",
    },
    {
      id: "3",
      name: "박민수",
      position: "기획자",
      department: "기획팀",
      email: "park@company.com",
      phone: "010-3456-7890",
      status: "offline",
      workType: "외근",
    },
    {
      id: "4",
      name: "최지영",
      position: "마케터",
      department: "마케팅팀",
      email: "choi@company.com",
      phone: "010-4567-8901",
      status: "online",
      workType: "출장",
    },
  ];

  // 클라이언트 사이드에서만 실행
  useEffect(() => {
    setIsClient(true);
    setEmployees(sampleEmployees);
    setFilteredEmployees(sampleEmployees);
  }, []);

  // 검색 필터링
  useEffect(() => {
    const filtered = employees.filter(
      (employee) =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(filtered);
  }, [searchTerm, employees]);

  // baseDate를 기준으로 주차 계산
  useEffect(() => {
    if (!isClient) return;

    const currentDay = baseDate.getDay();
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

  // 현재 주 기준으로 scheduleData 생성
  const generateScheduleData = (): ScheduleData => {
    const today = new Date();
    const currentDay = today.getDay();
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);

    const scheduleData: ScheduleData = {};

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
            employeeId: "1",
          },
          {
            startTime: "12:00",
            endTime: "13:00",
            title: "휴게",
            color: TYPE_COLORS.휴게,
            type: "break",
            employeeId: "1",
          },
          {
            startTime: "13:00",
            endTime: "18:00",
            title: randomType,
            color: TYPE_COLORS[randomType],
            type: "work",
            employeeId: "1",
          },
        ];
      } else {
        scheduleData[dayKey] = [
          {
            title: "휴가",
            color: TYPE_COLORS.휴가,
            type: "vacation",
            employeeId: "1",
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
    const convertedEvents: CoworkerEvent[] = [];

    Object.entries(scheduleData).forEach(([day, events]) => {
      const dateString = weekDates[parseInt(day)];

      events.forEach((event: ScheduleEvent, index: number) => {
        let startTime: string, endTime: string, allDay: boolean;

        if (event.startTime && event.endTime) {
          startTime = `${dateString}T${event.startTime}:00`;
          endTime = `${dateString}T${event.endTime}:00`;
          allDay = false;
        } else {
          startTime = `${dateString}T09:00:00`;
          endTime = `${dateString}T18:00:00`;
          allDay = true;
        }

        const eventObj: CoworkerEvent = {
          id: `${day}-${index}`,
          title: event.title,
          start: startTime,
          end: endTime,
          backgroundColor: event.color,
          borderColor: event.color,
          textColor: "#ffffff",
          allDay: allDay,
          extendedProps: {
            employeeId: event.employeeId,
            employeeName: "김철수",
            type: event.type,
          },
        };
        convertedEvents.push(eventObj);
      });
    });

    setEvents(convertedEvents);
  }, [isClient, currentWeek, weekDates]);

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

  const handleEmployeeSelect = (employeeId: string): void => {
    setSelectedEmployee(employeeId);
  };

  const handleEventTitleChange = (eventId: string, newTitle: string): void => {
    const updated = events.map((event) =>
      event.id === eventId ? { ...event, title: newTitle } : event
    );
    setEvents(updated);
  };

  const eventContent = (arg: any): JSX.Element => (
    <EditableEvent event={arg.event} onTitleChange={handleEventTitleChange} />
  );

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "online":
        return "#10b981";
      case "away":
        return "#f59e0b";
      case "offline":
        return "#6b7280";
      default:
        return "#6b7280";
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case "online":
        return "온라인";
      case "away":
        return "자리비움";
      case "offline":
        return "오프라인";
      default:
        return "알 수 없음";
    }
  };

  return (
    <div className="-mt-16">
      {/* Header with Search and Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800">동료 근무표</h1>
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <Input
              placeholder="직원 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={selectedEmployee === "all" ? "default" : "outline"}
            onClick={() => handleEmployeeSelect("all")}
          >
            전체
          </Button>
          {filteredEmployees.slice(0, 3).map((employee) => (
            <Button
              key={employee.id}
              variant={selectedEmployee === employee.id ? "default" : "outline"}
              onClick={() => handleEmployeeSelect(employee.id)}
            >
              {employee.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Employee List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {filteredEmployees.map((employee) => (
          <GlassCard
            key={employee.id}
            className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedEmployee === employee.id ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() => handleEmployeeSelect(employee.id)}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <div
                  className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white"
                  style={{ backgroundColor: getStatusColor(employee.status) }}
                ></div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{employee.name}</h3>
                <p className="text-sm text-gray-600">{employee.position}</p>
                <p className="text-xs text-gray-500">{employee.department}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {getStatusText(employee.status)}
              </span>
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                {employee.workType}
              </span>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Date Navigation */}
      <div className="flex justify-center mb-6">
        <DateNavigation
          currentPeriod={currentWeek}
          onPrevious={handlePreviousWeek}
          onNext={handleNextWeek}
        />
      </div>

      {/* Calendar */}
      <GlassCard className="p-6">
        <div className="calendar-container">
          {isClient && (
            <ScheduleCalendar
              events={events}
              onEventDrop={() => {}}
              onEventResize={() => {}}
              onSelect={() => {}}
              onEventClick={() => {}}
              dayCellDidMount={() => {}}
              eventContent={eventContent}
              editable={false}
            />
          )}
        </div>
      </GlassCard>
    </div>
  );
}
