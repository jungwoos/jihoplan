import type { EventInput } from '@fullcalendar/core'
import type { Category, ScheduleEvent, ScheduleFile } from '../types'
// Bundled copy used as a fallback when the runtime fetch fails.
import bundled from '../../data/schedule.json'

export const fallbackSchedule = bundled as ScheduleFile

/** Defensive validation + normalization of an unknown JSON payload. */
export function parseSchedule(data: unknown): ScheduleFile {
  if (!data || typeof data !== 'object') throw new Error('Invalid schedule data')
  const obj = data as Partial<ScheduleFile>
  const categories: Category[] = Array.isArray(obj.categories) ? obj.categories : []
  const events: ScheduleEvent[] = Array.isArray(obj.events)
    ? obj.events.filter((e): e is ScheduleEvent => !!e && typeof e.id === 'string')
    : []
  return {
    version: typeof obj.version === 'number' ? obj.version : 1,
    updatedAt: typeof obj.updatedAt === 'string' ? obj.updatedAt : '',
    categories,
    events,
  }
}

/** Map a category id to its color, with a neutral fallback. */
export function colorFor(categoryId: string, categories: Category[]): string {
  return categories.find((c) => c.id === categoryId)?.color ?? '#777777'
}

/** Convert stored events to FullCalendar event inputs. */
export function toEventInputs(file: ScheduleFile): EventInput[] {
  return file.events.map((e) => {
    const color = e.color || colorFor(e.categoryId, file.categories)
    const base = {
      id: e.id,
      title: e.title,
      backgroundColor: color,
      borderColor: color,
      extendedProps: {
        categoryId: e.categoryId,
        location: e.location,
        notes: e.notes,
      },
    }
    // Weekly-recurring event (FullCalendar native daysOfWeek recurrence).
    if (e.daysOfWeek && e.daysOfWeek.length) {
      return {
        ...base,
        daysOfWeek: e.daysOfWeek,
        startTime: e.startTime ?? undefined,
        endTime: e.endTime ?? undefined,
      }
    }
    // One-time event.
    return {
      ...base,
      start: e.start ?? undefined,
      end: e.end ?? undefined,
      allDay: e.allDay,
    }
  })
}
