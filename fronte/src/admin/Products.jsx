import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pencil, Trash2 } from 'lucide-react';

const EMPTY = { name: '', description: '', price: '', category: '', image: '', stock: '' };
const CATEGORIES = ['Electronics', 'Fashion', 'Home & Kitchen', 'Sports'];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'create' | 'edit'
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const fetch = async () => {
    setLoading(true);
    const { data } = await axios.get('/api/admin/products');
    setProducts(data);
    setLoading(false);
  };
  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setForm(EMPTY); setEditId(null); setModal('form'); };
  const openEdit = (p) => { setForm({ name: p.name, description: p.description, price: p.price, category: p.category, image: p.image, stock: p.stock }); setEditId(p._id); setModal('form'); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const body = { ...form, price: Number(form.price), stock: Number(form.stock) };
      if (editId) {
        await axios.put(`/api/admin/products/${editId}`, body);
        setMsg({ type: 'ok', text: 'Produit mis à jour !' });
      } else {
        await axios.post('/api/admin/products', body);
        setMsg({ type: 'ok', text: 'Produit créé !' });
      }
      setModal(null);
      fetch();
    } catch (err) {
      setMsg({ type: 'err', text: err.response?.data?.message || 'Erreur' });
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(null), 3000);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Supprimer "${name}" ?`)) return;
    try {
      await axios.delete(`/api/admin/products/${id}`);
      setMsg({ type: 'ok', text: 'Produit supprimé' });
      fetch();
    } catch {
      setMsg({ type: 'err', text: 'Erreur lors de la suppression' });
    }
    setTimeout(() => setMsg(null), 3000);
  };

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Produits</h1>
          <p style={styles.pageSub}>{products.length} produit{products.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openCreate} style={styles.btnPrimary}>+ Nouveau produit</button>
      </div>

      {msg && <div style={{ ...styles.alert, ...(msg.type === 'ok' ? styles.alertOk : styles.alertErr) }}>{msg.text}</div>}

      {loading ? <Loader /> : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>{['Image', 'Nom', 'Catégorie', 'Prix', 'Stock', 'Note', 'Actions'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id} style={styles.tr}>
                  <td style={styles.td}><img src={p.image} alt={p.name} style={styles.thumb} /></td>
                  <td style={styles.td}><span style={styles.productName}>{p.name}</span></td>
                  <td style={styles.td}><span style={styles.catBadge}>{p.category}</span></td>
                  <td style={styles.td}><span style={styles.price}>{p.price.toFixed(2)} €</span></td>
                  <td style={styles.td}>
                    <span style={{ ...styles.stock, color: p.stock > 5 ? '#4CAF50' : p.stock > 0 ? '#FF9800' : '#f44336' }}>
                      {p.stock}
                    </span>
                  </td>
                  <td style={styles.td}><span style={styles.rating}>★ {p.rating?.toFixed(1)}</span></td>
                  <td style={styles.td}>
                    <div style={styles.actions}>
                      <button onClick={() => openEdit(p)} style={styles.btnEdit}><Pencil size={14} style={styles.inlineIcon} aria-hidden="true" />Modifier</button>
                      <button onClick={() => handleDelete(p._id, p.name)} style={styles.btnDelete}><Trash2 size={14} style={styles.inlineIcon} aria-hidden="true" />Supprimer</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modal === 'form' && (
        <div style={styles.overlay} onClick={() => setModal(null)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>{editId ? 'Modifier le produit' : 'Nouveau produit'}</h2>
            <div style={styles.formGrid}>
              {[['name', 'Nom'], ['price', 'Prix (€)'], ['stock', 'Stock'], ['image', 'URL Image']].map(([key, label]) => (
                <div key={key} style={styles.field}>
                  <label style={styles.label}>{label}</label>
                  <input
                    type={['price','stock'].includes(key) ? 'number' : 'text'}
                    value={form[key]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    style={styles.input}
                  />
                </div>
              ))}
              <div style={styles.field}>
                <label style={styles.label}>Catégorie</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={styles.input}>
                  <option value="">-- Choisir --</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                rows={3} style={{ ...styles.input, resize: 'vertical' }}
              />
            </div>
            {form.image && <img src={form.image} alt="" style={styles.previewImg} />}
            <div style={styles.modalActions}>
              <button onClick={() => setModal(null)} style={styles.btnCancel}>Annuler</button>
              <button onClick={handleSave} disabled={saving} style={styles.btnPrimary}>
                {saving ? 'Sauvegarde...' : editId ? 'Enregistrer' : 'Créer'}
              </button>
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
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' },
  pageTitle: { fontSize: '1.8rem', fontFamily: '"Playfair Display", serif' },
  pageSub: { color: 'var(--text-subtle)', fontSize: '0.85rem', marginTop: '0.2rem' },
  btnPrimary: { padding: '10px 20px', background: '#FFD700', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' },
  alert: { padding: '12px 16px', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' },
  alertOk: { background: 'rgba(76,175,80,0.15)', border: '1px solid rgba(76,175,80,0.3)', color: '#4CAF50' },
  alertErr: { background: 'rgba(220,50,50,0.12)', border: '1px solid rgba(220,50,50,0.3)', color: '#ff6b6b' },
  tableWrap: { background: 'var(--surface-3)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '1rem', color: 'var(--text-faint)', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'left', borderBottom: '1px solid var(--border)', background: 'var(--surface-3)' },
  tr: { borderBottom: '1px solid var(--border)', transition: 'background 0.15s' },
  td: { padding: '0.9rem 1rem', fontSize: '0.88rem', color: 'var(--text-muted)' },
  thumb: { width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px' },
  productName: { fontWeight: 600, color: 'var(--text)' },
  catBadge: { background: 'rgba(255,215,0,0.1)', color: '#FFD700', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem' },
  price: { color: '#FFD700', fontWeight: 700 },
  stock: { fontWeight: 700 },
  rating: { color: '#FF9800', fontSize: '0.85rem' },
  actions: { display: 'flex', gap: '6px', flexWrap: 'wrap' },
  inlineIcon: { marginRight: '6px', verticalAlign: 'middle' },
  btnEdit: { padding: '5px 12px', background: 'rgba(33,150,243,0.15)', border: '1px solid rgba(33,150,243,0.3)', color: '#64b5f6', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' },
  btnDelete: { padding: '5px 12px', background: 'rgba(220,50,50,0.12)', border: '1px solid rgba(220,50,50,0.25)', color: '#ff6b6b', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' },
  modal: { background: 'var(--image-bg)', border: '1px solid rgba(255,215,0,0.2)', borderRadius: '14px', padding: '2rem', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' },
  modalTitle: { fontSize: '1.2rem', fontFamily: '"Playfair Display", serif', marginBottom: '1.5rem' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' },
  field: { marginBottom: '1rem' },
  label: { display: 'block', color: 'var(--text-subtle)', fontSize: '0.8rem', marginBottom: '5px' },
  input: { width: '100%', padding: '9px 12px', background: 'var(--surface-2)', border: '1px solid var(--border-2)', borderRadius: '7px', color: 'var(--text)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' },
  previewImg: { width: '100%', maxHeight: '150px', objectFit: 'contain', borderRadius: '8px', background: '#1a1a2e', marginBottom: '1rem' },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' },
  btnCancel: { padding: '10px 20px', background: 'transparent', border: '1px solid var(--border-2)', color: 'var(--text-subtle)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' },
};