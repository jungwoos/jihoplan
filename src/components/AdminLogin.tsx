import { useState } from 'react'
import { Link } from 'react-router-dom'
import { checkPassword, getPat, setPat } from '../lib/auth'

interface Props {
  needsPassword: boolean
  onReady: () => void
}

export function AdminLogin({ needsPassword, onReady }: Props) {
  const [password, setPassword] = useState('')
  const [pat, setPatValue] = useState('')
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [unlocked, setUnlocked] = useState(!needsPassword)

  const submitPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (await checkPassword(password)) {
      // A token already saved on this device → skip the token step entirely.
      if (getPat()) {
        onReady()
        return
      }
      setUnlocked(true)
    } else {
      setError('비밀번호가 올바르지 않습니다.')
    }
  }

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

      {!unlocked ? (
        <form className="card" onSubmit={submitPassword}>
          <h2>비밀번호</h2>
          <input
            type="password"
            value={password}
            autoFocus
            autoComplete="current-password"
            placeholder="관리자 비밀번호"
            onChange={(e) => setPassword(e.target.value)}
          />
          {error ? <p className="status warn">{error}</p> : null}
          <button type="submit" className="primary-btn">
            확인
          </button>
        </form>
      ) : (
        <form className="card" onSubmit={submitPat}>
          <h2>GitHub 토큰</h2>
          <p className="hint">
            일정을 저장하려면 저장소 쓰기 권한이 있는 fine-grained 토큰(Contents:
            Read and write)이 필요합니다. 토큰은 이 브라우저에만 저장됩니다.
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
      )}
    </div>
  )
}
