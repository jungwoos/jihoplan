import { contentsApiUrl, config } from '../config'
import type { ScheduleFile } from '../types'

// UTF-8-safe base64 (plain btoa/atob break on multibyte Korean text).
function encodeBase64(text: string): string {
  const bytes = new TextEncoder().encode(text)
  let binary = ''
  bytes.forEach((b) => (binary += String.fromCharCode(b)))
  return btoa(binary)
}

function decodeBase64(b64: string): string {
  const binary = atob(b64.replace(/\n/g, ''))
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

export class GitHubError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
    this.name = 'GitHubError'
  }
}

interface FileResult {
  data: ScheduleFile
  sha: string
}

const headers = (pat: string) => ({
  Authorization: `Bearer ${pat}`,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
})

/** Read the file via the Contents API → returns parsed JSON + blob sha. */
export async function getFile(pat: string): Promise<FileResult> {
  const res = await fetch(`${contentsApiUrl}?ref=${config.branch}`, {
    headers: headers(pat),
    cache: 'no-store',
  })
  if (!res.ok) {
    throw new GitHubError(`파일을 불러오지 못했습니다 (HTTP ${res.status})`, res.status)
  }
  const json = (await res.json()) as { content: string; sha: string }
  const data = JSON.parse(decodeBase64(json.content)) as ScheduleFile
  return { data, sha: json.sha }
}

/** Commit updated content. Requires the current sha; returns the new sha. */
export async function putFile(
  pat: string,
  data: ScheduleFile,
  sha: string,
  message: string,
): Promise<string> {
  const body = {
    message,
    content: encodeBase64(JSON.stringify(data, null, 2) + '\n'),
    sha,
    branch: config.branch,
  }
  const res = await fetch(contentsApiUrl, {
    method: 'PUT',
    headers: headers(pat),
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const detail =
      res.status === 401
        ? '토큰이 올바르지 않거나 권한이 없습니다.'
        : res.status === 409
          ? '다른 변경과 충돌했습니다. 새로고침 후 다시 시도하세요.'
          : `저장에 실패했습니다 (HTTP ${res.status})`
    throw new GitHubError(detail, res.status)
  }
  const json = (await res.json()) as { content: { sha: string } }
  return json.content.sha
}
