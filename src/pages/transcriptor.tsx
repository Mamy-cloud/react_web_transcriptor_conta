import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from '../nav/Navbar'
import '../style/transcriptor.css'
import { API, apiFetch } from '../api_url/api_config'

/* ── Types ── */
type SegStatut = 'valide' | 'en-cours' | 'en-attente'

interface Transcription {
  id:           number
  transcripteur: string
  texte_co:     string
  texte_fr:     string
  valide:       boolean
}

interface Segment {
  id:             number
  debut:          string
  fin:            string
  statut:         SegStatut
  transcriptions: Transcription[]
}

interface FichierAudio {
  id:       string
  nom:      string
  temoin:   string
  duree:    string
  url_audio: string
  segments: Segment[]
}

const labelStatut: Record<SegStatut, string> = {
  'valide':     'Validé',
  'en-cours':   'En cours',
  'en-attente': 'En attente',
}

const makeTranscriptions = (): Transcription[] => [
  { id: 1, transcripteur: 'Transcripteur 1', texte_co: '', texte_fr: '', valide: false },
  { id: 2, transcripteur: 'Transcripteur 2', texte_co: '', texte_fr: '', valide: false },
  { id: 3, transcripteur: 'Transcripteur 3', texte_co: '', texte_fr: '', valide: false },
]

