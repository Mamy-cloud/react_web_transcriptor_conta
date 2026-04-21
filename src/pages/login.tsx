import { useNavigate, Link } from 'react-router-dom'
import '../style/login.css'

export default function Login() {
  const navigate = useNavigate()

  return (
    <div className="login-page">
      <div className="login-card">

        {/* ── Header ── */}
        <div className="login-header">
          <div className="login-logo">C</div>
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
              className="login-input"
              type="text"
              placeholder="Entrez votre identifiant"
            />
          </div>

          <div className="login-field">
            <label className="login-label">Mot de passe</label>
            <input
              className="login-input"
              type="password"
              placeholder="Entrez votre mot de passe"
            />
          </div>

          <button
            className="btn btn-primary login-btn"
            onClick={() => navigate('/travail')}
          >
            Se connecter
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
