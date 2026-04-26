/* ================================================
   api_config.ts — Centralisation de la config API
   ================================================ */

const BASE_URL = '/api'

export const API = {
  BASE_URL,

  /* ── Auth ── */
  SIGN_UP:  `${BASE_URL}/sign_up/web`,
  LOGIN:    `${BASE_URL}/login/web`,
  LOGOUT:   `${BASE_URL}/logout/web/conta`,

  /* ── Enregistrements ── */
  RECORDINGS: `${BASE_URL}/recordings`,
} as const

/* ================================================
   apiFetch — wrapper centralisé
   Ajoute automatiquement credentials: 'include'
   et Content-Type: application/json sur tous les appels.
   ================================================ */

export async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  return fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
}
