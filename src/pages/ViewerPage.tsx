import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import FullCalendar from '@fullcalendar/react'
import type { EventClickArg } from '@fullcalendar/core'
import type { EventImpl } from '@fullcalendar/core/internal'
import { useScheduleData } from '../hooks/useScheduleData'
import { useIsMobile } from '../hooks/useIsMobile'
import { toEventInputs } from '../lib/schedule'
import { CalendarViewer } from '../components/CalendarViewer'
import { ViewToggle, type CalendarView } from '../components/ViewToggle'
import { CategoryLegend } from '../components/CategoryLegend'
import { EventDetailPopover } from '../components/EventDetailPopover'

export function ViewerPage() {
  const { data, loading, error } = useScheduleData()
  const isMobile = useIsMobile()
  const calendarRef = useRef<FullCalendar>(null)
  // Phones default to the list view (far more readable than a 7-column grid).
  const [view, setView] = useState<CalendarView>(isMobile ? 'listWeek' : 'dayGridMonth')
  const [selected, setSelected] = useState<EventImpl | null>(null)

  const events = useMemo(() => toEventInputs(data), [data])

  const changeView = (next: CalendarView) => {
    setView(next)
    calendarRef.current?.getApi().changeView(next)
  }

  const onEventClick = (arg: EventClickArg) => setSelected(arg.event as EventImpl)

  return (
    <div className="page">
      <header className="app-header">
        <h1>지호</h1>
        <ViewToggle value={view} onChange={changeView} />
        <div className="header-actions">
          <Link to="/admin" className="ghost-btn icon-link" aria-label="관리자" title="관리자">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
            </svg>
          </Link>
        </div>
      </header>

      <div className="toolbar">
        <CategoryLegend categories={data.categories} />
      </div>

      {loading ? <p className="status">불러오는 중…</p> : null}
      {error ? (
        <p className="status warn">
          최신 데이터를 불러오지 못해 저장된 사본을 표시합니다. ({error})
        </p>
      ) : null}

      <CalendarViewer
        ref={calendarRef}
        events={events}
        initialView={view}
        isMobile={isMobile}
        onEventClick={onEventClick}
      />

      <EventDetailPopover event={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
