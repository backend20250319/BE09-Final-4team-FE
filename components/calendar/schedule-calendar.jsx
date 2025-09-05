// components/calendar/schedule-calendar.jsx
"use client";

import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function ScheduleCalendar({
  events,
  onEventDrop,
  onEventResize,
  onSelect,
  onEventClick,
  dayCellDidMount,
  eventContent,
  editable = true,
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  if (!isMounted) {
    return (
      <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">캘린더 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="schedule-calendar">
      <style jsx global>{`
        /* 일요일 강조 예시 */
        .fc-day-sun .fc-col-header-cell-cushion {
          color: red !important;
        }
        .fc-day-sun .fc-timegrid-col-frame {
          background-color: rgba(255, 0, 0, 0.05) !important;
        }
        .fc-day-sun .fc-timegrid-slot {
          background-color: rgba(255, 0, 0, 0.03) !important;
        }

        /* 종일 휴식 밴드 예시 */
        .fc-event.allday-rest {
          position: absolute !important;
          left: 0 !important;
          right: 0 !important;
          width: 100% !important;
          z-index: 10 !important;
          background: rgba(255, 99, 132, 0.8) !important;
          border: 2px solid rgba(255, 99, 132, 1) !important;
        }
      `}</style>

      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={false}
        height="auto"
        /* 데이터 및 상호작용 핸들러 */
        events={events}
        editable={editable}
        eventStartEditable={editable}
        eventDurationEditable={editable}
        eventResizableFromStart={true}
        droppable={editable}
        eventDrop={onEventDrop}
        eventResize={onEventResize}
        select={onSelect}
        eventClick={onEventClick}
        dayCellDidMount={dayCellDidMount}
        eventContent={eventContent}
        /* 타임그리드 설정 */
        slotMinTime="08:00:00"
        slotMaxTime="24:00:00"
        allDaySlot={false}
        slotDuration="00:30:00"
        slotLabelInterval="01:00"
        dayHeaderFormat={{ weekday: "short", day: "numeric" }}
        firstDay={0}
        weekends={true}
        nowIndicator={true}
        selectable={editable}
        selectMirror={editable}
        selectConstraint={{
          daysOfWeek: [1, 2, 3, 4, 5, 6], // 월~토만 선택 가능 (일요일 제외)
        }}
        eventConstraint={{
          daysOfWeek: [1, 2, 3, 4, 5, 6], // 월~토만 이벤트 이동 가능 (일요일 제외)
        }}
        dayMaxEvents={true}
        moreLinkClick="popover"
        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit",
          meridiem: false,
          hour12: false,
        }}
        eventDisplay="block"
        eventClassNames="cursor-pointer"
        /* 겹침 제어: '휴게' 또는 type==='break' 만 겹치기 허용 */
        eventOverlap={(stillEvent, movingEvent) => {
          const aTitle = stillEvent.title;
          const bTitle = movingEvent.title;
          const aType = stillEvent.extendedProps?.type;
          const bType = movingEvent.extendedProps?.type;
          return (
            aTitle === "휴게" ||
            bTitle === "휴게" ||
            aTitle === "휴게시간" ||
            bTitle === "휴게시간" ||
            aType === "break" ||
            bType === "break" ||
            aType === "RESTTIME" ||
            bType === "RESTTIME"
          );
        }}
        slotEventOverlap={true}
        /* 마운트 시 공통 스타일 */
        eventDidMount={(info) => {
          info.el.style.borderRadius = "12px";
          info.el.style.fontWeight = "700";
          info.el.style.fontSize = "12px";
          info.el.style.padding = "6px 10px";

          if (info.event.extendedProps?.isAllDayRest) {
            info.el.classList.add("allday-rest");
            info.el.style.height = "100%";
            info.el.style.top = "0";
            info.el.style.bottom = "0";
          }

          const isBreak =
            info.event.title === "휴게" ||
            info.event.title === "휴게시간" ||
            info.event.extendedProps?.type === "break" ||
            info.event.extendedProps?.type === "RESTTIME";

          if (isBreak) {
            info.el.style.boxShadow = "0 6px 16px rgba(0,0,0,.18)";
            // 위치 계산 이후 보정: 다음 프레임에서 DOM 조정
            requestAnimationFrame(() => {
              const harness = info.el.closest(".fc-timegrid-event-harness");
              if (harness) {
                harness.style.removeProperty("left");
                harness.style.removeProperty("right");
                harness.style.removeProperty("width");
                harness.style.removeProperty("transform");
                harness.style.removeProperty("margin-left");

                harness.style.setProperty("left", "0", "important");
                harness.style.setProperty("right", "0", "important");
                harness.style.setProperty("width", "100%", "important");
                harness.style.setProperty("transform", "none", "important");
                harness.style.setProperty("z-index", "60", "important");

                const inset = harness.querySelector(
                  ".fc-timegrid-event-harness-inset"
                );
                if (inset) {
                  inset.style.removeProperty("left");
                  inset.style.removeProperty("right");
                  inset.style.removeProperty("width");
                  inset.style.removeProperty("transform");
                  inset.style.removeProperty("margin-left");

                  inset.style.setProperty("left", "0", "important");
                  inset.style.setProperty("right", "0", "important");
                  inset.style.setProperty("width", "100%", "important");
                  inset.style.setProperty("transform", "none", "important");
                }
              }

              info.el.style.setProperty("left", "0", "important");
              info.el.style.setProperty("right", "0", "important");
              info.el.style.setProperty("width", "100%", "important");
            });
          }
        }}
        /* 위치 계산이 끝난 직후 최종 보정: 부모 래퍼의 left/width/transform 제거 및 고정 */
        eventPositioned={(info) => {
          const isBreak =
            info.event.title === "휴게" ||
            info.event.title === "휴게시간" ||
            info.event.extendedProps?.type === "break" ||
            info.event.extendedProps?.type === "RESTTIME";
          if (!isBreak) return;

          const harness = info.el.closest(".fc-timegrid-event-harness");
          if (harness) {
            harness.style.removeProperty("left");
            harness.style.removeProperty("right");
            harness.style.removeProperty("width");
            harness.style.removeProperty("transform");
            harness.style.removeProperty("margin-left");

            harness.style.setProperty("left", "0", "important");
            harness.style.setProperty("right", "0", "important");
            harness.style.setProperty("width", "100%", "important");
            harness.style.setProperty("transform", "none", "important");
            harness.style.setProperty("z-index", "60", "important");

            const inset = harness.querySelector(
              ".fc-timegrid-event-harness-inset"
            );
            if (inset) {
              inset.style.removeProperty("left");
              inset.style.removeProperty("right");
              inset.style.removeProperty("width");
              inset.style.removeProperty("transform");
              inset.style.removeProperty("margin-left");

              inset.style.setProperty("left", "0", "important");
              inset.style.setProperty("right", "0", "important");
              inset.style.setProperty("width", "100%", "important");
              inset.style.setProperty("transform", "none", "important");
            }
          }

          info.el.style.setProperty("left", "0", "important");
          info.el.style.setProperty("right", "0", "important");
          info.el.style.setProperty("width", "100%", "important");
        }}
      />
    </div>
  );
}
