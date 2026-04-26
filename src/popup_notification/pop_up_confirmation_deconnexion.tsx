/* ================================================
   pop_up_confirmation_deconnexion.tsx
   Popup de confirmation avant déconnexion
   ================================================ */

import './pop_up_confirmation_deconnexion.css'

interface PopUpConfirmationDeconnexionProps {
  onConfirm: () => void
  onCancel:  () => void
}

export default function PopUpConfirmationDeconnexion({
  onConfirm,
  onCancel,
}: PopUpConfirmationDeconnexionProps) {
  return (
    <div className="popup-deconnexion-overlay" onClick={onCancel}>
      <div
        className="popup-deconnexion-card"
        onClick={e => e.stopPropagation()}
      >
        <div className="popup-deconnexion-icon">🚪</div>

        <h3 className="popup-deconnexion-title">Se déconnecter ?</h3>

        <p className="popup-deconnexion-desc">
          Vous allez être redirigé vers la page de connexion.
          Vos données restent sauvegardées.
        </p>

        <div className="popup-deconnexion-actions">
          <button className="btn btn-default" onClick={onCancel}>
            Annuler
          </button>
          <button className="btn btn-primary" onClick={onConfirm}>
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  )
}
