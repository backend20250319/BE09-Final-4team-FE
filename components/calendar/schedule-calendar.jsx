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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">캘린더 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <FullCalendar
      plugins={[timeGridPlugin, interactionPlugin]}
      initialView="timeGridWeek"
      headerToolbar={false}
      height="auto"
      events={events}
      editable={editable}
      eventStartEditable={editable}
      eventDurationEditable={editable}
      droppable={editable}
      eventDrop={onEventDrop}
      eventResize={onEventResize}
      select={onSelect}
      eventClick={onEventClick}
      dayCellDidMount={dayCellDidMount}
      eventContent={eventContent}
      slotMinTime="08:00:00"
      slotMaxTime="20:00:00"
      allDaySlot={true}
      slotDuration="00:30:00"
      slotLabelInterval="01:00"
      dayHeaderFormat={{ weekday: "short", day: "numeric" }}
      firstDay={1} // Monday
      weekends={true}
      nowIndicator={true}
      selectable={true}
      selectMirror={true}
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
      eventDidMount={(info) => {
        // Add custom styling
        info.el.style.borderRadius = "8px";
        info.el.style.fontWeight = "600";
        info.el.style.fontSize = "12px";
        info.el.style.padding = "4px 8px";
      }}
    />
  );
}
