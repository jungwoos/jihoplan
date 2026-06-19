import { useCallback, useEffect, useState } from 'react'
import { rawDataUrl } from '../config'
import { fallbackSchedule, parseSchedule } from '../lib/schedule'
import type { ScheduleFile } from '../types'

interface State {
  data: ScheduleFile
  loading: boolean
  error: string | null
}

/**
 * Viewer read: fetch schedule.json from the raw CDN URL with a cache-buster.
 * Falls back to the bundled copy on any network/parse failure so the page
 * never renders empty.
 */
export function useScheduleData() {
  const [state, setState] = useState<State>({
    data: fallbackSchedule,
    loading: true,
    error: null,
  })

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }))
    try {
      const res = await fetch(`${rawDataUrl}?t=${Date.now()}`, { cache: 'no-store' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      setState({ data: parseSchedule(json), loading: false, error: null })
    } catch (err) {
      // Network or parse failure → keep the bundled fallback, surface a note.
      setState({
        data: fallbackSchedule,
        loading: false,
        error: err instanceof Error ? err.message : 'unknown error',
      })
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return { ...state, reload: load }
}
