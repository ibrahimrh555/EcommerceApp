import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useAdmin } from '../context/AdminContext';
import toast from 'react-hot-toast';
import { AlertTriangle, Gem } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const { loginAdmin } = useAdmin();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/login', form);

      if (data.role === 'admin') {
        loginAdmin(data);
        toast.success(`Bienvenue Admin, ${data.name} !`);
        navigate('/admin/dashboard');
      } else {
        login(data);
        toast.success(`Bienvenue, ${data.name} !`);
        navigate('/');
      }
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
        {/* Logo */}
        <div style={styles.logoRow}>
          <Gem size={18} color="#FFD700" aria-hidden="true" />
          <span style={styles.logoText}>LUXE<span style={styles.logoAccent}>SHOP</span></span>
        </div>

        <h1 style={styles.title}>Connexion</h1>
        <p style={styles.sub}>Accédez à votre espace personnel ou admin</p>

        {error && (
          <div style={styles.errorBox}>
            <AlertTriangle size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} aria-hidden="true" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="votre@email.com"
              style={styles.input}
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Mot de passe</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              style={styles.input}
            />
          </div>

          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? (
              <span style={styles.btnLoading}>
                <span style={styles.spinner}></span> Connexion...
              </span>
            ) : 'Se connecter →'}
          </button>
        </form>

        <p style={styles.registerRow}>
          Pas encore de compte ?{' '}
          <Link to="/register" style={styles.link}>S'inscrire</Link>
        </p>

        

        
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh', background: 'var(--bg)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'system-ui, sans-serif', padding: '2rem',
    position: 'relative', overflow: 'hidden',
  },
  glow: {
    position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
    width: '700px', height: '700px',
    background: 'radial-gradient(circle, rgba(255,215,0,0.05) 0%, transparent 65%)',
    borderRadius: '50%', pointerEvents: 'none',
  },
  card: {
    background: 'var(--surface)',
    border: '1px solid rgba(255,215,0,0.15)',
    borderRadius: '18px', padding: '2.5rem',
    width: '100%', maxWidth: '440px',
    position: 'relative', zIndex: 1,
  },
  logoRow: {
    display: 'flex', alignItems: 'center', gap: '8px',
    justifyContent: 'center', marginBottom: '1.75rem',
  },
  logoIcon: { color: '#FFD700', fontSize: '1.2rem' },
  logoText: {
    color: 'var(--text)', fontFamily: '"Playfair Display", Georgia, serif',
    fontSize: '1.3rem', fontWeight: 700, letterSpacing: '0.05em',
  },
  logoAccent: { color: '#FFD700' },
  title: {
    fontSize: '1.6rem', fontFamily: '"Playfair Display", serif',
    textAlign: 'center', marginBottom: '0.4rem', color: 'var(--text)',
  },
  sub: {
    color: 'var(--text-faint)', fontSize: '0.85rem',
    textAlign: 'center', marginBottom: '1.75rem',
  },
  errorBox: {
    background: 'rgba(220,50,50,0.1)', border: '1px solid rgba(220,50,50,0.3)',
    color: '#ff6b6b', padding: '12px 14px', borderRadius: '8px',
    fontSize: '0.87rem', marginBottom: '1.25rem',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '1.1rem' },
  field: {},
  label: {
    display: 'block', color: 'var(--text-subtle)',
    fontSize: '0.8rem', marginBottom: '6px', letterSpacing: '0.04em',
  },
  input: {
    width: '100%', padding: '11px 14px',
    background: 'var(--surface-2)',
    border: '1px solid var(--border-2)',
    borderRadius: '8px', color: 'var(--text)',
    fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  btn: {
    padding: '13px', background: '#FFD700', color: '#000',
    border: 'none', borderRadius: '8px', fontWeight: 700,
    cursor: 'pointer', fontSize: '0.95rem', marginTop: '0.4rem',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  btnLoading: { display: 'flex', alignItems: 'center', gap: '8px' },
  spinner: {
    display: 'inline-block', width: '14px', height: '14px',
    border: '2px solid rgba(0,0,0,0.3)', borderTop: '2px solid #000',
    borderRadius: '50%', animation: 'spin 0.7s linear infinite',
  },
  registerRow: {
    textAlign: 'center', color: 'var(--text-subtle)',
    fontSize: '0.88rem', marginTop: '1.25rem',
  },
  link: { color: '#FFD700', textDecoration: 'none', fontWeight: 600 },

  // Role info
  infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1.75rem' },
  infoCard: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '0.85rem', borderRadius: '10px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  infoIcon: { fontSize: '1.3rem', flexShrink: 0 },
  infoRole: { color: '#fff', fontWeight: 700, fontSize: '0.82rem', marginBottom: '2px' },
  infoDesc: { color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem', lineHeight: 1.4 },

  // Demo
  demoSection: {
    marginTop: '1.5rem', padding: '1rem',
    background: 'rgba(255,215,0,0.04)',
    border: '1px solid rgba(255,215,0,0.12)',
    borderRadius: '10px',
  },
  demoTitle: {
    color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem',
    letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem',
  },
  demoGrid: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' },
  demoBtn: {
    display: 'flex', flexDirection: 'column', gap: '2px',
    padding: '8px 14px', background: 'rgba(255,215,0,0.08)',
    border: '1px solid rgba(255,215,0,0.2)',
    borderRadius: '8px', cursor: 'pointer', textAlign: 'left',
    fontSize: '0.78rem', fontWeight: 600,
  },
  demoEmail: { color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem', fontWeight: 400 },
};