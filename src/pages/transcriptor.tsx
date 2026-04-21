import { useState } from 'react'
import Navbar from '../nav/Navbar'
import '../style/transcriptor.css'

/* ── Types ── */
type SegStatut = 'valide' | 'en-cours' | 'en-attente'

interface Transcription {
  id: number
  transcripteur: string
  texte_co: string   // corse
  texte_fr: string   // français
  valide: boolean
}

interface Segment {
  id: number
  debut: string
  fin: string
  statut: SegStatut
  transcriptions: Transcription[]
}

interface FichierAudio {
  id: number
  nom: string
  region: string
  duree: string
  segments: Segment[]
}

/* ── Données fictives ── */
const FICHIERS: FichierAudio[] = [
  {
    id: 1,
    nom: 'Témoignage – Ajaccio 1',
    region: 'Corse-du-Sud',
    duree: '2h 10min',
    segments: [
      {
        id: 1,
        debut: '00:00',
        fin: '02:15',
        statut: 'valide',
        transcriptions: [
          { id: 1, transcripteur: 'Marie C.', texte_co: 'Eiu sò natu in Aiacciu...', texte_fr: 'Je suis né à Ajaccio...', valide: true },
          { id: 2, transcripteur: 'Petru F.', texte_co: 'Eiu sò natu in Aiacciu...', texte_fr: 'Je suis né à Ajaccio...', valide: true },
          { id: 3, transcripteur: 'Anne P.',  texte_co: 'Eiu sò natu in Aiacciu...', texte_fr: 'Je suis né à Ajaccio...', valide: true },
        ],
      },
      {
        id: 2,
        debut: '02:15',
        fin: '05:40',
        statut: 'en-cours',
        transcriptions: [
          { id: 1, transcripteur: 'Marie C.', texte_co: 'U paese era bellu...', texte_fr: 'Le village était beau...', valide: true },
          { id: 2, transcripteur: 'Petru F.', texte_co: '',                      texte_fr: '',                         valide: false },
          { id: 3, transcripteur: 'Anne P.',  texte_co: '',                      texte_fr: '',                         valide: false },
        ],
      },
      {
        id: 3,
        debut: '05:40',
        fin: '08:20',
        statut: 'en-attente',
        transcriptions: [
          { id: 1, transcripteur: 'Marie C.', texte_co: '', texte_fr: '', valide: false },
          { id: 2, transcripteur: 'Petru F.', texte_co: '', texte_fr: '', valide: false },
          { id: 3, transcripteur: 'Anne P.',  texte_co: '', texte_fr: '', valide: false },
        ],
      },
    ],
  },
  {
    id: 2,
    nom: 'Chants polyphoniques',
    region: 'Haute-Corse',
    duree: '0h 45min',
    segments: [
      {
        id: 1,
        debut: '00:00',
        fin: '03:10',
        statut: 'en-attente',
        transcriptions: [
          { id: 1, transcripteur: 'Marie C.', texte_co: '', texte_fr: '', valide: false },
          { id: 2, transcripteur: 'Petru F.', texte_co: '', texte_fr: '', valide: false },
          { id: 3, transcripteur: 'Anne P.',  texte_co: '', texte_fr: '', valide: false },
        ],
      },
    ],
  },
]

const labelStatut: Record<SegStatut, string> = {
  'valide':      'Validé',
  'en-cours':    'En cours',
  'en-attente':  'En attente',
}

