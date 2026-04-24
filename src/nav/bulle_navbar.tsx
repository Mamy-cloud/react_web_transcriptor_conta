import { useNavigate } from 'react-router-dom'
import '../style/bulle_navbar.css'

interface BulleNavbarProps {
  onClose: () => void
}

export default function BulleNavbar({ onClose }: BulleNavbarProps) {
  const navigate = useNavigate()

  const handleLogout = () => {
    onClose()
    navigate('/connexion')
  }

  return (
    <>
      {/* Overlay transparent — ferme la bulle au clic extérieur */}
      <div className="bulle-navbar-overlay" onClick={onClose} />

      <div className="bulle-navbar">

        {/* ── Infos utilisateur ── */}
        <div className="bulle-navbar-header">
          <div className="bulle-navbar-username">jean_dupont</div>
          <div className="bulle-navbar-email">jean.dupont@email.com</div>
        </div>

        {/* ── Menu items ── */}
        <div className="bulle-navbar-items">

          {/* <Link to="/profil" className="bulle-navbar-item" onClick={onClose}>
            <span className="bulle-navbar-item-icon">👤</span>
            Mon profil
          </Link>

          <Link to="/parametres" className="bulle-navbar-item" onClick={onClose}>
            <span className="bulle-navbar-item-icon">⚙️</span>
            Paramètres
          </Link>

          <div className="bulle-navbar-divider" /> */}

          <button className="bulle-navbar-item logout" onClick={handleLogout}>
            <span className="bulle-navbar-item-icon">🚪</span>
            Se déconnecter
          </button>

        </div>
      </div>
    </>
  )
}
