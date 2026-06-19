import type { EventImpl } from '@fullcalendar/core/internal'

interface Props {
  event: EventImpl | null
  onClose: () => void
}

function formatRange(event: EventImpl): string {
  const start = event.start
  if (!start) return ''
  const dateFmt = new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  })
  const timeFmt = new Intl.DateTimeFormat('ko-KR', { hour: 'numeric', minute: '2-digit' })

  if (event.allDay) return `${dateFmt.format(start)} (종일)`

  const end = event.end
  const datePart = dateFmt.format(start)
  const startTime = timeFmt.format(start)
  if (!end) return `${datePart} ${startTime}`
  const sameDay = start.toDateString() === end.toDateString()
  return sameDay
    ? `${datePart} ${startTime} – ${timeFmt.format(end)}`
    : `${datePart} ${startTime} – ${dateFmt.format(end)} ${timeFmt.format(end)}`
}

export function EventDetailPopover({ event, onClose }: Props) {
  if (!event) return null
  const location = event.extendedProps.location as string | undefined
  const notes = event.extendedProps.notes as string | undefined

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label="일정 상세"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header" style={{ borderColor: event.backgroundColor }}>
          <h2>{event.title}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="닫기">
            ×
          </button>
        </div>
        <dl className="detail-list">
          <dt>일시</dt>
          <dd>{formatRange(event)}</dd>
          {location ? (
            <>
              <dt>장소</dt>
              <dd>{location}</dd>
            </>
          ) : null}
          {notes ? (
            <>
              <dt>메모</dt>
              <dd>{notes}</dd>
            </>
          ) : null}
        </dl>
      </div>
    </div>
  )
}
