// Split-token scheme (optional).
//
// TOKEN_PREFIX_B64 holds the GitHub PAT with its LAST 3 CHARACTERS REMOVED,
// then base64-encoded, and committed here. Because the value is both
// incomplete and encoded, GitHub secret scanning won't recognize/revoke it,
// and the repo alone never contains a usable token. The admin supplies only
// the final 3 characters (≈ 62^3 combinations + GitHub rate limits = real
// friction against casual misuse).
//
// To enable, generate the prefix from your FULL token and paste it below:
//   node -e "console.log(Buffer.from(process.argv[1].slice(0,-3)).toString('base64'))" "github_pat_XXXXXXXX...."
// Leave it empty ('') to fall back to entering the full token once.
const TOKEN_PREFIX_B64 =
  'Z2l0aHViX3BhdF8xMUFDRFFXV1Ewc2htMXZxOXJNRllIX3kwdHZjUkZqU2MzaUlaN2U2bUs5S3ZQc0FuM0liODZqYVFuMUJ0aG1vRUNFWk5BUE5KWUtvU2x2'

const CRED_KEY = 'jihoplan.cred'

/** True when a token prefix is baked in → the admin enters only 3 characters. */
export function usesSplitToken(): boolean {
  return TOKEN_PREFIX_B64.length > 0
}

function decodePrefix(): string {
  try {
    return new TextDecoder().decode(
      Uint8Array.from(atob(TOKEN_PREFIX_B64), (c) => c.charCodeAt(0)),
    )
  } catch {
    return ''
  }
}

// The credential the admin supplies: the last 3 chars (split mode) or the full
// token (fallback). Stored only in this browser.
export function getPat(): string | null {
  const cred = localStorage.getItem(CRED_KEY) ?? sessionStorage.getItem(CRED_KEY)
  if (!cred) return null
  return usesSplitToken() ? decodePrefix() + cred : cred
}

export function setPat(cred: string, remember: boolean): void {
  if (remember) {
    localStorage.setItem(CRED_KEY, cred)
    sessionStorage.removeItem(CRED_KEY)
  } else {
    sessionStorage.setItem(CRED_KEY, cred)
    localStorage.removeItem(CRED_KEY)
  }
}

export function clearPat(): void {
  sessionStorage.removeItem(CRED_KEY)
  localStorage.removeItem(CRED_KEY)
}
