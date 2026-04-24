/* ================================================
   api_config.ts — Centralisation de la config API
   ================================================
   Pour changer d'environnement, modifiez uniquement
   la variable BASE_URL ici.
   ================================================ */

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://conta-backend-fastapi.onrender.com'

export const API = {
  BASE_URL,

  /* ── Auth ── */
  SIGN_UP:  `${BASE_URL}/sign_up/web`,
  LOGIN:    `${BASE_URL}/login/web`,

  /* ── Enregistrements ── */
  RECORDINGS: `${BASE_URL}/recordings`,
} as const
