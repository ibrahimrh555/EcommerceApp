import React, { useEffect, useState } from 'react';
import axios from 'axios';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const STATUS_COLORS = { pending: '#FF9800', processing: '#2196F3', shipped: '#9C27B0', delivered: '#4CAF50', cancelled: '#f44336' };
const STATUS_LABELS = { pending: 'En attente', processing: 'Traitement', shipped: 'Expédié', delivered: 'Livré', cancelled: 'Annulé' };

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [msg, setMsg] = useState(null);

  const fetch = async () => {
    setLoading(true);
    const { data } = await axios.get('/api/admin/orders');
    setOrders(data);
    setLoading(false);
  };
  useEffect(() => { fetch(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/api/admin/orders/${id}`, { status });
      setMsg({ type: 'ok', text: 'Statut mis à jour !' });
      fetch();
      if (selected?._id === id) setSelected(s => ({ ...s, status }));
    } catch {
      setMsg({ type: 'err', text: 'Erreur de mise à jour' });
    }
    setTimeout(() => setMsg(null), 3000);
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Commandes</h1>
          <p style={styles.pageSub}>{orders.length} commande{orders.length !== 1 ? 's' : ''} au total</p>
        </div>
      </div>

      {msg && <div style={{ ...styles.alert, ...(msg.type === 'ok' ? styles.alertOk : styles.alertErr) }}>{msg.text}</div>}

      {/* Filter tabs */}
      <div style={styles.tabs}>
        <button onClick={() => setFilter('all')} style={{ ...styles.tab, ...(filter === 'all' ? styles.tabActive : {}) }}>Toutes ({orders.length})</button>
        {STATUSES.map(s => {
          const count = orders.filter(o => o.status === s).length;
          return (
            <button key={s} onClick={() => setFilter(s)} style={{ ...styles.tab, ...(filter === s ? { ...styles.tabActive, color: STATUS_COLORS[s], borderColor: STATUS_COLORS[s] } : {}) }}>
              {STATUS_LABELS[s]} ({count})
            </button>
          );
        })}
      </div>

      {loading ? <Loader /> : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>{['ID', 'Client', 'Articles', 'Total', 'Statut', 'Date', 'Action'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o._id} style={styles.tr}>
                  <td style={styles.td}><button onClick={() => setSelected(o)} style={styles.idBtn}>#{o._id.slice(-8).toUpperCase()}</button></td>
                  <td style={styles.td}>{o.user?.name || '—'}<br /><span style={styles.email}>{o.user?.email}</span></td>
                  <td style={styles.td}>{o.items?.reduce((a, i) => a + i.quantity, 0)} article{o.items?.reduce((a, i) => a + i.quantity, 0) > 1 ? 's' : ''}</td>
                  <td style={styles.td}><span style={styles.price}>{o.totalPrice?.toFixed(2)} €</span></td>
                  <td style={styles.td}>
                    <span style={{ ...styles.statusBadge, background: `${STATUS_COLORS[o.status]}22`, color: STATUS_COLORS[o.status] }}>
                      {STATUS_LABELS[o.status]}
                    </span>
                  </td>
                  <td style={styles.td}>{new Date(o.createdAt).toLocaleDateString('fr-FR')}</td>
                  <td style={styles.td}>
                    <select
                      value={o.status}
                      onChange={e => updateStatus(o._id, e.target.value)}
                      style={styles.select}
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} style={{ ...styles.td, textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.25)' }}>Aucune commande</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Order detail modal */}
      {selected && (
        <div style={styles.overlay} onClick={() => setSelected(null)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Commande #{selected._id.slice(-8).toUpperCase()}</h2>
              <button onClick={() => setSelected(null)} style={styles.closeBtn}>✕</button>
            </div>
            <div style={styles.modalGrid}>
              <div>
                <p style={styles.detailLabel}>Client</p>
                <p style={styles.detailVal}>{selected.user?.name}</p>
                <p style={styles.detailSub}>{selected.user?.email}</p>
              </div>
              <div>
                <p style={styles.detailLabel}>Adresse</p>
                <p style={styles.detailVal}>{selected.shippingAddress?.street}</p>
                <p style={styles.detailSub}>{selected.shippingAddress?.postalCode} {selected.shippingAddress?.city}, {selected.shippingAddress?.country}</p>
              </div>
            </div>
            <div style={styles.itemsList}>
              {selected.items?.map((item, i) => (
                <div key={i} style={styles.itemRow}>
                  <img src={item.image} alt={item.name} style={styles.itemImg} />
                  <span style={{ flex: 1 }}>{item.name}</span>
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>x{item.quantity}</span>
                  <span style={{ color: '#FFD700', fontWeight: 700 }}>{(item.price * item.quantity).toFixed(2)} €</span>
                </div>
              ))}
            </div>
            <div style={styles.modalFooter}>
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>Total</span>
              <span style={{ color: '#FFD700', fontSize: '1.2rem', fontWeight: 800 }}>{selected.totalPrice?.toFixed(2)} €</span>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <p style={styles.detailLabel}>Changer le statut</p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                {STATUSES.map(s => (
                  <button
                    key={s}
                    onClick={() => updateStatus(selected._id, s)}
                    style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600, background: selected.status === s ? `${STATUS_COLORS[s]}30` : 'rgba(255,255,255,0.05)', border: `1px solid ${selected.status === s ? STATUS_COLORS[s] : 'rgba(255,255,255,0.1)'}`, color: selected.status === s ? STATUS_COLORS[s] : 'rgba(255,255,255,0.4)' }}
                  >
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>
          </div>
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
  tabs: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' },
  tab: { padding: '6px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', color: 'rgba(255,255,255,0.45)', cursor: 'pointer', fontSize: '0.82rem' },
  tabActive: { background: 'rgba(255,215,0,0.1)', border: '1px solid #FFD700', color: '#FFD700' },
  tableWrap: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', overflow: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: '700px' },
  th: { padding: '1rem', color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' },
  tr: { borderBottom: '1px solid rgba(255,255,255,0.05)' },
  td: { padding: '0.9rem 1rem', fontSize: '0.88rem', color: 'rgba(255,255,255,0.75)', verticalAlign: 'middle' },
  idBtn: { background: 'none', border: 'none', color: '#FFD700', cursor: 'pointer', fontWeight: 700, fontSize: '0.88rem', textDecoration: 'underline', padding: 0 },
  email: { color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem' },
  price: { color: '#FFD700', fontWeight: 700 },
  statusBadge: { padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap' },
  select: { padding: '6px 10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '6px', color: '#fff', fontSize: '0.82rem', cursor: 'pointer', outline: 'none' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' },
  modal: { background: '#131320', border: '1px solid rgba(255,215,0,0.2)', borderRadius: '14px', padding: '2rem', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  modalTitle: { fontSize: '1.1rem', fontFamily: '"Playfair Display", serif' },
  closeBtn: { background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '1.2rem', cursor: 'pointer' },
  modalGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' },
  detailLabel: { color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' },
  detailVal: { color: '#fff', fontWeight: 600, fontSize: '0.9rem' },
  detailSub: { color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', marginTop: '2px' },
  itemsList: { display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' },
  itemRow: { display: 'flex', alignItems: 'center', gap: '12px', padding: '0.6rem', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', fontSize: '0.88rem' },
  itemImg: { width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' },
  modalFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderTop: '1px solid rgba(255,255,255,0.08)' },
};