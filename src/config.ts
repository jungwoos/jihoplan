// Central configuration for the GitHub-backed data store.
// The viewer reads schedule.json from the raw CDN URL; the admin commits it
// back via the GitHub Contents API using a PAT entered in the browser.

export const config = {
  owner: 'jungwoos',
  repo: 'jihoplan',
  branch: 'main',
  dataPath: 'data/schedule.json',
} as const

// Raw CDN URL for credential-free viewer reads. A cache-buster (?t=) is added
// at fetch time. CDN edge cache is ~5 min, acceptable for a family schedule.
export const rawDataUrl = `https://raw.githubusercontent.com/${config.owner}/${config.repo}/${config.branch}/${config.dataPath}`

// GitHub Contents API endpoint for the data file (read sha + write commit).
export const contentsApiUrl = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${config.dataPath}`
