import { useState } from 'react'
import { Link } from 'react-router-dom'
import { setPat } from '../lib/auth'

interface Props {
  onReady: () => void
}

export function AdminLogin({ onReady }: Props) {
  const [pat, setPatValue] = useState('')
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const submitPat = (e: React.FormEvent) => {
    e.preventDefault()
    if (!pat.trim()) {
      setError('토큰을 입력하세요.')
      return
    }
    setPat(pat.trim(), remember)
    onReady()
  }

  return (
    <div className="page narrow">
      <header className="app-header">
        <h1>관리자</h1>
        <Link to="/" className="ghost-btn">
          달력으로
        </Link>
      </header>

      <form className="card" onSubmit={submitPat}>
        <h2>GitHub 토큰</h2>
        <p className="hint">
          일정을 저장하려면 저장소 쓰기 권한이 있는 fine-grained 토큰(Contents: Read
          and write)이 필요합니다. 토큰은 이 브라우저에만 저장되며, 한 번 입력하면 이
          기기에서는 다시 묻지 않습니다.
        </p>
        <input
          type="password"
          value={pat}
          autoFocus
          placeholder="github_pat_..."
          onChange={(e) => setPatValue(e.target.value)}
        />
        <label className="checkbox">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          이 기기에서 기억하기
        </label>
        {error ? <p className="status warn">{error}</p> : null}
        <button type="submit" className="primary-btn">
          시작하기
        </button>
      </form>
    </div>
  )
}