export default function Transcriptor() {
  const location  = useLocation()
  const state     = (location.state as any) ?? {}
  const collectId = state.collect_id ?? null

  const [fichiers,   setFichiers]   = useState<FichierAudio[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [playing,    setPlaying]    = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration,    setDuration]    = useState(0)
  const [loading,    setLoading]    = useState(true)
  const [sttLoading, setSttLoading] = useState(false)
  const [ttsLoading, setTtsLoading] = useState<number | null>(null)
  const [finalising, setFinalising] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  /* ── Chargement depuis location.state si redirigé depuis view_work ── */
  useEffect(() => {
    if (!collectId) {
      setLoading(false)
      return
    }
    const fichier: FichierAudio = {
      id:        state.collect_id,
      nom:       state.titre  || '—',
      temoin:    state.temoin || '—',
      duree:     state.duree  || '—',
      url_audio: state.url_audio,
      segments:  [],
    }
    setFichiers([fichier])
    setSelectedId(state.collect_id)
    setLoading(false)
  }, [collectId])

  const fichier = fichiers.find(f => f.id === selectedId) ?? null

  /* ── Extrait le titre depuis le JSON questionnaire ── */
  const getTitre = (raw: string): string => {
    try {
      const q = JSON.parse(raw)
      if (Array.isArray(q)) {
        const sujet = q.find((f: any) => f.champ === 'sujet_du_jour')
        return sujet?.valeur || '—'
      }
    } catch { /* texte brut */ }
    return raw || '—'
  }

  /* ── Chargement des fichiers audio (seulement si pas de collectId) ── */
  useEffect(() => {
    if (collectId) return   // ← ne pas écraser les données IndexedDB
    apiFetch(API.INFO_TEMOIN)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          const fichiersMapped: FichierAudio[] = data.tableau
            .filter((r: any) => r.url_audio)
            .map((r: any) => ({
              id:        r.id,
              nom:       r.titre   || '—',
              temoin:    r.temoin  || '—',
              duree:     r.duree   || '—',
              url_audio: r.description,
              segments:  [],
            }))
          setFichiers(fichiersMapped)
          if (fichiersMapped.length > 0) setSelectedId(fichiersMapped[0].id)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [collectId])

  /* ── Contrôles audio ── */
  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) { audio.pause() } else { audio.play() }
    setPlaying(!playing)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = Number(e.target.value)
    setCurrentTime(Number(e.target.value))
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
  }

  /* ── STT — Transcrire l'audio en segments ── */
  const handleSTT = async () => {
    if (!fichier?.url_audio) return
    setSttLoading(true)
    try {
      const res  = await apiFetch(API.STT_SEGMENTS, {
        method: 'POST',
        body:   JSON.stringify({
          url_audio:  fichier.url_audio,
          collect_id: fichier.id,
        }),
      })
      const data = await res.json()
      if (data.success) {
        const segments: Segment[] = data.segments.map((s: any, i: number) => {
          let texte = s.segmentation_word || s.texte || ''
          try {
            const parsed = JSON.parse(texte)
            if (Array.isArray(parsed)) texte = parsed.map((item: any) => item.valeur || '').filter(Boolean).join(' ')
            else if (typeof parsed === 'object') texte = parsed.text || parsed.texte || texte
          } catch { /* texte brut */ }

          return {
            id:             i + 1,
            debut:          s.debut || '00:00',
            fin:            s.fin   || '00:00',
            statut:         (data.validation ? 'valide' : 'en-attente') as SegStatut,
            transcriptions: makeTranscriptions().map(t => ({ ...t, texte_co: texte })),
          }
        })
        setFichiers(prev => prev.map(f =>
          f.id === selectedId ? { ...f, segments } : f
        ))
        if (data.from_cache) console.log('[STT] Chargé depuis DB ✅')
      }
    } catch (e) {
      console.error('Erreur STT :', e)
    } finally {
      setSttLoading(false)
    }
  }

  /* ── TTS — Synthétiser un segment ── */
  const handleTTS = async (segId: number, texte: string) => {
    setTtsLoading(segId)
    try {
      const res  = await apiFetch(API.TTS, {
        method: 'POST',
        body:   JSON.stringify({ texte }),
      })
      const data = await res.json()
      if (data.success) {
        console.log('[TTS] Audio généré :', data.url_audio)
      }
    } catch (e) {
      console.error('Erreur TTS :', e)
    } finally {
      setTtsLoading(null)
    }
  }

  /* ── Mise à jour transcription ── */
  const updateTexte = (segId: number, tId: number, champ: 'texte_co' | 'texte_fr', val: string) => {
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

  /* ── Valider une transcription ── */
  const validateTrans = async (segId: number, tId: number) => {
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

    // ── Vérifie si tous les segments sont validés ────
    const updatedFichier = fichiers.find(f => f.id === selectedId)
    if (!updatedFichier) return

    const allValidated = updatedFichier.segments.every(s => {
      const seg = s.id === segId
        ? { ...s, transcriptions: s.transcriptions.map(t => t.id === tId ? { ...t, valide: true } : t) }
        : s
      return seg.transcriptions.filter(t => t.valide).length >= 3
    })

    if (allValidated && fichier?.id) {
      try {
        await apiFetch(API.VALIDATE_TRANS, {
          method: 'POST',
          body:   JSON.stringify({ collect_id: fichier.id }),
        })
        console.log('[VALIDATION] ✅ Transcription validée en DB')
      } catch (e) {
        console.error('Erreur validation :', e)
      }
    }
  }

  const totalValides  = fichier?.segments.filter(s => s.statut === 'valide').length ?? 0
  const totalSegments = fichier?.segments.length ?? 0

  /* ── Finaliser — envoie les segments en DB ── */
  const handleFinaliser = async () => {
    if (!fichier?.id || fichier.segments.length === 0) return
    setFinalising(true)
    try {
      const segments = fichier.segments.map(s => ({
        debut:  s.debut,
        fin:    s.fin,
        texte:  s.transcriptions[0]?.texte_co || '',
      }))
      const res  = await apiFetch(API.STT_SEGMENTS, {
        method: 'POST',
        body:   JSON.stringify({
          url_audio:  fichier.url_audio,
          collect_id: fichier.id,
          segments,
        }),
      })
      const data = await res.json()
      if (data.success) {
        console.log('[FINALISER] ✅ Segments sauvegardés en DB')
      }
    } catch (e) {
      console.error('Erreur finaliser :', e)
    } finally {
      setFinalising(false)
    }
  }

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
              value={selectedId ?? ''}
              onChange={e => setSelectedId(e.target.value)}
            >
              <option value="" disabled>Chemin de l'audio…</option>
              {fichiers.map(f => (
                <option key={f.id} value={f.id}>
                  {f.url_audio}
                </option>
              ))}
            </select>
          </div>

          {/* ── État vide ── */}
          {loading ? (
            <div className="trans-empty">
              <div className="trans-empty-icon">⏳</div>
              <p>Chargement des fichiers…</p>
            </div>
          ) : !fichier ? (
            <div className="trans-empty">
              <div className="trans-empty-icon">🎙️</div>
              <p>Aucun fichier audio disponible.</p>
            </div>
          ) : (
            <>
              {/* ── Lecteur audio fixe à droite ── */}
              <div className="trans-player">

                {/* Élément audio caché */}
                <audio
                  ref={audioRef}
                  src={fichier.url_audio}
                  onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime ?? 0)}
                  onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
                  onEnded={() => setPlaying(false)}
                />

                {/* ── Infos ── */}
                <div className="trans-player-info">
                  <div className="trans-player-title">{getTitre(fichier.nom)}</div>
                  <div className="trans-player-meta">{fichier.temoin}</div>
                </div>

                {/* ── Contrôles ── */}
                <div className="trans-player-controls">

                  {/* Barre de progression */}
                  <input
                    type="range"
                    min={0}
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    style={{ width: '100%', accentColor: 'var(--brand-default)', cursor: 'pointer' }}
                  />
                  <span className="trans-timeline-time">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>

                  {/* Boutons play/pause + reculer/avancer */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-3)' }}>
                    <button
                      className="trans-skip-btn"
                      onClick={() => {
                        if (audioRef.current) audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10)
                      }}
                      title="Reculer 10s"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="1 4 1 10 7 10"/>
                        <path d="M3.51 15a9 9 0 1 0 .49-3.54"/>
                        <text x="8" y="14" fontSize="6" fill="currentColor" stroke="none" fontWeight="700">10</text>
                      </svg>
                    </button>

                    <button className="trans-play-btn" onClick={togglePlay}>
                      {playing ? '⏸' : '▶'}
                    </button>

                    <button
                      className="trans-skip-btn"
                      onClick={() => {
                        if (audioRef.current) audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10)
                      }}
                      title="Avancer 10s"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="23 4 23 10 17 10"/>
                        <path d="M20.49 15a9 9 0 1 1-.49-3.54"/>
                        <text x="8" y="14" fontSize="6" fill="currentColor" stroke="none" fontWeight="700">10</text>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* ── Bouton STT ── */}
                <button
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%' }}
                  onClick={handleSTT}
                  disabled={sttLoading}
                >
                  {sttLoading ? '⏳ Transcription…' : '🎙️ Transcrire (STT)'}
                </button>
              </div>

              {/* ── Segments ── */}
              {fichier.segments.length === 0 ? (
                <div className="trans-empty" style={{ marginTop: 'var(--space-6)' }}>
                  <div className="trans-empty-icon">📝</div>
                  <p>Cliquez sur "Transcrire" pour générer les segments.</p>
                </div>
              ) : (
                <>
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

                          <div className="trans-segment-head">
                            <span className="trans-segment-time">⏱ {seg.debut} → {seg.fin}</span>
                            <span>Segment {seg.id}</span>
                            <span className={`trans-segment-status ${seg.statut}`}>
                              {labelStatut[seg.statut]}
                            </span>
                            <button
                              className="btn btn-default btn-sm"
                              onClick={() => handleTTS(seg.id, seg.transcriptions[0]?.texte_co || '')}
                              disabled={ttsLoading === seg.id || !seg.transcriptions[0]?.texte_co}
                            >
                              {ttsLoading === seg.id ? '⏳' : '🔊 TTS'}
                            </button>
                          </div>

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
                                {!t.valide ? (
                                  <button
                                    className="btn btn-default trans-col-validate"
                                    onClick={() => validateTrans(seg.id, t.id)}
                                  >
                                    ✓ Valider
                                  </button>
                                ) : (
                                  <span style={{ fontSize: '0.8rem', color: 'var(--brand-default)', alignSelf: 'flex-end' }}>
                                    ✓ Validé
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>

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

                  {/* ── Bouton Finaliser ── */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-6)' }}>
                    <button
                      className="btn btn-primary"
                      onClick={handleFinaliser}
                      disabled={finalising || fichier.segments.length === 0}
                    >
                      {finalising ? '⏳ Sauvegarde…' : '✅ Finaliser'}
                    </button>
                  </div>
                </>
              )}
            </>
          )}

        </div>
      </div>
    </>
  )
}
