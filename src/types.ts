// Data model mirrored in data/schedule.json.

export interface Category {
  id: string
  label: string
  color: string
}

export interface ScheduleEvent {
  id: string
  title: string
  /** ISO 8601 local time, no trailing Z (Asia/Seoul wall-clock). Null for weekly-recurring events. */
  start: string | null
  /** ISO 8601 local time. For allDay events, end is exclusive (FullCalendar). */
  end: string | null
  allDay: boolean
  categoryId: string
  /** Denormalized color (derived from category) for rendering. */
  color: string
  location: string
  notes: string
  /** Weekly recurrence: FullCalendar day indices (0=Sun … 6=Sat). Empty/null = one-time event. */
  daysOfWeek?: number[] | null
  /** "HH:mm" start of day for recurring events. */
  startTime?: string | null
  /** "HH:mm" end of day for recurring events. */
  endTime?: string | null
  /** Reserved for full RFC 5545 RRULE. Unused in v1. */
  rrule: string | null
}

export interface ScheduleFile {
  version: number
  updatedAt: string
  categories: Category[]
  events: ScheduleEvent[]
}
