import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAdmin } from '../context/AdminContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdminLayout() {
  const { sidebarOpen, setSidebarOpen } = useAdmin();

  return (
    <div style={styles.shell}>
      <Sidebar open={sidebarOpen} />
      <div style={{ ...styles.main, marginLeft: sidebarOpen ? '240px' : '64px' }}>
        {/* Topbar */}
        <header style={styles.topbar}>
          <button onClick={() => setSidebarOpen(o => !o)} style={styles.toggleBtn} title="Toggle sidebar">
            {sidebarOpen ? <ChevronLeft size={20} aria-hidden="true" /> : <ChevronRight size={20} aria-hidden="true" />}
          </button>
          <div style={styles.topbarRight}>
            <span style={styles.badge}>Admin Panel</span>
          </div>
        </header>
        {/* Page content */}
        <main style={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

const styles = {
  shell: { display: 'flex', background: '#0d0d16', minHeight: '100vh', color: '#fff', fontFamily: 'system-ui, sans-serif' },
  main: { flex: 1, transition: 'margin-left 0.25s ease', display: 'flex', flexDirection: 'column', minHeight: '100vh' },
  topbar: {
    height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 1.5rem',
    background: 'rgba(10,10,18,0.95)',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    position: 'sticky', top: 0, zIndex: 50,
  },
  toggleBtn: {
    background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)',
    cursor: 'pointer', padding: '6px', borderRadius: '6px',
  },
  topbarRight: { display: 'flex', alignItems: 'center', gap: '1rem' },
  badge: {
    background: 'rgba(255,215,0,0.15)', color: '#FFD700',
    padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem',
    border: '1px solid rgba(255,215,0,0.3)', letterSpacing: '0.05em',
  },
  content: { padding: '2rem', flex: 1 },
};