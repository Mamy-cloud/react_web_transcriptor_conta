/* ================================================
   list_of_interviewer_display.tsx
   Affiche tous les interviewers depuis login_user
   ================================================ */

import { useState, useEffect } from 'react'
import { API, apiFetch } from '../api_url/api_config'

interface Interviewer {
  id:             string
  identifiant:    string
  nom:            string
  prenom:         string
  email:          string
  date_naissance: string
  created_at:     string
}

export default function ListOfInterviewerDisplay() {
  const [interviewers, setInterviewers] = useState<Interviewer[]>([])
  const [loading,      setLoading]      = useState(true)
  const [search,       setSearch]       = useState('')

  useEffect(() => {
    apiFetch(API.ADMIN_INTERVIEWERS)
      .then(r => r.json())
      .then(data => {
        if (data.success) setInterviewers(data.interviewers)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const displayed = interviewers.filter(i =>
    i.identifiant.toLowerCase().includes(search.toLowerCase()) ||
    i.nom.toLowerCase().includes(search.toLowerCase())         ||
    i.prenom.toLowerCase().includes(search.toLowerCase())      ||
    i.email.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return (
    <div className="admin-placeholder">
      <div className="admin-placeholder-icon">⏳</div>
      <p>Chargement…</p>
    </div>
  )

  return (
    <div>

      {/* ── Barre de recherche ── */}
      <div style={{ marginBottom: 'var(--space-5)' }}>
        <input
          className="work-search"
          type="text"
          placeholder="Rechercher un interviewer…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: '360px' }}
        />
      </div>

      {/* ── Compteur ── */}
      <div style={{ marginBottom: 'var(--space-4)', fontSize: '0.875rem', color: 'var(--text-lighter)' }}>
        {displayed.length} interviewer{displayed.length > 1 ? 's' : ''}
      </div>

      {/* ── Tableau ── */}
      <div className="work-table-wrap">
        <table className="work-table">
          <thead>
            <tr>
              <th>Identifiant</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Email</th>
              <th>Date de naissance</th>
              <th>Créé le</th>
              <th>ID</th>
            </tr>
          </thead>
          <tbody>
            {displayed.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-lighter)' }}>
                  Aucun interviewer trouvé.
                </td>
              </tr>
            ) : displayed.map(i => (
              <tr key={i.id}>
                <td style={{ fontWeight: 500, color: 'var(--foreground-default)' }}>
                  {i.identifiant}
                </td>
                <td>{i.nom || '—'}</td>
                <td>{i.prenom || '—'}</td>
                <td>{i.email || '—'}</td>
                <td>{i.date_naissance || '—'}</td>
                <td>{i.created_at || '—'}</td>
                <td>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: 'var(--text-lighter)',
                  }}>
                    {i.id.slice(0, 8)}…
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}
