import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Boxes, ShoppingCart, Users, Wallet } from 'lucide-react';

const STATUS_COLORS = {
  pending: '#FF9800', processing: '#2196F3',
  shipped: '#9C27B0', delivered: '#4CAF50', cancelled: '#f44336',
};
const STATUS_LABELS = {
  pending: 'En attente', processing: 'Traitement',
  shipped: 'Expédié', delivered: 'Livré', cancelled: 'Annulé',
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/admin/stats')
      .then(r => setStats(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const cards = [
    { label: 'Utilisateurs', value: stats.totalUsers, icon: Users, color: '#2196F3' },
    { label: 'Produits', value: stats.totalProducts, icon: Boxes, color: '#9C27B0' },
    { label: 'Commandes', value: stats.totalOrders, icon: ShoppingCart, color: '#FF9800' },
    { label: 'Revenus', value: `${stats.revenue?.toFixed(2)} €`, icon: Wallet, color: '#4CAF50' },
  ];

  return (
    <div>
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>Dashboard</h1>
        <p style={styles.pageSub}>Vue d'ensemble de votre boutique</p>
      </div>

      {/* Stat cards */}
      <div style={styles.statsGrid}>
        {cards.map(c => (
          <div key={c.label} style={{ ...styles.statCard, borderTop: `3px solid ${c.color}` }}>
            <div style={styles.statTop}>
              <span style={styles.statLabel}>{c.label}</span>
              {(() => {
                const Icon = c.icon;
                return (
                  <span style={{ ...styles.statIconBg, background: `${c.color}20`, color: c.color }}>
                    <Icon size={18} aria-hidden="true" />
                  </span>
                );
              })()}
            </div>
            <p style={{ ...styles.statValue, color: c.color }}>{c.value}</p>
          </div>
        ))}
      </div>

      <div style={styles.row}>
        {/* Recent orders */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Commandes récentes</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                {['ID', 'Client', 'Total', 'Statut', 'Date'].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders?.map(o => (
                <tr key={o._id} style={styles.tr}>
                  <td style={styles.td}>#{o._id.slice(-6).toUpperCase()}</td>
                  <td style={styles.td}>{o.user?.name || '—'}</td>
                  <td style={styles.td}>{o.totalPrice?.toFixed(2)} €</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.statusBadge, background: `${STATUS_COLORS[o.status]}22`, color: STATUS_COLORS[o.status] }}>
                      {STATUS_LABELS[o.status]}
                    </span>
                  </td>
                  <td style={styles.td}>{new Date(o.createdAt).toLocaleDateString('fr-FR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Status breakdown */}
        <div style={{ ...styles.section, minWidth: '220px', flex: '0 0 220px' }}>
          <h2 style={styles.sectionTitle}>Par statut</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
            {Object.entries(stats.statusCounts || {}).map(([status, count]) => (
              <div key={status} style={styles.statusRow}>
                <span style={{ ...styles.statusDot, background: STATUS_COLORS[status] }}></span>
                <span style={styles.statusName}>{STATUS_LABELS[status]}</span>
                <span style={{ ...styles.statusCount, color: STATUS_COLORS[status] }}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Loader() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div style={{ width: '36px', height: '36px', border: '3px solid rgba(255,215,0,0.2)', borderTop: '3px solid #FFD700', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
    </div>
  );
}

const styles = {
  pageHeader: { marginBottom: '2rem' },
  pageTitle: { fontSize: '1.8rem', fontFamily: '"Playfair Display", serif', marginBottom: '0.3rem' },
  pageSub: { color: 'var(--text-subtle)', fontSize: '0.9rem' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' },
  statCard: {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: '12px', padding: '1.4rem',
  },
  statTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' },
  statLabel: { color: 'var(--text-subtle)', fontSize: '0.82rem', letterSpacing: '0.05em' },
  statIconBg: { width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  statValue: { fontSize: '2rem', fontWeight: 800 },
  row: { display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-start' },
  section: {
    flex: 1, background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: '12px', padding: '1.5rem', minWidth: '300px',
  },
  sectionTitle: { fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { color: 'var(--text-faint)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', padding: '0.5rem 0.75rem', textAlign: 'left', borderBottom: '1px solid var(--border)' },
  tr: { borderBottom: '1px solid var(--border)' },
  td: { padding: '0.75rem', fontSize: '0.88rem', color: 'var(--text-muted)' },
  statusBadge: { padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 },
  statusRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  statusDot: { width: '10px', height: '10px', borderRadius: '50%', flexShrink: 0 },
  statusName: { flex: 1, color: 'var(--text-muted)', fontSize: '0.88rem' },
  statusCount: { fontWeight: 700, fontSize: '1rem' },
};