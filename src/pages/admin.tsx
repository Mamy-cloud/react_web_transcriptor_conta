/* ================================================
   admin.tsx — Interface d'administration
   ================================================ */

import { useState } from 'react'
import NavbarAdmin from '../nav/NavbarAdmin'
import '../style/admin.css'
import MenuAdmin, { ADMIN_MENU_ITEMS } from '../nav/menu_admin'
import ListOfInterviewerDisplay from '../components/list_of_interviewer_display'
import ListOfDataCollectedDisplay from '../components/list_of_data_collected_display'

export default function Admin() {
  const [activeMenu, setActiveMenu] = useState('interviewers')

  const currentItem = ADMIN_MENU_ITEMS.find(m => m.id === activeMenu)

  return (
    <>
      <NavbarAdmin />
      <div className="admin-page">

        {/* ── Sidebar ── */}
        <MenuAdmin activeMenu={activeMenu} onSelect={setActiveMenu} />

        {/* ── Contenu principal ── */}
        <main className="admin-content">

          <div className="admin-content-header">
            <h1>{currentItem?.label}</h1>
            <p>{currentItem?.desc}</p>
          </div>

          {/* ── Placeholder — contenu à venir ── */}
          {activeMenu === 'interviewers' && (
            <ListOfInterviewerDisplay />
          )}

          {activeMenu === 'donnees' && (
            <ListOfDataCollectedDisplay />
          )}

        </main>
      </div>
    </>
  )
}
