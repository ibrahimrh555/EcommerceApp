import React, { useEffect, useState } from 'react';
import { useAdmin } from '../context/AdminContext';

const CATEGORIES = ['Electronics', 'Fashion', 'Home & Kitchen', 'Sports', 'Other'];

const EMPTY_FORM = { name: '', description: '', price: '', category: 'Electronics', image: '', stock: '' };

export default function Products() {
  const { products, fetchProducts, createProduct, updateProduct, deleteProduct, loading } = useAdmin();
  const [modal, setModal] = useState(null); // null | 'create' | 'edit'
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => { fetchProducts(); }, []);

  const flash = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 3000);
  };

  const openCreate = () => { setForm(EMPTY_FORM); setEditId(null); setModal('create'); };
  const openEdit = (p) => {
    setForm({ name: p.name, description: p.description, price: p.price, category: p.category, image: p.image, stock: p.stock });
    setEditId(p._id);
    setModal('edit');
  };
  const closeModal = () => { setModal(null); setForm(EMPTY_FORM); setEditId(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock) };
      if (modal === 'create') {
        await createProduct(body);
        flash('Produit créé avec succès !');
      } else {
        await updateProduct(editId, body);
        flash('Produit mis à jour !');
      }
      closeModal();
    } catch {
      flash('Erreur lors de la sauvegarde.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      flash('Produit supprimé.');
      setConfirmDel(null);
    } catch {
      flash('Erreur suppression.', 'error');
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.page}>
      {/* Flash */}
      {msg && (
        <div style={{ ...styles.flash, background: msg.type === 'error' ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)', borderColor: msg.type === 'error' ? '#ef4444' : '#22c55e', color: msg.type === 'error' ? '#ef4444' : '#22c55e' }}>
          {msg.text}
        </div>
      )}

      {/* Header */}
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>Produits</h1>
          <p style={styles.pageSubtitle}>{products.length} produit{products.length !== 1 ? 's' : ''} au total</p>
        </div>
        <button onClick={openCreate} style={styles.btnPrimary}>+ Nouveau produit</button>
      </div>

      {/* Search */}
      <div style={styles.toolbar}>
        <input
          type="text" placeholder="Rechercher un produit..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {/* Table */}
      <div style={styles.tableWrap}>
        {loading && products.length === 0 ? (
          <div style={styles.loadingBox}><div style={styles.spinner}></div></div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                {['Image', 'Nom', 'Catégorie', 'Prix', 'Stock', 'Note', 'Actions'].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p._id} style={styles.tr}>
                  <td style={styles.td}>
                    <img src={p.image} alt={p.name} style={styles.thumb} />
                  </td>
                  <td style={styles.td}>
                    <span style={styles.productName}>{p.name}</span>
                    <span style={styles.productDesc}>{p.description?.slice(0, 50)}…</span>
                  </td>
                  <td style={styles.td}><span style={styles.catBadge}>{p.category}</span></td>
                  <td style={styles.td}><span style={styles.price}>{p.price?.toFixed(2)} €</span></td>
                  <td style={styles.td}>
                    <span style={{ ...styles.stockBadge, color: p.stock > 0 ? '#22c55e' : '#ef4444', background: p.stock > 0 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)' }}>
                      {p.stock}
                    </span>
                  </td>
                  <td style={styles.td}><span style={styles.rating}>★ {p.rating?.toFixed(1)}</span></td>
                  <td style={styles.td}>
                    <div style={styles.actions}>
                      <button onClick={() => openEdit(p)} style={styles.btnEdit}>Modifier</button>
                      <button onClick={() => setConfirmDel(p)} style={styles.btnDel}>Suppr.</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Product Modal */}
      {modal && (
        <div style={styles.overlay} onClick={closeModal}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>{modal === 'create' ? 'Nouveau produit' : 'Modifier le produit'}</h2>
              <button onClick={closeModal} style={styles.closeBtn}>✕</button>
            </div>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGrid}>
                {[
                  { key: 'name', label: 'Nom', type: 'text', required: true },
                  { key: 'price', label: 'Prix (€)', type: 'number', required: true, step: '0.01', min: '0' },
                  { key: 'stock', label: 'Stock', type: 'number', required: true, min: '0' },
                  { key: 'image', label: 'URL Image', type: 'url' },
                ].map(({ key, label, ...props }) => (
                  <div key={key} style={styles.field}>
                    <label style={styles.label}>{label}</label>
                    <input
                      value={form[key]}
                      onChange={e => setForm({ ...form, [key]: e.target.value })}
                      style={styles.input}
                      placeholder={label}
                      {...props}
                    />
                  </div>
                ))}
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Catégorie</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={styles.select}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  style={{ ...styles.input, ...styles.textarea }}
                  placeholder="Description du produit..."
                  rows={3}
                  required
                />
              </div>

              {form.image && (
                <div style={styles.previewWrap}>
                  <img src={form.image} alt="preview" style={styles.preview} onError={e => e.target.style.display = 'none'} />
                </div>
              )}

              <div style={styles.modalFooter}>
                <button type="button" onClick={closeModal} style={styles.btnSecondary}>Annuler</button>
                <button type="submit" disabled={saving} style={styles.btnPrimary}>
                  {saving ? 'Sauvegarde...' : modal === 'create' ? 'Créer' : 'Mettre à jour'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {confirmDel && (
        <div style={styles.overlay} onClick={() => setConfirmDel(null)}>
          <div style={{ ...styles.modal, maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Confirmer la suppression</h2>
            <p style={styles.confirmText}>Supprimer <strong style={{ color: '#fff' }}>{confirmDel.name}</strong> ? Cette action est irréversible.</p>
            <div style={styles.modalFooter}>
              <button onClick={() => setConfirmDel(null)} style={styles.btnSecondary}>Annuler</button>
              <button onClick={() => handleDelete(confirmDel._id)} style={styles.btnDanger}>Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { fontFamily: '"DM Sans", system-ui, sans-serif', position: 'relative' },
  flash: { padding: '10px 16px', borderRadius: '8px', border: '1px solid', marginBottom: '1rem', fontSize: '0.88rem', fontWeight: 600 },
  pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' },
  pageTitle: { fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: '4px' },
  pageSubtitle: { color: 'rgba(255,255,255,0.35)', fontSize: '0.88rem' },
  toolbar: { marginBottom: '1.25rem' },
  searchInput: { padding: '9px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.88rem', outline: 'none', width: '280px' },
  tableWrap: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', overflow: 'hidden' },
  loadingBox: { display: 'flex', justifyContent: 'center', padding: '3rem' },
  spinner: { width: '28px', height: '28px', border: '3px solid rgba(124,92,252,0.2)', borderTop: '3px solid #7c5cfc', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', fontWeight: 600, padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', textTransform: 'uppercase', letterSpacing: '0.07em' },
  tr: { borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.1s' },
  td: { padding: '12px 16px', fontSize: '0.87rem', color: 'rgba(255,255,255,0.7)', verticalAlign: 'middle' },
  thumb: { width: '44px', height: '44px', objectFit: 'cover', borderRadius: '8px' },
  productName: { display: 'block', color: '#fff', fontWeight: 600, marginBottom: '2px', fontSize: '0.87rem' },
  productDesc: { display: 'block', color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem' },
  catBadge: { padding: '3px 10px', background: 'rgba(124,92,252,0.15)', color: '#a78bfa', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 },
  price: { color: '#7c5cfc', fontWeight: 700 },
  stockBadge: { padding: '3px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600 },
  rating: { color: '#f59e0b', fontSize: '0.82rem', fontWeight: 600 },
  actions: { display: 'flex', gap: '6px' },
  btnPrimary: { padding: '9px 18px', background: '#7c5cfc', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem' },
  btnSecondary: { padding: '9px 18px', background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem' },
  btnEdit: { padding: '5px 12px', background: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 },
  btnDel: { padding: '5px 12px', background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 },
  btnDanger: { padding: '9px 18px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' },
  modal: { background: '#13131f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '580px', maxHeight: '90vh', overflow: 'auto' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  modalTitle: { fontSize: '1.1rem', fontWeight: 800, color: '#fff' },
  closeBtn: { background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '1.1rem', padding: '4px' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  field: {},
  label: { display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.07em' },
  input: { width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' },
  select: { width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none' },
  textarea: { resize: 'vertical', fontFamily: 'inherit' },
  previewWrap: { display: 'flex', justifyContent: 'center' },
  preview: { width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' },
  modalFooter: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '0.5rem' },
  confirmText: { color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem', lineHeight: 1.6, margin: '1rem 0 1.5rem' },
};