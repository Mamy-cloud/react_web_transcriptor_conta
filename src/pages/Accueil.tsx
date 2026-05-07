import { Link } from 'react-router-dom'
import '../style/Accueil.css'
import logoConta from '../assets/img/accueil/logo_conta.jpeg'
import logoConta2 from '../assets/img/accueil/app_icon.png'

const APP_DOWNLOAD_URL = 'https://bxkpufaustfmqcuseput.supabase.co/storage/v1/object/public/bucket_app/collect_audio_V053.zip'

export default function Accueil() {
  return (
    <>
      {/* ── Navbar ── */}
      <nav className="navbar">
        <div className="container accueil-nav-inner">
          <Link to="/" className="accueil-logo">
            <img src={logoConta2} alt="Logo Conta 2" className="accueil-logo-icon" />
            <span className="accueil-logo-name">conta</span>
          </Link>

          <div className="accueil-nav-actions">
            <Link to="/connexion" className="btn btn-ghost btn-sm">
              Se connecter
            </Link>
            <Link to="/inscription" className="btn btn-default btn-sm">
              S'inscrire
            </Link>
            <a
              href={APP_DOWNLOAD_URL}
              download="collect_audio_V050.zip"
              className="btn btn-primary btn-sm"
            >
              Télécharger l'application
            </a>
          </div>
        </div>
      </nav>

      {/* ── Main ── */}
      <main className="accueil-main">

        {/* ── Hero ── */}
        <section className="accueil-hero">
          <div className="accueil-hero-glow" />

          <div className="container accueil-hero-container">
            <div className="accueil-hero-content">
              <img src={logoConta} alt="Logo Conta" className="accueil-hero-badge-img" />

              <h1 className="accueil-hero-title">
                Préservez les voix de{' '}
                <span className="accueil-hero-title-brand">la Corse</span>
              </h1>

              <p className="accueil-hero-description">
                Conta enregistre les témoignages, histoires et traditions orales corses,
                puis les transcrit automatiquement en plusieurs langues —
                pour que chaque voix traverse le temps.
              </p>
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="accueil-features">
          <div className="container">
            <div className="accueil-features-header">
              <h2>Tout ce dont vous avez besoin</h2>
              <p>Une plateforme pensée pour la préservation du patrimoine culturel.</p>
            </div>

            <div className="accueil-features-grid">
              {features.map((f, i) => (
                <div key={i} className="card accueil-feature-card">
                  <div className="accueil-feature-icon">{f.icon}</div>
                  <div>
                    <h4 className="accueil-feature-title">{f.title}</h4>
                    <p className="accueil-feature-description">{f.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="accueil-footer">
          <div className="container accueil-footer-inner">
            <span className="accueil-footer-copy">
              © {new Date().getFullYear()} Conta. Tous droits réservés.
            </span>
            <div className="accueil-footer-links">
              {['Mentions légales', 'Confidentialité', 'Contact'].map(l => (
                <Link key={l} to="#" className="accueil-footer-link">
                  {l}
                </Link>
              ))}
            </div>
          </div>
        </footer>

      </main>
    </>
  )
}

const features = [
  {
    icon: '🎙️',
    title: 'Enregistrement audio',
    description: "Capturez des témoignages directement depuis l'application, en haute qualité, même sans connexion.",
  },
  {
    icon: '🌍',
    title: 'Transcription multilingue',
    description: 'Convertissez automatiquement les témoignages en texte — en corse, français, anglais et plus encore.',
  },
  {
    icon: '🏛️',
    title: 'Archivage patrimonial',
    description: 'Organisez, classez et partagez les témoignages dans une bibliothèque structurée et pérenne.',
  },
  {
    icon: '🔍',
    title: 'Recherche intelligente',
    description: "Retrouvez n'importe quel témoignage par mot-clé, locuteur, date ou thématique.",
  },
]
