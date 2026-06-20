import { forwardRef } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import type { EventClickArg, EventInput } from '@fullcalendar/core'
import type { CalendarView } from './ViewToggle'

interface Props {
  events: EventInput[]
  initialView: CalendarView
  isMobile: boolean
  onEventClick: (arg: EventClickArg) => void
}

/**
 * Read-only calendar. View switching is driven externally via the ref
 * (calendarRef.current.getApi().changeView(...)).
 */
export const CalendarViewer = forwardRef<FullCalendar, Props>(
  ({ events, initialView, isMobile, onEventClick }, ref) => {
    return (
      <FullCalendar
        ref={ref}
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
        initialView={initialView}
        locale="ko"
        headerToolbar={{ left: 'prev,next today', center: 'title', right: '' }}
        buttonText={{ today: '오늘' }}
        events={events}
        eventClick={onEventClick}
        height="auto"
        nowIndicator
        scrollTime="08:00:00"
        slotMinTime="08:00:00"
        slotMaxTime="21:00:00"
        firstDay={0}
        // Compact week/day headers ("14.일") and bare hour labels ("8") to
        // minimize wrapping in narrow timegrid columns.
        dayHeaderContent={(arg) => {
          if (arg.view.type.startsWith('timeGrid')) {
            const wd = ['일', '월', '화', '수', '목', '금', '토'][arg.date.getDay()]
            return `${arg.date.getDate()}.${wd}`
          }
          return arg.text
        }}
        slotLabelContent={(arg) => String(arg.date.getHours())}
        // Per-view tuning: month hides the redundant time and caps stacked
        // events so chips stay readable on small screens.
        views={{
          dayGridMonth: {
            displayEventTime: false,
            dayMaxEvents: isMobile ? 2 : 3,
          },
          listWeek: {
            listDayFormat: { weekday: 'long', month: 'long', day: 'numeric' },
          },
        }}
      />
    )
  },
)

CalendarViewer.displayName = 'CalendarViewer'
