import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../style/navbar.css'
import '../style/bulle_navbar.css'
import logoConta2 from '../assets/img/accueil/app_icon.png'
import '../style/Accueil.css'
import BulleNavbar from './bulle_navbar'

export default function Navbar() {
  const location        = useLocation()
  const [open, setOpen] = useState(false)

  const links = [
    { to: '/travail',       label: 'Interface de travail', icon: '🗂️' },
    { to: '/transcription', label: 'Transcription',        icon: '🎙️' },
  ]

  return (
    <nav className="appnav">
      <div className="appnav-inner">

        {/* Logo */}
        <Link to="/" className="appnav-logo">
          <img src={logoConta2} alt="Logo Conta 2" className="accueil-logo-icon" />
          <span className="appnav-logo-name">conta</span>
        </Link>

        {/* Nav Links */}
        <div className="appnav-links">
          {links.map(({ to, label, icon }) => {
            const isActive = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={`appnav-link${isActive ? ' active' : ''}`}
              >
                <span className="appnav-link-dot" />
                <span className="appnav-link-icon">{icon}</span>
                <span>{label}</span>
              </Link>
            )
          })}
        </div>

        {/* Right Actions */}
        <div className="appnav-actions">
          <div className="appnav-avatar-wrapper">
            <div
              className={`appnav-avatar${open ? ' open' : ''}`}
              title="Mon compte"
              onClick={() => setOpen(prev => !prev)}
            >
              U
            </div>

            {open && <BulleNavbar onClose={() => setOpen(false)} />}
          </div>
        </div>

      </div>
    </nav>
  )
}
