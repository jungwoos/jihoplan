// Data model mirrored in data/schedule.json.

export interface Category {
  id: string
  label: string
  color: string
}

export interface ScheduleEvent {
  id: string
  title: string
  /** ISO 8601 local time, no trailing Z (Asia/Seoul wall-clock). */
  start: string
  /** ISO 8601 local time. For allDay events, end is exclusive (FullCalendar). */
  end: string | null
  allDay: boolean
  categoryId: string
  /** Denormalized color (derived from category) for rendering. */
  color: string
  location: string
  notes: string
  /** Reserved for recurrence (RFC 5545 RRULE). Unused in v1. */
  rrule: string | null
}

export interface ScheduleFile {
  version: number
  updatedAt: string
  categories: Category[]
  events: ScheduleEvent[]
}
