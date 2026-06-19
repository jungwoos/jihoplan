import { useState } from 'react'
import type { Category, ScheduleEvent } from '../types'
import { colorFor } from '../lib/schedule'

interface Props {
  categories: Category[]
  /** Existing event to edit, or a draft (new) event with id + defaults. */
  event: ScheduleEvent
  isNew: boolean
  onSave: (event: ScheduleEvent) => void
  onDelete: (id: string) => void
  onClose: () => void
}

// "2026-06-19T16:00:00" <-> datetime-local "2026-06-19T16:00"
const toLocalInput = (iso: string) => iso.slice(0, 16)
const fromLocalInput = (v: string) => (v.length === 16 ? `${v}:00` : v)
const toDateInput = (iso: string) => iso.slice(0, 10)

export function EventEditorModal({
  categories,
  event,
  isNew,
  onSave,
  onDelete,
  onClose,
}: Props) {
  const [draft, setDraft] = useState<ScheduleEvent>(event)

  const set = <K extends keyof ScheduleEvent>(key: K, value: ScheduleEvent[K]) =>
    setDraft((d) => ({ ...d, [key]: value }))

  const save = (e: React.FormEvent) => {
    e.preventDefault()
    if (!draft.title.trim()) return
    const color = colorFor(draft.categoryId, categories)
    onSave({ ...draft, title: draft.title.trim(), color })
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={isNew ? '일정 추가' : '일정 수정'}
        onClick={(e) => e.stopPropagation()}
        onSubmit={save}
      >
        <div className="modal-header">
          <h2>{isNew ? '일정 추가' : '일정 수정'}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="닫기">
            ×
          </button>
        </div>

        <label className="field">
          <span>제목</span>
          <input
            value={draft.title}
            autoFocus
            onChange={(e) => set('title', e.target.value)}
            placeholder="예: 피아노 학원"
          />
        </label>

        <label className="field">
          <span>분류</span>
          <select
            value={draft.categoryId}
            onChange={(e) => set('categoryId', e.target.value)}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </label>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={draft.allDay}
            onChange={(e) => {
              const allDay = e.target.checked
              setDraft((d) => ({
                ...d,
                allDay,
                start: allDay ? toDateInput(d.start) : `${toDateInput(d.start)}T09:00:00`,
                end: allDay ? null : `${toDateInput(d.start)}T10:00:00`,
              }))
            }}
          />
          종일
        </label>

        {draft.allDay ? (
          <label className="field">
            <span>날짜</span>
            <input
              type="date"
              value={toDateInput(draft.start)}
              onChange={(e) => set('start', e.target.value)}
            />
          </label>
        ) : (
          <div className="field-row">
            <label className="field">
              <span>시작</span>
              <input
                type="datetime-local"
                value={toLocalInput(draft.start)}
                onChange={(e) => set('start', fromLocalInput(e.target.value))}
              />
            </label>
            <label className="field">
              <span>종료</span>
              <input
                type="datetime-local"
                value={toLocalInput(draft.end ?? draft.start)}
                onChange={(e) => set('end', fromLocalInput(e.target.value))}
              />
            </label>
          </div>
        )}

        <label className="field">
          <span>장소</span>
          <input
            value={draft.location}
            onChange={(e) => set('location', e.target.value)}
            placeholder="(선택)"
          />
        </label>

        <label className="field">
          <span>메모</span>
          <textarea
            value={draft.notes}
            rows={2}
            onChange={(e) => set('notes', e.target.value)}
            placeholder="(선택)"
          />
        </label>

        <div className="modal-actions">
          {!isNew ? (
            <button
              type="button"
              className="danger-btn"
              onClick={() => onDelete(draft.id)}
            >
              삭제
            </button>
          ) : (
            <span />
          )}
          <div>
            <button type="button" className="ghost-btn" onClick={onClose}>
              취소
            </button>
            <button type="submit" className="primary-btn">
              저장
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
