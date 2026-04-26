import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../nav/Navbar'
import '../style/view_work.css'
import { API, apiFetch } from '../api_url/api_config'

/* ── Types ── */
type Statut = 'transcrit' | 'non-transcrit'

interface Enregistrement {
  id:          string
  titre:       string
  description: string
  region:      string | null
  duree:       string
  date:        string
  statut:      Statut
  temoin:      string
  nom_temoin:  string
  prenom_temoin: string
}

interface Stats {
  total_heures:         string
  total_heures_decimal: number
  total_fichiers:       number
  total_transcrits:     number
  total_non_transcrits: number
  progression_pct:      number
  tts_seuil_base:       number
  tts_seuil_qualite:    number
}

const labelStatut: Record<Statut, string> = {
  'transcrit':     'Transcrit',
  'non-transcrit': 'Non transcrit',
}

export default function ViewWork() {
  const navigate = useNavigate()
  const [data,          setData]          = useState<Enregistrement[]>([])
  const [stats,         setStats]         = useState<Stats | null>(null)
  const [search,        setSearch]        = useState('')
  const [filtreRegion,  setFiltreRegion]  = useState('Toutes')
  const [filtreStatut,  setFiltreStatut]  = useState('')
  const [editing,       setEditing]       = useState<Enregistrement | null>(null)
  const [loading,       setLoading]       = useState(true)

  /* ── Transcrire — passe l'url_audio au transcripteur ── */
  const handleTranscrire = (rec: Enregistrement) => {
    if (!rec.description) {
      console.warn('[Transcrire] Pas d\'url_audio pour', rec.id)
      return
    }
    navigate('/transcription', {
      state: {
        collect_id: rec.id,
        url_audio:  rec.description,
        titre:      rec.titre,
        temoin:     rec.temoin,
        duree:      rec.duree,
      }
    })
  }

  /* ── Chargement des données ── */
  const fetchData = async (q = search, r = filtreRegion, s = filtreStatut) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ query: q, region: r, statut: s })
      const res    = await apiFetch(`${API.INFO_TEMOIN}?${params}`)
      const json   = await res.json()
      if (json.success) {
        setStats(json.stats)
        setData(json.tableau)
      }
    } catch (e) {
      console.error('Erreur chargement données :', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  /* ── Filtres ── */
  const handleSearch = (val: string) => {
    setSearch(val)
    fetchData(val, filtreRegion, filtreStatut)
  }

  const handleRegion = (val: string) => {
    setFiltreRegion(val)
    fetchData(search, val, filtreStatut)
  }

  const handleStatut = (val: string) => {
    setFiltreStatut(val)
    fetchData(search, filtreRegion, val)
  }

  /* ── Sauvegarde édition ── */
  const handleSave = () => {
    if (!editing) return
    setData(prev => prev.map(r => r.id === editing.id ? editing : r))
    setEditing(null)
  }

  const regions = ['Toutes', ...Array.from(new Set(data.map(r => r.region).filter((r): r is string => r !== null)))]
  const statuts = ['', 'transcrit', 'non-transcrit']

  const pct             = stats ? stats.progression_pct : 0
  const totalHeures     = stats ? stats.total_heures : '0h 0min 0s'
  const TTS_SEUIL_1     = stats ? stats.tts_seuil_base    : 50
  const TTS_SEUIL_2     = stats ? stats.tts_seuil_qualite : 200
  const totalDecimal    = stats ? stats.total_heures_decimal : 0

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
              <span className="work-stat-value">{totalHeures}</span>
              <span className="work-stat-sub">sur {TTS_SEUIL_2}h objectif TTS qualité</span>
            </div>
            <div className="work-stat-card">
              <span className="work-stat-label">Fichiers total</span>
              <span className="work-stat-value">{stats?.total_fichiers ?? 0}</span>
              <span className="work-stat-sub">enregistrements</span>
            </div>
            <div className="work-stat-card">
              <span className="work-stat-label">Transcrits</span>
              <span className="work-stat-value">{stats?.total_transcrits ?? 0}</span>
              <span className="work-stat-sub">fichiers validés</span>
            </div>
            <div className="work-stat-card">
              <span className="work-stat-label">Non transcrits</span>
              <span className="work-stat-value">{stats?.total_non_transcrits ?? 0}</span>
              <span className="work-stat-sub">à traiter</span>
            </div>
          </div>

          {/* ── Barre progression TTS ── */}
          <div className="work-tts-bar">
            <div className="work-tts-bar-header">
              <span>Progression vers le TTS corse</span>
              <span className="work-tts-hint">{totalHeures} / {TTS_SEUIL_2}h</span>
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
                <div className={`work-tts-milestone-dot${totalDecimal >= TTS_SEUIL_1 ? ' reached' : ''}`} />
                <span className={totalDecimal >= TTS_SEUIL_1 ? 'reached' : ''}>50h — TTS de base</span>
              </div>
              <div className="work-tts-milestone">
                <div className={`work-tts-milestone-dot${totalDecimal >= TTS_SEUIL_2 ? ' reached' : ''}`} />
                <span className={totalDecimal >= TTS_SEUIL_2 ? 'reached' : ''}>200h — TTS qualité</span>
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
              onChange={e => handleSearch(e.target.value)}
            />
            <select className="work-filter-select" value={filtreRegion} onChange={e => handleRegion(e.target.value)}>
              {regions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <select className="work-filter-select" value={filtreStatut} onChange={e => handleStatut(e.target.value)}>
              {statuts.map(s => (
                <option key={s} value={s}>
                  {s === '' ? 'Tous statuts' : labelStatut[s as Statut]}
                </option>
              ))}
            </select>
          </div>

          {/* ── Table ── */}
          <div className="work-table-wrap">
            <table className="work-table">
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', verticalAlign: 'top' }}>Titre / Description</th>
                  <th style={{ textAlign: 'left', verticalAlign: 'top' }}>Région</th>
                  <th style={{ textAlign: 'left', verticalAlign: 'top' }}>Durée</th>
                  <th style={{ textAlign: 'left', verticalAlign: 'top' }}>Date</th>
                  <th style={{ textAlign: 'left', verticalAlign: 'top' }}>Statut</th>
                  <th style={{ textAlign: 'left', verticalAlign: 'top' }}>Témoin</th>
                  <th style={{ textAlign: 'left', verticalAlign: 'top' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-lighter)' }}>
                      Chargement…
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-lighter)' }}>
                      Aucun enregistrement trouvé.
                    </td>
                  </tr>
                ) : data.map(rec => (
                  <tr key={rec.id}>
                    <td style={{ textAlign: 'left', verticalAlign: 'top' }}>
                      <div className="work-table-title">
                        {(() => {
                          try {
                            const q = JSON.parse(rec.titre)
                            const theme = q.find((f: any) => f.champ === 'themes')
                            return theme?.valeur || '—'
                          } catch { return rec.titre || '—' }
                        })()}
                      </div>
                      <div className="work-table-desc">
                        {(() => {
                          try {
                            const q = JSON.parse(rec.titre)
                            const champs = [
                              { key: 'accompagnant',    label: 'Accompagnant' },
                              { key: 'lieu',            label: 'Lieu'         },
                              { key: 'periode_evoquee', label: 'Période'      },
                              { key: 'themes',          label: 'Thème'        },
                              { key: 'sujet_du_jour',   label: 'Sujet'        },
                            ]
                            return (
                              <ul style={{ margin: 0, paddingLeft: '1rem', listStyle: 'disc' }}>
                                {champs.map(({ key, label }) => {
                                  const item = q.find((f: any) => f.champ === key)
                                  if (!item?.valeur) return null
                                  return (
                                    <li key={key} style={{ fontSize: '0.78rem', color: 'var(--text-lighter)' }}>
                                      <span style={{ color: 'var(--text-light)', fontWeight: 500 }}>{label} : </span>
                                      {item.valeur}
                                    </li>
                                  )
                                })}
                              </ul>
                            )
                          } catch { return rec.description || '' }
                        })()}
                      </div>
                    </td>
                    <td style={{ textAlign: 'left', verticalAlign: 'top' }}>{rec.region ?? ''}</td>
                    <td style={{ textAlign: 'left', verticalAlign: 'top' }}>{rec.duree}</td>
                    <td style={{ textAlign: 'left', verticalAlign: 'top' }}>{rec.date}</td>
                    <td style={{ textAlign: 'left', verticalAlign: 'top' }}>
                      <span className={`work-status ${rec.statut}`}>
                        {labelStatut[rec.statut]}
                      </span>
                    </td>
                    <td style={{ textAlign: 'left', verticalAlign: 'top' }}>{rec.temoin}</td>
                    <td style={{ textAlign: 'left', verticalAlign: 'top' }}>
                      <div className="work-row-actions">
                        <button
                          className="work-row-btn"
                          onClick={() => handleTranscrire(rec)}
                          disabled={!rec.description}
                        >
                          🎙️ Transcrire
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
                value={editing.region ?? ''}
                onChange={e => setEditing({ ...editing, region: e.target.value })}
              />
            </div>

            <div className="work-modal-field">
              <label className="work-modal-label">Prénom du témoin</label>
              <input
                className="work-modal-input"
                value={editing.prenom_temoin}
                onChange={e => setEditing({ ...editing, prenom_temoin: e.target.value, temoin: `${e.target.value} ${editing.nom_temoin}` })}
              />
            </div>

            <div className="work-modal-field">
              <label className="work-modal-label">Nom du témoin</label>
              <input
                className="work-modal-input"
                value={editing.nom_temoin}
                onChange={e => setEditing({ ...editing, nom_temoin: e.target.value, temoin: `${editing.prenom_temoin} ${e.target.value}` })}
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

