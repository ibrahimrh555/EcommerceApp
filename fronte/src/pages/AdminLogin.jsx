import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAdmin } from '../context/AdminContext';

export default function AdminLogin() {
  const { loginAdmin } = useAdmin();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/login', form);
      if (data.role !== 'admin') {
        setError('Accès refusé. Vous n\'êtes pas administrateur.');
        setLoading(false);
        return;
      }
      loginAdmin(data);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.glow}></div>
      <div style={styles.card}>
        <div style={styles.logoRow}>
          <span style={styles.logoIcon}>◆</span>
          <span style={styles.logoText}>LUXE<span style={styles.logoAccent}>ADMIN</span></span>
        </div>
        <h1 style={styles.title}>Connexion Admin</h1>
        <p style={styles.sub}>Accès réservé aux administrateurs</p>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email" required
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="admin@shop.com"
              style={styles.input}
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Mot de passe</label>
            <input
              type="password" required
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              style={styles.input}
            />
          </div>
          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? '...' : 'Accéder au dashboard →'}
          </button>
        </form>

        <div style={styles.demo}>
          <span style={styles.demoLabel}>Compte démo :</span>
          <span style={styles.demoVal}>admin@shop.com</span>
          <span style={styles.demoLabel}>/</span>
          <span style={styles.demoVal}>admin123</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh', background: '#09090f',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'system-ui, sans-serif', position: 'relative', overflow: 'hidden',
  },
  glow: {
    position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
    width: '600px', height: '600px',
    background: 'radial-gradient(circle, rgba(255,215,0,0.06) 0%, transparent 65%)',
    borderRadius: '50%', pointerEvents: 'none',
  },
  card: {
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,215,0,0.2)',
    borderRadius: '16px', padding: '3rem', width: '100%', maxWidth: '420px',
    position: 'relative', zIndex: 1,
  },
  logoRow: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', justifyContent: 'center' },
  logoIcon: { color: '#FFD700', fontSize: '1.2rem' },
  logoText: { color: '#fff', fontFamily: '"Playfair Display", Georgia, serif', fontSize: '1.2rem', fontWeight: 700 },
  logoAccent: { color: '#FFD700' },
  title: { fontSize: '1.5rem', fontFamily: '"Playfair Display", serif', textAlign: 'center', color: '#fff', marginBottom: '0.4rem' },
  sub: { color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem', textAlign: 'center', marginBottom: '2rem' },
  errorBox: {
    background: 'rgba(220,50,50,0.12)', border: '1px solid rgba(220,50,50,0.3)',
    color: '#ff6b6b', padding: '12px 16px', borderRadius: '8px', fontSize: '0.88rem', marginBottom: '1.5rem',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '1.2rem' },
  field: {},
  label: { display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', marginBottom: '6px', letterSpacing: '0.05em' },
  input: {
    width: '100%', padding: '11px 14px',
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px', color: '#fff', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box',
  },
  btn: {
    padding: '13px', background: '#FFD700', color: '#000',
    border: 'none', borderRadius: '8px', fontWeight: 700,
    cursor: 'pointer', fontSize: '0.95rem', marginTop: '0.5rem',
  },
  demo: {
    marginTop: '2rem', display: 'flex', justifyContent: 'center',
    gap: '6px', alignItems: 'center', flexWrap: 'wrap',
  },
  demoLabel: { color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem' },
  demoVal: { color: '#FFD700', fontSize: '0.78rem', fontWeight: 600 },
};