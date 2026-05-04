import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAdmin } from '../context/AdminContext';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [msg, setMsg] = useState(null);
  const { admin } = useAdmin();

  const fetch = async () => {
    setLoading(true);
    const { data } = await axios.get('/api/admin/users');
    setUsers(data);
    setLoading(false);
  };
  useEffect(() => { fetch(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Supprimer l'utilisateur "${name}" ?`)) return;
    try {
      await axios.delete(`/api/admin/users/${id}`);
      setMsg({ type: 'ok', text: 'Utilisateur supprimé' });
      fetch();
    } catch (err) {
      setMsg({ type: 'err', text: err.response?.data?.message || 'Erreur' });
    }
    setTimeout(() => setMsg(null), 3000);
  };

  const handleRoleToggle = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Changer le rôle vers "${newRole}" ?`)) return;
    try {
      await axios.put(`/api/admin/users/${id}/role`, { role: newRole });
      setMsg({ type: 'ok', text: 'Rôle mis à jour' });
      fetch();
    } catch (err) {
      setMsg({ type: 'err', text: err.response?.data?.message || 'Erreur' });
    }
    setTimeout(() => setMsg(null), 3000);
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const adminsCount = users.filter(u => u.role === 'admin').length;
  const usersCount = users.filter(u => u.role === 'user').length;

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Utilisateurs</h1>
          <p style={styles.pageSub}>{users.length} utilisateur{users.length !== 1 ? 's' : ''} — {adminsCount} admin{adminsCount !== 1 ? 's' : ''}, {usersCount} client{usersCount !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {msg && <div style={{ ...styles.alert, ...(msg.type === 'ok' ? styles.alertOk : styles.alertErr) }}>{msg.text}</div>}

      {/* Search */}
      <div style={styles.searchWrap}>
        <input
          type="text"
          placeholder="🔍  Rechercher par nom ou email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {loading ? <Loader /> : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>{['Avatar', 'Nom', 'Email', 'Rôle', 'Inscrit le', 'Actions'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u._id} style={styles.tr}>
                  <td style={styles.td}>
                    <div style={{ ...styles.avatar, background: u.role === 'admin' ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.08)', color: u.role === 'admin' ? '#FFD700' : 'rgba(255,255,255,0.5)' }}>
                      {u.name[0].toUpperCase()}
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.userName}>{u.name}</span>
                    {u._id === admin?._id && <span style={styles.youBadge}> (vous)</span>}
                  </td>
                  <td style={styles.td}><span style={styles.email}>{u.email}</span></td>
                  <td style={styles.td}>
                    <span style={{ ...styles.roleBadge, ...(u.role === 'admin' ? styles.roleAdmin : styles.roleUser) }}>
                      {u.role === 'admin' ? '⭐ Admin' : '👤 Client'}
                    </span>
                  </td>
                  <td style={styles.td}>{new Date(u.createdAt).toLocaleDateString('fr-FR')}</td>
                  <td style={styles.td}>
                    <div style={styles.actions}>
                      {u._id !== admin?._id && (
                        <>
                          <button onClick={() => handleRoleToggle(u._id, u.role)} style={styles.btnRole}>
                            {u.role === 'admin' ? '↓ Rétrograder' : '↑ Promouvoir'}
                          </button>
                          <button onClick={() => handleDelete(u._id, u.name)} style={styles.btnDelete}>🗑 Supprimer</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ ...styles.td, textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.25)' }}>Aucun utilisateur trouvé</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Loader() {
  return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><div style={{ width: '36px', height: '36px', border: '3px solid rgba(255,215,0,0.2)', borderTop: '3px solid #FFD700', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div></div>;
}

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' },
  pageTitle: { fontSize: '1.8rem', fontFamily: '"Playfair Display", serif' },
  pageSub: { color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '0.2rem' },
  alert: { padding: '12px 16px', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' },
  alertOk: { background: 'rgba(76,175,80,0.15)', border: '1px solid rgba(76,175,80,0.3)', color: '#4CAF50' },
  alertErr: { background: 'rgba(220,50,50,0.12)', border: '1px solid rgba(220,50,50,0.3)', color: '#ff6b6b' },
  searchWrap: { marginBottom: '1.5rem' },
  searchInput: { width: '100%', maxWidth: '400px', padding: '10px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' },
  tableWrap: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', overflow: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: '640px' },
  th: { padding: '1rem', color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' },
  tr: { borderBottom: '1px solid rgba(255,255,255,0.05)' },
  td: { padding: '0.9rem 1rem', fontSize: '0.88rem', color: 'rgba(255,255,255,0.75)', verticalAlign: 'middle' },
  avatar: { width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem' },
  userName: { fontWeight: 600, color: '#fff' },
  youBadge: { color: '#FFD700', fontSize: '0.75rem' },
  email: { color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' },
  roleBadge: { padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 },
  roleAdmin: { background: 'rgba(255,215,0,0.15)', color: '#FFD700', border: '1px solid rgba(255,215,0,0.3)' },
  roleUser: { background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.12)' },
  actions: { display: 'flex', gap: '6px', flexWrap: 'wrap' },
  btnRole: { padding: '5px 12px', background: 'rgba(33,150,243,0.12)', border: '1px solid rgba(33,150,243,0.3)', color: '#64b5f6', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem' },
  btnDelete: { padding: '5px 12px', background: 'rgba(220,50,50,0.12)', border: '1px solid rgba(220,50,50,0.25)', color: '#ff6b6b', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem' },
};