import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import type {
  DateSelectArg,
  EventClickArg,
  EventChangeArg,
  EventInput,
} from '@fullcalendar/core'
import { formatLocal } from '../lib/datetime'

interface Props {
  events: EventInput[]
  onSelectSlot: (start: string, end: string | null, allDay: boolean) => void
  onEventClick: (id: string) => void
  onEventTimeChange: (
    id: string,
    start: string,
    end: string | null,
    allDay: boolean,
  ) => void
}

export function AdminCalendar({
  events,
  onSelectSlot,
  onEventClick,
  onEventTimeChange,
}: Props) {
  const handleSelect = (arg: DateSelectArg) => {
    onSelectSlot(
      formatLocal(arg.start, arg.allDay),
      arg.end ? formatLocal(arg.end, arg.allDay) : null,
      arg.allDay,
    )
  }

  const handleChange = (arg: EventChangeArg) => {
    const e = arg.event
    if (!e.id || !e.start) return
    onEventTimeChange(
      e.id,
      formatLocal(e.start, e.allDay),
      e.end ? formatLocal(e.end, e.allDay) : null,
      e.allDay,
    )
  }

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      locale="ko"
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay',
      }}
      buttonText={{ today: '오늘', month: '월', week: '주', day: '일' }}
      events={events}
      selectable
      selectMirror
      editable
      eventClick={(arg: EventClickArg) => arg.event.id && onEventClick(arg.event.id)}
      select={handleSelect}
      eventChange={handleChange}
      height="auto"
      slotMinTime="06:00:00"
      slotMaxTime="22:00:00"
      nowIndicator
      firstDay={0}
    />
  )
}
