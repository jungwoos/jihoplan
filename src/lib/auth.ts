// Client-side admin gate. NOTE: this is obfuscation only — the hash ships in
// the public bundle and can be inspected. It deters casual visitors; the real
// write credential is the GitHub PAT (see lib/github.ts).
//
// To change the password: run
//   printf '%s' 'YOUR_PASSWORD' | shasum -a 256
// and paste the hex digest below. Default password: "jiho1234".
const PASSWORD_SHA256 = 'f5c6b02bd7c3de818165ff1d2f43e2fb527168558a74b868ec9da196fdcb8f05'

const UNLOCK_KEY = 'jihoplan.unlocked'
const PAT_KEY = 'jihoplan.pat'

async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function checkPassword(input: string): Promise<boolean> {
  const ok = (await sha256Hex(input)) === PASSWORD_SHA256
  if (ok) sessionStorage.setItem(UNLOCK_KEY, '1')
  return ok
}

export function isUnlocked(): boolean {
  return sessionStorage.getItem(UNLOCK_KEY) === '1'
}

export function lock(): void {
  sessionStorage.removeItem(UNLOCK_KEY)
}

// PAT storage. sessionStorage by default (cleared on tab close); localStorage
// when the admin opts to remember on this device.
export function getPat(): string | null {
  return sessionStorage.getItem(PAT_KEY) ?? localStorage.getItem(PAT_KEY)
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
