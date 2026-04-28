/* ================================================
   reset_password.tsx — Réinitialisation du mot de passe
   ================================================ */

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { API, apiFetch } from '../api_url/api_config'
import '../style/login.css'

export default function ResetPassword() {
  const navigate = useNavigate()

  // ── Récupère le token depuis l'URL ────────────
  const token = new URLSearchParams(window.location.search).get('token') ?? ''

  const [password,  setPassword]  = useState('')
  const [confirm,   setConfirm]   = useState('')
  const [loading,   setLoading]   = useState(false)
  const [success,   setSuccess]   = useState(false)
  const [error,     setError]     = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Le mot de passe doit faire au moins 6 caractères.')
      return
    }
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }
    if (!token) {
      setError('Lien invalide. Faites une nouvelle demande.')
      return
    }

    setLoading(true)
    try {
      const res  = await apiFetch(API.RESET_PASSWORD, {
        method: 'POST',
        body:   JSON.stringify({ token, new_password: password }),
      })
      const data = await res.json()
      if (data.success) {
        setSuccess(true)
        setTimeout(() => navigate('/connexion'), 3000)
      } else {
        setError(data.message || 'Une erreur est survenue.')
      }
    } catch {
      setError('Erreur réseau. Réessayez.')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="login-page">
        <div className="login-card">
          <div style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-4)' }}>⚠️</div>
            <p style={{ color: 'var(--text-light)', marginBottom: 'var(--space-6)' }}>
              Lien invalide ou manquant.
            </p>
            <Link to="/mot-de-passe-oublie" className="btn btn-primary">
              Faire une nouvelle demande
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-header">
          <h1>Nouveau mot de passe</h1>
          <p>Choisissez un nouveau mot de passe pour votre compte.</p>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-4)' }}>✅</div>
            <p style={{ color: 'var(--brand-default)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
              Mot de passe mis à jour !
            </p>
            <p style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>
              Redirection vers la connexion dans 3 secondes…
            </p>
          </div>
        ) : (
          <form className="login-form" onSubmit={handleSubmit}>

            <div className="login-field">
              <label className="login-label">Nouveau mot de passe</label>
              <input
                className="login-input"
                type="password"
                placeholder="Au moins 6 caractères"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="login-field">
              <label className="login-label">Confirmer le mot de passe</label>
              <input
                className="login-input"
                type="password"
                placeholder="Répétez le mot de passe"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="login-error">{error}</div>
            )}

            <button
              type="submit"
              className="btn btn-primary login-submit"
              disabled={loading || !password || !confirm}
            >
              {loading ? '⏳ Mise à jour…' : 'Réinitialiser le mot de passe'}
            </button>

          </form>
        )}

      </div>
    </div>
  )
}
