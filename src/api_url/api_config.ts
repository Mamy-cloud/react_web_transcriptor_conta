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
  SESSION:  `${BASE_URL}/session/web`,

  /* ── Enregistrements ── */
  RECORDINGS:   `${BASE_URL}/recordings`,
  INFO_TEMOIN:  `${BASE_URL}/info/temoin/conta`,

  /* ── Transcription ── */
  STT:              `${BASE_URL}/transcriptor/stt`,
  STT_SEGMENTS:     `${BASE_URL}/transcriptor/stt/segments`,
  TTS:              `${BASE_URL}/transcriptor/tts`,
  TTS_SEGMENTS:     `${BASE_URL}/transcriptor/tts/segments`,
  TTS_DOWNLOAD:     `${BASE_URL}/transcriptor/tts/download`,
  VALIDATE_TRANS:   `${BASE_URL}/transcriptor/validate`,
  UPDATE_SEGMENT:   `${BASE_URL}/transcriptor/segment`,
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
