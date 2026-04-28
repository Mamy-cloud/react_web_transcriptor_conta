import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import '../style/sign_up.css'
import { signUp, validateSignUp, type SignUpPayload, type SignUpError } from '../api_url/sign_up_api'
import { useDisplayPassword, PasswordEyeBtn } from '../components/display_password'
import logoConta2 from '../assets/img/accueil/app_icon.png'


export default function SignUp() {
  const navigate = useNavigate()

  const [form, setForm] = useState<SignUpPayload>({
    nom:             '',
    prenom:          '',
    email:           '',
    nom_utilisateur: '',
    mot_de_passe:    '',
    date_naissance:  '',
  })

  const [confirmMdp,   setConfirmMdp]   = useState('')
  const [confirmError, setConfirmError] = useState<string | null>(null)
  const [errors,       setErrors]       = useState<SignUpError[]>([])
  const [apiError,     setApiError]     = useState<string | null>(null)
  const [loading,      setLoading]      = useState(false)

  const mdp        = useDisplayPassword()   // champ mot de passe
  const mdpConfirm = useDisplayPassword()   // champ confirmation

  /* ── Helpers ── */
  const set = (field: keyof SignUpPayload) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm(prev => ({ ...prev, [field]: e.target.value }))
      setErrors(prev => prev.filter(err => err.field !== field))
      setApiError(null)
    }

  const fieldError = (field: keyof SignUpPayload) =>
    errors.find(e => e.field === field)?.message

  /* ── Submit ── */
  const handleSubmit = async () => {
    if (form.mot_de_passe !== confirmMdp) {
      setConfirmError('Les mots de passe ne correspondent pas.')
      return
    }
    setConfirmError(null)

    const validationErrors = validateSignUp(form)
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    setApiError(null)

    try {
      await signUp(form)
      navigate('/travail')
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="signup-page">
      <div className="signup-card">

        {/* ── Header ── */}
        <div className="signup-header">
            <img src={logoConta2} alt="Logo Conta 2" className="accueil-logo-icon" />
          <div>
            <h1>Créer un compte</h1>
            <p>Rejoignez la plateforme Conta</p>
          </div>
        </div>

        {/* ── Form ── */}
        <div className="signup-form">

          {/* Nom & Prénom */}
          <div className="signup-row">
            <div className="signup-field">
              <label className="signup-label">Nom</label>
              <input
                className={`signup-input${fieldError('nom') ? ' input-error' : ''}`}
                type="text"
                placeholder="Dupont"
                value={form.nom}
                onChange={set('nom')}
              />
              {fieldError('nom') && <span className="signup-error">{fieldError('nom')}</span>}
            </div>
            <div className="signup-field">
              <label className="signup-label">Prénom</label>
              <input
                className={`signup-input${fieldError('prenom') ? ' input-error' : ''}`}
                type="text"
                placeholder="Jean"
                value={form.prenom}
                onChange={set('prenom')}
              />
              {fieldError('prenom') && <span className="signup-error">{fieldError('prenom')}</span>}
            </div>
          </div>

          {/* Adresse mail */}
          <div className="signup-field">
            <label className="signup-label">Adresse mail</label>
            <input
              className={`signup-input${fieldError('email') ? ' input-error' : ''}`}
              type="email"
              placeholder="jean.dupont@email.com"
              value={form.email}
              onChange={set('email')}
            />
            {fieldError('email') && <span className="signup-error">{fieldError('email')}</span>}
          </div>

          {/* Nom d'utilisateur */}
          <div className="signup-field">
            <label className="signup-label">Nom d'utilisateur</label>
            <input
              className={`signup-input${fieldError('nom_utilisateur') ? ' input-error' : ''}`}
              type="text"
              placeholder="jean_dupont"
              value={form.nom_utilisateur}
              onChange={set('nom_utilisateur')}
            />
            {fieldError('nom_utilisateur') && <span className="signup-error">{fieldError('nom_utilisateur')}</span>}
          </div>

          {/* Mot de passe */}
          <div className="signup-field">
            <label className="signup-label">Mot de passe</label>
            <div className="password-field-wrap">
              <input
                className={`signup-input${fieldError('mot_de_passe') ? ' input-error' : ''}`}
                type={mdp.inputType}
                placeholder="••••••••"
                value={form.mot_de_passe}
                onChange={set('mot_de_passe')}
              />
              <PasswordEyeBtn visible={mdp.visible} onToggle={mdp.toggle} />
            </div>
            {fieldError('mot_de_passe') && <span className="signup-error">{fieldError('mot_de_passe')}</span>}
          </div>

          {/* Confirmer le mot de passe */}
          <div className="signup-field">
            <label className="signup-label">Confirmer le mot de passe</label>
            <div className="password-field-wrap">
              <input
                className={`signup-input${confirmError ? ' input-error' : ''}`}
                type={mdpConfirm.inputType}
                placeholder="••••••••"
                value={confirmMdp}
                onChange={e => {
                  setConfirmMdp(e.target.value)
                  setConfirmError(null)
                }}
              />
              <PasswordEyeBtn visible={mdpConfirm.visible} onToggle={mdpConfirm.toggle} />
            </div>
            {confirmError && <span className="signup-error">{confirmError}</span>}
          </div>

          {/* Date de naissance */}
          <div className="signup-field">
            <label className="signup-label">Date de naissance</label>
            <input
              className={`signup-input${fieldError('date_naissance') ? ' input-error' : ''}`}
              type="date"
              value={form.date_naissance}
              onChange={set('date_naissance')}
            />
            {fieldError('date_naissance') && <span className="signup-error">{fieldError('date_naissance')}</span>}
          </div>

          {apiError && <div className="signup-api-error">{apiError}</div>}

          <button
            className="btn btn-primary signup-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Inscription en cours…' : 'Se souscrire'}
          </button>

        </div>

        {/* ── Footer ── */}
        <p className="signup-footer">
          Déjà un compte ?{' '}
          <Link to="/connexion">Se connecter</Link>
        </p>

      </div>
    </div>
  )
}
