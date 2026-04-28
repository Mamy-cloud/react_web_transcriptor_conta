/* ================================================
   list_of_data_collected_display.tsx
   Affiche toutes les données collectées — vue Admin
   ================================================ */

import { useState, useEffect } from 'react'
import { API, apiFetch } from '../api_url/api_config'

type Statut = 'transcrit' | 'non-transcrit'

interface Enregistrement {
  id:           string
  titre:        string
  url_audio:    string
  description:  string
  region:       string | null
  duree:        string
  date:         string
  statut:       Statut
  temoin:       string
  nom_temoin:   string
  prenom_temoin: string
  interviewer:  string
}

const labelStatut: Record<Statut, string> = {
  'transcrit':     'Transcrit',
  'non-transcrit': 'Non transcrit',
}

export default function ListOfDataCollectedDisplay() {
  const [data,          setData]          = useState<Enregistrement[]>([])
  const [loading,       setLoading]       = useState(true)
  const [search,        setSearch]        = useState('')
  const [filtreRegion,  setFiltreRegion]  = useState('Toutes')
  const [filtreStatut,  setFiltreStatut]  = useState('')

  /* ── Chargement ── */
  const fetchData = async (q = search, r = filtreRegion, s = filtreStatut) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ query: q, region: r, statut: s })
      const res    = await apiFetch(`${API.ADMIN_DATA_COLLECTED}?${params}`)
      const json   = await res.json()
      if (json.success) setData(json.tableau)
    } catch (e) {
      console.error('Erreur chargement données admin :', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  /* ── Filtres ── */
  const handleSearch = (val: string) => { setSearch(val);       fetchData(val, filtreRegion, filtreStatut) }
  const handleRegion = (val: string) => { setFiltreRegion(val); fetchData(search, val, filtreStatut) }
  const handleStatut = (val: string) => { setFiltreStatut(val); fetchData(search, filtreRegion, val) }

  const regions = ['Toutes', ...Array.from(new Set(data.map(r => r.region).filter((r): r is string => r !== null)))]
  const statuts = ['', 'transcrit', 'non-transcrit']

  return (
    <div>

      {/* ── Compteur ── */}
      <div style={{ marginBottom: 'var(--space-4)', fontSize: '0.875rem', color: 'var(--text-lighter)' }}>
        {data.length} enregistrement{data.length > 1 ? 's' : ''}
      </div>

      {/* ── Filtres ── */}
      <div className="work-filters" style={{ marginBottom: 'var(--space-5)' }}>
        <input
          className="work-search"
          type="text"
          placeholder="Rechercher par témoin, interviewer, sujet…"
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

      {/* ── Tableau ── */}
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
              <th style={{ textAlign: 'left', verticalAlign: 'top' }}>Interviewer</th>
              <th style={{ textAlign: 'left', verticalAlign: 'top' }}>Audio</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-lighter)' }}>
                  Chargement…
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-lighter)' }}>
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
                  <span style={{
                    fontFamily:  'var(--font-mono)',
                    fontSize:    '0.8rem',
                    color:       'var(--brand-default)',
                    fontWeight:  500,
                  }}>
                    {rec.interviewer}
                  </span>
                </td>
                <td style={{ textAlign: 'left', verticalAlign: 'top' }}>
                  {rec.url_audio ? (
                    <a
                      href={rec.url_audio}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Écouter l'audio"
                      style={{
                        display:        'inline-flex',
                        alignItems:     'center',
                        justifyContent: 'center',
                        width:          '32px',
                        height:         '32px',
                        borderRadius:   'var(--radius-full)',
                        background:     'rgba(62,207,142,0.1)',
                        border:         '1px solid rgba(62,207,142,0.25)',
                        color:          'var(--brand-default)',
                        textDecoration: 'none',
                        transition:     'background var(--transition-fast)',
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5,3 19,12 5,21"/>
                      </svg>
                    </a>
                  ) : (
                    <span style={{ color: 'var(--text-lighter)', fontSize: '0.8rem' }}>—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}
