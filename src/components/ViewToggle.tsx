export type CalendarView = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek'

const OPTIONS: { value: CalendarView; label: string }[] = [
  { value: 'dayGridMonth', label: '월' },
  { value: 'timeGridWeek', label: '주' },
  { value: 'timeGridDay', label: '일' },
  { value: 'listWeek', label: '목록' },
]

interface Props {
  value: CalendarView
  onChange: (view: CalendarView) => void
}

export function ViewToggle({ value, onChange }: Props) {
  return (
    <div className="view-toggle" role="group" aria-label="달력 보기 전환">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={value === opt.value ? 'active' : ''}
          aria-pressed={value === opt.value}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
