// Admin write credential: a GitHub fine-grained PAT, stored only in this
// browser. There is NO password gate — possession of the token is the
// authorization. A visitor without a stored token sees only the token-entry
// screen and cannot save anything.

const PAT_KEY = 'jihoplan.pat'

// PAT storage. localStorage (remembered on this device) by default; sessionStorage
// when the admin opts out of remembering (cleared when the tab closes).
export function getPat(): string | null {
  return localStorage.getItem(PAT_KEY) ?? sessionStorage.getItem(PAT_KEY)
}

export function setPat(pat: string, remember: boolean): void {
  if (remember) {
    localStorage.setItem(PAT_KEY, pat)
    sessionStorage.removeItem(PAT_KEY)
  } else {
    sessionStorage.setItem(PAT_KEY, pat)
    localStorage.removeItem(PAT_KEY)
  }
}

export function clearPat(): void {
  sessionStorage.removeItem(PAT_KEY)
  localStorage.removeItem(PAT_KEY)
}
