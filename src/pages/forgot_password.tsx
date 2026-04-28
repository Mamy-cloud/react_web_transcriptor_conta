/* ================================================
   forgot_password.tsx — Mot de passe oublié
   ================================================ */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { API, apiFetch } from '../api_url/api_config'
import '../style/login.css'

export default function ForgotPassword() {
  const [email,   setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error,   setError]   = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError('')

    try {
      const res  = await apiFetch(API.FORGOT_PASSWORD, {
        method: 'POST',
        body:   JSON.stringify({ email: email.trim().toLowerCase() }),
      })
      const data = await res.json()
      if (data.success) {
        setSuccess(true)
      } else {
        setError(data.message || 'Une erreur est survenue.')
      }
    } catch {
      setError('Erreur réseau. Réessayez.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-header">
          <h1>Mot de passe oublié</h1>
          <p>Saisissez votre email pour recevoir un lien de réinitialisation.</p>
        </div>

        {success ? (
          <div style={{
            textAlign: 'center',
            padding:   'var(--space-6)',
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-4)' }}>📧</div>
            <p style={{ color: 'var(--brand-default)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
              Email envoyé !
            </p>
            <p style={{ color: 'var(--text-light)', fontSize: '0.875rem', marginBottom: 'var(--space-6)' }}>
              Si un compte correspond à cet email, vous recevrez un lien valable 15 minutes.
            </p>
            <Link to="/connexion" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Retour à la connexion
            </Link>
          </div>
        ) : (
          <form className="login-form" onSubmit={handleSubmit}>

            <div className="login-field">
              <label className="login-label">Adresse email</label>
              <input
                className="login-input"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>

            {error && (
              <div className="login-error">{error}</div>
            )}

            <button
              type="submit"
              className="btn btn-primary login-submit"
              disabled={loading || !email.trim()}
            >
              {loading ? '⏳ Envoi…' : 'Envoyer le lien'}
            </button>

            <div className="login-footer">
              <Link to="/connexion" className="login-link">
                ← Retour à la connexion
              </Link>
            </div>

          </form>
        )}

      </div>
    </div>
  )
}
