// Backend ScheduleType(enum) → 한글 라벨 매핑
export const SCHEDULE_TYPE_LABEL: Record<string, string> = {
  WORK: "근무",
  SICK_LEAVE: "병가",
  VACATION: "휴가",
  BUSINESS_TRIP: "출장",
  OUT_OF_OFFICE: "외근",
  OVERTIME: "초과근무",
  RESTTIME: "휴게시간",
  REMOTE: "재택", // CoworkerComponent에서 사용
};

// Backend ScheduleType(enum) → 색상 매핑 (모두 구분 가능한 색상)
export const SCHEDULE_TYPE_COLOR: Record<string, string> = {
  WORK: "#3B82F6", // 파란색 (기본 근무)
  SICK_LEAVE: "#EF4444", // 빨간색 (병가)
  VACATION: "#F59E0B", // 주황색 (휴가)
  BUSINESS_TRIP: "#8B5CF6", // 보라색 (출장)
  OUT_OF_OFFICE: "#10B981", // 초록색 (외근)
  OVERTIME: "#EC4899", // 핑크색 (초과근무)
  RESTTIME: "#06B6D4", // 청록색 (휴게시간)
  REMOTE: "#84CC16", // 라임색 (재택)
};

// ScheduleType → 한글 라벨 변환 함수
export const toLabelFromEnum = (
  scheduleType?: string,
  fallback?: string
): string => {
  if (!scheduleType) return fallback || "";
  return SCHEDULE_TYPE_LABEL[scheduleType] || fallback || scheduleType;
};

// ScheduleType → 색상 변환 함수
export const toColorFromEnum = (
  scheduleType?: string,
  fallback?: string
): string => {
  if (!scheduleType) return fallback || "#4FC3F7";
  return SCHEDULE_TYPE_COLOR[scheduleType] || fallback || "#4FC3F7";
};

// 시간 변환 함수 (LocalTime 객체 또는 문자열 → HH:mm:ss)
export const toTimeString = (
  t?: string | { hour: number; minute: number; second: number }
): string => {
  if (!t) return "00:00:00";
  if (typeof t === "string") return t; // "09:00:00" 형태
  const hh = String(t.hour).padStart(2, "0");
  const mm = String(t.minute).padStart(2, "0");
  const ss = String(t.second).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
};
