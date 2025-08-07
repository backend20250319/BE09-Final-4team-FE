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

        {/* 제목 (인라인 수정 가능) */}
        <div>
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
                    width: "100%",
                    lineHeight: "1",
                  }}
              >
                {event.title}
              </div>
          )}
        </div>
      </div>
  );
};

export default function CoworkerSchedulePage() {
  const [currentWeek, setCurrentWeek] = useState("");
  const [activeTab, setActiveTab] = useState("team");
  const [selectedEmployee, setSelectedEmployee] = useState("ceo");
  const [events, setEvents] = useState([]);
  const [weekDates, setWeekDates] = useState({});
  const [isClient, setIsClient] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [baseDate, setBaseDate] = useState(new Date());
  const router = useRouter();

  // baseDate를 기준으로 월요일 날짜를 구하고, offset일 만큼 더한 날짜의 day 값을 반환하는 함수
  const getDateKey = (offset) => {
    const currentDay = baseDate.getDay(); // 0: 일요일, 1: 월요일, ..., 6: 토요일

    // 해당 주의 월요일 계산 (월요일이 1이므로)
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(baseDate);
    monday.setDate(baseDate.getDate() + mondayOffset);

    // offset일 만큼 더한 날짜 계산
    const targetDate = new Date(monday);
    targetDate.setDate(monday.getDate() + offset);

    return targetDate.getDate();
  };

  // 일요일인지 확인하는 함수
  const isSunday = (offset) => {
    const currentDay = baseDate.getDay();
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(baseDate);
    monday.setDate(baseDate.getDate() + mondayOffset);

    const targetDate = new Date(monday);
    targetDate.setDate(monday.getDate() + offset);

    return targetDate.getDay() === 0;
  };

  const employees = [
    {
      id: "ceo",
      name: "비니비니",
      position: "CEO",
      email: "binibini@binslab.com",
      phone: "010-1234-5678",
      team: "CEO",
      avatar: "🎯",
      color: colors.employee.ceo,
      scheduleData: {
        [getDateKey(0)]: isSunday(0)
            ? []
            : [
              // 월요일
              {
                startTime: "09:00",
                endTime: "11:00",
                title: "외근",
                color: colors.schedule.meeting,
              },
              {
                startTime: "14:00",
                endTime: "16:00",
                title: "근무",
                color: colors.schedule.customer,
              },
            ],
        [getDateKey(1)]: isSunday(1)
            ? []
            : [
              // 화요일
              {
                startTime: "10:00",
                endTime: "18:00",
                title: "출장",
                color: colors.schedule.project,
              },
            ],
        [getDateKey(2)]: isSunday(2)
            ? []
            : [
              // 수요일
              {
                startTime: "13:00",
                endTime: "15:00",
                title: "근무",
                color: colors.schedule.meeting,
              },
              {
                startTime: "16:30",
                endTime: "18:00",
                title: "출장",
                color: colors.schedule.report,
              },
            ],
      },
    },
    {
      id: "gguni",
      name: "꾸니",
      position: "주니어 개발자",
      email: "gguni@binslab.com",
      phone: "010-1234-5678",
      team: "Application Team",
      avatar: "👨‍💻",
      color: colors.employee.developer,
      scheduleData: {
        [getDateKey(0)]: isSunday(0)
            ? []
            : [
              // 월요일
              {
                startTime: "09:00",
                endTime: "12:00",
                title: "근무",
                color: colors.schedule.project,
              },
              {
                startTime: "13:00",
                endTime: "17:00",
                title: "근무",
                color: colors.schedule.education,
              },
            ],
        [getDateKey(1)]: isSunday(1)
            ? []
            : [
              // 화요일
              {
                startTime: "14:00",
                endTime: "16:00",
                title: "출장",
                color: colors.schedule.project,
              },
            ],
        [getDateKey(2)]: isSunday(2)
            ? []
            : [
              // 수요일
              {
                startTime: "10:00",
                endTime: "12:00",
                title: "근무",
                color: colors.schedule.project,
              },
              {
                startTime: "13:00",
                endTime: "18:00",
                title: "반차",
                color: colors.schedule.education,
              },
            ],
      },
    },
    {
      id: "minus",
      name: "민수",
      position: "시니어 개발자",
      email: "minus@binslab.com",
      phone: "010-5678-9012",
      team: "Backend Team",
      avatar: "🚀",
      color: colors.employee.senior,
      scheduleData: {
        [getDateKey(0)]: isSunday(0)
            ? []
            : [
              // 월요일
              {
                startTime: "09:00",
                endTime: "18:00",
                title: "근무",
                color: colors.schedule.project,
              },
            ],
        [getDateKey(1)]: isSunday(1)
            ? []
            : [
              // 화요일
              {
                startTime: "09:00",
                endTime: "18:00",
                title: "출장",
                color: colors.schedule.report,
              },
            ],
        [getDateKey(2)]: isSunday(2)
            ? []
            : [
              // 수요일
              {
                startTime: "09:00",
                endTime: "13:00",
                title: "근무",
                color: colors.schedule.project,
              },
              {
                startTime: "14:00",
                endTime: "18:00",
                title: "출장",
                color: colors.schedule.report,
              },
            ],
      },
    },
  ];

  // 검색 조건에 맞는 직원들만 필터링
  const filteredEmployees = employees.filter((emp) => {
    const query = searchQuery.toLowerCase();
    const nameMatch = emp.name.toLowerCase().includes(query);
    const teamMatch = emp.team.toLowerCase().includes(query);
    const positionMatch = emp.position.toLowerCase().includes(query);
    return nameMatch || teamMatch || positionMatch; // OR 조건으로 변경
  });

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

  // 선택된 직원의 scheduleData를 events로 변환
  const convertScheduleDataToEvents = (scheduleData) => {
    if (!scheduleData || Object.keys(weekDates).length === 0) return [];

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

    return convertedEvents;
  };

  // 선택된 직원의 일정을 events로 설정
  useEffect(() => {
    if (!isClient || !currentWeek || Object.keys(weekDates).length === 0)
      return;

    const selectedEmployeeData = employees.find(
        (emp) => emp.id === selectedEmployee
    );
    if (selectedEmployeeData && selectedEmployeeData.scheduleData) {
      const convertedEvents = convertScheduleDataToEvents(
          selectedEmployeeData.scheduleData
      );
      setEvents(convertedEvents);
    } else {
      setEvents([]);
    }
  }, [isClient, currentWeek, weekDates, selectedEmployee, baseDate]);

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

  const dayCellDidMountHandler = (arg) => {
    if (arg.date.getDay() === 0) {
      arg.el.style.backgroundColor = "#ffe5e5";
    }
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

        <div className="grid grid-cols-12 gap-8">
          {/* Employee List */}
          <div className="col-span-4 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                  placeholder="직원명, 조직, 직책 검색하기"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/60 backdrop-blur-sm border-gray-200/50 rounded-xl"
              />
            </div>

            {/* Employee Cards */}
            <div className="space-y-4">
              {filteredEmployees.map((employee) => (
                  <GlassCard
                      key={employee.id}
                      className={`p-4 cursor-pointer transition-all duration-200 ${
                          selectedEmployee === employee.id
                              ? "ring-2 ring-blue-500 bg-blue-50/50"
                              : "hover:bg-gray-50/50"
                      }`}
                      onClick={() => setSelectedEmployee(employee.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div
                          className={`w-12 h-12 bg-gradient-to-r ${employee.color} rounded-xl flex items-center justify-center text-white text-lg shadow-lg`}
                      >
                        {employee.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-800">
                        {employee.name}
                      </span>
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                        {employee.position}
                      </span>
                        </div>
                        <div className="text-xs text-gray-600 space-y-1">
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {employee.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {employee.phone}
                          </div>
                          <div className="text-blue-600 font-medium">
                            {employee.team}
                          </div>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
              ))}
            </div>
          </div>

          {/* Schedule Calendar */}
          <div className="col-span-8">
            {/* Date Navigation */}
            <DateNavigation
                currentPeriod={currentWeek}
                onPrevious={handlePreviousWeek}
                onNext={handleNextWeek}
                className="mb-6"
            />

            {/* FullCalendar Schedule */}
            <GlassCard className="p-6">
              <div className="calendar-container">
                {isClient && (
                    <ScheduleCalendar
                        events={events}
                        editable={false}
                        dayCellDidMount={dayCellDidMountHandler}
                    />
                )}
              </div>
            </GlassCard>
          </div>
        </div>
      </MainLayout>
  );
}
