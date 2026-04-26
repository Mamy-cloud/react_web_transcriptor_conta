import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../style/bulle_navbar.css'
import { API, apiFetch } from '../api_url/api_config'
import PopUpConfirmationDeconnexion from '../popup_notification/pop_up_confirmation_deconnexion'

interface BulleNavbarProps {
  onClose: () => void
}

interface UserSession {
  identifiant: string
  email:       string
}

export default function BulleNavbar({ onClose }: BulleNavbarProps) {
  const navigate = useNavigate()
  const [showConfirm, setShowConfirm] = useState(false)
  const [user, setUser] = useState<UserSession>({ identifiant: '…', email: '…' })

  /* ── Récupère les infos session depuis les cookies HttpOnly ── */
  useEffect(() => {
    apiFetch(API.SESSION)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setUser({
            identifiant: data.identifiant ?? '',
            email:       data.email       ?? '',
          })
        }
      })
      .catch(() => {
        // session expirée ou non connecté
      })
  }, [])

  /* ── Déconnexion ── */
  const handleLogout = async () => {
    try {
      await apiFetch(API.LOGOUT, { method: 'POST' })
    } catch {
      // même en cas d'erreur réseau, on redirige
    } finally {
      onClose()
      navigate('/connexion')
    }
  }

  return (
    <>
      {/* Overlay transparent — ferme la bulle au clic extérieur */}
      <div className="bulle-navbar-overlay" onClick={onClose} />

      <div className="bulle-navbar">

        {/* ── Infos utilisateur ── */}
        <div className="bulle-navbar-header">
          <div className="bulle-navbar-username">{user.identifiant}</div>
          <div className="bulle-navbar-email">{user.email}</div>
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

          <button
            className="bulle-navbar-item logout"
            onClick={() => setShowConfirm(true)}
          >
            <span className="bulle-navbar-item-icon">🚪</span>
            Se déconnecter
          </button>

        </div>
      </div>

      {/* ── Popup confirmation ── */}
      {showConfirm && (
        <PopUpConfirmationDeconnexion
          onConfirm={handleLogout}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  )
}