export default function Transcriptor() {
  const [fichiers, setFichiers] = useState<FichierAudio[]>(FICHIERS)
  const [selectedId, setSelectedId] = useState<number>(FICHIERS[0].id)
  const [playing, setPlaying] = useState(false)

  const fichier = fichiers.find(f => f.id === selectedId)!

  /* Mise à jour d'une transcription */
  const updateTexte = (
    segId: number, tId: number,
    champ: 'texte_co' | 'texte_fr',
    val: string
  ) => {
    setFichiers(prev => prev.map(f => {
      if (f.id !== selectedId) return f
      return {
        ...f,
        segments: f.segments.map(s => {
          if (s.id !== segId) return s
          return {
            ...s,
            transcriptions: s.transcriptions.map(t =>
              t.id === tId ? { ...t, [champ]: val } : t
            ),
          }
        }),
      }
    }))
  }

  /* Valider une transcription */
  const validateTrans = (segId: number, tId: number) => {
    setFichiers(prev => prev.map(f => {
      if (f.id !== selectedId) return f
      return {
        ...f,
        segments: f.segments.map(s => {
          if (s.id !== segId) return s
          const updated = s.transcriptions.map(t =>
            t.id === tId ? { ...t, valide: true } : t
          )
          const validCount = updated.filter(t => t.valide).length
          const statut: SegStatut = validCount >= 3 ? 'valide'
                                  : validCount >= 1 ? 'en-cours'
                                  : 'en-attente'
          return { ...s, transcriptions: updated, statut }
        }),
      }
    }))
  }

  const totalValides   = fichier.segments.filter(s => s.statut === 'valide').length
  const totalSegments  = fichier.segments.length

  return (
    <>
      <Navbar />
      <div className="trans-page">
        <div className="trans-inner">

          {/* ── Header ── */}
          <div className="trans-header">
            <h1>Transcription</h1>
            <p>Chaque segment nécessite 3 transcriptions concordantes pour être validé.</p>
          </div>

          {/* ── Sélecteur de fichier ── */}
          <div className="trans-file-bar">
            <select
              className="trans-file-select"
              value={selectedId}
              onChange={e => setSelectedId(Number(e.target.value))}
            >
              {fichiers.map(f => (
                <option key={f.id} value={f.id}>
                  {f.nom} — {f.region} ({f.duree})
                </option>
              ))}
            </select>
          </div>

          {/* ── Lecteur audio (UI seulement) ── */}
          <div className="trans-player">
            <div className="trans-player-info">
              <div className="trans-player-title">{fichier.nom}</div>
              <div className="trans-player-meta">{fichier.region} · {fichier.duree}</div>
            </div>
            <div className="trans-player-controls">
              <button className="trans-play-btn" onClick={() => setPlaying(!playing)}>
                {playing ? '⏸' : '▶'}
              </button>
              <div className="trans-timeline">
                <div className="trans-timeline-bar">
                  <div className="trans-timeline-fill" />
                </div>
                <span className="trans-timeline-time">00:45 / {fichier.duree}</span>
              </div>
            </div>
          </div>

          {/* ── Segments ── */}
          <div className="trans-segments-header">
            <h3>Segments — {totalValides}/{totalSegments} validés</h3>
            <div className="trans-validation-badge">
              <div className="trans-validation-dot ok" />
              <span>3/3 validé</span>
              <div className="trans-validation-dot warn" />
              <span>1-2/3 en cours</span>
              <div className="trans-validation-dot" />
              <span>0/3 en attente</span>
            </div>
          </div>

          <div className="trans-segments">
            {fichier.segments.map(seg => {
              const validCount = seg.transcriptions.filter(t => t.valide).length
              return (
                <div key={seg.id} className={`trans-segment${seg.statut === 'valide' ? ' validated' : ''}`}>
                  {/* Head */}
                  <div className="trans-segment-head">
                    <span className="trans-segment-time">⏱ {seg.debut} → {seg.fin}</span>
                    <span>Segment {seg.id}</span>
                    <span className={`trans-segment-status ${seg.statut}`}>
                      {labelStatut[seg.statut]}
                    </span>
                  </div>

                  {/* 3 colonnes de transcription */}
                  <div className="trans-cols">
                    {seg.transcriptions.map(t => (
                      <div key={t.id} className="trans-col">
                        <div className="trans-col-header">
                          <span className="trans-col-label">Transcripteur {t.id}</span>
                          <span className="trans-col-lang">{t.transcripteur}</span>
                        </div>

                        <textarea
                          className="trans-textarea"
                          placeholder="Transcription en corse…"
                          value={t.texte_co}
                          onChange={e => updateTexte(seg.id, t.id, 'texte_co', e.target.value)}
                        />
                        <textarea
                          className="trans-textarea"
                          placeholder="Traduction en français…"
                          value={t.texte_fr}
                          onChange={e => updateTexte(seg.id, t.id, 'texte_fr', e.target.value)}
                        />

                        {!t.valide && (
                          <button
                            className="btn btn-default trans-col-validate"
                            onClick={() => validateTrans(seg.id, t.id)}
                          >
                            ✓ Valider
                          </button>
                        )}
                        {t.valide && (
                          <span style={{ fontSize: '0.8rem', color: 'var(--brand-default)', alignSelf: 'flex-end' }}>
                            ✓ Validé
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="trans-segment-footer">
                    <span className="trans-agree-count">
                      <span>{validCount}</span>/3 transcriptions validées
                    </span>
                    {validCount >= 3 && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--brand-default)', fontWeight: 500 }}>
                        ✓ Segment validé
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </div>
    </>
  )
}
