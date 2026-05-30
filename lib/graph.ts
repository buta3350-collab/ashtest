// Microsoft Graph API helper — client credentials (app-only) flow

const TOKEN_URL = `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/token`
const GRAPH = 'https://graph.microsoft.com/v1.0'

let _cachedToken: string | null = null
let _tokenExpiry = 0

export async function getGraphToken(): Promise<string> {
  if (_cachedToken && Date.now() < _tokenExpiry) return _cachedToken

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type:    'client_credentials',
      client_id:     process.env.AZURE_CLIENT_ID!,
      client_secret: process.env.AZURE_CLIENT_SECRET!,
      scope:         'https://graph.microsoft.com/.default',
    }),
  })

  if (!res.ok) throw new Error(`Token-Fehler: ${res.status}`)
  const data = await res.json()
  _cachedToken = data.access_token
  _tokenExpiry = Date.now() + (data.expires_in - 60) * 1000
  return _cachedToken!
}

export async function graphFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = await getGraphToken()
  return fetch(`${GRAPH}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
}
