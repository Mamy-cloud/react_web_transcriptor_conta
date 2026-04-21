import { useNavigate, Link } from 'react-router-dom'
import '../style/sign_up.css'

export default function SignUp() {
  const navigate = useNavigate()

  return (
    <div className="signup-page">
      <div className="signup-card">

        {/* ── Header ── */}
        <div className="signup-header">
          <div className="signup-logo">C</div>
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
                className="signup-input"
                type="text"
                placeholder="Dupont"
              />
            </div>
            <div className="signup-field">
              <label className="signup-label">Prénom</label>
              <input
                className="signup-input"
                type="text"
                placeholder="Jean"
              />
            </div>
          </div>

          {/* Adresse mail */}
          <div className="signup-field">
            <label className="signup-label">Adresse mail</label>
            <input
              className="signup-input"
              type="email"
              placeholder="jean.dupont@email.com"
            />
          </div>

          {/* Nom d'utilisateur */}
          <div className="signup-field">
            <label className="signup-label">Nom d'utilisateur</label>
            <input
              className="signup-input"
              type="text"
              placeholder="jean_dupont"
            />
          </div>

          {/* Date de naissance */}
          <div className="signup-field">
            <label className="signup-label">Date de naissance</label>
            <input
              className="signup-input"
              type="date"
            />
          </div>

          <button
            className="btn btn-primary signup-btn"
            onClick={() => navigate('/travail')}
          >
            Se souscrire
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
