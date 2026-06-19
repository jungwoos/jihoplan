interface Props {
  dirty: boolean
  saving: boolean
  error: string | null
  onCommit: () => void
}

export function SaveStatusBar({ dirty, saving, error, onCommit }: Props) {
  return (
    <div className="save-bar">
      <span className="save-state">
        {saving
          ? '저장 중…'
          : error
            ? `⚠ ${error}`
            : dirty
              ? '저장하지 않은 변경이 있습니다.'
              : '모든 변경이 저장되었습니다.'}
      </span>
      <button
        type="button"
        className="primary-btn"
        disabled={!dirty || saving}
        onClick={onCommit}
      >
        GitHub에 저장
      </button>
    </div>
  )
}
