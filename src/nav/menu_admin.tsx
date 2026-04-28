/* ================================================
   menu_admin.tsx — Menu latéral de l'interface admin
   ================================================ */

interface MenuItem {
  id:    string
  label: string
  icon:  string
  desc:  string
}

export const ADMIN_MENU_ITEMS: MenuItem[] = [
  {
    id:    'interviewers',
    label: 'Identifiants interviewers',
    icon:  '👥',
    desc:  'Liste des comptes interviewers enregistrés',
  },
  {
    id:    'donnees',
    label: 'Données collectées',
    icon:  '🗂️',
    desc:  'Enregistrements audio et transcriptions',
  },
]

interface MenuAdminProps {
  activeMenu: string
  onSelect:   (id: string) => void
}

export default function MenuAdmin({ activeMenu, onSelect }: MenuAdminProps) {
  return (
    <aside className="admin-sidebar">

      {/* ── En-tête ── */}
      <div className="admin-sidebar-header">
        <div className="admin-sidebar-title">Administration</div>
        <div className="admin-sidebar-badge">
          <span>🔐</span> Admin
        </div>
      </div>

      {/* ── Menu ── */}
      <nav className="admin-menu">
        {ADMIN_MENU_ITEMS.map(item => (
          <button
            key={item.id}
            className={`admin-menu-item${activeMenu === item.id ? ' active' : ''}`}
            onClick={() => onSelect(item.id)}
          >
            <span className="admin-menu-dot" />
            <span className="admin-menu-icon">{item.icon}</span>
            <span className="admin-menu-label">{item.label}</span>
          </button>
        ))}
      </nav>

    </aside>
  )
}
