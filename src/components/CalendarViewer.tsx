import { forwardRef } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import type { EventClickArg, EventInput } from '@fullcalendar/core'
import type { CalendarView } from './ViewToggle'

interface Props {
  events: EventInput[]
  initialView: CalendarView
  onEventClick: (arg: EventClickArg) => void
}

/**
 * Read-only calendar. View switching is driven externally via the ref
 * (calendarRef.current.getApi().changeView(...)).
 */
export const CalendarViewer = forwardRef<FullCalendar, Props>(
  ({ events, initialView, onEventClick }, ref) => {
    return (
      <FullCalendar
        ref={ref}
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView={initialView}
        locale="ko"
        headerToolbar={{ left: 'prev,next today', center: 'title', right: '' }}
        buttonText={{ today: '오늘' }}
        events={events}
        eventClick={onEventClick}
        height="auto"
        nowIndicator
        slotMinTime="06:00:00"
        slotMaxTime="22:00:00"
        dayMaxEvents={3}
        firstDay={0}
      />
    )
  },
)

CalendarViewer.displayName = 'CalendarViewer'
