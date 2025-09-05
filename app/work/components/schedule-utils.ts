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

// Backend ScheduleType(enum) → 색상 매핑
export const SCHEDULE_TYPE_COLOR: Record<string, string> = {
  WORK: "#4FC3F7",
  SICK_LEAVE: "#F48FB1",
  VACATION: "#F48FB1",
  BUSINESS_TRIP: "#FFB74D",
  OUT_OF_OFFICE: "#AED581",
  OVERTIME: "#B39DDB",
  RESTTIME: "#B2DFDB", // CoworkerComponent와 일치하도록 수정
  REMOTE: "#B39DDB",
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
