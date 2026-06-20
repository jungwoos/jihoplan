import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPat, clearPat } from '../lib/auth'
import { useAdminSchedule } from '../hooks/useAdminSchedule'
import { toEventInputs } from '../lib/schedule'
import { AdminLogin } from '../components/AdminLogin'
import { AdminCalendar } from '../components/AdminCalendar'
import { EventEditorModal } from '../components/EventEditorModal'
import { SaveStatusBar } from '../components/SaveStatusBar'
import type { ScheduleEvent } from '../types'

interface Editing {
  event: ScheduleEvent
  isNew: boolean
}

function newDraft(start: string, end: string | null, allDay: boolean, categoryId: string): ScheduleEvent {
  return {
    id: `evt_${crypto.randomUUID()}`,
    title: '',
    start,
    end,
    allDay,
    categoryId,
    color: '',
    location: '',
    notes: '',
    rrule: null,
  }
}

export function AdminPage() {
  const [ready, setReady] = useState(false)
  const [editing, setEditing] = useState<Editing | null>(null)
  const schedule = useAdminSchedule()
  const { file, load, upsertEvent, deleteEvent } = schedule

  // Auto-resume if a token is already stored on this device (no password).
  useEffect(() => {
    if (getPat()) {
      setReady(true)
      void load()
    }
  }, [load])

  const events = useMemo(() => (file ? toEventInputs(file) : []), [file])
  const defaultCategory = file?.categories[0]?.id ?? 'etc'

  if (!ready) {
    return (
      <AdminLogin
        onReady={() => {
          setReady(true)
          void load()
        }}
      />
    )
  }

  const onSelectSlot = (start: string, end: string | null, allDay: boolean) => {
    setEditing({ event: newDraft(start, end, allDay, defaultCategory), isNew: true })
  }

  const onEventClick = (id: string) => {
    const found = file?.events.find((e) => e.id === id)
    if (found) setEditing({ event: found, isNew: false })
  }

  const onEventTimeChange = (
    id: string,
    start: string,
    end: string | null,
    allDay: boolean,
  ) => {
    const found = file?.events.find((e) => e.id === id)
    if (found) upsertEvent({ ...found, start, end, allDay })
  }

  const signOut = () => {
    clearPat()
    setReady(false)
  }

  return (
    <div className="page">
      <header className="app-header">
        <h1>관리자 — 일정 편집</h1>
        <div className="header-actions">
          <Link to="/" className="ghost-btn">
            달력 보기
          </Link>
          <button type="button" className="ghost-btn" onClick={signOut}>
            로그아웃
          </button>
        </div>
      </header>

      <p className="hint">
        빈 칸을 드래그하면 새 일정, 일정을 클릭하면 수정/삭제할 수 있습니다. 드래그로
        시간 변경도 가능합니다. 변경 후 <b>GitHub에 저장</b>을 눌러야 반영됩니다.
      </p>

      {schedule.loading ? <p className="status">불러오는 중…</p> : null}

      {file ? (
        <AdminCalendar
          events={events}
          onSelectSlot={onSelectSlot}
          onEventClick={onEventClick}
          onEventTimeChange={onEventTimeChange}
        />
      ) : schedule.error ? (
        <p className="status warn">{schedule.error}</p>
      ) : null}

      <SaveStatusBar
        dirty={schedule.dirty}
        saving={schedule.saving}
        error={schedule.error}
        onCommit={() => void schedule.commit()}
      />

      {editing && file ? (
        <EventEditorModal
          categories={file.categories}
          event={editing.event}
          isNew={editing.isNew}
          onSave={(ev) => {
            upsertEvent(ev)
            setEditing(null)
          }}
          onDelete={(id) => {
            deleteEvent(id)
            setEditing(null)
          }}
          onClose={() => setEditing(null)}
        />
      ) : null}
    </div>
  )
}
