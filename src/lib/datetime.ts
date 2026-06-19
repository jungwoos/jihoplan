// Format a Date as a local ISO string without timezone ("YYYY-MM-DDTHH:mm:ss"),
// matching the storage convention (Asia/Seoul wall-clock, no trailing Z).
export function formatLocal(date: Date, allDay = false): string {
  const p = (n: number) => String(n).padStart(2, '0')
  const ymd = `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}`
  if (allDay) return ymd
  return `${ymd}T${p(date.getHours())}:${p(date.getMinutes())}:${p(date.getSeconds())}`
}
