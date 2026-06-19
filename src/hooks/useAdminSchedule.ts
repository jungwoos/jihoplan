import { useCallback, useRef, useState } from 'react'
import { getFile, GitHubError, putFile } from '../lib/github'
import { getPat } from '../lib/auth'
import type { ScheduleEvent, ScheduleFile } from '../types'

interface State {
  file: ScheduleFile | null
  sha: string | null
  loading: boolean
  saving: boolean
  dirty: boolean
  error: string | null
}

const initial: State = {
  file: null,
  sha: null,
  loading: false,
  saving: false,
  dirty: false,
  error: null,
}

export function useAdminSchedule() {
  const [state, setState] = useState<State>(initial)
  // Mirror file/sha in a ref so commit() reads the latest values without
  // depending on a re-render or stale closure.
  const ref = useRef<{ file: ScheduleFile | null; sha: string | null }>({
    file: null,
    sha: null,
  })

  const apply = useCallback((updater: (s: State) => State) => {
    setState((s) => {
      const next = updater(s)
      ref.current = { file: next.file, sha: next.sha }
      return next
    })
  }, [])

  const load = useCallback(async () => {
    const pat = getPat()
    if (!pat) {
      apply((s) => ({ ...s, error: '토큰이 없습니다.' }))
      return
    }
    apply((s) => ({ ...s, loading: true, error: null }))
    try {
      const { data, sha } = await getFile(pat)
      apply(() => ({ ...initial, file: data, sha }))
    } catch (err) {
      apply((s) => ({
        ...s,
        loading: false,
        error: err instanceof Error ? err.message : '불러오기 실패',
      }))
    }
  }, [apply])

  const upsertEvent = useCallback(
    (event: ScheduleEvent) => {
      apply((s) => {
        if (!s.file) return s
        const events = [...s.file.events]
        const idx = events.findIndex((e) => e.id === event.id)
        if (idx >= 0) events[idx] = event
        else events.push(event)
        return { ...s, file: { ...s.file, events }, dirty: true }
      })
    },
    [apply],
  )

  const deleteEvent = useCallback(
    (id: string) => {
      apply((s) => {
        if (!s.file) return s
        return {
          ...s,
          file: { ...s.file, events: s.file.events.filter((e) => e.id !== id) },
          dirty: true,
        }
      })
    },
    [apply],
  )

  const commit = useCallback(async () => {
    const pat = getPat()
    if (!pat) {
      apply((s) => ({ ...s, error: '토큰이 없습니다.' }))
      return false
    }
    const { file, sha } = ref.current
    if (!file || !sha) {
      apply((s) => ({ ...s, error: '저장할 데이터가 없습니다.' }))
      return false
    }
    apply((s) => ({ ...s, saving: true, error: null }))
    try {
      const payload: ScheduleFile = { ...file, updatedAt: new Date().toISOString() }
      const newSha = await putFile(pat, payload, sha, '일정 업데이트')
      apply((s) => ({ ...s, file: payload, sha: newSha, dirty: false, saving: false }))
      return true
    } catch (err) {
      const isConflict = err instanceof GitHubError && err.status === 409
      apply((s) => ({
        ...s,
        saving: false,
        error: err instanceof Error ? err.message : '저장 실패',
      }))
      if (isConflict) await load()
      return false
    }
  }, [apply, load])

  return { ...state, load, upsertEvent, deleteEvent, commit }
}
