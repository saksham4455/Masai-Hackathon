const API_BASE = process.env.REACT_APP_API_URL || ''

export async function fetchJSON(path, opts = {}) {
  const res = await fetch(API_BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json()
}

export default { fetchJSON }
