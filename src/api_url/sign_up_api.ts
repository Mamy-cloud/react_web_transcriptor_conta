/* ================================================
   sign_up_api.ts — Service d'inscription
   ================================================ */

import { API } from './api_config'

/* ── Types ── */
export interface SignUpPayload {
  nom:             string
  prenom:          string
  email:           string
  nom_utilisateur: string
  mot_de_passe:    string
  date_naissance:  string   // format ISO : "YYYY-MM-DD"
}

export interface SignUpResponse {
  success: boolean
  message: string
  user_id?: string
}

export interface SignUpError {
  field?: keyof SignUpPayload
  message: string
}

/* ── Validation locale ── */
export function validateSignUp(payload: SignUpPayload): SignUpError[] {
  const errors: SignUpError[] = []

  if (!payload.nom.trim())
    errors.push({ field: 'nom', message: 'Le nom est requis.' })

  if (!payload.prenom.trim())
    errors.push({ field: 'prenom', message: 'Le prénom est requis.' })

  if (!payload.email.trim())
    errors.push({ field: 'email', message: "L'adresse mail est requise." })
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email))
    errors.push({ field: 'email', message: "L'adresse mail n'est pas valide." })

  if (!payload.nom_utilisateur.trim())
    errors.push({ field: 'nom_utilisateur', message: "Le nom d'utilisateur est requis." })
  else if (payload.nom_utilisateur.length < 3)
    errors.push({ field: 'nom_utilisateur', message: "Le nom d'utilisateur doit faire au moins 3 caractères." })

  if (!payload.mot_de_passe)
    errors.push({ field: 'mot_de_passe', message: 'Le mot de passe est requis.' })
  else if (payload.mot_de_passe.length < 8)
    errors.push({ field: 'mot_de_passe', message: 'Le mot de passe doit faire au moins 8 caractères.' })

  if (!payload.date_naissance)
    errors.push({ field: 'date_naissance', message: 'La date de naissance est requise.' })

  return errors
}

/* ── Appel API ── */
export async function signUp(payload: SignUpPayload): Promise<SignUpResponse> {
  const body = JSON.stringify({
    nom:             payload.nom.trim(),
    prenom:          payload.prenom.trim(),
    email:           payload.email.trim().toLowerCase(),
    nom_utilisateur: payload.nom_utilisateur.trim(),
    mot_de_passe:    payload.mot_de_passe,
    date_naissance:  payload.date_naissance,
  })

  const response = await fetch(API.SIGN_UP, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData?.message ?? `Erreur serveur (${response.status})`)
  }

  return response.json() as Promise<SignUpResponse>
}
