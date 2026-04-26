import { useState } from 'react'
import Navbar from '../nav/Navbar'
import '../style/view_work.css'

/* ── Types ── */
type Statut = 'transcrit' | 'non-transcrit'

interface Enregistrement {
  id: number
  titre: string
  description: string
  region: string
  duree: string
  date: string
  statut: Statut
  temoin: string
}

/* ── Données vides ── */
const MOCK_DATA: Enregistrement[] = []

/* ── Helpers ── */
const TOTAL_HEURES = 0
const TTS_SEUIL_1 = 50
const TTS_SEUIL_2 = 200
const pct = Math.min((TOTAL_HEURES / TTS_SEUIL_2) * 100, 100)

const labelStatut: Record<Statut, string> = {
  'transcrit':     'Transcrit',
  'non-transcrit': 'Non transcrit',
}

export default function ViewWork() {
  const [data, setData]                 = useState<Enregistrement[]>(MOCK_DATA)
  const [search, setSearch]             = useState('')
  const [filtreRegion, setFiltreRegion] = useState('Toutes')
  const [filtreStatut, setFiltreStatut] = useState('Tous')
  const [editing, setEditing]           = useState<Enregistrement | null>(null)

  /* ── Filtrage ── */
  const displayed = data.filter(r => {
    const matchSearch = r.titre.toLowerCase().includes(search.toLowerCase()) ||
                        r.temoin.toLowerCase().includes(search.toLowerCase())
    const matchRegion = filtreRegion === 'Toutes' || r.region === filtreRegion
    const matchStatut = filtreStatut === 'Tous'   || r.statut === filtreStatut
    return matchSearch && matchRegion && matchStatut
  })

  /* ── Sauvegarde édition ── */
  const handleSave = () => {
    if (!editing) return
    setData(prev => prev.map(r => r.id === editing.id ? editing : r))
    setEditing(null)
  }

  const regions = ['Toutes', ...Array.from(new Set(data.map(r => r.region)))]
  const statuts = ['Tous', 'transcrit', 'non-transcrit']

  return (
    <>
      <Navbar />
      <div className="work-page">
        <div className="work-inner">

          {/* ── Header ── */}
          <div className="work-header">
            <div className="work-header-left">
              <h1>Interface de travail</h1>
              <p>Gérez, éditez et triez vos enregistrements.</p>
            </div>
          </div>

          {/* ── Stats ── */}
          <div className="work-stats">
            <div className="work-stat-card brand">
              <span className="work-stat-label">Heures enregistrées</span>
              <span className="work-stat-value">{TOTAL_HEURES}h</span>
              <span className="work-stat-sub">sur {TTS_SEUIL_2}h objectif TTS qualité</span>
            </div>
            <div className="work-stat-card">
              <span className="work-stat-label">Fichiers total</span>
              <span className="work-stat-value">{data.length}</span>
              <span className="work-stat-sub">enregistrements</span>
            </div>
            <div className="work-stat-card">
              <span className="work-stat-label">Transcrits</span>
              <span className="work-stat-value">{data.filter(r => r.statut === 'transcrit').length}</span>
              <span className="work-stat-sub">fichiers validés</span>
            </div>
            <div className="work-stat-card">
              <span className="work-stat-label">Non transcrits</span>
              <span className="work-stat-value">{data.filter(r => r.statut === 'non-transcrit').length}</span>
              <span className="work-stat-sub">à traiter</span>
            </div>
          </div>

          {/* ── Barre progression TTS ── */}
          <div className="work-tts-bar">
            <div className="work-tts-bar-header">
              <span>Progression vers le TTS corse</span>
              <span className="work-tts-hint">{TOTAL_HEURES}h / {TTS_SEUIL_2}h</span>
            </div>
            <div className="work-tts-track">
              <div className="work-tts-fill" style={{ width: `${pct}%` }} />
            </div>
            <div className="work-tts-milestones">
              <div className="work-tts-milestone">
                <div className="work-tts-milestone-dot" />
                <span>0h</span>
              </div>
              <div className="work-tts-milestone">
                <div className={`work-tts-milestone-dot${TOTAL_HEURES >= TTS_SEUIL_1 ? ' reached' : ''}`} />
                <span className={TOTAL_HEURES >= TTS_SEUIL_1 ? 'reached' : ''}>50h — TTS de base</span>
              </div>
              <div className="work-tts-milestone">
                <div className={`work-tts-milestone-dot${TOTAL_HEURES >= TTS_SEUIL_2 ? ' reached' : ''}`} />
                <span className={TOTAL_HEURES >= TTS_SEUIL_2 ? 'reached' : ''}>200h — TTS qualité</span>
              </div>
            </div>
          </div>

          {/* ── Filtres ── */}
          <div className="work-filters">
            <input
              className="work-search"
              type="text"
              placeholder="Rechercher un titre ou témoin…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select className="work-filter-select" value={filtreRegion} onChange={e => setFiltreRegion(e.target.value)}>
              {regions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <select className="work-filter-select" value={filtreStatut} onChange={e => setFiltreStatut(e.target.value)}>
              {statuts.map(s => (
                <option key={s} value={s}>
                  {s === 'Tous' ? 'Tous statuts' : labelStatut[s as Statut]}
                </option>
              ))}
            </select>
          </div>

          {/* ── Table ── */}
          <div className="work-table-wrap">
            <table className="work-table">
              <thead>
                <tr>
                  <th>Titre / Description</th>
                  <th>Région</th>
                  <th>Durée</th>
                  <th>Date</th>
                  <th>Statut</th>
                  <th>Témoin</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayed.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-lighter)' }}>
                      Aucun enregistrement trouvé.
                    </td>
                  </tr>
                ) : displayed.map(rec => (
                  <tr key={rec.id}>
                    <td>
                      <div className="work-table-title">{rec.titre}</div>
                      <div className="work-table-desc">{rec.description}</div>
                    </td>
                    <td>{rec.region}</td>
                    <td>{rec.duree}</td>
                    <td>{rec.date}</td>
                    <td>
                      <span className={`work-status ${rec.statut}`}>
                        {labelStatut[rec.statut]}
                      </span>
                    </td>
                    <td>{rec.temoin}</td>
                    <td>
                      <div className="work-row-actions">
                        <button className="work-row-btn" onClick={() => setEditing({ ...rec })}>
                          Éditer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>

      {/* ── Modal édition ── */}
      {editing && (
        <div className="work-modal-overlay" onClick={() => setEditing(null)}>
          <div className="work-modal" onClick={e => e.stopPropagation()}>
            <div className="work-modal-header">
              <h3>Éditer l'enregistrement</h3>
              <button className="work-modal-close" onClick={() => setEditing(null)}>✕</button>
            </div>

            <div className="work-modal-field">
              <label className="work-modal-label">Titre</label>
              <input
                className="work-modal-input"
                value={editing.titre}
                onChange={e => setEditing({ ...editing, titre: e.target.value })}
              />
            </div>

            <div className="work-modal-field">
              <label className="work-modal-label">Description</label>
              <textarea
                className="work-modal-textarea"
                value={editing.description}
                onChange={e => setEditing({ ...editing, description: e.target.value })}
              />
            </div>

            <div className="work-modal-field">
              <label className="work-modal-label">Région</label>
              <input
                className="work-modal-input"
                value={editing.region}
                onChange={e => setEditing({ ...editing, region: e.target.value })}
              />
            </div>

            <div className="work-modal-field">
              <label className="work-modal-label">Témoin</label>
              <input
                className="work-modal-input"
                value={editing.temoin}
                onChange={e => setEditing({ ...editing, temoin: e.target.value })}
              />
            </div>

            <div className="work-modal-field">
              <label className="work-modal-label">Statut</label>
              <select
                className="work-modal-input"
                value={editing.statut}
                onChange={e => setEditing({ ...editing, statut: e.target.value as Statut })}
              >
                <option value="non-transcrit">Non transcrit</option>
                <option value="transcrit">Transcrit</option>
              </select>
            </div>

            <div className="work-modal-actions">
              <button className="btn btn-default" onClick={() => setEditing(null)}>Annuler</button>
              <button className="btn btn-primary" onClick={handleSave}>Sauvegarder</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
