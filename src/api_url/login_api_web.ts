/* ================================================
   login_api_web.ts — Service de connexion
   ================================================
   Appelé depuis login.tsx au clic sur "Se connecter".
   Construit le JSON et appelle POST /login/web.
   ================================================ */

import { API } from './api_config'

/* ── Types ── */
export interface LoginPayload {
  identifiant:  string
  mot_de_passe: string
}

export interface LoginResponse {
  success:  boolean
  message:  string
  user_id?: string
  token?:   string
}

export interface LoginFieldError {
  field?:   keyof LoginPayload
  message:  string
}

/* ── Validation locale ── */
export function validateLogin(payload: LoginPayload): LoginFieldError[] {
  const errors: LoginFieldError[] = []

  if (!payload.identifiant.trim())
    errors.push({ field: 'identifiant', message: "L'identifiant est requis." })

  if (!payload.mot_de_passe)
    errors.push({ field: 'mot_de_passe', message: 'Le mot de passe est requis.' })

  return errors
}

/* ── Appel API ── */
export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  const body = JSON.stringify({
    identifiant:  payload.identifiant.trim(),
    mot_de_passe: payload.mot_de_passe,
  })

  const response = await fetch(API.LOGIN, {
    method:  'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData?.message ?? `Erreur serveur (${response.status})`)
  }

  return response.json() as Promise<LoginResponse>
}
