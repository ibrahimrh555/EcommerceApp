import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { Boxes, Gem, LayoutDashboard, LogOut, ShoppingCart, Users } from 'lucide-react';

const NAV = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/products', icon: Boxes, label: 'Produits' },
  { to: '/admin/orders', icon: ShoppingCart, label: 'Commandes' },
  { to: '/admin/users', icon: Users, label: 'Utilisateurs' },
];

export default function Sidebar({ open }) {
  const { admin, logoutAdmin } = useAdmin();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAdmin();
    navigate('/login');
  };

  return (
    <aside style={{ ...styles.sidebar, width: open ? '240px' : '64px' }}>
      {/* Logo */}
      <div style={styles.logo}>
        <Gem size={18} color="#FFD700" aria-hidden="true" />
        {open && <span style={styles.logoText}>LUXE<span style={styles.logoAccent}>ADMIN</span></span>}
      </div>

      {/* Nav */}
      <nav style={styles.nav}>
        {NAV.map(item => {
          const Icon = item.icon;
          return (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              ...styles.navItem,
              ...(isActive ? styles.navActive : {}),
            })}
          >
            <span style={styles.navIcon}><Icon size={18} aria-hidden="true" /></span>
            {open && <span style={styles.navLabel}>{item.label}</span>}
          </NavLink>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={styles.bottom}>
        {open && (
          <div style={styles.adminInfo}>
            <div style={styles.avatar}>{admin?.name?.[0]?.toUpperCase()}</div>
            <div>
              <p style={styles.adminName}>{admin?.name}</p>
              <p style={styles.adminRole}>Administrateur</p>
            </div>
          </div>
        )}
        <button onClick={handleLogout} style={styles.logoutBtn} title="Déconnexion">
          <LogOut size={18} aria-hidden="true" />
          {open && <span style={{ marginLeft: '8px', fontSize: '0.85rem' }}>Déconnexion</span>}
        </button>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 100,
    background: '#0a0a12',
    borderRight: '1px solid rgba(255,215,0,0.12)',
    display: 'flex', flexDirection: 'column',
    transition: 'width 0.25s ease',
    overflow: 'hidden',
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '1.5rem 1rem 1.5rem 1.2rem',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    minHeight: '64px',
    whiteSpace: 'nowrap',
  },
  logoIcon: { color: '#FFD700', fontSize: '1.2rem', flexShrink: 0 },
  logoText: { color: '#fff', fontFamily: '"Playfair Display", Georgia, serif', fontSize: '1rem', fontWeight: 700, letterSpacing: '0.05em' },
  logoAccent: { color: '#FFD700' },
  nav: { flex: 1, padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '2px' },
  navItem: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '0.7rem 1.2rem', textDecoration: 'none',
    color: 'rgba(255,255,255,0.45)', borderRadius: '0',
    transition: 'all 0.15s', whiteSpace: 'nowrap',
    borderLeft: '3px solid transparent',
  },
  navActive: {
    color: '#FFD700',
    background: 'rgba(255,215,0,0.08)',
    borderLeft: '3px solid #FFD700',
  },
  navIcon: { fontSize: '1.1rem', flexShrink: 0, width: '20px', textAlign: 'center' },
  navLabel: { fontSize: '0.9rem', fontWeight: 500 },
  bottom: {
    padding: '1rem',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    display: 'flex', flexDirection: 'column', gap: '0.75rem',
  },
  adminInfo: { display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' },
  avatar: {
    width: '32px', height: '32px', borderRadius: '50%',
    background: 'rgba(255,215,0,0.2)', border: '1px solid rgba(255,215,0,0.4)',
    color: '#FFD700', fontWeight: 700, fontSize: '0.85rem',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  adminName: { color: '#fff', fontSize: '0.82rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  adminRole: { color: 'rgba(255,215,0,0.6)', fontSize: '0.72rem' },
  logoutBtn: {
    display: 'flex', alignItems: 'center',
    background: 'rgba(255,50,50,0.08)', border: '1px solid rgba(255,50,50,0.2)',
    color: 'rgba(255,100,100,0.8)', borderRadius: '6px',
    padding: '8px 12px', cursor: 'pointer', width: '100%', whiteSpace: 'nowrap',
  },
};