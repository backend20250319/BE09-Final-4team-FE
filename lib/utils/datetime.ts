export const KST_TZ = "Asia/Seoul";

export function formatKstTime(
  instantIso?: string | Date,
  fallback: string = ""
): string {
  if (!instantIso) return fallback;
  const d = instantIso instanceof Date ? instantIso : new Date(instantIso);
  if (Number.isNaN(d.getTime())) return fallback;
  return d.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: undefined,
    hour12: false,
    timeZone: KST_TZ,
  });
}

export function formatKstDate(
  instantIso?: string | Date,
  fallback: string = ""
): string {
  if (!instantIso) return fallback;
  const d = instantIso instanceof Date ? instantIso : new Date(instantIso);
  if (Number.isNaN(d.getTime())) return fallback;
  return d.toLocaleDateString("ko-KR", { timeZone: KST_TZ });
}

export function formatKstDateTime(
  instantIso?: string | Date,
  fallback: string = ""
): string {
  if (!instantIso) return fallback;
  const d = instantIso instanceof Date ? instantIso : new Date(instantIso);
  if (Number.isNaN(d.getTime())) return fallback;
  const date = d.toLocaleDateString("ko-KR", { timeZone: KST_TZ });
  const time = d.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: KST_TZ,
  });
  return `${date} ${time}`;
}
