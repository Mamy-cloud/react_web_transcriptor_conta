/* ================================================
   display_password.tsx
   Hook + composant icône œil pour afficher/masquer
   les champs mot de passe.
   ================================================

   Utilisation :
     const { visible, toggle, inputType } = useDisplayPassword()
     <input type={inputType} ... />
     <PasswordEyeBtn visible={visible} onToggle={toggle} />
*/

import { useState } from 'react'

/* ── Hook ── */
export function useDisplayPassword() {
  const [visible, setVisible] = useState(false)

  return {
    visible,
    toggle:    () => setVisible(v => !v),
    inputType: visible ? 'text' : 'password',
  }
}

/* ── Composant bouton œil ── */
interface PasswordEyeBtnProps {
  visible:  boolean
  onToggle: () => void
}

export function PasswordEyeBtn({ visible, onToggle }: PasswordEyeBtnProps) {
  return (
    <button
      type="button"
      className="password-eye-btn"
      onClick={onToggle}
      tabIndex={-1}
      aria-label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
    >
      {visible ? (
        /* Œil barré — mot de passe visible */
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
      ) : (
        /* Œil ouvert — mot de passe masqué */
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )}
    </button>
  )
}
