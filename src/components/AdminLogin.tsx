import { useState } from 'react'
import { Link } from 'react-router-dom'
import { setPat, usesSplitToken } from '../lib/auth'

interface Props {
  onReady: () => void
}

export function AdminLogin({ onReady }: Props) {
  const split = usesSplitToken()
  const [cred, setCred] = useState('')
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const value = cred.trim()
    if (split && value.length !== 4) {
      setError('토큰 마지막 4자리를 입력하세요.')
      return
    }
    if (!split && !value) {
      setError('토큰을 입력하세요.')
      return
    }
    setPat(value, remember)
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

      <form className="card" onSubmit={submit}>
        <h2>{split ? '토큰 마지막 4자리' : 'GitHub 토큰'}</h2>
        <p className="hint">
          {split
            ? '저장소에 저장된 토큰을 완성하기 위한 마지막 4자리만 입력하세요. 한 번 입력하면 이 기기에서는 다시 묻지 않습니다.'
            : '일정을 저장하려면 저장소 쓰기 권한이 있는 fine-grained 토큰(Contents: Read and write)이 필요합니다. 토큰은 이 브라우저에만 저장됩니다.'}
        </p>
        <input
          type="password"
          value={cred}
          autoFocus
          maxLength={split ? 4 : undefined}
          inputMode={split ? 'text' : undefined}
          placeholder={split ? '••••' : 'github_pat_...'}
          onChange={(e) => setCred(e.target.value)}
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
