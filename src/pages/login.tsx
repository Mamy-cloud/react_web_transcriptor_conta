import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import '../style/login.css'
import logoConta2 from '../assets/img/accueil/app_icon.png'
import { loginUser, validateLogin, type LoginPayload, type LoginFieldError } from '../api_url/login_api_web'
import { useDisplayPassword, PasswordEyeBtn } from '../components/display_password'

export default function Login() {
  const navigate = useNavigate()

  const [form, setForm] = useState<LoginPayload>({
    identifiant:  '',
    mot_de_passe: '',
  })

  const [errors,   setErrors]   = useState<LoginFieldError[]>([])
  const [apiError, setApiError] = useState<string | null>(null)
  const [loading,  setLoading]  = useState(false)

  const mdp = useDisplayPassword()

  /* ── Helpers ── */
  const set = (field: keyof LoginPayload) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm(prev => ({ ...prev, [field]: e.target.value }))
      setErrors(prev => prev.filter(err => err.field !== field))
      setApiError(null)
    }

  const fieldError = (field: keyof LoginPayload) =>
    errors.find(e => e.field === field)?.message

  /* ── Submit ── */
  const handleSubmit = async () => {
    const validationErrors = validateLogin(form)
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    setApiError(null)

    try {
      await loginUser(form)
      navigate('/travail')
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">

        {/* ── Header ── */}
        <div className="login-header">
          <img src={logoConta2} alt="Logo Conta 2" className="accueil-logo-icon" />
          <div>
            <h1>Connexion</h1>
            <p>Accédez à votre espace interviewer</p>
          </div>
        </div>

        {/* ── Form ── */}
        <div className="login-form">

          <div className="login-field">
            <label className="login-label">Identifiant de l'interviewer</label>
            <input
              className={`login-input${fieldError('identifiant') ? ' input-error' : ''}`}
              type="text"
              placeholder="Entrez votre identifiant"
              value={form.identifiant}
              onChange={set('identifiant')}
            />
            {fieldError('identifiant') && (
              <span className="login-error">{fieldError('identifiant')}</span>
            )}
          </div>

          <div className="login-field">
            <label className="login-label">Mot de passe</label>
            <div className="password-field-wrap">
              <input
                className={`login-input${fieldError('mot_de_passe') ? ' input-error' : ''}`}
                type={mdp.inputType}
                placeholder="Entrez votre mot de passe"
                value={form.mot_de_passe}
                onChange={set('mot_de_passe')}
              />
              <PasswordEyeBtn visible={mdp.visible} onToggle={mdp.toggle} />
            </div>
            {fieldError('mot_de_passe') && (
              <span className="login-error">{fieldError('mot_de_passe')}</span>
            )}
          </div>

          {apiError && <div className="login-api-error">{apiError}</div>}

          <button
            className="btn btn-primary login-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Connexion en cours…' : 'Se connecter'}
          </button>

        </div>

        {/* ── Footer ── */}
        <p className="login-footer">
          Pas encore de compte ?{' '}
          <Link to="/inscription">Créer un compte</Link>
        </p>

      </div>
    </div>
  )
}
