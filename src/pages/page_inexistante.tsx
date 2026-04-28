/* ================================================
   page_inexistante.tsx — Route inconnue
   ================================================ */

import { Link } from 'react-router-dom'
import '../style/page404.css'

export default function PageInexistante() {
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
        <div className="p404-icon">🗺️</div>

        {/* ── Code ── */}
        <div className="p404-code">404</div>

        {/* ── Message principal ── */}
        <h1 className="p404-title">Page inexistante</h1>
        <p className="p404-desc">
          L'adresse que vous avez saisie ne correspond à aucune page.
          <br />
          Vérifiez l'URL ou revenez à l'accueil.
        </p>

        {/* ── Actions ── */}
        <div className="p404-actions">
          <Link to="/" className="p404-btn p404-btn-primary">
            Retour à l'accueil
          </Link>
        </div>

      </div>
    </div>
  )
}
