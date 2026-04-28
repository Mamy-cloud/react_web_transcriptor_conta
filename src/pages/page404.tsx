/* ================================================
   page404.tsx — Page indisponible / non connecté
   ================================================ */

import { Link } from 'react-router-dom'
import '../style/page404.css'

export default function Page404() {
  return (
    <div className="p404-page">

      {/* ── Fond décoratif ── */}
      <div className="p404-bg">
        <div className="p404-circle p404-circle-1" />
        <div className="p404-circle p404-circle-2" />
        <div className="p404-circle p404-circle-3" />
      </div>

      <div className="p404-card">

        {/* ── Icône ── */}
        <div className="p404-icon">🔒</div>

        {/* ── Code ── */}
        <div className="p404-code">404</div>

        {/* ── Message principal ── */}
        <h1 className="p404-title">Page indisponible</h1>
        <p className="p404-desc">
          Cette page est réservée aux utilisateurs connectés.
          <br />
          Veuillez vous connecter ou créer un compte pour y accéder.
        </p>

        {/* ── Actions ── */}
        <div className="p404-actions">
          <Link to="/connexion" className="p404-btn p404-btn-primary">
            Se connecter
          </Link>
          <Link to="/inscription" className="p404-btn p404-btn-secondary">
            S'inscrire
          </Link>
        </div>

        {/* ── Retour accueil ── */}
        <Link to="/" className="p404-home">
          ← Retour à l'accueil
        </Link>

      </div>
    </div>
  )
}
